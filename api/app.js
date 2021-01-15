//Główny plik serwera. Wywoływane na początku przez server.js
//Inicjuje wszystkie biblioteki.

const express = require('express');
const app = express();
const http = require('http').Server(app);
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const io = require('socket.io')(http);

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

/*-----SOCKET.IO-----*/

const board = require('./controllers/boardsController');
const dices = require('./controllers/gamesControllers/dicesController');

let gameTime;
let timer = 300; //w sekundach

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
                    io.in(room).emit('chatAlert', alert);
                    console.log(socket.username + ' wstał od stołu i opuścił pokój.');

                    if (boardData.started) {
                        io.in(socket.room).emit('stopGame', socket.username);
                        clearInterval(gameTime);
                    }
                }
                else {
                    const alert = socket.username + ' opuścił pokój.';
                    io.in(room).emit('chatAlert', alert);
                    console.log(socket.username + ' opuścił pokój.');
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
                    io.in(room).emit('chatAlert', alert);
                    console.log(newLeader + ' został nowym przywódcą stołu.');
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
                io.in(room).emit('chatAlert', alert);
                console.log(username + ' wstał od stołu i opuścił pokój.');

                if (boardData.started) {
                    io.in(room).emit('stopGame', username);
                    clearInterval(gameTime);
                }
            }
            else {
                const alert = username + ' opuścił pokój.';
                io.in(room).emit('chatAlert', alert);
                console.log(username + ' opuścił pokój.');
            }
                

            if (username === boardData.leader) {
                const playersSockets = io.sockets.adapter.rooms[room].sockets;
                const playersIDs = Object.keys(playersSockets);
                const newLeader = io.sockets.connected[playersIDs[0]].username;

                board.changeLeader(room, newLeader);
                socket.broadcast.emit('updateBoard', newLeader);
                io.in(room).emit('passLeaderPrivileges', newLeader);
                const alert = newLeader + ' został nowym przywódcą stołu.';
                io.in(room).emit('chatAlert', alert);
                console.log(newLeader + ' został nowym przywódcą stołu.');
            }
        }
    });

    socket.on('joinBoard', (room, username) => {
        socket.join(room);
        //Dopisuję do socket dwa pola, które są potrzebne przy socket.on('disconnecting)
        socket.username = username;
        socket.room = room;
        const alert = username + ' dołączył do pokoju.';
        io.in(room).emit('chatAlert', alert);
        console.log(username + ' dołączył do pokoju.');
    });

    socket.on('updateBoardsList', () => {
        const newBoardsList = board.updateBoardsList();
        socket.broadcast.emit('updateBoardsList', newBoardsList);
    });

    socket.on('sitDown', (room, username, seat) => {
        board.addPlayer(room, username, seat);
        io.in(room).emit('sitDown', username, seat);
        const alert = username + ' zajął miejsce przy stole.';
        io.in(room).emit('chatAlert', alert);
        console.log(username + ' zajął miejsce przy stole.');
    });

    socket.on('getUp', (room, username, seat) => {
        board.removePlayer(room, seat);
        io.in(room).emit('getUp', seat);
        const alert = username + ' wstał od stołu.';
        io.in(room).emit('chatAlert', alert);
        console.log(username + ' wstał od stołu.');
    });  

    socket.on('kickPlayer', (room, username, seat) => {
        board.removePlayer(room, seat);
        io.in(room).emit('kickPlayer', seat);
        const alert = username + ' został wyrzucony ze stołu.';
        io.in(room).emit('chatAlert', alert);
        console.log(username + ' został wyrzucony ze stołu.');
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
        io.in(room).emit('chatAlert', alert);
        console.log(newLeader + ' został nowym przywódcą stołu.');
    });

    socket.on('startGame', (room) => {
        const updatedBoard = board.startBoard(room);
        socket.broadcast.emit('updateBoard', updatedBoard);

        const playersNumber = updatedBoard.playersNumber;
        const playersUsernames = updatedBoard.players;
        const roundsNumber = updatedBoard.roundsNumber;
        const data = dices.prepareData(playersNumber, playersUsernames, roundsNumber);
        data.started = updatedBoard.started;

        io.in(room).emit('startGame', data);
        console.log('Gra przy stole ' + room + ' rozpoczęła się');

        timer = 300;

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
        const data = dices.rerollDices(newDicesReroll);
        io.in(room).emit('startGame', data);
    })

    socket.on('setScore', (room, chosenValue) => {
        const data = dices.setScore(chosenValue);
        if (!data.end) {
            io.in(room).emit('startGame', data);
        }
        else {
            if (data.trueEnd) {
                clearInterval(gameTime);
                io.in(room).emit('endGame', data);
            }
            else {
                timer = 300;
                io.in(room).emit('endRound', data);
            }
        }
    });
});

module.exports = http;