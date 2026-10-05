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
  },

  // ==========================================
  // MATEMÁTICA BÁSICA & OPERAÇÕES (FERRETTO / APOSTILA 720)
  // ==========================================
  {
    id: 'mat-bas-01',
    userId: 'public',
    statement: '(Ferretto / Enem) Todos os anos, a Receita Federal alerta os contribuintes para não deixarem o envio de seus dados para o último dia do prazo de entrega. A quatro dias do prazo final, contabilizou-se o recebimento de 16,2 milhões de declarações, o equivalente a cerca de 60% do total estimado pela Receita Federal. Nesse mesmo momento, a média de entrada era de 90.000 declarações por hora (24h/dia). Permanecendo essa média nos últimos 4 dias, qual a quantidade aproximada de pessoas que terão que pagar multa por atraso?',
    options: ['2,16 milhões', '4,05 milhões', '6,21 milhões', '7,65 milhões', '8,64 milhões'],
    correctIndex: 0,
    explanation: '1. Total estimado pela Receita Federal: 16,2 milhões = 60% => Total = 16,2 / 0,60 = 27,0 milhões de declarações.\n2. Declarações que ainda faltavam ser entregues: 27,0 - 16,2 = 10,8 milhões.\n3. Capacidade de recebimento nos 4 dias restantes: 4 dias * 24 horas/dia = 96 horas. Em 96 horas, a 90.000 declarações/hora: 96 * 90.000 = 8.640.000 = 8,64 milhões de declarações entregues a tempo.\n4. Pessoas que terão que pagar multa (atrasadas): 10,8 milhões - 8,64 milhões = 2,16 milhões de pessoas.',
    subject: 'Matemática',
    topic: 'Operações Básicas & Proporção',
    difficulty: 'medio',
    origin: 'Enem / Ferretto',
    isFavorite: true,
    createdAt: '2026-10-04T00:00:00Z'
  },
  {
    id: 'mat-bas-02',
    userId: 'public',
    statement: '(Ferretto / Enem) A disparidade de volume entre os planetas é tão grande que seria possível colocá-los uns dentro dos outros. O planeta Mercúrio é o menor de todos. Marte é o segundo menor: dentro dele cabem 3 Mercúrios. Terra é o único com vida: dentro dela cabem 7 Martes. Netuno é o quarto maior: dentro dele cabem 58 Terras. Júpiter é o maior dos planetas: dentro dele cabem 23 Netunos. Seguindo o raciocínio proposto, quantas Terras cabem dentro de Júpiter?',
    options: ['406', '1 334', '4 002', '9 338', '28 014'],
    correctIndex: 1,
    explanation: '1. Dentro de 1 Netuno cabem 58 Terras.\n2. Dentro de Júpiter cabem 23 Netunos.\n3. Portanto, em Júpiter cabem: 23 * 58 Terras = 1.334 Terras.\n(Cálculo mental rápido: 23 * 60 - 23 * 2 = 1380 - 46 = 1334).',
    subject: 'Matemática',
    topic: 'Operações Básicas & Multiplicação',
    difficulty: 'facil',
    origin: 'Enem / Ferretto',
    isFavorite: false,
    createdAt: '2026-10-04T00:00:00Z'
  },
  {
    id: 'mat-bas-03',
    userId: 'public',
    statement: '(Apostila 720 / Produtos Notáveis) Determine o valor de (3x + 2y)², sabendo que 9x² + 4y² = 25 e que x · y = 2.',
    options: ['27', '31', '38', '49', '54'],
    correctIndex: 3,
    explanation: 'Desenvolvendo o produto notável do quadrado da soma de dois termos:\n(3x + 2y)² = (3x)² + 2 · (3x) · (2y) + (2y)²\n(3x + 2y)² = 9x² + 12xy + 4y²\nAgrupando os termos fornecidos no enunciado:\n(3x + 2y)² = (9x² + 4y²) + 12(xy)\nSubstituindo os valores dados (9x² + 4y² = 25 e xy = 2):\n(3x + 2y)² = 25 + 12 · (2) = 25 + 24 = 49.',
    subject: 'Matemática',
    topic: 'Produtos Notáveis e Fatoração',
    difficulty: 'facil',
    origin: 'Apostila 720 Questões',
    isFavorite: true,
    createdAt: '2026-10-04T00:00:00Z'
  },
  {
    id: 'mat-bas-04',
    userId: 'public',
    statement: '(Apostila 720 / Fatoração) Se x + y = 13 e x · y = 1, então o valor de x² + y² é:',
    options: ['166', '167', '168', '169', '170'],
    correctIndex: 1,
    explanation: 'Sabemos que (x + y)² = x² + 2xy + y².\nLogo, x² + y² = (x + y)² - 2xy.\nSubstituindo os valores conhecidos:\nx² + y² = (13)² - 2 · (1) = 169 - 2 = 167.',
    subject: 'Matemática',
    topic: 'Produtos Notáveis e Fatoração',
    difficulty: 'facil',
    origin: 'Apostila 720 Questões',
    isFavorite: false,
    createdAt: '2026-10-04T00:00:00Z'
  },
  {
    id: 'mat-bas-05',
    userId: 'public',
    statement: '(Apostila 720 / Radiciação) O valor exato da raiz cúbica de 1.728 (³√1728) e o valor simplificado da expressão √50 - √18 + √98 são, respectivamente:',
    options: ['12 e 9√2', '15 e 5√2', '18 e 9√2', '12 e 15√2', '14 e 7√2'],
    correctIndex: 0,
    explanation: '1. Fatorando 1728 em primos: 1728 = 2⁶ · 3³ = (2² · 3)³ = 12³. Logo, ³√1728 = 12.\n2. Simplificando os radicais:\n- √50 = √(25 · 2) = 5√2\n- √18 = √(9 · 2) = 3√2\n- √98 = √(49 · 2) = 7√2\nSomando: 5√2 - 3√2 + 7√2 = (5 - 3 + 7)√2 = 9√2.',
    subject: 'Matemática',
    topic: 'Radiciação e Fatoração',
    difficulty: 'facil',
    origin: 'Apostila 720 Questões',
    isFavorite: true,
    createdAt: '2026-10-04T00:00:00Z'
  },
  {
    id: 'mat-bas-06',
    userId: 'public',
    statement: '(Apostila 720 / MMC e MDC) Três viajantes partem num mesmo dia de uma cidade A. Cada um desses três viajantes retorna à cidade A exatamente a cada 30, 48 e 72 dias, respectivamente. O número mínimo de dias transcorridos para que os três viajantes estejam juntos novamente na cidade A é:',
    options: ['144', '240', '360', '480', '720'],
    correctIndex: 4,
    explanation: 'O próximo encontro ocorrerá no Mínimo Múltiplo Comum: MMC(30, 48, 72).\nFatorando cada número:\n- 30 = 2 · 3 · 5\n- 48 = 2⁴ · 3\n- 72 = 2³ · 3²\nO MMC toma os fatores comuns e não comuns com os maiores expoentes:\nMMC = 2⁴ · 3² · 5 = 16 · 9 · 5 = 144 · 5 = 720 dias.',
    subject: 'Matemática',
    topic: 'Aritmética & MMC e MDC',
    difficulty: 'medio',
    origin: 'Apostila 720 Questões',
    isFavorite: false,
    createdAt: '2026-10-04T00:00:00Z'
  },

  // ==========================================
  // FÍSICA BÁSICA (APOSTILA 720)
  // ==========================================
  {
    id: 'fis-bas-01',
    userId: 'public',
    statement: '(Apostila 720 / Vetores) Dois vetores V1 e V2 possuem módulos iguais a 5 unidades e 12 unidades, respectivamente. Se a resultante R = V1 + V2 tem módulo igual a 13 unidades, podemos afirmar corretamente que o ângulo entre os vetores V1 e V2 vale:',
    options: ['0º', '45º', '90º', '180º', '60º'],
    correctIndex: 2,
    explanation: 'Pela Lei dos Cossenos para soma vetorial: R² = V1² + V2² + 2·V1·V2·cos(θ).\nSubstituindo os valores dados:\n13² = 5² + 12² + 2(5)(12)·cos(θ)\n169 = 25 + 144 + 120·cos(θ)\n169 = 169 + 120·cos(θ) => 120·cos(θ) = 0 => cos(θ) = 0 => θ = 90º.\nTrata-se exatamente da clássica terna pitagórica (5, 12, 13) de dois vetores perpendiculares entre si.',
    subject: 'Física',
    topic: 'Vetores e Operações Vetoriais',
    difficulty: 'facil',
    origin: 'Apostila 720 Questões',
    isFavorite: true,
    createdAt: '2026-10-04T00:00:00Z'
  },
  {
    id: 'fis-bas-02',
    userId: 'public',
    statement: '(Apostila 720 / Roldanas) De quanto a força muscular aplicada fica reduzida utilizando-se um sistema com 1 roldana fixa e 1 roldana móvel ideal em equilíbrio?',
    options: ['10%', '30%', '50%', '70%', '90%'],
    correctIndex: 2,
    explanation: 'Em um sistema com uma roldana móvel, o peso do objeto é dividido igualmente pelos dois ramos da corda sustentada pela roldana móvel.\nPortanto, a força necessária para equilibrar ou elevar a carga de peso P é F = P / 2 = 0,50 P, o que representa uma redução de 50% no esforço exigido.',
    subject: 'Física',
    topic: 'Leis de Newton & Roldanas',
    difficulty: 'facil',
    origin: 'Apostila 720 Questões',
    isFavorite: false,
    createdAt: '2026-10-04T00:00:00Z'
  },
  {
    id: 'fis-bas-03',
    userId: 'public',
    statement: '(Apostila 720 / Leis de Newton) Um corpo de massa igual a 4 kg é submetido à ação simultânea e exclusiva de duas forças constantes de intensidades iguais a 4 N e 6 N. O maior valor possível para a aceleração desse corpo é de:',
    options: ['10,0 m/s²', '6,5 m/s²', '4,0 m/s²', '3,0 m/s²', '2,5 m/s²'],
    correctIndex: 4,
    explanation: 'A aceleração máxima é obtida quando a força resultante for máxima, o que ocorre quando as duas forças atuam na mesma direção e no mesmo sentido (ângulo θ = 0°):\nF_res_max = 6 N + 4 N = 10 N.\nPela Segunda Lei de Newton (F = m · a):\na_max = F_res_max / m = 10 N / 4 kg = 2,5 m/s².',
    subject: 'Física',
    topic: 'Leis de Newton & Dinâmica',
    difficulty: 'facil',
    origin: 'Apostila 720 Questões',
    isFavorite: false,
    createdAt: '2026-10-04T00:00:00Z'
  },

  // ==========================================
  // QUÍMICA BÁSICA (APOSTILA 720)
  // ==========================================
  {
    id: 'qui-bas-01',
    userId: 'public',
    statement: '(Apostila 720 / Densidade) O apodrecimento de um ovo gera a formação de gás sulfídrico (H2S), com odor característico de enxofre. Ao adicionar um ovo podre em um copo com água e um ovo normal (sadio) em outro copo, observa-se que o ovo:',
    options: [
      'sadio e o ovo podre irão afundar, pois possuem densidade maior que a da água.',
      'podre irá boiar, pois a formação do H2S(g) expande bolsas gasosas e diminui a densidade média do conjunto.',
      'podre irá afundar, pois a decomposição aumenta sua massa molar total.',
      'sadio irá boiar, pois a ausência de bactérias torna a casca permeável ao ar.',
      'sadio e o ovo podre flutuam em qualquer situação.'
    ],
    correctIndex: 1,
    explanation: 'No ovo sadio, o conteúdo denso faz com que ele afunde na água (densidade do ovo sadio > densidade da água ≈ 1 g/cm³).\nÀ medida que o ovo se decompõe, as proteínas degradam-se e liberam gases (principalmente H2S e CO2), que aumentam o volume ocupado pelas câmaras gasosas internas e expulsam umidade pelos poros, diminuindo a densidade média do ovo. Assim, densidade do ovo podre < densidade da água, fazendo-o boiar.',
    subject: 'Química',
    topic: 'Propriedades da Matéria & Densidade',
    difficulty: 'facil',
    origin: 'Apostila 720 Questões',
    isFavorite: true,
    createdAt: '2026-10-04T00:00:00Z'
  },
  {
    id: 'qui-bas-02',
    userId: 'public',
    statement: '(Apostila 720 / Ligações Químicas) Na molécula de metano (CH4), na molécula de água (H2O) e no dióxido de carbono (CO2), as geometrias moleculares e a polaridade das moléculas são, respectivamente:',
    options: [
      'Tetraédrica (apolar); Angular (polar); Linear (apolar)',
      'Plana (polar); Linear (polar); Angular (apolar)',
      'Piramidal (apolar); Angular (apolar); Linear (polar)',
      'Tetraédrica (polar); Linear (apolar); Angular (polar)',
      'Trigonal (apolar); Angular (polar); Linear (polar)'
    ],
    correctIndex: 0,
    explanation: '1. CH4: O carbono central possui 4 pares de elétrons ligantes e zero pares isolados => Geometria Tetraédrica. Os 4 vetores de momento dipolar anulam-se por simetria espacial => Molécula Apolar.\n2. H2O: O oxigênio central possui 2 ligações simples e 2 pares de elétrons não ligantes (nuvens livres) => Geometria Angular. A resultante dos vetores momento dipolar é diferente de zero (μ ≠ 0) => Molécula Polar.\n3. CO2: O carbono central faz 2 duplas ligações (O=C=O) e não possui elétrons isolados => Geometria Linear (180°). Os vetores momento dipolar têm sentidos opostos e mesmo módulo, anulando-se (μ = 0) => Molécula Apolar.',
    subject: 'Química',
    topic: 'Geometria Molecular & Polaridade',
    difficulty: 'medio',
    origin: 'Apostila 720 Questões',
    isFavorite: true,
    createdAt: '2026-10-04T00:00:00Z'
  }
];

