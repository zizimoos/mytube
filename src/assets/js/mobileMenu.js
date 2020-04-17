const mobileMenu = document.getElementById("mobileMenuBar");
const mobileWindow = document.getElementById("mobileMenuwindow");

const mouseEnter = () => {
  console.log("mouseenter");
  mobileWindow.style.display = "block";
};

const mouseLeave = () => {
  mobileWindow.style.display = "none";
};

const init = () => {
  mobileMenu.addEventListener("mouseenter", mouseEnter);
  mobileWindow.addEventListener("mouseleave", mouseLeave);
};

init();
