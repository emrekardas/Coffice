const bcrypt = require('bcryptjs');
const { mongoose } = require('../mongo');
const User = require('../models/User');
require('dotenv').config();

async function createAdminUser() {
  try {
    const email = 'eekardas@gmail.com';
    const password = 'your_password_here'; // İstediğiniz şifreyi buraya yazın

    // Mongoose bağlantısını bekle
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Kullanıcı var mı kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Bu email adresi zaten kayıtlı!');
      process.exit(1);
    }

    // Yeni admin kullanıcısı oluştur
    const user = new User({
      email,
      password, // Model içindeki pre-save middleware şifreyi otomatik hash'leyecek
      name: email.split('@')[0],
      role: 'admin'
    });

    await user.save();
    console.log('Admin kullanıcısı başarıyla oluşturuldu!');
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

createAdminUser(); 