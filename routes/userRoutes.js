const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const { protect } = require('../middlewares/protect');
const { restrictTo } = require('../middlewares/restrictTo');
const { getMe } = require('../middlewares/getMe');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// ---------------------------------
// Protect all routes after this middleware
router.use(protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// ---------------------------------
router.use(restrictTo('admin'));

router.route('/').get(userController.getAllUsers);

module.exports = router;
