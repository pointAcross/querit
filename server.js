const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const path = require("path");
const crypto = require("crypto");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const uploadDir = "./uploads";
const { ObjectId } = require("mongodb");

const app = express();
const port = 3000;
const secretKey = crypto.randomBytes(20).toString("hex");

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/proj", express.static(path.join(__dirname, "proj")));

// MongoDB connection configuration
const mongoURI = "mongodb"; // Change this to your MongoDB URI
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
app.use(express.static("uploads"));

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
  res.status(200).json({ name: user.name, email: user.email });
});

// Route handler for fetching user name in the profile page
app.get("/getUserBio", async (req, res) => {
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
  res.status(200).json({ bio: user.bio });
});

// Route handler for saving a post to the database
app.post("/savePost", async (req, res) => {
  try {
    // Extract post data from the request body
    const {
      postTitle,
      postContent,
      topic,
      timestamp,
      userEmail,
      userName,
      filePath,
    } = req.body;

    // Ensure all required fields are present
    if (
      !postTitle ||
      !postContent ||
      !timestamp ||
      !userEmail ||
      !userName ||
      !topic
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Insert the post data into the database
    const db = client.db(dbName);
    const collection = db.collection("posts");
    await collection.insertOne({
      title: postTitle,
      content: postContent,
      topic: topic,
      timestamp: timestamp,
      userEmail: userEmail,
      userName: userName,
      filePath: filePath, // Store file path in the database
      commentCount: 0,
      viewCount: 0,
      comments: [],
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
    const userPosts = await collection
      .find({ userEmail: userEmail })
      .sort({ timestamp: -1 })
      .toArray();

    // Send the user's posts in the response
    res.status(200).json({ userPosts });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route handler for resetting user password
app.post("/resetPassword", async (req, res) => {
  const { email, newPassword } = req.body;

  // Validate request body
  if (!email || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email and new password are required.",
    });
  }

  try {
    const db = client.db(dbName);
    const collection = db.collection("users");

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const result = await collection.updateOne(
      { email: email },
      { $set: { password: hashedPassword } }
    );

    // Check if the update was successful
    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or password not updated.",
      });
    }

    console.log("Password reset successful for:", email);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Route handler for fetching posts
app.post("/getPosts", async (req, res) => {
  try {
    // Fetch posts from the database
    const db = client.db(dbName);
    const collection = db.collection("posts");

    // Find all posts and sort them by timestamp in descending order
    const allPosts = await collection.find().sort({ timestamp: -1 }).toArray();

    // Send the sorted posts to the client
    res.status(200).json({ allPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route handler for fetching user bio
app.get("/getUserBio", async (req, res) => {
  // Extract the email of the logged-in user from the session
  const userEmail = req.session.email;

  // Retrieve the user document from the database using the email
  const db = client.db(dbName);
  const collection = db.collection("users");
  const user = await collection.findOne({ email: userEmail });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Send the user's bio in the response
  res.status(200).json({ bio: user.bio });
});

// Set up Multer storage
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use original file name
  },
});

// Middleware function to log image requests
app.use((req, res, next) => {
  if (
    req.url.endsWith(".jpg") ||
    req.url.endsWith(".png") ||
    req.url.endsWith(".mp4")
  ) {
    // Adjust file extensions as needed
    console.log("Image fetched by client:", req.url);
  }
  next();
});

// Create Multer instance with defined storage
const upload = multer({ storage: storage });

// Route handler for file upload
app.post("/uploadFile", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // File uploaded successfully, return file path
    const filePath = req.file.path;
    res.status(200).json({ filePath: filePath });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/getPostByID", async (req, res) => {
  try {
    const { postID } = req.body;
    const database = client.db(dbName);
    const postsCollection = database.collection("posts");
    const post = await postsCollection.findOne({ _id: new ObjectId(postID) });
    if (post) {
      res.json([post]);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    res.status(500).send("Internal server error");
  }
});

// Increment view count
app.post("/incrementViewCount", async (req, res) => {
  const postID = req.body.postID;
  try {
    const db = client.db(dbName);
    const collection = db.collection("posts");
    const result = await collection.updateOne(
      { _id: new ObjectId(postID) },
      { $inc: { viewCount: 1 } }
    );
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "View count incremented successfully" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error("Error incrementing view count:", error);
    res.status(500).json({ message: "Error incrementing view count" });
  }
});

// Route handler for adding a comment to a post
app.post("/addComment", async (req, res) => {
  const { postID, comment } = req.body;
  try {
    const db = client.db(dbName);
    const collection = db.collection("posts");
    const result = await collection.updateOne(
      { _id: new ObjectId(postID) },
      {
        $push: {
          comments: {
            text: comment.text,
            email: comment.userEmail,
            name: comment.userName,
            topic: comment.topic,
          },
        },
        $inc: { commentCount: 1 },
      }
    );
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Comment added successfully" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment" });
  }
});

// Route handler for fetching posts sorted by comments count
app.post("/sortComment", async (req, res) => {
  try {
    // Fetch posts from the database
    const db = client.db(dbName);
    const collection = db.collection("posts");

    // Find all posts and sort them by comments in descending order
    const allPosts = await collection
      .find()
      .sort({ commentCount: -1 })
      .toArray();

    // Send the sorted posts to the client
    res.status(200).json({ allPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route handler for fetching posts sorted by view count
app.post("/sortView", async (req, res) => {
  try {
    // Fetch posts from the database
    const db = client.db(dbName);
    const collection = db.collection("posts");

    // Find all posts and sort them by views in descending order
    const allPosts = await collection.find().sort({ viewCount: -1 }).toArray();

    // Send the sorted posts to the client
    res.status(200).json({ allPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Server-side code to fetch user comments
app.post("/userComments", async (req, res) => {
  const userEmail = req.body.userEmail; // Extract the user email from the request body
  try {
    const db = client.db(dbName);
    const collection = db.collection("posts");
    const userComments = await collection
      .aggregate([
        { $unwind: "$comments" }, // Unwind the comments array
        { $match: { "comments.email": userEmail } }, // Match comments by user email
        { $project: { _id: 0, comments: 1 } }, // Project only the comments
      ])
      .toArray();
    res.status(200).json(userComments);
  } catch (error) {
    console.error("Error fetching user comments:", error);
    res.status(500).json({ message: "Error fetching user comments" });
  }
});

// Serve static files
const projDir = path.join(__dirname, "./proj");
app.use(express.static(projDir));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
