const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// CORS ayarları
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB bağlantı URL'i
const uri = "mongodb+srv://eekardas:2415emre@coffice.mk4ow.mongodb.net/?retryWrites=true&w=majority&appName=Coffice";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let database;
let cafesCollection;

// Veritabanı bağlantısını başlat
async function connectToDatabase() {
    try {
        await client.connect();
        database = client.db("Coffice");
        cafesCollection = database.collection("london");
        console.log("Successfully connected to MongoDB.");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

// Cafe verilerini getiren endpoint
app.get('/api/cafes', async (req, res) => {
    try {
        console.log('Fetching all cafes...');
        // Tüm cafeleri getir
        const allCafes = await cafesCollection.find({}).toArray();
        console.log(`Found ${allCafes.length} cafes`);
        console.log('Sample cafe:', allCafes[0]);
        res.json(allCafes);
    } catch (error) {
        console.error("Error fetching cafes:", error);
        res.status(500).json({ message: "Error fetching cafes" });
    }
});

// Filtreleme endpointi
app.get('/api/cafes/filter', async (req, res) => {
    try {
        const { rating } = req.query;
        console.log('Filter Query:', { rating });
        
        let query = {};
        if (rating) {
            const minRating = parseFloat(rating).toFixed(1);
            const regex = new RegExp(`^(${minRating}|[${Math.ceil(minRating)}-5]\\.[0-9])$`);
            query.Rating = { $regex: regex };
        }
        console.log('MongoDB Query:', query);
        
        const filteredCafes = await cafesCollection.find(query).toArray();
        console.log('Filtered Results Count:', filteredCafes.length);
        res.json(filteredCafes);
    } catch (error) {
        console.error("Error filtering cafes:", error);
        res.status(500).json({ message: "Error filtering cafes" });
    }
});

// Test endpoint'i
app.get('/api/test-ratings', async (req, res) => {
    try {
        const sample = await cafesCollection.find({}).limit(5).toArray();
        const ratingTypes = sample.map(cafe => ({
            id: cafe._id,
            rating: cafe.Rating,
            type: typeof cafe.Rating
        }));
        res.json(ratingTypes);
    } catch (error) {
        console.error("Error testing ratings:", error);
        res.status(500).json({ message: "Error testing ratings" });
    }
});

// Verileri düzeltme endpoint'i
app.get('/api/fix-data', async (req, res) => {
    try {
        const allCafes = await cafesCollection.find({}).toArray();
        let updateCount = 0;

        for (const cafe of allCafes) {
            // Eski alanları temizle ve yeni alanları düzgün formatta ekle
            const cleanAddress = (cafe.address || cafe.Address || '').replace(/^\n+|\n+$/g, '').trim();
            const cleanPhone = (cafe.phone || '').replace(/^\n+|\n+$/g, '').trim();
            const cleanRating = cafe.rating || cafe.Rating || '4.0'; // Default rating
            const cleanReviews = cafe.reviews || cafe.Reviews || '0';
            const cleanTitle = cafe.title || cafe.Title || '';
            
            const updates = {
                Title: cleanTitle,
                Rating: cleanRating,
                Reviews: cleanReviews,
                Address: cleanAddress,
                "Google Maps Link": cafe["Google Maps Link"] || '',
                image: cafe.image || '',
                phone: cleanPhone,
                website: cafe.website || ''
            };

            // Eski alanları kaldır
            await cafesCollection.updateOne(
                { _id: cafe._id },
                { 
                    $set: updates,
                    $unset: {
                        title: "",
                        rating: "",
                        reviews: "",
                        address: "",
                        opening_hours: "",
                        plus_code: "",
                        price_range: "",
                        services: ""
                    }
                }
            );
            updateCount++;
        }

        res.json({ message: `${updateCount} cafe records updated` });
    } catch (error) {
        console.error("Error fixing data:", error);
        res.status(500).json({ message: "Error fixing data" });
    }
});

// Verileri sıfırdan oluşturma endpoint'i
app.get('/api/reset-data', async (req, res) => {
    try {
        // Koleksiyonu temizle
        await cafesCollection.deleteMany({});
        
        // Örnek veri
        const sampleData = [
            {
                Title: "Chapter 72",
                Rating: "4.5",
                Reviews: "737",
                Address: "72 Bermondsey St, London SE1 3UD",
                "Google Maps Link": "https://maps.google.com/?cid=123",
                image: "",
                phone: "020 7403 1100",
                website: "http://www.chapter-72.com/"
            },
            {
                Title: "Prufrock Coffee",
                Rating: "4.4",
                Reviews: "68",
                Address: "23-25 Leather Ln, London EC1N 7TE",
                "Google Maps Link": "https://maps.google.com/?cid=456",
                image: "",
                phone: "",
                website: "http://www.prufrockcoffee.com/"
            }
            // Diğer veriler buraya eklenecek
        ];
        
        // Yeni verileri ekle
        const result = await cafesCollection.insertMany(sampleData);
        res.json({ message: `${result.insertedCount} cafe records created` });
    } catch (error) {
        console.error("Error resetting data:", error);
        res.status(500).json({ message: "Error resetting data" });
    }
});

// Test endpoint to check database contents
app.get('/api/debug/cafes', async (req, res) => {
    try {
        const count = await cafesCollection.countDocuments();
        const sample = await cafesCollection.find().limit(5).toArray();
        res.json({
            totalCafes: count,
            sampleData: sample
        });
    } catch (error) {
        console.error("Debug error:", error);
        res.status(500).json({ message: "Error in debug endpoint", error: error.message });
    }
});

// Uygulama başlatma
async function startServer() {
    await connectToDatabase();
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
}

startServer().catch(console.error); 

app.get('/api/cafes/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const cafe = await cafesCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!cafe) {
      return res.status(404).json({ message: 'Cafe not found' });
    }
    res.json(cafe);
  } catch (error) {
    console.error('Error fetching cafe details:', error);
    res.status(500).json({ message: 'Server error' });
  }
}); 