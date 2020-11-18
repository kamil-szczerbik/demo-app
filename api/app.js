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
const crypto = require("crypto");

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

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('updateBoardsList', () => {
        const boards = board.updateBoardsList();
        socket.broadcast.emit('updateBoardsList', boards);
    });

    socket.on('joinBoard', (id, username) => {
        socket.join(id);
        console.log(username + ' dołączył do stołu ' + id);
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
        }
        else {
            const password = crypto.randomBytes(3).toString('hex');
            const private = board.setGameType(room, isPublic, password);
            socket.emit('getPassword', password);
            socket.broadcast.emit('updateBoard', private);
        }
    });

    socket.on('kickOthers', (room) => {
        io.in(room).emit('kickOthers');
    });
});

module.exports = http;