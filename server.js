const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// MongoDB connection configuration
const mongoURI = "mongodb://localhost:27017"; // Change this to your MongoDB URI
const dbName = "querit"; // Change this to your database name
const client = new MongoClient(mongoURI);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB.");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

// Connect to MongoDB
connectToMongoDB();

// Function to insert a user into the database
async function insertUserToDatabase(userInfo) {
  try {
    const db = client.db(dbName);
    const collection = db.collection("users");
    await collection.insertOne(userInfo);
    console.log("User inserted into database successfully.");
  } catch (err) {
    console.error("Error inserting user:", err);
    throw err;
  }
}

// Route handler for the root path
app.get("/", (req, res) => {
  res.send("Server is running.");
});

// Route handler for user registration
app.post("/register", async (req, res) => {
  const { name, email, password, phone, dob } = req.body;

  console.log(`Received registration request for email: ${email}`); // Debugging log

  // Simple validation for required fields
  if (!name || !email || !password || !phone || !dob) {
    console.log("Missing required fields."); // Debugging log
    return res.status(400).json({
      message: "All fields (name, email, password, phone, dob) are required.",
    });
  }

  try {
    // Insert user into the database
    await insertUserToDatabase({ name, email, password, phone, dob });

    console.log("User registration successful."); // Debugging log
    res.status(200).json({ message: "User registration successful." });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route handler for user login
app.post("/login", async (req, res) => {
  const { email, password, captchaInput, captchaResult } = req.body;

  console.log(`Received login request for email: ${email}`); // Debugging log

  // Simple email and password validation
  if (!email || !password) {
    console.log("Missing email or password."); // Debugging log
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  // Verify CAPTCHA response
  if (parseInt(captchaInput) !== parseInt(captchaResult)) {
    console.log("CAPTCHA verification failed."); // Debugging log
    return res.status(401).json({ message: "CAPTCHA verification failed." });
  }

  try {
    // Fetch user from the database
    const db = client.db(dbName);
    const collection = db.collection("users");
    const user = await collection.findOne({ email: email, password: password });

    if (user) {
      console.log("Login successful."); // Debugging log
      // Inside the /login route handler, after successful login
      res
        .status(200)
        .json({
          message: "Login successful.",
          redirect: "http://localhost:3000/posts.html",
        });
    } else {
      console.log("Login failed. Incorrect email or password."); // Debugging log
      res
        .status(401)
        .json({ message: "Login failed. Incorrect email or password." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
