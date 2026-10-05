export interface DailyBlock {
  id: string;
  timeRange: string;
  subjectCode: string; // e.g. "Matemática", "@F", "@Q", "@FQ", "Inglês", "Português", "Redação", "Simulado", "Correção", "Erros", "Caderno de erros", "Planejamento"
  defaultSubject: string;
  description: string;
  notes?: string;
  estimatedMinutes: number;
}

export interface DaySchedule {
  dayIndex: number; // 0 = Dom, 1 = Seg, 2 = Ter, 3 = Qua, 4 = Qui, 5 = Sex, 6 = Sáb
  name: string;
  shortName: string;
  blocks: DailyBlock[];
}

export interface StudyWeekDay {
  dayName: string;
  dateStr?: string;
  subject: string;
  topics: string[];
  goal: string;
}

export interface StudyWeekPlan {
  weekNumber: number;
  period: string;
  phaseName: string;
  phaseNumber: number;
  title: string;
  days: StudyWeekDay[];
}

export interface MasteryTopic {
  id: string;
  category: 'basica_nivel1' | 'setimo_ano' | 'ciencias_natureza' | 'redacao_lingua';
  categoryLabel: string;
  title: string;
  description?: string;
  subtopics?: string[];
}

export interface YearPlanItem {
  period: string;
  focus: string;
  details: string;
  mathFocus: string;
  otherSubjectsFocus: string;
}

// 1. DIAS DA SEMANA - ROTA ITA 2031 (9h às 11h e 21h às 00h30)
export const ITA_WEEK_SCHEDULE: DaySchedule[] = [
  {
    dayIndex: 1,
    name: 'Segunda-feira',
    shortName: 'Seg',
    blocks: [
      {
        id: 'seg-1',
        timeRange: '9:00 – 11:00',
        subjectCode: 'Matemática',
        defaultSubject: 'Matemática (Manhã)',
        description: 'Aula nova: teoria, exemplos fundamentais e anotações ativas.',
        estimatedMinutes: 120
      },
      {
        id: 'seg-2',
        timeRange: '21:00 – 22:30',
        subjectCode: '@F',
        defaultSubject: 'Física / Matemática de Reforço',
        description: 'Aula nova + resumo de 1 página. (Até dez/2026: Matemática de reforço. Física entra em jan/2027).',
        estimatedMinutes: 90
      },
      {
        id: 'seg-3',
        timeRange: '22:40 – 23:40',
        subjectCode: 'Matemática',
        defaultSubject: 'Exercícios de Matemática',
        description: 'Resolução prática e fixação da lista da aula assistida pela manhã.',
        estimatedMinutes: 60
      },
      {
        id: 'seg-4',
        timeRange: '23:40 – 00:15',
        subjectCode: 'Inglês',
        defaultSubject: 'Inglês',
        description: 'Vocabulário técnico, flashcards + 1 texto curto com tradução.',
        estimatedMinutes: 35
      }
    ]
  },
  {
    dayIndex: 2,
    name: 'Terça-feira',
    shortName: 'Ter',
    blocks: [
      {
        id: 'ter-1',
        timeRange: '9:00 – 11:00',
        subjectCode: 'Matemática',
        defaultSubject: 'Matemática (Manhã)',
        description: 'Aula nova: teoria aprofundada, demonstrações e exemplos.',
        estimatedMinutes: 120
      },
      {
        id: 'ter-2',
        timeRange: '21:00 – 22:30',
        subjectCode: '@Q',
        defaultSubject: 'Química / Português',
        description: 'Aula nova + resumo de 1 página. (Até jun/2027: Português & Gramática. Química entra em jul/2027).',
        estimatedMinutes: 90
      },
      {
        id: 'ter-3',
        timeRange: '22:40 – 23:40',
        subjectCode: 'Matemática',
        defaultSubject: 'Exercícios de Matemática',
        description: 'Bateria de exercícios da aula da manhã, focando em velocidade e precisão.',
        estimatedMinutes: 60
      },
      {
        id: 'ter-4',
        timeRange: '23:40 – 00:15',
        subjectCode: 'Português',
        defaultSubject: 'Português & Gramática',
        description: 'Morfossintaxe, pontuação e interpretação de texto.',
        estimatedMinutes: 35
      }
    ]
  },
  {
    dayIndex: 3,
    name: 'Quarta-feira',
    shortName: 'Qua',
    blocks: [
      {
        id: 'qua-1',
        timeRange: '9:00 – 11:00',
        subjectCode: 'Matemática',
        defaultSubject: 'Matemática (Manhã)',
        description: 'Aula nova: continuidade do módulo semanal e aprofundamento.',
        estimatedMinutes: 120
      },
      {
        id: 'qua-2',
        timeRange: '21:00 – 22:30',
        subjectCode: '@F',
        defaultSubject: 'Física / Matemática de Reforço',
        description: 'Exercícios práticos da aula de segunda + resolução de dúvidas.',
        estimatedMinutes: 90
      },
      {
        id: 'qua-3',
        timeRange: '22:40 – 23:40',
        subjectCode: 'Matemática',
        defaultSubject: 'Exercícios de Matemática',
        description: 'Resolução de questões de fixação da aula da manhã.',
        estimatedMinutes: 60
      },
      {
        id: 'qua-4',
        timeRange: '23:40 – 00:15',
        subjectCode: 'Inglês',
        defaultSubject: 'Inglês',
        description: 'Vocabulário, leitura analítica e estrutura de sentenças.',
        estimatedMinutes: 35
      }
    ]
  },
  {
    dayIndex: 4,
    name: 'Quinta-feira',
    shortName: 'Qui',
    blocks: [
      {
        id: 'qui-1',
        timeRange: '9:00 – 11:00',
        subjectCode: 'Matemática',
        defaultSubject: 'Matemática (Manhã)',
        description: 'Aula nova: fechamento teórico e resolução guiada com professor.',
        estimatedMinutes: 120
      },
      {
        id: 'qui-2',
        timeRange: '21:00 – 22:30',
        subjectCode: '@Q',
        defaultSubject: 'Química / Ciências & História',
        description: 'Exercícios da aula de terça + consolidação de conceitos.',
        estimatedMinutes: 90
      },
      {
        id: 'qui-3',
        timeRange: '22:40 – 23:40',
        subjectCode: 'Matemática',
        defaultSubject: 'Exercícios de Matemática',
        description: 'Lista de exercícios e desafios da aula da manhã.',
        estimatedMinutes: 60
      },
      {
        id: 'qui-4',
        timeRange: '23:40 – 00:15',
        subjectCode: 'Redação',
        defaultSubject: 'Redação',
        description: 'Estrutura dissertativa-argumentativa, repertório sociocultural e escrita de 1 parágrafo.',
        estimatedMinutes: 35
      }
    ]
  },
  {
    dayIndex: 5,
    name: 'Sexta-feira',
    shortName: 'Sex',
    blocks: [
      {
        id: 'sex-1',
        timeRange: '9:00 – 11:00',
        subjectCode: 'Matemática',
        defaultSubject: 'Matemática (Fechamento)',
        description: 'Fechamento do tema da semana, mapas mentais e resumo síntese.',
        estimatedMinutes: 120
      },
      {
        id: 'sex-2',
        timeRange: '21:00 – 22:30',
        subjectCode: 'Matemática',
        defaultSubject: 'Revisão de Matemática',
        description: 'Lista geral de revisão da semana com questões cronometradas.',
        estimatedMinutes: 90
      },
      {
        id: 'sex-3',
        timeRange: '22:40 – 23:40',
        subjectCode: '@FQ',
        defaultSubject: 'Física ou Química (Alternada)',
        description: 'Exercícios de Física ou Química (alterna por semana conforme cronograma).',
        estimatedMinutes: 60
      },
      {
        id: 'sex-4',
        timeRange: '23:40 – 00:15',
        subjectCode: 'Português',
        defaultSubject: 'Português & Leitura',
        description: 'Leitura de livro paradidático ou clássicos da literatura brasileira.',
        estimatedMinutes: 35
      }
    ]
  },
  {
    dayIndex: 6,
    name: 'Sábado',
    shortName: 'Sáb',
    blocks: [
      {
        id: 'sab-1',
        timeRange: '9:00 – 11:00',
        subjectCode: 'Simulado',
        defaultSubject: 'Simulado Cronometrado',
        description: 'Prova com tempo estrito. Prova de Matemática (fase base) ou mista com Física/Química.',
        estimatedMinutes: 120
      },
      {
        id: 'sab-2',
        timeRange: '21:00 – 22:30',
        subjectCode: 'Correção',
        defaultSubject: 'Correção do Simulado',
        description: 'Corrigir questão por questão meticulosamente, identificando e anotando o motivo exato de cada erro.',
        estimatedMinutes: 90
      },
      {
        id: 'sab-3',
        timeRange: '22:40 – 23:40',
        subjectCode: 'Erros',
        defaultSubject: 'Caderno de Erros (Refazer)',
        description: 'Refazer do zero as questões erradas ou deixadas em branco, sem olhar o gabarito ou resolução.',
        estimatedMinutes: 60
      },
      {
        id: 'sab-4',
        timeRange: '23:40 – 00:15',
        subjectCode: 'Redação',
        defaultSubject: 'Redação Completa',
        description: 'Produção de 1 redação completa manuscrita com tema semanal + autoavaliação.',
        estimatedMinutes: 35
      }
    ]
  },
  {
    dayIndex: 0,
    name: 'Domingo',
    shortName: 'Dom',
    blocks: [
      {
        id: 'dom-1',
        timeRange: 'Manhã & Tarde',
        subjectCode: 'Folga',
        defaultSubject: 'Descanso Ativo & Família',
        description: 'Descanso mental, lazer e recuperação para preservar o rendimento semanal sustentável.',
        estimatedMinutes: 0
      },
      {
        id: 'dom-2',
        timeRange: '21:00 – 22:00',
        subjectCode: 'Caderno de erros',
        defaultSubject: 'Revisão do Caderno de Erros',
        description: 'Reler todos os erros da semana e categorizar os que se repetem (lacuna conceitual, desatenção, conta).',
        estimatedMinutes: 60
      },
      {
        id: 'dom-3',
        timeRange: '22:00 – 22:30',
        subjectCode: 'Planejamento',
        defaultSubject: 'Planejamento da Próxima Semana',
        description: 'Definir as aulas, metas de questões e materiais da semana seguinte na plataforma.',
        estimatedMinutes: 30
      }
    ]
  }
];

// 2. CRONOGRAMA 13 SEMANAS - 6º AO 7º ANO + MATEMÁTICA BÁSICA (PDF PLANO DE ESTUDOS)
export const ITA_13_WEEKS_PLAN: StudyWeekPlan[] = [
  {
    weekNumber: 1,
    period: '28/09 a 04/10',
    phaseNumber: 1,
    phaseName: 'Fase 1: Matemática Básica Nível 1',
    title: 'Multiplicação, Divisão e Classes Gramaticais',
    days: [
      {
        dayName: 'Seg 28/09',
        subject: 'Matemática Básica',
        topics: ['Multiplicação', 'Propriedades da multiplicação', 'Cálculos rápidos e truques mentais', 'Lista de exercícios de fixação'],
        goal: 'Dominar completamente a tabuada mental e multiplicação rápida sem hesitação.'
      },
      {
        dayName: 'Ter 29/09',
        subject: 'Matemática Básica',
        topics: ['Revisão rápida da multiplicação', 'Divisão exata e não exata', 'Relação inversa entre multiplicação e divisão', 'Exercícios'],
        goal: 'Dominar divisão por números de 1 e 2 dígitos com agilidade mental.'
      },
      {
        dayName: 'Qua 30/09',
        subject: 'Português',
        topics: ['Classes gramaticais fundamentais', 'Substantivo, adjetivo, artigo e verbo', 'Exercícios de identificação textual'],
        goal: 'Reconhecer morfossintaxe básica em textos dissertativos.'
      },
      {
        dayName: 'Qui 01/10',
        subject: 'Ciências & História',
        topics: ['Método científico: observação, hipótese, experimento e conclusão', 'O que é História, fontes históricas, tempo e cronologia'],
        goal: 'Compreender o raciocínio hipotético-dedutivo e linha do tempo histórica.'
      },
      {
        dayName: 'Sex 02/10',
        subject: 'Redação',
        topics: ['O que é uma redação padrão vestibular', 'Estrutura: Introdução, Desenvolvimento e Conclusão', 'Organização prévia das ideias'],
        goal: 'Estruturar o esqueleto de um texto dissertativo com clareza.'
      },
      {
        dayName: 'Sáb 03/10',
        subject: 'Simulado & Revisão',
        topics: ['Redação com tema livre', 'Revisar Português da semana', 'Revisão rápida de Matemática'],
        goal: 'Consolidar a primeira semana e registrar dúvidas.'
      },
      {
        dayName: 'Dom 04/10',
        subject: 'Descanso & Caderno de Erros',
        topics: ['Descanso durante o dia', '21h: Organização dos cadernos e planejamento semanal'],
        goal: 'Recarregar energia para a Semana 2.'
      }
    ]
  },
  {
    weekNumber: 2,
    period: '05/10 a 11/10',
    phaseNumber: 1,
    phaseName: 'Fase 1: Matemática Básica Nível 1',
    title: 'Potenciação, Radiciação e Estados Físicos',
    days: [
      {
        dayName: 'Seg 05/10',
        subject: 'Matemática Básica',
        topics: ['Potenciação: base, expoente e potência', 'Propriedades do produto e quociente de mesma base', 'Potência de potência e expoente nulo', 'Exercícios'],
        goal: 'Dominar as 5 propriedades fundamentais de potenciação.'
      },
      {
        dayName: 'Ter 06/10',
        subject: 'Matemática Básica',
        topics: ['Revisão de potenciação', 'Radiciação básica como operação inversa', 'Raízes quadradas e cúbicas perfeitas', 'Exercícios mistos'],
        goal: 'Calcular raízes exatas de cabeça e simplificar radicais simples.'
      },
      {
        dayName: 'Qua 07/10',
        subject: 'Português',
        topics: ['Pronomes (pessoais, possessivos, demonstrativos)', 'Numerais e advérbios de tempo e modo', 'Preposições essenciais e conjunções básicas', 'Exercícios'],
        goal: 'Entender a função coesiva de pronomes e conectivos.'
      },
      {
        dayName: 'Qui 08/10',
        subject: 'Ciências & História',
        topics: ['Ciências: Matéria, estados físicos (sólido, líquido, gasoso) e mudanças de estado', 'História: Povos antigos, agricultura, sedentarização e primeiros clãs'],
        goal: 'Dominar transformações de fase (fusão, ebulição, condensação, sublimação).'
      },
      {
        dayName: 'Sex 09/10',
        subject: 'Redação',
        topics: ['Como construir um bom parágrafo dissertativo', 'Tópico frasal + ampliação + fechamento', 'Frases conectadas e coesão textual'],
        goal: 'Redigir um parágrafo argumentativo sem truncamento.'
      },
      {
        dayName: 'Sáb 10/10',
        subject: 'Simulado & Revisão',
        topics: ['Redação com tema aleatório', 'Revisão da semana e correção de erros', '10 a 15 exercícios rápidos de potenciação e radiciação'],
        goal: 'Acertar pelo menos 85% dos exercícios da lista de fixação.'
      },
      {
        dayName: 'Dom 11/10',
        subject: 'Descanso & Caderno de Erros',
        topics: ['Descanso matinal', '21h: Análise do caderno de erros da semana'],
        goal: 'Identificar fraquezas na potenciação para revisar.'
      }
    ]
  },
  {
    weekNumber: 3,
    period: '12/10 a 18/10',
    phaseNumber: 1,
    phaseName: 'Fase 1: Matemática Básica Nível 1',
    title: 'Decimais, Primos, Fatoração e Grande Teste Nível 1',
    days: [
      {
        dayName: 'Seg 12/10',
        subject: 'Matemática Básica',
        topics: ['Números decimais e alinhamento de vírgula', 'Adição, subtração e multiplicação com decimais', 'Divisão com decimais e números negativos'],
        goal: 'Operar decimais com total segurança e zero erro de vírgula.'
      },
      {
        dayName: 'Ter 13/10',
        subject: 'Matemática Básica',
        topics: ['Múltiplos e divisores', 'Números primos e crivo de Eratóstenes', 'Decomposição em fatores primos', 'Critérios de divisibilidade por 2, 3, 5, 9 e 10'],
        goal: 'Fatorar rapidamente números compostos em primos.'
      },
      {
        dayName: 'Qua 14/10',
        subject: 'Português',
        topics: ['Verbos e tempos verbais (presente, pretéritos, futuro)', 'Concordância verbal básica', 'Pontuação: vírgula entre orações', 'Interpretação'],
        goal: 'Dominar flexão verbal sem desvios gramaticais.'
      },
      {
        dayName: 'Qui 15/10',
        subject: 'Ciências & História',
        topics: ['Ciências: Célula eucariótica vs procariótica, membrana e principais organelas', 'História: Antiguidade Oriental (Mesopotâmia e Egito) e Grécia arcaica'],
        goal: 'Conectar citologia básica com organização dos seres vivos.'
      },
      {
        dayName: 'Sex 16/10',
        subject: 'Redação',
        topics: ['Introdução completa com tese bem delimitada', 'Desenvolvimento com fundamentação', 'Coesão referencial e sequencial'],
        goal: 'Produzir introdução e 1º desenvolvimento em 40 minutos.'
      },
      {
        dayName: 'Sáb 17/10',
        subject: 'GRANDE TESTE NÍVEL 1',
        topics: ['TESTE GERAL DE MATEMÁTICA BÁSICA - NÍVEL 1: Todas as operações, frações, decimais, primos, potências e raízes', 'Correção minuciosa e separação dos erros'],
        goal: 'Obter aproveitamento superior a 80% para liberar o avanço ao 7º ano.'
      },
      {
        dayName: 'Dom 18/10',
        subject: 'Transição para Fase 2',
        topics: ['Descanso e celebração do fechamento da Matemática Básica Nível 1', 'Preparação dos cadernos para a Matemática do 7º Ano'],
        goal: 'Iniciar a Fase 2 (7º ano) com a base 100% blindada.'
      }
    ]
  },
  {
    weekNumber: 4,
    period: '19/10 a 25/10',
    phaseNumber: 2,
    phaseName: 'Fase 2: Matemática do 7º Ano - Base',
    title: 'Conjunto dos Números Inteiros (Z)',
    days: [
      {
        dayName: 'Seg 19/10',
        subject: 'Matemática 7º Ano',
        topics: ['Números positivos e negativos no cotidiano', 'Reta numérica e ordem dos inteiros', 'Módulo ou valor absoluto', 'Números opostos ou simétricos'],
        goal: 'Compreender intuitivamente a reta real inteira.'
      },
      {
        dayName: 'Ter 20/10',
        subject: 'Matemática 7º Ano',
        topics: ['Adição e subtração com números inteiros', 'Eliminação de parênteses com sinais', 'Propriedades da soma em Z', 'Pequeno teste de 10 questões'],
        goal: 'Eliminar qualquer dúvida de sinal na adição/subtração.'
      },
      {
        dayName: 'Qua 21/10',
        subject: 'Português',
        topics: ['Revisão aplicada de classes gramaticais', 'Análise sintática elementar de frases', 'Interpretação e inferência textual'],
        goal: 'Diferenciar classe gramatical de função sintática.'
      },
      {
        dayName: 'Qui 22/10',
        subject: 'Ciências & História',
        topics: ['Ciências: Níveis de organização biológica (célula, tecido, órgão, sistema)', 'História: Grécia Clássica (Atenas democrática x Esparta militar)'],
        goal: 'Entender a polis grega e o conceito de cidadania.'
      },
      {
        dayName: 'Sex 23/10',
        subject: 'Redação',
        topics: ['Tema dissertativo modelo militar/vestibular', 'Construção da tese principal', 'Elaboração do argumento 1 com causa e consequência'],
        goal: 'Escrever parágrafo argumentativo estruturado.'
      },
      {
        dayName: 'Sáb 24/10',
        subject: 'Simulado & Exercícios',
        topics: ['Redação temática', 'Lista intensiva de números inteiros (adição e subtração)', 'Revisão dos erros cometidos'],
        goal: 'Garantir 100% de precisão nos cálculos com inteiros.'
      },
      {
        dayName: 'Dom 25/10',
        subject: 'Descanso & Caderno de Erros',
        topics: ['Descanso', '21h: Caderno de erros de operações com inteiros'],
        goal: 'Revisar erros de atenção.'
      }
    ]
  },
  {
    weekNumber: 5,
    period: '26/10 a 01/11',
    phaseNumber: 2,
    phaseName: 'Fase 2: Matemática do 7º Ano - Base',
    title: 'Multiplicação/Divisão de Inteiros & Expressões Numéricas',
    days: [
      {
        dayName: 'Seg 26/10',
        subject: 'Matemática 7º Ano',
        topics: ['Multiplicação e divisão de inteiros', 'Regras formais de sinais (+ com + dá +, + com - dá -)', 'Propriedades operatórias em Z'],
        goal: 'Aplicar a regra dos sinais automaticamente.'
      },
      {
        dayName: 'Ter 27/10',
        subject: 'Matemática 7º Ano',
        topics: ['Expressões numéricas em Z com parênteses, colchetes e chaves', 'Ordem rigorosa de precedência', 'Exercícios e Teste de Inteiros'],
        goal: 'Resolver expressões complexas sem errar sinal.'
      },
      {
        dayName: 'Qua 28/10',
        subject: 'Português',
        topics: ['Termos essenciais da oração: Sujeito e Predicado', 'Núcleo do sujeito', 'Tipos básicos: simples, composto e oculto'],
        goal: 'Localizar o núcleo do sujeito em qualquer período simples.'
      },
      {
        dayName: 'Qui 29/10',
        subject: 'Ciências & História',
        topics: ['Ciências: Sistemas do corpo humano (Digestório e Cardiovascular)', 'História: Roma Antiga (Monarquia e República)'],
        goal: 'Compreender o papel da expansão militar romana e patrícios vs plebeus.'
      },
      {
        dayName: 'Sex 30/10',
        subject: 'Redação',
        topics: ['Estratégias de argumentação: exemplificação histórica', 'Construção de repertório legítimo', 'Desenvolvimento de ideias'],
        goal: 'Inserir um repertório histórico consistente no desenvolvimento.'
      },
      {
        dayName: 'Sáb 31/10',
        subject: 'Simulado & Fixação',
        topics: ['Redação temática', 'Revisão geral dos números inteiros', 'Início da revisão preparatória de frações'],
        goal: 'Fechar o bloco de números inteiros com domínio pleno.'
      },
      {
        dayName: 'Dom 01/11',
        subject: 'Descanso & Caderno de Erros',
        topics: ['Descanso', '21h: Planejamento do bloco de números racionais (Q)'],
        goal: 'Preparar entrada na aritmética de frações.'
      }
    ]
  },
  {
    weekNumber: 6,
    period: '02/11 a 08/11',
    phaseNumber: 2,
    phaseName: 'Fase 2: Matemática do 7º Ano - Base',
    title: 'Frações, Frações Equivalentes e Operações em Q',
    days: [
      {
        dayName: 'Seg 02/11',
        subject: 'Matemática 7º Ano',
        topics: ['Conceito de número racional (Q)', 'Frações equivalentes e classe de equivalência', 'Simplificação até fração irredutível', 'Comparação na reta'],
        goal: 'Simplificar frações de imediato e ordenar no plano numérico.'
      },
      {
        dayName: 'Ter 03/11',
        subject: 'Matemática 7º Ano',
        topics: ['Adição e subtração com mesmo denominador e com denominadores diferentes (MMC)', 'Multiplicação e divisão de frações (inverso)'],
        goal: 'Executar adição e divisão de frações em menos de 1 minuto por questão.'
      },
      {
        dayName: 'Qua 04/11',
        subject: 'Português',
        topics: ['Tipos de predicado: verbal, nominal e verbo-nominal', 'Verbos transitivos diretos, indiretos e de ligação', 'Complementos verbais'],
        goal: 'Identificar objeto direto e indireto com precisão.'
      },
      {
        dayName: 'Qui 05/11',
        subject: 'Ciências & História',
        topics: ['Ciências: Sistema Respiratório e Excretor', 'História: O Império Romano e sua fragmentação (Crise do Século III)'],
        goal: 'Compreender a queda de Roma e transição feudal.'
      },
      {
        dayName: 'Sex 06/11',
        subject: 'Redação',
        topics: ['Coesão interparágrafos e intraparágrafos', 'Uso adequado de conectivos (Portanto, Além disso, Contudo, Por conseguinte)'],
        goal: 'Garantir nota máxima no quesito de coesão formal.'
      },
      {
        dayName: 'Sáb 07/11',
        subject: 'Simulado de Frações',
        topics: ['Redação completa', 'Lista de 25 questões contextualizadas de frações', 'Revisão semanal minuciosa'],
        goal: 'Superar 85% de acertos na lista de frações.'
      },
      {
        dayName: 'Dom 08/11',
        subject: 'Semana de Revisão Leve',
        topics: ['Fechamento das primeiras 6 semanas de estudos! Semana leve de revisão'],
        goal: 'Revisar erros acumulados e celebrar a consistência de 6 semanas.'
      }
    ]
  },
  {
    weekNumber: 7,
    period: '09/11 a 15/11',
    phaseNumber: 2,
    phaseName: 'Fase 2: Matemática do 7º Ano - Base',
    title: 'Decimais, Dízimas Periódicas e Expressões em Q',
    days: [
      {
        dayName: 'Seg 09/11',
        subject: 'Matemática 7º Ano',
        topics: ['Transformação de fração em decimal e vice-versa', 'Dízimas periódicas simples e compostas: fração geratriz', 'Conjunto dos racionais'],
        goal: 'Calcular a fração geratriz de qualquer dízima periódica.'
      },
      {
        dayName: 'Ter 10/11',
        subject: 'Matemática 7º Ano',
        topics: ['Operações combinadas com racionais (frações e decimais juntos)', 'Expressões com potências de racionais', 'Teste do Bloco de Racionais'],
        goal: 'Resolver expressões com frações e decimais misturados.'
      },
      {
        dayName: 'Qua 11/11',
        subject: 'Português',
        topics: ['Período simples vs período composto', 'Orações coordenadas (aditivas, adversativas, conclusivas, explicativas)', 'Conectivos'],
        goal: 'Usar orações compostas para enriquecer a argumentação.'
      },
      {
        dayName: 'Qui 12/11',
        subject: 'Ciências & História',
        topics: ['Ciências: Ecologia, cadeias e teias alimentares, fluxo de energia', 'História: Idade Média, invasões germânicas e ruralização'],
        goal: 'Entender níveis tróficos e biomassa nos ecossistemas.'
      },
      {
        dayName: 'Sex 13/11',
        subject: 'Redação',
        topics: ['Desenvolvimento com exemplos concretos e dados estatísticos hipotéticos', 'Produção completa de texto'],
        goal: 'Manter texto limpo e sem rasuras com letra legível.'
      },
      {
        dayName: 'Sáb 14/11',
        subject: 'Simulado & Exercícios',
        topics: ['Redação temática', 'Revisão intensiva de racionais e expressões', 'Resolução de lista modelo concurso'],
        goal: 'Consolidar precisão nas operações com racionais.'
      },
      {
        dayName: 'Dom 15/11',
        subject: 'Descanso & Caderno de Erros',
        topics: ['Descanso', '21h: Caderno de erros'],
        goal: 'Preparar entrada em Razão, Proporção e Regra de Três.'
      }
    ]
  },
  {
    weekNumber: 8,
    period: '16/11 a 22/11',
    phaseNumber: 2,
    phaseName: 'Fase 2: Matemática do 7º Ano - Base',
    title: 'Razão, Proporção, Grandezas e Regra de Três',
    days: [
      {
        dayName: 'Seg 16/11',
        subject: 'Matemática 7º Ano',
        topics: ['Conceito matemático de razão', 'Proporção: propriedade fundamental dos meios e extremos', 'Grandezas diretamente e inversamente proporcionais'],
        goal: 'Distinguir grandezas diretas e inversas sem pestanejar.'
      },
      {
        dayName: 'Ter 17/11',
        subject: 'Matemática 7º Ano',
        topics: ['Regra de três simples (direta e inversa)', 'Divisão em partes proporcionais', 'Introdução à Porcentagem como razão centesimal', 'Problemas'],
        goal: 'Equacionar e resolver regra de três simples em menos de 2 minutos.'
      },
      {
        dayName: 'Qua 18/11',
        subject: 'Português',
        topics: ['Interpretação de textos complexos e crônicas', 'Identificação de pressupostos e subentendidos', 'Ideia principal x secundária'],
        goal: 'Responder questões de interpretação sem extrapolar o texto.'
      },
      {
        dayName: 'Qui 19/11',
        subject: 'Ciências & História',
        topics: ['Ciências: Ciclos biogeoquímicos (água, carbono e nitrogênio)', 'História: O Feudalismo, suserania e vassalagem, sociedade tripartida'],
        goal: 'Compreender o papel dos decompositores e a estrutura feudal.'
      },
      {
        dayName: 'Sex 20/11',
        subject: 'Redação',
        topics: ['Estrutura da contra-argumentação simples', 'Conclusão com proposta de ação ou síntese reflexiva', 'Revisão de vocabulário'],
        goal: 'Concluir a redação amarrando os dois argumentos do miolo.'
      },
      {
        dayName: 'Sáb 21/11',
        subject: 'Simulado de Proporção',
        topics: ['Redação completa', 'Exercícios práticos de porcentagem e regra de três', 'Teste de razão e proporção'],
        goal: 'Gabaritar questões de razão e proporção da lista Ferretto/Apostila.'
      },
      {
        dayName: 'Dom 22/11',
        subject: 'Descanso & Planejamento',
        topics: ['Descanso', '21h: Caderno de erros e planejamento da álgebra'],
        goal: 'Organizar cadernos para o início da Álgebra.'
      }
    ]
  },
  {
    weekNumber: 9,
    period: '23/11 a 29/11',
    phaseNumber: 2,
    phaseName: 'Fase 2: Matemática do 7º Ano - Base',
    title: 'Porcentagem Aplicada, Escalas e Introdução à Álgebra',
    days: [
      {
        dayName: 'Seg 23/11',
        subject: 'Matemática 7º Ano',
        topics: ['Porcentagem aplicada: aumentos, descontos e lucros', 'Escalas métricas em mapas e maquetes (E = d/D)', 'Problemas reais de vestibulares'],
        goal: 'Converter unidades métricas e calcular escalas com facilidade.'
      },
      {
        dayName: 'Ter 24/11',
        subject: 'Matemática 7º Ano',
        topics: ['A transição para a Álgebra: o uso de letras para representar números', 'Variáveis vs incógnitas', 'Expressões algébricas e valor numérico'],
        goal: 'Substituir variáveis e calcular o valor numérico de qualquer expressão.'
      },
      {
        dayName: 'Qua 25/11',
        subject: 'Português',
        topics: ['Revisão geral de gramática (concordância, regência e crase básica)', 'Interpretação e vocabulário erudito', 'Exercícios'],
        goal: 'Eliminar erros de concordância nominal e verbal.'
      },
      {
        dayName: 'Qui 26/11',
        subject: 'Ciências & História',
        topics: ['Ciências: Energia, tipos (cinética, potencial, térmica) e conservação', 'História: A Igreja Católica medieval, inquisição e as Cruzadas'],
        goal: 'Entender a Primeira Lei da Termodinâmica e transformações energéticas.'
      },
      {
        dayName: 'Sex 27/11',
        subject: 'Redação',
        topics: ['Estrutura completa e treino com tempo cronometrado (1h15)', 'Autoavaliação baseada na grade de correção oficial'],
        goal: 'Finalizar uma redação completa dentro do tempo estipulado.'
      },
      {
        dayName: 'Sáb 28/11',
        subject: 'Simulado & Teste',
        topics: ['Redação', 'Revisão de álgebra e valor numérico', 'Teste de Porcentagem & Escalas'],
        goal: 'Garantir nota alta no teste de porcentagem.'
      },
      {
        dayName: 'Dom 29/11',
        subject: 'Descanso & Caderno de Erros',
        topics: ['Descanso', '21h: Caderno de erros'],
        goal: 'Preparar entrada na Fase 3: Álgebra, Geometria e Estatística.'
      }
    ]
  },
  {
    weekNumber: 10,
    period: '30/11 a 06/12',
    phaseNumber: 3,
    phaseName: 'Fase 3: Álgebra, Geometria e Estatística',
    title: 'Monômios, Polinômios e Produtos Notáveis',
    days: [
      {
        dayName: 'Seg 30/11',
        subject: 'Matemática 7º Ano',
        topics: ['Termos algébricos: coeficiente numérico e parte literal', 'Monômios semelhantes e redução de termos', 'Adição e subtração de polinômios'],
        goal: 'Agrupar monômios semelhantes com total clareza.'
      },
      {
        dayName: 'Ter 01/12',
        subject: 'Matemática 7º Ano',
        topics: ['Multiplicação de monômios e polinômios (distributiva)', 'Introdução aos produtos notáveis: (a+b)², (a-b)² e (a+b)(a-b)', 'Exercícios'],
        goal: 'Expandir produtos notáveis sem errar o dobro do produto.'
      },
      {
        dayName: 'Qua 02/12',
        subject: 'Português',
        topics: ['Produção textual: clareza, concisão e impessoalidade', 'Figuras de linguagem principais (metáfora, metonímia, antítese, paradoxo)'],
        goal: 'Reconhecer recursos expressivos em textos e provas.'
      },
      {
        dayName: 'Qui 03/12',
        subject: 'Ciências & História',
        topics: ['Ciências: Tecnologia e máquinas simples (roldanas, alavancas, plano inclinado)', 'História: Renascimento cultural e científico'],
        goal: 'Compreender o princípio de vantagem mecânica nas roldanas e polias.'
      },
      {
        dayName: 'Sex 04/12',
        subject: 'Redação',
        topics: ['Redação completa modelo ENEM/Militar', 'Revisão linha por linha', 'Repertório filosófico clássico (Aristóteles, Platão)'],
        goal: 'Fundamentar argumento com conceito filosófico de justiça ou ética.'
      },
      {
        dayName: 'Sáb 05/12',
        subject: 'Simulado de Álgebra',
        topics: ['Redação semanal', 'Teste de monômios e produtos notáveis', 'Correção e anotação no caderno de erros'],
        goal: 'Consolidar fatoração e produtos notáveis.'
      },
      {
        dayName: 'Dom 06/12',
        subject: 'Descanso & Organização',
        topics: ['Descanso', '21h: Caderno de erros'],
        goal: 'Preparar o estudo das equações do primeiro grau.'
      }
    ]
  },
  {
    weekNumber: 11,
    period: '07/12 a 13/12',
    phaseNumber: 3,
    phaseName: 'Fase 3: Álgebra, Geometria e Estatística',
    title: 'Equações do 1º Grau & Problemas Modelados',
    days: [
      {
        dayName: 'Seg 07/12',
        subject: 'Matemática 7º Ano',
        topics: ['Princípio aditivo e multiplicativo da igualdade', 'Equações de 1º grau na forma ax + b = c', 'Resolução sistemática passo a passo'],
        goal: 'Resolver equações lineares com isolamento da incógnita sem hesitar.'
      },
      {
        dayName: 'Ter 08/12',
        subject: 'Matemática 7º Ano',
        topics: ['Equações com frações, parênteses e incógnitas em ambos os membros', 'Tradução de enunciados em linguagem matemática (problemas de torneira, idade, compras)'],
        goal: 'Traduzir problemas em português para equações algébricas.'
      },
      {
        dayName: 'Qua 09/12',
        subject: 'Português',
        topics: ['Interpretação e inferência', 'Semântica: ambiguidade, paráfrase e polissemia', 'Produção de respostas discursivas completas'],
        goal: 'Redigir respostas discursivas formais sem abreviações.'
      },
      {
        dayName: 'Qui 10/12',
        subject: 'Ciências & História',
        topics: ['Ciências: Revisão geral de Ciências do ano (matéria, células, sistemas, energia)', 'História: Grandes Navegações e Mercantilismo'],
        goal: 'Conectar expansão marítima com o início da Idade Moderna.'
      },
      {
        dayName: 'Sex 11/12',
        subject: 'Redação',
        topics: ['Argumentação aprofundada + proposta de intervenção detalhada', 'Redação completa cronometrada'],
        goal: 'Construir proposta de intervenção com os 5 elementos (agente, ação, meio, efeito, detalhamento).'
      },
      {
        dayName: 'Sáb 12/12',
        subject: 'Simulado de Equações',
        topics: ['Redação temática', 'Teste de 20 problemas clássicos modelados com equações', 'Correção detalhada dos erros'],
        goal: 'Alcançar pelo menos 85% de acertos nos problemas.'
      },
      {
        dayName: 'Dom 13/12',
        subject: 'Descanso & Caderno de Erros',
        topics: ['Descanso', '21h: Caderno de erros'],
        goal: 'Preparar entrada em Geometria Plana.'
      }
    ]
  },
  {
    weekNumber: 12,
    period: '14/12 a 20/12',
    phaseNumber: 3,
    phaseName: 'Fase 3: Álgebra, Geometria e Estatística',
    title: 'Geometria: Ângulos, Polígonos, Perímetro e Áreas',
    days: [
      {
        dayName: 'Seg 14/12',
        subject: 'Matemática 7º Ano',
        topics: ['Entes fundamentais: ponto, reta, plano e segmento', 'Ângulos: agudo, reto, obtuso, raso', 'Ângulos complementares e suplementares', 'OPV (Opostos pelo vértice)'],
        goal: 'Dominar relações angulares em retas paralelas cortadas por transversal.'
      },
      {
        dayName: 'Ter 15/12',
        subject: 'Matemática 7º Ano',
        topics: ['Triângulos (classificação por lados e ângulos)', 'Soma dos ângulos internos = 180°', 'Quadriláteros notáveis', 'Cálculo de Perímetro e Áreas básicas (quadrado, retângulo, triângulo)'],
        goal: 'Deduzir fórmulas de áreas sem memorização cega.'
      },
      {
        dayName: 'Qua 16/12',
        subject: 'Português',
        topics: ['Revisão geral de gramática para vestibulares', 'Interpretação textual com pegadinhas clássicas', 'Sintaxe de regência'],
        goal: 'Identificar pegadinhas em alternativas de múltipla escolha.'
      },
      {
        dayName: 'Qui 17/12',
        subject: 'Ciências & História',
        topics: ['Ciências e História: Revisão integrada e resolução de exercícios das áreas com maior dificuldade identificada'],
        goal: 'Sanar dúvidas conceituais antes das revisões finais.'
      },
      {
        dayName: 'Sex 18/12',
        subject: 'Redação',
        topics: ['Redação completa sobre tema complexo (tecnologia, impactos socioambientais ou soberania nacional)'],
        goal: 'Entregar texto com repertório maduro e vocabulário formal refinado.'
      },
      {
        dayName: 'Sáb 19/12',
        subject: 'Simulado de Geometria',
        topics: ['Redação temática', 'Teste de Geometria Plana (ângulos, triângulos e áreas)', 'Correção e anotação'],
        goal: 'Garantir raciocínio espacial e geométrico sólido.'
      },
      {
        dayName: 'Dom 20/12',
        subject: 'Descanso & Preparação',
        topics: ['Descanso', '21h: Caderno de erros e planejamento da semana final'],
        goal: 'Preparar a semana de Estatística e Grande Teste Final.'
      }
    ]
  },
  {
    weekNumber: 13,
    period: '21/12 a 27/12',
    phaseNumber: 3,
    phaseName: 'Fase 3: Álgebra, Geometria e Estatística',
    title: 'Estatística, Probabilidade Básica e O GRANDE TESTE GERAL',
    days: [
      {
        dayName: 'Seg 21/12',
        subject: 'Matemática 7º Ano',
        topics: ['Leitura e interpretação de tabelas e gráficos (barras, setores e linhas)', 'Medidas de tendência central: Média aritmética simples e ponderada', 'Moda e Mediana'],
        goal: 'Calcular média, moda e mediana de qualquer conjunto de dados.'
      },
      {
        dayName: 'Ter 22/12',
        subject: 'Matemática 7º Ano',
        topics: ['Noções de probabilidade básica: espaço amostral e eventos favoráveis (P = n(E) / n(S))', 'Exercícios mistos de revisão geral'],
        goal: 'Calcular probabilidades simples em frações e porcentagem.'
      },
      {
        dayName: 'Qua 23/12',
        subject: 'Português',
        topics: ['Revisão final dos principais conteúdos de Português e Interpretação do ano', 'Vocabulário e conectivos de alto nível'],
        goal: 'Blindar a pontuação e gramática para as próximas fases.'
      },
      {
        dayName: 'Qui 24/12',
        subject: 'Revisão Leve',
        topics: ['Revisão leve de fórmulas e conceitos-chave (sem estudo pesado na véspera de Natal)'],
        goal: 'Descanso mental e comemoração.'
      },
      {
        dayName: 'Sex 25/12',
        subject: 'Natal & Descanso',
        topics: ['Descanso de Natal ou redação livre opcional'],
        goal: 'Confraternização e recuperação de energia.'
      },
      {
        dayName: 'Sáb 26/12',
        subject: 'O GRANDE TESTE GERAL (MARCO FINAL)',
        topics: ['GRANDE TESTE - Matemática Geral: Inteiros, frações, racionais, razão, proporção, porcentagem, álgebra, equações, geometria, estatística e probabilidade', 'Classificação de cada tópico em: Dominei / Preciso Revisar / Não Domino'],
        goal: 'Fechar o ciclo do 7º ano e mapear exatamente onde começar a Fase 4!'
      },
      {
        dayName: 'Dom 27/12',
        subject: 'Transição & Celebração',
        topics: ['Descanso total e análise do Mapa de Domínio conquistado ao longo das 13 semanas', 'Definição da Rota para o 8º e 9º ano em direção ao ITA'],
        goal: 'Comemorar o cumprimento rigoroso do plano de estudos!'
      }
    ]
  }
];

// 3. MAPA DE PROGRESSO & DOMÍNIO DOS CONTEÚDOS (CHECKBOXES E STATUS)
export const ITA_MASTERY_TOPICS: MasteryTopic[] = [
  // Matemática Básica - Nível 1
  {
    id: 'mat_b_1',
    category: 'basica_nivel1',
    categoryLabel: 'Matemática Básica - Nível 1',
    title: 'Sistema de Numeração Decimal',
    description: 'Ordens, classes, valor posicional e representação de grandezas.',
    subtopics: ['Ordens e classes', 'Escrita por extenso', 'Potências de 10']
  },
  {
    id: 'mat_b_2',
    category: 'basica_nivel1',
    categoryLabel: 'Matemática Básica - Nível 1',
    title: 'Valor Absoluto vs Valor Relativo',
    description: 'Diferença entre o valor intrínseco do algarismo e sua posição no número.',
    subtopics: ['Algarismo na centena/milhar', 'Decomposição polinomial']
  },
  {
    id: 'mat_b_3',
    category: 'basica_nivel1',
    categoryLabel: 'Matemática Básica - Nível 1',
    title: 'Classes e Ordens Numéricas',
    description: 'Classe das unidades simples, milhares, milhões, bilhões.',
    subtopics: ['Centena de milhar', 'Posição de cada algarismo']
  },
  {
    id: 'mat_b_4',
    category: 'basica_nivel1',
    categoryLabel: 'Matemática Básica - Nível 1',
    title: 'Adição com Agilidade Mental',
    description: 'Técnicas de agrupamento para somar rápido sem papel.',
    subtopics: ['Soma por complementos de 10 e 100', 'Propriedades associativa e comutativa']
  },
  {
    id: 'mat_b_5',
    category: 'basica_nivel1',
    categoryLabel: 'Matemática Básica - Nível 1',
    title: 'Subtração e Troco',
    description: 'Operações de subtração com empréstimo e cálculos de troco sem erro.',
    subtopics: ['Subtração com zeros', 'Cálculo de complemento']
  },
  {
    id: 'mat_b_6',
    category: 'basica_nivel1',
    categoryLabel: 'Matemática Básica - Nível 1',
    title: 'Multiplicação e Propriedades',
    description: 'Domínio pleno da tabuada mental, duplicar, triplicar, quadruplicar.',
    subtopics: ['Tabuada do 2 ao 10', 'Multiplicação por potências de 10', 'Propriedade distributiva']
  },
  {
    id: 'mat_b_7',
    category: 'basica_nivel1',
    categoryLabel: 'Matemática Básica - Nível 1',
    title: 'Divisão Exata e Não Exata',
    description: 'Algoritmo da divisão euclidiana, resto, quociente e relação inversa.',
    subtopics: ['Divisão com resto', 'Divisões notáveis por 5 e 25']
  },
  {
    id: 'mat_b_8',
    category: 'basica_nivel1',
    categoryLabel: 'Matemática Básica - Nível 1',
    title: 'Potenciação Teoria Completa',
    description: 'Bases positivas e negativas, expoentes inteiros e propriedades fundamentais.',
    subtopics: ['Multiplicação de potências de mesma base', 'Potência de potência', 'Expoente zero']
  },
  {
    id: 'mat_b_9',
    category: 'basica_nivel1',
    categoryLabel: 'Matemática Básica - Nível 1',
    title: 'Radiciação Básica',
    description: 'Raízes quadradas e cúbicas exatas e operação inversa da potenciação.',
    subtopics: ['Quadrados perfeitos de 1 a 625', 'Raiz quadrada de frações e decimais']
  },
  {
    id: 'mat_b_10',
    category: 'basica_nivel1',
    categoryLabel: 'Matemática Básica - Nível 1',
    title: 'Operações Mentais Rápidas',
    description: 'Macete para multiplicar por 11, dividir por 5, estimativas de ordem de grandeza.',
    subtopics: ['Multiplicação por 11', 'Divisão por 5', 'Arredondamentos estratégicos']
  },
  {
    id: 'mat_b_11',
    category: 'basica_nivel1',
    categoryLabel: 'Matemática Básica - Nível 1',
    title: 'Números Decimais',
    description: 'Soma, subtração, multiplicação e divisão com números decimais.',
    subtopics: ['Casas decimais', 'Alinhamento de vírgula', 'Multiplicação decimal']
  },
  {
    id: 'mat_b_12',
    category: 'basica_nivel1',
    categoryLabel: 'Matemática Básica - Nível 1',
    title: 'Números Negativos',
    description: 'Regra de sinais para soma, subtração, multiplicação e divisão.',
    subtopics: ['Reta numérica', 'Sinais iguais vs diferentes', 'Parênteses']
  },
  {
    id: 'mat_b_13',
    category: 'basica_nivel1',
    categoryLabel: 'Matemática Básica - Nível 1',
    title: 'Múltiplos e Divisores',
    description: 'Conceito formal de múltiplo, divisor e conjunto dos divisores de um número.',
    subtopics: ['Cálculo de divisores', 'Divisores comuns']
  },
  {
    id: 'mat_b_14',
    category: 'basica_nivel1',
    categoryLabel: 'Matemática Básica - Nível 1',
    title: 'Números Primos & Crivo',
    description: 'Identificação de primos até 100 e crivo de Eratóstenes.',
    subtopics: ['Primos de 1 a 100', 'Teste de primalidade']
  },
  {
    id: 'mat_b_15',
    category: 'basica_nivel1',
    categoryLabel: 'Matemática Básica - Nível 1',
    title: 'Fatoração em Números Primos',
    description: 'Decomposição em fatores primos sucessivos.',
    subtopics: ['Decomposição simultânea', 'Forma fatorada padrão']
  },
  {
    id: 'mat_b_16',
    category: 'basica_nivel1',
    categoryLabel: 'Matemática Básica - Nível 1',
    title: 'Critérios de Divisibilidade',
    description: 'Critérios práticos por 2, 3, 4, 5, 6, 8, 9, 10 e 100.',
    subtopics: ['Critério da soma dos algarismos', 'Dois últimos algarismos']
  },
  {
    id: 'mat_b_17',
    category: 'basica_nivel1',
    categoryLabel: 'Matemática Básica - Nível 1',
    title: 'Quantidade de Divisores de um Número',
    description: 'Fórmula dos expoentes acrescidos de 1: D(n) = (a+1)(b+1)(c+1)...',
    subtopics: ['Fórmula dos divisores naturais', 'Divisores pares e ímpares']
  },
  {
    id: 'mat_b_18',
    category: 'basica_nivel1',
    categoryLabel: 'Matemática Básica - Nível 1',
    title: 'Frações Fundamentais',
    description: 'Frações próprias, impróprias, aparentes, mistas e equivalentes.',
    subtopics: ['Conversão número misto', 'Simplificação até irredutível']
  },
  {
    id: 'mat_b_19',
    category: 'basica_nivel1',
    categoryLabel: 'Matemática Básica - Nível 1',
    title: 'Teste Final do Nível 1',
    description: 'Simulado completo com 30 questões de revisão e cronômetro.',
    subtopics: ['Mínimo 80% de acerto', 'Zero uso de calculadora']
  },

  // Matemática - 7º Ano
  {
    id: 'mat_7_1',
    category: 'setimo_ano',
    categoryLabel: 'Matemática - 7º Ano',
    title: 'Números Inteiros (Z)',
    description: 'Conceito, módulo, comparação e opostos simétricos.',
    subtopics: ['Reta dos inteiros', 'Valor absoluto |x|']
  },
  {
    id: 'mat_7_2',
    category: 'setimo_ano',
    categoryLabel: 'Matemática - 7º Ano',
    title: 'Operações com Inteiros',
    description: 'Adição, subtração, multiplicação e divisão de números positivos e negativos.',
    subtopics: ['Regra de sinais rigorosa', 'Propriedades operatórias']
  },
  {
    id: 'mat_7_3',
    category: 'setimo_ano',
    categoryLabel: 'Matemática - 7º Ano',
    title: 'Expressões Numéricas em Z',
    description: 'Resolução com todas as operações combinadas, parênteses, colchetes e chaves.',
    subtopics: ['Precedência de operações', 'Atenção aos sinais negativos antes de parênteses']
  },
  {
    id: 'mat_7_4',
    category: 'setimo_ano',
    categoryLabel: 'Matemática - 7º Ano',
    title: 'Frações e Racionais (Q)',
    description: 'Operações de soma, subtração, multiplicação e divisão com números fracionários.',
    subtopics: ['MMC nos denominadores', 'Multiplicação e divisão com frações inversas']
  },
  {
    id: 'mat_7_5',
    category: 'setimo_ano',
    categoryLabel: 'Matemática - 7º Ano',
    title: 'Números Decimais e Dízimas',
    description: 'Dízimas periódicas simples e compostas e cálculo da fração geratriz.',
    subtopics: ['Fração geratriz', 'Período e antiperíodo']
  },
  {
    id: 'mat_7_6',
    category: 'setimo_ano',
    categoryLabel: 'Matemática - 7º Ano',
    title: 'Razão e Proporção',
    description: 'Conceito de razão, proporção e propriedade fundamental a/b = c/d.',
    subtopics: ['Extremos e meios', 'Grandezas diretamente e inversamente proporcionais']
  },
  {
    id: 'mat_7_7',
    category: 'setimo_ano',
    categoryLabel: 'Matemática - 7º Ano',
    title: 'Regra de Três Simples',
    description: 'Resolução de problemas do cotidiano envolvendo duas grandezas proporcionais.',
    subtopics: ['Montagem de setas de proporcionalidade', 'Problemas clássicos de operários, torneiras e velocidade']
  },
  {
    id: 'mat_7_8',
    category: 'setimo_ano',
    categoryLabel: 'Matemática - 7º Ano',
    title: 'Porcentagem & Agilidade Mental',
    description: 'Cálculo de porcentagens notáveis (50%, 10%, 1%, 5%, 20%), acréscimos e descontos.',
    subtopics: ['Fator de aumento (1 + i)', 'Fator de desconto (1 - i)', 'Descontos sucessivos']
  },
  {
    id: 'mat_7_9',
    category: 'setimo_ano',
    categoryLabel: 'Matemática - 7º Ano',
    title: 'Escalas Métricas e Cartográficas',
    description: 'Escala linear E = d/D e escalas de área e volume em maquetes.',
    subtopics: ['Conversão mm, cm, m, km', 'Relação quadrática de áreas', 'Relação cúbica de volumes']
  },
  {
    id: 'mat_7_10',
    category: 'setimo_ano',
    categoryLabel: 'Matemática - 7º Ano',
    title: 'Linguagem e Expressões Algébricas',
    description: 'Tradução do português para a matemática e cálculo de valor numérico.',
    subtopics: ['Variável vs incógnita', 'Substituição de valores numéricos']
  },
  {
    id: 'mat_7_11',
    category: 'setimo_ano',
    categoryLabel: 'Matemática - 7º Ano',
    title: 'Monômios e Polinômios',
    description: 'Operações com termos algébricos semelhantes e propriedade distributiva.',
    subtopics: ['Grau de um monômio', 'Redução de monômios semelhantes', 'Multiplicação de polinômios']
  },
  {
    id: 'mat_7_12',
    category: 'setimo_ano',
    categoryLabel: 'Matemática - 7º Ano',
    title: 'Produtos Notáveis e Fatoração',
    description: 'Quadrado da soma, quadrado da diferença, produto da soma pela diferença.',
    subtopics: ['(a+b)²', '(a-b)²', '(a+b)(a-b)', 'Fator comum em evidência']
  },
  {
    id: 'mat_7_13',
    category: 'setimo_ano',
    categoryLabel: 'Matemática - 7º Ano',
    title: 'Equações do 1º Grau',
    description: 'Resolução algébrica com parênteses e incógnitas em ambos os lados.',
    subtopics: ['Princípio aditivo e multiplicativo', 'Isolamento da incógnita']
  },
  {
    id: 'mat_7_14',
    category: 'setimo_ano',
    categoryLabel: 'Matemática - 7º Ano',
    title: 'Problemas Modelados com Equações',
    description: 'Resolução de problemas de vestibulares e olimpíadas modelados por equações lineares.',
    subtopics: ['Problemas de idades', 'Problemas de compras e rateio', 'Problemas de torneiras e vazão']
  },
  {
    id: 'mat_7_15',
    category: 'setimo_ano',
    categoryLabel: 'Matemática - 7º Ano',
    title: 'Geometria: Ângulos e Classificação',
    description: 'Retas paralelas cortadas por transversal, ângulos alternos e correspondentes.',
    subtopics: ['Ângulos complementares e suplementares', 'Ângulos opostos pelo vértice', 'Alternos internos']
  },
  {
    id: 'mat_7_16',
    category: 'setimo_ano',
    categoryLabel: 'Matemática - 7º Ano',
    title: 'Triângulos, Quadriláteros e Polígonos',
    description: 'Soma dos ângulos internos, classificação e propriedades.',
    subtopics: ['Si = (n-2) · 180°', 'Triângulo equilátero, isósceles e escaleno', 'Paralelogramo, trapézio e losango']
  },
  {
    id: 'mat_7_17',
    category: 'setimo_ano',
    categoryLabel: 'Matemática - 7º Ano',
    title: 'Perímetro e Áreas de Figuras Planas',
    description: 'Fórmulas e raciocínio geométrico para triângulos, retângulos, trapézios e círculos.',
    subtopics: ['Área do triângulo', 'Área do trapézio', 'Área do círculo (π·r²)', 'Perímetro (comprimento da circunferência 2πr)']
  },
  {
    id: 'mat_7_18',
    category: 'setimo_ano',
    categoryLabel: 'Matemática - 7º Ano',
    title: 'Tabelas, Gráficos e Estatística',
    description: 'Interpretação e cálculo de Média, Moda e Mediana.',
    subtopics: ['Média aritmética simples', 'Média ponderada', 'Moda e Mediana']
  },
  {
    id: 'mat_7_19',
    category: 'setimo_ano',
    categoryLabel: 'Matemática - 7º Ano',
    title: 'Probabilidade Básica',
    description: 'Espaço amostral, eventos equiprováveis e cálculo da probabilidade P = n(E) / n(S).',
    subtopics: ['Eventos certos, impossíveis e complementares', 'Representação em fração e porcentagem']
  }
];

// 4. ESTRATÉGIA LONGO PRAZO 2026 A 2031 (DOS 12 AOS 18 ANOS)
export const ITA_MULTI_YEAR_ROADMAP: YearPlanItem[] = [
  {
    period: '2026 a 2027 (12 a 13 anos)',
    focus: 'Construção da Base Inabalável + Programação Inicial',
    details: 'Dominar o 6º e 7º ano com perfeição. Matemática Fases 1 e 2 (base aritmética, álgebra elementar, funções afim e quadrática), Português e Inglês. Física entra em jan/2027 e Química em jul/2027.',
    mathFocus: 'Aritmética, Álgebra, Frações, Decimais, Produtos Notáveis, Equações e Funções Iniciais.',
    otherSubjectsFocus: 'Português gramatical, Vocabulário de Inglês, Redação dissertativa e noções de lógica de programação.'
  },
  {
    period: '2028 (14 anos)',
    focus: 'Geometria Completa, Mecânica e Química Geral',
    details: 'Dominar 8º e 9º ano com profundidade. Geometria plana rigorosa (triângulos, círculos, semelhança, áreas), Trigonometria no triângulo retângulo e ciclo, Geometria espacial. Física: Cinemática vetorial, Leis de Newton, Trabalho e Energia. Química: Tabela periódica, ligações e estequiometria.',
    mathFocus: 'Geometria plana euclidiana, Trigonometria, Geometria espacial de prismas e pirâmides.',
    otherSubjectsFocus: 'Física mecânica clássica e gravitação. Química inorgânica e estequiometria.'
  },
  {
    period: '2029 (15 anos - 9º ano / 1º EM)',
    focus: 'Matemática Avançada, Física Térmica/Ondas e Química Orgânica',
    details: 'Transição para o Ensino Médio com nível aprofundado. Análise combinatória, probabilidade, binômio de Newton, geometria analítica (retas e cônicas), números complexos, polinômios, matrizes e determinantes. Física: Termodinâmica, Ondulatória e Eletricidade. Química orgânica e físico-química.',
    mathFocus: 'Combinatória, Probabilidade, Complexos, Polinômios, Matrizes, Determinantes e Cônicas.',
    otherSubjectsFocus: 'Física ondulatória e eletrostática/dinâmica. Química orgânica completa.'
  },
  {
    period: '2030 (16 anos - 2º EM)',
    focus: 'Nível ITA & IME por Tema + Prova como Treineiro',
    details: 'Fazer o primeiro vestibular do ITA como treineiro para conhecer a pressão e o formato real. Resolução exaustiva de provas antigas do ITA e IME organizadas por tópico (Coleção Fundamentos da Matemática Elementar / Iezzi, livros peruanos e apostilas militares). Redação militar semanal.',
    mathFocus: 'Todas as matérias no padrão 1ª e 2ª fase do ITA (questões discursivas e demonstrações).',
    otherSubjectsFocus: 'Física e Química de alto nível (Irodov, Saraeva, Feltre, Martha Reis, Tito e Canto).'
  },
  {
    period: '2031 (17 a 18 anos - 3º EM)',
    focus: 'Ano do Vestibular Valendo: Lapidação e Simulados Completos',
    details: 'Foco exclusivo na aprovação na 1ª e 2ª Fase do ITA em Outubro de 2031. Simulados completos de provas inteiras no tempo exato, resolução aprofundada do caderno de erros acumulado, inglês técnico e redação nota 10.',
    mathFocus: 'Simulados completos semanais de 1ª e 2ª Fase, controle de tempo e precisão algébrica.',
    otherSubjectsFocus: 'Lapidação final nas 4 matérias da 1ª fase (Mat, Fis, Quim, Ing) e nas discursivas da 2ª fase.'
  }
];

// 5. CRONOGRAMA MÊS A MÊS DETALHADO (OUT/2026 A OUT/2031)
export const ITA_MONTH_BY_MONTH = [
  {
    period: 'Out a Dez/2026',
    math: 'Revisão intensiva de 12h, depois a base: frações, MMC/MDC, razão, proporção, regra de três, porcentagem, equações de 1º grau e sistemas lineares.',
    others: 'Português e Inglês. Matemática de reforço nas noites de Física e Química.'
  },
  {
    period: 'Jan a Fev/2027',
    math: 'ÁLGEBRA: produtos notáveis, fatoração, equação de 2º grau e expressões algébricas.',
    others: 'Física (base) entra em janeiro! Português e Inglês.'
  },
  {
    period: 'Mar a Abr/2027',
    math: 'Funções: introdução, função afim e função quadrática (vértice, raízes e sinais).',
    others: 'Física: introdução à cinemática (MRU, MRUV). Português e Inglês.'
  },
  {
    period: 'Mai a Jun/2027',
    math: 'Módulo, equações e inequações modulares, função exponencial e gráficos.',
    others: 'Física: cinemática vetorial e lançamentos. Português, Inglês e Redação.'
  },
  {
    period: 'Jul a Ago/2027',
    math: 'Logaritmo, propriedades operatórias, função composta e função inversa.',
    others: 'Química (base) entra em julho! Física: Dinâmica e Leis de Newton.'
  },
  {
    period: 'Set a Dez/2027',
    math: 'Revisão das fases 1 e 2 com questões de vestibular militar. Geometria plana (introdução) em novembro.',
    others: 'Física e Química básicas. Português, Inglês e Redação semanal.'
  },
  {
    period: 'Jan a Mar/2028',
    math: 'Geometria plana completa: triângulos, pontos notáveis, semelhança, círculo, polígonos e cálculo de áreas.',
    others: 'Física: trabalho, energia, potência e gravitação universal. Química geral.'
  },
  {
    period: 'Abr a Jun/2028',
    math: 'Trigonometria: triângulo retângulo, ciclo trigonométrico, identidades, equações, leis dos senos e cossenos.',
    others: 'Física: estática e hidrostática. Química: estequiometria e soluções.'
  },
  {
    period: 'Jul a Set/2028',
    math: 'Geometria espacial: prismas, pirâmides, cilindro, cone, esfera e troncos.',
    others: 'Física: revisão de mecânica. Química: soluções e ligações químicas.'
  },
  {
    period: 'Out a Dez/2028',
    math: 'Progressão Aritmética (PA) e Progressão Geométrica (PG).',
    others: 'Física e Química com questões de vestibulares militares. Inglês e Redação.'
  },
  {
    period: 'Jan a Mar/2029',
    math: 'Combinatória (PFC, permutações, combinações), probabilidade e binômio de Newton.',
    others: 'Física: termologia e óptica geométrica. Química orgânica.'
  },
  {
    period: 'Abr a Jun/2029',
    math: 'Geometria analítica: ponto, reta, circunferência e cônicas (elipse, hipérbole e parábola).',
    others: 'Física: ondas e acústica. Química: físico-química e cinética.'
  },
  {
    period: 'Jul a Set/2029',
    math: 'Números complexos e polinômios (teorema das raízes e relações de Girard).',
    others: 'Física: eletrostática e circuitos elétricos. Química: equilíbrio químico e eletroquímica.'
  },
  {
    period: 'Out a Dez/2029',
    math: 'Matrizes, determinantes, sistemas lineares, conjuntos, lógica e indução matemática.',
    others: 'Física: eletromagnetismo e física moderna. Revisão geral de Química.'
  },
  {
    period: '2030 (Ano Inteiro)',
    math: 'Provas antigas do ITA e IME por tema; listas avançadas de olimpíada e Iezzi.',
    others: 'Física e Química no nível ITA discursivo. Redação semanal.'
  },
  {
    period: 'Jan a Out/2031 (Ano da Prova)',
    math: 'Simulados completos semanais cronometrados, caderno de erros, reforço nos pontos fracos.',
    others: 'Simulados completos das 4 matérias, inglês técnico e revisão. PROVA DO ITA EM OUTUBRO DE 2031!'
  }
];

// 6. REGRAS DE OURO DA ROTINA
export const ITA_ROUTINE_RULES = [
  {
    title: 'Caderno de Erros Obrigatório',
    desc: 'Todo erro cometido em listas ou simulados deve ir obrigatoriamente para o Caderno de Erros com a causa exata (conceito, conta ou interpretação). Aos sábados e domingos à noite, você refaz as questões erradas do zero.'
  },
  {
    title: 'Revisão Leve a Cada 6 Semanas',
    desc: 'O cérebro precisa de consolidação. A cada 6 semanas de estudo intenso, a 7ª semana é mais leve, dedicada apenas à revisão ativa de flashcards, mapas mentais e resolução de erros passados.'
  },
  {
    title: 'Sono Inegociável de 8 Horas',
    desc: 'Dormir bem é quando a memória de longo prazo é consolidada e as sinapses são podadas. O cronograma prevê encerrar às 00h15/00h30 e acordar às 8h30. 8 horas de sono cabem perfeitamente na rotina!'
  },
  {
    title: 'Assistir Aula Não Basta: Sempre Fazer Questões',
    desc: 'Assistir aula passivamente dá a falsa sensação de aprendizado. Toda aula de 1h ou 2h deve terminar com pelo menos 5 a 10 questões resolvidas individualmente no mesmo dia.'
  },
  {
    title: 'Critério de Domínio Real',
    desc: 'Você só domina um assunto quando consegue explicar em voz alta sem consultar o material e atinge mais de 80-90% de acertos em listas de nível de concurso.'
  }
];
