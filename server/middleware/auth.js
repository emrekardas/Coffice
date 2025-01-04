const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Yetkilendirme token\'ı bulunamadı' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Geçersiz token' });
  }
};

exports.admin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin yetkisi gerekli' });
  }
  next();
}; 