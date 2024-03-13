document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.getElementById("registrationForm");

  registrationForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Retrieve form field values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value.trim();

    // Perform form validation
    const isValid = validateForm(name, email, password, phone, dob);

    if (isValid) {
      // If validation passes, submit the form
      const userData = { name, email, password, phone, dob };
      submitForm(userData);
    }
  });
});

function validateForm(name, email, password, phone, dob) {
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const phoneError = document.getElementById("phoneError");
  const dobError = document.getElementById("dobError");
  const errorMessages = document.getElementById("errorMessages");

  // Clear previous error messages
  nameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  phoneError.textContent = "";
  dobError.textContent = "";
  errorMessages.innerHTML = "";

  let isValid = true;

  if (name === "") {
    nameError.textContent = "Name is required";
    isValid = false;
  }

  if (email === "") {
    emailError.textContent = "Email is required";
    isValid = false;
  }

  if (password === "") {
    passwordError.textContent = "Password is required";
    isValid = false;
  }

  if (phone === "") {
    phoneError.textContent = "Phone number is required";
    isValid = false;
  }

  if (dob === "") {
    dobError.textContent = "Date of Birth is required";
    isValid = false;
  }

  return isValid;
}

function submitForm(userData) {
  fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Handle successful response
      console.log(data);
      alert("Registration successful!");
      document.getElementById("registrationForm").reset(); // Clear form fields
    })
    .catch((error) => {
      // Handle errors
      console.error("Error:", error);
      const errorMessages = document.getElementById("errorMessages");
      errorMessages.innerHTML = `<div class="error">An error occurred during registration. Please try again.</div>`;
    });
}
