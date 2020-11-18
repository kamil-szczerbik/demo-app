//Funkcja autentykuj¹ca token

const jwt = require('jsonwebtoken');
const secret = 'secretcode';

const authentication = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).send('Unathorized: No token provided');
    }
    else {
        try {
            const decoded = jwt.verify(token, secret);
            res.status(200).send({
                username: decoded.un
            });
        }
        catch {
            res.status(401).send('Unathorized: Invalid token');
        }
    }
}

module.exports = authentication;