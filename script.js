// =====================================
// PCSHS School Management System
// Main JavaScript File
// =====================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // === THEME MANAGEMENT ===
    const themeToggle = document.getElementById('theme-toggle');
    const themeSwitch = document.getElementById('theme-switch');
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Theme toggle functionality
    function switchTheme() {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add animation to page elements
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }
    
    // Add event listeners for theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', switchTheme);
    }
    
    if (themeSwitch) {
        themeSwitch.addEventListener('click', switchTheme);
    }
    
    
    // === MOBILE MENU TOGGLE ===
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
    }
    
    
    // === SECTION TABS (ATTENDANCE PAGE) ===
    const sectionTabs = document.querySelectorAll('.section-tab');
    const attendanceSections = document.querySelectorAll('.attendance-section');
    
    if (sectionTabs.length > 0) {
        sectionTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetSection = this.getAttribute('data-section');
                
                // Remove active class from all tabs and sections
                sectionTabs.forEach(t => t.classList.remove('active'));
                attendanceSections.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding section
                this.classList.add('active');
                const targetElement = document.getElementById(targetSection);
                if (targetElement) {
                    targetElement.classList.add('active');
                    
                    // Smooth scroll to section
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        });
    }
    
    
    // === FILTER BUTTONS (LOST & FOUND PAGE) ===
    const filterBtns = document.querySelectorAll('.filter-btn');
    const lfCards = document.querySelectorAll('.lf-card');
    
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Remove active class from all filter buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Filter cards
                lfCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        card.style.animation = 'scaleIn 0.3s ease-out';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    
    // === SMOOTH SCROLL FOR NAVIGATION ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    
    // === SCROLL ANIMATIONS ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    document.querySelectorAll('.stat-card, .dashboard-card, .announcement-card, .lf-card, .staff-card, .settings-section').forEach(el => {
        observer.observe(el);
    });
    
    
    // === HEADER SCROLL EFFECT ===
    const header = document.querySelector('.main-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = 'var(--shadow-md)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    
    // === TABLE ROW HOVER EFFECT ===
    const tableRows = document.querySelectorAll('.attendance-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)';
        });
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    
    // === CARD STAGGER ANIMATION ===
    function staggerAnimation(elements, delay = 100) {
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * delay}ms`;
        });
    }
    
    // Apply stagger to various elements
    staggerAnimation(document.querySelectorAll('.stat-card'), 100);
    staggerAnimation(document.querySelectorAll('.dashboard-card'), 150);
    staggerAnimation(document.querySelectorAll('.announcement-card'), 100);
    staggerAnimation(document.querySelectorAll('.lf-card'), 100);
    staggerAnimation(document.querySelectorAll('.staff-card'), 100);
    
    
    // === ACTIVE PAGE HIGHLIGHTING ===
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
    
    
    // === FORM VALIDATION (Settings Page) ===
    const settingInputs = document.querySelectorAll('.setting-input');
    settingInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    
    // === ACTION BUTTONS ===
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    
    // === ANNOUNCEMENT CARD INTERACTION ===
    const announcementCards = document.querySelectorAll('.announcement-card');
    announcementCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add a subtle pulse animation when clicked
            this.style.animation = 'pulse 0.3s ease-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    });
    
    
    // === LOADING ANIMATION ===
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
    
    
    // === SEARCH FUNCTIONALITY (can be expanded) ===
    const searchInputs = document.querySelectorAll('input[type="search"]');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            // Add your search logic here
            console.log('Searching for:', searchTerm);
        });
    });
    
    
    // === KEYBOARD SHORTCUTS ===
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to toggle theme
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            switchTheme();
        }
        
        // ESC to close mobile menu
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            mobileNav.classList.remove('active');
        }
    });
    
    
    // === TOOLTIP FUNCTIONALITY ===
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = 'var(--accent-black)';
            tooltip.style.color = 'var(--bg-primary)';
            tooltip.style.padding = '0.5rem 1rem';
            tooltip.style.borderRadius = 'var(--radius-sm)';
            tooltip.style.fontSize = '0.875rem';
            tooltip.style.zIndex = '9999';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 0.2s ease';
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
            tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
            
            setTimeout(() => tooltip.style.opacity = '1', 10);
            
            this.addEventListener('mouseleave', function() {
                tooltip.remove();
            }, { once: true });
        });
    });
    
    
    // === CONSOLE WELCOME MESSAGE ===
    console.log('%c PCSHS School Management System ', 'background: #000; color: #fff; padding: 10px; font-size: 16px; font-weight: bold;');
    console.log('%c We Excel, We Serve, We Lead. ', 'color: #666; font-size: 12px; font-style: italic;');
    
});

// === RIPPLE ANIMATION KEYFRAMES ===
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// === CAROUSEL FUNCTIONALITY ===
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        
        if (slides[currentSlide]) {
            slides[currentSlide].classList.add('active');
        }
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Auto-advance slides
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // Start auto-slide
    if (slides.length > 0) {
        startAutoSlide();
    }

    // Pause on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
});

// === ANIMATED NUMBER COUNTER ===
function animateNumber(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.round(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// Trigger number animations on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateNumber(entry.target, target);
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe all elements with data-target
document.querySelectorAll('[data-target]').forEach(el => {
    numberObserver.observe(el);
});

// === ENHANCED SCROLL ANIMATIONS ===
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.stat-card');
    
    parallaxElements.forEach((el, index) => {
        const speed = 0.5 + (index * 0.1);
        const offset = scrolled * speed * 0.1;
        if (scrolled < 500) {
            el.style.transform = `translateY(${offset}px)`;
        }
    });
});

console.log('%c Enhanced Dashboard Loaded! ', 'background: #000; color: #fff; padding: 8px; font-size: 14px;');