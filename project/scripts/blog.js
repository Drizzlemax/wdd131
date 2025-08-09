// blog.js - Zimbabwe Hiking Guide Blog JavaScript

// Global state management
const BlogState = {
    posts: [],
    filteredPosts: [],
    currentFilter: '',
    currentSearch: '',
    postsPerPage: 6,
    currentPage: 1,
    totalPosts: 0
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeBlog();
    initializeSearch();
    initializeFiltering();
    initializeAnimations();
    initializeMobileNavigation();
    initializeNewsletter();
    initializeUtilities();
    initializeAccessibility();
    loadInitialPosts();
});

// ===== BLOG INITIALIZATION =====
function initializeBlog() {
    // Extract existing posts from DOM
    extractPostsFromDOM();
    
    // Set up pagination
    setupPagination();
    
    // Initialize view counters
    initializeViewTracking();
}

function extractPostsFromDOM() {
    const postCards = document.querySelectorAll('.post-card');
    BlogState.posts = Array.from(postCards).map((card, index) => {
        const title = card.querySelector('h3 a').textContent;
        const category = card.dataset.category || '';
        const date = card.dataset.date || '';
        const excerpt = card.querySelector('p').textContent;
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent);
        const readTime = card.querySelector('.read-time').textContent;
        const image = card.querySelector('img').src;
        const link = card.querySelector('h3 a').href;
        
        return {
            id: index + 1,
            title,
            category,
            date,
            excerpt,
            tags,
            readTime,
            image,
            link,
            element: card,
            views: Math.floor(Math.random() * 500) + 50 // Simulated view count
        };
    });
    
    BlogState.filteredPosts = [...BlogState.posts];
    BlogState.totalPosts = BlogState.posts.length;
}

function loadInitialPosts() {
    // Add view counters to existing posts
    BlogState.posts.forEach(post => {
        addViewCounter(post.element, post.views);
    });
    
    // Set up lazy loading for images
    setupLazyLoading();
}

function addViewCounter(postElement, views) {
    const postMeta = postElement.querySelector('.post-meta');
    const viewCounter = document.createElement('span');
    viewCounter.className = 'view-count';
    viewCounter.innerHTML = `👁️ ${views} views`;
    postMeta.appendChild(viewCounter);
}

// ===== SEARCH FUNCTIONALITY =====
function initializeSearch() {
    const searchInput = document.getElementById('blog-search');
    const searchButton = document.querySelector('.search-button');
    
    // Debounced search for performance
    const debouncedSearch = debounce(performSearch, 300);
    
    searchInput.addEventListener('input', function(e) {
        BlogState.currentSearch = e.target.value.toLowerCase().trim();
        debouncedSearch();
    });
    
    searchButton.addEventListener('click', performSearch);
    
    // Search on Enter key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
    
    function performSearch() {
        const searchTerm = BlogState.currentSearch;
        
        if (!searchTerm) {
            BlogState.filteredPosts = [...BlogState.posts];
        } else {
            BlogState.filteredPosts = BlogState.posts.filter(post => {
                return post.title.toLowerCase().includes(searchTerm) ||
                       post.excerpt.toLowerCase().includes(searchTerm) ||
                       post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                       post.category.toLowerCase().includes(searchTerm);
            });
        }
        
        // Apply current category filter as well
        if (BlogState.currentFilter) {
            BlogState.filteredPosts = BlogState.filteredPosts.filter(post => 
                post.category === BlogState.currentFilter
            );
        }
        
        updatePostsDisplay();
        announceSearchResults();
    }
    
    function announceSearchResults() {
        const count = BlogState.filteredPosts.length;
        const message = count === 0 
            ? 'No posts found matching your search'
            : `Found ${count} post${count === 1 ? '' : 's'} matching your search`;
        
        if (window.announceToScreenReader) {
            window.announceToScreenReader(message);
        }
    }
}

// ===== FILTERING FUNCTIONALITY =====
function initializeFiltering() {
    const categoryFilter = document.getElementById('category-filter');
    
    categoryFilter.addEventListener('change', function(e) {
        BlogState.currentFilter = e.target.value;
        applyFilters();
    });
    
    // Tag links filtering
    const tagLinks = document.querySelectorAll('.tag-link');
    tagLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            BlogState.currentFilter = category;
            categoryFilter.value = category;
            applyFilters();
            
            // Scroll to posts section
            document.querySelector('.blog-posts').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    function applyFilters() {
        let filtered = [...BlogState.posts];
        
        // Apply search filter
        if (BlogState.currentSearch) {
            const searchTerm = BlogState.currentSearch;
            filtered = filtered.filter(post => {
                return post.title.toLowerCase().includes(searchTerm) ||
                       post.excerpt.toLowerCase().includes(searchTerm) ||
                       post.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            });
        }
        
        // Apply category filter
        if (BlogState.currentFilter) {
            filtered = filtered.filter(post => post.category === BlogState.currentFilter);
        }
        
        BlogState.filteredPosts = filtered;
        updatePostsDisplay();
        announceFilterResults();
    }
    
    function announceFilterResults() {
        const count = BlogState.filteredPosts.length;
        const filterName = BlogState.currentFilter || 'all categories';
        const message = `Showing ${count} post${count === 1 ? '' : 's'} in ${filterName}`;
        
        if (window.announceToScreenReader) {
            window.announceToScreenReader(message);
        }
    }
}

// ===== POSTS DISPLAY MANAGEMENT =====
function updatePostsDisplay() {
    const postsGrid = document.querySelector('.posts-grid');
    const allPosts = document.querySelectorAll('.post-card');
    
    // Hide all posts first
    allPosts.forEach(post => {
        post.style.display = 'none';
        post.classList.remove('fade-in', 'visible');
    });
    
    // Show filtered posts
    BlogState.filteredPosts.forEach((post, index) => {
        const postElement = post.element;
        postElement.style.display = 'block';
        
        // Staggered animation
        setTimeout(() => {
            postElement.classList.add('fade-in', 'visible');
        }, index * 100);
    });
    
    // Update load more button
    updateLoadMoreButton();
    
    // Show no results message if needed
    showNoResultsMessage();
}

function updateLoadMoreButton() {
    const loadMoreContainer = document.querySelector('.load-more-container');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (BlogState.filteredPosts.length <= BlogState.postsPerPage) {
        loadMoreContainer.style.display = 'none';
    } else {
        loadMoreContainer.style.display = 'block';
        loadMoreBtn.addEventListener('click', loadMorePosts);
    }
}

function loadMorePosts() {
    // Simulate loading more posts
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const originalText = loadMoreBtn.textContent;
    
    loadMoreBtn.textContent = 'Loading...';
    loadMoreBtn.disabled = true;
    
    setTimeout(() => {
        // In a real app, this would fetch more posts from an API
        createAdditionalPosts();
        
        loadMoreBtn.textContent = originalText;
        loadMoreBtn.disabled = false;
        
        if (window.announceToScreenReader) {
            window.announceToScreenReader('More posts loaded');
        }
    }, 1500);
}

function createAdditionalPosts() {
    const postsGrid = document.querySelector('.posts-grid');
    const additionalPosts = [
        {
            title: "Chinanimani Mountains: Hidden Waterfalls and Secret Trails",
            category: "trail-guide",
            date: "2025-07-05",
            excerpt: "Discover the lesser-known trails of Chinanimani Mountains, where pristine waterfalls and untouched wilderness await adventurous hikers.",
            tags: ["chinanimani", "waterfalls", "wilderness"],
            readTime: "11 min read",
            image: "images/_pamushana_-09082025-0001.jpg",
        },
        {
            title: "Seasonal Hiking Calendar: When to Visit Zimbabwe's Best Trails",
            category: "hiking-tips",
            date: "2025-06-30",
            excerpt: "Plan your hiking adventures with our comprehensive seasonal guide. Learn the best times to visit each region for optimal weather and wildlife viewing.",
            tags: ["seasons", "planning", "weather"],
            readTime: "8 min read",
            image: "images/trekroute.np-08082025-0001.jpg",
        }
    ];
    
    additionalPosts.forEach((postData, index) => {
        const postElement = createPostCard(postData, BlogState.posts.length + index + 1);
        postsGrid.appendChild(postElement);
        
        // Add to state
        BlogState.posts.push({
            ...postData,
            id: BlogState.posts.length + 1,
            element: postElement,
            views: Math.floor(Math.random() * 300) + 25
        });
        
        // Animate in
        setTimeout(() => {
            postElement.classList.add('fade-in', 'visible');
        }, index * 200);
    });
    
    // Update filtered posts if no filters active
    if (!BlogState.currentFilter && !BlogState.currentSearch) {
        BlogState.filteredPosts = [...BlogState.posts];
    }
}

function createPostCard(postData, id) {
    const article = document.createElement('article');
    article.className = 'post-card';
    article.dataset.category = postData.category;
    article.dataset.date = postData.date;
    
    article.innerHTML = `
        <div class="post-image">
            <img src="${postData.image}" alt="${postData.title}" loading="lazy">
            <div class="read-time">${postData.readTime}</div>
        </div>
        <div class="post-content">
            <div class="post-meta">
                <span class="category">${postData.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                <time datetime="${postData.date}">${formatDate(postData.date)}</time>
                <span class="view-count">👁️ ${Math.floor(Math.random() * 300) + 25} views</span>
            </div>
            <h3><a href="#post-${id}">${postData.title}</a></h3>
            <p>${postData.excerpt}</p>
            <div class="post-tags">
                ${postData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <a href="#post-${id}" class="read-more" aria-label="Read article: ${postData.title}">Read More →</a>
        </div>
    `;
    
    return article;
}

function showNoResultsMessage() {
    const postsGrid = document.querySelector('.posts-grid');
    let noResultsMsg = document.querySelector('.no-results-message');
    
    if (BlogState.filteredPosts.length === 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <div class="no-results-content">
                    <h3>No posts found</h3>
                    <p>Try adjusting your search terms or filter settings.</p>
                    <button type="button" class="clear-filters-btn">Clear All Filters</button>
                </div>
            `;
            postsGrid.appendChild(noResultsMsg);
            
            // Clear filters functionality
            noResultsMsg.querySelector('.clear-filters-btn').addEventListener('click', clearAllFilters);
        }
        noResultsMsg.style.display = 'block';
    } else if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
}

function clearAllFilters() {
    document.getElementById('blog-search').value = '';
    document.getElementById('category-filter').value = '';
    BlogState.currentSearch = '';
    BlogState.currentFilter = '';
    BlogState.filteredPosts = [...BlogState.posts];
    updatePostsDisplay();
    
    if (window.announceToScreenReader) {
        window.announceToScreenReader('All filters cleared');
    }
}

// ===== ANIMATIONS & VISUAL EFFECTS =====
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observe sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (!section.classList.contains('blog-hero')) {
            section.classList.add('fade-in');
            observer.observe(section);
        }
    });
    
    // Hero section special animation
    animateHeroSection();
    
    // Back to top button
    initializeBackToTop();
    
    function handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Special handling for posts grid
                if (entry.target.classList.contains('blog-posts')) {
                    animatePostCards();
                }
            }
        });
    }
    
    function animateHeroSection() {
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');
        
        setTimeout(() => {
            heroContent.classList.add('fade-in', 'visible');
        }, 200);
        
        setTimeout(() => {
            heroImage.classList.add('fade-in', 'visible');
        }, 400);
    }
    
    function animatePostCards() {
        const visiblePosts = document.querySelectorAll('.post-card:not([style*="display: none"])');
        visiblePosts.forEach((post, index) => {
            setTimeout(() => {
                post.classList.add('slide-up');
            }, index * 150);
        });
    }
}

function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    // Show/hide based on scroll position
    const toggleBackToTop = throttle(() => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, 100);
    
    window.addEventListener('scroll', toggleBackToTop);
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Focus management for accessibility
        document.querySelector('main').focus();
    });
}

// ===== MOBILE NAVIGATION =====
function initializeMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const nav = document.querySelector('nav');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-open');
            this.classList.toggle('active');
            
            // Update aria-expanded for accessibility
            const isOpen = navLinks.classList.contains('mobile-open');
            this.setAttribute('aria-expanded', isOpen);
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target)) {
                navLinks.classList.remove('mobile-open');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close mobile menu when pressing Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navLinks.classList.contains('mobile-open')) {
                navLinks.classList.remove('mobile-open');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.focus();
            }
        });
    }
}

// ===== NEWSLETTER FUNCTIONALITY =====
function initializeNewsletter() {
    const newsletterForm = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('newsletter-email');
    const subscribeBtn = document.querySelector('.subscribe-btn');
    
    newsletterForm.addEventListener('submit', handleNewsletterSubmission);
    
    // Real-time email validation
    emailInput.addEventListener('input', validateEmail);
    emailInput.addEventListener('blur', validateEmail);
    
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        clearFieldError(emailInput);
        
        if (email && !emailRegex.test(email)) {
            showFieldError(emailInput, 'Please enter a valid email address');
            return false;
        }
        
        if (email && emailRegex.test(email)) {
            emailInput.classList.add('valid');
        }
        
        return true;
    }
    
    function handleNewsletterSubmission(event) {
        event.preventDefault();
        
        if (!validateEmail()) {
            return;
        }
        
        const email = emailInput.value.trim();
        
        // Show loading state
        subscribeBtn.disabled = true;
        subscribeBtn.textContent = 'Subscribing...';
        
        // Simulate API call
        setTimeout(() => {
            showNewsletterSuccess();
            emailInput.value = '';
            emailInput.classList.remove('valid');
            
            // Reset button
            subscribeBtn.disabled = false;
            subscribeBtn.textContent = 'Subscribe';
            
            if (window.announceToScreenReader) {
                window.announceToScreenReader('Successfully subscribed to newsletter');
            }
        }, 2000);
    }
    
    function showNewsletterSuccess() {
        const successMessage = document.createElement('div');
        successMessage.className = 'newsletter-success';
        successMessage.innerHTML = `
            <p>✅ Thank you for subscribing! Check your email for confirmation.</p>
        `;
        
        const formGroup = newsletterForm.querySelector('.form-group');
        newsletterForm.insertBefore(successMessage, formGroup);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }
}

// ===== UTILITY FUNCTIONS =====
function initializeUtilities() {
    // Dynamic copyright year
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Reading time calculations
    calculateReadingTimes();
    
    // Social sharing preparation
    initializeSocialSharing();
    
    // Post interaction tracking
    initializePostTracking();
}

function calculateReadingTimes() {
    // Average reading speed: 200 words per minute
    const averageWordsPerMinute = 200;
    
    BlogState.posts.forEach(post => {
        const wordCount = post.excerpt.split(' ').length * 10; // Estimate full article length
        const readingTime = Math.ceil(wordCount / averageWordsPerMinute);
        
        // Update the reading time display
        const readTimeElement = post.element.querySelector('.read-time');
        if (readTimeElement && readingTime > 0) {
            readTimeElement.textContent = `${readingTime} min read`;
        }
    });
}

function initializeSocialSharing() {
    // Add social share buttons to featured post
    const featuredArticle = document.querySelector('.featured-article');
    if (featuredArticle) {
        const shareContainer = document.createElement('div');
        shareContainer.className = 'social-share';
        shareContainer.innerHTML = `
            <span>Share:</span>
            <button type="button" class="share-btn" data-platform="twitter" aria-label="Share on Twitter">Twitter</button>
            <button type="button" class="share-btn" data-platform="facebook" aria-label="Share on Facebook">Facebook</button>
            <button type="button" class="share-btn" data-platform="linkedin" aria-label="Share on LinkedIn">LinkedIn</button>
        `;
        
        featuredArticle.querySelector('.featured-content').appendChild(shareContainer);
        
        // Add click handlers
        const shareButtons = shareContainer.querySelectorAll('.share-btn');
        shareButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const platform = this.dataset.platform;
                const url = window.location.href;
                const title = document.title;
                
                shareOnPlatform(platform, url, title);
            });
        });
    }
}

function shareOnPlatform(platform, url, title) {
    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

function initializePostTracking() {
    // Track post clicks for analytics
    const postLinks = document.querySelectorAll('.post-card a, .featured-article a');
    
    postLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const postTitle = this.closest('article').querySelector('h3').textContent;
            trackPostClick(postTitle);
        });
    });
}

function trackPostClick(postTitle) {
    // In a real application, this would send analytics data
    console.log(`Post clicked: ${postTitle}`);
    
    // Update view count
    const postCard = Array.from(document.querySelectorAll('.post-card')).find(card => 
        card.querySelector('h3').textContent === postTitle
    );
    
    if (postCard) {
        const viewCounter = postCard.querySelector('.view-count');
        if (viewCounter) {
            const currentViews = parseInt(viewCounter.textContent.match(/\d+/)[0]);
            viewCounter.innerHTML = `👁️ ${currentViews + 1} views`;
        }
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initializeAccessibility() {
    // Add focus management
    improveFocusManagement();
    
    // Add keyboard navigation for post cards
    addKeyboardNavigation();
    
    // Initialize live region for announcements
    addLiveRegion();
    
    function improveFocusManagement() {
        const focusableElements = document.querySelectorAll(
            'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.classList.add('keyboard-focus');
            });
            
            element.addEventListener('blur', function() {
                this.classList.remove('keyboard-focus');
            });
        });
    }
    
    function addKeyboardNavigation() {
        const postCards = document.querySelectorAll('.post-card');
        
        postCards.forEach(card => {
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    const mainLink = this.querySelector('h3 a');
                    if (mainLink) {
                        mainLink.click();
                    }
                }
            });
        });
    }
    
    function addLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.className = 'sr-only';
        
        document.body.appendChild(liveRegion);
        
        // Function to announce messages to screen readers
        window.announceToScreenReader = function(message) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        };
    }
}

// ===== HELPER FUNCTIONS =====
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.classList.remove('valid');
    
    // Remove existing error
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

function clearFieldError(field) {
    field.classList.remove('error', 'valid');
    
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function setupPagination() {
    // Future implementation for server-side pagination
    BlogState.currentPage = 1;
}

function initializeViewTracking() {
    // Set up view tracking for analytics
    const posts = document.querySelectorAll('.post-card, .featured-article');
    
    const viewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Track that post was viewed
                const postTitle = entry.target.querySelector('h3').textContent;
                trackPostView(postTitle);
            }
        });
    }, { threshold: 0.5 });
    
    posts.forEach(post => viewObserver.observe(post));
}

function trackPostView(postTitle) {
    // In a real application, this would send analytics data
    console.log(`Post viewed: ${postTitle}`);
}

function setupLazyLoading() {
    // Enhanced lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ===== PERFORMANCE UTILITIES =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(event) {
    console.error('Blog page error:', event.error);
    
    // Show user-friendly error message for critical failures
    if (event.error.message.includes('fetch') || event.error.message.includes('network')) {
        showGlobalMessage('Connection issue. Please check your internet and try again.', 'error');
    }
});

function showGlobalMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `global-message ${type}`;
    messageElement.innerHTML = `
        <p>${message}</p>
        <button type="button" class="close-message" aria-label="Close message">&times;</button>
    `;
    
    document.body.insertBefore(messageElement, document.body.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
    
    // Manual close
    messageElement.querySelector('.close-message').addEventListener('click', function() {
        messageElement.remove();
    });
}

// ===== EXPORT FOR GLOBAL ACCESS =====
window.ZimbabweBlog = {
    state: BlogState,
    search: debounce(performSearch, 300),
    filter: applyFilters,
    clearFilters: clearAllFilters,
    announceToScreenReader: window.announceToScreenReader
};