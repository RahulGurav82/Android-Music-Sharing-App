const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Import mongoose
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// MongoDB connection string
const dbURI = 'mongodb+srv://Rahul:Rahul@mario.b6prz.mongodb.net/yourDatabaseName'; // Replace 'yourDatabaseName' with your actual database name

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Define a schema and model for contacts
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String
});

const Contact = mongoose.model('Contact', contactSchema);

// POST route to handle incoming contact data
app.post('/api/contacts', async (req, res) => {
  try {
    const newContacts = req.body;

    // Log received contacts
    console.log('Received contacts:', newContacts);

    // Store contacts in MongoDB
    const savedContacts = await Contact.insertMany(newContacts);

    // Respond to client
    res.status(200).json({ message: 'Contacts received and saved successfully', savedContacts });
  } catch (error) {
    console.error('Error handling contacts:', error);
    res.status(500).json({ message: 'An error occurred while processing contacts' });
  }
});

// GET route to serve all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const allContacts = await Contact.find(); // Fetch all contacts from MongoDB
    res.status(200).json({ contacts: allContacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'An error occurred while fetching contacts' });
  }
});

// Simple GET route for testing
app.get('/', (req, res) => {
  res.send('Contact API is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
