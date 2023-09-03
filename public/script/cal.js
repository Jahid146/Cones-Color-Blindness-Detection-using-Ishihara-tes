let img = ["3", "5", "6", "8", "15", "29", "57","74","16","45","97","35","42","96","97"];
let currentImageIndex = 0;
let timer;
const imageElement = document.getElementById("image");
const messageElement = document.getElementById("message");
const backButton = document.getElementById("backButton");
let lastInteractionTime = Date.now(); // Initialize the last interaction time

const buttons = [
    document.getElementById("button1"),
    document.getElementById("button2"),
    document.getElementById("button3"),
    document.getElementById("button4"),
    document.getElementById("button5"),
    document.getElementById("button6"),
    document.getElementById("button7"),
    document.getElementById("button8"),
    document.getElementById("button9"),
    document.getElementById("buttonNothing"),
    document.getElementById("buttonUnsure")
];

let inputList = []; // Store button click inputs

function recordButtonClick(buttonValue) {
    inputList.push(buttonValue);
    console.log("Input recorded:", buttonValue);
}

function processButtonClick(buttonValue) {
    recordButtonClick(buttonValue);

    lastInteractionTime = Date.now(); // Update the interaction time

    if (buttonValue === "buttonNothing" || buttonValue === "buttonUnsure") {
        // For "Nothing" and "Unsure" buttons, always reset input and change image
        inputList = []; // Reset input list
        showNextImage();
    } else {
        // Check if the image name has two digits
        const imageName = img[currentImageIndex];
        console.log(imageName);
        if (imageName.length === 2) {
            if (inputList.length === 2) {
                showNextImage();
                inputList = []; // Reset input list after changing image
            }
        } else {
            // If one digit button pressed, reset input and change image
            if (imageName.length === 1) {
                inputList = []; // Reset input list
                showNextImage();
            }
        }
    }
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % img.length;
    imageElement.src = `/images/${img[currentImageIndex]}.jpg`;
    messageElement.style.display = "none";
    backButton.style.display = "none";
    lastInteractionTime = Date.now(); // Reset the interaction time
    startTimer();
}

function showMessage() {
    imageElement.style.display = "none";
    messageElement.style.display = "block";
    backButton.style.display = "block";
}

backButton.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex - 1 + img.length) % img.length;
    imageElement.src = `/images/${img[currentImageIndex]}.jpg`;
    imageElement.style.display = "block";
    messageElement.style.display = "none";
    backButton.style.display = "none";
    lastInteractionTime = Date.now(); // Reset the interaction time
    startTimer();
});

backButton.addEventListener("click", () => {
    showNextImage();
});

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", () => processButtonClick(buttons[i].id));
}

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