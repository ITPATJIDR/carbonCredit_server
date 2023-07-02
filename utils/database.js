const mysql = require('mysql');

// Create a connection
const connection = mysql.createConnection({
  host: 'localhost',       
  user: 'root',    
  password: '',
  database: 'carboncredit' 
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  
  console.log('Connected to MySQL database as id ' + connection.threadId);
});

module.exports = connection;
