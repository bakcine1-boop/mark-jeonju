/* =============================================
   WORSHIP MUSICAL "MARK" — Main JavaScript
   v2.0 — Hero Slideshow + YouTube + Cast Profiles
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initHeroSlideshow();
    initCountdown();
    initVoiceSlider();
    initVideoEmbed();
    initCastCards();
    initGalleryLightbox();
    initSmoothScroll();
    initBookingCountdown();
    initSetlistPlayer();
});

/* =============================================
   NAVBAR
   ============================================= */
function initNavbar() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('[data-nav]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { root: null, rootMargin: '-30% 0px -70% 0px', threshold: 0 });

    sections.forEach(section => sectionObserver.observe(section));
}

/* =============================================
   MOBILE MENU
   ============================================= */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('[data-mobile-nav]');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/* =============================================
   SCROLL REVEAL
   ============================================= */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const parent = entry.target.parentElement;
                const siblings = parent.querySelectorAll('.reveal');
                let delay = 0;
                siblings.forEach((sib, i) => {
                    if (sib === entry.target) delay = i * 80;
                });
                delay = Math.min(delay, 400);

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => revealObserver.observe(el));

    // Hero reveals
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), 300 + i * 150);
        });
    }, 200);
}

/* =============================================
   HERO SLIDESHOW — Crossfade
   ============================================= */
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length < 2) return;

    let current = 0;
    const total = slides.length;

    setInterval(() => {
        const next = (current + 1) % total;

        // Reset zoom animation on new slide
        const nextImg = slides[next].querySelector('.hero-slide-img');
        nextImg.style.animation = 'none';
        nextImg.offsetHeight; // force reflow
        nextImg.style.animation = '';

        slides[current].classList.remove('active');
        slides[next].classList.add('active');
        current = next;
    }, 6000);
}

/* =============================================
   COUNTDOWN BANNER
   ============================================= */
function initCountdown() {
    const countdownText = document.getElementById('countdownText');
    if (!countdownText) return;
    const openingDate = new Date('2026-11-14T16:00:00+09:00');
    const closingDate = new Date('2026-11-14T18:00:00+09:00');

    function update() {
        const now = new Date();
        if (now < openingDate) {
            const diff = openingDate - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            countdownText.textContent = `공연까지 D-${days} · 11.14(토) 오후 4시 양정교회`;
        } else if (now <= closingDate) {
            countdownText.textContent = '지금 공연 중입니다 | 전주 양정교회';
        } else {
            countdownText.textContent = '공연이 종료되었습니다. 감사합니다.';
        }
    }

    update();
    setInterval(update, 60000);
}

/* =============================================
   BOOKING COUNTDOWN
   ============================================= */
function initBookingCountdown() {
    const el = document.getElementById('bookingCountdown');
    if (!el) return;
    const openingDate = new Date('2026-11-14T16:00:00+09:00');
    const closingDate = new Date('2026-11-14T18:00:00+09:00');

    function update() {
        const now = new Date();
        if (now < openingDate) {
            const diff = openingDate - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            el.textContent = `공연까지 ${days}일 ${hours}시간 ${minutes}분`;
        } else if (now <= closingDate) {
            el.textContent = '지금 공연 중입니다.';
        } else {
            el.textContent = '';
        }
    }

    update();
    setInterval(update, 60000);
}

/* =============================================
   VOICE SLIDER
   ============================================= */
function initVoiceSlider() {
    const slides = document.querySelectorAll('.voice-slide');
    const dotsContainer = document.getElementById('voiceDots');
    const prevBtn = document.querySelector('.voice-prev');
    const nextBtn = document.querySelector('.voice-next');
    let currentSlide = 0;
    let autoPlay;

    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dotsContainer.children[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dotsContainer.children[currentSlide].classList.add('active');
        resetAutoPlay();
    }

    function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
    function prevSlide() { goToSlide((currentSlide - 1 + slides.length) % slides.length); }
    function resetAutoPlay() {
        clearInterval(autoPlay);
        autoPlay = setInterval(nextSlide, 5000);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Touch
    const slider = document.getElementById('voiceSlider');
    let touchStartX = 0;
    slider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    slider.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
    }, { passive: true });

    autoPlay = setInterval(nextSlide, 5000);
}

/* =============================================
   VIDEO EMBED — YouTube
   ============================================= */
function initVideoEmbed() {
    const wrapper = document.getElementById('videoWrapper');
    const thumbnail = document.getElementById('videoThumbnail');
    if (!wrapper || !thumbnail) return;
    thumbnail.addEventListener('click', () => {
        thumbnail.style.display = 'none';
        const v = document.createElement('video');
        v.src = 'promo.mp4';
        v.controls = true; v.autoplay = true; v.playsInline = true;
        v.setAttribute('playsinline', '');
        v.className = 'mk-promo-video';
        wrapper.appendChild(v);
        v.play().catch(() => {});
    });
}

function extractYouTubeId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const p of patterns) {
        const match = url.match(p);
        if (match) return match[1];
    }
    return null;
}

/* =============================================
   CAST CARDS — Individual Photos + Mobile Tap Bio
   ============================================= */
function initCastCards() {
    const cards = document.querySelectorAll('.cast-card');
    const isMobile = window.matchMedia('(max-width: 768px)');

    cards.forEach((card, i) => {
        // Add mobile tooltip element
        const bio = card.getAttribute('data-bio');
        if (bio) {
            const tooltip = document.createElement('div');
            tooltip.classList.add('cast-tooltip');
            tooltip.textContent = bio;
            card.appendChild(tooltip);
        }

        card.addEventListener('click', () => {
            if (isMobile.matches) {
                const wasOpen = card.classList.contains('show-bio');
                cards.forEach(c => c.classList.remove('show-bio'));
                if (!wasOpen) card.classList.add('show-bio');
            }
        });
    });
}

/* =============================================
   GALLERY LIGHTBOX
   ============================================= */
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lbImage = document.getElementById('lbImage');
    const lbClose = document.querySelector('.lb-close');
    const lbPrev = document.querySelector('.lb-prev');
    const lbNext = document.querySelector('.lb-next');
    let currentIndex = 0;

    const images = [];
    galleryItems.forEach(item => {
        images.push(item.querySelector('img').src);
    });

    function openLightbox(index) {
        currentIndex = index;
        lbImage.src = images[currentIndex];
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    galleryItems.forEach((item, i) => {
        item.addEventListener('click', () => openLightbox(i));
    });

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    lbPrev.addEventListener('click', e => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lbImage.src = images[currentIndex];
    });

    lbNext.addEventListener('click', e => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        lbImage.src = images[currentIndex];
    });

    // Keyboard
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + images.length) % images.length; lbImage.src = images[currentIndex]; }
        if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % images.length; lbImage.src = images[currentIndex]; }
    });

    // Touch
    let lbTouchX = 0;
    lightbox.addEventListener('touchstart', e => { lbTouchX = e.changedTouches[0].screenX; }, { passive: true });
    lightbox.addEventListener('touchend', e => {
        const diff = lbTouchX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            currentIndex = diff > 0 ? (currentIndex + 1) % images.length : (currentIndex - 1 + images.length) % images.length;
            lbImage.src = images[currentIndex];
        }
    }, { passive: true });
}

/* =============================================
   SMOOTH SCROLL
   ============================================= */
/* =============================================
   SETLIST PLAYER — YouTube IFrame API Mini Player
   ============================================= */
function initSetlistPlayer() {
    const setlistItems = document.querySelectorAll('.setlist-list li[data-yt]');
    const miniPlayer = document.getElementById('miniPlayer');
    const playerTitle = document.getElementById('miniPlayerTitle');
    const playerClose = document.getElementById('miniPlayerClose');
    const playerIframe = document.getElementById('miniPlayerIframe');
    
    if (!miniPlayer || !setlistItems.length) return;

    let currentPlaying = null;

    // Known YouTube video IDs for each CCM song
    const SONG_VIDEO_MAP = {
        'CCM 너는 크게 자유를 외쳐라': 'I8xogvluZAw',
        'CCM 하나님은 너를 지키시는 자': 'whxeFm6kbKg',
        'CCM 싹트네 찬양': '51P7sso0SZ0',
        'CCM 가시나무 찬양': '2l9-OsPf1nc',
        '찬미워십 원하고 바라고 기도합니다': 'eoDsJr7LF-0',
        'CCM 공포가 밀려왔어 찬양': null,
        'CCM 땅 끝까지 이르러 찬양': 'mKMU_RX5bDs',
        'CCM 주의 손에 나의 손을 포개고': 'JXioLi7N4vo',
        'CCM 주여 인도하소서 찬양': 'Ahf5qPny5Og',
        'CCM 가서 제자 삼으라 찬양': 'OtNleLpYUmA',
        'CCM 사명 찬양': 'YYHv0BxtwCQ',
        'CCM 하나님의 열심 찬양': 'QkHKe6bPPE0',
        'CCM 물이 바다 덮음같이 찬양': 'DHerdQ9m-UA',
        'CCM 축복송 송정미': 'jsBzgpfD8wk',
    };

    setlistItems.forEach(item => {
        const playBtn = item.querySelector('.sl-play');
        const songName = item.querySelector('.sl-name').textContent.trim();
        const query = item.getAttribute('data-yt');

        // Make the entire row clickable for play
        const handlePlay = (e) => {
            e.stopPropagation();
            
            // If same song, toggle
            if (currentPlaying === item) {
                closeMiniPlayer();
                return;
            }

            // Remove active state from previous
            if (currentPlaying) {
                currentPlaying.classList.remove('sl-active');
            }

            item.classList.add('sl-active');
            currentPlaying = item;

            // Use known video ID or fallback to YouTube search
            const knownId = SONG_VIDEO_MAP[query];
            if (knownId) {
                playerIframe.src = `https://www.youtube.com/embed/${knownId}?autoplay=1&rel=0`;
            } else {
                // Fallback: embed YouTube search results
                const searchQuery = encodeURIComponent(query);
                playerIframe.src = `https://www.youtube.com/embed?listType=search&list=${searchQuery}&autoplay=1`;
            }
            playerTitle.textContent = songName;
            miniPlayer.classList.add('open');
            document.body.classList.add('player-open');
        };

        if (playBtn) playBtn.addEventListener('click', handlePlay);
        item.style.cursor = 'pointer';
        item.addEventListener('click', handlePlay);
    });

    // Close handler
    playerClose.addEventListener('click', closeMiniPlayer);

    function closeMiniPlayer() {
        miniPlayer.classList.remove('open');
        document.body.classList.remove('player-open');
        playerIframe.src = '';
        if (currentPlaying) {
            currentPlaying.classList.remove('sl-active');
            currentPlaying = null;
        }
    }
}

/* =============================================
   SMOOTH SCROLL
   ============================================= */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = document.getElementById('navbar').offsetHeight;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}
