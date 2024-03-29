document
  .getElementById("reset-password-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    fetch("/resetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, newPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Password reset successful!");
          window.location.href = "/login.html";
        } else {
          alert("Error resetting password: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error resetting password.");
      });
  });
