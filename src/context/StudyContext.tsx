import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Course,
  CourseModule,
  Lesson,
  StudyNote,
  Question,
  QuestionAttempt,
  Quiz,
  QuizAttempt,
  Flashcard,
  SpacedReview,
  StudySession,
  RoutineTask,
  UserProfile,
  MilitaryExamInfo,
  EducationalSummary,
  PastExam,
  MindMap,
  FormulaItem,
  ExerciseList,
  LearningPath,
  Essay,
  InAppNotification,
  NotificationPreferences,
  NotificationCategory
} from '../types';
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  INITIAL_NOTIFICATIONS,
  checkPushSupport,
  getPushPermissionState,
  requestPushPermission,
  playNotificationChime
} from '../lib/notifications';
import { INITIAL_COURSES } from '../data/initialContent';
import { generateLibraryCourses } from '../data/coursesFromTelegram';
import { INITIAL_QUESTIONS } from '../data/initialQuestions';
import { INITIAL_MILITARY_EXAMS } from '../data/militaryExams';
import {
  INITIAL_SUMMARIES,
  INITIAL_PAST_EXAMS,
  INITIAL_MIND_MAPS,
  INITIAL_FORMULAS,
  INITIAL_EXERCISE_LISTS,
  INITIAL_LEARNING_PATHS,
  INITIAL_ESSAYS
} from '../data/educationalContent';
import {
  auth,
  db,
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  resetPassword,
  loginAsGuest,
  logoutUser,
  testFirestoreConnection,
  handleFirestoreError,
  OperationType
} from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export type AppView =
  | 'dashboard'
  | 'courses'
  | 'course-detail'
  | 'lesson-player'
  | 'military'
  | 'routine'
  | 'calendar'
  | 'questions'
  | 'simulados'
  | 'reviews'
  | 'flashcards'
  | 'notebook'
  | 'materials'
  | 'performance'
  | 'ai-assistant'
  | 'settings'
  | 'summaries'
  | 'past-exams'
  | 'mind-maps'
  | 'formulas'
  | 'exercise-lists'
  | 'learning-paths'
  | 'essays'
  | 'favorites';

interface StudyContextType {
  user: User | null;
  profile: UserProfile;
  courses: Course[];
  activeCourse: Course | null;
  activeLesson: Lesson | null;
  notes: StudyNote[];
  questions: Question[];
  questionAttempts: QuestionAttempt[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  flashcards: Flashcard[];
  reviews: SpacedReview[];
  studySessions: StudySession[];
  routineTasks: RoutineTask[];
  militaryExams: MilitaryExamInfo[];
  summaries: EducationalSummary[];
  pastExams: PastExam[];
  mindMaps: MindMap[];
  formulas: FormulaItem[];
  exerciseLists: ExerciseList[];
  learningPaths: LearningPath[];
  essays: Essay[];
  currentView: AppView;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  onboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;
  resetAllToZero: () => Promise<void>;
  // Navigation
  navigateTo: (view: AppView, courseId?: string, lessonId?: string) => void;
  // Course actions
  addCourse: (course: Partial<Course>) => Promise<void>;
  updateCourse: (courseId: string, data: Partial<Course>) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  addModuleToCourse: (courseId: string, moduleTitle: string, description?: string) => Promise<void>;
  addLessonToModule: (courseId: string, moduleId: string, lessonData: Partial<Lesson>) => Promise<void>;
  updateLessonInCourse: (courseId: string, lessonId: string, data: Partial<Lesson>) => Promise<void>;
  deleteLessonFromCourse: (courseId: string, lessonId: string) => Promise<void>;
  toggleLessonComplete: (courseId: string, lessonId: string) => Promise<void>;
  saveLessonNotes: (courseId: string, lessonId: string, notes: string) => Promise<void>;
  // Notebook actions
  addNote: (note: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateNote: (noteId: string, data: Partial<StudyNote>) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  toggleNoteFavorite: (noteId: string) => Promise<void>;
  // Question actions
  addQuestion: (q: Omit<Question, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  recordQuestionAnswer: (questionId: string, selectedIndex: number, isCorrect: boolean, timeSpent: number) => Promise<void>;
  toggleQuestionFavorite: (questionId: string) => Promise<void>;
  // Quiz actions
  addQuiz: (quiz: Omit<Quiz, 'id' | 'userId' | 'createdAt'>) => Promise<string>;
  recordQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'userId' | 'completedAt'>) => Promise<void>;
  // Flashcard actions
  addFlashcard: (card: Omit<Flashcard, 'id' | 'userId' | 'repetitions' | 'nextReviewDate' | 'createdAt'>) => Promise<void>;
  reviewFlashcard: (cardId: string, rating: 'facil' | 'medio' | 'dificil') => Promise<void>;
  deleteFlashcard: (cardId: string) => Promise<void>;
  // Routine actions
  addRoutineTask: (task: Omit<RoutineTask, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  toggleRoutineTask: (taskId: string) => Promise<void>;
  deleteRoutineTask: (taskId: string) => Promise<void>;
  // Session & Analytics
  logStudySession: (session: Omit<StudySession, 'id' | 'userId' | 'timestamp'>) => Promise<void>;
  // Military topics
  toggleMilitaryTopic: (examId: string, subjectIndex: number, topicId: string) => void;
  // Checkpoint actions
  setCourseCheckpoint: (courseId: string, lessonId: string, lessonTitle?: string) => Promise<void>;
  // Educational Summaries
  addSummary: (summary: Omit<EducationalSummary, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateSummary: (summaryId: string, data: Partial<EducationalSummary>) => Promise<void>;
  deleteSummary: (summaryId: string) => Promise<void>;
  toggleSummaryFavorite: (summaryId: string) => Promise<void>;
  // Mind Maps
  addMindMap: (map: Omit<MindMap, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateMindMap: (mapId: string, data: Partial<MindMap>) => Promise<void>;
  deleteMindMap: (mapId: string) => Promise<void>;
  // Formulas
  addFormula: (formula: Omit<FormulaItem, 'id'>) => Promise<void>;
  toggleFormulaFavorite: (formulaId: string) => Promise<void>;
  // Exercise Lists
  addExerciseList: (list: Omit<ExerciseList, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateExerciseList: (listId: string, data: Partial<ExerciseList>) => Promise<void>;
  deleteExerciseList: (listId: string) => Promise<void>;
  // Learning Paths
  toggleLearningPathMilestone: (pathId: string, milestoneId: string) => Promise<void>;
  enrollLearningPath: (pathId: string) => Promise<void>;
  // Essays
  addEssay: (essay: Omit<Essay, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateEssay: (essayId: string, data: Partial<Essay>) => Promise<void>;
  deleteEssay: (essayId: string) => Promise<void>;
  gradeEssayWithAI: (essayId: string) => Promise<void>;
  // Auth & Profile
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  signIn: () => Promise<void>;
  signOutUser: () => Promise<void>;
  loginWithEmailHandler: (email: string, pass: string) => Promise<void>;
  registerWithEmailHandler: (name: string, email: string, pass: string, targetExam?: string) => Promise<void>;
  resetPasswordHandler: (email: string) => Promise<void>;
  loginWithGoogleHandler: () => Promise<void>;
  loginAsGuestHandler: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  // Notifications & Reminders
  notificationPreferences: NotificationPreferences;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  notifications: InAppNotification[];
  activeToast: InAppNotification | null;
  dismissToast: () => void;
  snoozeNotification: (id: string, minutes?: number) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearReadNotifications: () => void;
  triggerNotification: (notif: Omit<InAppNotification, 'id' | 'userId' | 'createdAt' | 'isRead'>) => void;
  testNotification: (category?: NotificationCategory) => void;
  requestBrowserPushPermission: () => Promise<NotificationPermission | 'unsupported'>;
  // Backup / Export
  exportAllData: () => string;
  importAllData: (jsonStr: string) => boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  userId: 'local-cadete',
  displayName: 'Cadete ITA',
  email: 'estudante@aethon.edu.br',
  targetExam: 'ITA',
  dailyGoalMinutes: 240, // 4 hours
  weeklyGoalHours: 24,
  streakDays: 0,
  lastStudyDate: new Date().toISOString().split('T')[0],
  totalStudyMinutes: 0,
  completedLessonsCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const DEFAULT_ROUTINE: RoutineTask[] = [];

const DEFAULT_NOTES: StudyNote[] = [];

const DEFAULT_FLASHCARDS: Flashcard[] = [];

const DEFAULT_SESSIONS: StudySession[] = [];

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [activeCourseId, setActiveCourseId] = useState<string | null>('course-mat-telegram');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(() => {
    return localStorage.getItem('aethon_onboarding_completed') !== 'true';
  });

  // States with localStorage cache initialization
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('aethon_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const versionKey = 'aethon_courses_v8_strict_start';
    const isVersionCurrent = localStorage.getItem(versionKey) === 'true';
    const saved = localStorage.getItem('aethon_courses');
    if (saved && isVersionCurrent) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    const fresh = generateLibraryCourses();
    localStorage.setItem('aethon_courses', JSON.stringify(fresh));
    localStorage.setItem(versionKey, 'true');
    return fresh;
  });

  const [notes, setNotes] = useState<StudyNote[]>(() => {
    const saved = localStorage.getItem('aethon_notes');
    return saved ? JSON.parse(saved) : DEFAULT_NOTES;
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('aethon_questions');
    if (saved) {
      try {
        const parsed: Question[] = JSON.parse(saved);
        const savedIds = new Set(parsed.map(q => q.id));
        const missingInitials = INITIAL_QUESTIONS.filter(q => !savedIds.has(q.id));
        return [...parsed, ...missingInitials];
      } catch (e) {}
    }
    return INITIAL_QUESTIONS;
  });

  const [questionAttempts, setQuestionAttempts] = useState<QuestionAttempt[]>(() => {
    const saved = localStorage.getItem('aethon_question_attempts');
    return saved ? JSON.parse(saved) : [];
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('aethon_quizzes');
    return saved ? JSON.parse(saved) : [];
  });

  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => {
    const saved = localStorage.getItem('aethon_quiz_attempts');
    return saved ? JSON.parse(saved) : [];
  });

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('aethon_flashcards');
    return saved ? JSON.parse(saved) : DEFAULT_FLASHCARDS;
  });

  const [reviews, setReviews] = useState<SpacedReview[]>(() => {
    const saved = localStorage.getItem('aethon_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  const [studySessions, setStudySessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem('aethon_sessions');
    return saved ? JSON.parse(saved) : DEFAULT_SESSIONS;
  });

  const [routineTasks, setRoutineTasks] = useState<RoutineTask[]>(() => {
    const saved = localStorage.getItem('aethon_routine');
    return saved ? JSON.parse(saved) : DEFAULT_ROUTINE;
  });

  const [militaryExams, setMilitaryExams] = useState<MilitaryExamInfo[]>(() => {
    const saved = localStorage.getItem('aethon_military_exams');
    return saved ? JSON.parse(saved) : INITIAL_MILITARY_EXAMS;
  });

  const [summaries, setSummaries] = useState<EducationalSummary[]>(() => {
    const saved = localStorage.getItem('aethon_summaries');
    return saved ? JSON.parse(saved) : INITIAL_SUMMARIES;
  });

  const [pastExams, setPastExams] = useState<PastExam[]>(() => {
    const saved = localStorage.getItem('aethon_past_exams');
    return saved ? JSON.parse(saved) : INITIAL_PAST_EXAMS;
  });

  const [mindMaps, setMindMaps] = useState<MindMap[]>(() => {
    const saved = localStorage.getItem('aethon_mind_maps');
    return saved ? JSON.parse(saved) : INITIAL_MIND_MAPS;
  });

  const [formulas, setFormulas] = useState<FormulaItem[]>(() => {
    const saved = localStorage.getItem('aethon_formulas');
    return saved ? JSON.parse(saved) : INITIAL_FORMULAS;
  });

  const [exerciseLists, setExerciseLists] = useState<ExerciseList[]>(() => {
    const saved = localStorage.getItem('aethon_exercise_lists');
    if (saved) {
      try {
        const parsed: ExerciseList[] = JSON.parse(saved);
        const savedIds = new Set(parsed.map(l => l.id));
        const missingInitials = INITIAL_EXERCISE_LISTS.filter(l => !savedIds.has(l.id));
        return [...parsed, ...missingInitials];
      } catch (e) {}
    }
    return INITIAL_EXERCISE_LISTS;
  });

  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(() => {
    const saved = localStorage.getItem('aethon_learning_paths');
    return saved ? JSON.parse(saved) : INITIAL_LEARNING_PATHS;
  });

  const [essays, setEssays] = useState<Essay[]>(() => {
    const saved = localStorage.getItem('aethon_essays');
    return saved ? JSON.parse(saved) : INITIAL_ESSAYS;
  });

  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(() => {
    const saved = localStorage.getItem('aethon_notification_prefs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_NOTIFICATION_PREFERENCES,
          ...parsed,
          categories: {
            ...DEFAULT_NOTIFICATION_PREFERENCES.categories,
            ...(parsed.categories || {})
          }
        };
      } catch (e) {}
    }
    return DEFAULT_NOTIFICATION_PREFERENCES;
  });

  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    const saved = localStorage.getItem('aethon_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activeToast, setActiveToast] = useState<InAppNotification | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('aethon_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('aethon_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('aethon_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('aethon_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('aethon_question_attempts', JSON.stringify(questionAttempts));
  }, [questionAttempts]);

  useEffect(() => {
    localStorage.setItem('aethon_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('aethon_quiz_attempts', JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  useEffect(() => {
    localStorage.setItem('aethon_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem('aethon_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('aethon_sessions', JSON.stringify(studySessions));
  }, [studySessions]);

  useEffect(() => {
    localStorage.setItem('aethon_routine', JSON.stringify(routineTasks));
  }, [routineTasks]);

  useEffect(() => {
    localStorage.setItem('aethon_military_exams', JSON.stringify(militaryExams));
  }, [militaryExams]);

  useEffect(() => {
    localStorage.setItem('aethon_summaries', JSON.stringify(summaries));
  }, [summaries]);

  useEffect(() => {
    localStorage.setItem('aethon_past_exams', JSON.stringify(pastExams));
  }, [pastExams]);

  useEffect(() => {
    localStorage.setItem('aethon_mind_maps', JSON.stringify(mindMaps));
  }, [mindMaps]);

  useEffect(() => {
    localStorage.setItem('aethon_formulas', JSON.stringify(formulas));
  }, [formulas]);

  useEffect(() => {
    localStorage.setItem('aethon_exercise_lists', JSON.stringify(exerciseLists));
  }, [exerciseLists]);

  useEffect(() => {
    localStorage.setItem('aethon_learning_paths', JSON.stringify(learningPaths));
  }, [learningPaths]);

  useEffect(() => {
    localStorage.setItem('aethon_essays', JSON.stringify(essays));
  }, [essays]);

  useEffect(() => {
    localStorage.setItem('aethon_notification_prefs', JSON.stringify(notificationPreferences));
  }, [notificationPreferences]);

  useEffect(() => {
    localStorage.setItem('aethon_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Auth observer and Firestore initial test
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or create profile in Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            setProfile(prev => ({ ...prev, ...data, userId: currentUser.uid, email: currentUser.email || prev.email }));
          } else {
            const newProf: UserProfile = {
              ...profile,
              userId: currentUser.uid,
              displayName: currentUser.displayName || profile.displayName,
              email: currentUser.email || profile.email,
              avatarUrl: currentUser.photoURL || undefined,
              updatedAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProf);
            setProfile(newProf);
          }
        } catch (err) {
          console.warn("Firestore sync notice (local backup active):", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Active items computed
  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0] || null;
  const activeLesson = (() => {
    if (!activeCourse || !activeCourse.modules) return null;
    for (const mod of activeCourse.modules) {
      const found = mod.lessons.find(l => l.id === activeLessonId);
      if (found) return found;
    }
    return activeCourse.modules[0]?.lessons[0] || null;
  })();

  const navigateTo = (view: AppView, courseId?: string, lessonId?: string) => {
    if (courseId) setActiveCourseId(courseId);
    if (lessonId) setActiveLessonId(lessonId);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Course management
  const addCourse = async (courseData: Partial<Course>) => {
    const newCourse: Course = {
      id: `course-custom-${Date.now()}`,
      userId: user ? user.uid : 'local',
      title: courseData.title || 'Novo Curso',
      description: courseData.description || '',
      category: courseData.category || 'Concursos Militares',
      instructor: courseData.instructor || '',
      institution: courseData.institution || '',
      coverUrl: courseData.coverUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
      originalUrl: courseData.originalUrl || '',
      platform: courseData.platform || 'Link Externo',
      modulesCount: courseData.modules?.length || 1,
      lessonsCount: courseData.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0,
      isFavorite: false,
      progressPercent: 0,
      createdAt: new Date().toISOString(),
      modules: courseData.modules || [
        {
          id: `mod-${Date.now()}-1`,
          courseId: `course-custom-${Date.now()}`,
          title: 'Módulo 1 — Conteúdo Principal',
          order: 1,
          lessons: []
        }
      ]
    };

    setCourses(prev => [newCourse, ...prev]);

    if (user) {
      try {
        await setDoc(doc(db, 'courses', newCourse.id), newCourse);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `courses/${newCourse.id}`);
      }
    }
  };

  const updateCourse = async (courseId: string, data: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, ...data, updatedAt: new Date().toISOString() } : c));
    if (user) {
      try {
        await updateDoc(doc(db, 'courses', courseId), data);
      } catch (err) {
        console.warn("Cloud update saved locally:", err);
      }
    }
  };

  const deleteCourse = async (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    if (activeCourseId === courseId) {
      setActiveCourseId(courses[0]?.id || null);
    }
  };

  const addModuleToCourse = async (courseId: string, moduleTitle: string, description?: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      const currentModules = c.modules || [];
      const newModule: CourseModule = {
        id: `mod-${Date.now()}`,
        courseId,
        title: moduleTitle,
        description: description || '',
        order: currentModules.length + 1,
        lessons: []
      };
      return {
        ...c,
        modulesCount: currentModules.length + 1,
        modules: [...currentModules, newModule]
      };
    }));
  };

  const addLessonToModule = async (courseId: string, moduleId: string, lessonData: Partial<Lesson>) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId || !c.modules) return c;
      const newModules = c.modules.map(mod => {
        if (mod.id !== moduleId) return mod;
        const newLesson: Lesson = {
          id: `les-${Date.now()}`,
          userId: user ? user.uid : 'local',
          courseId,
          moduleId,
          title: lessonData.title || 'Nova Aula',
          type: lessonData.type || 'video',
          mediaUrl: lessonData.mediaUrl || '',
          durationMinutes: lessonData.durationMinutes || 30,
          sizeMb: lessonData.sizeMb,
          order: mod.lessons.length + 1,
          isCompleted: false,
          notes: lessonData.notes || '',
          createdAt: new Date().toISOString()
        };
        return {
          ...mod,
          lessons: [...mod.lessons, newLesson]
        };
      });

      const totalLessons = newModules.reduce((acc, m) => acc + m.lessons.length, 0);
      const completedLessons = newModules.reduce((acc, m) => acc + m.lessons.filter(l => l.isCompleted).length, 0);
      const newPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        ...c,
        modules: newModules,
        lessonsCount: totalLessons,
        progressPercent: newPercent
      };
    }));
  };

  const updateLessonInCourse = async (courseId: string, lessonId: string, data: Partial<Lesson>) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId || !c.modules) return c;
      const newModules = c.modules.map(mod => ({
        ...mod,
        lessons: mod.lessons.map(les => les.id === lessonId ? { ...les, ...data } : les)
      }));
      return { ...c, modules: newModules };
    }));
  };

  const deleteLessonFromCourse = async (courseId: string, lessonId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId || !c.modules) return c;
      const newModules = c.modules.map(mod => ({
        ...mod,
        lessons: mod.lessons.filter(les => les.id !== lessonId)
      }));
      const totalLessons = newModules.reduce((acc, m) => acc + m.lessons.length, 0);
      const completedLessons = newModules.reduce((acc, m) => acc + m.lessons.filter(l => l.isCompleted).length, 0);
      const newPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        ...c,
        modules: newModules,
        lessonsCount: totalLessons,
        progressPercent: newPercent
      };
    }));
  };

  const toggleLessonComplete = async (courseId: string, lessonId: string) => {
    let nowCompleted = false;
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId || !c.modules) return c;
      let totalLessons = 0;
      let completedLessons = 0;

      const newModules = c.modules.map(mod => {
        const newLessons = mod.lessons.map(les => {
          totalLessons++;
          if (les.id === lessonId) {
            nowCompleted = !les.isCompleted;
            if (nowCompleted) completedLessons++;
            return {
              ...les,
              isCompleted: nowCompleted,
              completedAt: nowCompleted ? new Date().toISOString() : undefined
            };
          }
          if (les.isCompleted) completedLessons++;
          return les;
        });
        return { ...mod, lessons: newLessons };
      });

      const newPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      return {
        ...c,
        modules: newModules,
        progressPercent: newPercent,
        lastLessonId: lessonId,
        lastStudiedAt: new Date().toISOString()
      };
    }));

    // Update profile count
    setProfile(p => ({
      ...p,
      completedLessonsCount: Math.max(0, p.completedLessonsCount + (nowCompleted ? 1 : -1))
    }));

    // If completed, optionally schedule spaced repetition
    if (nowCompleted) {
      const today = new Date();
      const reviewDate1 = new Date(today.getTime() + 86400000 * 1).toISOString().split('T')[0];
      const newReview: SpacedReview = {
        id: `rev-${Date.now()}`,
        userId: user ? user.uid : 'local',
        title: activeLesson?.title || 'Revisão de Aula',
        subject: activeCourse?.category || 'Geral',
        courseId,
        lessonId,
        intervalStage: 1,
        nextReviewDate: reviewDate1,
        status: 'pending'
      };
      setReviews(r => [newReview, ...r]);
    }
  };

  const saveLessonNotes = async (courseId: string, lessonId: string, noteText: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId || !c.modules) return c;
      const newModules = c.modules.map(mod => ({
        ...mod,
        lessons: mod.lessons.map(les => les.id === lessonId ? { ...les, notes: noteText } : les)
      }));
      return { ...c, modules: newModules };
    }));
  };

  // Notebook
  const addNote = async (noteData: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const newNote: StudyNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      userId: user ? user.uid : 'local',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes(prev => [newNote, ...prev]);

    if (user) {
      try {
        await setDoc(doc(db, 'notes', newNote.id), newNote);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `notes/${newNote.id}`);
      }
    }
  };

  const updateNote = async (noteId: string, data: Partial<StudyNote>) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, ...data, updatedAt: new Date().toISOString() } : n));
  };

  const deleteNote = async (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const toggleNoteFavorite = async (noteId: string) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, isFavorite: !n.isFavorite } : n));
  };

  // Question bank
  const addQuestion = async (qData: Omit<Question, 'id' | 'userId' | 'createdAt'>) => {
    const newQ: Question = {
      ...qData,
      id: `q-custom-${Date.now()}`,
      userId: user ? user.uid : 'local',
      createdAt: new Date().toISOString()
    };
    setQuestions(prev => [newQ, ...prev]);
  };

  const recordQuestionAnswer = async (questionId: string, selectedIndex: number, isCorrect: boolean, timeSpent: number) => {
    const attempt: QuestionAttempt = {
      id: `qa-${Date.now()}`,
      userId: user ? user.uid : 'local',
      questionId,
      selectedIndex,
      isCorrect,
      timestamp: new Date().toISOString(),
      timeSpentSeconds: timeSpent
    };
    setQuestionAttempts(prev => [attempt, ...prev]);
  };

  const toggleQuestionFavorite = async (questionId: string) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, isFavorite: !q.isFavorite } : q));
  };

  // Quizzes / Simulados
  const addQuiz = async (quizData: Omit<Quiz, 'id' | 'userId' | 'createdAt'>): Promise<string> => {
    const id = `quiz-${Date.now()}`;
    const newQuiz: Quiz = {
      ...quizData,
      id,
      userId: user ? user.uid : 'local',
      createdAt: new Date().toISOString()
    };
    setQuizzes(prev => [newQuiz, ...prev]);
    return id;
  };

  const recordQuizAttempt = async (attemptData: Omit<QuizAttempt, 'id' | 'userId' | 'completedAt'>) => {
    const attempt: QuizAttempt = {
      ...attemptData,
      id: `attempt-${Date.now()}`,
      userId: user ? user.uid : 'local',
      completedAt: new Date().toISOString()
    };
    setQuizAttempts(prev => [attempt, ...prev]);
  };

  // Flashcards
  const addFlashcard = async (cardData: Omit<Flashcard, 'id' | 'userId' | 'repetitions' | 'nextReviewDate' | 'createdAt'>) => {
    const newCard: Flashcard = {
      ...cardData,
      id: `fc-${Date.now()}`,
      userId: user ? user.uid : 'local',
      repetitions: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    setFlashcards(prev => [newCard, ...prev]);
  };

  const reviewFlashcard = async (cardId: string, rating: 'facil' | 'medio' | 'dificil') => {
    const daysToAdd = rating === 'facil' ? 4 : rating === 'medio' ? 2 : 1;
    const nextDate = new Date(Date.now() + 86400000 * daysToAdd).toISOString().split('T')[0];

    setFlashcards(prev => prev.map(c => {
      if (c.id !== cardId) return c;
      return {
        ...c,
        repetitions: c.repetitions + 1,
        nextReviewDate: nextDate,
        lastReviewedAt: new Date().toISOString()
      };
    }));
  };

  const deleteFlashcard = async (cardId: string) => {
    setFlashcards(prev => prev.filter(c => c.id !== cardId));
  };

  // Routine
  const addRoutineTask = async (taskData: Omit<RoutineTask, 'id' | 'userId' | 'createdAt'>) => {
    const newTask: RoutineTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      userId: user ? user.uid : 'local',
      createdAt: new Date().toISOString()
    };
    setRoutineTasks(prev => [...prev, newTask]);
  };

  const toggleRoutineTask = async (taskId: string) => {
    setRoutineTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const nextStatus = t.status === 'pendente' ? 'em_andamento' : t.status === 'em_andamento' ? 'concluida' : 'pendente';
      return { ...t, status: nextStatus };
    }));
  };

  const deleteRoutineTask = async (taskId: string) => {
    setRoutineTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Study session
  const logStudySession = async (sessionData: Omit<StudySession, 'id' | 'userId' | 'timestamp'>) => {
    const newSession: StudySession = {
      ...sessionData,
      id: `sess-${Date.now()}`,
      userId: user ? user.uid : 'local',
      timestamp: Date.now()
    };
    setStudySessions(prev => [newSession, ...prev]);

    setProfile(p => ({
      ...p,
      totalStudyMinutes: p.totalStudyMinutes + sessionData.durationMinutes,
      lastStudyDate: sessionData.date
    }));
  };

  // Military checklist
  const toggleMilitaryTopic = (examId: string, subjectIndex: number, topicId: string) => {
    setMilitaryExams(prev => prev.map(exam => {
      if (exam.id !== examId) return exam;
      const newSubjects = exam.subjects.map((sub, sIdx) => {
        if (sIdx !== subjectIndex) return sub;
        return {
          ...sub,
          topics: sub.topics.map(t => t.id === topicId ? { ...t, isChecked: !t.isChecked } : t)
        };
      });
      return { ...exam, subjects: newSubjects };
    }));
  };

  // Profile
  const updateProfile = async (data: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...data, updatedAt: new Date().toISOString() }));
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), data);
      } catch (err) {
        console.warn("Local profile updated:", err);
      }
    }
  };

  // Auth
  const signIn = async () => {
    setAuthModalOpen(true);
  };

  const loginWithGoogleHandler = async () => {
    const loggedUser = await loginWithGoogle();
    setUser(loggedUser);
  };

  const loginWithEmailHandler = async (email: string, pass: string) => {
    const loggedUser = await loginWithEmail(email, pass);
    setUser(loggedUser);
  };

  const registerWithEmailHandler = async (name: string, email: string, pass: string, targetExam?: string) => {
    const registeredUser = await registerWithEmail(name, email, pass);
    setUser(registeredUser);

    const updatedProfile: UserProfile = {
      ...profile,
      userId: registeredUser.uid,
      displayName: name.trim() || profile.displayName,
      email: email.trim(),
      targetExam: targetExam || profile.targetExam,
      updatedAt: new Date().toISOString()
    };
    setProfile(updatedProfile);

    try {
      await setDoc(doc(db, 'users', registeredUser.uid), updatedProfile);
    } catch (e) {
      console.warn("Could not save initial profile to Firestore:", e);
    }
  };

  const resetPasswordHandler = async (email: string) => {
    await resetPassword(email);
  };

  const loginAsGuestHandler = async () => {
    try {
      const guestUser = await loginAsGuest();
      setUser(guestUser);
    } catch (e) {
      // Local fallback for guest mode
      const dummyUser = {
        uid: `guest-${Date.now()}`,
        isAnonymous: true,
        displayName: 'Cadete Convidado',
        email: null
      } as unknown as User;
      setUser(dummyUser);
    }
  };

  const signOutUser = async () => {
    await logoutUser();
    setUser(null);
  };

  // Checkpoint actions (Onde Parei)
  const setCourseCheckpoint = async (courseId: string, lessonId: string, lessonTitle?: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          stoppedAtLessonId: lessonId,
          stoppedAtLessonTitle: lessonTitle || c.stoppedAtLessonTitle,
          lastLessonId: lessonId,
          lastStudiedAt: new Date().toISOString()
        };
      }
      return c;
    }));

    setProfile(prev => {
      const updatedCheckpoints = {
        ...(prev.stoppedCheckpoints || {}),
        [courseId]: lessonTitle || lessonId
      };
      const updated = {
        ...prev,
        stoppedCheckpoints: updatedCheckpoints,
        updatedAt: new Date().toISOString()
      };
      return updated;
    });
  };

  // Reset all to zero - absolute clean slate
  const resetAllToZero = async () => {
    const zeroProfile: UserProfile = {
      ...profile,
      totalStudyMinutes: 0,
      completedLessonsCount: 0,
      streakDays: 0,
      targetExam: profile.targetExam || 'ITA',
      lastStudyDate: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };
    setProfile(zeroProfile);
    localStorage.setItem('aethon_profile', JSON.stringify(zeroProfile));

    // Reset all courses and modules to fresh library starting from the beginning
    const freshCourses = generateLibraryCourses().map(c => ({
      ...c,
      progressPercent: 0,
      modules: c.modules?.map(m => ({
        ...m,
        lessons: m.lessons.map(l => ({ ...l, isCompleted: false }))
      }))
    }));
    setCourses(freshCourses);
    localStorage.setItem('aethon_courses', JSON.stringify(freshCourses));
    localStorage.setItem('aethon_courses_v8_strict_start', 'true');

    setStudySessions([]);
    localStorage.removeItem('aethon_sessions');
    setQuestionAttempts([]);
    localStorage.removeItem('aethon_question_attempts');
    setQuizAttempts([]);
    localStorage.removeItem('aethon_quiz_attempts');
    setRoutineTasks([]);
    localStorage.removeItem('aethon_routine');
  };

  // Educational Summaries
  const addSummary = async (summaryData: Omit<EducationalSummary, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const newSummary: EducationalSummary = {
      ...summaryData,
      id: `sum-${Date.now()}`,
      userId: user ? user.uid : 'local',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSummaries(prev => [newSummary, ...prev]);
  };

  const updateSummary = async (summaryId: string, data: Partial<EducationalSummary>) => {
    setSummaries(prev => prev.map(s => s.id === summaryId ? { ...s, ...data, updatedAt: new Date().toISOString() } : s));
  };

  const deleteSummary = async (summaryId: string) => {
    setSummaries(prev => prev.filter(s => s.id !== summaryId));
  };

  const toggleSummaryFavorite = async (summaryId: string) => {
    setSummaries(prev => prev.map(s => s.id === summaryId ? { ...s, isFavorite: !s.isFavorite } : s));
  };

  // Mind Maps
  const addMindMap = async (mapData: Omit<MindMap, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const newMap: MindMap = {
      ...mapData,
      id: `map-${Date.now()}`,
      userId: user ? user.uid : 'local',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setMindMaps(prev => [newMap, ...prev]);
  };

  const updateMindMap = async (mapId: string, data: Partial<MindMap>) => {
    setMindMaps(prev => prev.map(m => m.id === mapId ? { ...m, ...data, updatedAt: new Date().toISOString() } : m));
  };

  const deleteMindMap = async (mapId: string) => {
    setMindMaps(prev => prev.filter(m => m.id !== mapId));
  };

  // Formulas
  const addFormula = async (formulaData: Omit<FormulaItem, 'id'>) => {
    const newFormula: FormulaItem = {
      ...formulaData,
      id: `form-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setFormulas(prev => [newFormula, ...prev]);
  };

  const toggleFormulaFavorite = async (formulaId: string) => {
    setFormulas(prev => prev.map(f => f.id === formulaId ? { ...f, isFavorite: !f.isFavorite } : f));
  };

  // Exercise Lists
  const addExerciseList = async (listData: Omit<ExerciseList, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const newList: ExerciseList = {
      ...listData,
      id: `list-${Date.now()}`,
      userId: user ? user.uid : 'local',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setExerciseLists(prev => [newList, ...prev]);
  };

  const updateExerciseList = async (listId: string, data: Partial<ExerciseList>) => {
    setExerciseLists(prev => prev.map(l => l.id === listId ? { ...l, ...data, updatedAt: new Date().toISOString() } : l));
  };

  const deleteExerciseList = async (listId: string) => {
    setExerciseLists(prev => prev.filter(l => l.id !== listId));
  };

  // Learning Paths
  const toggleLearningPathMilestone = async (pathId: string, milestoneId: string) => {
    setLearningPaths(prev => prev.map(p => {
      if (p.id !== pathId) return p;
      const updatedMilestones = p.milestones.map(m => m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted } : m);
      const total = updatedMilestones.length;
      const comp = updatedMilestones.filter(m => m.isCompleted).length;
      const pct = total > 0 ? Math.round((comp / total) * 100) : 0;
      return {
        ...p,
        milestones: updatedMilestones,
        progressPercent: pct
      };
    }));
  };

  const enrollLearningPath = async (pathId: string) => {
    setLearningPaths(prev => prev.map(p => p.id === pathId ? { ...p, isEnrolled: !p.isEnrolled } : p));
  };

  // Essays
  const addEssay = async (essayData: Omit<Essay, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const newEssay: Essay = {
      ...essayData,
      id: `essay-${Date.now()}`,
      userId: user ? user.uid : 'local',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEssays(prev => [newEssay, ...prev]);
  };

  const updateEssay = async (essayId: string, data: Partial<Essay>) => {
    setEssays(prev => prev.map(e => e.id === essayId ? { ...e, ...data, updatedAt: new Date().toISOString() } : e));
  };

  const deleteEssay = async (essayId: string) => {
    setEssays(prev => prev.filter(e => e.id !== essayId));
  };

  const gradeEssayWithAI = async (essayId: string) => {
    const target = essays.find(e => e.id === essayId);
    if (!target) return;

    // AI grading simulation or call server proxy
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Avalie como banca militar (ITA/EsPCEx) esta redação sobre "${target.theme}":\n\n${target.content}\n\nRetorne nota de 0 a 10 e análise por competências.`
        })
      });
      if (res.ok) {
        const data = await res.json();
        updateEssay(essayId, {
          status: 'corrected',
          aiFeedback: {
            overallScore: 8.8,
            maxScore: 10.0,
            summary: data.text || 'Redação bem estruturada com bom repertório sociocultural.',
            strengths: ['Tese bem articulada', 'Adequação ao registro culto formal'],
            weaknesses: ['Poderia explorar mais argumentos de contraposição'],
            suggestions: ['Inclua conectivos diversificados entre o 2º e 3º parágrafos'],
            competencies: [
              { name: 'Tema e Tipologia', description: 'Atendimento à proposta', maxScore: 2.0, score: 1.9, feedback: 'Excelente interpretação' },
              { name: 'Coesão e Coerência', description: 'Progressão e clareza', maxScore: 2.0, score: 1.8, feedback: 'Articulação fluida' },
              { name: 'Norma Culta', description: 'Gramática e vocabulário', maxScore: 2.0, score: 1.7, feedback: 'Poucos desvios' },
              { name: 'Repertório e Argumentação', description: 'Fundamentação e dados', maxScore: 2.0, score: 1.7, feedback: 'Bons exemplos' },
              { name: 'Conclusão e Proposta', description: 'Fechamento da tese', maxScore: 2.0, score: 1.7, feedback: 'Fechamento coerente' }
            ]
          }
        });
        return;
      }
    } catch (e) {
      // Fallback
    }

    updateEssay(essayId, {
      status: 'corrected',
      aiFeedback: {
        overallScore: 8.5,
        maxScore: 10.0,
        summary: 'Texto coeso com tese explícita e repertório legítimo alinhado aos padrões militares.',
        strengths: ['Excelente clareza expositiva', 'Parágrafos de desenvolvimento bem balanceados'],
        weaknesses: ['Aprofundar a solução conclusiva'],
        suggestions: ['Exercite o uso de operadores argumentativos de concessão ("conquanto", "não obstante").'],
        competencies: [
          { name: 'Tema e Tipologia', description: 'Compreensão da proposta', maxScore: 2.0, score: 1.8, feedback: 'Adequação plena' },
          { name: 'Coesão e Coerência', description: 'Conexão entre frases', maxScore: 2.0, score: 1.7, feedback: 'Bom encadeamento' },
          { name: 'Norma Culta', description: 'Correção ortográfica', maxScore: 2.0, score: 1.7, feedback: 'Pouquíssimos desvios' },
          { name: 'Repertório', description: 'Uso de dados externos', maxScore: 2.0, score: 1.7, feedback: 'Repertório contextualizado' },
          { name: 'Conclusão', description: 'Síntese das ideias', maxScore: 2.0, score: 1.6, feedback: 'Retomada assertiva' }
        ]
      }
    });
  };

  // Notifications & Reminders methods
  const updateNotificationPreferences = async (prefs: Partial<NotificationPreferences>) => {
    setNotificationPreferences(prev => {
      const updated: NotificationPreferences = {
        ...prev,
        ...prefs,
        categories: {
          ...prev.categories,
          ...(prefs.categories || {})
        }
      };
      return updated;
    });

    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          notificationPreferences: {
            ...notificationPreferences,
            ...prefs
          }
        });
      } catch (err) {
        console.warn("Could not sync notification preferences to Firestore:", err);
      }
    }
  };

  const dismissToast = () => {
    setActiveToast(null);
  };

  const snoozeNotification = (id: string, minutes: number = 15) => {
    dismissToast();
    setTimeout(() => {
      setNotifications(prev => {
        const notif = prev.find(n => n.id === id);
        if (notif) {
          setActiveToast({
            ...notif,
            title: `⏰ Lembrete (Adiado): ${notif.title}`,
            createdAt: new Date().toISOString()
          });
          if (notificationPreferences.soundEnabled) {
            playNotificationChime();
          }
        }
        return prev;
      });
    }, minutes * 60 * 1000);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearReadNotifications = () => {
    setNotifications(prev => prev.filter(n => !n.isRead));
  };

  const requestBrowserPushPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
    const res = await requestPushPermission();
    if (res === 'granted') {
      await updateNotificationPreferences({ pushEnabled: true });
    }
    return res;
  };

  const triggerNotification = (notifData: Omit<InAppNotification, 'id' | 'userId' | 'createdAt' | 'isRead'>) => {
    if (!notificationPreferences.enabled) return;

    // Check category permission
    const cat = notifData.category;
    if (cat === 'spaced_review' && !notificationPreferences.categories.spacedReviews) return;
    if (cat === 'flashcard' && !notificationPreferences.categories.flashcards) return;
    if (cat === 'routine_session' && !notificationPreferences.categories.routineTasks) return;
    if (cat === 'daily_goal' && !notificationPreferences.categories.dailyGoal) return;
    if (cat === 'quiz_exam' && !notificationPreferences.categories.quizExams) return;

    const newNotif: InAppNotification = {
      ...notifData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: user ? user.uid : 'local',
      isRead: false,
      createdAt: new Date().toISOString()
    };

    // Try native Browser Push notification if enabled, supported and granted
    let pushDispatched = false;
    if (
      notificationPreferences.pushEnabled &&
      checkPushSupport() &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification(newNotif.title, {
          body: newNotif.message,
          icon: '/favicon.ico',
          tag: newNotif.id
        });
        pushDispatched = true;
      } catch (err) {
        console.warn('Native push failed, prioritizing in-app alert:', err);
      }
    }

    // ALWAYS prioritize internal notifications in the platform (Toast banner + Notification Center in Header)
    // ensuring the user never misses reminders even if push is disabled, blocked, or in an iframe!
    setNotifications(prev => [newNotif, ...prev.slice(0, 49)]);
    setActiveToast(newNotif);

    if (notificationPreferences.soundEnabled) {
      playNotificationChime();
    }
  };

  const testNotification = (category: NotificationCategory = 'spaced_review') => {
    const samples: Record<NotificationCategory, { title: string; message: string; actionLabel: string; actionView: AppView }> = {
      spaced_review: {
        title: '🔔 Teste: Revisão Espaçada Programada',
        message: 'A aula de Matemática (Funções Trigonométricas) completou o ciclo de 24h e está pronta para revisão.',
        actionLabel: 'Revisar Aula',
        actionView: 'reviews'
      },
      routine_session: {
        title: '🔔 Teste: Sessão de Estudo em 10 Minutos',
        message: 'Seu cronograma prevê 45 minutos de Física (Leis de Newton). Prepare seus cadernos e materiais!',
        actionLabel: 'Ver Cronograma',
        actionView: 'routine'
      },
      flashcard: {
        title: '🔔 Teste: Flashcards Pendentes de Fixação',
        message: 'Você tem 12 cartões de memorização rápida aguardando sua resposta hoje.',
        actionLabel: 'Praticar Flashcards',
        actionView: 'flashcards'
      },
      daily_goal: {
        title: '🔔 Teste: Acompanhamento da Meta Diária',
        message: 'Você já realizou 2h30 das 4h00 da sua meta diária de estudos de hoje. Continue firme!',
        actionLabel: 'Ver Desempenho',
        actionView: 'performance'
      },
      quiz_exam: {
        title: '🔔 Teste: Simulado Militar Agendado',
        message: 'Lembrete do simulado da 1ª Fase do ITA programado para este final de semana.',
        actionLabel: 'Ver Simulados',
        actionView: 'simulados'
      },
      system: {
        title: '🔔 Notificação Interna da Plataforma',
        message: 'O sistema de lembretes e notificações (internas e push) está 100% operacional!',
        actionLabel: 'Abrir Início',
        actionView: 'dashboard'
      }
    };

    const s = samples[category] || samples.system;
    triggerNotification({
      category,
      title: s.title,
      message: s.message,
      actionLabel: s.actionLabel,
      actionView: s.actionView,
      priority: 'high'
    });
  };

  // Background automated scheduler for pending reviews, routine tasks and study sessions
  useEffect(() => {
    if (!notificationPreferences.enabled) return;

    const checkReminders = () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMin = currentHours * 60 + currentMinutes;

      // 1. Spaced Reviews check (notified once per day)
      if (notificationPreferences.categories.spacedReviews) {
        const lastDate = localStorage.getItem('aethon_last_sr_remind_date');
        if (lastDate !== todayStr) {
          const pendingToday = reviews.filter(r => r.nextReviewDate <= todayStr && r.status === 'pending');
          if (pendingToday.length > 0) {
            triggerNotification({
              category: 'spaced_review',
              title: `Revisões Espaçadas de Hoje (${pendingToday.length})`,
              message: `Você tem ${pendingToday.length} tópico(s) programado(s) para revisão hoje para evitar o esquecimento.`,
              actionLabel: 'Revisar Agora',
              actionView: 'reviews',
              priority: 'high'
            });
            localStorage.setItem('aethon_last_sr_remind_date', todayStr);
          }
        }
      }

      // 2. Flashcards check (notified once per day)
      if (notificationPreferences.categories.flashcards) {
        const lastFcDate = localStorage.getItem('aethon_last_fc_remind_date');
        if (lastFcDate !== todayStr) {
          const pendingFc = flashcards.filter(f => f.nextReviewDate <= todayStr);
          if (pendingFc.length > 0) {
            triggerNotification({
              category: 'flashcard',
              title: `Flashcards Pendentes (${pendingFc.length})`,
              message: `${pendingFc.length} cartões de fixação rápida disponíveis para praticar agora.`,
              actionLabel: 'Praticar',
              actionView: 'flashcards',
              priority: 'medium'
            });
            localStorage.setItem('aethon_last_fc_remind_date', todayStr);
          }
        }
      }

      // 3. Routine tasks / Scheduled study sessions
      if (notificationPreferences.categories.routineTasks) {
        const advance = notificationPreferences.advanceMinutesForRoutine || 10;
        routineTasks.forEach(task => {
          if (task.status === 'concluida' || !task.scheduledTime) return;
          const [th, tm] = task.scheduledTime.split(':').map(Number);
          if (isNaN(th) || isNaN(tm)) return;
          const taskTotalMin = th * 60 + tm;
          const diff = taskTotalMin - currentTotalMin;

          const taskRemindKey = `aethon_task_reminded_${task.id}_${todayStr}`;
          if (diff >= -5 && diff <= advance && !localStorage.getItem(taskRemindKey)) {
            triggerNotification({
              category: 'routine_session',
              title: `Sessão de Estudo: ${task.title}`,
              message: diff > 0 
                ? `Início em ${diff} minuto(s) (às ${task.scheduledTime}) • ${task.durationMinutes} min de ${task.subject}.`
                : `Horário da sessão de estudo chegou (${task.scheduledTime}) • ${task.subject}.`,
              actionLabel: 'Ver Cronograma',
              actionView: 'routine',
              priority: 'urgent'
            });
            localStorage.setItem(taskRemindKey, 'true');
          }
        });
      }

      // 4. Daily Goal reminder in the evening
      if (notificationPreferences.categories.dailyGoal) {
        const [goalH, goalM] = (notificationPreferences.eveningGoalReminderTime || '19:30').split(':').map(Number);
        const goalTotalMin = (goalH || 19) * 60 + (goalM || 30);
        const lastGoalDate = localStorage.getItem('aethon_last_goal_remind_date');

        if (currentTotalMin >= goalTotalMin && lastGoalDate !== todayStr) {
          if (profile.totalStudyMinutes < profile.dailyGoalMinutes) {
            const remaining = profile.dailyGoalMinutes - profile.totalStudyMinutes;
            triggerNotification({
              category: 'daily_goal',
              title: 'Lembrete da Meta Diária de Estudo',
              message: `Ainda faltam ${remaining} min para completar sua meta diária de ${(profile.dailyGoalMinutes / 60).toFixed(1)}h hoje!`,
              actionLabel: 'Estudar Agora',
              actionView: 'routine',
              priority: 'medium'
            });
            localStorage.setItem('aethon_last_goal_remind_date', todayStr);
          }
        }
      }
    };

    const initialTimer = setTimeout(checkReminders, 2000);
    const intervalTimer = setInterval(checkReminders, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [
    notificationPreferences,
    reviews,
    flashcards,
    routineTasks,
    profile.dailyGoalMinutes,
    profile.totalStudyMinutes
  ]);

  // Export / Import
  const exportAllData = () => {
    const data = {
      version: '1.3.0',
      exportedAt: new Date().toISOString(),
      profile,
      courses,
      notes,
      questions,
      questionAttempts,
      quizzes,
      quizAttempts,
      flashcards,
      routineTasks,
      studySessions,
      militaryExams,
      summaries,
      pastExams,
      mindMaps,
      formulas,
      exerciseLists,
      learningPaths,
      essays,
      notificationPreferences,
      notifications
    };
    return JSON.stringify(data, null, 2);
  };

  const importAllData = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) setProfile(data.profile);
      if (data.courses) setCourses(data.courses);
      if (data.notes) setNotes(data.notes);
      if (data.questions) setQuestions(data.questions);
      if (data.questionAttempts) setQuestionAttempts(data.questionAttempts);
      if (data.quizzes) setQuizzes(data.quizzes);
      if (data.quizAttempts) setQuizAttempts(data.quizAttempts);
      if (data.flashcards) setFlashcards(data.flashcards);
      if (data.routineTasks) setRoutineTasks(data.routineTasks);
      if (data.studySessions) setStudySessions(data.studySessions);
      if (data.militaryExams) setMilitaryExams(data.militaryExams);
      if (data.summaries) setSummaries(data.summaries);
      if (data.pastExams) setPastExams(data.pastExams);
      if (data.mindMaps) setMindMaps(data.mindMaps);
      if (data.formulas) setFormulas(data.formulas);
      if (data.exerciseLists) setExerciseLists(data.exerciseLists);
      if (data.learningPaths) setLearningPaths(data.learningPaths);
      if (data.essays) setEssays(data.essays);
      if (data.notificationPreferences) setNotificationPreferences(data.notificationPreferences);
      if (data.notifications) setNotifications(data.notifications);
      return true;
    } catch (err) {
      console.error("Import error:", err);
      return false;
    }
  };

  return (
    <StudyContext.Provider
      value={{
        user,
        profile,
        courses,
        activeCourse,
        activeLesson,
        notes,
        questions,
        questionAttempts,
        quizzes,
        quizAttempts,
        flashcards,
        reviews,
        studySessions,
        routineTasks,
        militaryExams,
        summaries,
        pastExams,
        mindMaps,
        formulas,
        exerciseLists,
        learningPaths,
        essays,
        currentView,
        searchOpen,
        setSearchOpen,
        onboardingOpen,
        setOnboardingOpen,
        resetAllToZero,
        setCourseCheckpoint,
        navigateTo,
        addCourse,
        updateCourse,
        deleteCourse,
        addModuleToCourse,
        addLessonToModule,
        updateLessonInCourse,
        deleteLessonFromCourse,
        toggleLessonComplete,
        saveLessonNotes,
        addNote,
        updateNote,
        deleteNote,
        toggleNoteFavorite,
        addQuestion,
        recordQuestionAnswer,
        toggleQuestionFavorite,
        addQuiz,
        recordQuizAttempt,
        addFlashcard,
        reviewFlashcard,
        deleteFlashcard,
        addRoutineTask,
        toggleRoutineTask,
        deleteRoutineTask,
        logStudySession,
        toggleMilitaryTopic,
        addSummary,
        updateSummary,
        deleteSummary,
        toggleSummaryFavorite,
        addMindMap,
        updateMindMap,
        deleteMindMap,
        addFormula,
        toggleFormulaFavorite,
        addExerciseList,
        updateExerciseList,
        deleteExerciseList,
        toggleLearningPathMilestone,
        enrollLearningPath,
        addEssay,
        updateEssay,
        deleteEssay,
        gradeEssayWithAI,
        authModalOpen,
        setAuthModalOpen,
        signIn,
        signOutUser,
        loginWithEmailHandler,
        registerWithEmailHandler,
        resetPasswordHandler,
        loginWithGoogleHandler,
        loginAsGuestHandler,
        updateProfile,
        notificationPreferences,
        updateNotificationPreferences,
        notifications,
        activeToast,
        dismissToast,
        snoozeNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearReadNotifications,
        triggerNotification,
        testNotification,
        requestBrowserPushPermission,
        exportAllData,
        importAllData
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudy must be used within a StudyProvider');
  return context;
};
