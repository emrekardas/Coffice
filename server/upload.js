const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs'); // Dosya okuma için
const path = require('path'); // Dosya yolu için

// MongoDB bağlantı URI'si
const uri = "mongodb+srv://eekardas:2415emre@coffice.mk4ow.mongodb.net/?retryWrites=true&w=majority&appName=Coffice";

// MongoClient oluşturuluyor
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // MongoDB'ye bağlan
    await client.connect();
    console.log("MongoDB'ye bağlandı!");

    // JSON dosyasını oku
    const filePath = path.join(__dirname, 'london_study_laptop_friendly.json');
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Verileri london koleksiyonuna ekle
    const collection = client.db("Coffice").collection("london"); // 'Coffice' veritabanı ve 'london' koleksiyonu
    const result = await collection.insertMany(jsonData);

    console.log(`${result.insertedCount} belge başarıyla 'london' koleksiyonuna eklendi.`);
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  } finally {
    // Bağlantıyı kapat
    await client.close();
    console.log("Bağlantı kapatıldı.");
  }
}

run().catch(console.dir);