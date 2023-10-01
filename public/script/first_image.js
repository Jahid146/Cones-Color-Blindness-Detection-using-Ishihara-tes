// Define a function to handle form submission
function submitForm() {
  // Get the value from the input field
  const numberInput = document.getElementById('numberInput').value;

  // Check if the input value is equal to "12"
  if (numberInput === "12") {
    // Create a JSON object with the user's input
    const jsonData = { number: numberInput };

    // Convert the JSON object to a string
    const jsonStr = JSON.stringify(jsonData);

    // Send the JSON data to the server to create a JSON file
    fetch('/store-user-input', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonStr,
    })
      .then((response) => {
        // Handle the response from the server
        if (response.ok) {
          console.log('JSON file created on the server');
          // Redirect to "/choose_option"
          window.location.href = "/choose_option";
        } else {
          console.error('Failed to create JSON file on the server');
          // Handle the error (you can display an error message to the user here)
        }
      })
      .catch((error) => {
        console.error('Error creating JSON file on the server:', error);
        // Handle the error (you can display an error message to the user here)
      });
  } else {
    // Redirect to "/result" if the input is not equal to "12"
    window.location.href = "/Result12";
  }
}

// Attach the form submission function to the form's submit event
document.getElementById('numberForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent the default form submission
  submitForm(); // Call the submitForm function when the form is submitted
});
