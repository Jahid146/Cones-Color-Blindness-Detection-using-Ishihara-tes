const express = require('express');
const bodyParser = require('body-parser');
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;
let usermail;




// User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  numericValue: [{
    type: String,
    unique:true,// Change the data type if needed (e.g., String)
  }],
});


// User Model
const User = mongoose.model('User', userSchema);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/Cones', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB is connected');
  } catch (error) {
    console.log('DB is not connected');
    console.log(error.message);
    process.exit(1);
  }
};

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Initialize Firebase Admin SDK with your service account JSON


const firebaseConfig = {
  apiKey: "AIzaSyAZ7854htYYYmyH0qhWAwieRW2B7PTFdzg",
  authDomain: "cones-450e8.firebaseapp.com",
  projectId: "cones-450e8",
  storageBucket: "cones-450e8.appspot.com",
  messagingSenderId: "963595330821",
  appId: "1:963595330821:web:78f7d4b936b19e87c8c36c"
};

// Initialize Firebase Web SDK with your Firebase project configuration
const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);

// Handle POST request for user registration with email/password
app.post('/sign-up', async (req, res) => {
  const email = req.body.email1;
  const password = req.body.password1;
  const confirmPassword = req.body.confirm_password1;

  if (password !== confirmPassword) {
    return res.redirect('/sign-up');
  }

  try {
    // Create the user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    usermail = user.email;
    console.log('User registered:', usermail);

    // Store the user's email in your MongoDB database
    const newUser = new User({ email: usermail});
    await newUser.save();

    res.redirect('/sign-in'); // Redirect after successful registration
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error('Registration error:', errorCode, errorMessage);
    res.redirect('/sign-up'); // Redirect with an error message, if needed
  }
});

// Handle POST request for user sign-in with email/password
app.post('/sign-in', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    usermail = user.email;
    console.log('User signed in:', usermail);

    res.redirect('/choose_option'); // Redirect after successful sign-in
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error('Sign-in error:', errorCode, errorMessage);
    res.redirect('/sign-in'); // Redirect with an error message, if needed
  }
});



app.post('/store-google-email', async (req, res) => {
  // Access the email from the request body
  const userEmail = req.body.email;
  usermail = userEmail; // Use 'email' here

  // Now you can use 'userEmail' to store it in your MongoDB or perform any other action
  console.log('Received email from client (Google sign-in):', userEmail);

  // Store the email in your MongoDB database or perform other actions as needed
  try {
    // Use 'email' property to create a new User
    const newUser = new User({ email: userEmail }); // Use 'email' here
    await newUser.save();
    console.log('User email saved to MongoDB:', userEmail);
    // Respond with a success message or any necessary response
    res.status(200).send('Email received and processed.');
  } catch (error) {
    console.error('Error saving user email to MongoDB:', error);
    // Handle the error and respond accordingly
    res.status(500).send('Internal Server Error');
  }
});


app.put('/store-numeric-value', async (req, res) => {
  // Access the email and numeric value from the request body
  const userEmail = usermail;
  const numericValue = req.body.numericValue;

  console.log('Received email from client (Google sign-in):', userEmail);
  console.log('Received numeric value from client:', numericValue);

  try {
    // Find the user by email and update their document to include the voice recognition value
    await User.findOneAndUpdate({ email: userEmail }, { $push: { numericValue: numericValue } });

    res.status(200).send('Voice recognition data received and processed.');
  } catch (error) {
    console.error('Error saving voice recognition data to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/', function (req, res) {
  res.render('index');
});

app.get("/check-email", (req, res) => {
  res.render("check-email");
});

app.get("/sign-up", function (req, res) {
  res.render("sign-up");
});

app.get("/sign-in", function (req, res) {
  res.render("sign-in");
});

app.get("/About-us", function (req, res) {
  res.render("About-us");
});

app.get("/calculator", function (req, res) {
  res.render("calculator");
});

app.get("/Voice_interaction", function (req, res) {
  res.render("Voice_interaction");
});

app.get("/choose_option", function (req, res) {
  res.render("choose_option");
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await connectDB();
});
