class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.getElementById('themeToggle');
        this.init();
    }

    init() {
        this.applyTheme();
        this.bindEvents();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateToggleIcon();
        localStorage.setItem('theme', this.theme);
    }

    updateToggleIcon() {
        const icon = this.themeToggle.querySelector('.theme-icon');
        icon.textContent = this.theme === 'dark' ? '☀️' : '🌙';
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
    }

    bindEvents() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
}

class MobileMenu {
    constructor() {
        this.menuBtn = document.getElementById('mobileMenuBtn');
        this.navMenu = document.querySelector('.nav-menu');
        this.isOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.createMobileMenu();
    }

    createMobileMenu() {
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
            <div class="mobile-menu-content">
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#testimonials">Reviews</a>
                <div class="mobile-menu-buttons">
                    <button class="btn btn-outline">Sign In</button>
                    <button class="btn btn-primary">Start Free Trial</button>
                </div>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .mobile-menu {
                position: fixed;
                top: 70px;
                left: 0;
                right: 0;
                background: var(--bg-primary);
                border-bottom: 1px solid var(--border);
                transform: translateY(-100%);
                transition: transform 0.3s ease;
                z-index: 999;
                box-shadow: 0 4px 6px var(--shadow);
            }
            
            .mobile-menu.active {
                transform: translateY(0);
            }
            
            .mobile-menu-content {
                padding: var(--spacing-lg);
                display: flex;
                flex-direction: column;
                gap: var(--spacing-md);
            }
            
            .mobile-menu-content a {
                color: var(--text-secondary);
                text-decoration: none;
                font-weight: 500;
                padding: var(--spacing-sm) 0;
                border-bottom: 1px solid var(--border-light);
            }
            
            .mobile-menu-buttons {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-sm);
                margin-top: var(--spacing-md);
            }
            
            @media (min-width: 769px) {
                .mobile-menu {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(mobileMenu);
        this.mobileMenu = mobileMenu;
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.mobileMenu.classList.toggle('active', this.isOpen);
        this.updateMenuButton();
    }

    updateMenuButton() {
        const spans = this.menuBtn.querySelectorAll('span');
        if (this.isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    bindEvents() {
        this.menuBtn.addEventListener('click', () => this.toggle());
        
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.menuBtn.contains(e.target) && !this.mobileMenu.contains(e.target)) {
                this.toggle();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.toggle();
            }
        });
    }
}

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.createObserver();
        this.markElementsForAnimation();
    }

    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, this.observerOptions);
    }

    markElementsForAnimation() {
        const animationStyles = `
            .fade-up {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .fade-up.animate {
                opacity: 1;
                transform: translateY(0);
            }
            
            .fade-in {
                opacity: 0;
                transition: opacity 0.8s ease;
            }
            
            .fade-in.animate {
                opacity: 1;
            }
            
            .slide-left {
                opacity: 0;
                transform: translateX(-50px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .slide-left.animate {
                opacity: 1;
                transform: translateX(0);
            }
            
            .slide-right {
                opacity: 0;
                transform: translateX(50px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .slide-right.animate {
                opacity: 1;
                transform: translateX(0);
            }
            
            .scale-up {
                opacity: 0;
                transform: scale(0.8);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .scale-up.animate {
                opacity: 1;
                transform: scale(1);
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = animationStyles;
        document.head.appendChild(styleSheet);

        document.querySelectorAll('.feature-card').forEach((el, index) => {
            el.classList.add('fade-up');
            el.style.transitionDelay = `${index * 0.1}s`;
            this.observer.observe(el);
        });

        document.querySelectorAll('.testimonial-card').forEach((el, index) => {
            el.classList.add('scale-up');
            el.style.transitionDelay = `${index * 0.2}s`;
            this.observer.observe(el);
        });

        document.querySelectorAll('.pricing-card').forEach((el, index) => {
            el.classList.add('fade-up');
            el.style.transitionDelay = `${index * 0.15}s`;
            this.observer.observe(el);
        });

        document.querySelectorAll('.section-header').forEach(el => {
            el.classList.add('fade-in');
            this.observer.observe(el);
        });

        const heroText = document.querySelector('.hero-text');
        const heroVisual = document.querySelector('.hero-visual');
        if (heroText) {
            heroText.classList.add('slide-left');
            this.observer.observe(heroText);
        }
        if (heroVisual) {
            heroVisual.classList.add('slide-right');
            this.observer.observe(heroVisual);
        }
    }
}

class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            this.navbar.style.backdropFilter = 'blur(20px)';
            this.navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            this.navbar.style.backdropFilter = 'blur(10px)';
            this.navbar.style.boxShadow = 'none';
        }

        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            if (window.scrollY > 50) {
                this.navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            } else {
                this.navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            }
        }
    }
}

class FormHandler {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('.btn-primary').forEach(btn => {
            if (btn.textContent.includes('Start Free Trial') || btn.textContent.includes('Get Started')) {
                btn.addEventListener('click', this.handleTrialClick);
            }
        });

        document.querySelectorAll('.btn-secondary').forEach(btn => {
            if (btn.textContent.includes('Watch Demo') || btn.textContent.includes('Schedule Demo')) {
                btn.addEventListener('click', this.handleDemoClick);
            }
        });

        document.querySelectorAll('.btn-outline').forEach(btn => {
            if (btn.textContent.includes('Contact Sales')) {
                btn.addEventListener('click', this.handleContactClick);
            }
        });
    }

    handleTrialClick(e) {
        e.preventDefault();
        alert('🎉 Free trial feature coming soon! You would be redirected to the signup page.');
    }

    handleDemoClick(e) {
        e.preventDefault();
        alert('📹 Demo scheduling feature coming soon! You would be redirected to the calendar booking page.');
    }

    handleContactClick(e) {
        e.preventDefault();
        alert('📞 Contact form coming soon! You would be redirected to the contact page.');
    }
}

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeAnimations();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }}