let originalSlides = [...slides];
        let displayedSlides = [...slides];
        let currentSlide = 0;
        let autoSlideInterval;
        let bgA, bgB, activeBg;
        let isFinalistFilterActive = false;

        function initializeSlider() {
            bgA = document.getElementById('background-a');
            bgB = document.getElementById('background-b');
            const searchInput = document.getElementById('search-input');
            const searchBtn = document.getElementById('search-btn');
            const finalistsBtn = document.getElementById('finalists-btn');
            
            setSlideBackground(bgA, displayedSlides[0].background);
            activeBg = bgA;

            renderIndicators();
            renderImageCards();
            updateSlide(true); // Marca como inicialização
            startAutoSlide();

            finalistsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleFinalistFilter();
            });

            const desktopSearch = () => {
                performSearchLogic(searchInput.value.toLowerCase().trim(), searchInput.value);
            };
            searchBtn.addEventListener('click', desktopSearch);
            searchInput.addEventListener('input', desktopSearch);
            searchInput.addEventListener('keydown', e => {
                if (e.key === 'Escape') {
                    searchInput.value = '';
                    desktopSearch();
                }
            });
            
            document.getElementById('modal-overlay').addEventListener('click', (e) => {
                if (e.target.id === 'modal-overlay' || e.target.id === 'modal-close') {
                    closeModal();
                }
            });
        }

        function renderIndicators() {
            const indicatorsContainer = document.getElementById('indicators');
            indicatorsContainer.innerHTML = '';
            const wineRedColor = 'bg-red-800';
            
            displayedSlides.forEach((_, index) => {
                const indicator = document.createElement('div');
                indicator.className = `indicator rounded-full ${wineRedColor} cursor-pointer`;
                indicator.addEventListener('click', () => goToSlide(index));
                indicatorsContainer.appendChild(indicator);
            });
        }

        function renderImageCards() {
            const carouselContainer = document.getElementById('image-carousel');
            carouselContainer.innerHTML = '';
            
            displayedSlides.forEach((slide, index) => {
                const card = document.createElement('div');
                card.className = 'image-card';
                const image = document.createElement('img');
                image.src = slide.cardImages[0];
                image.alt = slide.officialTitle || slide.title;
                image.className = 'w-full h-full object-cover';
                image.loading = 'lazy';
                card.appendChild(image);
                card.addEventListener('click', () => goToSlide(index));
                carouselContainer.appendChild(card);
            });

            carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
            carouselContainer.addEventListener('mouseleave', () => restartAutoSlide());
        }

        function updateSlide(isInitial = false) {
            if (displayedSlides.length === 0) return;

            // Atualizar fundo com cross-fade
            if (!isInitial) {
                const inactiveBg = (activeBg === bgA) ? bgB : bgA;
                setSlideBackground(inactiveBg, displayedSlides[currentSlide].background);
                activeBg.style.opacity = '0';
                inactiveBg.style.opacity = '1';
                activeBg = inactiveBg;
            }
            
            // Atualizar conteúdo
            const contentContainer = document.getElementById('content-container');
            const isFinalist = displayedSlides.length > 0 && displayedSlides[currentSlide].isFinalist;
            const slide = displayedSlides[currentSlide];
            const contentSlide = document.createElement('div');
            contentSlide.className = 'content-slide';

            if (isFinalist) {
                const finalistTag = document.createElement('div');
                finalistTag.className = 'finalist-tag';
                finalistTag.textContent = '⭐ Finalista Prêmio J.Ex';
                contentSlide.appendChild(finalistTag);
            }

            const category = document.createElement('p');
            category.className = 'text-sm font-medium tracking-wider mb-3 uppercase';
            category.style.color = '#ff4c4c';
            category.textContent = slide.category;

            const title = document.createElement('h1');
            title.className = 'slide-title font-serif font-bold text-white';
            title.textContent = slide.title;

            const description = document.createElement('p');
            description.className = 'slide-description text-white';
            description.textContent = slide.description;

            const exploreButton = document.createElement('button');
            exploreButton.className = 'relative btn-dynamic group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-full text-sm lg:text-base';
            exploreButton.innerHTML = '<span class="absolute inset-0 bg-red-700 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span><span class="relative z-10">Explore Agora</span>';

            contentSlide.append(category, title, description, exploreButton);
            contentContainer.replaceChildren(contentSlide);
            
            // Adicionar evento ao botão Explore Agora
            contentContainer.querySelector('button').addEventListener('click', () => {
                openModal(slide);
            });

            // Aplicar animação de entrada
            setTimeout(() => {
                const contentSlide = document.querySelector('.content-slide');
                contentSlide.classList.add('active');
            }, 100);
            
            // Atualizar indicadores
            updateIndicators();
            
            // Atualizar cartões de imagem
            updateImageCards();
        }

        function updateIndicators() {
            if (displayedSlides.length === 0) return;
            const indicators = document.querySelectorAll('.indicator');
            indicators.forEach((indicator, index) => {
                indicator.classList.remove('active', 'bg-opacity-100');
                indicator.classList.add('bg-opacity-40');
                
                if (index === currentSlide) {
                    indicator.classList.add('active');
                    indicator.classList.remove('bg-opacity-40');
                    indicator.classList.add('bg-opacity-100');
                }
            });
        }

        function updateImageCards() {
            if (displayedSlides.length === 0) return;
            const cards = document.querySelectorAll('.image-card');
            const container = document.getElementById('image-carousel');
            
            cards.forEach((card, index) => {
                card.classList.remove('active', 'inactive');
                
                if (index === currentSlide) {
                    card.classList.add('active');
                    // Scroll suave para centralizar o cartão ativo
                    setTimeout(() => {
                        const containerRect = container.getBoundingClientRect();
                        const cardRect = card.getBoundingClientRect();
                        const scrollLeft = card.offsetLeft - (containerRect.width / 2) + (cardRect.width / 2);
                        container.scrollTo({
                            left: scrollLeft,
                            behavior: 'smooth'
                        });
                    }, 100);
                } else {
                    card.classList.add('inactive');
                }
            });
        }

        function goToSlide(index) {
            currentSlide = index;
            updateSlide();
            restartAutoSlide();
        }

        function nextSlide() {
            if (displayedSlides.length === 0) return;
            currentSlide = (currentSlide + 1) % displayedSlides.length;
            updateSlide();
        }

        function prevSlide() {
            if (displayedSlides.length === 0) return;
            currentSlide = (currentSlide - 1 + displayedSlides.length) % displayedSlides.length;
            updateSlide();
        }

        function startAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 4000);
        }

        function restartAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        function openModal(slide) {
            const overlay = document.getElementById('modal-overlay');
            document.getElementById('modal-category').textContent = slide.category;
            document.getElementById('modal-title').textContent = slide.officialTitle || slide.title;
            document.getElementById('modal-description').textContent = slide.description;

            const moreInfo = document.getElementById('modal-more');
            moreInfo.replaceChildren();

            (slide.details || [slide.description]).forEach((detail) => {
                const paragraph = document.createElement('p');
                paragraph.className = 'mb-4';
                paragraph.textContent = detail;
                moreInfo.appendChild(paragraph);
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
                    list.appendChild(item);
                });

                moreInfo.append(heading, list);
            }

            overlay.classList.add('active');
            clearInterval(autoSlideInterval);
            document.body.style.overflow = 'hidden';
            document.getElementById('modal-close').focus();
        }

        function closeModal() {
            const overlay = document.getElementById('modal-overlay');
            overlay.classList.remove('active');
            startAutoSlide(); // Retoma o slide show
            document.body.style.overflow = '';
        }

        function setSlideBackground(element, background) {
            element.innerHTML = '';
            element.style.backgroundImage = 'none';

            if (background.type === 'video') {
                const video = document.createElement('video');
                video.className = 'w-full h-full object-cover';
                video.autoplay = true;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;

                const source = document.createElement('source');
                source.src = background.src;
                source.type = 'video/mp4';

                video.appendChild(source);
                element.appendChild(video);
            } else {
                element.style.backgroundImage = `url('${background.src}')`;
            }
        }

        function performSearchLogic(searchTerm, rawQuery) {
            clearInterval(autoSlideInterval);

            // Qualquer busca desativa o filtro de finalistas
            if (isFinalistFilterActive) {
                isFinalistFilterActive = false;
                document.getElementById('finalists-btn').classList.remove('active-filter-btn');
            }

            if (searchTerm === '') {
                displayedSlides = [...originalSlides];
            } else {
                displayedSlides = originalSlides.filter(slide => 
                    slide.title.toLowerCase().includes(searchTerm) || 
                    slide.category.toLowerCase().includes(searchTerm)
                );
            }

            currentSlide = 0;

            if (displayedSlides.length === 0) {
                const contentContainer = document.getElementById('content-container');
                const emptyState = document.createElement('div');
                emptyState.className = 'content-slide active';

                const title = document.createElement('h1');
                title.className = 'slide-title font-serif font-bold text-white';
                title.textContent = 'Nenhum resultado';

                const message = document.createElement('p');
                message.className = 'slide-description text-white';
                message.textContent = `Não encontramos nada para "${rawQuery}". Tente uma nova busca.`;

                emptyState.append(title, message);
                contentContainer.replaceChildren(emptyState);
                document.getElementById('image-carousel').innerHTML = '';
                document.getElementById('indicators').innerHTML = '';
                bgA.style.backgroundImage = '';
                bgA.innerHTML = '';
                bgB.style.backgroundImage = '';
                bgB.innerHTML = '';
                return;
            }

            renderIndicators();
            renderImageCards();
            updateSlide();
            startAutoSlide();
        }

        // Controle por teclado será adicionado junto com o modal de contato

        // Inicializar slider
        initializeSlider();

        // Mobile Menu Modal Logic
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        const mobileMenuClose = document.getElementById('mobile-menu-close');
        const mobileMainMenu = document.getElementById('mobile-main-menu');
        const mobileContactMenu = document.getElementById('mobile-contact-menu');
        const mobileContactBtn = document.getElementById('mobile-contact-btn');
        const mobileBackBtn = document.getElementById('mobile-back-btn');

        let isMenuOpen = false;

        const openIcon = `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>`;
        const closeIcon = `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;

        function openMobileMenu() {
            isMenuOpen = true;
            mobileMenuOverlay.classList.add('active');
            hamburgerBtn.innerHTML = closeIcon;
            clearInterval(autoSlideInterval);
            document.body.style.overflow = 'hidden';
            mobileMenuClose.focus();
        }

        function closeMobileMenu() {
            isMenuOpen = false;
            mobileMenuOverlay.classList.remove('active');
            hamburgerBtn.innerHTML = openIcon;
            // Reset to main menu view
            mobileMainMenu.classList.remove('hidden');
            mobileContactMenu.classList.add('hidden');
            startAutoSlide();
            document.body.style.overflow = '';
        }

        function showContactSubmenu() {
            mobileMainMenu.classList.add('hidden');
            mobileContactMenu.classList.remove('hidden');
        }

        function showMainMenu() {
            mobileContactMenu.classList.add('hidden');
            mobileMainMenu.classList.remove('hidden');
        }

        hamburgerBtn.addEventListener('click', () => {
            if (isMenuOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        mobileMenuClose.addEventListener('click', closeMobileMenu);

        mobileContactBtn.addEventListener('click', showContactSubmenu);

        mobileBackBtn.addEventListener('click', showMainMenu);

        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target.id === 'mobile-menu-overlay') {
                closeMobileMenu();
            }
        });

        // Mobile Search Overlay Logic
        const mobileSearchOpenBtn = document.getElementById('mobile-search-open-btn');
        const mobileSearchCloseBtn = document.getElementById('mobile-search-close-btn');
        const mobileSearchOverlay = document.getElementById('mobile-search-overlay');
        const mobileSearchInput = document.getElementById('mobile-search-input');
        const mobileSearchExecuteBtn = document.getElementById('mobile-search-execute-btn');

        let isMobileSearchOpen = false;

        mobileSearchOpenBtn.addEventListener('click', () => {
            isMobileSearchOpen = true;
            mobileSearchOverlay.classList.remove('hidden');
            mobileSearchInput.focus();
        });

        mobileSearchCloseBtn.addEventListener('click', () => {
            isMobileSearchOpen = false;
            mobileSearchOverlay.classList.add('hidden');
            mobileSearchInput.value = '';
        });

        mobileSearchInput.addEventListener('input', () => {
            if (mobileSearchInput.value.length > 0) {
                mobileSearchExecuteBtn.classList.remove('text-white/60');
                mobileSearchExecuteBtn.classList.add('text-white');
            } else {
                mobileSearchExecuteBtn.classList.remove('text-white');
                mobileSearchExecuteBtn.classList.add('text-white/60');
            }
        });

        const mobileSearch = () => {
            performSearchLogic(mobileSearchInput.value.toLowerCase().trim(), mobileSearchInput.value);
            isMobileSearchOpen = false;
            mobileSearchOverlay.classList.add('hidden');
        };

        mobileSearchExecuteBtn.addEventListener('click', mobileSearch);
        mobileSearchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                mobileSearch();
            }
        });

        // Contact Modal Logic
        const contactBtn = document.getElementById('contact-btn');
        const contactModalOverlay = document.getElementById('contact-modal-overlay');
        const contactModalClose = document.getElementById('contact-modal-close');

        function openContactModal() {
            contactModalOverlay.classList.add('active');
            clearInterval(autoSlideInterval);
            document.body.style.overflow = 'hidden';
            contactModalClose.focus();
        }

        function closeContactModal() {
            contactModalOverlay.classList.remove('active');
            startAutoSlide();
            document.body.style.overflow = '';
        }

        contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openContactModal();
        });

        contactModalClose.addEventListener('click', closeContactModal);

        contactModalOverlay.addEventListener('click', (e) => {
            if (e.target.id === 'contact-modal-overlay') {
                closeContactModal();
            }
        });

        // Update the existing keyboard event listener to include all modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                nextSlide();
                restartAutoSlide();
            } else if (e.key === 'ArrowLeft') {
                prevSlide();
                restartAutoSlide();
            } else if (e.key === 'Escape') {
                const overlay = document.getElementById('modal-overlay');
                const contactOverlay = document.getElementById('contact-modal-overlay');
                const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

                if (overlay.classList.contains('active')) {
                    closeModal();
                } else if (contactOverlay.classList.contains('active')) {
                    closeContactModal();
                } else if (mobileMenuOverlay.classList.contains('active')) {
                    // If in contact submenu, go back to main menu, otherwise close
                    if (!mobileContactMenu.classList.contains('hidden')) {
                        showMainMenu();
                    } else {
                        closeMobileMenu();
                    }
                }
            }
        });

        // Touch/Swipe gestures para carrossel mobile
        function initTouchEvents() {
            const carousel = document.getElementById('image-carousel');
            let startX = 0;
            let startY = 0;
            let distX = 0;
            let distY = 0;
            let startTime = 0;
            const threshold = 50; // Distância mínima para swipe
            const restraint = 100; // Máxima distância perpendicular
            const allowedTime = 300; // Tempo máximo para swipe

            function handleTouchStart(e) {
                const touchObj = e.changedTouches[0];
                startX = touchObj.pageX;
                startY = touchObj.pageY;
                startTime = new Date().getTime();
                clearInterval(autoSlideInterval); // Pausar slideshow durante touch
            }

            function handleTouchMove(e) {
                e.preventDefault(); // Prevenir scroll durante swipe
            }

            function handleTouchEnd(e) {
                const touchObj = e.changedTouches[0];
                distX = touchObj.pageX - startX;
                distY = touchObj.pageY - startY;
                const elapsedTime = new Date().getTime() - startTime;

                if (elapsedTime <= allowedTime) {
                    if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                        if (distX > 0) {
                            // Swipe direita - slide anterior
                            prevSlide();
                            restartAutoSlide();
                        } else {
                            // Swipe esquerda - próximo slide
                            nextSlide();
                            restartAutoSlide();
                        }
                    }
                }

                // Retomar slideshow após um tempo
                setTimeout(() => {
                    if (autoSlideInterval === undefined || autoSlideInterval === null) {
                        startAutoSlide();
                    }
                }, 1000);
            }

            if (carousel) {
                carousel.addEventListener('touchstart', handleTouchStart, { passive: false });
                carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
                carousel.addEventListener('touchend', handleTouchEnd, { passive: false });
            }
        }

        // Performance optimizations
        function optimizeForMobile() {
            // Detectar conexão lenta e ajustar qualidade
            if ('connection' in navigator) {
                const connection = navigator.connection;
                if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                    // Desabilitar vídeos de fundo em conexões lentas
                    document.querySelectorAll('.slide-bg video').forEach(video => {
                        video.style.display = 'none';
                    });

                    // Adicionar fallback de imagem
                    document.querySelectorAll('.slide-bg').forEach(bg => {
                        if (!bg.style.backgroundImage) {
                            bg.style.backgroundColor = '#1a1a1a';
                        }
                    });
                }
            }

            // Lazy loading para imagens não críticas
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                                imageObserver.unobserve(img);
                            }
                        }
                    });
                });

                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
        }

        // Inicializar melhorias mobile
        if (window.innerWidth <= 768) {
            initTouchEvents();
            optimizeForMobile();
        }

        // Reinicializar em mudanças de orientação
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (window.innerWidth <= 768) {
                    initTouchEvents();
                }
            }, 100);
        });

        function toggleFinalistFilter() {
            isFinalistFilterActive = !isFinalistFilterActive;
            const finalistsBtn = document.getElementById('finalists-btn');
            const searchInput = document.getElementById('search-input');
            const mobileSearchInput = document.getElementById('mobile-search-input');
            
            searchInput.value = '';
            mobileSearchInput.value = '';

            if (isFinalistFilterActive) {
                displayedSlides = originalSlides.filter(slide => slide.isFinalist);
                finalistsBtn.classList.add('active-filter-btn');
            } else {
                displayedSlides = [...originalSlides];
                finalistsBtn.classList.remove('active-filter-btn');
            }

            currentSlide = 0;

            if (displayedSlides.length === 0 && isFinalistFilterActive) {
                const contentContainer = document.getElementById('content-container');
                contentContainer.innerHTML = `
                    <div class="content-slide active">
                        <h1 class="slide-title font-serif font-bold text-white">Nenhum Finalista</h1>
                        <p class="slide-description text-white">Ainda não há finalistas marcados para o Prêmio J.Ex.</p>
                    </div>
                `;
                document.getElementById('image-carousel').innerHTML = '';
                document.getElementById('indicators').innerHTML = '';
                clearInterval(autoSlideInterval);
            } else {
                renderIndicators();
                renderImageCards();
                updateSlide();
                restartAutoSlide();
            }
        }
