const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Session middleware for authentication
app.use(session({
  secret: 'asdfghjklqwertyuiopzxcvbnm', // Replace with a strong secret key
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true } 
}));

// MongoDB connection
const dbURI = 'mongodb+srv://Rahul:Rahul@mario.b6prz.mongodb.net/Contacts';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Define a schema for contacts
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String
});

const Contact = mongoose.model('Contact', contactSchema);

// Define admin schema and model
const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const Admin = mongoose.model('Admin', adminSchema);

// Seed the initial admin user (only once)
Admin.findOne({ username: 'Rahul' }).then(admin => {
  if (!admin) {
    bcrypt.hash('Rahul@428742', 10, (err, hashedPassword) => {
      if (!err) {
        new Admin({ username: 'Rahul', password: hashedPassword }).save()
          .then(() => console.log('Admin user created with username: Rahul'))
          .catch((error) => console.error('Error creating admin:', error));
      }
    });
  } else {
    console.log('Admin user already exists');
  }
});

// Middleware to check if the admin is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.admin) {
    next();
  } else {
    res.redirect('/login');
  }
}

// GET route for admin login page
app.get('/login', (req, res) => {
  res.render('login', { error: null }); // Render login.ejs
});

// POST route to handle login form submission
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (admin) {
      const passwordMatch = await bcrypt.compare(password, admin.password);
      if (passwordMatch) {
        req.session.admin = admin; // Set session after successful login
        return res.redirect('/admin/dashboard'); // Redirect to admin dashboard
      } else {
        res.render('login', { error: 'Invalid credentials' });
      }
    } else {
      res.render('login', { error: 'Admin not found' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.render('login', { error: 'An error occurred during login' });
  }
});

// Admin dashboard (only accessible when logged in)
app.get('/admin/dashboard', isAuthenticated, async (req, res) => {
  try {
    const contacts = await Contact.find(); // Fetch all contacts
    res.render('dashboard', { contacts }); // Render dashboard.ejs with contacts
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'An error occurred while fetching contacts' });
  }
});

// POST route to add new contacts
app.post('/contacts', isAuthenticated, async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const newContact = new Contact({ name, email, phone });
    await newContact.save();
    res.redirect('/admin/dashboard'); // Redirect to the dashboard after saving
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ message: 'An error occurred while saving the contact' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});