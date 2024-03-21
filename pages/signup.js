function validateForm() {
    var name = document.getElementById("name").value;
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm-password").value;

    var valid = true;

    if (name === "") {
        document.getElementById("name-error").innerHTML = "Please enter your name";
        valid = false;
    } else {
        document.getElementById("name-error").innerHTML = "";
    }

    if (username === "") {
        document.getElementById("username-error").innerHTML = "Please enter a username";
        valid = false;
    } else {
        document.getElementById("username-error").innerHTML = "";
    }

    if (email === "") {
        document.getElementById("email-error").innerHTML = "Please enter your email";
        valid = false;
    } else {
        document.getElementById("email-error").innerHTML = "";
    }

    if (phone === "") {
        document.getElementById("phone-error").innerHTML = "Please enter your phone number";
        valid = false;
    } else {
        document.getElementById("phone-error").innerHTML = "";
    }

    if (password === "") {
        document.getElementById("password-error").innerHTML = "Please enter a password";
        valid = false;
    } else {
        document.getElementById("password-error").innerHTML = "";
    }

    if (password !== confirmPassword) {
        document.getElementById("confirm-password-error").innerHTML = "Passwords do not match";
        valid = false;
    }

    return valid;
}