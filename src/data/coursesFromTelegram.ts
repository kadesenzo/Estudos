import { Course, CourseModule, Lesson } from '../types';
import { RAW_DATABASE, TELEGRAM_CHANNEL_BASE, RawItem } from './rawTelegramData';

// Helper to build a clean Lesson object
function buildLesson(item: RawItem, courseId: string, moduleId: string, order: number, customTitle?: string): Lesson {
  return {
    id: `les-${courseId}-${item.telegramMsgId}`,
    userId: 'public',
    courseId,
    moduleId,
    title: customTitle || item.title,
    type: item.type === 'v' ? 'video' : 'pdf',
    mediaUrl: `${TELEGRAM_CHANNEL_BASE}${item.telegramMsgId}`,
    sizeMb: item.sizeMb,
    order,
    isCompleted: false,
    externalId: item.telegramMsgId
  };
}

// Master generator that sequences courses from the true beginning:
// Video lessons first, organized chronologically:
// Semana 1 (Aula 1, 2, 3...) -> Semana 2 -> Módulo Zero -> Livros Teóricos -> Listas de Exercícios.
export function generateLibraryCourses(): Course[] {
  // -------------------------------------------------------------
  // 1. MATEMÁTICA — DO INÍCIO (SEMANA 1 -> SEMANA 2 -> MÓDULO ZERO -> LIVROS -> EXERCÍCIOS)
  // -------------------------------------------------------------
  // Semana 1: msgs 465 a 476 e 479 (Revisão da Semana 1)
  const matSemana1Items = RAW_DATABASE.filter(i => i.subjectIdx === 11 && i.type === 'v' && i.telegramMsgId >= 465 && i.telegramMsgId <= 479);
  
  // Semana 2: msgs 511 a 536
  const matSemana2Items = RAW_DATABASE.filter(i => i.subjectIdx === 11 && i.type === 'v' && i.telegramMsgId >= 511 && i.telegramMsgId <= 536);
  
  // Módulo Zero: msgs 482 a 507 (Alfabetização & Cálculo Mental)
  const matModZeroItems = RAW_DATABASE.filter(i => i.subjectIdx === 11 && i.type === 'v' && i.telegramMsgId >= 482 && i.telegramMsgId <= 507);
  
  // Livros Teóricos
  const matBookItems = RAW_DATABASE.filter(i => (i.subjectIdx === 11 || i.subjectIdx === 3) && i.type === 'p' && (i.title.toLowerCase().includes('livro - matemática') || i.title.toLowerCase().includes('nivelamento')));
  
  // Listas de Exercícios
  const matExerciseItems = RAW_DATABASE.filter(i => i.subjectIdx === 11 && i.type === 'p' && !matBookItems.includes(i));

  const matModules: CourseModule[] = [
    {
      id: 'mod-mat-1',
      courseId: 'course-mat-telegram',
      title: 'Módulo 1: Semana 1 — Matemática Básica & Operações Fundamentais (Do Início: Aula 1 a 12)',
      order: 1,
      description: 'Início cronológico oficial: Números, sistema decimal, potências, raízes, decimais, operações com negativos, múltiplos, divisores, frações, expressões e questões de vestibular.',
      lessons: matSemana1Items.map((item, idx) => buildLesson(item, 'course-mat-telegram', 'mod-mat-1', idx + 1))
    },
    {
      id: 'mod-mat-2',
      courseId: 'course-mat-telegram',
      title: 'Módulo 2: Semana 2 — Frações, Divisibilidade, MMC, MDC & Teoria Completa (Aula 1 a 10)',
      order: 2,
      description: 'Continuação direta: Frações equivalentes, simplificação, números mistos, MMC/MDC e teoria completa de potenciação e radiciação.',
      lessons: matSemana2Items.map((item, idx) => buildLesson(item, 'course-mat-telegram', 'mod-mat-2', idx + 1))
    },
    {
      id: 'mod-mat-3',
      courseId: 'course-mat-telegram',
      title: 'Módulo 3: Módulo Zero — Alfabetização em Matemática & Cálculo Mental (22 Aulas)',
      order: 3,
      description: 'Nivelamento e velocidade: Adição mental, subtração, tabuada mental de 2 a 10, duplicar, triplicar, divisões notáveis e números decimais.',
      lessons: matModZeroItems.map((item, idx) => buildLesson(item, 'course-mat-telegram', 'mod-mat-3', idx + 1))
    },
    {
      id: 'mod-mat-4',
      courseId: 'course-mat-telegram',
      title: 'Módulo 4: Livros & Cadernos Teóricos de Nivelamento (PDFs)',
      order: 4,
      description: 'Livro completo de Matemática Básica e Caderno de Revisão do Ciclo de Nivelamento para consulta e estudo aprofundado.',
      lessons: matBookItems.map((item, idx) => buildLesson(item, 'course-mat-telegram', 'mod-mat-4', idx + 1))
    },
    {
      id: 'mod-mat-5',
      courseId: 'course-mat-telegram',
      title: 'Módulo 5: Listas de Exercícios de Fixação & Gabaritos (PDFs)',
      order: 5,
      description: 'Mais de 20 listas temáticas: Álgebra, Porcentagem, Razão, Proporção, Geometria Plana/Espacial, Combinatória, Probabilidade e Logaritmos.',
      lessons: matExerciseItems.map((item, idx) => buildLesson(item, 'course-mat-telegram', 'mod-mat-5', idx + 1))
    }
  ];

  const courseMat: Course = {
    id: 'course-mat-telegram',
    userId: 'public',
    title: 'Matemática Completa: da Base ao ITA / Forças Armadas',
    category: 'Matemática',
    description: 'Curso completo de Matemática organizado do início absoluto: Semana 1 (Números, potências, decimais, frações), Semana 2 (MMC, MDC, potenciação completa), Módulo Zero (Cálculo mental rápido) e acervo de livros e exercícios.',
    instructor: 'Prof. de Exatas da Biblioteca',
    institution: 'Biblioteca Oficial',
    coverUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
    originalUrl: `${TELEGRAM_CHANNEL_BASE}465`,
    platform: 'Biblioteca Telegram',
    modulesCount: matModules.length,
    lessonsCount: matModules.reduce((acc, m) => acc + m.lessons.length, 0),
    isFavorite: true,
    progressPercent: 0,
    stoppedAtLessonId: matModules[0]?.lessons[0]?.id,
    stoppedAtLessonTitle: 'Semana 1: Aula 1 - Números, Sistema Decimal, Valor, Ordem e Classe',
    createdAt: '2025-01-01T00:00:00Z',
    modules: matModules
  };

  // -------------------------------------------------------------
  // 2. FÍSICA — DO INÍCIO (CINEMÁTICA/MECÂNICA -> TERMOLOGIA -> ONDULATÓRIA -> ELETRICIDADE)
  // -------------------------------------------------------------
  const fisVideosMec = RAW_DATABASE.filter(i => i.subjectIdx === 10 && i.type === 'v' && [1165, 1187, 1216, 1296, 1319].includes(i.telegramMsgId));
  const fisVideosTermo = RAW_DATABASE.filter(i => i.subjectIdx === 10 && i.type === 'v' && [1076, 1090, 1110, 1126].includes(i.telegramMsgId));
  const fisVideosOndas = RAW_DATABASE.filter(i => i.subjectIdx === 10 && i.type === 'v' && [1050, 1066].includes(i.telegramMsgId));
  const fisVideosEletr = RAW_DATABASE.filter(i => i.subjectIdx === 10 && i.type === 'v' && [1330, 1356].includes(i.telegramMsgId));
  const fisBooks = RAW_DATABASE.filter(i => i.subjectIdx === 10 && i.type === 'p' && i.title.toLowerCase().includes('livro'));
  const fisExercises = RAW_DATABASE.filter(i => i.subjectIdx === 10 && i.type === 'p' && !fisBooks.includes(i));

  const fisModules: CourseModule[] = [
    {
      id: 'mod-fis-1',
      courseId: 'course-fis-telegram',
      title: 'Módulo 1: Videoaulas — Mecânica Clássica, Cinemática & Dinâmica (Do Início — Aula 1 a 5)',
      order: 1,
      description: 'Cinemática escalar, Movimento Uniforme, Leis de Newton, Vetores, Decomposição vetorial, Hidrostática (Stevin e Pascal) e Estática/Torque.',
      lessons: fisVideosMec.map((item, idx) => buildLesson(item, 'course-fis-telegram', 'mod-fis-1', idx + 1))
    },
    {
      id: 'mod-fis-2',
      courseId: 'course-fis-telegram',
      title: 'Módulo 2: Videoaulas — Termologia & Termodinâmica (Aula 1 a 4)',
      order: 2,
      description: 'Conceitos fundamentais de termologia, calorimetria, calor específico e sensível, dilatação térmica, 1ª e 2ª Leis da Termodinâmica e ciclos térmicos.',
      lessons: fisVideosTermo.map((item, idx) => buildLesson(item, 'course-fis-telegram', 'mod-fis-2', idx + 1))
    },
    {
      id: 'mod-fis-3',
      courseId: 'course-fis-telegram',
      title: 'Módulo 3: Videoaulas — Ondulatória & Fenômenos Ondulatórios (Aula 1 e 2)',
      order: 3,
      description: 'Fundamentos da ondulatória, equação fundamental da onda, reflexão, refração, difração, polarização e interferência.',
      lessons: fisVideosOndas.map((item, idx) => buildLesson(item, 'course-fis-telegram', 'mod-fis-3', idx + 1))
    },
    {
      id: 'mod-fis-4',
      courseId: 'course-fis-telegram',
      title: 'Módulo 4: Videoaulas — Eletrostática & Eletrodinâmica (Aula 1 e 2)',
      order: 4,
      description: 'Processos de eletrização, Lei de Coulomb, campo elétrico, potencial elétrico, corrente elétrica, Leis de Ohm e associação de resistores.',
      lessons: fisVideosEletr.map((item, idx) => buildLesson(item, 'course-fis-telegram', 'mod-fis-4', idx + 1))
    },
    {
      id: 'mod-fis-5',
      courseId: 'course-fis-telegram',
      title: 'Módulo 5: Livros Teóricos & Manuais em PDF',
      order: 5,
      description: 'Livro completo de Eletrodinâmica com teoria aprofundada e modelos conceituais para vestibulares de alto nível e IME/ITA.',
      lessons: fisBooks.map((item, idx) => buildLesson(item, 'course-fis-telegram', 'mod-fis-5', idx + 1))
    },
    {
      id: 'mod-fis-6',
      courseId: 'course-fis-telegram',
      title: 'Módulo 6: Listas de Exercícios Temáticas & Gabaritos em PDF',
      order: 6,
      description: 'Cadernos de exercícios comentados de Ondulatória, Termologia, Energia, Vetores, Cinemática I e II, Dinâmica I, II e III, Estática, Hidrostática e Eletromagnetismo.',
      lessons: fisExercises.map((item, idx) => buildLesson(item, 'course-fis-telegram', 'mod-fis-6', idx + 1))
    }
  ];

  const courseFis: Course = {
    id: 'course-fis-telegram',
    userId: 'public',
    title: 'Física Completa: Mecânica, Termologia, Ondulatória e Eletricidade',
    category: 'Física',
    description: 'Curso intensivo de Física organizado da base mecânica: Cinemática escalar, leis de Newton, vetores, hidrostática, estática, termologia, termodinâmica, ondulatória e eletricidade.',
    instructor: 'Prof. de Física da Biblioteca',
    institution: 'Biblioteca Oficial',
    coverUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop',
    originalUrl: `${TELEGRAM_CHANNEL_BASE}1165`,
    platform: 'Biblioteca Telegram',
    modulesCount: fisModules.length,
    lessonsCount: fisModules.reduce((acc, m) => acc + m.lessons.length, 0),
    isFavorite: true,
    progressPercent: 0,
    stoppedAtLessonId: fisModules[0]?.lessons[0]?.id,
    stoppedAtLessonTitle: 'Aula 1 - Cinemática Escalar e Movimento Uniforme',
    createdAt: '2025-01-01T00:00:00Z',
    modules: fisModules
  };

  // -------------------------------------------------------------
  // 3. QUÍMICA — DO INÍCIO (QUÍMICA GERAL -> FÍSICO-QUÍMICA -> ORGÂNICA -> EXERCÍCIOS)
  // -------------------------------------------------------------
  const quiVideosGeral = RAW_DATABASE.filter(i => i.subjectIdx === 9 && i.type === 'v' && [1386, 1410, 1416, 1442, 1463].includes(i.telegramMsgId));
  const quiVideosFisico = RAW_DATABASE.filter(i => i.subjectIdx === 9 && i.type === 'v' && [1561, 1584, 1643, 1616, 1659].includes(i.telegramMsgId));
  const quiVideosOrganica = RAW_DATABASE.filter(i => i.subjectIdx === 9 && i.type === 'v' && [1499].includes(i.telegramMsgId));
  const quiExercises = RAW_DATABASE.filter(i => i.subjectIdx === 9 && i.type === 'p');

  const quiModules: CourseModule[] = [
    {
      id: 'mod-qui-1',
      courseId: 'course-qui-telegram',
      title: 'Módulo 1: Videoaulas — Química Geral & Inorgânica (Do Início — Aula 1 a 5)',
      order: 1,
      description: 'Matéria, estados físicos, métodos de separação de misturas, atomística, tabela periódica, ligações químicas e funções inorgânicas.',
      lessons: quiVideosGeral.map((item, idx) => buildLesson(item, 'course-qui-telegram', 'mod-qui-1', idx + 1))
    },
    {
      id: 'mod-qui-2',
      courseId: 'course-qui-telegram',
      title: 'Módulo 2: Videoaulas — Físico-Química (Aula 1 a 5)',
      order: 2,
      description: 'Termoquímica e entalpia, soluções e concentrações, cinética química, equilíbrio químico (Princípio de Le Chatelier) e eletroquímica/pilhas.',
      lessons: quiVideosFisico.map((item, idx) => buildLesson(item, 'course-qui-telegram', 'mod-qui-2', idx + 1))
    },
    {
      id: 'mod-qui-3',
      courseId: 'course-qui-telegram',
      title: 'Módulo 3: Videoaulas — Química Orgânica Completa',
      order: 3,
      description: 'Cadeias carbônicas, funções orgânicas, isomeria plana e espacial, propriedades físicas de compostos orgânicos e reações essenciais.',
      lessons: quiVideosOrganica.map((item, idx) => buildLesson(item, 'course-qui-telegram', 'mod-qui-3', idx + 1))
    },
    {
      id: 'mod-qui-4',
      courseId: 'course-qui-telegram',
      title: 'Módulo 4: Listas de Exercícios de Fixação & Gabaritos em PDF',
      order: 4,
      description: 'Cadernos de questões comentadas: Atomística, Tabela Periódica, Ligações, Funções Inorgânicas, Estequiometria, Química Orgânica, Soluções, Cinética e Eletroquímica.',
      lessons: quiExercises.map((item, idx) => buildLesson(item, 'course-qui-telegram', 'mod-qui-4', idx + 1))
    }
  ];

  const courseQui: Course = {
    id: 'course-qui-telegram',
    userId: 'public',
    title: 'Química Geral, Físico-Química e Orgânica',
    category: 'Química',
    description: 'Curso completo de Química estruturado do início: Matéria, separação, atomística, tabela periódica, ligações, inorgânica, termoquímica, soluções, cinética, equilíbrio e orgânica.',
    instructor: 'Prof. de Química da Biblioteca',
    institution: 'Biblioteca Oficial',
    coverUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop',
    originalUrl: `${TELEGRAM_CHANNEL_BASE}1386`,
    platform: 'Biblioteca Telegram',
    modulesCount: quiModules.length,
    lessonsCount: quiModules.reduce((acc, m) => acc + m.lessons.length, 0),
    isFavorite: true,
    progressPercent: 0,
    stoppedAtLessonId: quiModules[0]?.lessons[0]?.id,
    stoppedAtLessonTitle: 'Aula 1 - Matéria e Estados Físicos',
    createdAt: '2025-01-01T00:00:00Z',
    modules: quiModules
  };

  // -------------------------------------------------------------
  // 4. REDAÇÃO E ENGENHARIA ARGUMENTATIVA
  // -------------------------------------------------------------
  const redVideosBase = RAW_DATABASE.filter(i => i.subjectIdx === 2 && i.type === 'v' && i.telegramMsgId >= 312 && i.telegramMsgId <= 321);
  const redVideosPratica = RAW_DATABASE.filter(i => i.subjectIdx === 2 && i.type === 'v' && i.telegramMsgId >= 322 && i.telegramMsgId <= 337);
  const redVideosEng = RAW_DATABASE.filter(i => i.subjectIdx === 2 && i.type === 'v' && i.telegramMsgId >= 339 && i.telegramMsgId <= 348);
  const redVideosCorrecao = RAW_DATABASE.filter(i => i.subjectIdx === 2 && i.type === 'v' && [450, 451, 452].includes(i.telegramMsgId));
  const redBooks = RAW_DATABASE.filter(i => i.subjectIdx === 2 && i.type === 'p');

  const redModules: CourseModule[] = [
    {
      id: 'mod-red-1',
      courseId: 'course-red-telegram',
      title: 'Módulo 1: Videoaulas — Fundamentos da Redação & Estrutura Nota 1000 (Do Início — Aula 1 a 10)',
      order: 1,
      description: 'Início: Introdução perfeita, três estratégias fortíssimas de contextualização, tópico frasal imbatível, desenvolvimento e fundamentação.',
      lessons: redVideosBase.map((item, idx) => buildLesson(item, 'course-red-telegram', 'mod-red-1', idx + 1))
    },
    {
      id: 'mod-red-2',
      courseId: 'course-red-telegram',
      title: 'Módulo 2: Videoaulas — Desenvolvimento Prático, Proposta de Intervenção & Modelos (Aula 11 a 26)',
      order: 2,
      description: 'Propostas de intervenção na prática, repertórios coringas, competência 1, mente do corretor e análise detalhada de redações nota 1000.',
      lessons: redVideosPratica.map((item, idx) => buildLesson(item, 'course-red-telegram', 'mod-red-2', idx + 1))
    },
    {
      id: 'mod-red-3',
      courseId: 'course-red-telegram',
      title: 'Módulo 3: Videoaulas — Engenharia Argumentativa & Dialética (Aula 1 a 9)',
      order: 3,
      description: 'Treinamento de lógica, o poder da analogia, retórica aprimorada, dialética estratégica e repertórios especiais.',
      lessons: redVideosEng.map((item, idx) => buildLesson(item, 'course-red-telegram', 'mod-red-3', idx + 1))
    },
    {
      id: 'mod-red-4',
      courseId: 'course-red-telegram',
      title: 'Módulo 4: Videoaulas — Oficinas Práticas de Correção de Redação',
      order: 4,
      description: 'Correções comentadas passo a passo identificando falhas de argumentação, coesão e desvios de norma culta.',
      lessons: redVideosCorrecao.map((item, idx) => buildLesson(item, 'course-red-telegram', 'mod-red-4', idx + 1))
    },
    {
      id: 'mod-red-5',
      courseId: 'course-red-telegram',
      title: 'Módulo 5: Livros, Manuais & Apostilas Teóricas em PDF',
      order: 5,
      description: 'Livro de Argumentação, Livro de Repertórios, Coesão e Intervenção, Manual da Competência 1 e Slides das Oficinas Práticas.',
      lessons: redBooks.map((item, idx) => buildLesson(item, 'course-red-telegram', 'mod-red-5', idx + 1))
    }
  ];

  const courseRed: Course = {
    id: 'course-red-telegram',
    userId: 'public',
    title: 'Redação Estratégica & Engenharia Argumentativa',
    category: 'Redação',
    description: 'Metodologia definitiva de redação: introdução perfeita, estratégias de contextualização, tópico frasal, fundamentação, dialética e análise de redações nota máxima.',
    instructor: 'Especialista em Redação da Biblioteca',
    institution: 'Biblioteca Oficial',
    coverUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop',
    originalUrl: `${TELEGRAM_CHANNEL_BASE}312`,
    platform: 'Biblioteca Telegram',
    modulesCount: redModules.length,
    lessonsCount: redModules.reduce((acc, m) => acc + m.lessons.length, 0),
    isFavorite: false,
    progressPercent: 0,
    stoppedAtLessonId: redModules[0]?.lessons[0]?.id,
    stoppedAtLessonTitle: 'Aula 1 - Bem Vindo ao Mundo da Redação ENEM! Fundamentos',
    createdAt: '2025-01-01T00:00:00Z',
    modules: redModules
  };

  // -------------------------------------------------------------
  // 5. PORTUGUÊS E GRAMÁTICA
  // -------------------------------------------------------------
  const portVideos1 = RAW_DATABASE.filter(i => i.subjectIdx === 3 && i.type === 'v' && i.telegramMsgId >= 355 && i.telegramMsgId <= 366);
  const portVideos2 = RAW_DATABASE.filter(i => i.subjectIdx === 3 && i.type === 'v' && i.telegramMsgId >= 372 && i.telegramMsgId <= 381);
  const portVideos3 = RAW_DATABASE.filter(i => i.subjectIdx === 3 && i.type === 'v' && i.telegramMsgId >= 387 && i.telegramMsgId <= 398);
  const portVideos4 = RAW_DATABASE.filter(i => i.subjectIdx === 3 && i.type === 'v' && i.telegramMsgId >= 404 && i.telegramMsgId <= 419);
  const portVideos5 = RAW_DATABASE.filter(i => i.subjectIdx === 3 && i.type === 'v' && i.telegramMsgId >= 425 && i.telegramMsgId <= 445);
  const portCadernos = RAW_DATABASE.filter(i => i.subjectIdx === 3 && i.type === 'p' && (i.title.toLowerCase().includes('caderno') || i.title.toLowerCase().includes('slides')));
  const portBooksAndExercises = RAW_DATABASE.filter(i => i.subjectIdx === 3 && i.type === 'p' && !portCadernos.includes(i));

  const portModules: CourseModule[] = [
    {
      id: 'mod-port-1',
      courseId: 'course-port-telegram',
      title: 'Módulo 1: Videoaulas — Ortografia, Acentuação & Sinais Gráficos (Do Início — Aula 1 a 7)',
      order: 1,
      description: 'Aulas 1 a 4 de Ortografia e Acentuação Gráfica + Aulas 1 a 3 de Uso de Maiúsculas e Minúsculas e outros sinais.',
      lessons: portVideos1.map((item, idx) => buildLesson(item, 'course-port-telegram', 'mod-port-1', idx + 1))
    },
    {
      id: 'mod-port-2',
      courseId: 'course-port-telegram',
      title: 'Módulo 2: Videoaulas — Pontuação, A Vírgula & Crase Sem Trauma (Aula 1 a 5)',
      order: 2,
      description: 'Pontuação essencial, regras do uso da vírgula e teoria e prática completa de crase sem trauma.',
      lessons: portVideos2.map((item, idx) => buildLesson(item, 'course-port-telegram', 'mod-port-2', idx + 1))
    },
    {
      id: 'mod-port-3',
      courseId: 'course-port-telegram',
      title: 'Módulo 3: Videoaulas — Regência Nominal e Verbal (Aula 1 a 7)',
      order: 3,
      description: 'Regência nominal completa e regência verbal dos verbos mais cobrados em concursos militares.',
      lessons: portVideos3.map((item, idx) => buildLesson(item, 'course-port-telegram', 'mod-port-3', idx + 1))
    },
    {
      id: 'mod-port-4',
      courseId: 'course-port-telegram',
      title: 'Módulo 4: Videoaulas — Concordância & Colocação Pronominal (Aula 1 a 6)',
      order: 4,
      description: 'Concordância nominal, concordância verbal, próclise, ênclise e mesóclise.',
      lessons: portVideos4.map((item, idx) => buildLesson(item, 'course-port-telegram', 'mod-port-4', idx + 1))
    },
    {
      id: 'mod-port-5',
      courseId: 'course-port-telegram',
      title: 'Módulo 5: Videoaulas — Paralelismo, Ambiguidade & Checklist de Revisão (Aula 1 a 5)',
      order: 5,
      description: 'Ortografia avançada e hífen, armadilhas de grafia, ambiguidade, pleonasmo, paralelismo sintático e checklist final.',
      lessons: portVideos5.map((item, idx) => buildLesson(item, 'course-port-telegram', 'mod-port-5', idx + 1))
    },
    {
      id: 'mod-port-6',
      courseId: 'course-port-telegram',
      title: 'Módulo 6: Cadernos de Gramática 1 ao 14 & Slides das Aulas em PDF',
      order: 6,
      description: 'Todos os 14 Cadernos de Gramática oficiais e Slides de apoio visual para acompanhar as videoaulas.',
      lessons: portCadernos.map((item, idx) => buildLesson(item, 'course-port-telegram', 'mod-port-6', idx + 1))
    },
    {
      id: 'mod-port-7',
      courseId: 'course-port-telegram',
      title: 'Módulo 7: Livros Teóricos (Vol. 1 e 2) & Listas de Exercícios em PDF',
      order: 7,
      description: 'Livro de Gramática Volume 1 e 2, exercícios de figuras de linguagem, funções da linguagem e anúncios publicitários.',
      lessons: portBooksAndExercises.map((item, idx) => buildLesson(item, 'course-port-telegram', 'mod-port-7', idx + 1))
    }
  ];

  const coursePort: Course = {
    id: 'course-port-telegram',
    userId: 'public',
    title: 'Português & Gramática Aplicada à Norma Culta',
    category: 'Português',
    description: 'Cadernos completos e videoaulas de gramática: Ortografia, pontuação, uso da vírgula, crase sem trauma, regência, concordância nominal e verbal, colocação pronominal e paralelismo.',
    instructor: 'Prof. de Português da Biblioteca',
    institution: 'Biblioteca Oficial',
    coverUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop',
    originalUrl: `${TELEGRAM_CHANNEL_BASE}355`,
    platform: 'Biblioteca Telegram',
    modulesCount: portModules.length,
    lessonsCount: portModules.reduce((acc, m) => acc + m.lessons.length, 0),
    isFavorite: false,
    progressPercent: 0,
    stoppedAtLessonId: portModules[0]?.lessons[0]?.id,
    stoppedAtLessonTitle: 'Aula 1 - Ortografia & Acentuação Gráfica',
    createdAt: '2025-01-01T00:00:00Z',
    modules: portModules
  };

  // -------------------------------------------------------------
  // 6. BIOLOGIA
  // -------------------------------------------------------------
  const bioVideos = RAW_DATABASE.filter(i => i.subjectIdx === 8 && i.type === 'v');
  const bioBooks = RAW_DATABASE.filter(i => i.subjectIdx === 8 && i.type === 'p' && i.title.toLowerCase().includes('livro'));
  const bioExercises = RAW_DATABASE.filter(i => i.subjectIdx === 8 && i.type === 'p' && !bioBooks.includes(i));

  const bioModules: CourseModule[] = [
    {
      id: 'mod-bio-1',
      courseId: 'course-bio-telegram',
      title: 'Módulo 1: Videoaulas — Citologia, Genética, Fisiologia & Ecologia (Do Início — Aula 1 a 8)',
      order: 1,
      description: 'Aulas completas: Citologia, membrana celular, metabolismo energético, fotossíntese, evolução, ecologia, fisiologia humana, botânica e genética.',
      lessons: bioVideos.map((item, idx) => buildLesson(item, 'course-bio-telegram', 'mod-bio-1', idx + 1))
    },
    {
      id: 'mod-bio-2',
      courseId: 'course-bio-telegram',
      title: 'Módulo 2: Livros & Manuais Teóricos em PDF',
      order: 2,
      description: 'Livro completo de Botânica e Livro de Doenças e Saúde Pública.',
      lessons: bioBooks.map((item, idx) => buildLesson(item, 'course-bio-telegram', 'mod-bio-2', idx + 1))
    },
    {
      id: 'mod-bio-3',
      courseId: 'course-bio-telegram',
      title: 'Módulo 3: Listas de Exercícios & Gabaritos em PDF',
      order: 3,
      description: 'Cadernos de fixação: Citologia, Metabolismo, Seres Vivos, Evolução, Ecologia, Fisiologia, Genética, Biologia Molecular e Zoologia.',
      lessons: bioExercises.map((item, idx) => buildLesson(item, 'course-bio-telegram', 'mod-bio-3', idx + 1))
    }
  ];

  const courseBio: Course = {
    id: 'course-bio-telegram',
    userId: 'public',
    title: 'Biologia Completa: Citologia, Genética, Ecologia e Fisiologia',
    category: 'Biologia',
    description: 'Citologia, membrana, metabolismo energético, respiração celular, fotossíntese, evolução, ecologia, fisiologia humana, botânica, biologia molecular e genética.',
    instructor: 'Prof. de Biologia da Biblioteca',
    institution: 'Biblioteca Oficial',
    coverUrl: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?q=80&w=800&auto=format&fit=crop',
    originalUrl: `${TELEGRAM_CHANNEL_BASE}1708`,
    platform: 'Biblioteca Telegram',
    modulesCount: bioModules.length,
    lessonsCount: bioModules.reduce((acc, m) => acc + m.lessons.length, 0),
    isFavorite: false,
    progressPercent: 0,
    stoppedAtLessonId: bioModules[0]?.lessons[0]?.id,
    stoppedAtLessonTitle: 'Aula 1 - Citologia e Membrana Plasmática',
    createdAt: '2025-01-01T00:00:00Z',
    modules: bioModules
  };

  // -------------------------------------------------------------
  // 7. HISTÓRIA
  // -------------------------------------------------------------
  const histVideos = RAW_DATABASE.filter(i => i.subjectIdx === 6 && i.type === 'v');
  const histExercises = RAW_DATABASE.filter(i => i.subjectIdx === 6 && i.type === 'p');

  const histModules: CourseModule[] = [
    {
      id: 'mod-hist-1',
      courseId: 'course-hist-telegram',
      title: 'Módulo 1: Videoaulas — História do Brasil & Século XX (Do Início — Aula 1 a 3)',
      order: 1,
      description: 'Brasil Colônia e ciclos econômicos, Brasil Império e República, reformas e história contemporânea do século XX (Grandes Guerras).',
      lessons: histVideos.map((item, idx) => buildLesson(item, 'course-hist-telegram', 'mod-hist-1', idx + 1))
    },
    {
      id: 'mod-hist-2',
      courseId: 'course-hist-telegram',
      title: 'Módulo 2: Listas de Exercícios & Cadernos de Questões em PDF',
      order: 2,
      description: 'Lista intensiva de História Geral e do Brasil, Expansão Marítima e Brasil Colônia com resoluções comentadas.',
      lessons: histExercises.map((item, idx) => buildLesson(item, 'course-hist-telegram', 'mod-hist-2', idx + 1))
    }
  ];

  const courseHist: Course = {
    id: 'course-hist-telegram',
    userId: 'public',
    title: 'História do Brasil & Século XX',
    category: 'História',
    description: 'Expansão marítima, Brasil Colônia e ciclos econômicos, Brasil Império, República, reformas e história do século XX (Grandes Guerras).',
    instructor: 'Prof. de História da Biblioteca',
    institution: 'Biblioteca Oficial',
    coverUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=800&auto=format&fit=crop',
    originalUrl: `${TELEGRAM_CHANNEL_BASE}2259`,
    platform: 'Biblioteca Telegram',
    modulesCount: histModules.length,
    lessonsCount: histModules.reduce((acc, m) => acc + m.lessons.length, 0),
    isFavorite: false,
    progressPercent: 0,
    stoppedAtLessonId: histModules[0]?.lessons[0]?.id,
    stoppedAtLessonTitle: 'Aula 1 - História do Brasil: Colônia e Ciclos',
    createdAt: '2025-01-01T00:00:00Z',
    modules: histModules
  };

  // -------------------------------------------------------------
  // 8. GEOGRAFIA
  // -------------------------------------------------------------
  const geoVideos = RAW_DATABASE.filter(i => i.subjectIdx === 7 && i.type === 'v');
  const geoExercises = RAW_DATABASE.filter(i => i.subjectIdx === 7 && i.type === 'p');

  const geoModules: CourseModule[] = [
    {
      id: 'mod-geo-1',
      courseId: 'course-geo-telegram',
      title: 'Módulo 1: Videoaulas — Cartografia, Geologia, Economia & Urbanização (Do Início — Aula 1 a 3)',
      order: 1,
      description: 'Cartografia e geologia geral, geografia econômica e globalização, urbanização e demografia brasileira.',
      lessons: geoVideos.map((item, idx) => buildLesson(item, 'course-geo-telegram', 'mod-geo-1', idx + 1))
    },
    {
      id: 'mod-geo-2',
      courseId: 'course-geo-telegram',
      title: 'Módulo 2: Listas de Exercícios em PDF',
      order: 2,
      description: 'Cadernos de fixação: Vazão, Escalas, Geografia Urbana, Demografia e simulados para vestibulares e concursos.',
      lessons: geoExercises.map((item, idx) => buildLesson(item, 'course-geo-telegram', 'mod-geo-2', idx + 1))
    }
  ];

  const courseGeo: Course = {
    id: 'course-geo-telegram',
    userId: 'public',
    title: 'Geografia Geral, do Brasil & Geopolítica',
    category: 'Geografia',
    description: 'Cartografia, geologia, domínios morfoclimáticos, urbanização, demografia, industrialização, economia brasileira e globalização.',
    instructor: 'Prof. de Geografia da Biblioteca',
    institution: 'Biblioteca Oficial',
    coverUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop',
    originalUrl: `${TELEGRAM_CHANNEL_BASE}2242`,
    platform: 'Biblioteca Telegram',
    modulesCount: geoModules.length,
    lessonsCount: geoModules.reduce((acc, m) => acc + m.lessons.length, 0),
    isFavorite: false,
    progressPercent: 0,
    stoppedAtLessonId: geoModules[0]?.lessons[0]?.id,
    stoppedAtLessonTitle: 'Aula 1 - Cartografia e Geologia Geral',
    createdAt: '2025-01-01T00:00:00Z',
    modules: geoModules
  };

  // -------------------------------------------------------------
  // 9. FILOSOFIA & SOCIOLOGIA
  // -------------------------------------------------------------
  const filSocVideos = RAW_DATABASE.filter(i => (i.subjectIdx === 4 || i.subjectIdx === 5) && i.type === 'v');
  const filSocExercises = RAW_DATABASE.filter(i => (i.subjectIdx === 4 || i.subjectIdx === 5) && i.type === 'p');

  const filSocModules: CourseModule[] = [
    {
      id: 'mod-filsoc-1',
      courseId: 'course-filsoc-telegram',
      title: 'Módulo 1: Videoaulas — Filosofia & Teoria Sociológica Clássica (Do Início — Aula 1 e 2)',
      order: 1,
      description: 'Teoria sociológica clássica (Comte, Durkheim, Weber), cultura e sociedade, política, iluminismo e filosofia contemporânea.',
      lessons: filSocVideos.map((item, idx) => buildLesson(item, 'course-filsoc-telegram', 'mod-filsoc-1', idx + 1))
    },
    {
      id: 'mod-filsoc-2',
      courseId: 'course-filsoc-telegram',
      title: 'Módulo 2: Listas de Exercícios & Análise Crítica em PDF',
      order: 2,
      description: 'Exercícios de Sociologia, Filosofia, interpretação de charges, HQs, crítica social, cultural e artística.',
      lessons: filSocExercises.map((item, idx) => buildLesson(item, 'course-filsoc-telegram', 'mod-filsoc-2', idx + 1))
    }
  ];

  const courseFilSoc: Course = {
    id: 'course-filsoc-telegram',
    userId: 'public',
    title: 'Filosofia & Sociologia para Concursos',
    category: 'Filosofia',
    description: 'Teoria sociológica clássica, cultura e sociedade, política, iluminismo, charges e filosofia contemporânea.',
    instructor: 'Prof. de Humanas da Biblioteca',
    institution: 'Biblioteca Oficial',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
    originalUrl: `${TELEGRAM_CHANNEL_BASE}2283`,
    platform: 'Biblioteca Telegram',
    modulesCount: filSocModules.length,
    lessonsCount: filSocModules.reduce((acc, m) => acc + m.lessons.length, 0),
    isFavorite: false,
    progressPercent: 0,
    stoppedAtLessonId: filSocModules[0]?.lessons[0]?.id,
    stoppedAtLessonTitle: 'Aula 1 - Filosofia para Concursos e Vestibulares',
    createdAt: '2025-01-01T00:00:00Z',
    modules: filSocModules
  };

  // -------------------------------------------------------------
  // 10. SIMULADOS AUTORAIS COMPLETOS (1 ao 12)
  // -------------------------------------------------------------
  const simAll = RAW_DATABASE.filter(i => i.subjectIdx === 0);
  const sim2025_1_4 = simAll.filter(i => i.telegramMsgId >= 7 && i.telegramMsgId <= 40);
  const sim2025_5_8 = simAll.filter(i => i.telegramMsgId >= 42 && i.telegramMsgId <= 80);
  const sim2025_9_12 = simAll.filter(i => i.telegramMsgId >= 82 && i.telegramMsgId <= 120);
  const sim2026 = simAll.filter(i => i.telegramMsgId >= 124);

  const simModules: CourseModule[] = [
    {
      id: 'mod-sim-1',
      courseId: 'course-sim-telegram',
      title: 'Módulo 1: Simulados Autorais 1 ao 4 (1º e 2º Dias) — Edição 2025',
      order: 1,
      description: 'Cadernos completos de prova, cartões-resposta, gabaritos oficiais e resoluções comentadas passo a passo.',
      lessons: sim2025_1_4.map((item, idx) => buildLesson(item, 'course-sim-telegram', 'mod-sim-1', idx + 1))
    },
    {
      id: 'mod-sim-2',
      courseId: 'course-sim-telegram',
      title: 'Módulo 2: Simulados Autorais 5 ao 8 (1º e 2º Dias) — Edição 2025',
      order: 2,
      description: 'Cadernos completos de prova, cartões-resposta, gabaritos oficiais e resoluções comentadas passo a passo.',
      lessons: sim2025_5_8.map((item, idx) => buildLesson(item, 'course-sim-telegram', 'mod-sim-2', idx + 1))
    },
    {
      id: 'mod-sim-3',
      courseId: 'course-sim-telegram',
      title: 'Módulo 3: Simulados Autorais 9 ao 12 (1º e 2º Dias) — Edição 2025',
      order: 3,
      description: 'Cadernos completos de prova, cartões-resposta, gabaritos oficiais e resoluções comentadas passo a passo.',
      lessons: sim2025_9_12.map((item, idx) => buildLesson(item, 'course-sim-telegram', 'mod-sim-3', idx + 1))
    },
    {
      id: 'mod-sim-4',
      courseId: 'course-sim-telegram',
      title: 'Módulo 4: Simulados Autorais 1 ao 3 (1º e 2º Dias) — Edição 2026',
      order: 4,
      description: 'Nova coleção 2026 com provas completas de 1º e 2º dias, gabaritos e resoluções detalhadas.',
      lessons: sim2026.map((item, idx) => buildLesson(item, 'course-sim-telegram', 'mod-sim-4', idx + 1))
    }
  ];

  const courseSim: Course = {
    id: 'course-sim-telegram',
    userId: 'public',
    title: 'Simulados Autorais Completos 2025/2026 (1º e 2º Dias)',
    category: 'Simulados',
    description: 'Coleção completa de Simulados Autorais (1 ao 12) de 1º e 2º Dias com cadernos de prova, cartões de resposta, gabaritos oficiais e resoluções comentadas passo a passo.',
    instructor: 'Banca Autoral da Biblioteca',
    institution: 'Biblioteca Oficial',
    coverUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    originalUrl: `${TELEGRAM_CHANNEL_BASE}7`,
    platform: 'Biblioteca Telegram',
    modulesCount: simModules.length,
    lessonsCount: simModules.reduce((acc, m) => acc + m.lessons.length, 0),
    isFavorite: false,
    progressPercent: 0,
    stoppedAtLessonId: simModules[0]?.lessons[0]?.id,
    stoppedAtLessonTitle: 'Prova - Simulado Autoral 1 - 1º Dia',
    createdAt: '2025-01-01T00:00:00Z',
    modules: simModules
  };

  return [
    courseMat,
    courseFis,
    courseQui,
    courseRed,
    coursePort,
    courseBio,
    courseHist,
    courseGeo,
    courseFilSoc,
    courseSim
  ];
}
