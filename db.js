const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',         // Database host (usually 'localhost')
  user: 'root',              // MySQL username (replace with your own)
  password: '',              // MySQL password (replace with your own)
  database: 'uzduotis', // The name of the database you're using
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the MySQL database');
});

module.exports = connection;
