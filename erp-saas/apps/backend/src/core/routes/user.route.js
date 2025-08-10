const express = require('express');
const { getProfile, listUsers } = require('../controllers/user.controller');
const authenticateUser = require('../../middlewares/authenticateUser');
const router = express.Router();

router.use(authenticateUser); // require auth
router.get('/me', getProfile);
router.get('/', listUsers); // tenant users

module.exports = router;
