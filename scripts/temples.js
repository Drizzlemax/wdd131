document.addEventListener("DOMContentLoaded", function () {
    const yearSpan = document.getElementById('currentyear');
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;

    // Last Modified Date
    const lastModifiedSpan = document.getElementById('lastModified');
    const lastModifiedDate = document.lastModified;
    lastModifiedSpan.textContent = lastModifiedDate;
});


const hamburgerButton = document.getElementById("hamburgerButton");
const nav = document.querySelector("nav");

hamburgerButton.addEventListener("click", () => {
    nav.classList.toggle("active");
    hamburgerButton.classList.toggle("active");
})