const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

/*-----SOCKET.IO-----*/

const board = require('./controllers/boardsController');
const dices = require('./controllers/gamesControllers/dicesController');

let gameTime;
let timer; //w sekundach

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('disconnecting', () => {
        if (socket.room !== undefined) { //może być 0
            const boardData = board.giveBoardSocket(socket.room);

            if (io.sockets.adapter.rooms[socket.room].length === 1) {
                board.deleteEmptyBoard(socket.room);

                clearInterval(gameTime);

                const newBoardsList = board.updateBoardsList();
                socket.broadcast.emit('updateBoardsList', newBoardsList);
            }
            else {
                let usernameWasSitting = false;
                let seat;

                for (seat = 0; seat < boardData.playersNumber; seat++) {
                    if (socket.username === boardData.players[seat]) {
                        usernameWasSitting = true;
                        break;
                    }
                }

                if (usernameWasSitting) {
                    board.removePlayer(socket.room, seat);
                    io.in(socket.room).emit('getUp', seat);
                    const alert = socket.username + ' wstał od stołu i opuścił pokój.';
                    io.in(room).emit('chatboxAlert', alert);

                    if (boardData.started) {
                        io.in(socket.room).emit('stopGame', socket.username);
                        clearInterval(gameTime);
                    }
                }
                else {
                    const alert = socket.username + ' opuścił pokój.';
                    io.in(room).emit('chatboxAlert', alert);
                }
                    

                if (socket.username === boardData.leader) {

                    const playersSockets = io.sockets.adapter.rooms[socket.room].sockets;
                    const playersIDs = Object.keys(playersSockets);

                    //disconnecting odbywa się w trakcie wychodzenia, więc w sockecie wciąż siedzi 
                    //username osoby, która wyszła. Trzeba sprawdzić, które jest które, bo to 
                    //zależy od tego, czy ktoś kogoś wcześniej mianował, czy nie.
                    let newLeader;

                    if (io.sockets.connected[playersIDs[0]].username === boardData.leader)
                        newLeader = io.sockets.connected[playersIDs[1]].username; 
                    else
                        newLeader = io.sockets.connected[playersIDs[0]].username;

                    board.changeLeader(socket.room, newLeader);
                    socket.broadcast.emit('updateBoard', newLeader);
                    io.in(socket.room).emit('passLeaderPrivileges', newLeader);
                    const alert = newLeader + ' został nowym przywódcą stołu.';
                    io.in(room).emit('chatboxAlert', alert);
                }
            }
        }
    });

    socket.on('leaveBoard', (room, username) => {
        socket.leave(room);
        delete socket.username;
        delete socket.room;

        if (!io.sockets.adapter.rooms[room]) {
            board.deleteEmptyBoard(room);

            clearInterval(gameTime);

            const newBoardsList = board.updateBoardsList();
            socket.broadcast.emit('updateBoardsList', newBoardsList);
        }
        else {
            const boardData = board.giveBoardSocket(room);
            let usernameWasSitting = false;
            let seat;

            for (seat = 0; seat < boardData.playersNumber; seat++) {
                if (username === boardData.players[seat]) {
                    usernameWasSitting = true;
                    break;
                }
            }

            if (usernameWasSitting) {
                board.removePlayer(room, seat);
                io.in(room).emit('getUp', seat);
                const alert = username + ' wstał od stołu i opuścił pokój.';
                io.in(room).emit('chatboxAlert', alert);

                if (boardData.started) {
                    io.in(room).emit('stopGame', username);
                    clearInterval(gameTime);
                }
            }
            else {
                const alert = username + ' opuścił pokój.';
                io.in(room).emit('chatboxAlert', alert);
            }
                

            if (username === boardData.leader) {
                const playersSockets = io.sockets.adapter.rooms[room].sockets;
                const playersIDs = Object.keys(playersSockets);
                const newLeader = io.sockets.connected[playersIDs[0]].username;

                board.changeLeader(room, newLeader);
                socket.broadcast.emit('updateBoard', newLeader);
                io.in(room).emit('passLeaderPrivileges', newLeader);
                const alert = newLeader + ' został nowym przywódcą stołu.';
                io.in(room).emit('chatboxAlert', alert);
            }
        }
    });

    socket.on('joinBoard', (room, username) => {
        socket.join(room);
        //Dopisuję do socket dwa pola, które są potrzebne przy socket.on('disconnecting)
        socket.username = username;
        socket.room = room;
        const alert = username + ' dołączył do pokoju.';
        io.in(room).emit('chatboxAlert', alert);
    });

    socket.on('updateBoardsList', () => {
        const newBoardsList = board.updateBoardsList();
        socket.broadcast.emit('updateBoardsList', newBoardsList);
    });

    socket.on('sitDown', (room, username, seat) => {
        /*const validationResult =*/ board.addPlayer(room, username, seat);
        /*if (validationResult) {*/
            io.in(room).emit('sitDown', username, seat);
            const alert = username + ' zajął miejsce przy stole.';
            io.in(room).emit('chatboxAlert', alert);
        /*}*/
    });

    socket.on('getUp', (room, username, seat) => {
        board.removePlayer(room, seat);
        io.in(room).emit('getUp', seat);
        const alert = username + ' wstał od stołu.';
        io.in(room).emit('chatboxAlert', alert);
    });  

    socket.on('kickPlayer', (room, username, seat) => {
        board.removePlayer(room, seat);
        io.in(room).emit('kickPlayer', seat);
        const alert = username + ' został wyrzucony ze stołu.';
        io.in(room).emit('chatboxAlert', alert);
    });

    socket.on('changePlayersNumber', (room, newPlayerNumber) => {
        board.changePlayersNumber(room, newPlayerNumber);

        for (let i = newPlayerNumber; i < 4; i++)
            board.removePlayer(room, i); //i === seat

        const testBoard = board.giveBoardSocket(room);

        for (let i = 0; i < 4; i++)
            console.log(testBoard.players[i]);

        io.in(room).emit('changePlayersNumber', newPlayerNumber);
    });

    socket.on('changeRoundsNumber', (room, newRoundsNumber) => {
        board.changeRoundsNumber(room, newRoundsNumber);
        io.in(room).emit('changeRoundsNumber', newRoundsNumber);
    });

    socket.on('changeGameType', (room, newGameType) => {
        const updatedBoard = board.changeGameType(room, newGameType);

        socket.broadcast.emit('updateBoard', updatedBoard);
        io.in(room).emit('changeGameType', newGameType);

        if (newGameType === 'private')
            socket.emit('getPassword', updatedBoard.password);            
    });

    socket.on('passLeaderPrivileges', (room, newLeader) => {
        board.changeLeader(room, newLeader);
        socket.broadcast.emit('updateBoard', newLeader);
        io.in(room).emit('passLeaderPrivileges', newLeader);

        const alert = newLeader + ' został nowym przywódcą stołu.';
        io.in(room).emit('chatboxAlert', alert);
    });

    socket.on('sendChatboxMessage', (room, username, message) => {
        io.in(room).emit('chatboxMessage', username, message);
    });

    socket.on('startGame', (room) => {
        const updatedBoard = board.startBoard(room);
        socket.broadcast.emit('updateBoard', updatedBoard);

        const fistRollData = dices.startNewGame(updatedBoard.playersNumber, updatedBoard.players, updatedBoard.roundsNumber);
        fistRollData.started = updatedBoard.started;

        io.in(room).emit('getNewRollData', fistRollData);
        const alert = 'Gra się rozpoczęła.';
        io.in(room).emit('chatboxAlert', alert);

        timer = 1200;

        gameTime = setInterval(() => {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            remainedTime = minutes + ':' + seconds;

            io.in(room).emit('countDown', remainedTime);

            if (--timer < 0) {
                io.in(room).emit('timeHasEnded');
                clearInterval(gameTime);
            }
        }, 1000);
    });

    socket.on('rerollDices', (room, newDicesReroll) => {
        const rerollData = dices.rerollDices(newDicesReroll);
        io.in(room).emit('getNewRollData', rerollData);
    })

    socket.on('addPoints', (room, pointsIndex) => {
        const endTurnData = dices.endTurn(pointsIndex);

        if (!endTurnData.winnerMessage)
            io.in(room).emit('getNewRollData', endTurnData);
        else if (endTurnData.dices) {
            timer = 12000;
            io.in(room).emit('endRound', endTurnData);
        }
        else {
            clearInterval(gameTime);
            io.in(room).emit('endGame', endTurnData);
        }
    });
});

module.exports = http;