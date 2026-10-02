export type SubjectCategory =
  | 'Concursos Militares'
  | 'Matemática'
  | 'Física'
  | 'Química'
  | 'Biologia'
  | 'Português'
  | 'Redação'
  | 'História'
  | 'Geografia'
  | 'Filosofia'
  | 'Sociologia'
  | 'Simulados'
  | 'Informática'
  | 'Outros';

export interface Course {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: SubjectCategory | string;
  instructor?: string;
  institution?: string;
  coverUrl?: string;
  originalUrl?: string;
  platform?: string;
  modulesCount: number;
  lessonsCount: number;
  isFavorite?: boolean;
  progressPercent: number;
  lastLessonId?: string;
  lastStudiedAt?: string;
  stoppedAtLessonId?: string;
  stoppedAtLessonTitle?: string;
  createdAt: string;
  updatedAt?: string;
  modules?: CourseModule[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  description?: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  userId: string;
  courseId: string;
  moduleId: string;
  moduleTitle?: string;
  title: string;
  type: 'video' | 'pdf' | 'article';
  mediaUrl: string; // Direct link, Telegram link, YouTube, Drive or PDF url
  durationMinutes?: number;
  sizeMb?: number;
  order: number;
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
  externalId?: number; // Telegram message ID or source ID
  createdAt?: string;
}

export type NoteStatus = 'aprendi' | 'revisar' | 'dificuldade' | 'importante';

export interface StudyNote {
  id: string;
  userId: string;
  title: string;
  content: string;
  subject: string;
  courseId?: string;
  courseTitle?: string;
  lessonId?: string;
  lessonTitle?: string;
  status: NoteStatus;
  isFavorite?: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type QuestionDifficulty = 'facil' | 'medio' | 'dificil';

export interface Question {
  id: string;
  userId: string;
  statement: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: string;
  topic: string;
  difficulty: QuestionDifficulty;
  origin?: string;
  courseId?: string;
  isFavorite?: boolean;
  createdAt?: string;
}

export interface QuestionAttempt {
  id: string;
  userId: string;
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  timestamp: string;
  timeSpentSeconds: number;
}

export interface Quiz {
  id: string;
  userId: string;
  title: string;
  description?: string;
  subject?: string;
  questionCount: number;
  timeMinutes: number;
  difficulty?: string;
  questions: Question[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  scorePercent: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  answers: { questionId: string; selectedIndex: number; isCorrect: boolean }[];
  subjectBreakdown: Record<string, { correct: number; total: number }>;
  completedAt: string;
}

export interface Flashcard {
  id: string;
  userId: string;
  front: string;
  back: string;
  subject: string;
  topic?: string;
  courseId?: string;
  difficulty: QuestionDifficulty;
  repetitions: number;
  nextReviewDate: string; // YYYY-MM-DD
  lastReviewedAt?: string;
  createdAt: string;
}

export interface SpacedReview {
  id: string;
  userId: string;
  title: string;
  subject: string;
  courseId?: string;
  lessonId?: string;
  noteId?: string;
  intervalStage: 1 | 2 | 3; // 1 = 1 day, 2 = 7 days, 3 = 30 days
  nextReviewDate: string; // YYYY-MM-DD
  status: 'pending' | 'completed' | 'delayed';
  lastReviewedAt?: string;
}

export interface StudySession {
  id: string;
  userId: string;
  subject: string;
  courseTitle?: string;
  activityType: 'videoaula' | 'leitura' | 'questoes' | 'revisao';
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  notes?: string;
  timestamp: number;
}

export interface RoutineTask {
  id: string;
  userId: string;
  title: string;
  subject: string;
  courseId?: string;
  scheduledTime: string; // HH:mm
  durationMinutes: number;
  status: 'pendente' | 'em_andamento' | 'concluida';
  date: string; // YYYY-MM-DD
  createdAt?: string;
}

export interface StudyMaterial {
  id: string;
  userId: string;
  title: string;
  type: 'pdf' | 'apostila' | 'resumo' | 'exercicios' | 'link';
  url: string;
  subject: string;
  sizeMb?: number;
  folder?: string;
  courseTitle?: string;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  targetExam: string; // e.g. ITA, IME, ESA, EsPCEx, EEAR, AFA, Naval
  targetYear?: string;
  dailyGoalMinutes: number;
  weeklyGoalHours: number;
  streakDays: number;
  lastStudyDate?: string;
  totalStudyMinutes: number;
  completedLessonsCount: number;
  stoppedCheckpoints?: Record<string, string>; // courseId -> lessonTitle or description
  notificationPreferences?: NotificationPreferences;
  createdAt: string;
  updatedAt: string;
}

export type NotificationCategory =
  | 'spaced_review'
  | 'flashcard'
  | 'routine_session'
  | 'daily_goal'
  | 'quiz_exam'
  | 'system';

export interface InAppNotification {
  id: string;
  userId: string;
  category: NotificationCategory;
  title: string;
  message: string;
  actionLabel?: string;
  actionView?: string; // AppView name
  actionCourseId?: string;
  actionLessonId?: string;
  isRead: boolean;
  createdAt: string;
  scheduledFor?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface NotificationCategoryPreferences {
  spacedReviews: boolean;
  flashcards: boolean;
  routineTasks: boolean;
  dailyGoal: boolean;
  quizExams: boolean;
}

export interface NotificationPreferences {
  enabled: boolean;
  pushEnabled: boolean;
  internalEnabled: boolean; // Always prioritized when push is unavailable
  soundEnabled: boolean;
  categories: NotificationCategoryPreferences;
  advanceMinutesForRoutine: number; // e.g. 0, 5, 10, 15
  morningReviewReminderTime: string; // e.g. "08:00"
  eveningGoalReminderTime: string; // e.g. "19:30"
}

export interface MilitaryExamInfo {
  id: string;
  name: string;
  fullName: string;
  institution: string;
  badgeColor: string;
  targetCareer: string;
  officialEditalUrl: string;
  requirements: {
    age: string;
    education: string;
    height: string;
    maritalStatus: string;
    other: string[];
  };
  stages: string[];
  subjects: {
    name: string;
    weightOrQuestions: string;
    topics: { id: string; title: string; isChecked: boolean }[];
  }[];
  tips: string;
}

export type SummaryCategory =
  | 'aula'
  | 'materia'
  | 'modulo'
  | 'prova'
  | 'revisao_rapida'
  | 'formulas_regras'
  | 'livros_apostilas';

export interface EducationalSummary {
  id: string;
  userId: string;
  title: string;
  category: SummaryCategory;
  subject: string;
  topic?: string;
  courseId?: string;
  courseTitle?: string;
  lessonId?: string;
  lessonTitle?: string;
  content: string; // Markdown / formatted text
  subheadings?: string[];
  keyConcepts?: string[];
  definitions?: { term: string; meaning: string }[];
  formulas?: string[];
  solvedExamples?: { problem: string; solution: string }[];
  practicalExamples?: string[];
  tags: string[];
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PastExam {
  id: string;
  institution: 'ITA' | 'IME' | 'AFA' | 'EFOMM' | 'EsPCEx' | 'Colégio Naval' | 'EEAR' | 'Outros';
  year: number;
  title: string;
  phase: string; // 1ª Fase, 2ª Fase, Prova Única
  subjects: string[];
  totalQuestions: number;
  durationMinutes: number;
  pdfQuestionUrl?: string;
  pdfAnswerUrl?: string;
  officialSourceUrl?: string;
  isOfficial: boolean;
  questions?: Question[];
  solvedCount?: number;
  scorePercent?: number;
  createdAt?: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  keywords?: string[];
  color?: string;
  icon?: string;
  children?: MindMapNode[];
}

export interface MindMap {
  id: string;
  userId: string;
  title: string;
  subject: string;
  courseId?: string;
  courseTitle?: string;
  rootNode: MindMapNode;
  tags: string[];
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormulaItem {
  id: string;
  title: string;
  subject: string;
  category: 'Matemática' | 'Física' | 'Química' | 'Português' | 'Redação' | 'Geral';
  topic: string;
  expression: string; // The formula or rule
  explanation: string;
  example?: string;
  exceptions?: string;
  tags: string[];
  isFavorite?: boolean;
  createdAt?: string;
}

export interface ExerciseList {
  id: string;
  userId: string;
  name: string;
  description?: string;
  subject: string;
  topic?: string;
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  questionIds: string[];
  isCompleted?: boolean;
  solvedCount?: number;
  correctCount?: number;
  deadline?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningPathMilestone {
  id: string;
  title: string;
  description: string;
  subject: string;
  targetType: 'course' | 'module' | 'lesson' | 'quiz' | 'summary' | 'exercise_list';
  targetId?: string;
  durationHours: number;
  isCompleted: boolean;
  prerequisites?: string[]; // IDs of previous milestones
}

export interface LearningPath {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string; // e.g. ITA / IME, AFA / EFOMM, EsPCEx, Geral
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Elite Militar';
  icon: string;
  bannerUrl?: string;
  milestones: LearningPathMilestone[];
  progressPercent: number;
  isEnrolled: boolean;
}

export interface EssayCompetency {
  name: string;
  description: string;
  maxScore: number;
  score?: number;
  feedback?: string;
}

export interface Essay {
  id: string;
  userId: string;
  title: string;
  theme: string;
  subjectOrExam: string; // ITA, EsPCEx, AFA, Fuvest, Geral
  content: string; // The written essay
  wordCount: number;
  lineCount: number;
  status: 'draft' | 'submitted' | 'corrected';
  aiFeedback?: {
    overallScore: number;
    maxScore: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    competencies: EssayCompetency[];
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
