const User = require('../models/User');

// Rol kontrolü middleware'i
const checkRole = (roles) => async (req, res, next) => {
  try {
    const user = await User.findOne({ firebaseUID: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (roles.includes(user.role)) {
      req.mongoUser = user; // MongoDB kullanıcı bilgilerini request'e ekle
      next();
    } else {
      res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

module.exports = checkRole; 