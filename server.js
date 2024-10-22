const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
// Testing  connection

db.connect(err => {
  //Connection not succesfull
  if (err) {
    return console.log("Error connecting to database: ",err)
  }
  //Connection  succesfull
  console.log('MySQL connected succefully');
});

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
  db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});




// 2. Retrieve all providers
app.get('/providers', (req, res) => {
  db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// 3. Filter patients by First Name
app.get('/patients/:first_name', (req, res) => {
  const { first_name } = req.params;
  db.query('SELECT * FROM patients WHERE first_name = ?', [first_name], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/specialty/:specialty', (req, res) => {
  const { specialty } = req.params;
  db.query('SELECT * FROM providers WHERE provider_specialty = ?', [specialty], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


// Listen to the server

app.listen(3300, () => {
  console.log('Server is running on port 3300');
});
