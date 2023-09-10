
let img = [
  "/images/3.jpg",
  "/images/5.jpg",
  "/images/6.jpg",
  "/images/8.jpg",
  "/images/12.1.jpg",
  "/images/15.jpg",
  "/images/16.jpg",
  "/images/26.jpg",
  "/images/29.jpg"
];
let currentImageIndex = 0;
let timer;

// Function to hide the "Start to Click Here" button
function hideStartButton() {
  document.getElementById("start").style.display = "none";
}

// Function to show the "Start to Click Here" button
function showStartButton() {
  document.getElementById("start").style.display = "block";
}

function voice() {
  // Hide the "Start to Click Here" button when voice recognition starts
  hideStartButton();

  var recognition = new webkitSpeechRecognition();
  recognition.lang = "en-GB";

  recognition.onresult = function (event) {
    console.log(event);
    var transcript = event.results[0][0].transcript;
    console.log("Transcript:", transcript);

    // Check if the transcript is a valid number
    if (
      isNumber(transcript) ||
      transcript == "nothing" ||
      transcript == "unsure"
    ) {
      // Number spoken, say the number
      speakText("You said " + transcript);

      // Change the image immediately
      changeImage();
      if (isNumber(transcript)) {
        // Create a JSON object to store the numeric value and user email
        const dataToStore = {// Pass the user's 
          numericValue: transcript,
        };
        
      
        // Convert the JSON object to a string
        const jsonStr = JSON.stringify(dataToStore);
      
        // Use fetch to send this JSON data to your server
        fetch('/store-numeric-value', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonStr,
        })
        .then((response) => {
          // Handle the response from the server
          if (response.ok) {
            console.log("Numeric value successfully sent to server");
          } else {
            console.error('Failed to send numeric value to server');
            // Handle the error
          }
        })
        .catch((error) => {
          console.error('Error sending numeric value to server:', error);
          // Handle the error
        });
      }
    } else {
      // Not a number, ask the user to try again
      speakText("It is not a valid input, try again");
    }
  };

  // Set a timeout to stop the recognition after 5 seconds
  setTimeout(function () {
    recognition.stop();

    // If recognition stops without valid input, show the "Start to Click Here" button again
    showStartButton();
  }, 5000);

  recognition.start();
}

function speakText(textToSpeak) {
  var speech = new SpeechSynthesisUtterance();
  speech.lang = "en-US";
  speech.text = textToSpeak;

  window.speechSynthesis.speak(speech);
}

function changeImage() {
  // Change the image source to the next image in the array
  currentImageIndex = (currentImageIndex + 1) % img.length;
  var imageUrl = img[currentImageIndex];
  document.getElementById("image").src = imageUrl;

  // Set a timeout to show the "Start to Click Here" button again after 10 seconds
  timer = setTimeout(function () {
    showStartButton();
  }, 10000); // 10 seconds (10000 milliseconds)
}

function isNumber(inputText) {
  return !isNaN(parseFloat(inputText));
}

// Add an event listener to start voice recognition when the "Start" button is clicked
document.getElementById("start").addEventListener("click", function () {
  // Clear the timer if the button is clicked to prevent auto-hiding
  clearTimeout(timer);
  voice();
});

// Automatically show the "Start to Click Here" button when the page loads
window.addEventListener("load", function () {
  showStartButton();
});