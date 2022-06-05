const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);

router
  .route('/api/v1/users')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/api/v1/users/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser);

module.exports = router;
