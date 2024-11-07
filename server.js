const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// MongoDB connection (optional)
mongoose.connect('mongodb://localhost:27017/contactsDB', { useNewUrlParser: true, useUnifiedTopology: true });

const contactSchema = new mongoose.Schema({
  name: String,
  phone: String
});

const Contact = mongoose.model('Contact', contactSchema);

// POST route to handle incoming contact data
app.post('/api/contacts', async (req, res) => {
  try {
    const contacts = req.body;

    // Log received contacts
    console.log('Received contacts:', contacts);

    // Store contacts in MongoDB (optional)
    await Contact.insertMany(contacts);

    res.status(200).json({ message: 'Contacts received and stored successfully' });
  } catch (error) {
    console.error('Error handling contacts:', error);
    res.status(500).json({ message: 'An error occurred while saving contacts' });
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
