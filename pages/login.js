// Function to generate a random arithmetic expression for CAPTCHA
function generateCaptcha() {
  const operands = ["+", "-", "*"];
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operand = operands[Math.floor(Math.random() * operands.length)];
  const expression = `${num1} ${operand} ${num2}`;
  const result = eval(expression);
  return { expression, result };
}

// Function to render the CAPTCHA
function renderCaptcha() {
  const captchaContainer = document.getElementById("captcha");
  const { expression, result } = generateCaptcha();
  captchaContainer.textContent = `Please solve: ${expression}`;
  captchaContainer.dataset.result = result;
}

// Function to validate the form with CAPTCHA
function validateForm() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const captchaInput = document.getElementById("captchaInput").value;
  const captchaResult = parseInt(
    document.getElementById("captcha").dataset.result
  );

  if (!email || !password) {
    alert("Email and password are required.");
    return false;
  }

  if (captchaInput.trim() === "") {
    alert("Please enter the result.");
    return false;
  }

  if (parseInt(captchaInput) !== captchaResult) {
    alert("Incorrect result. Please try again.");
    refreshCaptcha(); // Refresh CAPTCHA
    return false;
  }

  // If CAPTCHA is correct, proceed with login
  printMessage();
  return false;
}

// Function to send login credentials and CAPTCHA result to server and display response
function printMessage() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const captchaInput = document.getElementById("captchaInput").value;
  const captchaResult = document.getElementById("captcha").dataset.result;

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, captchaInput, captchaResult }),
  })
    .then((response) => response.json()) // Always parse response as JSON
    .then((data) => {
      // Handle the JSON response here
      console.log(data);
      if (data.message === "Login successful.") {
        // Set login status in session storage
        localStorage.setItem("isLoggedIn", "true");
        // Redirect to home.html upon successful login
        window.location.href = data.redirect;
      } else {
        // Display error message to the user
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Show an error message to the user
      alert("An error occurred. Please try again.");
    });
}

// Function to handle refresh of CAPTCHA
function refreshCaptcha() {
  renderCaptcha();
}

// Check login status on page load and redirect if logged in
window.onload = function () {
  if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "http://localhost:3000/home.html"; // Redirect to home page
  } else {
    renderCaptcha();
  }
};
