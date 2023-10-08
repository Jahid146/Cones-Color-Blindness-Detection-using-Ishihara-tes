const express = require('express');
const bodyParser = require('body-parser');
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
const crypto = require("crypto");
const session = require('express-session');
const port = process.env.PORT || 3000;
let usermail;
let usermail2;
let numberOfNumericValues;


const generateSecretKey = () => {
  const secretLength = 64; // You can adjust the length as needed
  return crypto.randomBytes(secretLength).toString("hex");
};
const secretKey = generateSecretKey();

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1*60*1000 }, // Modify the cookie options as needed
  })
);


// User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  numericValue: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 21'],
  },
  actualValue: [{
    type: String,
  }],
});

// Validation function for array length
function arrayLimit(val) {
  return val.length <= 25;
}



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


app.post('/store', async (req, res) => {
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
      numberOfNumericValues = 0;
      
      // Redirect to the choose_option page for first-time users
      res.redirect('/');
    } else {
      console.log('User already exists in MongoDB:', userEmail);
      numberOfNumericValues = existingUser.numericValue.length;
      
      // Redirect to the homepage for returning users
      res.redirect('/');
    }
  } catch (error) {
    console.error('Error saving user email to MongoDB:', error);
    res.status(500).send('Internal Server Error');
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
      numberOfNumericValues = 0;
      
      // Redirect to the choose_option page for first-time users
      res.redirect('/');
    } else {
      console.log('User already exists in MongoDB:', userEmail);
    
      // Access the numericValue array and get its length
       numberOfNumericValues = existingUser.numericValue.length;
    
      // Redirect to the homepage for returning users and pass the number of values as a query parameter
      res.redirect('/');
    }
    
  } catch (error) {
    console.error('Error saving user email to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/store-email', async (req, res) => {
  // Access the email from the request body
  const userEmail = req.body.email1;
  usermail = userEmail; // Use 'email' here

  try {
    // Try to find an existing user document with the same email
    const existingUser = await User.findOne({ email: userEmail });

    if (!existingUser) {
      
      console.log('New user email saved to MongoDB:', userEmail);
      numberOfNumericValues = 0;
      
      // Redirect to the choose_option page for first-time users
      res.redirect('/');
    } else {
      console.log('User already exists in MongoDB:', userEmail);
      numberOfNumericValues = existingUser.numericValue.length;
      
      // Redirect to the homepage for returning users
      res.redirect('/');
    }
  } catch (error) {
    console.error('Error saving user email to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/', function (req, res) {
  res.render('index', { numberOfNumericValues: numberOfNumericValues });
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


app.post('/restart', async (req, res) => {
  const userEmail = usermail;

  try {
    // Find the user by email and get their document
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).send('User not found.');
    }

    // Keep the first numericValue and clear the rest
    user.numericValue = user.numericValue.slice(0, 1);

    // Save the updated user document
    await user.save();

    // Redirect to the current page
    res.redirect('/calculator');
  } catch (error) {
    console.error('Error clearing numericValue data:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/exit', async (req, res) => {
  const userEmail = usermail; // Replace this with your actual user identification logic

  try {
    // Find the user by email and get their document
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).send('User not found.');
    }

    // Clear all values in the numericValue array
    user.numericValue = [];

    // Save the updated user document
    await user.save();

    // Redirect to the exit page or any other appropriate action
    res.redirect('/'); // Replace with the appropriate URL or action
  } catch (error) {
    console.error('Error clearing numericValue data:', error);
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

// app.post('/tryagain', async (req, res) => {
//   const userEmail = usermail;

//   try {
//     // Find the user by email and get their document
//     const user = await User.findOne({ email: userEmail });

//     if (!user) {
//       return res.status(404).send('User not found.');
//     }

//     // Keep the first numericValue and clear the rest
//     user.numericValue = user.numericValue.slice(0, 1);

//     // Save the updated user document
//     await user.save();

//     // Redirect to the current page
//     res.redirect('/choose_option');
//   } catch (error) {
//     console.error('Error clearing numericValue data:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

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
app.get("/opps", function (req, res) {
  res.render("opps");
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await connectDB();
});
