const express = require('express'); 
const dotenv = require('dotenv'); 
const bodyParser = require('body-parser'); 
const db = require('./db'); 

dotenv.config(); // Load .env file

// Create an instance of Express
const app = express(); 

// Use port from .env file or default to 3000
const PORT = process.env.PORT || 3000; 

// Middleware to parse JSON data
app.use(bodyParser.json());

// Root endpoint to confirm API is running
app.get('/', (req, res) => {
    res.send('Kenya Red Cross Disaster Management API');
});

// Route to report an emergency
app.post('/report', async (req, res) => {
    const { user_id, report, frequency_channel, location } = req.body;

    try {
        // Query to insert data into the emergencies table
        const queryText = `
            INSERT INTO emergencies (user_id, report, frequency_channel, location)
            VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326))
            RETURNING id
        `;
        const values = [user_id, report, frequency_channel, location.lng, location.lat];
        const result = await db.query(queryText, values);

        // Respond with success message and new emergency ID
        res.status(201).json({ message: 'Emergency reported successfully!', id: result.rows[0].id });
    } catch (error) {
        console.error('Error reporting emergency:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to retrieve all emergencies
app.get('/emergencies', async (req, res) => {
    try {
        // Query to fetch all rows from the emergencies table
        const queryText = 'SELECT * FROM emergencies';
        const result = await db.query(queryText);

        // Respond with JSON array of emergency records
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving emergencies:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
