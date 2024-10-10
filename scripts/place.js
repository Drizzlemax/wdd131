// script.js
window.addEventListener('resize', toggleSecondHeroImage);
window.addEventListener('load', toggleSecondHeroImage); // Check on page load

function toggleSecondHeroImage() {
    const secondHeroImage = document.querySelector('.hero-img.hero2');
    if (window.innerWidth > 768) { // Change this value as needed
        secondHeroImage.style.display = 'block'; // Show on wider screens
    } else {
        secondHeroImage.style.display = 'none'; // Hide on narrower screens
    }
}
