const router = require('express').Router();
const usersConroller = require('../controllers/users');

router.get('/', usersConroller.getUsers);

router.get('/:user_id', usersConroller.getUserById);

router.get('/me', usersConroller.getUserById);

router.patch('/me', usersConroller.updateUser);

router.patch('/me/avatar', usersConroller.updateAvatar);

module.exports = router;
