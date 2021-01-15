const crypto = require("crypto");

const boards = [];

function createBoard(req, res) {
    const newPassword = generatePassword()
    const index = findFirstAvailableIndex();
    
    const newBoard = {
        id: index,
        leader: req.body.leader,
        started: false,
        type: 'private',
        password: newPassword,
        playersNumber: 2,
        players: [],
        roundsNumber: 1
    };

    boards[index] = newBoard;
    res.status(200).send(newBoard);
}

function findFirstAvailableIndex() {
    let i = 0;

    while (boards[i])
        i++;

    return i;
}

function deleteEmptyBoard(room) {
    if (room === boards.length - 1) {
        boards.pop();
        checkPreviousIndexes();
    }
    else
        boards[room] = undefined;
}

function checkPreviousIndexes() {
    let i = boards.length;
    while (!boards[--i] && i >= 0)
        boards.pop();
}

function giveBoardsList(req, res) {
    res.status(200).send(boards);
}

function updateBoardsList() {
    return boards;
}

function giveBoard(req, res) {
    res.status(200).send(boards[req.body.id]);
}

function giveBoardSocket(room) {
    return boards[room];
}

function changePlayersNumber(room, newPlayersNumber) {
    boards[room].playersNumber = newPlayersNumber;
}

function changeRoundsNumber(room, newRoundsNumber) {
    boards[room].roundsNumber = newRoundsNumber;
}

function changeGameType(room, newGameType) {
    boards[room].type = newGameType;

    if (newGameType === 'public')
        boards[room].password = undefined;
    else
        boards[room].password = generatePassword();

    return boards[room];
}

function changeLeader(room, newLeader) {
    boards[room].leader = newLeader;
    return boards[room];
}

function addPlayer(room, username, seat) {
    boards[room].players[seat] = username;
}

function removePlayer(room, seat) {
    boards[room].players[seat] = undefined; //puste miejsce w tabeli jest undefined
}

function startBoard(room) {
    boards[room].started = true;
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
    deleteEmptyBoard,

    giveBoardsList,
    updateBoardsList,
    giveBoard,
    giveBoardSocket,

    changePlayersNumber,
    changeRoundsNumber,
    changeGameType,
    changeLeader,

    addPlayer,
    removePlayer,

    startBoard,

    checkPassword
};