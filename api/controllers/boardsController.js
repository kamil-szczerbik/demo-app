const crypto = require("crypto");

const boards = [];

/*let boardId = '#';*/

function createBoard(req, res) {
    /*boardId = i*/
/*    boardId = i.toString();
    boardId = boardId.padStart(4, '#00'); //dzięki temu będzie szło: #000 #001 #002 ... #078 ...*/

    let i = 0;
    const newPassword = generatePassword()
    while (boards[i])
        i++;

    const newBoard = {
        id: i,
        creator: req.body.creator,
        started: false,
        type: 'private',
        password: newPassword,
        playersNumber: 2,
        players: []
    };

    boards[i] = newBoard;
    res.status(200).send(newBoard);
}

function deleteBoard(req, res) {
    if (req.body.id === boards.length - 1) {
        console.log('usuwam z końca tablicy');

        boards.pop();
        let i = boards.length;
        while (!boards[--i] && i >= 0)
            boards.pop();
    }
        
    else {
        console.log('zmieniam na undefined');
        boards[req.body.id] = undefined;
    }
    res.sendStatus(200);
} 

function deleteInactiveBoard(id) {
    if (id === boards.length - 1) {
        console.log('usuwam z końca tablicy');

        boards.pop();
        let i = boards.length;
        while (!boards[--i] && i >= 0)
            boards.pop();
    }

    else {
        console.log('zmieniam na undefined');
        boards[id] = undefined;
    }
}

function giveBoardsList(req, res) {
    res.status(200).send(boards);
}

function giveBoard(req, res) {
    res.status(200).send(boards[req.body.id]);
}

function updateBoardsList() {
    return boards;
}

function changePlayersNumber(room, newPlayersNumber) {
    boards[room].playersNumber = newPlayersNumber;
}

function changeCreator(room, newCreator) {
    boards[room].creator = newCreator;
    return boards[room];
}

function addPlayer(username, room, seat) {
    boards[room].players[seat] = username;
}

function removePlayer(room, seat) {
    boards[room].players[seat] = undefined; //puste miejsce w tabeli jest undefined
}

function startBoard(room) {
    boards[room].started = true;
    return boards[room];
}

function setGameType(room, isPublic, password) {
    if (isPublic) {
        boards[room].type = 'public';
        boards[room].password = undefined;
    }
    else {
        boards[room].type = 'private';
        boards[room].password = generatePassword();
    }
    console.log(boards[room].type);
    return boards[room];
}

function generatePassword() {
    return crypto.randomBytes(3).toString('hex');
}

function checkPassword(req, res) {
    if (req.body.password === boards[req.body.id].password)
        res.sendStatus(200);
    else
        res.status(401).send('Podane hasło jest błędne');
}

module.exports = {
    createBoard,
    deleteBoard,
    deleteInactiveBoard,
    giveBoardsList,
    giveBoard,
    updateBoardsList,
    changePlayersNumber,
    changeCreator,
    addPlayer,
    removePlayer,
    startBoard,
    setGameType,
    checkPassword
};