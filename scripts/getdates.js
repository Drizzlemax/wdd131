// Get the current year for the footer
document.addEventListener("DOMContentLoaded", function () {
    const yearSpan = document.getElementById('currentyear');
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;

    // Last Modified Date
    const lastModifiedSpan = document.getElementById('lastModified');
    const lastModifiedDate = document.lastModified;
    lastModifiedSpan.textContent = lastModifiedDate;
});
