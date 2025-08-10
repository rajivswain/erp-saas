const express = require('express');
const adminOnly = require('../../middlewares/adminOnly');
const { listTenantUsers, updateUserRole } = require('../controllers/admin.controller');
const { invite } = require('../controllers/invitation.controller');

const router = express.Router();
router.use(adminOnly);

router.get('/users', listTenantUsers);
router.put('/users/role', updateUserRole);
router.post('/invitations/invite', invite);

module.exports = router;
