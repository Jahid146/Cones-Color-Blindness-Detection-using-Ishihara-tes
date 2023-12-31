document.addEventListener("DOMContentLoaded", function () {
  const images = [
    "/images/8.jpg",
    "/images/6.jpg",
    "/images/29.jpg",
    "/images/57.jpg",
    "/images/5.jpg",
    "/images/3.jpg",
    "/images/15.jpg",
    "/images/74.jpg",
    "/images/2.jpg",
    "/images/6.1.jpg",
    "/images/97.jpg",
    "/images/45.jpg",
    "/images/5.jpg",
    "/images/7.jpg",
    "/images/16.jpg",
    "/images/73.jpg",
    "/images/1.jpg",
    "/images/2.1.jpg",
    "/images/3.1.jpg",
    "/images/4.jpg",
    "/images/26.jpg",
    "/images/42.jpg",
    "/images/35.jpg",
    "/images/96.jpg",
    "/images/12.1.jpg",
  ];

  let currentImageIndex = 0;
  let buttonClicks = 0;
  let userInput = '';
  let doneClicked = false;

  const imageElement = document.getElementById("image");
  const doneButton = document.getElementById("buttonDone");
  const userInputElement = document.getElementById("userInput");

  function updateImage() {
    imageElement.src = images[currentImageIndex];

    if (currentImageIndex === images.length - 1) {
      redirectToResultPage();
    }
  }

  function handleButtonClick(buttonValue) {
    buttonClicks++;

    if (buttonValue === 0) {
      userInput = "nothing";
    } else {
      if (buttonClicks >= 1) {
        if (userInput === '' && buttonValue < 10) {
          userInput = '0' + buttonValue.toString();
        } else {
          userInput += buttonValue.toString();
          userInput = userInput.slice(1);
        }
      }
    }

    if (
      buttonClicks >= 3 ||
      buttonValue === 0 ||
      (buttonClicks >= 1 && doneClicked == true)
    ) {
      console.log("User input1:", userInput);
      const dataToStore = {
        Value: userInput,
      };

      const jsonStr = JSON.stringify(dataToStore);

      fetch('/store-value', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonStr,
      })
        .then((response) => {
          if (response.ok) {
            console.log("Numeric value successfully sent to server");
          } else {
            console.error('Failed to send numeric value to server');
          }
        })
        .catch((error) => {
          console.error('Error sending numeric value to server:', error);
        });

      currentImageIndex = (currentImageIndex + 1) % images.length;
      updateImage();

      buttonClicks = 0;
      userInput = '';
      doneClicked = false;

      if (currentImageIndex === images.length - 1) {
        redirectToResultPage();
      }
    }
  }

  for (let i = 1; i <= 9; i++) {
    const button = document.getElementById(`button${i}`);
    if (!button.hasEventListener) {
      button.hasEventListener = true;
      button.addEventListener("click", () => handleButtonClick(i));
    }
  }

  const nothingButton = document.getElementById("buttonNothing");
  if (!nothingButton.hasEventListener) {
    nothingButton.hasEventListener = true;
    nothingButton.addEventListener("click", () => handleButtonClick(0));
  }

  doneButton.addEventListener("click", () => {
    if (userInput !== '' && !doneClicked) {
      doneClicked = true;
      console.log("User input:", userInput);
      const dataToStore = {
        Value: userInput,
      };

      const jsonStr = JSON.stringify(dataToStore);

      fetch('/store-value', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonStr,
      })
        .then((response) => {
          if (response.ok) {
            console.log("Numeric value successfully sent to server");
          } else {
            console.error('Failed to send numeric value to server');
          }
        })
        .catch((error) => {
          console.error('Error sending numeric value to server:', error);
        });
      currentImageIndex = (currentImageIndex + 1) % images.length;
      updateImage();
      buttonClicks = 0;
      userInput = '';
      doneClicked = false;
      if (currentImageIndex === images.length - 1) {
        redirectToResultPage();
      }
    }
  });

  function redirectToResultPage() {
    window.location.href = "/Result1";
  }

  updateImage();
});

