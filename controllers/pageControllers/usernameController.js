const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken');

function getUsername(req, res) {
    const token = req.cookies.session;
    if (!token)
        generateAndSendUsername(res);
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
    /*const secret = 'secret';*/
    const decoded = jwt.verify(token, /*secret*/ process.env.JWT_SECRET);
    res.status(200).send({ username: decoded.username });
}

function generateAndSendUsername(res) {
    tempUsername = 'rnd' + nanoid(6);
    res.status(200).send({ username: tempUsername });
}

module.exports = {
    getUsername
};