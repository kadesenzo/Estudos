import { MilitaryExamInfo } from '../types';

export const INITIAL_MILITARY_EXAMS: MilitaryExamInfo[] = [
  {
    id: 'ita',
    name: 'ITA',
    fullName: 'Instituto Tecnológico de Aeronáutica',
    institution: 'Comando da Aeronáutica (FAB / DCTA)',
    badgeColor: 'from-blue-700 to-indigo-900',
    targetCareer: 'Engenheiro Militar (Oficial da FAB) ou Engenheiro da Reserva',
    officialEditalUrl: 'http://www.vestibular.ita.br/',
    requirements: {
      age: 'Não ter mais de 24 anos até 31 de dezembro do ano da matrícula',
      education: 'Ensino Médio completo ou cursando o 3º ano',
      height: 'Não há restrição severa de altura para vagas de Engenharia',
      maritalStatus: 'Permite solteiros, conforme edital vigente',
      other: [
        'Brasileiro nato',
        'Aptidão física e psicotécnica no exame de saúde da FAB',
        'Um dos vestibulares de engenharia e forças armadas mais rigorosos do mundo'
      ]
    },
    stages: [
      '1ª Fase: Prova Objetiva (60 questões: 15 Mat, 15 Fís, 15 Quím, 15 Port/Inglês)',
      '2ª Fase: Provas Discursivas de Matemática, Física, Química e Redação (2 dias)',
      '3ª Fase: Inspeção de Saúde (INSPSAU)',
      '4ª Fase: Exame de Aptidão Psicológica (EAP)',
      '5ª Fase: Teste de Avaliação do Condicionamento Físico (TACF)'
    ],
    subjects: [
      {
        name: 'Matemática ITA (Álgebra, Geometria e Cálculo)',
        weightOrQuestions: '1ª e 2ª Fase Discursiva',
        topics: [
          { id: 'ita-mat-1', title: 'Teoria dos Conjuntos, Relações e Funções Injetoras/Sobrejetoras', isChecked: false },
          { id: 'ita-mat-2', title: 'Números Complexos, Forma Trigonométrica e Raízes da Unidade', isChecked: false },
          { id: 'ita-mat-3', title: 'Polinômios, Relações de Girard e Raízes Múltiplas', isChecked: false },
          { id: 'ita-mat-4', title: 'Matrizes, Determinantes, Teorema de Laplace e Sistemas Lineares', isChecked: false },
          { id: 'ita-mat-5', title: 'Análise Combinatória Avançada, Partições e Binômio de Newton', isChecked: false },
          { id: 'ita-mat-6', title: 'Probabilidade Condicional e Variáveis Aleatórias', isChecked: false },
          { id: 'ita-mat-7', title: 'Trigonometria Avançada, Equações e Inequações Trigonométricas', isChecked: false },
          { id: 'ita-mat-8', title: 'Geometria Plana Euclidiana (Ceva, Menelaus, Potência de Ponto)', isChecked: false },
          { id: 'ita-mat-9', title: 'Geometria Espacial e Diedros/Poliedros de Euler', isChecked: false },
          { id: 'ita-mat-10', title: 'Geometria Analítica e Estudo Completo de Cônicas (Elipse, Hipérbole, Parábola)', isChecked: false },
          { id: 'ita-mat-11', title: 'Noções Básicas de Limites e Derivadas', isChecked: false }
        ]
      },
      {
        name: 'Física ITA (Mecânica, Termodinâmica, Ondulatória e Eletromag)',
        weightOrQuestions: '1ª e 2ª Fase Discursiva',
        topics: [
          { id: 'ita-fis-1', title: 'Cinemática Vetorial e Movimentos Relativos', isChecked: false },
          { id: 'ita-fis-2', title: 'Dinâmica Newtoniana, Forças Inerciais e Atrito', isChecked: false },
          { id: 'ita-fis-3', title: 'Trabalho, Energia e Sistemas com Forças Conservativas', isChecked: false },
          { id: 'ita-fis-4', title: 'Gravitação Universal, Leis de Kepler e Velocidade de Escape', isChecked: false },
          { id: 'ita-fis-5', title: 'Hidrodinâmica, Teorema de Bernoulli e Viscosidade', isChecked: false },
          { id: 'ita-fis-6', title: 'Termodinâmica, Teoria Cinética dos Gases e Entropia', isChecked: false },
          { id: 'ita-fis-7', title: 'Ondas Mecânicas, Efeito Doppler e Interferência', isChecked: false },
          { id: 'ita-fis-8', title: 'Óptica Física, Difração e Polarização da Luz', isChecked: false },
          { id: 'ita-fis-9', title: 'Eletrostática, Potencial e Dielétricos', isChecked: false },
          { id: 'ita-fis-10', title: 'Circuitos Complexos, Ponte de Wheatstone e Leis de Kirchhoff', isChecked: false },
          { id: 'ita-fis-11', title: 'Indução Eletromagnética, Lei de Faraday-Lenz e Equações de Maxwell', isChecked: false },
          { id: 'ita-fis-12', title: 'Física Moderna e Efeito Fotoelétrico', isChecked: false }
        ]
      },
      {
        name: 'Química ITA (Geral, Físico-Química e Orgânica Avançada)',
        weightOrQuestions: '1ª e 2ª Fase Discursiva',
        topics: [
          { id: 'ita-qui-1', title: 'Estrutura Atômica, Teoria dos Orbitais Moleculares e Hibridização', isChecked: false },
          { id: 'ita-qui-2', title: 'Estequiometria Avançada e Rendimento', isChecked: false },
          { id: 'ita-qui-3', title: 'Gases Reais e Equação de Van der Waals', isChecked: false },
          { id: 'ita-qui-4', title: 'Termoquímica, Energia Livre de Gibbs e Espontaneidade', isChecked: false },
          { id: 'ita-qui-5', title: 'Cinética Química Avançada e Mecanismos de Reação', isChecked: false },
          { id: 'ita-qui-6', title: 'Equilíbrio Iônico, Hidrólise Salina e Solução Tampão', isChecked: false },
          { id: 'ita-qui-7', title: 'Eletroquímica, Equação de Nernst e Eletrólise Quantitativa', isChecked: false },
          { id: 'ita-qui-8', title: 'Mecanismos de Reações Orgânicas (Adição, Substituição nucleofílica Sn1/Sn2)', isChecked: false },
          { id: 'ita-qui-9', title: 'Isomeria Espacial, Conformacional e Óptica', isChecked: false }
        ]
      },
      {
        name: 'Língua Portuguesa, Literatura & Redação',
        weightOrQuestions: '1ª Fase + Redação Dissertativa',
        topics: [
          { id: 'ita-port-1', title: 'Interpretação Textual Crítica e Semiótica', isChecked: false },
          { id: 'ita-port-2', title: 'Obras Literárias Obrigatórias do Edital do ITA', isChecked: false },
          { id: 'ita-port-3', title: 'Sintaxe e Figuras de Linguagem', isChecked: false },
          { id: 'ita-port-4', title: 'Redação Dissertativa de Alta Densidade Argumentativa', isChecked: false }
        ]
      },
      {
        name: 'Língua Inglesa',
        weightOrQuestions: '1ª Fase (Caráter Eliminatório)',
        topics: [
          { id: 'ita-ing-1', title: 'Interpretação de Textos Científicos e Artigos em Inglês', isChecked: false },
          { id: 'ita-ing-2', title: 'Gramática Aplicada e Vocabulário Técnico', isChecked: false }
        ]
      }
    ],
    tips: 'O vestibular do ITA é reconhecido pela profundidade conceitual em Exatas. Não memorize fórmulas sem saber demonstrá-las. A prova valoriza raciocínio elegante e rigor matemático.'
  },
  {
    id: 'espcex',
    name: 'EsPCEx',
    fullName: 'Escola Preparatória de Cadetes do Exército',
    institution: 'Exército Brasileiro (EB)',
    badgeColor: 'from-amber-600 to-yellow-500',
    targetCareer: 'Oficial Combatente do Exército (AMAN)',
    officialEditalUrl: 'https://espcex.eb.mil.br/index.php/concurso',
    requirements: {
      age: 'Ter no mínimo 17 e no máximo 22 anos (completados até 31 de dezembro do ano da matrícula)',
      education: 'Ensino Médio completo ou cursando o 3º ano',
      height: 'Mínimo de 1,60m para homens (1,57m com até 16 anos) e 1,55m para mulheres',
      maritalStatus: 'Não ter filhos ou dependentes e não ser casado ou ter união estável',
      other: [
        'Ser brasileiro nato',
        'Estar em dia com as obrigações militares e eleitorais',
        'Possuir aptidão física e idoneidade moral'
      ]
    },
    stages: [
      '1ª Etapa: Exame Intelectual (2 dias de provas escritas)',
      '2ª Etapa: Inspeção de Saúde (IS)',
      '3ª Etapa: Exame de Aptidão Física (EAF)',
      '4ª Etapa: Avaliação Psicológica (AP)',
      '5ª Etapa: Validação Documental e Heteroidentificação'
    ],
    subjects: [
      {
        name: 'Matemática',
        weightOrQuestions: '20 questões (1º Dia)',
        topics: [
          { id: 'esp-mat-1', title: 'Teoria dos Conjuntos e Funções', isChecked: true },
          { id: 'esp-mat-2', title: 'Função Afim e Quadrática (Gráficos e Vértice)', isChecked: true },
          { id: 'esp-mat-3', title: 'Função Modular, Exponencial e Logarítmica', isChecked: false },
          { id: 'esp-mat-4', title: 'Progressões (PA e PG)', isChecked: true },
          { id: 'esp-mat-5', title: 'Matrizes, Determinantes e Sistemas Lineares', isChecked: false },
          { id: 'esp-mat-6', title: 'Trigonometria no Triângulo e Círculo Trigonométrico', isChecked: false },
          { id: 'esp-mat-7', title: 'Geometria Plana (Áreas, Semelhança, Relações Métricas)', isChecked: true },
          { id: 'esp-mat-8', title: 'Geometria Espacial (Prismas, Pirâmides, Cilindros, Esferas)', isChecked: false },
          { id: 'esp-mat-9', title: 'Geometria Analítica (Reta, Circunferência e Cônicas)', isChecked: false },
          { id: 'esp-mat-10', title: 'Polinômios e Equações Algébricas', isChecked: false },
          { id: 'esp-mat-11', title: 'Análise Combinatória e Probabilidade', isChecked: false }
        ]
      },
      {
        name: 'Física',
        weightOrQuestions: '12 questões (2º Dia)',
        topics: [
          { id: 'esp-fis-1', title: 'Cinemática Escalar e Vetorial', isChecked: true },
          { id: 'esp-fis-2', title: 'Dinâmica: Leis de Newton, Atrito e Força Elástica', isChecked: true },
          { id: 'esp-fis-3', title: 'Trabalho, Potência, Rendimento e Energia Mecânica', isChecked: true },
          { id: 'esp-fis-4', title: 'Impulso, Quantidade de Movimento e Colisões', isChecked: false },
          { id: 'esp-fis-5', title: 'Estática do Ponto Material e do Corpo Extenso', isChecked: false },
          { id: 'esp-fis-6', title: 'Hidrostática (Stevin, Pascal e Arquimedes)', isChecked: true },
          { id: 'esp-fis-7', title: 'Termologia: Calorimetria e Dilatação', isChecked: true },
          { id: 'esp-fis-8', title: 'Termodinâmica (1ª e 2ª Leis, Ciclo de Carnot)', isChecked: false },
          { id: 'esp-fis-9', title: 'Óptica Geométrica e Ondulatória', isChecked: false },
          { id: 'esp-fis-10', title: 'Eletrostática (Coulomb e Campo Elétrico)', isChecked: false },
          { id: 'esp-fis-11', title: 'Eletrodinâmica (Leis de Ohm, Circuitos e Potência)', isChecked: true }
        ]
      },
      {
        name: 'Química',
        weightOrQuestions: '12 questões (2º Dia)',
        topics: [
          { id: 'esp-qui-1', title: 'Matéria, Estados Físicos e Separação de Misturas', isChecked: true },
          { id: 'esp-qui-2', title: 'Estrutura Atômica, Distribuição Eletrônica e Tabela Periódica', isChecked: true },
          { id: 'esp-qui-3', title: 'Ligações Químicas, Geometria e Forças Intermoleculares', isChecked: true },
          { id: 'esp-qui-4', title: 'Funções Inorgânicas (Ácidos, Bases, Sais e Óxidos)', isChecked: false },
          { id: 'esp-qui-5', title: 'Cálculo Estequiométrico e Leis Ponderais', isChecked: false },
          { id: 'esp-qui-6', title: 'Soluções e Concentrações', isChecked: false },
          { id: 'esp-qui-7', title: 'Termoquímica (Entalpia e Lei de Hess)', isChecked: false },
          { id: 'esp-qui-8', title: 'Cinética e Equilíbrio Químico', isChecked: false },
          { id: 'esp-qui-9', title: 'Eletroquímica (Pilhas e Eletrólise)', isChecked: false },
          { id: 'esp-qui-10', title: 'Química Orgânica (Cadeias, Funções, Isomeria e Reações)', isChecked: false }
        ]
      },
      {
        name: 'Português & Redação',
        weightOrQuestions: '20 questões + Redação (1º Dia)',
        topics: [
          { id: 'esp-port-1', title: 'Compreensão e Interpretação de Textos', isChecked: true },
          { id: 'esp-port-2', title: 'Fonética, Ortografia e Acentuação Gráfica', isChecked: true },
          { id: 'esp-port-3', title: 'Morfologia (Classes Gramaticais)', isChecked: true },
          { id: 'esp-port-4', title: 'Sintaxe do Período Simples e Composto', isChecked: false },
          { id: 'esp-port-5', title: 'Concordância Nominal e Verbal', isChecked: false },
          { id: 'esp-port-6', title: 'Regência Nominal, Verbal e Crase', isChecked: false },
          { id: 'esp-port-7', title: 'Pontuação (Uso da Vírgula)', isChecked: true },
          { id: 'esp-port-8', title: 'Literatura Brasileira (Das Origens ao Modernismo)', isChecked: false },
          { id: 'esp-port-9', title: 'Redação Dissertativa-Argumentativa Modelo Militar', isChecked: true }
        ]
      },
      {
        name: 'História & Geografia',
        weightOrQuestions: '12 questões História + 12 Geografia (2º Dia)',
        topics: [
          { id: 'esp-hg-1', title: 'Brasil Colônia (Economia, Sociedade e Expansão)', isChecked: true },
          { id: 'esp-hg-2', title: 'Brasil Império (Primeiro Reinado, Regências e Segundo Reinado)', isChecked: true },
          { id: 'esp-hg-3', title: 'Brasil República (República Velha, Era Vargas, Ditadura Militar)', isChecked: false },
          { id: 'esp-hg-4', title: 'História Geral: Grandes Guerras e Guerra Fria', isChecked: false },
          { id: 'esp-hg-5', title: 'Geografia do Brasil: Relevo, Clima, Vegetação e Hidrografia', isChecked: true },
          { id: 'esp-hg-6', title: 'Geografia Econômica: Agropecuária, Indústria e Energia', isChecked: false },
          { id: 'esp-hg-7', title: 'Demografia e Urbanização Brasileira', isChecked: true }
        ]
      },
      {
        name: 'Inglês',
        weightOrQuestions: '12 questões (1º Dia)',
        topics: [
          { id: 'esp-ing-1', title: 'Reading Comprehension', isChecked: true },
          { id: 'esp-ing-2', title: 'Verb Tenses and Modals', isChecked: true },
          { id: 'esp-ing-3', title: 'Pronouns, Adjectives and Conjunctions', isChecked: false }
        ]
      }
    ],
    tips: 'A EsPCEx exige alto nível em Matemática e Português/Redação (caráter eliminatório rigoroso). Mantenha rotina de 4h a 6h líquidas diárias e resolva as provas anteriores dos últimos 10 anos.'
  },
  {
    id: 'esa',
    name: 'ESA',
    fullName: 'Escola de Sargentos das Armas',
    institution: 'Exército Brasileiro (EB)',
    badgeColor: 'from-emerald-700 to-green-600',
    targetCareer: 'Sargento de Carreira das Armas (Infantaria, Cavalaria, Artilharia, Engenharia, Comunicações)',
    officialEditalUrl: 'https://concursocfgs.esa.eb.mil.br/',
    requirements: {
      age: 'Ter no mínimo 17 e no máximo 24 anos para a área Geral (26 anos para Música e Saúde)',
      education: 'Ensino Médio completo',
      height: '1,60m para homens e 1,55m para mulheres',
      maritalStatus: 'Não ter filhos ou dependentes e não ser casado ou em união estável',
      other: ['Brasileiro nato ou naturalizado', 'Aptidão física comprovada em TAF']
    },
    stages: [
      '1ª Etapa: Exame Intelectual (50 questões objetivas + Redação)',
      '2ª Etapa: Validação de Títulos (se aplicável)',
      '3ª Etapa: Exame de Aptidão Física (EAF)',
      '4ª Etapa: Inspeção de Saúde (IS)',
      '5ª Etapa: Exame Psicológico'
    ],
    subjects: [
      {
        name: 'Matemática',
        weightOrQuestions: '14 questões (Peso Alto)',
        topics: [
          { id: 'esa-mat-1', title: 'Aritmética e Conjuntos Numéricos', isChecked: true },
          { id: 'esa-mat-2', title: 'Função de 1º e 2º Graus', isChecked: true },
          { id: 'esa-mat-3', title: 'Exponencial e Logaritmo', isChecked: false },
          { id: 'esa-mat-4', title: 'Progressões (PA e PG)', isChecked: true },
          { id: 'esa-mat-5', title: 'Geometria Plana (Áreas e Teorema de Pitágoras)', isChecked: true },
          { id: 'esa-mat-6', title: 'Geometria Espacial Básica', isChecked: false },
          { id: 'esa-mat-7', title: 'Trigonometria Básica', isChecked: false },
          { id: 'esa-mat-8', title: 'Análise Combinatória e Probabilidade', isChecked: false }
        ]
      },
      {
        name: 'Português & Literatura',
        weightOrQuestions: '14 questões + Redação',
        topics: [
          { id: 'esa-port-1', title: 'Interpretação e Compreensão de Texto', isChecked: true },
          { id: 'esa-port-2', title: 'Classes Gramaticais e Estrutura de Palavras', isChecked: true },
          { id: 'esa-port-3', title: 'Sintaxe: Termos da Oração', isChecked: false },
          { id: 'esa-port-4', title: 'Concordância e Regência', isChecked: false },
          { id: 'esa-port-5', title: 'Pontuação e Crase', isChecked: true },
          { id: 'esa-port-6', title: 'Literatura Brasileira (Tópicos do Edital)', isChecked: false }
        ]
      },
      {
        name: 'História e Geografia do Brasil',
        weightOrQuestions: '12 questões (6 História + 6 Geografia)',
        topics: [
          { id: 'esa-hg-1', title: 'Expansão Marítima e Colonização Portuguesa', isChecked: true },
          { id: 'esa-hg-2', title: 'Processo de Independência e Primeiro Reinado', isChecked: true },
          { id: 'esa-hg-3', title: 'Segundo Reinado e Guerra do Paraguai', isChecked: false },
          { id: 'esa-hg-4', title: 'Proclamação da República e Era Vargas', isChecked: false },
          { id: 'esa-hg-5', title: 'Espaço Natural Brasileiro (Clima, Relevo, Vegetação)', isChecked: true },
          { id: 'esa-hg-6', title: 'Urbanização, Migrações e População', isChecked: true }
        ]
      },
      {
        name: 'Inglês',
        weightOrQuestions: '10 questões',
        topics: [
          { id: 'esa-ing-1', title: 'Leitura e Vocabulário Textual', isChecked: true },
          { id: 'esa-ing-2', title: 'Estruturas Gramaticais Básicas e Intermediárias', isChecked: false }
        ]
      }
    ],
    tips: 'A prova da ESA é extremamente concorrida e direta. Não perca pontos em questões conceituais de Matemática e garanta nota superior a 7,0 na Redação.'
  },
  {
    id: 'eear',
    name: 'EEAR',
    fullName: 'Escola de Especialistas de Aeronáutica',
    institution: 'Força Aérea Brasileira (FAB)',
    badgeColor: 'from-sky-700 to-blue-500',
    targetCareer: 'Sargento Especialista da FAB (BCT - Controle de Tráfego Aéreo, Mecânica, Eletrônica, etc.)',
    officialEditalUrl: 'https://ingresso.eear.fab.mil.br/',
    requirements: {
      age: 'Não ter menos de 17 nem completar 25 anos de idade até 31 de dezembro do ano da matrícula',
      education: 'Ensino Médio completo',
      height: '1,60m para homens e 1,55m para mulheres (BCT tem critérios específicos de acuidade visual)',
      maritalStatus: 'Permite candidatos casados ou solteiros',
      other: ['Brasileiro nato ou naturalizado', 'Aptidão física e psicotécnica']
    },
    stages: [
      '1ª Etapa: Prova Escrita (96 questões: Língua Portuguesa, Língua Inglesa, Matemática e Física)',
      '2ª Etapa: Inspeção de Saúde (INSPSAU)',
      '3ª Etapa: Exame de Aptidão Psicológica (EAP)',
      '4ª Etapa: Teste de Avaliação do Condicionamento Físico (TACF)',
      '5ª Etapa: Validação Documental'
    ],
    subjects: [
      {
        name: 'Matemática',
        weightOrQuestions: '24 questões',
        topics: [
          { id: 'eear-mat-1', title: 'Conjuntos e Funções Afim e Quadrática', isChecked: true },
          { id: 'eear-mat-2', title: 'Trigonometria e Relações Fundamentais', isChecked: false },
          { id: 'eear-mat-3', title: 'Geometria Plana e Espacial', isChecked: true },
          { id: 'eear-mat-4', title: 'Matrizes, Determinantes e Sistemas', isChecked: false },
          { id: 'eear-mat-5', title: 'Geometria Analítica (Ponto, Reta e Circunferência)', isChecked: false },
          { id: 'eear-mat-6', title: 'Polinômios e Números Complexos', isChecked: false }
        ]
      },
      {
        name: 'Física',
        weightOrQuestions: '24 questões',
        topics: [
          { id: 'eear-fis-1', title: 'Cinemática Escalar e Vetorial', isChecked: true },
          { id: 'eear-fis-2', title: 'Dinâmica e Leis de Newton', isChecked: true },
          { id: 'eear-fis-3', title: 'Trabalho e Energia', isChecked: false },
          { id: 'eear-fis-4', title: 'Termologia e Ondulatória', isChecked: true },
          { id: 'eear-fis-5', title: 'Eletrostática e Circuitos de Eletrodinâmica', isChecked: true },
          { id: 'eear-fis-6', title: 'Magnetismo e Indução Eletromagnética', isChecked: false }
        ]
      },
      {
        name: 'Português',
        weightOrQuestions: '24 questões',
        topics: [
          { id: 'eear-port-1', title: 'Interpretação e Tipologia Textual', isChecked: true },
          { id: 'eear-port-2', title: 'Morfossintaxe Completa', isChecked: false },
          { id: 'eear-port-3', title: 'Crase, Regência e Concordância', isChecked: false },
          { id: 'eear-port-4', title: 'Pontuação e Ortografia', isChecked: true }
        ]
      },
      {
        name: 'Inglês',
        weightOrQuestions: '24 questões (Nível Básico ou Avançado para BCT)',
        topics: [
          { id: 'eear-ing-1', title: 'Grammar and Syntax in Context', isChecked: true },
          { id: 'eear-ing-2', title: 'Reading Comprehension', isChecked: true }
        ]
      }
    ],
    tips: 'A prova da EEAR é veloz (96 questões em poucas horas). Pratique velocidade e agilidade mental nas contas de Física e Matemática sem calculadora.'
  },
  {
    id: 'afa',
    name: 'AFA',
    fullName: 'Academia da Força Aérea',
    institution: 'Força Aérea Brasileira (FAB)',
    badgeColor: 'from-blue-800 to-indigo-600',
    targetCareer: 'Oficial Aviador, Intendente ou de Infantaria da Aeronáutica',
    officialEditalUrl: 'https://www.fab.mil.br/afa/',
    requirements: {
      age: 'Não ter menos de 17 nem completar 23 anos até 31 de dezembro do ano da matrícula',
      education: 'Ensino Médio completo',
      height: 'Critérios rígidos para aviadores (antropometria de cabine: sentado e em pé)',
      maritalStatus: 'Não ser casado nem ter união estável, não ter filhos ou dependentes',
      other: ['Brasileiro nato', 'Aptidão médica com exame oftalmológico especial (TAPMIL)']
    },
    stages: [
      '1ª Etapa: Prova Escrita (Língua Portuguesa, Física, Matemática, Língua Inglesa e Redação)',
      '2ª Etapa: Inspeção de Saúde (INSPSAU)',
      '3ª Etapa: Exame de Aptidão Psicológica (EAP)',
      '4ª Etapa: Teste de Avaliação do Condicionamento Físico (TACF)',
      '5ª Etapa: Teste de Aptidão à Pilotagem Militar (apenas Aviadores)'
    ],
    subjects: [
      {
        name: 'Matemática',
        weightOrQuestions: '16 questões de alta complexidade',
        topics: [
          { id: 'afa-mat-1', title: 'Álgebra Avançada e Polinômios', isChecked: false },
          { id: 'afa-mat-2', title: 'Trigonometria Aprofundada', isChecked: false },
          { id: 'afa-mat-3', title: 'Geometria Analítica e Cônicas', isChecked: false },
          { id: 'afa-mat-4', title: 'Geometria Plana e Espacial', isChecked: true },
          { id: 'afa-mat-5', title: 'Análise Combinatória e Probabilidade Avançada', isChecked: false }
        ]
      },
      {
        name: 'Física',
        weightOrQuestions: '16 questões de alto rigor',
        topics: [
          { id: 'afa-fis-1', title: 'Mecânica Clássica Aprofundada', isChecked: true },
          { id: 'afa-fis-2', title: 'Termodinâmica e Ondulatória', isChecked: false },
          { id: 'afa-fis-3', title: 'Eletromagnetismo Completo', isChecked: false }
        ]
      },
      {
        name: 'Língua Portuguesa & Redação',
        weightOrQuestions: '16 questões + Redação Dissertativa',
        topics: [
          { id: 'afa-port-1', title: 'Interpretação Textual Crítica', isChecked: true },
          { id: 'afa-port-2', title: 'Gramática Aplicada ao Texto', isChecked: false },
          { id: 'afa-port-3', title: 'Redação Nota Máxima', isChecked: true }
        ]
      },
      {
        name: 'Língua Inglesa',
        weightOrQuestions: '16 questões',
        topics: [
          { id: 'afa-ing-1', title: 'Interpretação de Artigos e Textos Complexos', isChecked: true },
          { id: 'afa-ing-2', title: 'Gramática Avançada', isChecked: false }
        ]
      }
    ],
    tips: 'A AFA possui um dos exames intelectuais mais exigentes do país junto com a Escola Naval e IME/ITA. Foco rigoroso nas questões discursivas e objetivas com demonstrações.'
  },
  {
    id: 'escolanaval',
    name: 'Escola Naval',
    fullName: 'Escola Naval da Marinha do Brasil',
    institution: 'Marinha do Brasil (MB)',
    badgeColor: 'from-blue-950 to-cyan-700',
    targetCareer: 'Oficial da Marinha (Corpo da Armada, Fuzileiros Navais ou Intendentes)',
    officialEditalUrl: 'https://www.marinha.mil.br/ensino/',
    requirements: {
      age: 'Ter 18 anos completos e menos de 23 anos até 30 de junho do ano da matrícula',
      education: 'Ensino Médio completo',
      height: '1,54m a 2,00m para ambos os sexos',
      maritalStatus: 'Não ser casado ou ter união estável e não ter dependentes',
      other: ['Brasileiro nato', 'Aptidão física com prova de Natação no TAF militar']
    },
    stages: [
      '1ª Etapa: Prova Escrita 1º Dia (Matemática e Inglês - 40 questões)',
      '2ª Etapa: Prova Escrita 2º Dia (Física e Português + Redação - 40 questões)',
      '3ª Etapa: Inspeção de Saúde',
      '4ª Etapa: Teste de Aptidão Física (inclui corrida e natação)',
      '5ª Etapa: Avaliação Psicológica'
    ],
    subjects: [
      {
        name: 'Matemática (com Cálculo Diferencial e Integral básico)',
        weightOrQuestions: '20 questões (1º Dia)',
        topics: [
          { id: 'en-mat-1', title: 'Álgebra, Geometria e Trigonometria', isChecked: false },
          { id: 'en-mat-2', title: 'Noções de Limites e Derivadas', isChecked: false },
          { id: 'en-mat-3', title: 'Geometria Analítica no Espaço', isChecked: false }
        ]
      },
      {
        name: 'Física',
        weightOrQuestions: '20 questões (2º Dia)',
        topics: [
          { id: 'en-fis-1', title: 'Mecânica e Gravitação Universal', isChecked: true },
          { id: 'en-fis-2', title: 'Eletromagnetismo Avançado', isChecked: false }
        ]
      },
      {
        name: 'Português & Redação',
        weightOrQuestions: '20 questões + Redação',
        topics: [
          { id: 'en-port-1', title: 'Gramática Normativa e Semântica', isChecked: true },
          { id: 'en-port-2', title: 'Redação Dissertativa', isChecked: true }
        ]
      },
      {
        name: 'Inglês',
        weightOrQuestions: '20 questões',
        topics: [
          { id: 'en-ing-1', title: 'Compreensão de Texto Técnico e Geral', isChecked: true }
        ]
      }
    ],
    tips: 'A Escola Naval inclui tópicos de Cálculo no programa de Matemática. Treine natação com antecedência para não ser reprovado no TAF da Marinha.'
  },
  {
    id: 'efomm',
    name: 'EFOMM',
    fullName: 'Escola de Formação de Oficiais da Marinha Mercante',
    institution: 'Marinha do Brasil (CIAGA / CIABA)',
    badgeColor: 'from-teal-800 to-emerald-600',
    targetCareer: 'Oficial da Marinha Mercante (Náutica ou Máquinas)',
    officialEditalUrl: 'https://www.marinha.mil.br/ciaga/concurso-efomm',
    requirements: {
      age: 'Mínimo de 17 e máximo de 23 anos em 1º de janeiro do ano de início do curso',
      education: 'Ensino Médio completo',
      height: 'Mínimo de 1,54m e máximo de 2,00m',
      maritalStatus: 'Não ter filhos ou dependentes e não ser casado',
      other: ['Brasileiro nato (ambos os sexos)', 'Aptidão física com prova de Natação de 50 metros']
    },
    stages: [
      '1ª Etapa: Exame de Conhecimentos (Português, Redação e Inglês no 1º Dia; Matemática e Física no 2º Dia)',
      '2ª Etapa: Seleção Psicofísica (com exames médicos e toxicológico)',
      '3ª Etapa: Teste de Suficiência Física (Natação e Corrida)',
      '4ª Etapa: Período de Adaptação e Matrícula'
    ],
    subjects: [
      {
        name: 'Matemática',
        weightOrQuestions: '20 questões (2º Dia)',
        topics: [
          { id: 'ef-mat-1', title: 'Funções, Logaritmos e Exponenciais', isChecked: true },
          { id: 'ef-mat-2', title: 'Trigonometria e Geometria Analítica', isChecked: false },
          { id: 'ef-mat-3', title: 'Geometria Plana e Espacial', isChecked: true },
          { id: 'ef-mat-4', title: 'Matrizes e Sistemas Lineares', isChecked: false }
        ]
      },
      {
        name: 'Física',
        weightOrQuestions: '20 questões (2º Dia)',
        topics: [
          { id: 'ef-fis-1', title: 'Mecânica, Estática e Hidrostática', isChecked: true },
          { id: 'ef-fis-2', title: 'Termologia e Óptica', isChecked: true },
          { id: 'ef-fis-3', title: 'Eletromagnetismo', isChecked: false }
        ]
      },
      {
        name: 'Português & Redação',
        weightOrQuestions: '20 questões + Redação (1º Dia)',
        topics: [
          { id: 'ef-port-1', title: 'Língua Portuguesa e Interpretação', isChecked: true },
          { id: 'ef-port-2', title: 'Redação Dissertativa', isChecked: true }
        ]
      },
      {
        name: 'Inglês',
        weightOrQuestions: '20 questões (1º Dia)',
        topics: [
          { id: 'ef-ing-1', title: 'Grammar, Phrasal Verbs and Reading', isChecked: true }
        ]
      }
    ],
    tips: 'Excelente plano de carreira na marinha mercante com alta remuneração inicial. Foco absoluto na prova de Inglês (nível intermediário-avançado).'
  }
];
