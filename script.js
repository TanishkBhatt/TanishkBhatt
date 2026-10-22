const root = document.documentElement;
const body = document.body;
const nav = document.getElementById('siteNav');
const navLinks = document.getElementById('navLinks');
const menuToggle = document.getElementById('menuToggle');
const scrollBar = document.getElementById('scrollBar');
const backToTop = document.getElementById('backToTop');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function closeMenu() {
    navLinks.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    body.classList.remove('menu-open');
}

menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    body.classList.toggle('menu-open', isOpen);
});

navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('click', (event) => {
    if (!navLinks.classList.contains('is-open')) {
        return;
    }
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeMenu();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 960) {
        closeMenu();
    }
});

let ticking = false;

function updateScrollUI() {
    const scrollTop = window.scrollY || root.scrollTop;
    const scrollHeight = root.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    scrollBar.style.width = progress + '%';
    nav.classList.toggle('is-scrolled', scrollTop > 20);
    backToTop.classList.toggle('is-visible', scrollTop > 600);
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateScrollUI);
        ticking = true;
    }
}, { passive: true });

window.addEventListener('resize', updateScrollUI);
updateScrollUI();

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
    });
});

const sections = Array.from(document.querySelectorAll('main section[id]'));
const navAnchors = Array.from(document.querySelectorAll('.nav-link'));

if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }
            const target = '#' + entry.target.id;
            navAnchors.forEach((anchor) => {
                anchor.classList.toggle('is-active', anchor.getAttribute('href') === target);
            });
        });
    }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });

    sections.forEach((section) => spy.observe(section));
}

const revealElements = Array.from(document.querySelectorAll('.reveal'));

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }
            const delay = entry.target.dataset.delay;
            if (delay) {
                entry.target.style.transitionDelay = delay + 'ms';
            }
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
}

if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.spotlight-card').forEach((card) => {
        card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', (event.clientX - rect.left) + 'px');
            card.style.setProperty('--my', (event.clientY - rect.top) + 'px');
        });
    });
}

document.querySelectorAll('.stat-panel').forEach((panel) => {
    const images = Array.from(panel.querySelectorAll('img'));
    let failures = 0;

    images.forEach((image) => {
        image.addEventListener('error', () => {
            failures += 1;
            if (failures === images.length) {
                panel.classList.add('is-unavailable');
            }
        });
    });
});
