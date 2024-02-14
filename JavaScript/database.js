const express = require('express');
const mysql = require('mysql');

const app = express();

// MySQL database connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootuser',
  database: 'auctionUsers',
  port: 3306
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as ID ' + connection.threadId);
});

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create a route to handle form submissions
app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  // Insert the submitted data into the database
  const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
  connection.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error('Error inserting data into database: ' + err.stack);
      return res.status(500).send('Error inserting data into database');
    }
    console.log('Data inserted into database:', result);
    res.send('Signup successful!');
  });
});

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup-page.html'); // Change 'index.html' to the filename of your HTML page
});

// Start the server
const port = 3000; // Use a different port than MySQL
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});

