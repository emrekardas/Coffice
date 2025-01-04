const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const User = require('../models/User');

// Tüm kullanıcıları getir (Sadece admin)
router.get('/users', auth, checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Kullanıcı rolünü güncelle (Sadece admin)
router.patch('/users/:userId/role', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { role } = req.body;
    const { userId } = req.params;

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Geçersiz rol' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Son admin'i user yapma kontrolü
    if (user.role === 'admin' && role === 'user') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Son admin rolü kaldırılamaz' });
      }
    }

    user.role = role;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router; 