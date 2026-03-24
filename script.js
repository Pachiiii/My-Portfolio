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
    initProjectGallery(); // Initialize B&W Gallery
    initModernAnimations(); // New animation trigger
    initTimelineAnimations(); // Timeline specific animation
    initWorkSlider(); // New 3D JS Slider
    initHobbiesGallery(); // New Hobbies Tab Gallery
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
        }, 800); // Reduced to 800ms for snappier experience
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

    // Removed .project-card to prevent conflicts with the gallery slider visibility
    document.querySelectorAll('.skill-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

/**
 * Handles modern slide-in animations for About section
 */
function initModernAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in-view');
            }
        });
    }, { threshold: 0.2, rootMargin: '0px' });

    document.querySelectorAll('.animate-left, .animate-right').forEach(el => observer.observe(el));
}

/**
 * Handles staggered animation for timeline items
 */
function initTimelineAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.2}s`; // Add delay for staggered effect
        observer.observe(item);
    });
}

/**
 * Handles the 3D Infinite Stream Slider for Work Experience
 * Replaces CSS animation with JS for "Center Focus" effect
 */
function initWorkSlider() {
    const track = document.querySelector('.work-gallery-track');
    const dotsContainer = document.querySelector('.work-gallery-dots');
    if (!track) return;

    const images = Array.from(track.querySelectorAll('img'));
    if (images.length === 0) return;

    // Configuration
    const itemWidth = 390; // 350px Image + 40px Gap
    const uniqueCount = images.length / 2; // Handle duplicates
    
    const centerOffset = 215; // Padding (40) + Half Item (175)
    
    let currentIndex = 0;
    let isHovered = false;
    let autoPlayInterval;

    // Create Dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < uniqueCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('work-dot');
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            dotsContainer.appendChild(dot);
        }
    }
    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.work-dot')) : [];

    // Updates the slider position and highlights
    function updateGallery(smooth = true) {
        const containerWidth = track.parentElement.offsetWidth;
        const currentItemCenter = centerOffset + (currentIndex * itemWidth);
        const translateVal = (containerWidth / 2) - currentItemCenter;

        track.style.transition = smooth ? 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'; // Bouncy Effect
        if (smooth) {
            track.style.transition = 'transform 0.8s cubic-bezier(0.25, 1.2, 0.5, 1)'; // Smooth Bouncy
            images.forEach(img => img.style.transition = ''); // Restore CSS
        } else {
            track.style.transition = 'none';
            images.forEach(img => img.style.transition = 'none'); // Disable for invisible snap
        }
        track.style.transform = `translateX(${translateVal}px)`;

        // Update Highlight
        images.forEach((img, i) => img.classList.toggle('active', i === currentIndex));
        
        // Update Dots
        const realIndex = currentIndex % uniqueCount;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === realIndex));

        // Restore transitions after snap
        if (!smooth) {
            void track.offsetWidth; // Force reflow
            setTimeout(() => images.forEach(img => img.style.transition = ''), 50);
        }
    }

    function nextSlide() {
        if (isHovered) return;
        currentIndex++;
        updateGallery(true);

        // Loop Check: If reached the duplicate set start, snap back to 0
        if (currentIndex === uniqueCount) {
            setTimeout(() => {
                currentIndex = 0;
                updateGallery(false); // Instant jump (no animation)
            }, 850); // Increased buffer to ensure animation is fully done
        }
    }

    function goToSlide(index) {
        currentIndex = index;
        updateGallery(true);
        resetTimer();
    }

    function resetTimer() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 3000); // 3 Seconds Interval
    }

    // Events
    track.parentElement.addEventListener('mouseenter', () => isHovered = true);
    track.parentElement.addEventListener('mouseleave', () => isHovered = false);
    window.addEventListener('resize', () => updateGallery(false));

    // Pause on tab switch to prevent animation sync issues
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(autoPlayInterval);
        } else {
            resetTimer();
        }
    });

    // Init
    updateGallery(false);
    resetTimer();
}

/**
 * Handles the tabbed gallery for the Hobbies section.
 */
function initHobbiesGallery() {
    const nav = document.querySelector('.hobbies-nav');
    const galleries = document.querySelectorAll('.hobby-gallery');
    const tabs = document.querySelectorAll('.hobby-tab');

    if (!nav || galleries.length === 0) return;

    nav.addEventListener('click', (e) => {
        const clickedTab = e.target.closest('.hobby-tab');
        if (!clickedTab) return;

        // Prevent action if already active
        if (clickedTab.classList.contains('active')) return;

        const targetHobby = clickedTab.dataset.target;

        // Update tabs
        tabs.forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');

        // Update galleries
        galleries.forEach(gallery => {
            gallery.classList.toggle('active', gallery.dataset.hobby === targetHobby);
        });
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
            
            // ---------------------------------------------------------
            // PALITAN MO ITO NG IYONG FORMSPREE ID
            // Mag-sign up sa https://formspree.io/ para makakuha nito
            const formID = 'xwvrgrbd'; 
            // ---------------------------------------------------------

            fetch(`https://formspree.io/f/${formID}`, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    const btn = form.querySelector('button');
                    const originalText = btn.textContent;
                    btn.textContent = 'Message Sent Successfully!';
                    form.reset();
                    setTimeout(() => btn.textContent = originalText, 3000);
                } else {
                    alert("Oops! There was a problem submitting your form.");
                }
            }).catch(error => {
                alert("Error connecting to the message service.");
            });
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

/**
 * Handles Black & White Project Gallery Slider
 */
function initProjectGallery() {
    const track = document.querySelector('.gallery-track');
    const nextBtn = document.querySelector('.gallery-btn.next');
    const prevBtn = document.querySelector('.gallery-btn.prev');
    const dotsContainer = document.querySelector('.gallery-dots');
    
    if (!track || !nextBtn || !prevBtn) return;

    let currentIndex = 0;
    const cards = track.querySelectorAll('.project-card');
    const totalCards = cards.length;

    const getCardWidth = () => {
        const card = cards[0];
        // The card's offsetWidth plus the gap from the flex container
        return card ? card.offsetWidth + 30 : 0;
    };

    const moveGallery = () => {
        const cardWidthWithGap = getCardWidth();
        const card = cards[0];
        if (!card) return;

        const containerWidth = document.querySelector('.gallery-container').offsetWidth;
        
        // Calculate offset to center the card (without its gap) inside the container
        const centerOffset = (containerWidth / 2) - (card.offsetWidth / 2);
        
        // Calculate the final translation by applying the offset and then subtracting the scroll distance
        const newTranslateX = centerOffset - (currentIndex * cardWidthWithGap);

        track.style.transform = `translateX(${newTranslateX}px)`;
        updateDotsActive();
        updateCardsActive();
    };

    const createDots = () => {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalCards; i++) {
            const dot = document.createElement('div');
            dot.classList.add('gallery-dot');
            dot.addEventListener('click', () => {
                currentIndex = i;
                moveGallery();
            });
            dotsContainer.appendChild(dot);
        }
        updateDotsActive(); // Initial active dot
    };

    const updateDotsActive = () => {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.gallery-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    };

    const updateCardsActive = () => {
        cards.forEach((card, i) => {
            card.classList.toggle('active', i === currentIndex);
        });
    };

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalCards;
        moveGallery();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        moveGallery();
    });

    // Recalculate position on resize without resetting index
    window.addEventListener('resize', moveGallery);

    // Touch Swipe Support for Mobile
    let startX = 0;
    let startY = 0;

    track.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;

        // Detect horizontal swipe: movement > 50px and mostly horizontal
        if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) * 2) {
            if (diffX > 0) nextBtn.click(); // Left swipe -> Next
            else prevBtn.click(); // Right swipe -> Prev
        }
    }, { passive: true });
    
    // Initial setup
    createDots();
    moveGallery();
}
