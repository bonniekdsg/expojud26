const originalSlides = [...slides];
let displayedSlides = [...slides];
let currentSlide = 0;
let autoSlideInterval;
let activeBg;
let primedVideo = null;
let primedSource = '';
let openOverlay = null;
let returnFocus = null;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let userPaused = reducedMotion.matches;
const pauseReasons = new Set();
const $ = (id) => document.getElementById(id);
const backgrounds = [$('background-a'), $('background-b')];
const overlays = [$('modal-overlay'), $('contact-modal-overlay'), $('mobile-menu-overlay'), $('mobile-search-overlay')];
const arrowIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const pauseIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 5v14M15 5v14" stroke-linecap="round"/></svg>';
const playIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';

function syncPlayback() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = undefined;
    const carouselPaused = userPaused || pauseReasons.size > 0 || displayedSlides.length === 0;
    if (!carouselPaused && displayedSlides.length > 1) autoSlideInterval = setInterval(() => goToSlide(currentSlide + 1), 8000);
    backgrounds.forEach((background) => {
        const video = background.querySelector('video');
        if (!video) return;
        if (document.hidden || displayedSlides.length === 0 || background !== activeBg) video.pause();
        else video.play().catch(() => { /* The backdrop remains available if autoplay is blocked. */ });
    });
    $('playback-toggle').innerHTML = userPaused ? playIcon : pauseIcon;
    $('playback-toggle').setAttribute('aria-label', userPaused ? 'Retomar carrossel' : 'Pausar carrossel');
    $('playback-toggle').setAttribute('aria-pressed', String(userPaused));
}

function setPauseReason(reason, enabled) {
    if (pauseReasons.has(reason) === enabled) return;
    if (enabled) pauseReasons.add(reason);
    else pauseReasons.delete(reason);
    syncPlayback();
}

function canLoadVideo() {
    const connection = navigator.connection;
    return !reducedMotion.matches && !connection?.saveData && !['slow-2g', '2g'].includes(connection?.effectiveType);
}

function createVideo(source) {
    const video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.src = source;
    video.setAttribute('aria-hidden', 'true');
    video.addEventListener('loadeddata', () => {
        video.classList.add('is-ready');
        if (activeBg?.contains(video)) primeUpcomingVideo();
    });
    video.load();
    return video;
}

function primeUpcomingVideo() {
    if (!canLoadVideo() || displayedSlides.length < 2) return;
    const upcoming = displayedSlides[(currentSlide + 1) % displayedSlides.length];
    if (upcoming.background.type !== 'video' || primedSource === upcoming.background.src) return;
    if (primedVideo) {
        primedVideo.removeAttribute('src');
        primedVideo.load();
    }
    primedSource = upcoming.background.src;
    primedVideo = createVideo(primedSource);
}

function setSlideBackground(slide) {
    const next = activeBg === backgrounds[0] ? backgrounds[1] : backgrounds[0];
    next.replaceChildren();
    const placeholder = document.createElement('div');
    placeholder.className = 'slide-placeholder';
    placeholder.style.backgroundImage = `url('${slide.background.type === 'video' ? slide.cardImages[0] : slide.background.src}')`;
    next.append(placeholder);
    if (slide.background.type === 'video' && canLoadVideo()) {
        const video = primedSource === slide.background.src ? primedVideo : createVideo(slide.background.src);
        primedVideo = null;
        primedSource = '';
        next.append(video);
        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) video.classList.add('is-ready');
    }
    if (activeBg) activeBg.style.opacity = '0';
    next.style.opacity = '1';
    activeBg = next;
    if (next.querySelector('video')?.classList.contains('is-ready')) primeUpcomingVideo();
}

function renderNavigation() {
    $('indicators').replaceChildren();
    $('image-carousel').replaceChildren();
    displayedSlides.forEach((slide, index) => {
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.className = 'indicator';
        indicator.setAttribute('aria-label', `Mostrar ${slide.title}`);
        indicator.addEventListener('click', () => goToSlide(index));
        $('indicators').append(indicator);

        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'image-card';
        card.setAttribute('aria-label', `Mostrar ${slide.title}`);
        card.dataset.title = slide.officialTitle || slide.title;
        const image = document.createElement('img');
        image.src = slide.cardImages[0];
        image.alt = slide.officialTitle || slide.title;
        image.loading = 'lazy';
        image.decoding = 'async';
        const title = document.createElement('span');
        title.className = 'card-title';
        title.textContent = slide.title;
        card.append(image, title);
        card.addEventListener('click', () => goToSlide(index));
        card.addEventListener('pointerenter', (event) => {
            if (event.pointerType === 'mouse' && card.classList.contains('active')) setPauseReason('active-card-hover', true);
        });
        card.addEventListener('pointerleave', (event) => {
            if (event.pointerType === 'mouse') setPauseReason('active-card-hover', false);
        });
        $('image-carousel').append(card);
    });
}

function updateSlide() {
    const slide = displayedSlides[currentSlide];
    if (!slide) return;
    const restoreExploreFocus = document.activeElement?.id === "explore-btn";
    setSlideBackground(slide);
    const content = document.createElement('div');
    content.className = 'content-slide';
    const title = document.createElement('h1');
    title.className = 'slide-title font-serif';
    title.textContent = slide.title;
    const responsibility = document.createElement('div');
    responsibility.className = 'slide-responsibility';
    responsibility.setAttribute('aria-label', 'Órgãos responsáveis pela iniciativa');
    (slide.responsible || []).forEach(({ label, name }) => {
        const line = document.createElement('p');
        const role = document.createElement('span');
        role.className = 'slide-responsibility-label';
        role.textContent = `${label}: `;
        const owner = document.createElement('span');
        owner.textContent = name;
        line.append(role, owner);
        responsibility.append(line);
    });
    const description = document.createElement('p');
    description.className = 'slide-description';
    description.textContent = slide.description;
    const explore = document.createElement('button');
    explore.id = 'explore-btn';
    explore.className = 'btn-dynamic';
    explore.setAttribute('aria-haspopup', 'dialog');
    explore.innerHTML = `<span>Conhecer iniciativa</span>${arrowIcon}`;
    explore.addEventListener('click', () => openModal(slide));
    content.append(title, responsibility, description, explore);
    $('content-container').replaceChildren(content);
    if (restoreExploreFocus) explore.focus();
    const cards = [...$('image-carousel').children];
    cards.forEach((card, index) => {
        card.classList.toggle('active', index === currentSlide);
        card.setAttribute('aria-current', String(index === currentSlide));
    });
    if (window.matchMedia('(hover: hover)').matches && cards[currentSlide].matches(':hover')) pauseReasons.add('active-card-hover');
    else pauseReasons.delete('active-card-hover');
    [...$('indicators').children].forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
        indicator.setAttribute('aria-current', String(index === currentSlide));
    });
    const carousel = $('image-carousel');
    const card = cards[currentSlide];
    const offset = card.getBoundingClientRect().left - carousel.getBoundingClientRect().left;
    carousel.scrollTo({ left: carousel.scrollLeft + offset - (carousel.clientWidth - card.offsetWidth) / 2, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    $('slide-count').textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(displayedSlides.length).padStart(2, '0')}`;
    syncPlayback();
}

function goToSlide(index) {
    if (!displayedSlides.length) return;
    currentSlide = (index + displayedSlides.length) % displayedSlides.length;
    updateSlide();
}

function openModal(slide) {
    $('modal-title').textContent = slide.officialTitle || slide.title;
    $('modal-description').textContent = slide.description;
    $('modal-responsibility').replaceChildren();
    (slide.responsible || []).forEach(({ label, name }) => {
        const line = document.createElement('p');
        line.className = 'modal-responsibility-line';
        const role = document.createElement('strong');
        role.textContent = `${label}: `;
        line.append(role, document.createTextNode(name));
        $('modal-responsibility').append(line);
    });
    $('modal-more').replaceChildren();
    (slide.details || [slide.description]).forEach((detail) => {
        const paragraph = document.createElement('p');
        paragraph.className = 'mb-4';
        paragraph.textContent = detail;
        $('modal-more').append(paragraph);
    });
    if (slide.steps?.length) {
        const heading = document.createElement('h4');
        heading.className = 'font-bold mb-3';
        heading.textContent = 'Como funciona';
        const list = document.createElement('ul');
        list.className = 'list-disc list-inside space-y-2 mb-4';
        slide.steps.forEach((step) => {
            const item = document.createElement('li');
            item.textContent = step;
            list.append(item);
        });
        $('modal-more').append(heading, list);
    }
    $('modal-content').scrollTop = 0;
    showOverlay($('modal-overlay'), $('modal-close'));
}

function showOverlay(overlay, focusTarget) {
    returnFocus = document.activeElement;
    openOverlay = overlay;
    overlay.inert = false;
    overlay.classList.add('active');
    overlay.classList.remove('hidden');
    document.querySelectorAll('header, main, footer').forEach((element) => { element.inert = true; });
    overlays.filter((other) => other !== overlay).forEach((other) => { other.inert = true; });
    document.body.style.overflow = 'hidden';
    setPauseReason('dialog', true);
    requestAnimationFrame(() => { if (openOverlay === overlay) focusTarget.focus(); });
}

function closeOverlay() {
    if (!openOverlay) return;
    const previous = openOverlay;
    openOverlay = null;
    previous.classList.remove('active');
    if (previous.id === 'mobile-search-overlay') previous.classList.add('hidden');
    previous.inert = true;
    document.querySelectorAll('header, main, footer').forEach((element) => { element.inert = false; });
    document.body.style.overflow = '';
    if (returnFocus?.isConnected) returnFocus.focus();
    setPauseReason('dialog', false);
}

function normalizeSearch(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
}

function performSearch(query) {
    const normalized = normalizeSearch(query);
    $('search-input').value = query;
    $('mobile-search-input').value = query;
    displayedSlides = originalSlides.filter((slide) => {
        const owners = (slide.responsible || []).map(({ label, name }) => `${label} ${name}`).join(' ');
        return normalizeSearch(`${slide.title} ${slide.officialTitle || ''} ${slide.category} ${owners}`).includes(normalized);
    });
    currentSlide = 0;
    renderNavigation();
    $('search-status').textContent = `${displayedSlides.length} ${displayedSlides.length === 1 ? 'iniciativa encontrada' : 'iniciativas encontradas'}.`;
    ['previous-slide', 'next-slide'].forEach((id) => { $(id).disabled = displayedSlides.length < 2; });
    $('playback-toggle').disabled = displayedSlides.length === 0;
    if (displayedSlides.length) {
        updateSlide();
    } else {
        const empty = document.createElement('div');
        empty.className = 'content-slide';
        const title = document.createElement('h1');
        title.className = 'slide-title font-serif';
        title.textContent = 'Nenhuma iniciativa encontrada';
        const description = document.createElement('p');
        description.className = 'slide-description';
        description.textContent = `Tente outro título ou categoria para “${query}”.`;
        const reset = document.createElement('button');
        reset.className = 'btn-dynamic';
        reset.textContent = 'Ver todas as iniciativas';
        reset.addEventListener('click', () => { performSearch(''); $('explore-btn').focus(); });
        empty.append(title, description, reset);
        $('content-container').replaceChildren(empty);
        $('slide-count').textContent = '0 / 0';
        syncPlayback();
    }
}

$('previous-slide').addEventListener('click', () => goToSlide(currentSlide - 1));
$('next-slide').addEventListener('click', () => goToSlide(currentSlide + 1));
$('playback-toggle').addEventListener('click', () => {
    userPaused = !userPaused;
    syncPlayback();
});
$('search-input').addEventListener('input', (event) => performSearch(event.target.value));
$('search-btn').addEventListener('click', () => performSearch($('search-input').value));
$('search-input').addEventListener('keydown', (event) => {
    if (event.key === 'Escape') performSearch('');
    if (event.key === 'Enter') { performSearch(event.target.value); $('explore-btn')?.focus(); }
});
$('contact-btn').addEventListener('click', (event) => {
    event.preventDefault();
    showOverlay($('contact-modal-overlay'), $('contact-modal-close'));
});
$('hamburger-btn').addEventListener('click', () => {
    $('mobile-main-menu').classList.remove('hidden');
    $('mobile-contact-menu').classList.add('hidden');
    showOverlay($('mobile-menu-overlay'), $('mobile-menu-close'));
});
$('mobile-contact-btn').addEventListener('click', () => {
    $('mobile-main-menu').classList.add('hidden');
    $('mobile-contact-menu').classList.remove('hidden');
    $('mobile-back-btn').focus();
});
$('mobile-back-btn').addEventListener('click', () => {
    $('mobile-main-menu').classList.remove('hidden');
    $('mobile-contact-menu').classList.add('hidden');
    $('mobile-contact-btn').focus();
});
$('mobile-search-open-btn').addEventListener('click', () => showOverlay($('mobile-search-overlay'), $('mobile-search-input')));
function mobileSearch() { performSearch($('mobile-search-input').value); closeOverlay(); }
$('mobile-search-execute-btn').addEventListener('click', mobileSearch);
$('mobile-search-input').addEventListener('keydown', (event) => { if (event.key === 'Enter') mobileSearch(); });
['modal-close', 'contact-modal-close', 'mobile-menu-close', 'mobile-search-close-btn'].forEach((id) => $(id).addEventListener('click', closeOverlay));
overlays.forEach((overlay) => {
    overlay.inert = true;
    overlay.addEventListener('click', (event) => { if (event.target === overlay) closeOverlay(); });
});

function focusableElements(container) {
    return [...container.querySelectorAll('button, a[href], input, [tabindex="0"]')].filter((element) => !element.disabled && element.getClientRects().length && !element.closest('[inert]'));
}

document.addEventListener('keydown', (event) => {
    if (openOverlay) {
        if (event.key === 'Escape') { event.preventDefault(); closeOverlay(); }
        if (event.key === 'Tab') {
            const elements = focusableElements(openOverlay);
            const first = elements[0];
            const last = elements.at(-1);
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }
        return;
    }
    if (event.target.matches('input, textarea, [contenteditable]')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        goToSlide(currentSlide + (event.key === 'ArrowRight' ? 1 : -1));
    }
});

document.addEventListener('visibilitychange', () => setPauseReason('hidden', document.hidden));
window.matchMedia('(min-width: 768px)').addEventListener('change', (event) => {
    if (event.matches && openOverlay?.id.startsWith('mobile-')) closeOverlay();
});
reducedMotion.addEventListener('change', () => { userPaused = reducedMotion.matches; updateSlide(); });
renderNavigation();
updateSlide();
