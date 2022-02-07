const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken');

function authenticateUser(req, res) {
    const token = req.cookies.token;

    if (!token)
        res.status(401).send('U¿ytkownik nieuwierzytelniony');
    else 
        tryDecodeToken(token, res);
}

function getUsername(req, res) {
    const token = req.cookies.token;
    if (!token)
        generateAndSendUsername(res);
    else
        tryDecodeToken(token, res, true);
        
}

function tryDecodeToken(token, res, gettingUsername) {
    try {
        decodeToken(token, res);
    }
    catch (err) {
        if (gettingUsername)
            generateAndSendUsername(res);
        else
            res.status(401).send('Coœ posz³o nie tak: ' + err);
    }
}

function decodeToken(token, res) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).send({
        username: decoded.un
    });
}

function generateAndSendUsername(res) {
    tempUsername = 'rnd' + nanoid(6);
    res.status(200).send({ username: tempUsername });
}

module.exports = {
    authenticateUser,
    getUsername
};