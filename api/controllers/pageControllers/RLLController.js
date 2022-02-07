//Rejestracja oraz logowanie. Logowanie też autentykuje token, choć to nie jest wymagane raczej, a bezpieczeństwa
//wydaje mi się też nie poprawia :P

const db = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const secret = 'secretcode'; //you should keep your secret an actual secret using environment variables or some other method 
//and make sure you DO NOT commit it to version control if you happen to be using git

function validate(method) {
/*
    1. Metoda validate jest wywoływana w routes.js.
    2. checkFalsy jest ustawiony na true, bo "pusty" formularz u klienta ma '', a nie undefined.
    3. bail służy do ignorowania kolejnych elementów łańcucha (coś jak break).
    4. Jeśli chodzi o sprawdzanie czy username lub email już jest w bazie, to musimy sprawdzać value.length. 
       FindAll zawsze zwróci tablicę, a sprawdzenie if(value) zwróci zawsze true (bo tabela istnieje, tylko jest pusta).
    5. Wyrażenie regularne do sprawdzenia hasła są z internetu, nie wiem czy są idealne/czy można lepiej.
*/
    switch (method) {
        case 'register': {
            return [
                body('id')
                    .not().exists({ checkFalsy: true }).withMessage('ID jest przydzielane automatycznie przez bazę danych'),
                body('email')
                    .exists({ checkFalsy: true }).withMessage('Nie podano adresu email')
                    .bail()
                    .isEmail().withMessage('To nie jest adres email')
                    .bail()
                    .custom(value => checkEmailInDB(value)),
                body('username')
                    .exists({ checkFalsy: true }).withMessage('Nie podano nazwy użytkownika')
                    .bail()
                    .isLength({ min: 4, max: 14 }).withMessage('Nazwa użytkownika musi mieć od 4 do 14 znaków')
                    .bail()
                    .custom(value => checkUsernameInDB(value)),
                body('password')
                    .exists({ checkFalsy: true }).withMessage('Nie podano hasła')
                    .bail()
                    .isLength({ min: 8, max: 30 }).withMessage('Hasło musi się składać z przynajmniej 8 znaków')
                    .bail()
                    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/).withMessage('Hasło musi zawierać małą i wielką literę oraz cyfrę'),
                body('passwordConfirmation')
                    .exists({ checkFalsy: true }).withMessage('Potwierdź hasło')
                    .bail()
                    .custom((value, { req }) => value === req.body.password).withMessage('Podane hasła nie są takie same')
            ];
        }
        case 'login': {
            return [
                body('username')
                    .exists({ checkFalsy: true }).withMessage('Nie podano nazwy użytkownika'),
                body('password')
                    .exists({ checkFalsy: true }).withMessage('Nie podano hasła')
            ];
        }
    }
}

async function checkEmailInDB(value) {
    //try?
    const email = await db.user.findAll({
        where: { email: value }
    });

    if (email.length)
        return Promise.reject('Podany email powiązany jest już z innym kontem');
}

async function checkUsernameInDB(value) {
    //try?
    const username = await db.user.findAll({
        where: { username: value }
    });

    if (username.length)
        return Promise.reject('Podana nazwa użytkownika powiązana jest już z innym kontem');
}

function register(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty())
        res.status(400).json({ errors: errors.mapped() });
    else
        tryAddNewUser(req, res);
}

function tryAddNewUser(req, res) {
    try {
        addNewUser(req, res);
    }
    catch (err) {
        console.log('Coś poszło nie tak: ' + err);
    }
}

async function addNewUser(req, res) {
    const newUser = db.user.build(req.body);
    const hash = await bcrypt.hash(newUser.password, 10);

    newUser.password = hash;
    await newUser.save();

    console.log('Pomyślnie dodano użytkownika: ' + req.body.username);
    res.sendStatus(201);
}

async function login(req, res) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty())
        res.status(400).json({ errors: errors.mapped() });
    else
        validateWithDB(req, res);
}

async function validateWithDB(req, res) {
    const user = await findUserInDB(req);
    const error = {
        errors: {
            password: { msg: 'Podana nazwa użytkownika lub hasło jest błędne!' }   
        }
    }

    if (user) {
        const comparisonResult = await bcrypt.compare(req.body.password, user.password);
        if (comparisonResult)
            tryLoginUser(req, res);
        else 
            res.status(401).send(error);
    }
    else
        res.status(401).send(error);
}

async function findUserInDB(req) {
    const user = await db.user.findOne({
        where: { username: req.body.username }
    });

    if (!user)
        return false;
    else
        return user
}

function tryLoginUser(req, res) {
    try {
        loginUser(req, res);
    }
    catch (err) {
        console.log('Coś poszło nie tak: ' + err);
    }
}

function loginUser(req, res) {
    let un = req.body.username;

    //TOKEN
    const payload = { un };
    const token = jwt.sign(payload, secret/*process.env.RLL_SECRET*/, {
        expiresIn: '7 days' //to nie jest ważność ciasteczka!

    });

    res.cookie('token', token, { httpOnly: true, maxAge: 604800000 }).sendStatus(200);
}

function logout(req, res) {
    res.cookie('token', 'deleted');
    res.sendStatus(200);
}

module.exports = {
    validate,
    register,
    login,
    logout
};