// ======= TRAIL DATA (can be imported or duplicated from scripts.js) =======
const allTrails = [
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
    image: "images/_pamushana_-09082025-0001.jpg",
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

// ======= DISPLAY TRAILS =======
function displayTrails(trails) {
  const container = document.querySelector("#trails-list");
  container.innerHTML = "";

  trails.forEach(trail => {
    const trailCard = `
      <article class="trail-card">
        <img src="${trail.image}" alt="${trail.name}" loading="lazy">
        <h3>${trail.name}</h3>
        <p><strong>Difficulty:</strong> ${trail.difficulty}</p>
        <p><strong>Region:</strong> ${trail.region}</p>
        <p><strong>Distance:</strong> ${trail.distance}</p>
        <p>${trail.description}</p>
      </article>
    `;
    container.innerHTML += trailCard;
  });
}

// ======= FILTER FUNCTION =======
function filterTrails(difficulty) {
  if (difficulty === "all") {
    displayTrails(allTrails);
  } else {
    const filtered = allTrails.filter(trail => trail.difficulty === difficulty);
    displayTrails(filtered);
  }
}

// ======= EVENT LISTENERS =======
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const difficulty = btn.getAttribute("data-difficulty");
    filterTrails(difficulty);
  });
});

// ======= INIT PAGE =======
document.addEventListener("DOMContentLoaded", () => {
  displayTrails(allTrails);
});
