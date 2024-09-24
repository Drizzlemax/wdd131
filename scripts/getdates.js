// getdates.js
document.addEventListener("DOMContentLoaded", function () {
    const yearSpan = document.getElementById('currentyear');
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;
});
