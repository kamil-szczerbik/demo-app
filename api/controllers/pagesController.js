//Rejestracja oraz logowanie. Logowanie też autentykuje token, choć to nie jest wymagane raczej, a bezpieczeństwa
//wydaje mi się też nie poprawia :P

const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const secret = 'secretcode'; //you should keep your secret an actual secret using environment variables or some other method 
//and make sure you DO NOT commit it to version control if you happen to be using git

//Funkcja zajmująca się walidacją. Kilka uwag:
//checkfalsy jest ustawiony na true, bo "pusty" formularz nie jest tak naprawdę pusty. Ponieważ korzystamy z Reacta oraz Controlled Inputs to input w formularzu ma "", a nie undefined.
//bail służy do ignorowania kolejnych elementów łańcucha (coś jak break).
//Jeśli chodzi o sprawdzanie czy username lub email już jest w bazie, to musimy sprawdzać value.length. FindAll zawsze zwróci tablicę, a sprawdzenie if(value) zwróci zawsze true (bo tabela istnieje, tylko jest pusta).
//Wyrażenie regularne do sprawdzenia hasła są z internetu, nie wiem czy są idealne/czy można lepiej.
function validate(method) {
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
                    .custom(value => {
                        return db.user.findAll({
                            where: {
                                email: value,
                            }
                        }).then(value => {
                            if (value.length) {
                                return Promise.reject('Podany email powiązany jest już z innym kontem');
                            }
                        });
                    }),
                body('username')
                    .exists({ checkFalsy: true }).withMessage('Nie podano nazwy użytkownika')
                    .bail()
                    .isLength({ min: 4, max: 14 }).withMessage('Nazwa użytkownika musi mieć od 4 do 14 znaków')
                    .bail()
                    .custom(value => {
                        return db.user.findAll({
                            where: {
                                username: value,
                            }
                        }).then(value => {
                            if (value.length) {
                                return Promise.reject('Podana nazwa użytkownika powiązana jest już z innym kontem');
                            }
                        });
                    }),
                body('password')
                    .exists({ checkFalsy: true }).withMessage('Nie podano hasła')
                    .bail()
                    .isLength({ min: 8, max: 30}).withMessage('Hasło musi się składać z przynajmniej 8 znaków')
                    .bail()
                    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/).withMessage('Hasło musi zawierać małą i wielką literę oraz cyfrę'),
                body('passwordConfirmation')
                    .exists({ checkFalsy: true }).withMessage('Potwierdź hasło')
                    .bail()
                    .custom((value, { req }) => value === req.body.password).withMessage('Podane hasła nie są takie same')
            ]
        }
    }
}

function register(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.mapped() });
    }
        const newUser = db.user.build(req.body);

        bcrypt.hash(newUser.password, 10)
            .then((hash) => {
                console.log(hash);
                newUser.password = hash;

                newUser.save()
                    .then(() => {
                        console.log('Pomyślnie dodano użytkownika: ' + req.body.username);
                        res.sendStatus(201);
                    })
                    .catch((err) => {
                        console.log('Coś poszło nie tak: ' + err);
                    });
            });
}

async function login(req, res) {
    const un = req.body.username;
    const pw = req.body.password;
    let user;


    try {
        user = await db.user.findOne({
            where: {
                username: un
            }
        });
    }
    catch (err) {
        res.status(500);
        console.log('Something went wrong!' + err);
    }

    if (!user) {
        res.status(401).send('Podana nazwa użytkownika lub hasło jest błędne!');
    }
    else {
        try {
            const result = await bcrypt.compare(pw, user.password);

            if (result) {
                //TOKEN
                const payload = { un };
                const token = jwt.sign(payload, secret, {
                    expiresIn: '7 days' //to nie jest ważność ciasteczka!
                });
                res.cookie('token', token, { httpOnly: true, maxAge: 604800000 })
                    .sendStatus(200);
            }
            else {
                res.status(401).send('Podana nazwa użytkownika lub hasło jest błędne!');
            }
        }
        catch (err) {
            res.status(500);
            console.log('Something went wrong!' + err);
        }
    }
}

module.exports = {
    validate,
    register,
    login
};

/*
res.sendStatus(200); // equivalent to res.status(200).send('OK')
res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')
*/