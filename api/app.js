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

io.on('connection', (socket) => {
    console.log('a user connected');

    /*console.log(io.sockets.adapter.rooms);*/

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('disconnecting', ()=> {
        const room = Object.keys(socket.rooms);
        room.pop();

        if (room[0]) {
            io.in(room[0]).emit('userLeft', socket.username);
            console.log(socket.username + ' opuścił stół ' + room[0]);

            if (io.sockets.adapter.rooms[0].length === 1) {
                board.deleteInactiveBoard(0);
                const boards = board.updateBoardsList();
                socket.broadcast.emit('updateBoardsList', boards);
            }
        }            
    });

    socket.on('updateBoardsList', () => {
        const boards = board.updateBoardsList();
        socket.broadcast.emit('updateBoardsList', boards);
    });

    socket.on('joinBoard', (id, username) => {
        socket.join(id);
        socket.username = username;
        console.log(username + ' dołączył do stołu ' + id);
    });

    socket.on('leaveBoard', (id, username) => {
        socket.leave(id);
        io.in(id).emit('userLeft', username);
        console.log(username + ' opuścił stół ' + id);

        if (!io.sockets.adapter.rooms[id]) {
            board.deleteInactiveBoard(id);
            const boards = board.updateBoardsList();
            socket.broadcast.emit('updateBoardsList', boards);
        }
    });

    socket.on('take-a-seat', (username, room, seat) => {
        board.addPlayer(username, room, seat);
        io.in(room).emit('take-a-seat', username, seat);
        console.log(username + ' zajął miejsce');
    });

    socket.on('getUp', (username, room, seat) => {
        board.removePlayer(room, seat);
        io.in(room).emit('getUp', seat);
        console.log(username + ' wstał od stołu');
    });

    socket.on('handover', (room, newPlayer) => {
        const newCreator = board.changeCreator(room, newPlayer);
        socket.broadcast.emit('updateBoard', newCreator);
        io.in(room).emit('handover', newPlayer);
        console.log(newPlayer + ' został nowym przywódcą stołu');
    });

    //trzeba walidację tu jeszcze zrobić

    socket.on('changePlayersNumber', (room, newPlayerNumber) => {
        board.changePlayersNumber(room, newPlayerNumber);

        for (let i = 0; i < parseInt(newPlayerNumber); i++) {
            board.removePlayer(room, i); //i === seat
        }

        io.in(room).emit('changePlayersNumber', parseInt(newPlayerNumber));
    });

    socket.on('startGame', (room) => {
        const updatedBoard = board.startBoard(room);
        socket.broadcast.emit('updateBoard', updatedBoard);

        playersNumber = updatedBoard.playersNumber;
        playersUsernames = updatedBoard.players;
        const data = dices.prepareData(playersNumber, playersUsernames);
        io.in(room).emit('startGame', data);
        console.log('Gra przy stole ' + room + ' rozpoczęła się');
    });

    socket.on('rerollDices', (room, newDicesReroll) => {
        const data = dices.rerollDices(newDicesReroll);
        io.in(room).emit('startGame', data);
    })

    socket.on('setScore', (room, chosenValue) => {
        const data = dices.setScore(chosenValue);
        if (data.dices)
            io.in(room).emit('startGame', data);
        else
            io.in(room).emit('endGame', data);
    });

    socket.on('setGameType', (room, isPublic) => {
        if (isPublic) {
            const public = board.setGameType(room, isPublic);
            socket.broadcast.emit('updateBoard', public);
            io.in(room).emit('setGameType', public.type);
        }
        else {
            const private = board.setGameType(room, isPublic);
            socket.emit('getPassword', private.password);
            socket.broadcast.emit('updateBoard', private);
            io.in(room).emit('setGameType', private.type);
        }
    });

    socket.on('kickOthers', (room) => {
        io.in(room).emit('kickOthers');
    });
});

module.exports = http;