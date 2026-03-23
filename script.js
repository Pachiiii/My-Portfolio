/**
 * @fileoverview Main portfolio script handling UI interactions, animations, and data management.
 * Implements the requested "Exact Typing Sequence" and component logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLoader();
    initStarRating();
    initSmoothScroll();
    initScrollObserver();
    initContactForm();
    initRippleEffect();
    initNavHighlight();
    initYear();
    new TestimonialsManager();
});

/**
 * Manages Dark/Light theme toggling and persistence.
 */
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

/**
 * Handles loading screen and triggers animations when page is fully loaded.
 */
function initLoader() {
    const loader = document.getElementById('loading-screen');
    const startAnimations = () => {
        setTimeout(() => {
            if (loader) {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
            }
            setTimeout(() => {
                initHeroTyping();
            }, 500);
        }, 5000);
    };

    if (document.readyState === 'complete') {
        startAnimations();
    } else {
        window.addEventListener('load', startAnimations);
    }
}

/**
 * Executes the specific hero typing sequence requested.
 * Sequence: "Hi!" -> Delete -> "Name" -> Delete -> "Steve" (Keep) -> Subtitle
 */
async function initHeroTyping() {
    // Wait 500ms before starting as per original timeout
    await new Promise(r => setTimeout(r, 500));

    const heroH1 = document.querySelector('.hero h1');
    const heroP = document.querySelector('.hero-text p');
    
    // Helper functions
    async function typeWriter(element, text, speed = 100) {
        element.textContent = '';
        for (let i = 0; i < text.length; i++) {
            element.textContent += text.charAt(i);
            await new Promise(resolve => setTimeout(resolve, speed));
        }
    }
    
    async function deleteText(element, speed = 50) {
        while (element.textContent.length > 0) {
            element.textContent = element.textContent.slice(0, -1);
            await new Promise(resolve => setTimeout(resolve, speed));
        }
    }
    
    // STEP 1: "Hi!" 
    await typeWriter(heroH1, "Hi!", 100);
    await new Promise(r => setTimeout(r, 1000));
    
    // STEP 2: DELETE it
    await deleteText(heroH1);
    await new Promise(r => setTimeout(r, 300));
    
    // STEP 3: "I'm Steven Nathaniel R. Castillo"
    await typeWriter(heroH1, "I'm Steven Nathaniel R. Castillo", 50);
    await new Promise(r => setTimeout(r, 1000));
    
    // STEP 4: DELETE it  
    await deleteText(heroH1);
    await new Promise(r => setTimeout(r, 300));
    
    // STEP 5: "You can call me Steve" - KEEP FOREVER
    await typeWriter(heroH1, "You can call me Steve", 50);
    // NO DELETE - stays permanently
    
    // STEP 6: Subtitle
    await new Promise(r => setTimeout(r, 500));
    await typeWriter(heroP, "Full Stack Web Developer | Software Engineer", 40);
    
    // Animate buttons
    document.querySelectorAll('.cta-buttons .btn').forEach((btn, i) => {
        setTimeout(() => {
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0) scale(1)';
        }, i * 200);
    });
    
    // Show feedback box
    setTimeout(() => {
        const feedbackBox = document.querySelector('.feedback-post-box');
        if (feedbackBox) feedbackBox.classList.add('show');
    }, 1000);
}

/**
 * Handles star rating interactions.
 */
function initStarRating() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('fa-star')) {
            const stars = document.querySelectorAll('.stars i');
            const rate = e.target.dataset.rate;
            stars.forEach((star, idx) => star.classList.toggle('active', idx < rate));
        }
    });
}

/**
 * Enables smooth scrolling for anchor links.
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior: 'smooth'});
        });
    });
}

/**
 * Sets up IntersectionObserver for scroll animations on cards.
 */
function initScrollObserver() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {threshold: 0.1, rootMargin: '-50px'});

    document.querySelectorAll('.skill-card, .project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

/**
 * Handles contact form submission and CV download.
 */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            if (data.name && data.email && data.message) {
                const btn = form.querySelector('button');
                const originalText = btn.textContent;
                btn.textContent = 'Sent! ✓';
                form.reset();
                setTimeout(() => btn.textContent = originalText, 3000);
            }
        });
    }

    // Handle CV Download (Print)
    const cvBtn = document.querySelector('button[aria-label="Download CV"]');
    if (cvBtn) {
        cvBtn.addEventListener('click', () => window.print());
    }
}

/**
 * Adds material-design style ripple effect to buttons.
 */
function initRippleEffect() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const ripple = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px; height: ${size}px;
                background: rgba(255,255,255,0.5);
                border-radius: 50%; left: ${x}px; top: ${y}px;
                animation: ripple 0.6s linear; pointer-events: none;
            `;
            
            btn.style.position = 'relative';
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

/**
 * Highlights navigation links based on current scroll position.
 */
function initNavHighlight() {
    window.addEventListener('scroll', () => {
        let current = '';
        document.querySelectorAll('section').forEach(section => {
            if (scrollY >= section.offsetTop - 200) {
                current = section.id;
            }
        });
        document.querySelectorAll('.navigation a').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
        });
    });
}

/**
 * Updates the copyright year dynamically.
 */
function initYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

/**
 * Manages testimonials storage and rendering.
 */
class TestimonialsManager {
    constructor() {
        this.storageKey = 'portfolio-testimonials';
        this.init(); // Initialize internally
    }

    init() {
        this.loadTestimonials();
        this.setupSubmitListener();
    }

    loadTestimonials() {
        const testimonials = this.getStoredTestimonials();
        const container = document.getElementById('latest-feedback-list');
        this.updateAverageDisplay(testimonials);
        
        // Stop existing interval if rerendering
        if (this.slideInterval) clearInterval(this.slideInterval);

        if (container && testimonials.length > 0) {
            // Render slides
            container.innerHTML = testimonials.map((t, index) => this.renderTestimonial(t, index === 0)).join('');
            
            // Start slideshow if more than 1 item
            if (testimonials.length > 1) {
                this.startSlideshow(container);
            }
        } else if (container) {
            container.innerHTML = `
                <div class="testimonial-placeholder">
                    <p>No feedback yet. Be the first to rate!</p>
                </div>
            `;
        }
    }

    updateAverageDisplay(testimonials) {
        const container = document.getElementById('rating-average');
        if (!container) return;

        if (testimonials.length === 0) {
            container.style.display = 'none';
            return;
        }

        const total = testimonials.reduce((sum, t) => sum + t.rating, 0);
        const avg = (total / testimonials.length).toFixed(1);
        const stars = '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));

        container.style.display = 'flex';
        container.innerHTML = `<span>Average: <strong style="color:var(--text-primary)">${avg}</strong>/5 <small>(${testimonials.length})</small></span> <span style="color:var(--accent-color); letter-spacing:2px;">${stars}</span>`;
    }

    getStoredTestimonials() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || [];
        } catch {
            return [];
        }
    }

    addTestimonial(name, rating, comment) {
        const testimonials = this.getStoredTestimonials();
        const newTestimonial = {
            name,
            rating: parseInt(rating),
            comment,
            date: new Date().toISOString().split('T')[0]
        };
        testimonials.unshift(newTestimonial);
        localStorage.setItem(this.storageKey, JSON.stringify(testimonials.slice(0, 10)));
        this.loadTestimonials();
    }

    renderTestimonial(testimonial, isActive) {
        const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
        return `
            <div class="testimonial-slide ${isActive ? 'active' : ''}">
                <div class="testimonial-mini">
                    <div style="font-weight:600; font-size:0.9em; margin-bottom:4px;">${testimonial.name} <span style="color:var(--accent-color);">${stars}</span></div>
                    <div style="font-size:0.85em; opacity:0.9;">"${testimonial.comment}"</div>
                </div>
            </div>
        `;
    }

    startSlideshow(container) {
        let currentIndex = 0;
        const slides = container.getElementsByClassName('testimonial-slide');
        
        this.slideInterval = setInterval(() => {
            // Current slide exits to left
            slides[currentIndex].classList.remove('active');
            slides[currentIndex].classList.add('exit');
            
            // Clean up exit class after animation
            const prevIndex = currentIndex;
            setTimeout(() => {
                if(slides[prevIndex]) slides[prevIndex].classList.remove('exit');
            }, 600);

            // Next slide enters from right
            currentIndex = (currentIndex + 1) % slides.length;
            slides[currentIndex].classList.add('active');
        }, 4000); // Change every 4 seconds
    }

    setupSubmitListener() {
        const feedbackBtn = document.querySelector('.feedback-btn');
        if (feedbackBtn) {
            feedbackBtn.addEventListener('click', () => {
                const rating = document.querySelectorAll('.stars i.active').length;
                const textarea = document.querySelector('.feedback-section textarea');
                const nameInput = document.querySelector('input[name="name"]');
                const userName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Visitor';

                if (rating > 0 && textarea.value.trim()) {
                    this.addTestimonial(userName, rating, textarea.value.trim());
                    textarea.value = '';
                    document.querySelectorAll('.stars i').forEach(s => s.classList.remove('active'));
                    
                    const originalText = feedbackBtn.textContent;
                    feedbackBtn.textContent = 'Posted! ✓';
                    setTimeout(() => feedbackBtn.textContent = originalText, 2000);
                } else {
                    alert('Please provide a rating and a comment!');
                }
            });
        }
    }
}
