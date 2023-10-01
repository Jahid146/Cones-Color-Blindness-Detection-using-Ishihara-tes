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
    
  }],
  actualValue: [{
    type: String,
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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    usermail = user.email;
    console.log('User registered:', usermail);

    // Define the specific actual values you want to store
    const specificActualValues = ['12','08','06','29','57','05','03','15','74','02','06','97','45','05','07','16','73','nothing','nothing','nothing','nothing','26','42','35','96']; 
    // ,'15','74','02','06','97','45','05','07','16','73','nothing','nothing','nothing','nothing'

    // Store the user's email and the specific actual values in your MongoDB database
    const newUser = new User({ email: usermail, actualValue: specificActualValues });
    await newUser.save();

    res.redirect('/sign-in'); // Redirect after successful registration

  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error('Registration error:', errorCode, errorMessage);
    res.redirect('/sign-up'); // Redirect with an error message, if needed
  }
});

app.get("/sign-in", async (req, res) => {
  // Check if the user is already authenticated (signed in)
  if (usermail) {
    // User is already signed in, redirect to the home page
    res.redirect('/'); // Replace '/home-page' with your actual home page URL
  } else {
    // User is not signed in, render the sign-in page
    res.render("sign-in");
  }
});

app.post('/sign-in', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    usermail = user.email;
    console.log('User signed in:', usermail);

    // Check if the user's email exists in the database
    const existingUser = await User.findOne({ email: usermail });

    if (existingUser) {
      // User exists in the database, redirect to the homepage
      res.redirect('/'); // Replace '/' with the URL of your homepage
    } else {
      // User doesn't exist in the database, redirect to the choose_option page
      res.redirect('/');
    }
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

  try {
    // Try to find an existing user document with the same email
    const existingUser = await User.findOne({ email: userEmail });

    if (!existingUser) {
      // If the user does not exist, create a new user document
      const specificActualValues = ['12','08','06','29','57','05','03','15','74','02','06','97','45','05','07','16','73','nothing','nothing','nothing','nothing','26','42','35','96']; 
      // ,'15','74','02','06','97','45','05','07','16','73','nothing','nothing','nothing','nothing'
      const newUser = new User({ email: userEmail, actualValue: specificActualValues });
      await newUser.save();
      console.log('New user email saved to MongoDB:', userEmail);
      
      // Redirect to the choose_option page for first-time users
      res.redirect('/choose_option');
    } else {
      console.log('User already exists in MongoDB:', userEmail);
      
      // Redirect to the homepage for returning users
      res.redirect('/');
    }
  } catch (error) {
    console.error('Error saving user email to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});


//store the value of first image into database
app.put('/store-user-input', async (req, res) => {
  const userEmail = usermail;
  const userProvidedValue = req.body.number;

  console.log('Received email from client (Google sign-in):', userEmail);
  console.log('Received numeric value from client:', userProvidedValue);

  try {
    // Find the user by email and update their document to include the voice recognition value
    await User.findOneAndUpdate({ email: userEmail }, { $push: { numericValue: userProvidedValue } });

    res.status(200).send('Voice recognition data received and processed.');
  } catch (error) {
    console.error('Error saving voice recognition data to MongoDB:', error);
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


app.put('/store-value', async (req, res) => {
  // Access the email and numeric value from the request body
  const userEmail = usermail;
  const Value = req.body.Value;

  console.log('Received email from client (Google sign-in):', userEmail);
  console.log('Received numeric value from client:', Value);

  try {
    // Find the user by email and update their document to include the voice recognition value
    await User.findOneAndUpdate({ email: userEmail }, { $push: { numericValue: Value } });

    res.status(200).send('Voice recognition data received and processed.');
  } catch (error) {
    console.error('Error saving voice recognition data to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});





app.get('/Result1', async (req, res) => {
  try {
    // Fetch the user's data from the database
    const userData = await User.findOne({ email: usermail });

    if (!userData) {
      return res.status(404).send('User data not found.');
    }

    // Calculate the count of matching values in numericValue and actualValue
    const count = countMatchingValues(userData.numericValue, userData.actualValue);

    // Render the 'Result1' EJS template with the user data and the count
    res.render('Result1', { userData, count });
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Function to count matching values
function countMatchingValues(numericValues, actualValues) {
  // Ensure both arrays have the same length
  // if (numericValues.length !== actualValues.length) {
  //   return 0; // Return 0 if the arrays are not of the same length
  // }

  let count = 0;

  for (let i = 0; i < 21; i++) {
    if (numericValues[i] === actualValues[i]) {
      count++;
    }
  }

  return count;
}


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

app.get("/Result1", function (req, res) {
  res.render("Result1");
});

app.get("/Result", function (req, res) {
  res.render("Result");
});
app.get("/Result12", function (req, res) {
  res.render("Result12");
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await connectDB();
});
