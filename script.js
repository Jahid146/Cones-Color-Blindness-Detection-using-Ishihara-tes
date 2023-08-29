const express = require("express");
const bodyParser = require("body-parser");
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithPopup, FacebookAuthProvider, GoogleAuthProvider, sendSignInLinkToEmail } = require("firebase/auth");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

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
      res.redirect("/check-user"); // Redirect after successful registration
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Registration error:", errorCode, errorMessage);
      res.redirect("/sign-up"); // Redirect with error message, if needed
    });
  });

function sendVerificationMail(email){
  const action = {
    url: `http://localhost:3000/verify?email=${email}`,
    handleCodeInApp: true
  };

  sendSignInLinkToEmail(auth, email, action)
  .then(()=>{
    console.log("Verification Email Sent");
  })
  .catch((error)=>{
    console.error("Error Sending verification email: ", error);
  });
}

//   // // Function to initiate Google authentication
//   // function loginWithGoogle() {
//   //   const provider = new firebase.auth.GoogleAuthProvider();
//   //   auth.signInWithPopup(provider)
//   //     .then((result) => {
//   //       // Handle successful sign-in
//   //       console.log("Google user signed in:", result.user.email);
//   //       // Redirect or perform other actions
//   //     })
//   //     .catch((error) => {
//   //       // Handle authentication error
//   //       console.error("Google authentication error:", error.code, error.message);
//   //       // Handle error as needed
//   //     });
 

// //   // Get the Google sign-up anchor link
// //   const googleSignUpLink = document.getElementById("google");

// //   // Add event listener to trigger Google authentication
// //   if (googleSignUpLink) {
// //     googleSignUpLink.addEventListener("click", (event) => {
// //       event.preventDefault(); // Prevent default link behavior
// //       loginWithGoogle(); // Call the Google authentication function
// //     });
// //   }

// });

// app.get("/google-auth", (req, res) => {
//   // Redirect the user to the Firebase authentication URL
//   console.log("Here")
  
//   res.redirect("/");
// });


// const provider = new FacebookAuthProvider();

// Handle Facebook authentication
// app.get("/facebook-signup", (req, res) => {
//   console.log('button clicked ');
//   signInWithPopup(auth, provider)
//     .then((result) => {
//       const user = result.user;
//       const credential = FacebookAuthProvider.credentialFromResult(result);
//       const token = credential.accessToken;



//       console.log("User signed in with Facebook:", user.email);
//       res.redirect("/"); // Redirect after successful authentication
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.error("Facebook authentication error:", errorCode, errorMessage);
//       res.redirect("/"); // Redirect with error message, if needed
//     });
// });



app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/check-email", (req, res)=>{
  res.sendFile(__dirname + "/check-email")
})

app.get("/sign-up", function (req, res) {
  res.sendFile(__dirname + "/sign-up.html");
});

app.get("/sign-in", function (req, res) {
  res.sendFile(__dirname + "/sign in.html");
});

app.get("/About-us", function (req, res) {
  res.sendFile(__dirname + "/About us.html");
});

app.get("/calculator", function (req, res) {
  res.sendFile(__dirname + "/calculator.html");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
