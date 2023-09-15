const img = [
    "3", "5", "6", "8", "15", "29", "57", "74", "16", "45", "97", "35", "42", "96", "97"
];

let currentImageIndex = 0;
let timer;
const imageElement = document.getElementById("image");
const messageElement = document.getElementById("message");
const backButton = document.getElementById("backButton");
let lastInteractionTime = Date.now(); // Initialize the last interaction time

const buttons = {
    button1: 1,
    button2: 2,
    button3: 3,
    button4: 4,
    button5: 5,
    button6: 6,
    button7: 7,
    button8: 8,
    button9: 9,
    buttonNothing: 10,
    buttonUnsure: 100
};

let inputList = []; // Store button click inputs

function recordButtonClick(buttonValue) {
    inputList.push(buttonValue);
    // console.log("Input recorded:", buttonValue);
}

function processButtonClick(buttonValue) {
    recordButtonClick(buttonValue);

    lastInteractionTime = Date.now(); // Update the interaction time

    if (buttonValue === "buttonNothing" ) {
        const result = buttons[buttonValue];
        console.log("User input:", result);
        // For "Nothing" and "Unsure" buttons, always reset input and change image
        inputList = []; // Reset input list
        showNextImage();
    }
  else   if (buttonValue === "buttonUnsure") {
        const result = buttons[buttonValue];
        console.log("User input:", result);
        // For "Nothing" and "Unsure" buttons, always reset input and change image
        inputList = []; // Reset input list
        showNextImage();
    }
    
    else {
        // Check if the image name has two digits
        const imageName = img[currentImageIndex];
        console.log("correct no:",imageName);
        if (imageName.length === 2) {
            if (inputList.length === 2) {
                // If image name has two digits and two buttons have been clicked
                const result = buttons[inputList[0]] * 10 + buttons[inputList[1]];
                console.log("User input:", result);
                inputList = []; // Reset input list after displaying the result
                showNextImage();
            }
        } else if (imageName.length === 1) {
            // If one digit image name, the result will be the button value
            const result = buttons[buttonValue];
            console.log("User input:", result);
            inputList = []; // Reset input list after displaying the result
            showNextImage();
        } else {
            // If an image name has a different length, just reset input and change image
            inputList = []; // Reset input list
            showNextImage();
        }
    }
}


function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % img.length;
    imageElement.src = `/images/${img[currentImageIndex]}.jpg`;
    messageElement.style.display = "none";
    backButton.style.display = "none";
    startTimer();
    hideClockButton(); // Hide the "Start to Clock Here" button
}

function showMessage() {
    imageElement.style.display = "none";
    messageElement.style.display = "block";
    backButton.style.display = "block";
    hideClockButton(); // Hide the "Start to Clock Here" button
}

function hideClockButton() {
    const clockButton = document.getElementById("clockButton");
    if (clockButton) {
        clockButton.style.display = "none";
    }
}

backButton.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex - 1 + img.length) % img.length;
    imageElement.src = `/images/${img[currentImageIndex]}.jpg`;
    imageElement.style.display = "block";
    messageElement.style.display = "none";
    backButton.style.display = "none";
    lastInteractionTime = Date.now(); // Reset the interaction time to consider the back button click as activity
    startTimer();
    hideClockButton(); // Hide the "Start to Clock Here" button
});


backButton.addEventListener("click", () => {
    showNextImage();
});

const buttonElements = document.querySelectorAll(".button");
buttonElements.forEach(button => {
    button.addEventListener("click", () => processButtonClick(button.id));
});

function startTimer() {
    clearTimeout(timer);
    timer = setTimeout(showMessage, 5000);
}

function checkUserActivity() {
    const currentTime = Date.now();
    const timeSinceInteraction = currentTime - lastInteractionTime;

    if (timeSinceInteraction >= 5000) {
        startTimer();
    }
}

// Start the timer initially
startTimer();

// Check for user activity periodically
setInterval(checkUserActivity, 1000); // Check every second