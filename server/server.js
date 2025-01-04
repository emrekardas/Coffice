const express = require('express');
const cors = require('cors');
const path = require('path');
const { run, mongoose } = require('./mongo');
const { MongoClient, ObjectId } = require('mongodb');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

let client;
let cafesCollection;

// Initialize database connection
async function initializeDb() {
    client = await run();
    cafesCollection = client.db("Coffice").collection("london");
}

// Cafe verilerini getiren endpoint
app.get('/api/cafes', async (req, res) => {
    try {
        console.log('Fetching all cafes...');
        const allCafes = await cafesCollection.find({}).toArray();
        console.log(`Found ${allCafes.length} cafes`);
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
        
        const filteredCafes = await cafesCollection.find(query).toArray();
        console.log('Filtered Results Count:', filteredCafes.length);
        res.json(filteredCafes);
    } catch (error) {
        console.error("Error filtering cafes:", error);
        res.status(500).json({ message: "Error filtering cafes" });
    }
});

// Specific cafe by ID endpoint
app.get('/api/cafes/:id', async (req, res) => {
    try {
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

// Fix data endpoint
app.get('/api/fix-data', async (req, res) => {
    try {
        const allCafes = await cafesCollection.find({}).toArray();
        let updateCount = 0;

        for (const cafe of allCafes) {
            const cleanAddress = (cafe.address || cafe.Address || '').replace(/^\n+|\n+$/g, '').trim();
            const cleanPhone = (cafe.phone || '').replace(/^\n+|\n+$/g, '').trim();
            const cleanRating = cafe.rating || cafe.Rating || '4.0';
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

// Debug endpoint
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

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

async function startServer() {
    try {
        await initializeDb();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer(); 