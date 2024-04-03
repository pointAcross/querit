// Function to generate a random CAPTCHA
function generateCaptcha(captchaId) {
  const captchaElement = document.getElementById(captchaId);
  if (captchaElement) {
    let captchaStr = "";
    const alphaNums =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 7; i++) {
      captchaStr += alphaNums.charAt(
        Math.floor(Math.random() * alphaNums.length)
      );
    }
    captchaElement.textContent = captchaStr;
  }
}

// Function to handle sign-in form submission
function signIn(event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Retrieve input values
  var email = document.getElementById("email_in").value;
  var password = document.getElementById("password_in").value;
  var captchaInput = document.getElementById("captchaInput1").value;

  // Retrieve captcha value for comparison
  var captchaValue = document.getElementById("captcha1").innerText;

  // Validate email, password, and captcha
  if (
    email.trim() === "" ||
    password.trim() === "" ||
    captchaInput.trim() === ""
  ) {
    alert("Please fill in all fields.");
    return;
  }

  // Validate captcha
  if (captchaInput !== captchaValue) {
    alert("Captcha is incorrect. Please try again.");
    return;
  }

  // If all validations pass, make fetch request to server
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
      captchaInput: captchaInput,
      captchaResult: captchaValue,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Display error message dynamically
      // alert(data.message);
      if (data.redirect) {
        window.location.href = data.redirect;
      } else {
        alert("Incorrect email or password. Please try again.");
      }
    })
    .catch((error) => console.error("Error:", error));
}

// Function to handle sign-up form submission
function signUp(event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Retrieve input values
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var captchaInput = document.getElementById("captchaInput2").value;

  // Retrieve captcha value for comparison
  var captchaValue = document.getElementById("captcha2").innerText;

  // Validate name, email, password, and captcha
  if (
    name.trim() === "" ||
    email.trim() === "" ||
    password.trim() === "" ||
    captchaInput.trim() === ""
  ) {
    alert("Please fill in all fields.");
    return;
  }

  // Validate captcha
  if (captchaInput !== captchaValue) {
    alert("Captcha is incorrect. Please try again.");
    return;
  }

  /// If all validations pass, make fetch request to server
  fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      // Reload the page if registration is successful
      if (data.message === "User registration successful.") {
        location.reload();
      }
    })
    .catch((error) => console.error("Error:", error));
}

// Ensure captchas load when page loads
window.onload = function () {
  generateCaptcha("captcha1");
  generateCaptcha("captcha2");
};

// Get reference to sign-in and sign-up buttons
const signInButton = document.getElementById("signIn");
const signUpButton = document.getElementById("signUp");
const container = document.querySelector(".container");

// Add event listeners to the buttons
signInButton.addEventListener("click", function (e) {
  e.preventDefault();
  container.classList.remove("right-panel-active");
});

signUpButton.addEventListener("click", function (e) {
  e.preventDefault();
  container.classList.add("right-panel-active");
});

// Ensure that only one event listener is attached to the form submission
document.getElementById("loginForm").addEventListener("submit", signIn);
// Ensure that only one event listener is attached to the sign-up form submission
document.getElementById("signUpForm").addEventListener("submit", signUp);
