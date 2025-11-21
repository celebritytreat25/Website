// Dark Mode Toggle
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const html = document.documentElement;

// Load saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Update icon based on theme
function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Mobile Menu Toggle
const menuIcon = document.querySelector('.menu-icon');
const navbar = document.querySelector('.navbar');

if (menuIcon) {
    menuIcon.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });
}

// Scroll Animations
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, {
    root: null,
    threshold: 0.15
});

revealElements.forEach(el => revealObserver.observe(el));

// Loader and Smooth Scroll Logic
const loader = document.querySelector('.page-loader');

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            if (navbar) navbar.classList.remove('active');

            // Show Loader
            if (loader) {
                loader.classList.add('active');

                // Wait for loader animation
                setTimeout(() => {
                    // Scroll to target
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    // Account for fixed header
                    const headerOffset = 80;
                    const offsetPosition = targetPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'auto' // Instant jump while hidden, or smooth if preferred. 
                        // Using auto here because the loader hides the jump.
                    });

                    // Hide Loader after a brief moment to allow scroll to finish/render
                    setTimeout(() => {
                        loader.classList.remove('active');
                    }, 300); // Small buffer after scroll

                }, 800); // Duration of the "loading" effect
            } else {
                // Fallback if no loader
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const headerOffset = 80;
                window.scrollTo({
                    top: targetPosition - headerOffset,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Scroll Spy
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Offset for header
        if (pageYOffset >= sectionTop - 150) {
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

// Smart Navbar - Hide on scroll down, show on scroll up
const header = document.querySelector('.header');
let lastScrollTop = 0;
const scrollThreshold = 100; // Start hiding after scrolling this many pixels

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Don't hide when near the top of the page
    if (scrollTop < scrollThreshold) {
        header.classList.remove('hidden');
    } else {
        // Scrolling down
        if (scrollTop > lastScrollTop) {
            header.classList.add('hidden');
        }
        // Scrolling up
        else {
            header.classList.remove('hidden');
        }
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});


