// community.js

// Elements
const postForm = document.getElementById("postForm");
const postsContainer = document.getElementById("postsContainer");
const yearSpan = document.getElementById("year");

// Set current year in footer
yearSpan.textContent = new Date().getFullYear();

// Load posts from localStorage when page loads
document.addEventListener("DOMContentLoaded", loadPosts);

// Handle form submission
postForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const message = document.getElementById("message").value.trim();
    const photoInput = document.getElementById("photo");

    if (!username || !message) {
        alert("Please fill out your name and story before posting.");
        return;
    }

    // Prepare post object
    const newPost = {
        username,
        message,
        date: new Date().toLocaleString(),
        photo: ""
    };

    // If photo uploaded, store as base64
    if (photoInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (event) {
            newPost.photo = event.target.result;
            savePost(newPost);
            displayPost(newPost);
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        savePost(newPost);
        displayPost(newPost);
    }

    // Reset form
    postForm.reset();
});

// Save post to localStorage
function savePost(post) {
    const posts = JSON.parse(localStorage.getItem("communityPosts")) || [];
    posts.unshift(post); // Add to top
    localStorage.setItem("communityPosts", JSON.stringify(posts));
}

// Load posts from localStorage
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem("communityPosts")) || [];
    posts.forEach(displayPost);
}

// Display a post in the DOM
function displayPost(post) {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    let photoHTML = "";
    if (post.photo) {
        photoHTML = `<img src="${post.photo}" alt="Photo from ${post.username}">`;
    }

    postDiv.innerHTML = `
        <div class="post-header">
            <strong>${post.username}</strong> 
            <span class="date">${post.date}</span>
        </div>
        <p>${post.message}</p>
        ${photoHTML}
    `;

    postsContainer.prepend(postDiv);
}
