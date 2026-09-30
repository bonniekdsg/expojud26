const slides = [
            // Inovação na Gestão
            {
                title: "Observatório de Políticas Públicas",
                description: "Uma plataforma para monitoramento e análise de políticas públicas, promovendo transparência e controle social.",
                background: { type: 'video', src: 'https://cdn.midjourney.com/video/8ccdd0f8-9c47-4506-ad15-f76cc42b62ad/1.mp4' },
                cardImages: ["https://static.wixstatic.com/media/c96204_256019608c3c43eab84d0d8509e679b5~mv2.avif"],
                category: "Inovação na Gestão"
            },
            {
                title: "Ação Impacto",
                description: "Método inovador de seleção de projetos no MPAC, focado em maximizar o impacto social positivo das iniciativas.",
                background: { type: 'video', src: 'https://cdn.midjourney.com/video/a26c3bf4-32a6-4b42-915d-79228e48b569/1.mp4' },
                cardImages: ["https://static.wixstatic.com/media/c96204_9b5ba095a8a042c495783cdda61b78eb~mv2.png"],
                category: "Inovação na Gestão"
            },
            {
                title: "Investigador Cidadão",
                description: "Capacita cidadãos para atuarem como agentes de fiscalização, fortalecendo a cidadania ativa e a gestão pública.",
                background: { type: 'video', src: 'https://cdn.midjourney.com/video/aad060b2-509e-4fc3-9068-6618cf41e2ca/0.mp4' },
                cardImages: ["https://static.wixstatic.com/media/c96204_1d6cf800ed19458bad28680700340fdc~mv2.jpg"],
                category: "Inovação na Gestão"
            },
            {
                title: "COAT",
                description: "Metodologia inovadora que transforma dados públicos em ação efetiva contra irregularidades na administração pública.",
                background: { type: 'video', src: 'https://cdn.midjourney.com/video/13348e40-d1a0-425c-b11e-dcbe46a19e1f/1.mp4' },
                cardImages: ["https://static.wixstatic.com/media/c96204_9771cc7969a746818447896f75257344~mv2.png"],
                category: "Inovação na Gestão",
                isFinalist: true
            },
            {
                title: "COPI",
                description: "Sistema de inteligência que identifica irregularidades ambientais e fundiárias, fortalecendo investigações e a defesa do meio ambiente.",
                background: { type: 'video', src: 'https://cdn.midjourney.com/video/8420a155-318a-420a-8e70-ff990322832a/0.mp4' },
                cardImages: ["https://static.wixstatic.com/media/c96204_2070f3c7f0584c66ac1732742e2a6fae~mv2.png"],
                category: "Inovação na Gestão",
                isFinalist: true
            },
            // Inovação Social
            {
                title: "TEA - Eles não estão Sós",
                description: "Projeto de apoio e inclusão para pessoas com Transtorno do Espectro Autista e suas famílias.",
                background: { type: 'video', src: 'https://cdn.midjourney.com/video/7a87bc9c-62e6-436c-8384-e33299e04a9f/1.mp4' },
                cardImages: ["https://static.wixstatic.com/media/c96204_022312f519eb4489bd13562ab9a0a3e4~mv2.avif"],
                category: "Inovação Social"
            },
            {
                title: "Destine e Proteja",
                description: "Iniciativa que incentiva a destinação de parte do Imposto de Renda para fundos de proteção à criança e ao adolescente.",
                background: { type: 'video', src: 'https://cdn.midjourney.com/video/fae5a2dc-67d9-4aae-82f1-b7d218e96e07/1.mp4' },
                cardImages: ["https://static.wixstatic.com/media/c96204_4e11d950c4e44fbfaf428a1abe7518ef~mv2.png"],
                category: "Inovação Social"
            },
            {
                title: "Justiça de Gênero",
                description: "O direito à informação que salva vidas, combatendo a violência de gênero através da conscientização e do acesso à justiça.",
                background: { type: 'video', src: 'https://cdn.midjourney.com/video/8fcc4ae6-17f6-4d7e-b403-821ca1480b96/1.mp4' },
                cardImages: ["https://static.wixstatic.com/media/c96204_ca2a599490ae45cd831d83b683b55f2f~mv2.png"],
                category: "Inovação Social"
            },
            {
                title: "Merenda Escolar Regional",
                description: "Fornecimento de produtos regionais para merenda escolar, valorizando agricultores familiares e a nutrição dos alunos.",
                background: { type: 'video', src: 'https://cdn.midjourney.com/video/282d6d78-7e24-4b78-ba58-17a1f4636a26/1.mp4' },
                cardImages: ["https://static.wixstatic.com/media/c96204_24956ccb0af8476484e738b040b80615~mv2.avif"],
                category: "Inovação Social"
            },
            // Inovação Tecnológica
            {
                title: "SIGE",
                description: "Sistema Integrado de Gestão Estratégica que otimiza processos e a tomada de decisões no setor público.",
                background: { type: 'video', src: 'https://cdn.midjourney.com/video/3eef4f63-17d0-4ed5-9a19-4b923b3f6c14/0.mp4' },
                cardImages: ["https://static.wixstatic.com/media/c96204_f6fe012fbf7642f2b8d14aaac87453e2~mv2.avif"],
                category: "Inovação Tecnológica"
            },
            {
                title: "Radar de Enchentes do MPAC",
                description: "Ferramenta tecnológica de monitoramento e alerta precoce para áreas de risco de enchentes.",
                background: { type: 'video', src: 'https://cdn.midjourney.com/video/401ae41c-da6e-429f-bdf6-40ab37c30c92/1.mp4' },
                cardImages: ["https://static.wixstatic.com/media/c96204_9e34639d95c44f179ab5d084678976bf~mv2.avif"],
                category: "Inovação Tecnológica"
            },
            {
                title: "Feminicidômetro",
                description: "Sistema de coleta e análise de dados sobre feminicídios para subsidiar políticas de prevenção e combate.",
                background: { type: 'video', src: 'https://cdn.midjourney.com/video/ee428781-517f-453a-bbda-0784e7199b6c/1.mp4' },
                cardImages: ["https://static.wixstatic.com/media/c96204_e989c57377f04079bea24671e60c7bc4~mv2.jpg"],
                category: "Inovação Tecnológica"
            },
            {
                title: "ComparaAI",
                description: "Inteligência Artificial para análise comparativa de documentos e processos, agilizando o trabalho jurídico e administrativo.",
                background: { type: 'video', src: 'https://cdn.midjourney.com/video/44f0f7e3-f962-4517-a6e8-b147fe054d32/0.mp4' },
                cardImages: ["https://static.wixstatic.com/media/c96204_44e053de6b894422899c6fa181c0229e~mv2.avif"],
                category: "Inovação Tecnológica"
            },
            {
                title: "Retina",
                description: "Sistema de inteligência que centraliza e analisa informações sobre organizações criminosas, apoiando investigações.",
                background: { type: 'video', src: 'https://cdn.midjourney.com/video/8105f3cd-1ec5-4420-a7ac-62c067e8f252/1.mp4' },
                cardImages: ["https://static.wixstatic.com/media/c96204_1aec574684a6477d8c184527571948d0~mv2.png"],
                category: "Inovação Tecnológica",
                isFinalist: true
            },
            // Laboratório de Inovação
            {
                title: "SeringalLab",
                description: "Laboratório de inovação do MPAC, um espaço para experimentação e desenvolvimento de soluções criativas para a justiça.",
                background: { type: 'video', src: 'https://cdn.midjourney.com/video/c29365fc-32eb-4597-afac-7b2cbf93ec33/1.mp4' },
                cardImages: ["https://static.wixstatic.com/media/c96204_574c631197124f51a43e57f1dfc33960~mv2.avif"],
                category: "Laboratório de Inovação",
                isFinalist: true
            },
            // Ensino
            {
                title: "LEAAM",
                description: "Laboratório de Estágio em Apoio à Atividade Ministerial, unindo academia e prática para formar futuros profissionais do direito.",
                background: { type: 'video', src: 'https://cdn.midjourney.com/video/210d104e-b182-4e26-a61d-fedde556c091/0.mp4' },
                cardImages: ["https://static.wixstatic.com/media/c96204_cc7f9fe8c8564b709a41022b1c821be9~mv2.png"],
                category: "Ensino"
            },
            // Escolas judiciais
            {
                title: "Prêmio Melhor Estágio",
                description: "Iniciativa que reconhece e valoriza estagiários e supervisores que se destacam pela excelência e comprometimento no MPAC.",
                background: { type: 'video', src: 'https://cdn.midjourney.com/video/adab39e4-dbdf-49b0-92b1-64c3703f99b8/0.mp4' },
                cardImages: ["https://static.wixstatic.com/media/c96204_6ca016d87a37475f9dff85e7a1c5112f~mv2.png"],
                category: "Escolas judiciais",
                isFinalist: true
            }
        ];
