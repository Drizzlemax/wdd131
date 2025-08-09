// ======= GLOBAL DATA =======
const featuredTrails = [
  {
    name: "Nyanga Mountain Trail",
    difficulty: "Easy",
    distance: "4 km",
    region: "Eastern Highlands",
    season: "Spring",
    image: "images/4x4ventures_sa-08082025-0010.jpg",
    description: "Gentle slopes with lush green views and clear skies."
  },
  {
    name: "Matopos Rock Path",
    difficulty: "Moderate",
    distance: "8 km",
    region: "Matopos National Park",
    season: "Dry Season",
    image: "images/bosnian_girl_in_africa-08082025-0002.webp",
    description: "Unique balancing rock formations and cultural sites."
  },
  {
    name: "Chimanimani Ridge",
    difficulty: "Challenging",
    distance: "15 km",
    region: "Chimanimani",
    season: "Winter",
    image: "images/iconicmoments.travel-09082025-0001.jpg",
    description: "Steep climb with breathtaking mountain views."
  },
  {
    name: "Vumba Botanical Trail",
    difficulty: "Easy",
    distance: "3 km",
    region: "Eastern Highlands",
    season: "Summer",
    image: "images/putjepathfinder-09082025-0001.jpg",
    description: "A short scenic route through botanical gardens."
  }
];

// ======= NAV MENU TOGGLE =======
const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

// ======= FEATURED TRAILS DISPLAY =======
function displayFeaturedTrails() {
  const container = document.querySelector("#featured-container");
  container.innerHTML = "";

  featuredTrails.forEach(trail => {
    const trailCard = `
      <article class="trail-card">
        <img src="${trail.image}" alt="${trail.name}" loading="lazy">
        <h3>${trail.name}</h3>
        <p><strong>Difficulty:</strong> ${trail.difficulty}</p>
        <p><strong>Distance:</strong> ${trail.distance}</p>
        <p>${trail.description}</p>
      </article>
    `;
    container.innerHTML += trailCard;
  });
}

// ======= SEARCH FUNCTIONALITY =======
function searchTrails(query) {
  const results = featuredTrails.filter(trail =>
    trail.name.toLowerCase().includes(query) ||
    trail.difficulty.toLowerCase().includes(query) ||
    trail.season.toLowerCase().includes(query)
  );

  const container = document.querySelector("#featured-container");
  container.innerHTML = "";

  if (results.length > 0) {
    results.forEach(trail => {
      const trailCard = `
        <article class="trail-card">
          <img src="${trail.image}" alt="${trail.name}" loading="lazy">
          <h3>${trail.name}</h3>
          <p><strong>Difficulty:</strong> ${trail.difficulty}</p>
          <p><strong>Distance:</strong> ${trail.distance}</p>
          <p>${trail.description}</p>
        </article>
      `;
      container.innerHTML += trailCard;
    });
  } else {
    container.innerHTML = `<p>No trails found matching your search.</p>`;
  }
}

// ======= FORM HANDLER =======
const searchForm = document.querySelector("#trail-search-form");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = document.querySelector("#search").value.trim().toLowerCase();

  if (query) {
    localStorage.setItem("lastSearch", query);
    searchTrails(query);
  } else {
    displayFeaturedTrails();
  }
});

// ======= LOAD LAST SEARCH FROM LOCALSTORAGE =======
function loadLastSearch() {
  const lastSearch = localStorage.getItem("lastSearch");
  if (lastSearch) {
    document.querySelector("#search").value = lastSearch;
    searchTrails(lastSearch);
  } else {
    displayFeaturedTrails();
  }
}

// ======= INITIALIZE PAGE =======
document.addEventListener("DOMContentLoaded", loadLastSearch);
