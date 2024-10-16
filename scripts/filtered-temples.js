document.addEventListener("DOMContentLoaded", function () {
    const yearSpan = document.getElementById('currentyear');
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;
  
    // Last Modified Date
    const lastModifiedSpan = document.getElementById('lastModified');
    const lastModifiedDate = document.lastModified;
    lastModifiedSpan.textContent = lastModifiedDate;
  
    const hamburgerButton = document.getElementById("hamburgerButton");
    const nav = document.querySelector("nav");
    hamburgerButton.addEventListener("click", () => {
      nav.classList.toggle("active");
      hamburgerButton.classList.toggle("active");
    });
  
    const temples = [
      // Your existing temple objects
      {
        templeName: "Aba Nigeria",
        location: "Aba, Nigeria",
        dedicated: "2005, August, 7",
        area: 11500,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
      },
      // Add more temple objects here...
    ];
  
    const container = document.getElementById('temples-container');
  
    const displayTemples = (templesArray) => {
      container.innerHTML = ''; // Clear the container
  
      templesArray.forEach(temple => {
        const card = document.createElement('div');
        card.classList.add('temple-card');
  
        const img = document.createElement('img');
        img.src = temple.imageUrl;
        img.alt = temple.templeName;
        img.loading = 'lazy';
  
        const name = document.createElement('h3');
        name.textContent = temple.templeName;
  
        const location = document.createElement('p');
        location.textContent = `Location: ${temple.location}`;
  
        const dedicated = document.createElement('p');
        dedicated.textContent = `Dedicated: ${temple.dedicated}`;
  
        const area = document.createElement('p');
        area.textContent = `Area: ${temple.area} sq ft`;
  
        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(location);
        card.appendChild(dedicated);
        card.appendChild(area);
  
        container.appendChild(card);
      });
    };
  
    displayTemples(temples); // Display all temples on page load
  
    // Event listeners for navigation menu items
    document.getElementById('home').addEventListener('click', () => {
      displayTemples(temples);
    });
  
    document.getElementById('old').addEventListener('click', () => {
      const oldTemples = temples.filter(temple => new Date(temple.dedicated).getFullYear() < 1900);
      displayTemples(oldTemples);
    });
  
    document.getElementById('new').addEventListener('click', () => {
      const newTemples = temples.filter(temple => new Date(temple.dedicated).getFullYear() > 2000);
      displayTemples(newTemples);
    });
  
    document.getElementById('large').addEventListener('click', () => {
      const largeTemples = temples.filter(temple => temple.area > 90000);
      displayTemples(largeTemples);
    });
  
    document.getElementById('small').addEventListener('click', () => {
      const smallTemples = temples.filter(temple => temple.area < 10000);
      displayTemples(smallTemples);
    });
  });
  