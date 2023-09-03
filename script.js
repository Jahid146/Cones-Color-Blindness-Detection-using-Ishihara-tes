const express = require("express");
const bodyParser = require("body-parser");
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, sendSignInLinkToEmail, signInWithEmailAndPassword, signOut } = require("firebase/auth");

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
      res.redirect("/sign-in"); // Redirect after successful registration
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
      res.redirect("/")// Redirect after successful sign-in
      
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Sign-in error:", errorCode, errorMessage);
      res.redirect("/sign-in"); // Redirect with error message, if needed
    });
});




// auth.onAuthStateChanged((user) => {
//   const navbarItems = document.getElementById("navbar-items");
//   navbarItems.innerHTML = `
//       <li class="nav-item">
//           <a class="nav-link" href="#one">Contact</a>
//       </li>
//       <li class="nav-item">
//           <a class="nav-link" href="/About-us">About Us</a>
//       </li>
//       <li class="nav-item" id="user-profile-nav">
//           ${
//               user
//                   ? `
//                       <div class="dropdown">
//                           <a class="nav-link dropdown-toggle" href="#" role="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
//                               <img src="${user.photoURL}" alt="User Profile Image" class="user-image">
//                           </a>
//                           <ul class="dropdown-menu" aria-labelledby="userDropdown">
//                               <li><a class="dropdown-item" href="#">${user.email}</a></li>
//                               <li><hr class="dropdown-divider"></li>
//                               <li><a class="dropdown-item" href="#" onclick="handleSignOut()">Log Out</a></li>
//                           </ul>
//                       </div>
//                   `
//                   : `<a class="nav-link" href="/sign-up">Log in/Sign up</a>`
//           }
//       </li>
//   `;
// });

// Add the authentication state observer
// document.addEventListener("DOMContentLoaded", function () {
//   const navbarItems = document.getElementById("navbar-items");
//   auth.onAuthStateChanged((user) => {
//     if (user) {
//       // User is authenticated
//       const profileImageURL = user.photoURL ? user.photoURL : "default-image-url";

//       navbarItems.innerHTML = `
//         <div class="dropdown">
//             <a class="nav-link dropdown-toggle" href="#" role="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
//                 <img src="${profileImageURL}" alt="User Profile Image" class="user-image">
//             </a>
//             <ul class="dropdown-menu" aria-labelledby="userDropdown">
//                 <li><a class="dropdown-item" href="#">${user.email}</a></li>
//                 <li><hr class="dropdown-divider"></li>
//                 <li><a class="dropdown-item" href="#" onclick="handleSignOut()">Log Out</a></li>
//             </ul>
//         </div>
//       `;
//     } else {
//       // User is not authenticated
//       navbarItems.innerHTML = `
//         <a class="nav-link" href="/sign-up">Log in/Sign up</a>
//       `;
//     }
//   });
// });
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

// app.get("/verify", (req, res) => {
//   // Extract the email from the query parameter
//   const email = req.query.email;

//   // Redirect the user to the home page after verification
//   res.redirect("/");
// });
