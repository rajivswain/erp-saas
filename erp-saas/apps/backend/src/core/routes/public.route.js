const express = require('express');
const { accept } = require('../controllers/invitation.controller');
const router = express.Router();

router.post('/signup', accept);

module.exports = router;
