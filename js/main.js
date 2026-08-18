document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       SHARED NAVIGATION (DETAIL PAGES)
    ========================================== */
    const sharedNav = document.getElementById('shared-nav');
    if (sharedNav) {
        sharedNav.innerHTML = `
            <nav class="detail-nav">
                <div class="container">
                    <a href="../index.html">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                        Volver al Portafolio
                    </a>
                </div>
            </nav>
        `;
    }

    /* ==========================================
       YEAR
    ========================================== */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ==========================================
       NAVBAR SCROLL EFFECT
    ========================================== */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const onScroll = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ==========================================
       HAMBURGER MENU
    ========================================== */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Cerrar al hacer clic en un enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    /* ==========================================
       SMOOTH SCROLL (con offset para el nav)
    ========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({ top, behavior: 'smooth' });
        });
    });



    // Scroll to Top Button
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================
       SCROLL REVEAL (Intersection Observer)
    ========================================== */
    const fadeEls = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px 150px 0px'
        });

        fadeEls.forEach(el => observer.observe(el));
    } else {
        // Fallback: mostrar todo
        fadeEls.forEach(el => el.classList.add('visible'));
    }

    /* ==========================================
       LIGHTBOX & IMAGE STACK INTERACTION
    ========================================== */
    const initImageInteractions = () => {
        // 1. Create Lightbox DOM dynamically
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <button class="lightbox-nav lightbox-prev" aria-label="Anterior">&#10094;</button>
                <img src="" alt="Vista ampliada">
                <button class="lightbox-nav lightbox-next" aria-label="Siguiente">&#10095;</button>
                <button class="lightbox-close" aria-label="Cerrar">&times;</button>
            </div>
        `;
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const overlay = lightbox.querySelector('.lightbox-overlay');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        let currentGallery = [];
        let currentIndex = 0;

        const openLightbox = (src, galleryElements) => {
            currentGallery = Array.from(galleryElements).map(el => el.src);
            currentIndex = currentGallery.indexOf(src);
            
            // If the image clicked is somehow not in the gallery array, fallback
            if (currentIndex === -1) {
                currentGallery = [src];
                currentIndex = 0;
            }

            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const updateLightboxImage = () => {
            lightboxImg.src = currentGallery[currentIndex];
            
            // Hide/show arrows if there is only 1 image
            if (currentGallery.length <= 1) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'block';
                nextBtn.style.display = 'block';
            }
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        const goPrev = (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentGallery.length - 1;
            updateLightboxImage();
        };

        const goNext = (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex < currentGallery.length - 1) ? currentIndex + 1 : 0;
            updateLightboxImage();
        };

        closeBtn.addEventListener('click', closeLightbox);
        overlay.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', goPrev);
        nextBtn.addEventListener('click', goNext);

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') goPrev(e);
            if (e.key === 'ArrowRight') goNext(e);
        });

        // 2. Image Showcase Logic
        document.querySelectorAll('.image-showcase').forEach(showcase => {
            const mainImg = showcase.querySelector('.showcase-main img');
            const thumbs = showcase.querySelectorAll('.showcase-thumbs img');
            
            // Collect all images in this gallery to pass to the lightbox
            const getGalleryImages = () => {
                const images = [];
                if (mainImg) images.push(mainImg);
                thumbs.forEach(t => images.push(t));
                return images;
            };

            // Abrir lightbox al clickear la imagen principal
            if (mainImg) {
                mainImg.title = 'Clic para ampliar';
                mainImg.addEventListener('click', () => openLightbox(mainImg.src, getGalleryImages()));
            }
            
            // Intercambiar imagen al clickear las miniaturas
            thumbs.forEach(thumb => {
                thumb.title = 'Clic para ver principal';
                thumb.addEventListener('click', function() {
                    // Swap sources
                    const tempSrc = mainImg.src;
                    mainImg.src = this.src;
                    this.src = tempSrc;
                    
                    // Add animation effect to main image
                    mainImg.style.opacity = '0.5';
                    setTimeout(() => {
                        mainImg.style.opacity = '1';
                    }, 50);
                });
            });
        });
    };

    initImageInteractions();
});
