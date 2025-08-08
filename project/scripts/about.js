// about.js - Zimbabwe Hiking Guide About Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeFormValidation();
    initializeAnimations();
    initializeTeamInteractions();
    initializeUtilities();
    initializeAccessibility();
});

// ===== FORM VALIDATION & HANDLING =====
function initializeFormValidation() {
    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Enhanced form submission
    contactForm.addEventListener('submit', handleFormSubmission);
    
    function validateField(event) {
        const field = event.target;
        const fieldName = field.name;
        const fieldValue = field.value.trim();
        
        // Remove existing error messages
        clearFieldError(event);
        
        let errorMessage = '';
        
        // Validation rules
        switch(fieldName) {
            case 'name':
                if (fieldValue.length < 2) {
                    errorMessage = 'Name must be at least 2 characters long';
                } else if (!/^[a-zA-Z\s]+$/.test(fieldValue)) {
                    errorMessage = 'Name can only contain letters and spaces';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(fieldValue)) {
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'message':
                if (fieldValue.length < 10) {
                    errorMessage = 'Message must be at least 10 characters long';
                } else if (fieldValue.length > 500) {
                    errorMessage = 'Message cannot exceed 500 characters';
                }
                break;
        }
        
        // Display error if validation fails
        if (errorMessage) {
            showFieldError(field, errorMessage);
            return false;
        }
        
        // Show success indicator
        field.classList.add('valid');
        return true;
    }
    
    function clearFieldError(event) {
        const field = event.target;
        field.classList.remove('error', 'valid');
        
        // Remove error message
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        field.classList.remove('valid');
        
        // Create error message element
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        
        // Insert after the field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    function handleFormSubmission(event) {
        event.preventDefault();
        
        // Validate all fields
        const formData = new FormData(contactForm);
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showFormMessage('Please correct the errors above', 'error');
            return;
        }
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            showFormMessage('Thank you for contacting us! We\'ll respond within 24 hours.', 'success');
            contactForm.reset();
            inputs.forEach(input => input.classList.remove('valid'));
            
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }, 2000);
    }
    
    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        messageElement.setAttribute('role', 'alert');
        
        // Insert at top of form
        contactForm.insertBefore(messageElement, contactForm.firstChild);
        
        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
        }
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
    
    // Observe all sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    function handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Special animation for team grid
                if (entry.target.querySelector('.team-grid')) {
                    animateTeamMembers(entry.target);
                }
            }
        });
    }
    
    function animateTeamMembers(teamSection) {
        const teamMembers = teamSection.querySelectorAll('.team-member');
        teamMembers.forEach((member, index) => {
            setTimeout(() => {
                member.classList.add('slide-up');
            }, index * 200);
        });
    }
    
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ===== TEAM MEMBER INTERACTIONS =====
function initializeTeamInteractions() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        // Add hover effects and interactions
        member.addEventListener('mouseenter', handleTeamMemberHover);
        member.addEventListener('mouseleave', handleTeamMemberLeave);
        member.addEventListener('click', handleTeamMemberClick);
        
        // Add keyboard support
        member.setAttribute('tabindex', '0');
        member.addEventListener('keydown', handleTeamMemberKeydown);
    });
    
    function handleTeamMemberHover(event) {
        const member = event.currentTarget;
        member.classList.add('hovered');
        
        // Add a subtle animation
        const image = member.querySelector('img');
        if (image) {
            image.style.transform = 'scale(1.05)';
        }
    }
    
    function handleTeamMemberLeave(event) {
        const member = event.currentTarget;
        member.classList.remove('hovered');
        
        const image = member.querySelector('img');
        if (image) {
            image.style.transform = 'scale(1)';
        }
    }
    
    function handleTeamMemberClick(event) {
        const member = event.currentTarget;
        const name = member.querySelector('h3').textContent;
        const role = member.querySelector('p').textContent;
        
        showTeamMemberModal(name, role);
    }
    
    function handleTeamMemberKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleTeamMemberClick(event);
        }
    }
    
    function showTeamMemberModal(name, role) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'team-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">&times;</button>
                <h3>${name}</h3>
                <p class="role">${role}</p>
                <p class="bio">Passionate about Zimbabwe's natural beauty and committed to helping hikers discover amazing trails safely and responsibly.</p>
                <div class="social-links">
                    <a href="#" aria-label="${name}'s hiking blog">Blog</a>
                    <a href="#" aria-label="Contact ${name}">Contact</a>
                </div>
            </div>
        `;
        
        // Add modal to page
        document.body.appendChild(modal);
        
        // Focus management
        const closeButton = modal.querySelector('.modal-close');
        closeButton.focus();
        
        // Event listeners
        closeButton.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
        
        document.addEventListener('keydown', function handleEscape(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        });
        
        function closeModal() {
            modal.remove();
        }
        
        // Animate modal in
        setTimeout(() => modal.classList.add('show'), 10);
    }
}

// ===== UTILITY FUNCTIONS =====
function initializeUtilities() {
    // Dynamic copyright year (already in HTML, but ensuring it updates)
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Add character counter to message textarea
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        addCharacterCounter(messageTextarea);
    }
    
    // Mobile navigation improvements
    improveMobileNavigation();
    
    function addCharacterCounter(textarea) {
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.textContent = '0 / 500';
        
        textarea.parentNode.insertBefore(counter, textarea.nextSibling);
        
        textarea.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length} / 500`;
            
            if (length > 450) {
                counter.classList.add('warning');
            } else {
                counter.classList.remove('warning');
            }
        });
    }
    
    function improveMobileNavigation() {
        const nav = document.querySelector('nav');
        const navLinks = nav.querySelector('.nav-links');
        
        // Create mobile menu button
        const mobileMenuButton = document.createElement('button');
        mobileMenuButton.className = 'mobile-menu-toggle';
        mobileMenuButton.innerHTML = '<span></span><span></span><span></span>';
        mobileMenuButton.setAttribute('aria-label', 'Toggle navigation menu');
        
        nav.insertBefore(mobileMenuButton, navLinks);
        
        // Toggle mobile menu
        mobileMenuButton.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-open');
            this.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target)) {
                navLinks.classList.remove('mobile-open');
                mobileMenuButton.classList.remove('active');
            }
        });
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initializeAccessibility() {
    // Skip link for keyboard navigation
    addSkipLink();
    
    // Improve focus management
    improveFocusManagement();
    
    // Add live region for announcements
    addLiveRegion();
    
    function addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add ID to main content if not present
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main-content';
        }
    }
    
    function improveFocusManagement() {
        // Add focus styles for keyboard navigation
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.classList.add('keyboard-focus');
            });
            
            element.addEventListener('blur', function() {
                this.classList.remove('keyboard-focus');
            });
            
            element.addEventListener('mousedown', function() {
                this.classList.add('mouse-focus');
            });
            
            element.addEventListener('mouseup', function() {
                this.classList.remove('mouse-focus');
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

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce function for performance
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

// Throttle function for scroll events
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

// Export functions for potential external use
window.ZimbabweHikingGuide = {
    announceToScreenReader: window.announceToScreenReader,
    debounce,
    throttle
};