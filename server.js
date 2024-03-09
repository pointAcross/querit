const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(cors());

// MySQL connection configuration
const db = mysql.createConnection({
 host: "host",
 user: "user",
 password: "password",
 database: "querit",
});

// Connect to the database
db.connect((err) => {
 if (err) throw err;
 console.log("Connected to the database.");
 console.log("Connection to AWS RDS established successfully.");
});

app.use(bodyParser.json());

// Function to fetch a user from the database
function getUserFromDatabase(email, password) {
 return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Users WHERE uEmail = ? AND uPass = ?';
    db.query(query, [email, password], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0 ? results[0] : null);
      }
    });
 });
}

// Route handler for the root path
app.get("/", (req, res) => {
 res.send("Server is running.");
});

app.post("/login", async (req, res) => {
 const { email, password } = req.body;

 // Simple email and password validation
 if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
 }

 try {
    // Fetch user from the database
    const user = await getUserFromDatabase(email, password);

    if (user) {
      // Login successful
      res.json({ message: 'Login successful' });
    } else {
      // Login failed
      res.status(401).json({ message: 'Login failed. Incorrect email or password.' });
    }
 } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
 }
});

app.listen(port, () => {
 console.log(`Server running at http://localhost:${port}`);
});
