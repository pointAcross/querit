function showContent(contentId) {
  // Hide all content sections
  document.getElementById("content-home").style.display = "none";
  document.getElementById("content-posts").style.display = "none";
  document.getElementById("content-thread").style.display = "none";
  document.getElementById("content-notifications").style.display = "none";
  document.getElementById("content-profile").style.display = "none";

  // Show the selected content section
  document.getElementById("content-" + contentId).style.display = "block";
  document.getElementById("content-" + contentId).attribute = "contentId";
}
function onHover(x, src) {
  x.src = src;
}
function onMouseOut(x, src) {
  x.src = src;
}
