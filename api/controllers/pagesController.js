//Rejestracja oraz logowanie. Logowanie też autentykuje token, choć to nie jest wymagane raczej, a bezpieczeństwa
//wydaje mi się też nie poprawia :P

const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret = 'secretcode'; //you should keep your secret an actual secret using environment variables or some other method 
//and make sure you DO NOT commit it to version control if you happen to be using git


function register(req, res) {

    if (req.body.id) {
        res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`);
    }
    else {
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
                        const DBerr = [];

                        const p1 = db.user.findAll({
                            where: {
                                email: req.body.email,
                            }
                        }).then((result) => {
                            if (result[0]) {
                                DBerr[0] = 'Adres email jest powiązany z istniejącym już kontem!';
                            }
                        });

                        const p2 = db.user.findAll({
                            where: {
                                username: req.body.username,
                            }
                        }).then((result) => {
                            if (result[0]) {
                                DBerr[1] = 'Podana nazwa użytkownika jest już zajęta!';
                            }
                        });

                        console.log('Coś poszło nie tak: ' + err);
                        Promise.all([p1, p2]).then(() => { res.status(409).send(DBerr); });
                    });


            });
    }
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
    register,
    login
};

/*
res.sendStatus(200); // equivalent to res.status(200).send('OK')
res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')
*/