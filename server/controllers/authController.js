const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// JWT token oluşturma fonksiyonu
const createToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      username: user.username,
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Kayıt olma
exports.register = async (req, res) => {
  try {
    console.log('Register isteği alındı:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validasyon hataları:', errors.array());
      return res.status(400).json({ 
        status: 'error',
        message: 'Validasyon hataları',
        errors: errors.array() 
      });
    }

    const { username, email, password } = req.body;

    // Email ve username kontrolü
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ 
          status: 'error',
          message: 'Bu email adresi zaten kayıtlı.' 
        });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ 
          status: 'error',
          message: 'Bu kullanıcı adı zaten alınmış.' 
        });
      }
    }

    // İlk kullanıcıyı admin yap
    const isFirstUser = (await User.countDocuments()) === 0;
    console.log('İlk kullanıcı mı?', isFirstUser);

    // Yeni kullanıcı oluşturma
    const user = new User({
      username,
      email,
      password,
      role: isFirstUser ? 'admin' : 'user'
    });

    await user.save();
    console.log('Yeni kullanıcı kaydedildi:', { username, email, role: user.role });

    // Token oluşturma
    const token = createToken(user);

    res.status(201).json({
      status: 'success',
      message: 'Kullanıcı başarıyla oluşturuldu',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Sunucu hatası: ' + error.message 
    });
  }
};

// Giriş yapma
exports.login = async (req, res) => {
  try {
    console.log('Login isteği alındı:', { ...req.body, password: '***' });
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validasyon hataları:', errors.array());
      return res.status(400).json({ 
        status: 'error',
        message: 'Validasyon hataları',
        errors: errors.array() 
      });
    }

    const { login, password } = req.body;

    // Kullanıcı kontrolü
    const user = await User.findOne({
      $or: [
        { email: login.toLowerCase() },
        { username: login }
      ]
    });

    if (!user) {
      console.log('Kullanıcı bulunamadı:', login);
      return res.status(401).json({ 
        status: 'error',
        message: 'Kullanıcı adı/email veya şifre hatalı' 
      });
    }

    // Şifre kontrolü
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      console.log('Şifre hatalı:', login);
      return res.status(401).json({ 
        status: 'error',
        message: 'Kullanıcı adı/email veya şifre hatalı' 
      });
    }

    // Token oluşturma
    const token = createToken(user);
    console.log('Giriş başarılı:', { username: user.username, email: user.email });

    res.json({
      status: 'success',
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Sunucu hatası: ' + error.message 
    });
  }
};

// Kullanıcı bilgilerini getirme
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Kullanıcı bulunamadı' 
      });
    }
    res.json({
      status: 'success',
      user
    });
  } catch (error) {
    console.error('Kullanıcı bilgileri getirme hatası:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Sunucu hatası: ' + error.message 
    });
  }
}; 