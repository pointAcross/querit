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
    .then((response) => {
      if (response.ok) {
        // Check if response is a redirection
        if (response.redirected) {
          window.location.href = response.url;
        } else {
          throw new Error("Server response is not JSON");
        }
      } else {
        throw new Error("Server response is not JSON");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Function to handle refresh of CAPTCHA
function refreshCaptcha() {
  renderCaptcha();
}

// Render CAPTCHA on page load
window.onload = function () {
  renderCaptcha();
};
