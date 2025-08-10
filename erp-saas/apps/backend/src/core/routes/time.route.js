const express = require('express');
const { create, list } = require('../controllers/time.controller');
const authenticateUser = require('../../middlewares/authenticateUser');
const router = express.Router();

router.use(authenticateUser);
router.post('/', create);
router.get('/', list);

module.exports = router;
