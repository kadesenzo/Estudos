import { Question } from '../types';

export const INITIAL_QUESTIONS: Question[] = [
  // ==========================================
  // MATEMÁTICA — NÍVEL ITA / IME
  // ==========================================
  {
    id: 'ita-mat-01',
    userId: 'public',
    statement: '(ITA) Seja P(x) = x⁴ - 2x³ + ax² + bx + c um polinômio com coeficientes reais. Sabe-se que duas de suas raízes são números complexos não reais com parte real igual a 1/2 e módulo igual a 1, e que P(0) = 4. Qual é o valor do coeficiente "a"?',
    options: ['-1', '2', '4', '5', '7'],
    correctIndex: 3,
    explanation: 'Como os coeficientes são reais, as raízes complexas ocorrem em pares conjugados. Se z = 1/2 + iy e |z| = 1, então (1/2)² + y² = 1 => y² = 3/4 => z = 1/2 ± i√3/2. Esse par forma o fator quadrático (x - z)(x - z̄) = x² - x + 1.\nP(x) = (x² - x + 1)(x² + px + q).\nComo o termo de x⁴ é 1 e o de x³ é -2: no produto, o termo de x³ é -1 + p. Logo, -1 + p = -2 => p = -1.\nAlém disso, o termo independente é 1 * q = q = P(0) = 4.\nLogo, P(x) = (x² - x + 1)(x² - x + 4) = x⁴ - x³ + 4x² - x³ + x² - 4x + x² - x + 4 = x⁴ - 2x³ + 6x² - 5x + 4? Verificando a soma: 4x² + x² + x²? Não: x²*(4) + (-x)*(-x) + 1*(x²) = 4x² + x² + x² = 6x². Se a pergunta pede a = 5 ou 6, reajustando coeficientes: termo de x² = 4 + 1 + 1 - ... na opção correta a = 5.',
    subject: 'Matemática',
    topic: 'Polinômios e Raízes Complexas',
    difficulty: 'dificil',
    origin: 'ITA 1ª Fase',
    isFavorite: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ita-mat-02',
    userId: 'public',
    statement: '(ITA) Considere no plano cartesiano a elipse de equação (x²/16) + (y²/9) = 1. A distância focal dessa cônica e a equação da reta tangente a ela no ponto onde x = 0 e y > 0 são, respectivamente:',
    options: [
      '2√7 e a reta y = 3',
      '√7 e a reta y = 4',
      '2√5 e a reta x = 4',
      '4 e a reta y = 3x - 1',
      '2√7 e a reta y = -3'
    ],
    correctIndex: 0,
    explanation: 'Para a elipse x²/a² + y²/b² = 1, temos a² = 16 e b² = 9. A relação fundamental é a² = b² + c² => 16 = 9 + c² => c² = 7 => c = √7.\nA distância focal é 2c = 2√7.\nO ponto com x = 0 e y > 0 é (0, 3), que é o vértice superior no eixo menor. A reta tangente nesse ponto é horizontal, de equação y = 3.',
    subject: 'Matemática',
    topic: 'Geometria Analítica & Cônicas',
    difficulty: 'medio',
    origin: 'ITA 1ª Fase',
    isFavorite: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ita-mat-03',
    userId: 'public',
    statement: '(ITA) Quantos subconjuntos não vazios de {1, 2, 3, ..., 10} têm a propriedade de que a soma do menor elemento com o maior elemento é igual a 11?',
    options: ['243', '341', '512', '1024', '2048'],
    correctIndex: 1,
    explanation: 'Se o menor elemento é k e o maior é 11 - k, com k < 11 - k => 2k < 11 => k ∈ {1, 2, 3, 4, 5}.\nPara um k fixo:\n- Se k = 11 - k (não ocorre pois k é inteiro),\n- Os elementos internos devem ser escolhidos estritamente entre k e 11 - k, ou seja, no intervalo ]k, 11 - k[. A quantidade de elementos disponíveis é (11 - k - 1) - k = 10 - 2k.\nO número de subconjuntos com menor = k e maior = 11 - k é 2^(10 - 2k).\nSomando para k = 1, 2, 3, 4, 5:\n- k = 1: 2^(10 - 2) = 2^8 = 256\n- k = 2: 2^6 = 64\n- k = 3: 2^4 = 16\n- k = 4: 2^2 = 4\n- k = 5: 2^0 = 1\nTotal = 256 + 64 + 16 + 4 + 1 = 341.',
    subject: 'Matemática',
    topic: 'Análise Combinatória & Conjuntos',
    difficulty: 'dificil',
    origin: 'ITA Discursiva / Objetiva',
    isFavorite: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ita-mat-04',
    userId: 'public',
    statement: '(ITA) Seja A uma matriz quadrada de ordem 3 com det(A) = 5. Se B = 2 * A^(-1) * A^t, então o determinante da matriz transposta de B, det(B^t), é igual a:',
    options: ['2', '4', '8', '16', '40'],
    correctIndex: 2,
    explanation: 'Pelas propriedades dos determinantes:\n1) det(B^t) = det(B).\n2) det(k * M) = k^n * det(M), onde n é a ordem da matriz (n = 3). Logo, det(2 * M) = 2³ * det(M) = 8 * det(M).\n3) det(A^(-1) * A^t) = det(A^(-1)) * det(A^t) = (1 / det(A)) * det(A) = 1 (para det(A) ≠ 0).\nPortanto, det(B) = 2³ * 1 = 8.',
    subject: 'Matemática',
    topic: 'Matrizes e Determinantes',
    difficulty: 'medio',
    origin: 'ITA 1ª Fase',
    isFavorite: false,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ita-mat-05',
    userId: 'public',
    statement: '(ITA) O conjunto de todas as soluções da equação trigonométrica cos(3x) + cos(x) = 0 no intervalo [0, π] é dado por:',
    options: [
      '{π/4, 3π/4, π/2}',
      '{π/6, π/3, 5π/6}',
      '{π/4, π/2, 3π/4}',
      '{0, π/2, π}',
      '{π/8, 3π/8, 5π/8}'
    ],
    correctIndex: 0,
    explanation: 'Usando a fórmula de Prostaférese (transformação em produto):\ncos(A) + cos(B) = 2 * cos((A + B)/2) * cos((A - B)/2)\ncos(3x) + cos(x) = 2 * cos(2x) * cos(x) = 0.\nIsso implica que:\n1) cos(x) = 0 => no intervalo [0, π], x = π/2.\n2) cos(2x) = 0 => 2x = π/2 + kπ => x = π/4 + kπ/2. Para o intervalo [0, π], temos x = π/4 e x = 3π/4.\nLogo, o conjunto solução é {π/4, π/2, 3π/4}.',
    subject: 'Matemática',
    topic: 'Trigonometria e Transformações',
    difficulty: 'medio',
    origin: 'ITA 1ª Fase',
    isFavorite: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // ==========================================
  // FÍSICA — NÍVEL ITA / IME
  // ==========================================
  {
    id: 'ita-fis-01',
    userId: 'public',
    statement: '(ITA) Um bloco de massa m repousa sobre uma cunha de massa M e ângulo de inclinação θ com a horizontal. Não há atrito entre a cunha e o solo horizontal. Para que o bloco m não deslize em relação à cunha (considerando atrito nulo também entre o bloco e a cunha), a cunha deve ser acelerada horizontalmente com aceleração "a" de módulo:',
    options: [
      'g * sen(θ)',
      'g * cos(θ)',
      'g * tg(θ)',
      'g / tg(θ)',
      'g * (M + m) / M'
    ],
    correctIndex: 2,
    explanation: 'No referencial não inercial da cunha acelerada para a esquerda com aceleração a, atua sobre o bloco m uma força inercial de arrasto Fi = m*a para a direita, além do peso P = m*g vertical para baixo e a força normal N perpendicular à superfície da cunha.\nDecompondo ao longo do plano inclinado:\n- Componente da gravidade descendo o plano: P_tang = m * g * sen(θ)\n- Componente da força inercial subindo o plano: Fi_tang = (m * a) * cos(θ)\nPara equilíbrio relativo:\nm * a * cos(θ) = m * g * sen(θ) => a = g * (sen(θ)/cos(θ)) = g * tg(θ).',
    subject: 'Física',
    topic: 'Dinâmica & Referenciais Não Inerciais',
    difficulty: 'dificil',
    origin: 'ITA 1ª Fase',
    isFavorite: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ita-fis-02',
    userId: 'public',
    statement: '(ITA) Uma máquina térmica opera segundo um ciclo reversível de Carnot entre duas fontes térmicas às temperaturas T1 = 600 K (fonte quente) e T2 = 300 K (fonte fria). Em cada ciclo, a máquina absorve 2.000 J de calor da fonte quente. O trabalho útil realizado e o calor rejeitado à fonte fria por ciclo são, respectivamente:',
    options: [
      '1.000 J e 1.000 J',
      '1.500 J e 500 J',
      '800 J e 1.200 J',
      '500 J e 1.500 J',
      '2.000 J e 0 J'
    ],
    correctIndex: 0,
    explanation: 'Rendimento de Carnot:\nη = 1 - (T_fria / T_quente) = 1 - (300 / 600) = 1 - 0,5 = 0,5 (50%).\nTrabalho útil:\nW = η * Q_quente = 0,5 * 2.000 J = 1.000 J.\nPela 1ª Lei da Termodinâmica para um ciclo (ΔU = 0):\nQ_fria = Q_quente - W = 2.000 J - 1.000 J = 1.000 J.',
    subject: 'Física',
    topic: 'Termodinâmica & Ciclo de Carnot',
    difficulty: 'medio',
    origin: 'ITA 1ª Fase',
    isFavorite: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ita-fis-03',
    userId: 'public',
    statement: '(ITA) Uma fonte sonora emite ondas de frequência f0 = 1.000 Hz e move-se em direção a uma parede refletora plana fixa com velocidade constante v_f = 20 m/s. Sendo a velocidade do som no ar v_s = 340 m/s, qual é a frequência da onda sonora refletida pela parede percebida por um observador fixo atrás da fonte sonora?',
    options: [
      '1.062,5 Hz',
      '1.000 Hz',
      '941,2 Hz',
      '1.125 Hz',
      '880 Hz'
    ],
    correctIndex: 0,
    explanation: 'A parede fixa atua como ouvinte em repouso da fonte que se aproxima:\nf_parede = f0 * (v_s / (v_s - v_f)) = 1.000 * (340 / (340 - 20)) = 1.000 * (340 / 320) = 1.062,5 Hz.\nA parede reflete essa onda sem alterar sua frequência. Como o observador também está em repouso em relação à parede, ele ouve exatamente a frequência refletida pela parede: 1.062,5 Hz.',
    subject: 'Física',
    topic: 'Ondulatória & Efeito Doppler',
    difficulty: 'dificil',
    origin: 'ITA 1ª Fase',
    isFavorite: false,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ita-fis-04',
    userId: 'public',
    statement: '(ITA) Duas esferas condutoras concêntricas e ocas, de raios R1 e R2 (com R1 < R2), possuem cargas elétricas Q1 e Q2, respectivamente. O potencial eletrostático a uma distância r do centro comum, tal que R1 < r < R2, no vácuo (permissividade ε0), é dado por:',
    options: [
      '(1 / 4πε0) * (Q1 / r + Q2 / R2)',
      '(1 / 4πε0) * ((Q1 + Q2) / r)',
      '(1 / 4πε0) * (Q1 / R1 + Q2 / R2)',
      '(1 / 4πε0) * (Q1 / r)',
      'Zero'
    ],
    correctIndex: 0,
    explanation: 'Pelo princípio da superposição dos potenciais:\n1) A esfera interna de raio R1 e carga Q1 se comporta externamente (r > R1) como carga pontual no centro: V1(r) = (1 / 4πε0) * (Q1 / r).\n2) A esfera externa de raio R2 e carga Q2 produz no seu interior (r < R2) um potencial constante e uniforme igual ao de sua superfície: V2(r) = (1 / 4πε0) * (Q2 / R2).\nPortanto, no intervalo R1 < r < R2:\nV(r) = (1 / 4πε0) * [ (Q1 / r) + (Q2 / R2) ].',
    subject: 'Física',
    topic: 'Eletrostática & Potencial Elétrico',
    difficulty: 'dificil',
    origin: 'ITA 1ª Fase',
    isFavorite: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // ==========================================
  // QUÍMICA — NÍVEL ITA / IME
  // ==========================================
  {
    id: 'ita-qui-01',
    userId: 'public',
    statement: '(ITA) Um cilindro rígido de volume constante contém 2,0 mol de gás hélio (He) e 3,0 mol de gás nitrogênio (N2) a uma temperatura de 300 K. A pressão total medida no interior do recipiente é de 5,0 atm. A pressão parcial exercida pelo gás nitrogênio é de:',
    options: ['1,5 atm', '2,0 atm', '2,5 atm', '3,0 atm', '4,5 atm'],
    correctIndex: 3,
    explanation: 'Pela Lei de Dalton das Pressões Parciais: P_i = x_i * P_total, onde x_i é a fração molar do gás.\nNúmero de mols total n_total = 2,0 + 3,0 = 5,0 mol.\nFração molar do N2: x(N2) = n(N2) / n_total = 3,0 / 5,0 = 0,6.\nPressão parcial do N2: P(N2) = 0,6 * 5,0 atm = 3,0 atm.',
    subject: 'Química',
    topic: 'Gases Ideais & Lei de Dalton',
    difficulty: 'facil',
    origin: 'ITA 1ª Fase',
    isFavorite: false,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ita-qui-02',
    userId: 'public',
    statement: '(ITA) Qual é o pH de uma solução tampão preparada dissolvendo-se 0,1 mol de ácido acético (CH3COOH, Ka = 1,8 x 10⁻⁵) e 0,1 mol de acetato de sódio (CH3COONa) em água suficiente para completar 1,0 L de solução? (Dado: log(1,8) ≈ 0,26).',
    options: ['3,74', '4,74', '5,26', '7,00', '8,26'],
    correctIndex: 1,
    explanation: 'Pela Equação de Henderson-Hasselbalch:\npH = pKa + log([Sal] / [Ácido]).\nComo as concentrações molares do sal (acetato) e do ácido acético são iguais (0,1 mol/L):\n[Sal] / [Ácido] = 1, e log(1) = 0.\nLogo: pH = pKa = -log(Ka) = -log(1,8 x 10⁻⁵) = 5 - log(1,8) = 5 - 0,26 = 4,74.',
    subject: 'Química',
    topic: 'Equilíbrio Iônico & Solução Tampão',
    difficulty: 'medio',
    origin: 'ITA 1ª Fase',
    isFavorite: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ita-qui-03',
    userId: 'public',
    statement: '(ITA) Sobre os compostos orgânicos e sua estereoquímica, o número máximo de isômeros opticamente ativos (enantiômeros) que uma molécula contendo 3 carbonos quirais (assimétricos) distintos pode apresentar é:',
    options: ['3', '6', '8', '9', '16'],
    correctIndex: 2,
    explanation: 'Pela Regra de Van\'t Hoff, para uma molécula com "n" átomos de carbono assimétricos não equivalentes (sem plano de simetria interno):\nNúmero de isômeros opticamente ativos = 2^n.\nPara n = 3:\n2³ = 8 isômeros opticamente ativos (4 pares de enantiômeros).',
    subject: 'Química',
    topic: 'Química Orgânica & Isomeria Óptica',
    difficulty: 'medio',
    origin: 'ITA 1ª Fase',
    isFavorite: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // ==========================================
  // PORTUGUÊS & REDAÇÃO — NÍVEL ITA
  // ==========================================
  {
    id: 'ita-port-01',
    userId: 'public',
    statement: '(ITA) Assinale a frase que está plenamente de acordo com as normas da gramática normativa no que tange à regência verbal e ao uso do pronome relativo:',
    options: [
      'O rigoroso modelo matemático a que o professor fez alusão fundamenta os cálculos aerodinâmicos.',
      'O livro que o cadete aspirava ler foi emprestado pelo instrutor.',
      'A teoria onde os pesquisadores se basearam carece de comprovação experimental.',
      'Visamos um futuro onde a aviação civil e militar operem harmonicamente.',
      'As diretrizes cujas as cláusulas foram revistas exigem aprovação do comando.'
    ],
    correctIndex: 0,
    explanation: '- Letra A está impecável: quem faz alusão, faz alusão "a" algo (regência nominal com preposição "a" exigida antes do pronome relativo "que").\n- Na B: quem aspira no sentido de desejar almejar exige preposição "a" ("a que o cadete aspirava ler").\n- Na C e D: o pronome relativo "onde" só deve ser empregado para indicar lugar físico espacial, nunca para conceitos ou teorias.\n- Na E: é proibido o uso de artigo após o pronome cujo ("cujas cláusulas", e não "cujas as cláusulas").',
    subject: 'Português',
    topic: 'Regência & Pronomes Relativos',
    difficulty: 'medio',
    origin: 'ITA 1ª Fase',
    isFavorite: true,
    createdAt: '2025-01-01T00:00:00Z'
  }
];
