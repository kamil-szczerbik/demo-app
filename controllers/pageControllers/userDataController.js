const jwt = require('jsonwebtoken');
const db = require('../../config/db');

async function getUserData(req, res) {
    const token = req.cookies.session;
    /*if token??? czy try catch ju¿ to za³atwia? Spróbowaæ zasymulowaæ*/
    const decodedToken = tryDecodeToken(token, res);

    const user = await db.user.findOne({
        where: { username: decodedToken.username }
    });

    const copiedUser = JSON.parse(JSON.stringify(user.dataValues));
    /*delete copiedUser['iduser'];*/
    delete copiedUser['password'];
    //delete chyba nie jest dobrym rozwi¹zaniem.

    /*console.log(user.dataValues);
    console.log(copiedUser);*/

    res.status(200).send(copiedUser);
}

function tryDecodeToken(token, res) {
    try {
        return decodeToken(token, res);
    }
    catch (err) {
        res.status(401).send('Coœ posz³o nie tak: ' + err);
    }
}

function decodeToken(token, res) {
    const secret = 'secret';
    return jwt.verify(token, secret /*process.env.JWT_SECRET*/);
}

module.exports = {
    getUserData
};