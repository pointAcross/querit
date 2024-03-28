const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const path = require("path");
const crypto = require("crypto");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;
const secretKey = crypto.randomBytes(20).toString("hex");

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection configuration
const mongoURI =
  "mongodb+srv://Adarsh:Adarsh@querit.0c0rqzg.mongodb.net/?retryWrites=true&w=majority&appName=Querit"; // Change this to your MongoDB URI
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

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoURI, dbName: "querit" }),
    cookie: { maxAge: 60 * 60 * 24 * 1000 }, // 1 day
  })
);

// Connect to MongoDB
connectToMongoDB();

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  // Exclude login and register routes from authentication check
  if (
    req.path === "/login.html" ||
    req.path === "/register.html" ||
    (req.session && req.session.isLoggedIn)
  ) {
    return next();
  }
  // If not authenticated and not accessing login or register page, redirect to login
  res.redirect("/login.html");
}

// Protect pages
app.get(
  [
    "/home.html",
    "/thread.html",
    "/posts.html",
    "/notifications.html",
    "/profile.html",
    "/edit_profile.html",
  ],
  isAuthenticated,
  (req, res) => {
    res.sendFile(path.join(__dirname, "proj", req.path));
  }
);

// Serve static files after applying authentication middleware
app.use(express.static("proj"));

// Route handler for the root path
app.get("/", (req, res) => {
  res.send("Server is running.");
});

// Function to insert user into the database
async function insertUserToDatabase(user) {
  const db = client.db(dbName);
  const collection = db.collection("users");
  await collection.insertOne(user);
}

// Route handler for user registration
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  console.log(`Received registration request for email: ${email}`); // Debugging log

  // Simple validation for required fields
  if (!name || !email || !password) {
    console.log("Missing required fields."); // Debugging log
    return res.status(400).json({
      message: "All fields (name, email, password) are required.",
    });
  }

  try {
    // Access the MongoDB collection from the database client
    const db = client.db(dbName);
    const collection = db.collection("users");

    // Check if the user already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      console.log("User already exists."); // Debugging log
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Insert user into the database with hashed password
    await collection.insertOne({
      name,
      email,
      password: hashedPassword,
    });

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

  // Simple email validation
  if (!email || !password) {
    console.log("Missing email or password."); // Debugging log
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  // Verify CAPTCHA response
  if (captchaInput !== captchaResult) {
    console.log("CAPTCHA verification failed."); // Debugging log
    return res.status(401).json({ message: "CAPTCHA verification failed." });
  }

  try {
    // Fetch user from the database
    const db = client.db(dbName);
    const collection = db.collection("users");
    const user = await collection.findOne({ email });

    if (user) {
      // Compare hashed password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (isPasswordCorrect) {
        console.log("Login successful."); // Debugging log

        // Inside the /login route handler, after successful login, set the session flag to indicate that the user is logged in and store the user's email in the session.
        req.session.isLoggedIn = true;
        req.session.email = email; // Store email in session

        // Set session cookie with user's email
        res.cookie("userEmail", email, { maxAge: 60 * 60 * 24 * 1000 }); // 1 day

        res.status(200).json({
          message: "Login successful.",
          redirect: "/home.html",
        });
      } else {
        console.log("Login failed. Incorrect email or password."); // Debugging log
        res
          .status(401)
          .json({ message: "Login failed. Incorrect email or password." });
      }
    } else {
      console.log("User not found."); // Debugging log
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route handler for updating user profile
app.post("/updateProfile", async (req, res) => {
  // Extract user profile data from the request body
  const { name, dob, email, password, phone } = req.body;

  // Extract the email of the logged-in user from the session
  const userEmail = req.session.email;

  // Retrieve the user document from the database using the email
  const db = client.db(dbName);
  const collection = db.collection("users");
  const user = await collection.findOne({ email: userEmail });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Extract the ObjectId of the user document
  const userId = user._id;

  // Construct the update query
  const updateQuery = {};

  // Allow all fields to be updated
  if (name) updateQuery.name = name;
  if (dob) updateQuery.dob = dob;
  if (password) updateQuery.password = password;
  if (phone) updateQuery.phone = phone;

  // If the email is being updated, handle it separately to avoid errors
  if (email && email !== userEmail) {
    // Check if the new email already exists in the database
    const existingUser = await collection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Update the email field in the document
    updateQuery.email = email;
  }

  try {
    // Update the user document in the database
    await collection.updateOne({ _id: userId }, { $set: updateQuery });

    // Send a JSON response indicating a successful update
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    // Send a JSON response with error details
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route handler for user logout
app.post("/logout", function (req, res, next) {
  console.log("Received logout request..."); // Debugging log

  req.session.destroy(function (err) {
    if (err) {
      console.error("Error destroying session:", err); // Debugging log
      return next(err);
    }

    console.log("Session destroyed successfully."); // Debugging log

    res.clearCookie("connect.sid"); // Clear the session cookie

    // Send the response immediately after session destruction
    res
      .status(200)
      .json({ message: "Logged out successfully", redirectToLogin: true });
  });
});

// Route handler for fetching user name in the profile page
app.get("/getUserName", async (req, res) => {
  // Extract the email of the logged-in user from the session
  const userEmail = req.session.email;

  // Retrieve the user document from the database using the email
  const db = client.db(dbName);
  const collection = db.collection("users");
  const user = await collection.findOne({ email: userEmail });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Send the user's name in the response
  res.status(200).json({ name: user.name });
});

// Route handler for saving a post to the database
app.post("/savePost", async (req, res) => {
  try {
    // Extract post data from the request body
    const { title, content, timestamp, userEmail } = req.body;

    // Ensure all required fields are present
    if (!title || !content || !timestamp || !userEmail) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Insert the post data into the database
    const db = client.db(dbName);
    const collection = db.collection("posts");
    await collection.insertOne({
      title: title,
      content: content,
      timestamp: timestamp,
      userEmail: userEmail,
    });

    console.log("Post saved successfully."); // Debugging log
    res.status(200).json({ message: "Post saved successfully." });
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route handler for fetching posts created by the logged-in user
app.get("/getUserPosts", async (req, res) => {
  try {
    // Extract the email of the logged-in user from the session
    const userEmail = req.session.email;

    // Retrieve posts from the database based on the user's email
    const db = client.db(dbName);
    const collection = db.collection("posts");
    const userPosts = await collection.find({ userEmail: userEmail }).toArray();

    // Send the user's posts in the response
    res.status(200).json({ userPosts });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route handler for password reset
app.post("/resetPassword", async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  // Simple validation for required fields
  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message:
        "All fields (email, new password, confirm password) are required.",
    });
  }

  // Check if passwords match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 is the salt rounds

    // Update the user's password in the database
    const db = client.db(dbName);
    const collection = db.collection("users");
    const result = await collection.updateOne(
      { email: email },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount === 1) {
      // Password updated successfully
      res.redirect("/login.html");
    } else {
      // User not found or password not updated
      res
        .status(404)
        .json({ message: "User not found or password not updated." });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Serve static files
const projDir = path.join(__dirname, "./proj");
app.use(express.static(projDir));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
