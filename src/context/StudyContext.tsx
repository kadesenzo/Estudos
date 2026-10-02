import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Course,
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
  MilitaryExamInfo
} from '../types';
import { INITIAL_COURSES } from '../data/initialContent';
import { generateLibraryCourses } from '../data/coursesFromTelegram';
import { INITIAL_QUESTIONS } from '../data/initialQuestions';
import { INITIAL_MILITARY_EXAMS } from '../data/militaryExams';
import { auth, db, loginWithGoogle, logoutUser, testFirestoreConnection, handleFirestoreError, OperationType } from '../lib/firebase';
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
  | 'settings';

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
  // Auth & Profile
  signIn: () => Promise<void>;
  signOutUser: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
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
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
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
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error("Login failed:", err);
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

  // Export / Import
  const exportAllData = () => {
    const data = {
      version: '1.0.0',
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
      militaryExams
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
        signIn,
        signOutUser,
        updateProfile,
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
