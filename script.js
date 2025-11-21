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

// Scroll Animations with Intersection Observer
const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .zoom-in');
revealElements.forEach(el => observer.observe(el));

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

// Smart Navbar - Logic removed to keep navbar always visible

// Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const captionText = document.querySelector('.lightbox-caption');
const closeBtn = document.querySelector('.close-lightbox');
const galleryItems = document.querySelectorAll('.gallery-item'); // Select container
const galleryOverlays = document.querySelectorAll('.gallery-item .overlay h3');

let currentIndex = 0;

// Open Lightbox
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        lightbox.style.display = 'block';
        const img = item.querySelector('img');
        lightboxImg.src = img.src;
        captionText.innerHTML = galleryOverlays[index].innerHTML;
        currentIndex = index;
        document.body.style.overflow = 'hidden'; // Disable scrolling
    });
});

// Close Lightbox
function closeLightboxModal() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto'; // Enable scrolling
}

if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent bubbling
        closeLightboxModal();
    });
}

// Close on outside click
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightboxModal();
        }
    });
}

// Change Slide
function changeSlide(n) {
    currentIndex += n;
    if (currentIndex >= galleryItems.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = galleryItems.length - 1;
    }
    const img = galleryItems[currentIndex].querySelector('img');
    lightboxImg.src = img.src;
    captionText.innerHTML = galleryOverlays[currentIndex].innerHTML;
}

const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

if (prevBtn) {
    prevBtn.addEventListener('click', () => changeSlide(-1));
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => changeSlide(1));
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.style.display === 'block') {
        if (e.key === 'Escape') {
            closeLightboxModal();
        } else if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    }
});
