const boards = [];

/*let boardId = '#';*/

function createBoard(req, res) {
    /*boardId = i*/
/*    boardId = i.toString();
    boardId = boardId.padStart(4, '#00'); //dzięki temu będzie szło: #000 #001 #002 ... #078 ...*/

    let i = 0;

    while (boards[i])
        i++;

    const newBoard = {
        id: i,
        creator: req.body.creator,
        started: false,
        type: 'private',
        password: undefined,
        playersNumber: 2,
        players: []
    };

    boards[i] = newBoard;
    res.status(200).send(newBoard);
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
    }
    else {
        boards[room].type = 'private';
        boards[room].password = password;
    }
    console.log(boards[room].type);
    return boards[room];
}

function checkPassword(req, res) {
    if (req.body.password === boards[req.body.id].password)
        res.sendStatus(200);
    else
        res.status(401).send('Podane hasło jest błędne');
}

module.exports = {
    createBoard,
    giveBoardsList,
    giveBoard,
    updateBoardsList,
    changePlayersNumber,
    addPlayer,
    removePlayer,
    startBoard,
    setGameType,
    checkPassword
};