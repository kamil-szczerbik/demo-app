const express = require('express');
const router = express.Router();
const path = require('path');
const RLLController = require('../controllers/pageControllers/RLLController');
const authenticationController = require('../controllers/pageControllers/authenticationController');
const usernameController = require('../controllers/pageControllers/usernameController');
const board = require('../controllers/boardsController');

router.post('/api/register', RLLController.validate('register'), RLLController.register);
router.post('/api/login', RLLController.validate('login'), RLLController.login);
router.get('/api/logout', RLLController.logout);

router.get('/api/authenticate', authenticationController.authenticateUser);

router.get('/api/getUsername', usernameController.getUsername);

router.post('/api/newBoard', board.createBoard);
router.get('/api/boardsList', board.giveBoardsList);
router.post('/api/getBoard', board.giveBoard);
router.post('/api/checkPassword', board.checkPassword);

router.get('/api/test', (req, res) => {
    res.send('test');
});

router.get('/api/test2', (req, res) => {
    res.send(process.env.TEST);
});

router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});

module.exports = router;