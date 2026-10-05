import {
  EducationalSummary,
  PastExam,
  MindMap,
  FormulaItem,
  ExerciseList,
  LearningPath,
  Essay
} from '../types';

export const INITIAL_SUMMARIES: EducationalSummary[] = [
  {
    id: 'sum-cinematica-1',
    userId: 'default',
    title: 'Cinemática Vetorial & Lançamento Oblíquo no Vácuo',
    category: 'materia',
    subject: 'Física',
    topic: 'Mecânica Clássica',
    courseId: 'course-fis-telegram',
    courseTitle: 'Física - Mecânica, Termologia e Ondulatória',
    content: `O movimento em duas dimensões decompõe-se em dois eixos ortogonais e independentes (Princípio de Galileu):\n- Eixo horizontal Ox: Movimento Retilíneo Uniforme (MRU), com aceleração nula (ax = 0).\n- Eixo vertical Oy: Movimento Retilíneo Uniformemente Variado (MRUV), sob aceleração da gravidade (ay = -g).`,
    keyConcepts: [
      'Independência dos movimentos simultâneos',
      'Alcance máximo horizontal ocorre para ângulo de lançamento de 45° em terreno nivelado',
      'Na altura máxima, a velocidade vertical é instantaneamente nula (vy = 0), restando apenas vx = v0·cos(θ)'
    ],
    definitions: [
      { term: 'Alcance Horizontal (A)', meaning: 'Distância horizontal percorrida até o projétil atingir o mesmo nível de lançamento: A = (v0² · sen(2θ)) / g' },
      { term: 'Altura Máxima (Hmax)', meaning: 'Elevação máxima atingida na trajetória parabólica: Hmax = (v0² · sen²(θ)) / (2g)' },
      { term: 'Tempo de Voo (T)', meaning: 'Tempo total de permanência no ar: T = (2 · v0 · sen(θ)) / g' }
    ],
    formulas: [
      'vx = v0 · cos(θ)',
      'vy(t) = v0 · sen(θ) - g · t',
      'y(t) = y0 + v0 · sen(θ) · t - (1/2) · g · t²',
      'A = (v0² · sen(2θ)) / g',
      'Hmax = (v0 · sen(θ))² / (2g)'
    ],
    solvedExamples: [
      {
        problem: 'Um projétil é lançado do solo com v0 = 50 m/s sob ângulo de 30° com a horizontal (g = 10 m/s²). Calcule a altura máxima e o alcance.',
        solution: '1. vy0 = 50 · sen(30°) = 25 m/s. vx = 50 · cos(30°) = 25√3 m/s.\n2. Hmax = (25)² / (2 · 10) = 625 / 20 = 31,25 metros.\n3. A = (50² · sen(60°)) / 10 = (2500 · √3/2) / 10 = 125√3 ≈ 216,5 metros.'
      }
    ],
    tags: ['Física', 'Cinemática', 'ITA', 'IME', 'Projéteis'],
    isFavorite: true,
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-09-15T10:00:00Z'
  },
  {
    id: 'sum-complexos-1',
    userId: 'default',
    title: 'Números Complexos: Forma Algébrica e Trigonométrica',
    category: 'formulas_regras',
    subject: 'Matemática',
    topic: 'Álgebra e Números Complexos',
    courseId: 'course-mat-telegram',
    courseTitle: 'Matemática do Zero ao Avançado (ITA / IME)',
    content: `Os números complexos expandem o conjunto dos reais para solucionar equações polinomiais sem raízes reais. Definidos na forma z = a + bi, onde i² = -1, e representados geometricamente no plano de Argand-Gauss.`,
    keyConcepts: [
      'Unidade imaginária: i = √(-1), potências cíclicas i^0=1, i^1=i, i^2=-1, i^3=-i, i^4=1',
      'Módulo: |z| = ρ = √(a² + b²)',
      'Argumento: θ = arctg(b/a), ajustado ao quadrante',
      'Fórmula de De Moivre para potenciação e radiciação'
    ],
    definitions: [
      { term: 'Conjugado', meaning: 'Dado z = a + bi, seu conjugado é z̄ = a - bi. Propriedade: z · z̄ = |z|²' },
      { term: 'Fórmula de Euler', meaning: 'e^(iθ) = cos(θ) + i·sen(θ)' }
    ],
    formulas: [
      'z = ρ · (cos θ + i · sen θ) = ρ · cis(θ)',
      'z^n = ρ^n · [cos(nθ) + i · sen(nθ)] (1ª Fórmula de De Moivre)',
      'wk = ⁿ√ρ · cis((θ + 2kπ)/n), k ∈ {0, 1, ..., n-1} (Radiciação)'
    ],
    solvedExamples: [
      {
        problem: 'Calcule (1 + i√3)⁶ usando a fórmula de De Moivre.',
        solution: '1. ρ = √(1² + (√3)²) = √4 = 2.\n2. cos θ = 1/2 e sen θ = √3/2 => θ = π/3.\n3. z = 2 · cis(π/3).\n4. z⁶ = 2⁶ · cis(6 · π/3) = 64 · cis(2π) = 64 · (1 + 0i) = 64.'
      }
    ],
    tags: ['Matemática', 'Complexos', 'De Moivre', 'ITA', 'IME'],
    isFavorite: true,
    createdAt: '2026-09-18T14:30:00Z',
    updatedAt: '2026-09-18T14:30:00Z'
  },
  {
    id: 'sum-crase-1',
    userId: 'default',
    title: 'Guia Definitivo da Crase: Casos Obrigatórios, Proibidos e Facultativos',
    category: 'revisao_rapida',
    subject: 'Português',
    topic: 'Sintaxe e Regência',
    content: `A crase é a contração da preposição "a" exigida pelo termo regente com o artigo feminino "a(s)" ou com o pronome demonstrativo "aquele(s)", "aquela(s)", "aquilo".`,
    keyConcepts: [
      'Método de substituição: troque a palavra feminina por uma masculina equivalente; se surgir "ao" ou "aos", haverá crase.',
      'Locuções femininas prepositivas, conjuntivas e adverbiais levam crase.',
      'Crase proibida antes de palavras masculinas, verbos no infinitivo e pronomes de tratamento (exceto senhora e senhorita).'
    ],
    definitions: [
      { term: 'Casos Facultativos', meaning: '1. Antes de nomes próprios femininos; 2. Antes de pronomes possessivos femininos no singular; 3. Após a preposição "até".' },
      { term: 'Topônimos (Cidades/Estados)', meaning: '"Vou a, volto da: crase há. Vou a, volto de: crase pra quê?" Ex.: Fui à Bahia (voltei da Bahia); Fui a Roma (voltei de Roma).' }
    ],
    formulas: [
      'Preposição "a" + Artigo "a" = à',
      'Preposição "a" + Artigo "as" = às',
      'Preposição "a" + aquele(s)/aquela(s)/aquilo = àquele(s)/àquela(s)/àquilo'
    ],
    tags: ['Português', 'Gramática', 'Crase', 'EsPCEx', 'AFA', 'ITA'],
    isFavorite: false,
    createdAt: '2026-09-20T11:00:00Z',
    updatedAt: '2026-09-20T11:00:00Z'
  }
];

export const INITIAL_PAST_EXAMS: PastExam[] = [
  {
    id: 'exam-ita-2024-1fase',
    institution: 'ITA',
    year: 2024,
    title: 'Vestibular ITA 2024 - 1ª Fase (Objetiva)',
    phase: '1ª Fase',
    subjects: ['Matemática', 'Física', 'Química', 'Português', 'Inglês'],
    totalQuestions: 60,
    durationMinutes: 300,
    pdfQuestionUrl: 'https://www.vestibular.ita.br/provas/2024/prova_1fase.pdf',
    pdfAnswerUrl: 'https://www.vestibular.ita.br/provas/2024/gabarito_1fase.pdf',
    officialSourceUrl: 'https://www.vestibular.ita.br',
    isOfficial: true,
    solvedCount: 18,
    scorePercent: 78
  },
  {
    id: 'exam-ime-2024-1fase',
    institution: 'IME',
    year: 2024,
    title: 'Concurso de Admissão IME 2024 - 1ª Fase (Exatas)',
    phase: '1ª Fase',
    subjects: ['Matemática', 'Física', 'Química'],
    totalQuestions: 40,
    durationMinutes: 240,
    pdfQuestionUrl: 'https://www.ime.eb.br/vestibular/provas_anteriores/2024/1fase.pdf',
    pdfAnswerUrl: 'https://www.ime.eb.br/vestibular/provas_anteriores/2024/gabarito.pdf',
    officialSourceUrl: 'https://www.ime.eb.br',
    isOfficial: true,
    solvedCount: 12,
    scorePercent: 72
  },
  {
    id: 'exam-espcex-2023',
    institution: 'EsPCEx',
    year: 2023,
    title: 'Exame Intelectual EsPCEx 2023 - 1º e 2º Dias',
    phase: 'Prova Única',
    subjects: ['Português', 'Redação', 'Física', 'Química', 'Matemática', 'História', 'Geografia', 'Inglês'],
    totalQuestions: 100,
    durationMinutes: 540,
    pdfQuestionUrl: 'https://www.espcex.eb.br/concurso/provas2023.pdf',
    pdfAnswerUrl: 'https://www.espcex.eb.br/concurso/gabarito2023.pdf',
    officialSourceUrl: 'https://www.espcex.eb.br',
    isOfficial: true,
    solvedCount: 45,
    scorePercent: 84
  },
  {
    id: 'exam-afa-2024',
    institution: 'AFA',
    year: 2024,
    title: 'Exame de Admissão AFA 2024 - Caderno AFA-CFOAV/CFOINT',
    phase: '1ª Etapa',
    subjects: ['Física', 'Matemática', 'Língua Portuguesa', 'Língua Inglesa', 'Redação'],
    totalQuestions: 64,
    durationMinutes: 315,
    pdfQuestionUrl: 'https://ingresso.afaepcar.aer.mil.br/afa2024/provas.pdf',
    pdfAnswerUrl: 'https://ingresso.afaepcar.aer.mil.br/afa2024/gabarito.pdf',
    officialSourceUrl: 'https://ingresso.afaepcar.aer.mil.br',
    isOfficial: true,
    solvedCount: 22,
    scorePercent: 81
  },
  {
    id: 'exam-efomm-2024',
    institution: 'EFOMM',
    year: 2024,
    title: 'Processo Seletivo EFOMM 2024 - Prova Escrita',
    phase: 'Prova Única',
    subjects: ['Português', 'Inglês', 'Física', 'Matemática', 'Redação'],
    totalQuestions: 80,
    durationMinutes: 480,
    pdfQuestionUrl: 'https://www.marinha.mil.br/ciaga/efomm/provas2024.pdf',
    pdfAnswerUrl: 'https://www.marinha.mil.br/ciaga/efomm/gabarito2024.pdf',
    officialSourceUrl: 'https://www.marinha.mil.br',
    isOfficial: true,
    solvedCount: 30,
    scorePercent: 86
  }
];

export const INITIAL_MIND_MAPS: MindMap[] = [
  {
    id: 'map-termo-1',
    userId: 'default',
    title: 'Termodinâmica & 1ª e 2ª Leis',
    subject: 'Física',
    courseId: 'course-fis-telegram',
    courseTitle: 'Física - Mecânica e Termologia',
    tags: ['Física', 'Termologia', 'Gases Ideais', 'Ciclo de Carnot'],
    isFavorite: true,
    createdAt: '2026-09-19T10:00:00Z',
    updatedAt: '2026-09-19T10:00:00Z',
    rootNode: {
      id: 'root',
      label: 'Termodinâmica Clássica',
      description: 'Estudo do calor, trabalho e transformações gasosas',
      color: '#3B82F6',
      icon: 'Flame',
      children: [
        {
          id: 'gas-ideal',
          label: 'Gases Ideais',
          description: 'Equação de Clapeyron: P·V = n·R·T',
          color: '#06B6D4',
          children: [
            { id: 'isob', label: 'Isométrica / Isocórica', description: 'Volume constante (W = 0)' },
            { id: 'isot', label: 'Isotérmica', description: 'Temperatura constante (ΔU = 0)' },
            { id: 'isob2', label: 'Isobárica', description: 'Pressão constante (W = P·ΔV)' },
            { id: 'adiab', label: 'Adiabática', description: 'Sem troca de calor (Q = 0, ΔU = -W)' }
          ]
        },
        {
          id: 'primeira-lei',
          label: '1ª Lei da Termodinâmica',
          description: 'Conservação da Energia: ΔU = Q - W',
          color: '#10B981',
          children: [
            { id: 'q-sinal', label: 'Calor (Q)', description: 'Q > 0 absorve; Q < 0 libera' },
            { id: 'w-sinal', label: 'Trabalho (W)', description: 'W > 0 expansão; W < 0 compressão' },
            { id: 'u-mono', label: 'Energia Interna (U)', description: 'U = (3/2)·n·R·T (Gás monoatômico)' }
          ]
        },
        {
          id: 'segunda-lei',
          label: '2ª Lei & Ciclo de Carnot',
          description: 'Impossibilidade de rendimento de 100% de uma máquina térmica',
          color: '#F59E0B',
          children: [
            { id: 'rendimento', label: 'Rendimento Geral', description: 'η = 1 - |Qf|/|Qq|' },
            { id: 'carnot', label: 'Máquina de Carnot', description: 'ηmax = 1 - Tf/Tq (Temperaturas em Kelvin)' },
            { id: 'entropia', label: 'Entropia (S)', description: 'ΔS_universo ≥ 0 em processos espontâneos' }
          ]
        }
      ]
    }
  },
  {
    id: 'map-sintaxe-1',
    userId: 'default',
    title: 'Termos Essenciais e Integrantes da Oração',
    subject: 'Português',
    courseId: 'course-mat-telegram',
    tags: ['Português', 'Sintaxe', 'Sujeito', 'Predicado'],
    isFavorite: false,
    createdAt: '2026-09-22T10:00:00Z',
    updatedAt: '2026-09-22T10:00:00Z',
    rootNode: {
      id: 'root-sintaxe',
      label: 'Sintaxe do Período Simples',
      description: 'Estruturação dos elementos da oração',
      color: '#8B5CF6',
      icon: 'BookOpen',
      children: [
        {
          id: 'termos-essenciais',
          label: 'Termos Essenciais',
          description: 'Base da oração',
          color: '#EC4899',
          children: [
            { id: 'sujeito', label: 'Sujeito', description: 'Simples, Composto, Oculto, Indeterminado, Inexistente' },
            { id: 'predicado', label: 'Predicado', description: 'Verbal (VI/VTD/VTI), Nominal (VL + Predicativo), Verbo-Nominal' }
          ]
        },
        {
          id: 'termos-integrantes',
          label: 'Termos Integrantes',
          description: 'Completam o sentido de verbos e nomes',
          color: '#3B82F6',
          children: [
            { id: 'od', label: 'Objeto Direto', description: 'Sem preposição obrigatória' },
            { id: 'oi', label: 'Objeto Indireto', description: 'Com preposição obrigatória' },
            { id: 'cn', label: 'Complemento Nominal', description: 'Completa substantivo abstrato, adjetivo ou advérbio' },
            { id: 'ap', label: 'Agente da Passiva', description: 'Pratica a ação na voz passiva analítica' }
          ]
        }
      ]
    }
  }
];

export const INITIAL_FORMULAS: FormulaItem[] = [
  {
    id: 'form-bhaskara',
    title: 'Fórmula Quadrática (Bhaskara) e Relações de Girard',
    subject: 'Matemática',
    category: 'Matemática',
    topic: 'Polinômios e Equações',
    expression: 'x = (-b ± √(b² - 4ac)) / (2a)  |  Soma: S = -b/a  |  Produto: P = c/a',
    explanation: 'Resolve equações da forma ax² + bx + c = 0. O discriminante Δ = b² - 4ac indica: Δ > 0 (duas raízes reais distintas); Δ = 0 (raiz real dupla); Δ < 0 (duas raízes complexas conjugadas).',
    example: 'Para x² - 5x + 6 = 0: a=1, b=-5, c=6. S = 5, P = 6 => raízes 2 e 3.',
    tags: ['Álgebra', 'Polinômios', 'Básico', 'ITA', 'EsPCEx'],
    isFavorite: true
  },
  {
    id: 'form-trigo-soma',
    title: 'Adição e Subtração de Arcos Trigonométricos',
    subject: 'Matemática',
    category: 'Matemática',
    topic: 'Trigonometria',
    expression: 'sen(a ± b) = sen(a)cos(b) ± sen(b)cos(a)  |  cos(a ± b) = cos(a)cos(b) ∓ sen(a)sen(b)  |  tg(a ± b) = (tg a ± tg b)/(1 ∓ tg a·tg b)',
    explanation: 'Fórmulas essenciais de prostaférese e arco duplo. Lembrar que cos(2a) = cos²(a) - sen²(a) = 2cos²(a) - 1 = 1 - 2sen²(a).',
    example: 'cos(15°) = cos(45° - 30°) = cos(45°)cos(30°) + sen(45°)sen(30°) = (√6 + √2)/4.',
    tags: ['Trigonometria', 'Arcos', 'ITA', 'IME'],
    isFavorite: true
  },
  {
    id: 'form-torricelli',
    title: 'Equação de Torricelli',
    subject: 'Física',
    category: 'Física',
    topic: 'Cinemática',
    expression: 'v² = v0² + 2 · a · Δs',
    explanation: 'Relaciona velocidades inicial e final com a aceleração e o deslocamento escalar em MRUV, sem necessitar da variável de tempo.',
    example: 'Veículo a 20 m/s freia com a = -4 m/s² até parar (v = 0). 0 = 400 - 8·Δs => Δs = 50 metros.',
    tags: ['Física', 'Cinemática', 'MRUV', 'EsPCEx'],
    isFavorite: true
  },
  {
    id: 'form-clapeyron',
    title: 'Equação Geral dos Gases Ideais (Clapeyron)',
    subject: 'Física',
    category: 'Física',
    topic: 'Termologia',
    expression: 'P · V = n · R · T = (m / M) · R · T',
    explanation: 'Onde P é a pressão (Pa ou atm), V o volume (m³ ou L), n o número de mols, R a constante dos gases (8,314 J/(mol·K) ou 0,082 atm·L/(mol·K)) e T a temperatura absoluta em Kelvin.',
    example: '1 mol de gás ideal nas CNTP (P = 1 atm, T = 273,15 K) ocupa volume molar V ≈ 22,4 L.',
    tags: ['Física', 'Termologia', 'Química', 'Gases'],
    isFavorite: false
  },
  {
    id: 'form-ph',
    title: 'Potencial Hidrogeniônico (pH) e Produto Iônico da Água (Kw)',
    subject: 'Química',
    category: 'Química',
    topic: 'Equilíbrio Iônico',
    expression: 'pH = -log[H+]  |  pOH = -log[OH-]  |  pH + pOH = 14 (a 25 °C)',
    explanation: 'Mede o grau de acidez ou basicidade de uma solução aquosa. [H+]·[OH-] = Kw = 10^-14 a 25 °C.',
    example: 'Solução com [H+] = 10^-3 mol/L tem pH = 3 (ácida) e pOH = 11.',
    tags: ['Química', 'Equilíbrio', 'pH', 'ITA', 'IME'],
    isFavorite: true
  }
];

export const INITIAL_EXERCISE_LISTS: ExerciseList[] = [
  {
    id: 'list-ferretto-operacoes',
    userId: 'default',
    name: 'Lista Ferretto: Operações Básicas da Matemática (ENEM & Base)',
    description: '23 questões contextualizadas com expressões numéricas, cálculo de tempo, proporcionalidade, volume e troco.',
    subject: 'Matemática',
    topic: 'Operações Básicas & Aritmética',
    courseId: 'course-mat-telegram',
    questionIds: ['mat-bas-01', 'mat-bas-02'],
    isCompleted: false,
    solvedCount: 2,
    correctCount: 2,
    deadline: '2026-10-10',
    notes: 'Excelente para treino de agilidade mental sem calculadora.',
    createdAt: '2026-10-04T00:00:00Z',
    updatedAt: '2026-10-04T00:00:00Z'
  },
  {
    id: 'list-apostila-720-mat',
    userId: 'default',
    name: 'Apostila 720: Matemática Básica Completa (Listas 1 a 10)',
    description: 'Adição, subtração, produtos notáveis, potenciação, radiciação, decimais, MMC/MDC, sistemas lineares, escalas, proporção e porcentagem.',
    subject: 'Matemática',
    topic: 'Matemática Básica Nível 1 & 7º Ano',
    courseId: 'course-mat-telegram',
    questionIds: ['mat-bas-03', 'mat-bas-04', 'mat-bas-05', 'mat-bas-06'],
    isCompleted: false,
    solvedCount: 4,
    correctCount: 4,
    deadline: '2026-10-18',
    notes: 'Material base do planejamento de 13 semanas com gabarito oficial completo.',
    createdAt: '2026-10-04T00:00:00Z',
    updatedAt: '2026-10-04T00:00:00Z'
  },
  {
    id: 'list-apostila-720-fis',
    userId: 'default',
    name: 'Apostila 720: Física Básica Essencial (Listas 1 a 13)',
    description: 'Vetores, velocidade média, movimento uniforme, MRUV, MCU, lançamentos verticais e horizontais, leis de Newton, sistemas de blocos, roldanas e atrito.',
    subject: 'Física',
    topic: 'Mecânica Clássica & Vetores',
    courseId: 'course-fis-telegram',
    questionIds: ['fis-bas-01', 'fis-bas-02', 'fis-bas-03'],
    isCompleted: false,
    solvedCount: 3,
    correctCount: 3,
    deadline: '2026-11-15',
    notes: 'Fundamento essencial para a transição para a Física do ITA em jan/2027.',
    createdAt: '2026-10-04T00:00:00Z',
    updatedAt: '2026-10-04T00:00:00Z'
  },
  {
    id: 'list-apostila-720-qui',
    userId: 'default',
    name: 'Apostila 720: Química Básica & Propriedades (Listas 1 a 10)',
    description: 'Densidade, estados físicos, ligações químicas, geometria molecular, química orgânica, polaridade, tabela periódica, estequiometria, misturas e Nox.',
    subject: 'Química',
    topic: 'Química Geral & Inorgânica',
    courseId: 'course-qui-telegram',
    questionIds: ['qui-bas-01', 'qui-bas-02'],
    isCompleted: false,
    solvedCount: 2,
    correctCount: 2,
    deadline: '2026-12-01',
    notes: 'Base química conceitual e estequiométrica com gabarito incluso.',
    createdAt: '2026-10-04T00:00:00Z',
    updatedAt: '2026-10-04T00:00:00Z'
  },
  {
    id: 'list-ita-dinamica',
    userId: 'default',
    name: 'Lista de Elite: Leis de Newton & Atrito em Sistemas Complexos',
    description: 'Seleção criteriosa de exercícios com polias móveis, blocos sobrepostos e plano inclinado com atrito.',
    subject: 'Física',
    topic: 'Dinâmica e Atrito',
    courseId: 'course-fis-telegram',
    questionIds: ['q1', 'q2'],
    isCompleted: false,
    solvedCount: 1,
    correctCount: 1,
    deadline: '2026-10-15',
    notes: 'Atenção aos diagramas de corpo livre em corpos vinculados.',
    createdAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-09-20T10:00:00Z'
  },
  {
    id: 'list-ita-polinomios',
    userId: 'default',
    name: 'Lista de Aprofundamento: Relações de Girard & Fatoração',
    description: 'Questões discursivas e de múltipla escolha focadas no padrão de exigência do ITA e IME.',
    subject: 'Matemática',
    topic: 'Polinômios',
    courseId: 'course-mat-telegram',
    questionIds: ['q3'],
    isCompleted: false,
    solvedCount: 0,
    correctCount: 0,
    deadline: '2026-10-20',
    notes: 'Revisar teorema do resto e divisão por (x - a).',
    createdAt: '2026-09-22T10:00:00Z',
    updatedAt: '2026-09-22T10:00:00Z'
  }
];

export const INITIAL_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-ita-ime',
    title: 'Trilha de Elite Militar: Engenharia (ITA / IME)',
    subtitle: 'Roteiro tático intensivo de exatas para aprovação nos vestibulares mais difíceis do Brasil',
    description: 'Do embasamento fundamental ao nível olímpico de resolução de provas. Integra aulas teóricas de Telegram, simulados cronometrados e resolução de provas anteriores.',
    category: 'ITA / IME',
    difficulty: 'Elite Militar',
    icon: 'Shield',
    bannerUrl: 'https://images.unsplash.com/photo-1517976487507-5b6533d44e7c?q=80&w=800&auto=format&fit=crop',
    progressPercent: 32,
    isEnrolled: true,
    milestones: [
      {
        id: 'm1-ita',
        title: 'Módulo Zero: Fundamentos de Matemática Elementar e Aritmética',
        description: 'Domínio de operações algébricas, frações, produtos notáveis e fatoração.',
        subject: 'Matemática',
        targetType: 'course',
        targetId: 'course-mat-telegram',
        durationHours: 20,
        isCompleted: true
      },
      {
        id: 'm2-ita',
        title: 'Mecânica Newtoniana & Cinemática Vetorial de Precisão',
        description: 'Lançamento oblíquo, leis de Newton, sistemas com aceleração e conservação do momento.',
        subject: 'Física',
        targetType: 'course',
        targetId: 'course-fis-telegram',
        durationHours: 35,
        isCompleted: true,
        prerequisites: ['m1-ita']
      },
      {
        id: 'm3-ita',
        title: 'Estrutura Atômica, Termoquímica e Soluções',
        description: 'Tabela periódica, ligações químicas e termoquímica com exercícios aprofundados.',
        subject: 'Química',
        targetType: 'course',
        targetId: 'course-qui-telegram',
        durationHours: 25,
        isCompleted: false,
        prerequisites: ['m2-ita']
      },
      {
        id: 'm4-ita',
        title: 'Simulado Diagnóstico 1ª Fase ITA',
        description: 'Simulado completo com tempo controlado de 5 horas e 60 questões.',
        subject: 'Simulados',
        targetType: 'quiz',
        targetId: 'quiz-ita-1',
        durationHours: 5,
        isCompleted: false,
        prerequisites: ['m3-ita']
      }
    ]
  },
  {
    id: 'path-espcex-aman',
    title: 'Trilha Carreira do Exército: EsPCEx & AMAN',
    subtitle: 'Preparação completa para oficiais combatentes do Exército Brasileiro',
    description: 'Equilíbrio perfeito entre Exatas (Física, Química, Matemática) e Humanas (História, Geografia, Português e Redação).',
    category: 'EsPCEx',
    difficulty: 'Avançado',
    icon: 'Award',
    bannerUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop',
    progressPercent: 45,
    isEnrolled: true,
    milestones: [
      {
        id: 'm1-espcex',
        title: 'Português Militar & Gramática Normativa',
        description: 'Morfologia, sintaxe, concordância e regência verbal e nominal.',
        subject: 'Português',
        targetType: 'summary',
        durationHours: 30,
        isCompleted: true
      },
      {
        id: 'm2-espcex',
        title: 'Redação Dissertativa Padrão EsPCEx',
        description: 'Estruturação de introdução, desenvolvimento em 2 parágrafos e proposta de conclusão.',
        subject: 'Redação',
        targetType: 'exercise_list',
        durationHours: 15,
        isCompleted: true
      },
      {
        id: 'm3-espcex',
        title: 'Física e Química Clássica EsPCEx',
        description: 'Cinemática, Dinâmica, Eletrodinâmica, Estequiometria e Termoquímica.',
        subject: 'Física',
        targetType: 'course',
        durationHours: 40,
        isCompleted: false
      }
    ]
  },
  {
    id: 'path-afa-efomm',
    title: 'Trilha Asas & Mares: AFA, EFOMM & Colégio Naval',
    subtitle: 'Foco intensivo em Matemática de alto nível, Física Teórica e Inglês Técnico',
    description: 'Orientada aos concursos da Força Aérea Brasileira e Marinha Mercante.',
    category: 'AFA / EFOMM',
    difficulty: 'Avançado',
    icon: 'Target',
    bannerUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop',
    progressPercent: 20,
    isEnrolled: false,
    milestones: [
      {
        id: 'm1-afa',
        title: 'Trigonometria e Geometria Plana/Espacial',
        description: 'Lei dos senos, cossenos, relações métricas no triângulo e poliedros.',
        subject: 'Matemática',
        targetType: 'course',
        durationHours: 25,
        isCompleted: false
      },
      {
        id: 'm2-afa',
        title: 'Ondulatória e Óptica Geométrica',
        description: 'Interferência, difração, espelhos esféricos e lentes delgadas.',
        subject: 'Física',
        targetType: 'course',
        durationHours: 20,
        isCompleted: false
      }
    ]
  }
];

export const INITIAL_ESSAYS: Essay[] = [
  {
    id: 'essay-1',
    userId: 'default',
    title: 'A soberania tecnológica e a defesa aeroespacial brasileira no século XXI',
    theme: 'O papel da ciência e tecnologia nacional na garantia da segurança territorial',
    subjectOrExam: 'ITA',
    content: `No cenário geopolítico contemporâneo, a soberania de uma nação já não se mede exclusivamente pela extensão de suas fronteiras territoriais ou pelo contingente de suas tropas convencionais, mas primordialmente pelo seu domínio tecnológico e científico. No caso do Brasil, país de dimensões continentais e detentor de recursos estratégicos inestimáveis, o desenvolvimento de uma indústria aeroespacial autônoma e de sistemas de defesa cibernética desponta como condição sine qua non para a preservação de sua autodeterminação.\n\nEm primeiro lugar, cabe pontuar que a dependência tecnológica em áreas críticas vulnerabiliza o Estado diante de embargos e instabilidades externas. O Programa Espacial Brasileiro e os projetos estratégicos da Força Aérea, a exemplo do caça Gripen e do cargueiro KC-390, comprovam que o investimento continuado em instituições de excelência como o ITA gera transbordamento de conhecimento para a indústria civil, fomentando o produto interno bruto e a geração de empregos de alto valor agregado.\n\nAdemais, a proteção da Amazônia Legal e da "Amazônia Azul" exige tecnologias de sensoriamento remoto via satélite e vigilância radar que não podem depender de provedores estrangeiros. Historicamente, nações que negligenciaram o desenvolvimento de seus próprios vetores de comunicação e defesa viram-se cerceadas em momentos cruciais de negociação internacional.\n\nInfere-se, portanto, que a soberania nacional demanda uma política de Estado perene que alie universidades de ponta, Forças Armadas e setor produtivo privado. Somente pela consolidação do polo aeroespacial e da pesquisa de base o Brasil poderá garantir a intangibilidade de seu patrimônio e atuar como protagonista na ordem multipolar global.`,
    wordCount: 248,
    lineCount: 28,
    status: 'corrected',
    aiFeedback: {
      overallScore: 9.2,
      maxScore: 10.0,
      summary: 'Excelente articulação temática com vocabulário formal maduro, tese clara e repertório legitimado aplicado à realidade da defesa nacional.',
      strengths: [
        'Tese evidente logo no primeiro parágrafo ligando tecnologia e soberania.',
        'Menção precisa a projetos estratégicos reais (KC-390, Gripen, Amazônia Azul).',
        'Domínio exemplar da norma culta e conectivos interparágrafos ("Em primeiro lugar", "Ademais", "Infere-se, portanto").'
      ],
      weaknesses: [
        'Poderia aprofundar uma contraposição dialética sobre os custos orçamentários de tais investimentos antes da conclusão.'
      ],
      suggestions: [
        'Incluir dados empíricos de investimento percentual do PIB em P&D para robustecer ainda mais a argumentação.'
      ],
      competencies: [
        { name: 'Adequação ao Tema e Tipologia Textual', description: 'Compreensão do tema e tipologia dissertativa-argumentativa', maxScore: 2.0, score: 2.0, feedback: 'Compreensão total da proposta temática com posicionamento crítico.' },
        { name: 'Coesão e Coerência', description: 'Estrutura lógica, progressão textual e uso de operadores argumentativos', maxScore: 2.0, score: 1.9, feedback: 'Excelente encadeamento de ideias sem quebras de progressão.' },
        { name: 'Norma Culta e Gramática', description: 'Correção ortográfica, regência, concordância e pontuação', maxScore: 2.0, score: 1.9, feedback: 'Vocabulário preciso sem desvios gramaticais graves.' },
        { name: 'Repertório e Argumentação', description: 'Fundamentação das ideias com dados e conhecimentos interdisciplinares', maxScore: 2.0, score: 1.8, feedback: 'Repertório histórico e geopolítico bem articulado.' },
        { name: 'Proposta de Conclusão / Síntese', description: 'Síntese das ideias e proposta de intervenção/fechamento coerente', maxScore: 2.0, score: 1.6, feedback: 'Conclusão consistente retomando a tese inicial.' }
      ]
    },
    createdAt: '2026-09-24T15:00:00Z',
    updatedAt: '2026-09-24T16:00:00Z'
  }
];
