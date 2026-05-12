/* ==========================================
   SCRIPT.JS — COMPLETE PORTFOLIO JS
   GLASS MIRROR UI ENHANCED
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ==========================================
    // LOADER
    // ==========================================
    const loader        = document.getElementById('loader');
    const loaderBar     = document.getElementById('loaderBar');
    const loaderPercent = document.getElementById('loaderPercent');
    let loadProgress    = 0;

    const loaderInterval = setInterval(() => {
        loadProgress += Math.random() * 15;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loaderInterval);
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = '';
                initAnimations();
            }, 500);
        }
        loaderBar.style.width     = loadProgress + '%';
        loaderPercent.textContent = Math.floor(loadProgress) + '%';
    }, 150);

    // ==========================================
    // CUSTOM CURSOR
    // ==========================================
    const cursor     = document.getElementById('cursor');
    const follower   = document.getElementById('cursorFollower');
    const cursorText = document.getElementById('cursorText');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
            if (cursorText) {
                cursorText.style.left = mouseX + 'px';
                cursorText.style.top  = mouseY + 'px';
            }
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            follower.style.transform = `translate(${followerX - 17}px, ${followerY - 17}px)`;
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        document.addEventListener('mousedown', () => cursor.classList.add('click'));
        document.addEventListener('mouseup',   () => cursor.classList.remove('click'));

        document.querySelectorAll(
            'a, button, .btn, .skill-card, .portfolio-card, ' +
            '.filter-btn, .skill-tab, .contact-card, .timeline-card, ' +
            '.education-card, .testimonial-card, .info-item, .about-badge'
        ).forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('hover'));
            el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
        });

        document.querySelectorAll('.hero-name, .section-title').forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('hover-text');
                cursorText.classList.add('visible');
                cursorText.textContent = 'EXPLORE';
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('hover-text');
                cursorText.classList.remove('visible');
            });
        });

        document.querySelectorAll('.portfolio-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('hover');
                if (cursorText) {
                    cursorText.classList.add('visible');
                    cursorText.textContent = 'VIEW';
                }
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('hover');
                if (cursorText) cursorText.classList.remove('visible');
            });
        });
    }

    // ==========================================
    // PARTICLES
    // ==========================================
    const canvas = document.getElementById('particleCanvas');
    const ctx    = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x       = Math.random() * canvas.width;
            this.y       = Math.random() * canvas.height;
            this.size    = Math.random() * 2 + 0.5;
            this.speedX  = (Math.random() - 0.5) * 0.5;
            this.speedY  = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.4 + 0.05;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width ||
                this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            const rgb = getComputedStyle(document.documentElement)
                .getPropertyValue('--primary-rgb').trim();
            ctx.fillStyle = `rgba(${rgb}, ${this.opacity})`;
            ctx.fill();
        }
    }

    const particleCount = window.innerWidth < 768 ? 30 : 60;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });

        const rgb = getComputedStyle(document.documentElement)
            .getPropertyValue('--primary-rgb').trim();

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const alpha = 0.04 * (1 - dist / 120);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
                    ctx.lineWidth   = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ==========================================
    // THEME SWITCHER
    // ==========================================
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            if (theme === 'cyber') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', theme);
            }
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showToast('Theme changed to ' + theme.toUpperCase() + '!');
        });
    });

    // ==========================================
    // NAVIGATION
    // ==========================================
    const navbar     = document.getElementById('navbar');
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks   = document.querySelectorAll('.nav-link, .mobile-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        navbar.classList.toggle('scrolled', scrollY > 50);

        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress  = (scrollY / docHeight) * 100;
        document.getElementById('pageProgress').style.width = progress + '%';

        const backToTop = document.getElementById('backToTop');
        backToTop.classList.toggle('visible', scrollY > 500);
        const circle        = document.getElementById('backToTopCircle');
        const circumference = 2 * Math.PI * 48;
        circle.style.strokeDashoffset = circumference - (progress / 100) * circumference;

        const floatingCV  = document.getElementById('floatingCVBtn');
        const whatsappBtn = document.getElementById('whatsappBtn');
        if (floatingCV)  floatingCV.classList.toggle('visible',  scrollY > 600);
        if (whatsappBtn) whatsappBtn.classList.toggle('visible', scrollY > 300);

        updateActiveNav();
        updateSectionCounter();
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow =
            mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 200;
            if (window.scrollY >= top) current = section.id;
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active',
                link.getAttribute('data-section') === current);
        });
    }

    function updateSectionCounter() {
        const sections = document.querySelectorAll('section[id]');
        const counter  = document.querySelector('.counter-current');
        if (!counter) return;
        let index = 1;
        sections.forEach((section, i) => {
            if (window.scrollY >= section.offsetTop - 300) index = i + 1;
        });
        counter.textContent = String(index).padStart(2, '0');
    }

    document.getElementById('backToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================
    // TYPING EFFECT
    // ==========================================
    const typingEl = document.getElementById('typingText');
    const phrases  = [
        'Stunning 3D Visuals',
        'Photorealistic Textures',
        'Cinematic Lighting',
        'Beautiful Designs',
        'Immersive Experiences',
        'Creative Solutions'
    ];
    let phraseIndex = 0, charIndex = 0, isDeleting = false;

    function typeEffect() {
        const current = phrases[phraseIndex];
        if (isDeleting) {
            typingEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === current.length) {
            delay      = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting  = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay       = 500;
        }
        setTimeout(typeEffect, delay);
    }
    typeEffect();

    // ==========================================
    // SCROLL REVEAL ANIMATIONS
    // ==========================================
    function initAnimations() {
        const reveals = document.querySelectorAll(
            '.reveal-up, .reveal-left, .reveal-right, .reveal-text, ' +
            '.section-title, .hero-greeting, .name-first, .name-last, ' +
            '.hero-title-wrapper, .typing-wrapper, .hero-buttons, .hero-stats, ' +
            '.about-image-wrapper, .about-text-wrapper, .contact-info, ' +
            '.contact-form-wrapper, .showreel-wrapper, .skill-card, ' +
            '.timeline-item, .portfolio-item, .education-card, ' +
            '.testimonial-card, .education-column'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                        addGlassRevealEffect(entry.target);
                    }, parseInt(delay));
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        reveals.forEach(el => observer.observe(el));

        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fills = entry.target.querySelectorAll('.skill-bar-fill');
                    fills.forEach(fill => {
                        const width = fill.dataset.width;
                        setTimeout(() => { fill.style.width = width + '%'; }, 300);
                    });
                }
            });
        }, { threshold: 0.2 });

        const skillsSection = document.querySelector('.skills');
        if (skillsSection) skillObserver.observe(skillsSection);

        animateCounters();
    }

    function addGlassRevealEffect(el) {
        if (!el.classList.contains('skill-card') &&
            !el.classList.contains('timeline-card') &&
            !el.classList.contains('portfolio-card')) return;

        el.style.setProperty('--reveal-glow', '1');
        setTimeout(() => {
            el.style.removeProperty('--reveal-glow');
        }, 800);
    }

    // ==========================================
    // COUNTER ANIMATION
    // ==========================================
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el        = entry.target;
                    const target    = parseInt(el.dataset.count);
                    let current     = 0;
                    const increment = target / 60;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = Math.floor(current);
                    }, 30);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => counterObserver.observe(c));
    }

    // ==========================================
    // PHILOSOPHY SLIDER
    // ==========================================
    const slides = document.querySelectorAll('.philosophy-slide');
    const dots   = document.querySelectorAll('.philosophy-dots .dot');
    let currentSlide  = 0;
    let slideInterval;

    function goToSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            goToSlide(parseInt(dot.dataset.slide));
            startSlider();
        });
    });

    startSlider();

    // ==========================================
    // SHOWREEL VIDEO
    // ==========================================
    const videoOverlay  = document.getElementById('videoOverlay');
    const showreelVideo = document.getElementById('showreelVideo');

    if (videoOverlay) {
        videoOverlay.addEventListener('click', () => {
            videoOverlay.classList.add('hidden');
            if (showreelVideo) {
                showreelVideo.src += showreelVideo.src.includes('?')
                    ? '&autoplay=1'
                    : '?autoplay=1';
            }
        });
    }

    // ==========================================
    // TIMELINE FILL
    // ==========================================
    const timelineFill    = document.getElementById('timelineFill');
    const timelineSection = document.querySelector('.experience');

    if (timelineSection && timelineFill) {
        window.addEventListener('scroll', () => {
            const rect    = timelineSection.getBoundingClientRect();
            const height  = timelineSection.offsetHeight;
            const visible = Math.max(0,
                Math.min(1, (window.innerHeight - rect.top) / height));
            timelineFill.style.height = (visible * 100) + '%';

            document.querySelectorAll('.timeline-dot').forEach(dot => {
                const dotRect = dot.getBoundingClientRect();
                if (dotRect.top < window.innerHeight * 0.7) {
                    dot.classList.add('active');
                }
            });
        });
    }

    // ==========================================
    // CV MODAL — GLASS
    // ==========================================
    const cvModal        = document.getElementById('cvModal');
    const cvModalClose   = document.getElementById('cvModalClose');
    const cvModalOverlay = document.getElementById('cvModalOverlay');

    const cvTriggers = document.querySelectorAll(
        '#navDownloadCV, #heroDownloadCV, #aboutDownloadCV, ' +
        '#mobileDownloadCV, #footerDownloadCV, #floatingCVBtn, ' +
        '#contactDownloadCV'
    );

    cvTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            cvModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    function closeCVModal() {
        cvModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (cvModalClose)   cvModalClose.addEventListener('click', closeCVModal);
    if (cvModalOverlay) cvModalOverlay.addEventListener('click', closeCVModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCVModal();
            closeLightbox();
        }
    });

    const downloadPDF = document.getElementById('downloadPDF');
    const downloadDOC = document.getElementById('downloadDOC');

    [downloadPDF, downloadDOC].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                if (btn.getAttribute('href') === '#' ||
                    btn.getAttribute('href').includes('assets/')) {

                    if (!btn.getAttribute('href').includes('assets/')) {
                        e.preventDefault();
                    }

                    const generating = document.getElementById('cvGenerating');
                    const success    = document.getElementById('cvSuccess');

                    generating.classList.add('active');
                    setTimeout(() => {
                        generating.classList.remove('active');
                        success.classList.add('active');
                        showToast('CV downloaded successfully!');
                        setTimeout(() => {
                            success.classList.remove('active');
                            closeCVModal();
                        }, 2000);
                    }, 2000);
                }
            });
        }
    });

    // ==========================================
    // CONTACT FORM — GLASS
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn      = contactForm.querySelector('.btn-submit');
            const originalText   = submitBtn.querySelector('.btn-text').textContent;
            submitBtn.querySelector('.btn-text').textContent = 'SENDING...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled      = true;

            setTimeout(() => {
                submitBtn.querySelector('.btn-text').textContent = originalText;
                submitBtn.style.opacity = '';
                submitBtn.disabled      = false;
                showToast("Message sent! I'll get back to you soon.");
                contactForm.reset();
            }, 1500);
        });
    }

    // ==========================================
    // TOAST — GLASS MIRROR
    // ==========================================
    function showToast(message, type = 'success') {
        const toast        = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon    = toast.querySelector('.toast-icon i');

        toastMessage.textContent = message;

        if (toastIcon) {
            toastIcon.className = type === 'error'
                ? 'fas fa-exclamation-circle'
                : 'fas fa-check-circle';
        }

        toast.style.borderColor = type === 'error'
            ? 'rgba(255, 45, 117, 0.3)'
            : 'rgba(var(--primary-rgb), 0.2)';

        toast.classList.add('show');

        const progress = toast.querySelector('.toast-progress');
        if (progress) {
            progress.style.animation = 'none';
            progress.offsetHeight;
            progress.style.animation = '';
        }

        setTimeout(() => { toast.classList.remove('show'); }, 3500);
    }

    // ==========================================
    // PORTFOLIO FILTER — GLASS
    // ==========================================
    const filterBtns     = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            portfolioItems.forEach((item, idx) => {
                const category = item.dataset.filter;
                if (filter === 'all' || category === filter) {
                    item.classList.remove('filter-hidden');
                    item.classList.add('filter-visible');
                    item.style.transitionDelay = (idx * 0.05) + 's';
                } else {
                    item.classList.remove('filter-visible');
                    item.classList.add('filter-hidden');
                    item.style.transitionDelay = '0s';
                }
            });
        });
    });

    // ==========================================
    // SKILL CATEGORY TABS — GLASS
    // ==========================================
    const skillTabs  = document.querySelectorAll('.skill-tab');
    const skillCards = document.querySelectorAll('.skill-card');

    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;

            skillTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            skillCards.forEach((card, idx) => {
                const cardCategory = card.dataset.category;
                if (category === 'all' || cardCategory === category) {
                    card.classList.remove('filter-hidden');
                    card.classList.add('filter-visible');
                    card.style.display = '';
                    card.style.transitionDelay = (idx * 0.04) + 's';
                } else {
                    card.classList.remove('filter-visible');
                    card.classList.add('filter-hidden');
                    card.style.transitionDelay = '0s';
                    setTimeout(() => {
                        if (card.classList.contains('filter-hidden')) {
                            card.style.display = 'none';
                        }
                    }, 400);
                }
            });
        });
    });

    // ==========================================
    // TESTIMONIALS SLIDER — GLASS
    // ==========================================
    const testimonialTrack         = document.getElementById('testimonialTrack');
    const testimonialCards         = document.querySelectorAll('.testimonial-card');
    const testimonialDotsContainer = document.getElementById('testimonialDots');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    let currentTestimonial  = 0;
    let testimonialInterval;

    if (testimonialDotsContainer && testimonialCards.length > 0) {
        testimonialCards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('t-dot');
            if (i === 0) dot.classList.add('active');
            dot.dataset.index = i;
            dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
            dot.addEventListener('click', () => {
                goToTestimonial(i);
                resetTestimonialInterval();
            });
            testimonialDotsContainer.appendChild(dot);
        });
    }

    function goToTestimonial(index) {
        if (!testimonialTrack) return;
        currentTestimonial = index;
        testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
        document.querySelectorAll('.t-dot').forEach((d, i) => {
            d.classList.toggle('active', i === index);
        });
    }

    function nextTestimonial() {
        goToTestimonial((currentTestimonial + 1) % testimonialCards.length);
    }

    function prevTestimonial() {
        goToTestimonial(
            (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length
        );
    }

    function resetTestimonialInterval() {
        clearInterval(testimonialInterval);
        testimonialInterval = setInterval(nextTestimonial, 6000);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prevTestimonial(); resetTestimonialInterval(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextTestimonial(); resetTestimonialInterval(); });

    if (testimonialCards.length > 0) {
        testimonialInterval = setInterval(nextTestimonial, 6000);
    }

    let touchStartX = 0;
    if (testimonialTrack) {
        testimonialTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        testimonialTrack.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextTestimonial();
                else          prevTestimonial();
                resetTestimonialInterval();
            }
        }, { passive: true });
    }

    // ==========================================
    // LIGHTBOX — GLASS MIRROR
    // ==========================================
    const lightbox        = document.getElementById('lightbox');
    const lightboxImage   = document.getElementById('lightboxImage');
    const lightboxInfo    = document.getElementById('lightboxInfo');
    const lightboxOverlay = document.querySelector('.lightbox-overlay');
    const lightboxClose   = document.querySelector('.lightbox-close');
    const lightboxPrev    = document.querySelector('.lightbox-prev');
    const lightboxNext    = document.querySelector('.lightbox-next');
    let currentLightboxIndex = 0;
    const projectData = [];

    document.querySelectorAll('.portfolio-item').forEach((item) => {
        const overlay = item.querySelector('.portfolio-overlay-content');
        if (overlay) {
            projectData.push({
                title:    overlay.querySelector('.portfolio-title')?.textContent || '',
                desc:     overlay.querySelector('.portfolio-desc')?.textContent  || '',
                category: overlay.querySelector('.portfolio-category')?.textContent || '',
                icon:     item.querySelector('.portfolio-placeholder i')?.className || 'fas fa-cube',
                tags:     item.querySelector('.portfolio-tag')?.textContent || ''
            });
        }
    });

    document.querySelectorAll('.portfolio-view-btn').forEach((btn, i) => {
        btn.addEventListener('click', () => { openLightbox(i); });
    });

    function openLightbox(index) {
        if (!lightbox) return;
        currentLightboxIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        const data = projectData[currentLightboxIndex];
        if (!data) return;

        const placeholder = lightboxImage.querySelector('.lightbox-placeholder');
        if (placeholder) {
            placeholder.innerHTML =
                `<i class="${data.icon}"></i><span>${data.category}</span>`;
        }

        if (lightboxInfo) {
            lightboxInfo.innerHTML = `
                <h3>${data.title}</h3>
                <p>${data.desc}</p>
                <div class="lightbox-tags">
                    <span>${data.category}</span>
                    ${data.tags ? `<span>${data.tags}</span>` : ''}
                </div>
            `;
        }
    }

    if (lightboxClose)   lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => {
            currentLightboxIndex =
                (currentLightboxIndex - 1 + projectData.length) % projectData.length;
            updateLightboxContent();
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => {
            currentLightboxIndex =
                (currentLightboxIndex + 1) % projectData.length;
            updateLightboxContent();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowLeft')  lightboxPrev?.click();
        if (e.key === 'ArrowRight') lightboxNext?.click();
    });

    // ==========================================
    // MUSIC PLAYER (SFX Toggle)
    // ==========================================
    const musicPlayer = document.getElementById('musicPlayer');
    let isMusicPlaying = false;

    if (musicPlayer) {
        musicPlayer.addEventListener('click', () => {
            isMusicPlaying = !isMusicPlaying;
            musicPlayer.classList.toggle('playing', isMusicPlaying);
            showToast(
                isMusicPlaying ? 'Sound effects enabled' : 'Sound effects disabled'
            );
        });
    }

    // ==========================================
    // MAGNETIC BUTTONS — GLASS ENHANCEMENT
    // ==========================================
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x    = e.clientX - rect.left - rect.width  / 2;
                const y    = e.clientY - rect.top  - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ==========================================
    // TILT CARDS — GLASS MIRROR EFFECT
    // ==========================================
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect    = card.getBoundingClientRect();
                const x       = (e.clientX - rect.left) / rect.width;
                const y       = (e.clientY - rect.top)  / rect.height;
                const rotateX = (0.5 - y) * 10;
                const rotateY = (x - 0.5) * 10;

                card.style.transform =
                    `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

                const shineX = (x * 100).toFixed(1);
                const shineY = (y * 100).toFixed(1);
                card.style.setProperty('--shine-x', shineX + '%');
                card.style.setProperty('--shine-y', shineY + '%');
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.removeProperty('--shine-x');
                card.style.removeProperty('--shine-y');
            });
        });
    }

    // ==========================================
    // GLASS HOVER SHINE EFFECT
    // ==========================================
    if (window.matchMedia('(pointer: fine)').matches) {
        const glassCards = document.querySelectorAll(
            '.timeline-card, .skill-card, .contact-card, ' +
            '.education-card, .about-quote, .info-item, ' +
            '.about-facts, .response-promise'
        );

        glassCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x    = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
                const y    = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);

                card.style.background = `
                    radial-gradient(
                        circle at ${x}% ${y}%,
                        rgba(255, 255, 255, 0.06) 0%,
                        rgba(255, 255, 255, 0.02) 40%,
                        transparent 70%
                    ),
                    rgba(255, 255, 255, 0.02)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.background = '';
            });
        });
    }

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top    = target.offsetTop - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ==========================================
    // GLASS CARD ENTRANCE GLOW
    // ==========================================
    const glowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.boxShadow = `
                    0 8px 32px rgba(0, 0, 0, 0.4),
                    0 0 0 1px rgba(255, 255, 255, 0.06),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1),
                    0 0 20px rgba(var(--primary-rgb), 0.05)
                `;
                setTimeout(() => {
                    entry.target.style.boxShadow = '';
                }, 1000);
                glowObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll(
        '.skill-card, .timeline-card, .portfolio-card, ' +
        '.education-card, .testimonial-card'
    ).forEach(card => glowObserver.observe(card));

    // ==========================================
    // INITIAL VISIBILITY CHECK
    // ==========================================
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);

    // ==========================================
    // PERFORMANCE — PAUSE ANIMATIONS
    // ==========================================
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            canvas.style.display = 'none';
        } else {
            canvas.style.display = 'block';
        }
    });

    // ==========================================
    // RESIZE HANDLER
    // ==========================================
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            window.dispatchEvent(new Event('scroll'));
        }, 250);
    });
});

// ===== Play Video on Overlay Click =====
function playVideo(overlay) {
    const container = overlay.parentElement;
    const iframe = container.querySelector('iframe');
    let src = iframe.getAttribute('src');

    // Add autoplay
    if (!src.includes('autoplay=1')) {
        src += (src.includes('?') ? '&' : '?') + 'autoplay=1';
        iframe.setAttribute('src', src);
    }

    // Enable iframe interaction
    iframe.classList.add('active');

    // Hide overlay
    overlay.classList.add('hidden');
}