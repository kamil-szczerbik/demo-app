//Baza routów serwera. Przez jak¹ funkcjê ma byæ obs³u¿one zapytanie na dany URL

const express = require('express');
const router = express.Router();
const pagesController = require('../controllers/pagesController');
const board = require('../controllers/boardsController');
const authentication = require('../controllers/authentication');
const logout = require('../controllers/logout');

router.post('/api/register', pagesController.validate('register'), pagesController.register);
router.post('/api/login', pagesController.login);
router.get('/api/logout', logout);

router.get('/api/authenticate', authentication.authentication);
router.get('/api/getUsername', authentication.getUsername);

router.post('/api/newBoard', board.createBoard);
router.get('/api/boardsList', board.giveBoardsList);
router.post('/api/getBoard', board.giveBoard);
router.post('/api/checkPassword', board.checkPassword);
router.post('/api/deleteBoard', board.deleteBoard);

module.exports = router;