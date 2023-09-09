let img = ["/images/3.jpg", "/images/5.jpg", "/images/6.jpg", "/images/8.jpg","/images/12.1.jpg","/images/15.jpg","/images/16.jpg","/images/26.jpg","/images/29.jpg"];
let currentImageIndex = 0;
let timer;

function voice() {
  var recognition = new webkitSpeechRecognition();
  recognition.lang = "en-GB";

  recognition.onresult = function(event) {
    console.log(event);
    var transcript = event.results[0][0].transcript;
    console.log("Transcript:", transcript);

    // Process the transcript here (e.g., display it on the page)
    // You can replace the alert with your desired functionality
    // alert("Voice input: " + transcript);

    // Automatically convert the recognized text into speech
    

    // Check if the transcript is a valid number
    if (isNumber(transcript) ||(transcript == "nothing") ||(transcript == "unsure")) {
      // Number spoken, say the number
      speakText("You said " + transcript);

      // Add a 2-second pause and then say "Ok loading next image"
      setTimeout(function() {
        changeImage();
      }, 2000);
    } else {
      // Not a number, ask the user to try again
      speakText("It is not a valid input, try again");
    }
  };

  // Set a timeout to stop the recognition after 5 seconds
  setTimeout(function() {
    recognition.stop();
    // alert("Voice recognition stopped after 5 seconds.");
  }, 5000);

  recognition.start();
}

function speakText(textToSpeak) {
  // Create a SpeechSynthesisUtterance object
  var speech = new SpeechSynthesisUtterance();
  speech.lang = "en-US"; // Set the language (you can change this as needed)
  speech.text = textToSpeak;

  // Use the browser's built-in text-to-speech engine to speak the text
  window.speechSynthesis.speak(speech);
}

function changeImage() {
  // Change the image source to the next image in the array
  currentImageIndex = (currentImageIndex + 1) % img.length;
  var imageUrl = img[currentImageIndex];
  document.getElementById("image").src = imageUrl;

  // Add a 2-second pause and then say "Say OK to show the next image"
  setTimeout(function() {
   
  }, 2000);
}

function isNumber(inputText) {
  // Use parseFloat to attempt to convert the input text to a number
  // If it's a valid number, parseFloat returns a number, otherwise, it returns NaN
  return !isNaN(parseFloat(inputText));
}

// Add an event listener to start voice recognition when the "Start" button is clicked
document.getElementById("startButton").addEventListener("click", function() {
  voice();
});

// Automatically start voice recognition when the page loads
window.addEventListener("load", function() {
  voice();
});
