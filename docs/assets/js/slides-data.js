const slides = [
    {
        title: "Modelo Correcional Orientado por Dados",
        officialTitle: "Modelo Correcional Orientado por Dados",
        category: "Atividade Correcional",
        description: "Integra dados, indicadores e painéis analíticos ao acompanhamento das unidades e ao planejamento das correições.",
        details: [
            "Incorpora dados, indicadores e painéis analíticos à atividade da Corregedoria-Geral para acompanhar a atuação das unidades e subsidiar decisões correcionais. As informações dos sistemas institucionais são organizadas e analisadas para identificar tendências, pontos de atenção e possíveis riscos.",
            "Os dados apoiam o acompanhamento permanente, o planejamento das correições e o monitoramento posterior de orientações, recomendações e planos de ação, sempre associados à análise qualitativa de cada situação."
        ],
        background: { type: "video", src: "assets/videos/modelo_correcional.mp4" },
        cardImages: ["assets/images/modelo_correcional.webp"]
    },
    {
        title: "Acompanhamento de Membros Ingressantes",
        officialTitle: "Programa de Acompanhamento dos Membros Ingressantes",
        category: "Atividade Correcional",
        description: "Acompanha membros em início de carreira com diálogo, orientação e apoio durante a adaptação às rotinas funcionais.",
        details: [
            "Estratégia de acompanhamento individualizado e contínuo dos membros em início de carreira, especialmente durante o período de adaptação e consolidação das rotinas funcionais. Cada ingressante conta com um corregedor de referência, que mantém um canal direto de diálogo para esclarecer dúvidas, oferecer orientações e identificar dificuldades.",
            "O acompanhamento ocorre por meio de contatos periódicos, reuniões, escuta individualizada e análise de informações funcionais, permitindo que necessidades de orientação ou apoio sejam percebidas desde o início."
        ],
        background: { type: "video", src: "assets/videos/programa_de_acompanhamento.mp4" },
        cardImages: ["assets/images/programa_de_acompanhamento.webp"]
    },
    {
        title: "DataSocial",
        officialTitle: "DataSocial — Estratégia de Dados para Políticas Públicas",
        category: "Políticas Públicas",
        description: "Territorializa indicadores sociais para revelar desigualdades, lacunas de atendimento e prioridades das políticas públicas no Acre.",
        details: [
            "Iniciativa que reúne, organiza e territorializa dados de diferentes fontes para ampliar o conhecimento sobre a realidade social e a execução de políticas públicas no Acre. A partir de temas prioritários, são selecionados indicadores sobre demandas, cobertura de serviços, vulnerabilidades e resultados das políticas, posteriormente apresentados em painéis de monitoramento.",
            "A ferramenta permite visualizar diferenças entre municípios e regiões, identificar desigualdades, déficits de atendimento e áreas que demandam maior atenção, oferecendo subsídios ao planejamento e à atuação do Ministério Público."
        ],
        background: { type: "video", src: "assets/videos/data_social.mp4" },
        cardImages: ["assets/images/data_social.webp"]
    },
    {
        title: "Painel de Plantões",
        officialTitle: "Painel de Plantões dos Membros do Primeiro e Segundo Graus",
        category: "Atividade Correcional",
        description: "Organiza escalas de plantão dos membros e acompanha saldos de folgas compensatórias em um único ambiente.",
        details: [
            "Solução digital que reúne, em um único ambiente, a gestão das escalas de plantão dos membros do primeiro e do segundo graus. A ferramenta permite registrar, organizar, consultar e acompanhar as escalas e os respectivos períodos, além de calcular e acompanhar os saldos de folgas compensatórias.",
            "Também possibilita a emissão automatizada de certidões, reduzindo controles paralelos e procedimentos manuais relacionados à gestão dos plantões."
        ],
        background: { type: "video", src: "assets/videos/painel_de_plantoes.mp4" },
        cardImages: ["assets/images/painel_de_plantoes.webp"]
    },
    {
        title: "Radar Web de Políticas Públicas",
        officialTitle: "Radar Web de Políticas Públicas — Monitoramento de Fontes Digitais",
        category: "Políticas Públicas",
        description: "Monitora fontes digitais abertas para identificar demandas emergentes, reclamações recorrentes e riscos em serviços públicos.",
        details: [
            "Ferramenta de monitoramento de fontes digitais abertas, como redes sociais e outros ambientes públicos da internet, voltada à identificação de demandas sociais emergentes, reclamações recorrentes, riscos e indícios de falhas em serviços públicos.",
            "A partir de temas previamente definidos, as informações são coletadas e analisadas para identificar recorrências, tendências e concentrações territoriais ou temáticas. Os resultados funcionam como sinais de atenção, que devem ser contextualizados e, quando necessário, confrontados com dados oficiais antes de subsidiarem a atuação do Ministério Público."
        ],
        background: { type: "video", src: "assets/videos/radar_web.mp4" },
        cardImages: ["assets/images/radar_web.webp"]
    },
    {
        title: "Estratégia MPAC Dimensiona",
        officialTitle: "Estratégia MPAC Dimensiona",
        category: "Gestão de Pessoas",
        description: "Dimensiona e distribui a força de trabalho conforme as necessidades, demandas e capacidades das unidades do MPAC.",
        details: [
            "Iniciativa voltada ao dimensionamento e à distribuição da força de trabalho com base nas necessidades das diferentes unidades do MPAC. A metodologia relaciona informações sobre pessoal disponível com indicadores de demanda, volume e complexidade das atividades e capacidade operacional.",
            "A análise permite identificar sobrecargas, déficits, capacidades disponíveis e necessidades de recomposição ou redistribuição, oferecendo dados objetivos para subsidiar decisões sobre alocação de pessoal. O dimensionamento pode ser revisto periodicamente diante de mudanças nas demandas, atribuições, estrutura ou disponibilidade da força de trabalho."
        ],
        background: { type: "video", src: "assets/videos/estrategia_MPAC.mp4" },
        cardImages: ["assets/images/estrategia_MPAC.webp"]
    },
    {
        title: "Ouvidoria Cidadã",
        officialTitle: "Ouvidoria Cidadã",
        category: "Acesso Digital",
        description: "Aplicativo que facilita o envio de manifestações e aproxima a população dos serviços da Ouvidoria do MPAC.",
        details: [
            "Aplicativo criado para facilitar o acesso da população aos serviços da Ouvidoria do MPAC. A ferramenta simplifica o envio de manifestações e abre novos caminhos para a participação, o diálogo e a aproximação entre o Ministério Público e a sociedade."
        ],
        background: { type: "video", src: "assets/videos/ouvidoria_cidada.mp4" },
        cardImages: ["assets/images/ouvidoria_cidada.webp"]
    },
    {
        title: "VerificaAí",
        officialTitle: "VerificaAí",
        category: "Acesso Digital",
        description: "Combina inteligência artificial e análise humana para verificar conteúdos eleitorais e enfrentar a desinformação.",
        details: [
            "Ferramenta de verificação de conteúdos relacionados às eleições no Acre e à eleição presidencial. Criada pela Subprocuradoria-Geral de Inovação, combina inteligência artificial e análise humana para checar informações, contribuindo para o enfrentamento à desinformação e para o exercício do direito à informação.",
            "Mais do que verificar conteúdos, o VerificaAí cria um novo canal de confiança entre a instituição e a sociedade."
        ],
        steps: [
            "Pelo WhatsApp, o cidadão envia um texto, áudio, imagem ou link.",
            "A IA emite um parecer prévio automatizado, classificando o conteúdo como verdadeiro, falso, enganoso, inconclusivo ou fora do escopo.",
            "O parecer é validado por uma equipe de verificadores humanos, que podem fazer edições e melhorias.",
            "O cidadão recebe automaticamente uma conclusão clara e confiável em seu WhatsApp."
        ],
        background: { type: "video", src: "assets/videos/verificaai.mp4" },
        cardImages: ["assets/images/verificaai.webp"]
    }
];
