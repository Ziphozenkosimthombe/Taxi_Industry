const contactForm = document.querySelector(".contact-form");
let name = document.getElementById("name");
let email = document.getElementById("email");
let subject = document.getElementById("subject");
let message = document.getElementById("message");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let formData = {
    name: name.value,
    email: email.value,
    subject: subject.value,
    message: message.value,
  };

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/post/contact");
  xhr.setRequestHeader("Content-Type", "application/json"); // Set content type to JSON
  xhr.onload = function () {
    console.log(xhr.responseText);
    if (xhr.responseText === "success") {
      alert("Email sent");
      name.value = "";
      email.value = "";
      subject.value = "";
      message.value = "";
    } else {
      alert("something went wrong");
    }
  };

  // Convert formData to JSON and send it
  xhr.send(JSON.stringify(formData));
});

