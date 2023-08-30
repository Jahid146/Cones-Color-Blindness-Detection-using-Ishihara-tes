const express = require("express");
const bodyParser = require("body-parser");
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, sendSignInLinkToEmail, signInWithEmailAndPassword } = require("firebase/auth");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZ7854htYYYmyH0qhWAwieRW2B7PTFdzg",
  authDomain: "cones-450e8.firebaseapp.com",
  projectId: "cones-450e8",
  storageBucket: "cones-450e8.appspot.com",
  messagingSenderId: "963595330821",
  appId: "1:963595330821:web:78f7d4b936b19e87c8c36c"
};

const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);

// Handle POST request for user registration
app.post("/sign-up", (req, res) => {
  const email = req.body.email1;
  const password = req.body.password1;
  const confirmPassword = req.body.confirm_password1;

  if (password !== confirmPassword) {
    res.redirect("/sign-up");
    // return res.redirect("/signup"); // Redirect with an error message or handle the error
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User registered:", user.email);
      sendVerificationMail(user.email);
      res.redirect("/verify-mail"); // Redirect after successful registration
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Registration error:", errorCode, errorMessage);
      res.redirect("/sign-up"); // Redirect with error message, if needed
    });
});

// Handle POST request for user sign-in
app.post("/sign-in", function (req, res) {
  const email = req.body.email; // Change this to match the input field name
  const password = req.body.password; // Change this to match the input field name

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User signed in:", user.email); // Use user.email instead of user.email2
      res.redirect("/"); // Redirect after successful sign-in
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Sign-in error:", errorCode, errorMessage);
      res.redirect("/sign-in"); // Redirect with error message, if needed
    });
});


function sendVerificationMail(email) {
  const action = {
    url: `http://localhost:3000/verify?email=${email}`,
    handleCodeInApp: true
  };

  sendSignInLinkToEmail(auth, email, action)
    .then(() => {
      console.log("Verification Email Sent");
    })
    .catch((error) => {
      console.error("Error Sending verification email: ", error);
    });
}

app.get("/", function (req, res) {
  res.render("index");
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

app.get("/verify-mail", function (req, res) {
  res.render("verify-mail");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/verify", (req, res) => {
  // Extract the email from the query parameter
  const email = req.query.email;

  // Redirect the user to the home page after verification
  res.redirect("/");
});
