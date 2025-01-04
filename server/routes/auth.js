const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// Validation kuralları
const registerValidation = [
  check('email', 'Geçerli bir email adresi giriniz').isEmail(),
  check('password', 'Şifre en az 6 karakter olmalıdır').isLength({ min: 6 })
];

const loginValidation = [
  check('email', 'Geçerli bir email adresi giriniz').isEmail(),
  check('password', 'Şifre gereklidir').exists()
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/me', auth, authController.getMe);

// Firebase kullanıcısını MongoDB'ye kaydet/güncelle
router.post('/sync-user', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;

    // Kullanıcıyı bul veya oluştur
    let user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      // İlk kullanıcıyı admin yap
      const isFirstUser = (await User.countDocuments({})) === 0;
      
      user = new User({
        firebaseUID: uid,
        email,
        name: displayName || email.split('@')[0],
        profileImage: photoURL,
        role: isFirstUser ? 'admin' : 'user'
      });
    } else {
      // Mevcut kullanıcıyı güncelle
      user.email = email;
      user.name = displayName || email.split('@')[0];
      user.profileImage = photoURL;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('User sync error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 