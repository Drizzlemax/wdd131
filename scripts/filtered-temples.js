// Current Year and Last Modified
let d = new Date();
document.getElementById("currentYear").innerHTML = `&copy;${d.getFullYear()}`;
document.querySelector('#lastModified').textContent = `Last Modification: ${document.lastModified}`;

// Hamburger Menu Toggle
const hambutton = document.querySelector('#hambutton');

hambutton.addEventListener('click', () => {
    document.querySelector('h1').classList.toggle('show');
    document.querySelector('#navmenu').classList.toggle('show');
    hambutton.classList.toggle('show');
});

//temple data
const temples = [
    {
        templeName: "Aba Nigeria",
        location: "Aba, Nigeria",
        dedicated: "2005, August, 7",
        area: 11500,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
    },
    {
        templeName: "Manti Utah",
        location: "Manti, Utah, United States",
        dedicated: "1888, May, 21",
        area: 74792,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
    },
    {
        templeName: "Payson Utah",
        location: "Payson, Utah, United States",
        dedicated: "2015, June, 7",
        area: 96630,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
    },
    {
        templeName: "Yigo Guam",
        location: "Yigo, Guam",
        dedicated: "2020, May, 2",
        area: 6861,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
    },
    {
        templeName: "Washington D.C.",
        location: "Kensington, Maryland, United States",
        dedicated: "1974, November, 19",
        area: 156558,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
    },
    {
        templeName: "Lima Perú",
        location: "Lima, Perú",
        dedicated: "1986, January, 10",
        area: 9600,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
    },
    {
        templeName: "Mexico City Mexico",
        location: "Mexico City, Mexico",
        dedicated: "1983, December, 2",
        area: 116642,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
    },
    {
        templeName: "Praia Cape Verde Temple",
        location: " Praia, Santiago Cape Verde ",
        dedicated: "2022, June, 19",
        area: 8759,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/praia-cape-verde-temple/praia-cape-verde-temple-27204-main.jpg"

    },
    {
        templeName: "Freetown Sierra Leone Temple",
        location: "Kossoh Town, Freetown, Sierra Leone",
        dedicated: "2019, October, 5",
        area: 18000,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/freetown-sierra-leone-temple/freetown-sierra-leone-temple-24087-main.jpg"

    },
    {
        templeName: "Stockholm Sweden Temple",
        location: "SE-13742 Västerhaninge, Sweden",
        dedicated: "1985, July, 4",
        area: 31000,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/stockholm-sweden-temple/stockholm-sweden-temple-30267-main.jpg"
    },
    // Add more temple objects here...
];



// Function to display temples
function displayTemples(templeList) {
    const templeCards = document.getElementById("templeCards");
    templeCards.innerHTML = '';  // Clear previous content

    templeList.forEach(temple => {
        const card = document.createElement('figure');
        card.innerHTML = `
        <img src="${temple.imageUrl}" alt="${temple.templeName}" loading="lazy">
        <figcaption>
          <h3>${temple.templeName}</h3>
          <p>Location: ${temple.location}</p>
          <p>Dedicated: ${temple.dedicated}</p>
          <p>Area: ${temple.area} sq. ft.</p>
        </figcaption>`;
        templeCards.appendChild(card);
    });
}

// Initial Display of All Temples
displayTemples(temples);

// Function to filter temples based on the navigation clicked
function filterTemples(filter) {
    let filteredTemples;

    if (filter === 'old') {
        filteredTemples = temples.filter(temple => new Date(temple.dedicated).getFullYear() < 1900);
    } else if (filter === 'new') {
        filteredTemples = temples.filter(temple => new Date(temple.dedicated).getFullYear() > 2000);
    } else if (filter === 'large') {
        filteredTemples = temples.filter(temple => temple.area > 90000);
    } else if (filter === 'small') {
        filteredTemples = temples.filter(temple => temple.area < 10000);
    } else {
        filteredTemples = temples;
    }

    displayTemples(filteredTemples);
}
