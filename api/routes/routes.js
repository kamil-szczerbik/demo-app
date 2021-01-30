const express = require('express');
const router = express.Router();
const RLLController = require('../controllers/pageControllers/RLLController');
const board = require('../controllers/boardsController');
const authenticationController = require('../controllers/pageControllers/authenticationController');

router.post('/api/register', RLLController.validate('register'), RLLController.register);
router.post('/api/login', RLLController.validate('login'), RLLController.login);
router.get('/api/logout', RLLController.logout);

router.get('/api/authenticate', authenticationController.authenticateUser);
router.get('/api/getUsername', authenticationController.getUsername);

router.post('/api/newBoard', board.createBoard);
router.get('/api/boardsList', board.giveBoardsList);
router.post('/api/getBoard', board.giveBoard);
router.post('/api/checkPassword', board.checkPassword);

module.exports = router;