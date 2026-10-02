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
  createdAt: string;
  updatedAt: string;
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
