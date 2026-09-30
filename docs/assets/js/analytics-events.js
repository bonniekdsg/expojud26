(function() {
  // Ensure all cards have a stable data-title based on their IMG alt
  function stampTitlesOnCards() {
    try {
      document.querySelectorAll('.image-card').forEach(function(card){
        if (!card.getAttribute('data-title')) {
          var img = card.querySelector('img');
          if (img && img.getAttribute('alt')) {
            card.setAttribute('data-title', img.getAttribute('alt'));
          }
        }
      });
    } catch (e) { /* noop */ }
  }

  // Delegate clicks on cards to send GA4 event with a reliable label
  function setupDelegatedCardClicks() {
    document.addEventListener('click', function(ev){
      var card = ev.target && ev.target.closest ? ev.target.closest('.image-card') : null;
      if (!card) return;
      // Make sure title is present
      stampTitlesOnCards();
      var nome = card.getAttribute('data-title') ||
                 (card.querySelector('img') && card.querySelector('img').getAttribute('alt')) ||
                 'Sem nome';
      if (typeof gtag === 'function') {
        try {
          gtag('event', 'click_iniciativa', {
            event_category: 'Iniciativas',
            event_label: nome
          });
        } catch (e) { /* noop */ }
      }
    }, true);
  }

  // Track "Explore Agora" button clicks with the current slide title, if available
  function setupExploreButtonTracking() {
    function bind(btn) {
      if (!btn || btn.__ga_bind) return;
      btn.__ga_bind = true;
      btn.addEventListener('click', function(){
        var nome = 'Sem nome';
        try {
          if (typeof displayedSlides !== 'undefined' && typeof currentSlide !== 'undefined') {
            var slide = displayedSlides[currentSlide] || null;
            if (slide && (slide.title || slide.name)) nome = slide.title || slide.name;
          }
        } catch (e) {}
        if (typeof gtag === 'function') {
          try {
            gtag('event', 'click_iniciativa', {
              event_category: 'Iniciativas',
              event_label: nome
            });
          } catch (e) { /* noop */ }
        }
      }, true);
    }

    // Try to bind immediately
    bind(document.getElementById('explore-btn'));

    // ...and observe DOM changes to bind if the button is rendered later
    try {
      var mo = new MutationObserver(function(){
        bind(document.getElementById('explore-btn'));
        stampTitlesOnCards();
      });
      mo.observe(document.documentElement, {subtree: true, childList: true});
    } catch (e) {}
  }

  // Kick it off after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      stampTitlesOnCards();
      setupDelegatedCardClicks();
      setupExploreButtonTracking();
    });
  } else {
    stampTitlesOnCards();
    setupDelegatedCardClicks();
    setupExploreButtonTracking();
  }
})();
