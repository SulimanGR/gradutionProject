const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootuser',
  database: 'auction_members'
});

connection.connect(error => {
  if (error) {
    console.error('An error occurred while connecting to the DB: ' + error.stack);
    return;
  }

  console.log('Connected to the database with id ' + connection.threadId);
});