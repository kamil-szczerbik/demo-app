//Funkcja autentykująca token

const jwt = require('jsonwebtoken');
const secret = 'secretcode';

const authentication = (req, res) => {
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

//Funkcja zwracająca username. W przypadku pomyślnej autentykacji wiadomo, w przeciwnym razie będzie losowo generowany.

const getUsername = (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(200).send({ username: '#RND001' });
    }
    else {
        try {
            const decoded = jwt.verify(token, secret);
            res.status(200).send({
                username: decoded.un
            });
        }
        catch {
            res.status(200).send({ username: '#RND001' });
        }
    }
}


module.exports = {
    authentication,
    getUsername
};