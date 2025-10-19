// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 15, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
});

// Profile Photo Handling - NEW FUNCTION
function setupProfilePhoto() {
    const profilePhoto = document.getElementById('profile-photo');
    const imagePlaceholder = document.getElementById('image-placeholder');
    
    if (profilePhoto) {
        // Check if image loads successfully
        profilePhoto.addEventListener('load', function() {
            console.log('Profile photo loaded successfully');
            // Image loaded successfully - CSS will handle hiding the placeholder
        });
        
        // Handle image loading errors
        profilePhoto.addEventListener('error', function() {
            console.warn('Profile photo failed to load, showing placeholder');
            this.classList.add('error');
            // Force show placeholder
            if (imagePlaceholder) {
                imagePlaceholder.style.display = 'flex';
            }
        });
        
        // Check if image source is empty or invalid
        if (!profilePhoto.src || profilePhoto.src.includes('undefined')) {
            console.warn('Profile photo source is invalid');
            profilePhoto.classList.add('error');
            if (imagePlaceholder) {
                imagePlaceholder.style.display = 'flex';
            }
        }
    }
}

// Skill bars animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
    });
}

// Intersection Observer for skill bars
const skillsSection = document.querySelector('.skills');
const observerOptions = {
    root: null,
    threshold: 0.3,
    rootMargin: '0px'
};

if (skillsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    observer.observe(skillsSection);
}

// Typing animation for hero title
function initTypingAnimation() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const text = 'Nikhil Makwana';
    let index = 0;
    
    function type() {
        if (index < text.length) {
            typingText.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        }
    }
    
    // Start typing after a short delay
    setTimeout(() => {
        typingText.textContent = '';
        type();
    }, 500);
}

// Enhanced Resume Download Functionality
function setupResumeDownload() {
    const resumeDownload = document.querySelector('a[download="Nikhil_Makwana_Resume.pdf"]');
    
    if (resumeDownload) {
        resumeDownload.addEventListener('click', function(e) {
            // Check if file exists before proceeding with download
            fetch(this.href)
                .then(response => {
                    if (!response.ok) {
                        e.preventDefault();
                        showNotification('Resume file not found. Please ensure resume.pdf is in the assets folder.', 'error');
                        console.error('Resume file not found at:', this.href);
                    } else {
                        console.log('Resume file found, download proceeding...');
                        // Optional: Track download event
                        trackDownload('resume');
                    }
                })
                .catch(error => {
                    e.preventDefault();
                    showNotification('Error accessing resume file. Please try the "View Resume" option or check your file path.', 'error');
                    console.error('Resume download error:', error);
                });
        });
    }

    // Also set up the view resume button
    const viewResume = document.querySelector('a[href="assets/resume.pdf"][target="_blank"]');
    if (viewResume) {
        viewResume.addEventListener('click', function(e) {
            fetch(this.href)
                .then(response => {
                    if (!response.ok) {
                        e.preventDefault();
                        showNotification('Resume file not found. Please ensure resume.pdf is in the assets folder.', 'error');
                    }
                })
                .catch(error => {
                    e.preventDefault();
                    showNotification('Error opening resume file.', 'error');
                });
        });
    }
}

// Track download events (optional - for analytics)
function trackDownload(fileType) {
    // You can integrate with Google Analytics here
    console.log(`Download tracked: ${fileType}`);
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download', {
            'event_category': 'file',
            'event_label': fileType
        });
    }
}

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Here you would typically send the data to Formspree or EmailJS
        // For now, we'll just show a success message
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset form
        this.reset();
        
        // Optional: Track form submission
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_form_submission', {
                'event_category': 'engagement',
                'event_label': 'Contact Form'
            });
        }
    });
}

// Enhanced Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles dynamically if not already in CSS
    if (!document.querySelector('#notification-styles')) {
        const notificationStyles = document.createElement('style');
        notificationStyles.id = 'notification-styles';
        notificationStyles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 5px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
                font-weight: 500;
            }
            
            .notification-success {
                background: #00ff88;
                color: #0a0a0f;
                border-left: 4px solid #00cc6a;
            }
            
            .notification-error {
                background: #ff2a6d;
                color: #ffffff;
                border-left: 4px solid #cc2257;
            }
            
            .notification-info {
                background: #00d9ff;
                color: #0a0a0f;
                border-left: 4px solid #00a3cc;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.8;
                transition: opacity 0.3s ease;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(notificationStyles);
    }
    
    // Apply specific styles based on type
    const backgroundColor = type === 'success' ? '#00ff88' : type === 'error' ? '#ff2a6d' : '#00d9ff';
    const textColor = type === 'error' ? '#ffffff' : '#0a0a0f';
    
    notification.style.background = backgroundColor;
    notification.style.color = textColor;
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.color = textColor;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Back to top functionality
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
}

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.project-card, .cert-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const angleY = (x - centerX) / 25;
            const angleX = (centerY - y) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        }
    });
});

// File existence checker (utility function)
function checkFileExists(url) {
    return fetch(url, { method: 'HEAD' })
        .then(response => response.ok)
        .catch(() => false);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTypingAnimation();
    setupProfilePhoto(); // NEW: Initialize profile photo handling
    setupResumeDownload();
    
    // Check if resume file exists on page load
    setTimeout(() => {
        checkFileExists('assets/resume.pdf').then(exists => {
            if (!exists) {
                console.warn('Resume file not found at: assets/resume.pdf');
            } else {
                console.log('Resume file verified: assets/resume.pdf');
            }
        });
        
        // Check if profile photo exists
        checkFileExists('assets/profile-photo.jpg').then(exists => {
            if (!exists) {
                console.warn('Profile photo not found at: assets/profile-photo.jpg - using placeholder');
            } else {
                console.log('Profile photo verified: assets/profile-photo.jpg');
            }
        });
    }, 1000);
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize any other components
    console.log('Portfolio initialized successfully');
});

// Error handling for images
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.warn('Image failed to load:', e.target.src);
        e.target.classList.add('error');
    }
}, true);

// Performance monitoring (optional)
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
            
            if (loadTime > 3000) {
                console.warn('Page load time is slow. Consider optimizing assets.');
            }
        }, 0);
    });
}
