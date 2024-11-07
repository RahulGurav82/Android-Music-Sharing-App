const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// In-memory array to store contacts (for simplicity)
let contacts = [];

// POST route to handle incoming contact data
app.post('/api/contacts', (req, res) => {
  try {
    const newContacts = req.body;

    // Log received contacts
    console.log('Received contacts:', newContacts);

    // Add contacts to in-memory array
    contacts = contacts.concat(newContacts);

    // Respond to client
    res.status(200).json({ message: 'Contacts received and logged successfully' });
  } catch (error) {
    console.error('Error handling contacts:', error);
    res.status(500).json({ message: 'An error occurred while processing contacts' });
  }
});

// GET route to serve all contacts
app.get('/api/contacts', (req, res) => {
  res.status(200).json({ contacts: contacts });
});

// Simple GET route for testing
app.get('/', (req, res) => {
  res.send('Contact API is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
