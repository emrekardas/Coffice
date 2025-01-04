const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Validation kuralları
const registerValidation = [
  check('email', 'Geçerli bir email adresi giriniz').isEmail(),
  check('password', 'Şifre en az 6 karakter olmalıdır').isLength({ min: 6 }),
  check('name', 'İsim gereklidir').optional()
];

const loginValidation = [
  check('email', 'Geçerli bir email adresi giriniz').isEmail(),
  check('password', 'Şifre gereklidir').exists()
];

// Auth routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/me', auth, authController.getMe);

module.exports = router; 