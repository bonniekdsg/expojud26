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
                card.innerHTML = `<img src="${slide.cardImages[0]}" alt="${slide.title}" class="w-full h-full object-cover">`;
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
            contentContainer.innerHTML = `
                <div class="content-slide">
                    ${isFinalist ? '<div class="finalist-tag">⭐ Finalista Prêmio J.Ex</div>' : ''}
                    <p class="text-sm font-medium tracking-wider mb-3 uppercase" style="color: #ff4c4c;">${displayedSlides[currentSlide].category}</p>
                    <h1 class="slide-title font-serif font-bold text-white">${displayedSlides[currentSlide].title}</h1>
                    <p class="slide-description text-white">${displayedSlides[currentSlide].description}</p>
                    <button class="relative btn-dynamic group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-full text-sm lg:text-base">
                        <span class="absolute inset-0 bg-red-700 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span>
                        <span class="relative z-10">Explore Agora</span>
                    </button>
                </div>
            `;
            
            // Adicionar evento ao botão Explore Agora
            contentContainer.querySelector('button').addEventListener('click', () => {
                openModal(displayedSlides[currentSlide]);
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
  document.getElementById('modal-title').textContent = slide.title;
  document.getElementById('modal-description').textContent = slide.description;

  const moreInfoEl = document.getElementById('modal-more');
  const defaultMore = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

  if (slide.title === 'Observatório de Políticas Públicas') {
    moreInfoEl.innerHTML = `
      <p class="mb-3">O Observatório de Políticas Públicas (OPP) do Ministério Público do Estado do Acre (MPAC) representa uma inovação significativa no acompanhamento da gestão pública no estado. Criado em 2024, o OPP se destaca pela sua contribuição para a transparência e o controle social, monitorando a execução de políticas públicas de acordo com o Plano Plurianual (PPA), a Lei de Diretrizes Orçamentárias (LDO) e a Lei Orçamentária Anual (LOA).</p>
      <p class="mb-4"><strong>Setor responsável</strong>: Núcleo de Apoio Técnico (NAT)</p>
      <a href="https://nat.mpac.mp.br/observatorio-de-politicas-publicas/" target="_blank" rel="noopener" class="relative inline-flex items-center gap-2 btn-dynamic group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-full text-sm">
        <span class="absolute inset-0 bg-red-700 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span>
        <span class="relative z-10">Acessar OPP</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="relative z-10 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
      </a>
    `;
  } else if (slide.title === 'Ação Impacto' || slide.title === 'Ação IMPACTO') {
    moreInfoEl.innerHTML = `
      <p class="mb-3">A Ação Institucional <strong>IMPACTO</strong> é uma iniciativa do Ministério Público do Estado do Acre (MPAC) que incentiva membros e servidores a desenvolver projetos inovadores e resolutivos para enfrentar desafios sociais, ambientais e institucionais. Com critérios técnicos e alinhamento ao planejamento estratégico, adota um modelo diferenciado de seleção, apoiando financeiramente as propostas, acompanhando sua execução e reconhecendo os melhores resultados com o <strong>Selo IMPACTO</strong>.</p>
      <p class="mb-4"><strong>Setor responsável</strong>: Secretaria de Planejamento Institucional e Inovação</p>
      <a href="https://impacto.mpac.mp.br/" target="_blank" rel="noopener" class="relative inline-flex items-center gap-2 btn-dynamic group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-full text-sm">
        <span class="absolute inset-0 bg-red-700 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span>
        <span class="relative z-10">Acessar IMPACTO</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="relative z-10 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
      </a>
    `;
  } else if (slide.title === 'Investigador Cidadão') {
    moreInfoEl.innerHTML = `
      <p class="mb-3">O projeto, criado pelo Ministério Público do Estado do Acre (MPAC), ampliou a forma de combate ao crime organizado com a implantação do disque-denúncia via WhatsApp. A ferramenta permite que a população encaminhe, de forma anônima, segura e sigilosa, informações sobre organizações criminosas, auxiliando na identificação de lideranças, foragidos, esconderijos e crimes graves como homicídios, tortura, extorsão e lavagem de dinheiro.</p>
      <p class="mb-4"><strong>Setor responsável</strong>: Núcleo de Apoio Técnico (NAT)</p>
      <a href="https://bancodeprojetos.cnmp.mp.br/Detalhe?idProjeto=4502" target="_blank" rel="noopener" class="relative inline-flex items-center gap-2 btn-dynamic group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-full text-sm">
        <span class="absolute inset-0 bg-red-700 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span>
        <span class="relative z-10">Acessar Projeto</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="relative z-10 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    `;
 } else if (slide.title === 'TEA - Eles não estão Sós') {
  moreInfoEl.innerHTML = `
    <p class="mb-3">O Ministério Público do Estado do Acre (MPAC) desenvolveu o projeto para enfrentar a falta de dados e de políticas públicas estruturadas voltadas às pessoas com Transtorno do Espectro Autista (TEA). A iniciativa realizou um amplo diagnóstico por município, mapeando serviços e identificando realidades sociais, econômicas e familiares, o que permitiu orientar intervenções mais qualificadas.</p>
    <p class="mb-3">Com base nesse levantamento, o MPAC articulou 352 pactuações interinstitucionais, promoveu rodas de conversa, oficinas regionais e visitas técnicas, além de produzir materiais de conscientização e capacitação. Os resultados já incluem avanços concretos, como a implantação do CER II no Alto Acre e a criação de um centro de referência em terapias em Tarauacá, reafirmando o compromisso do MPAC com a inclusão, a dignidade e a efetivação de direitos.</p>
    <p class="mb-4"><strong>Setor responsável</strong>: Centro de Apoio Operacional de defesa da Saúde, Pessoas Idosa e Pessoa com Deficiência (CAOP SAUDE – DI)</p>
    <a href="https://bancodeprojetos.cnmp.mp.br/Detalhe?idProjeto=3910" target="_blank" rel="noopener" class="relative inline-flex items-center gap-2 btn-dynamic group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-full text-sm">
      <span class="absolute inset-0 bg-red-700 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span>
      <span class="relative z-10">Acessar Projeto</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="relative z-10 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </a>
  `;
     } else if (slide.title === 'Destine e Proteja') {
  moreInfoEl.innerHTML = `
    <p class="mb-3">O Ministério Público do Estado do Acre (MPAC) criou o projeto <strong>Destine e Proteja</strong> para incentivar a transformação do imposto de renda devido em investimento social. A iniciativa orienta e sensibiliza servidores, profissionais liberais, empresas e cidadãos sobre a possibilidade de destinar até 6% do imposto ao Fundo Estadual dos Direitos da Criança e do Adolescente (FIA/AC), fortalecendo a rede de proteção infantojuvenil.</p>
    <p class="mb-4">Com apoio do Conselho Estadual dos Direitos da Criança e do Adolescente (CEDCA) e de parceiros estratégicos, os recursos são redistribuídos aos municípios que possuem Conselhos e Fundos regularizados, garantindo o financiamento de projetos prioritários em áreas como combate à violência sexual, erradicação do trabalho infantil, proteção familiar e segurança alimentar.</p>
    <p class="mb-4"><strong>Setor responsável</strong>: Centro de Apoio Operacional de Defesa da Criança e do Adolescente, Educação e Execução de Medidas Socioeducativas</p>
    <a href="https://bancodeprojetos.cnmp.mp.br/Detalhe?idProjeto=4266" target="_blank" rel="noopener" class="relative inline-flex items-center gap-2 btn-dynamic group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-full text-sm">
      <span class="absolute inset-0 bg-red-700 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span>
      <span class="relative z-10">Acessar Projeto</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="relative z-10 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </a>
     `;
    } else if (slide.title === 'Justiça de Gênero') {
  moreInfoEl.innerHTML = `
    <p class="mb-3">O projeto <strong>"Justiça de Gênero - o direito à informação salva vidas"</strong> busca fortalecer a atuação interinstitucional para prevenir e enfrentar a violência de gênero, utilizando dados e evidências produzidos pelo Observatório de Violência de Gênero (OBSGênero). Seu objetivo central é qualificar políticas públicas, melhorar os serviços prestados e ampliar o acesso das mulheres ao sistema de proteção e justiça.</p>

    <p class="mb-3 font-semibold">De forma prática, o projeto:</p>
    <ul class="list-disc list-inside space-y-2 mb-4">
      <li>Ouve as vítimas de feminicídio tentado, sobreviventes, identificando falhas na rede de proteção e oferecendo subsídios para aprimorar as políticas públicas, bem como reinserir essas vítimas na rede de atendimento;</li>
      <li>Capacita profissionais da rede de atendimento, com foco em prevenção, acolhimento, proteção e responsabilização;</li>
      <li>Analisa e sistematiza dados sobre feminicídios tentados, para compreender perfis de vítimas, agressores e respostas institucionais;</li>
      <li>Fortalece a articulação entre órgãos da rede de proteção, padronizando fluxos e protocolos de atendimento;</li>
      <li>Dissemina informações qualificadas sobre violência de gênero, promovendo o debate público e o engajamento social.</li>
    </ul>

    <p class="mb-4"><strong>Setor responsável</strong>: Observatório de Violência de Gênero (OBSGênero)</p>
    <a href="https://mpacre-my.sharepoint.com/personal/oneta_mpac_mp_br/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Foneta%5Fmpac%5Fmp%5Fbr%2FDocuments%2FJusti%C3%A7a%20de%20G%C3%AAnero%20%2D%20o%20direito%20%C3%A0%20informa%C3%A7%C3%A3o%20salva%20vidas%21&ga=1" target="_blank" rel="noopener" class="relative inline-flex items-center gap-2 btn-dynamic group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-full text-sm">
        <span class="absolute inset-0 bg-red-700 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span>
        <span class="relative z-10">Saiba Mais</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="relative z-10 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
    </a>
  `;
} else if (slide.title === 'Merenda Escolar Regional') {
  moreInfoEl.innerHTML = `
    <p class="mb-3">Iniciativa do Ministério Público do Estado do Acre, em parceria com o CECANE/UFAC, secretarias públicas e organizações comunitárias, o projeto nasceu para garantir o cumprimento da lei que exige a aplicação de pelo menos 30% dos recursos do PNAE na compra de alimentos da agricultura familiar.</p>

    <p class="mb-3">A ação promoveu oficinas, visitas técnicas e escutas comunitárias, incentivando a participação de pequenos agricultores no fornecimento da merenda escolar, substituindo alimentos ultraprocessados por produtos frescos e regionais. O impacto foi duplo: melhoria da qualidade nutricional oferecida aos estudantes e fortalecimento da economia local, especialmente de comunidades indígenas, ribeirinhas, extrativistas e de assentamento.</p>

    <p class="mb-4">Com resultados já visíveis, o projeto se consolidou como uma experiência de justiça social e segurança alimentar, unindo inclusão produtiva, valorização cultural e desenvolvimento sustentável no Alto Juruá.</p>

    <p class="mb-4"><strong>Setor responsável</strong>: Promotoria de Justiça de Defesa da Criança e do Adolescente de Cruzeiro do Sul</p>
    <a href="https://bancodeprojetos.cnmp.mp.br/Detalhe?idProjeto=4222" target="_blank" rel="noopener" class="relative inline-flex items-center gap-2 btn-dynamic group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-full text-sm">
      <span class="absolute inset-0 bg-red-700 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span>
      <span class="relative z-10">Acessar Projeto</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="relative z-10 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </a>
  `;
} else if (slide.title === 'SIGE') {
  moreInfoEl.innerHTML = `
    <p class="mb-3">O <strong>Sistema Integrado de Gestão Estratégica (SIGE)</strong> é uma solução tecnológica desenvolvida pelo Ministério Público do Estado do Acre (MPAC) para registrar, monitorar e avaliar os resultados das unidades na execução dos principais instrumentos de gestão: Plano Plurianual (PPA), Plano Geral de Atuação (PGA) e Plano Operacional de Atuação (POA).</p>

    <p class="mb-3">Estruturado em três fases – registro, monitoramento e desempenho – o SIGE permite acompanhar o ciclo completo das ações planejadas. A plataforma possui uma interface simples e intuitiva, reduzindo a necessidade de suporte técnico e aumentando a agilidade na gestão.</p>

    <p class="mb-4"><strong>Setor responsável</strong>: Secretaria de Planejamento Institucional e Inovação</p>
    <a href="https://sige.mpac.mp.br/#/login" target="_blank" rel="noopener" class="relative inline-flex items-center gap-2 btn-dynamic group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-full text-sm">
      <span class="absolute inset-0 bg-red-700 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span>
      <span class="relative z-10">Acessar SIGE</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="relative z-10 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </a>
  `;  
} else if (slide.title === 'Radar de Enchentes do MPAC') {
  moreInfoEl.innerHTML = `
    <p class="mb-3">O <strong>Radar de Enchentes</strong> é uma plataforma web desenvolvida pelo Ministério Público do Estado do Acre (MPAC) para monitorar, em tempo real, os níveis dos rios acreanos durante o período de cheias. A ferramenta reúne informações sobre riscos de alagamentos, emite alertas à população e integra os dados do Grupo Especial de Prevenção e Resposta a Desastres (GPRD), permitindo acompanhar as ações ministeriais em situações de emergência.</p>

    <p class="mb-4">Com essa iniciativa, o Radar amplia a transparência, fortalece a capacidade institucional de resposta e reforça a proteção às comunidades atingidas, transformando informação em um recurso estratégico para salvar vidas.</p>

    <p class="mb-4"><strong>Setor responsável</strong>: Secretaria de Planejamento Institucional e Inovação</p>
    <a href="https://radardeenchentes.mpac.mp.br/" target="_blank" rel="noopener" class="relative inline-flex items-center gap-2 btn-dynamic group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-full text-sm">
      <span class="absolute inset-0 bg-red-700 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span>
      <span class="relative z-10">Acessar Radar</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="relative z-10 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </a>
  `; 
  } else if (slide.title === 'Feminicidômetro') {
  moreInfoEl.innerHTML = `
    <p class="mb-3">O <strong>Feminicidômetro</strong> é uma ferramenta de pesquisa e controle social que proporciona à população acesso a informações não sensíveis dos processos dos crimes de feminicídios no Acre. Seu objetivo é subsidiar melhorias no tempo da persecução e no sistema de justiça. A plataforma organiza as etapas em uma linha do tempo, desde a ocorrência do crime até a sentença final, permitindo que a sociedade acompanhe o tempo das denúncias, julgamentos, recursos e decisões, além de reunir estudos, publicações e informações sobre a atuação ministerial.</p>

    <p class="mb-4">Nos últimos oito anos, 83 mulheres foram vítimas de feminicídio no Acre — crimes que refletem a violência estrutural de gênero. Ao tornar visíveis os dados e monitorar a persecução penal, o Feminicidômetro fortalece a atuação institucional, sensibiliza a sociedade e subsidia e fomenta a construção de políticas públicas de prevenção e proteção das mulheres.</p>

    <p class="mb-4"><strong>Setor responsável</strong>: Observatório de Violência de Gênero (OBSGênero)</p>
    <a href="https://feminicidometro.mpac.mp.br" target="_blank" rel="noopener" class="relative inline-flex items-center gap-2 btn-dynamic group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-full text-sm">
      <span class="absolute inset-0 bg-red-700 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span>
      <span class="relative z-10">Acessar Plataforma</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="relative z-10 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </a>
  `;
   } else if (slide.title === 'ComparaAI') {
  moreInfoEl.innerHTML = `
    <p class="mb-3">A ferramenta <strong>ComparaAI</strong> é uma solução de ponta para comparação facial, desenvolvida com base no robusto framework DeepFace. Ela oferece diversos modelos de redes neurais pré-treinadas, garantindo análises precisas e eficientes.</p>

    <p class="mb-3">Com o ComparaAI, a comparação de rostos vai além da simples identificação, fornecendo resultados detalhados em porcentagem. A ferramenta também é capaz de estimar a idade, a etnia predominante e outras características, eliminando a subjetividade da análise humana.</p>

    <p class="mb-4">Ao fornecer dados objetivos e valores de certeza, o ComparaAI capacita os analistas, otimizando o processo de avaliação e garantindo maior confiabilidade nos resultados.</p>

    <p class="mb-4"><strong>Setor responsável</strong>: Núcleo de Apoio Técnico (NAT)</p>
    <a href="https://sigep.mpac.mp.br/" target="_blank" rel="noopener" class="relative inline-flex items-center gap-2 btn-dynamic group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-full text-sm">
      <span class="absolute inset-0 bg-red-700 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span>
      <span class="relative z-10">Acessar Sistema</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="relative z-10 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </a>
   `;
     } else if (slide.title === 'COPI') {
        moreInfoEl.innerHTML = `
            <p class="mb-3">O COPI, criado em 2022 pelo NAT/MPAC, identifica e comunica irregularidades ambientais e fundiárias a partir do cruzamento de dados do MapBiomas Alerta, CAR e SINAFLOR, aliados a análises geoespaciais.</p>
            <p class="mb-3">Os relatórios apontam áreas afetadas, possíveis responsáveis, danos e subsídios para responsabilização civil, criminal e administrativa. Com uso de monitoramento remoto, inteligência geoespacial e BI, o COPI fortalece investigações, fomenta ações judiciais e promove articulação interinstitucional, tornando-se uma ferramenta estratégica e preventiva na defesa do meio ambiente.</p>
            <p class="mb-4"><strong>Setor responsável</strong>: Núcleo de Apoio Técnico (NAT)</p>
            <a href="https://nat.mpac.mp.br/copi-comunicado-possiveis-irregularidades/" target="_blank" rel="noopener" class="relative inline-flex items-center gap-2 btn-dynamic group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-full text-sm">
                <span class="absolute inset-0 bg-red-700 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span>
                <span class="relative z-10">Acessar COPI</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="relative z-10 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </a>
        `;
    } else if (slide.title === 'SeringalLab') {
  moreInfoEl.innerHTML = `
    <p class="mb-3">O <strong>SeringalLab</strong> é o laboratório de inovação do Ministério Público do Estado do Acre (MPAC). Constitui-se como um espaço dinâmico de experimentação e cocriação, voltado ao desenvolvimento de ideias, métodos e tecnologias capazes de transformar a cultura organizacional e oferecer soluções concretas para os desafios do serviço público.</p>

    <p class="mb-4"><strong>Setor responsável</strong>: Secretaria de Planejamento Institucional e Inovação</p>
    <a href="https://seringallab.mpac.mp.br/#inicio" target="_blank" rel="noopener" class="relative inline-flex items-center gap-2 btn-dynamic group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-full text-sm">
      <span class="absolute inset-0 bg-red-700 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span>
      <span class="relative z-10">Acessar SeringalLab</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="relative z-10 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </a>

   `;
    } else if (slide.title === 'LEAAM') {
  moreInfoEl.innerHTML = `
    <p class="mb-3">O <strong>Laboratório de Estágio em Apoio à Atividade Ministerial (LEAAM)</strong> do MPAC acolhe discentes do curso de Direito para que executem as disciplinas de Estágio Supervisionado no âmbito do MP, com o consequente apoio às unidades da instituição com alto volume de trabalho em processos virtuais.</p>

    <p class="mb-3">Além de atividades como elaboração de peças, pesquisas jurídicas e participação em audiências, o LEAAM utiliza o sistema Episteme, desenvolvido pelo próprio MPAC, para gerenciar e registrar a atuação dos estagiários, controlando produções, relatórios e auxílios prestados.</p>

    <p class="mb-4">A iniciativa alia formação prática qualificada e inovação tecnológica para fortalecer a atuação ministerial.</p>

    <p class="mb-4"><strong>Setor responsável</strong>: Centro de Estudos e Aperfeiçoamento Funcional - CEAF</p>
    <a href="https://episteme.mpac.mp.br" target="_blank" rel="noopener" class="relative inline-flex items-center gap-2 btn-dynamic group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-full text-sm">
      <span class="absolute inset-0 bg-red-700 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span>
      <span class="relative z-10">Acessar Sistema Episteme</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="relative z-10 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </a>
  
   `;

  } else if (slide.title === 'COAT') {
    moreInfoEl.innerHTML = `
      <p class="mb-3">O COAT é uma metodologia inovadora do MPAC, criada em 2022 pelo LAB-LD/NAT, que transforma dados públicos em ação efetiva contra irregularidades na administração.</p>
      <p class="mb-3">Por meio do monitoramento de Portais de Transparência e cruzamento de informações em fontes abertas, são elaborados relatórios técnicos que identificam indícios de ilícitos, apontam responsáveis, estimam danos e subsidiam investigações.</p>
      <p class="mb-3">Os comunicados são encaminhados ao Centro de Apoio do Patrimônio Público, que os distribui às Promotorias de Justiça, resultando em denúncias, TACs, recomendações e ações civis públicas.</p>
      <p class="mb-4">De 2022 a julho de 2025, os prejuízos identificados já somam mais de R$ 1,6 bilhão.</p>
      <p class="mb-4"><strong>Setor responsável</strong>: Laboratório de Tecnologia contra a Lavagem de Dinheiro (LAB-LD/NAT)</p>
      <a href="https://nat.mpac.mp.br/coat/" target="_blank" rel="noopener" class="relative inline-flex items-center gap-2 btn-dynamic group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-full text-sm">
        <span class="absolute inset-0 bg-red-700 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span>
        <span class="relative z-10">Acessar COAT</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="relative z-10 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
      </a>
    `;
  } else if (slide.title === 'Retina') {
    moreInfoEl.innerHTML = `
      <p class="mb-3">O RETINA é um sistema de inteligência desenvolvido pelo Ministério Público do Estado do Acre (MPAC) para centralizar, organizar e analisar informações sobre organizações criminosas e seus integrantes. A plataforma integra registros formais — como inquéritos, denúncias e sentenças — permitindo consultas avançadas por filtros, análises de vínculos e a produção de relatórios estratégicos.</p>
      <p class="mb-3">O sistema já consolidou cooperação com 13 Ministérios Públicos e 9 órgãos de segurança, conta com mais de 10.600 indivíduos cadastrados e ultrapassa 14.000 acessos, tornando-se referência no apoio a investigações e formulação de políticas públicas.</p>
      <p class="mb-4">Com arquitetura flexível e potencial de expansão em âmbito nacional, o RETINA se afirma como uma inovação disruptiva no enfrentamento ao crime organizado.</p>
      <p class="mb-4"><strong>Setor responsável</strong>: Núcleo de Apoio Técnico (NAT)</p>
      <a href="https://retina.mpac.mp.br/login" target="_blank" rel="noopener" class="relative inline-flex items-center gap-2 btn-dynamic group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-full text-sm">
        <span class="absolute inset-0 bg-red-700 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span>
        <span class="relative z-10">Acessar RETINA</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="relative z-10 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
      </a>
    `;
  } else if (slide.title === 'Prêmio Melhor Estágio') {
    moreInfoEl.innerHTML = `
      <p class="mb-3">O Prêmio Melhor Estágio, instituído em 2024 pelo CEAF/MPAC, tem como propósito reconhecer e valorizar estagiários e supervisores que se destacam pela excelência, dedicação e comprometimento. A iniciativa fortalece o engajamento institucional e estimula a melhoria contínua por meio de um processo avaliativo estruturado, que inclui autoavaliações, avaliações mútuas e entrevistas.</p>
      <p class="mb-4">Os vencedores recebem certificados e portarias de elogio em cerimônia oficial, reforçando uma cultura de valorização, escuta qualificada e incentivo ao desenvolvimento profissional no âmbito do Ministério Público do Estado do Acre.</p>
      <p class="mb-4"><strong>Setor responsável</strong>: Centro de Estudos e Aperfeiçoamento Funcional – CEAF</p>
      <a href="https://ceaf.mpac.mp.br/premio-melhor-estagio-mpac/" target="_blank" rel="noopener" class="relative inline-flex items-center gap-2 btn-dynamic group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-full text-sm">
        <span class="absolute inset-0 bg-red-700 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span>
        <span class="relative z-10">Saiba Mais</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="relative z-10 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
      </a>
    `;
  } else {
    moreInfoEl.textContent = defaultMore;
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
                contentContainer.innerHTML = `
                    <div class="content-slide active">
                        <h1 class="slide-title font-serif font-bold text-white">Nenhum resultado</h1>
                        <p class="slide-description text-white">Não encontramos nada para "${rawQuery}". Tente uma nova busca.</p>
                    </div>
                `;
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
