document.addEventListener("DOMContentLoaded", function () {
  const joinButton = document.getElementById("joinButton");
  if (joinButton) {
    joinButton.addEventListener("click", function () {
      window.location.href = "login.html";
    });
  }
});
