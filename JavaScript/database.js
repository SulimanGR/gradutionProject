const express = require('express');
const mysql = require('mysql');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the HTML page
app.get('/signup-page.html', (_, res) => {
  const htmlPath = path.join(__dirname, 'signup-page.html');
  fs.readFile(htmlPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading HTML file: ' + err.stack);
      return res.status(500).send('Error reading HTML file');
    }
    res.send(data);
  });
});

// Route to handle form submission
app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  // Insert user into MySQL database
  connection.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], (error, results) => {
    if (error) {
      console.error('Error inserting user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Generate JWT token
    const token = jwt.sign({ email }, 'secretKey');

    // Send response
    res.status(201).json({ message: 'User signed up successfully', token });
  });
});

// Define your GraphQL schema
const schema = buildSchema(fs.readFileSync(path.join(__dirname,'graphql.gql'), 'utf8'));

// Define resolvers
const root = {
  // Define resolver functions for mutations
  signup: ({ email, password }) => {
    // Implement signup logic, e.g., insert user into database
    return { id: 1, email, password };
  },
  // Define resolvers for other queries and mutations
};

// Create a GraphQL HTTP server endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Enable GraphiQL for testing
}));

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});// ... (existing code)

// Route to handle form submission
app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  // Hash password before inserting into database
  const hashedPassword = bcrypt.hashSync(password, 10);

  connection.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (error, results) => {
    if (error) {
      console.error('Error inserting user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // ... (remaining signup logic, generate JWT token, etc.)
  });
});

// ... (rest of the code)

