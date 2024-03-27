const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.post('/updateUser', userController.updateUser);
router.post('/deleteUser', userController.deleteUser);
router.get('/users', userController.getAllUsers);

module.exports = router;
