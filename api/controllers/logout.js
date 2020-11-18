//Funkcja nadpisuj¹ca token

const logout = (req, res, next) => {
    res.cookie('token', 'deleted');
    res.sendStatus(200);
}

module.exports = logout;
