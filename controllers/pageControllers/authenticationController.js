const jwt = require('jsonwebtoken');

function authenticateUser(req, res) {
    const token = req.cookies.session;

    if (!token)
        res.status(401).send('U¿ytkownik nieuwierzytelniony');
    else 
        tryDecodeToken(token, res);
}

function tryDecodeToken(token, res) {
    try {
        decodeToken(token, res);
    }
    catch (err) {
        res.status(401).send('Coœ posz³o nie tak: ' + err);
    }
}

function decodeToken(token, res) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.cookie('username', decoded.username, { secure: true})
       .sendStatus(200);
}

module.exports = {
    authenticateUser
};