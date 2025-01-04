const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is not defined in environment variables!');
  process.exit(1);
}

// MongoDB bağlantısı için client
let client;

// Mongoose bağlantısı
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB bağlantısı başarılı (Mongoose)');
})
.catch((err) => {
  console.error('MongoDB bağlantı hatası (Mongoose):', err);
});

const db = mongoose.connection;
db.on('error', (err) => {
  console.error('MongoDB bağlantı hatası:', err);
});
db.once('open', () => {
  console.log('MongoDB bağlantısı açık');
});

// MongoDB client bağlantısı
async function run() {
  try {
    if (!client) {
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
      await client.connect();
      console.log("MongoDB client bağlantısı başarılı");

      // Test connection
      await client.db("admin").command({ ping: 1 });
      console.log("MongoDB bağlantısı test edildi ve başarılı!");
    }
    return client;
  } catch (error) {
    console.error("MongoDB bağlantı hatası:", error);
    throw error;
  }
}

module.exports = { run, mongoose };
