function validateReset() {
  const email = document.getElementById("email_reset").value;
  const newPassword = document.getElementById("new_password").value;
  const confirmNewPassword = document.getElementById("confirm_password").value;

  // Client-side validation for email and password fields
  if (!email || !newPassword || !confirmNewPassword) {
    alert("All fields are required.");
    return;
  }

  if (newPassword !== confirmNewPassword) {
    alert("Passwords do not match.");
    return;
  }

  // Send AJAX request to server for password reset
  const resetData = { email: email, newPassword: newPassword };
  fetch("/resetPassword", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resetData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert(
          "Password reset successful. Please log in with your new password."
        );
        window.location.href = "/login.html";
      } else {
        alert("Password reset failed: " + data.message);
      }
    })
    .catch((error) => console.error("Error:", error));
}

document
  .getElementById("resetForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    validateReset();
  });
