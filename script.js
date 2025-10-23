// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-in-out' // Smoother animation curve
});

// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    document.body.classList.toggle('no-scroll'); // Prevent body scroll when menu is open
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70, // Adjust for fixed navbar height
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background and active link on scroll
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    // Navbar background and shadow
    if (window.scrollY > 80) { // Reduced scroll threshold
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 80; // Adjust for navbar
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Skill bars animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        // Reset width to 0 before setting to enable re-animation on repeated visibility
        bar.style.width = '0%'; 
        setTimeout(() => {
            bar.style.width = width + '%';
        }, 100); // Small delay to ensure reset takes effect
    });
}

// Intersection Observer for skill bars
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    const observerOptions = {
        root: null,
        threshold: 0.5, // Trigger when 50% of the section is visible
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    observer.observe(skillsSection);
}


// Typing animation for hero title
function initTypingAnimation() {
    const typingTextElement = document.querySelector('.typing-text');
    if (!typingTextElement) return;

    const text = 'Nikhil Makwana';
    let index = 0;
    
    function type() {
        if (index < text.length) {
            typingTextElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100); // Typing speed
        }
    }
    
    // Start typing after a short delay
    setTimeout(() => {
        typingTextElement.textContent = ''; // Clear existing text if any
        type();
    }, 500);
}

// Contact form handling
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const url = this.action;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.reset();
            } else {
                const data = await response.json();
                if (data.errors) {
                    showNotification(data.errors.map(error => error.message).join(', '), 'error');
                } else {
                    showNotification('Oops! There was a problem sending your message.', 'error');
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Network error. Please try again later.', 'error');
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--danger-color)'};
        color: var(--darker-bg);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 350px;
        animation: slideInRight 0.4s ease-out;
        font-weight: 500;
        text-shadow: none;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 1.8rem;
        line-height: 1;
        cursor: pointer;
        padding: 0;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--darker-bg);
        opacity: 0.8;
        transition: opacity 0.2s ease;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.4s ease-in forwards';
        setTimeout(() => notification.remove(), 400);
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.4s ease-in forwards';
            setTimeout(() => notification.remove(), 400);
        }
    }, 5000);
}

// Add CSS for notifications if not already present
if (!document.getElementById('notification-styles')) {
    const notificationStyles = document.createElement('style');
    notificationStyles.id = 'notification-styles';
    notificationStyles.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(120%);
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
                transform: translateX(120%);
                opacity: 0;
            }
        }
        .no-scroll {
            overflow: hidden;
        }
    `;
    document.head.appendChild(notificationStyles);
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
}

// Interactive card effects (parallax on mousemove)
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.project-card, .cert-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltX = (y - centerY) / 20; // Adjust sensitivity
            const tiltY = (centerX - x) / 20; // Adjust sensitivity
            
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.boxShadow = `
                ${-tiltY/2}px ${tiltX/2}px 25px rgba(0,0,0,0.5),
                ${-tiltY/4}px ${tiltX/4}px 10px rgba(0, 224, 255, 0.2)
            `; // Add a more dynamic shadow
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)'; // Reset to default
        }
    });
});


// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTypingAnimation();
    
    // Add loading animation (fade in body)
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.7s ease-out';
        document.body.style.opacity = '1';
    }, 100);
});