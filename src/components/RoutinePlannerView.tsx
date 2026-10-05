import React, { useState, useEffect } from 'react';
import {
  Clock,
  Plus,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Trash2,
  Check,
  Target,
  Flame,
  Award,
  BookOpen,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Video,
  Layers,
  ExternalLink,
  Bell,
  Sparkles,
  Shield,
  Compass,
  AlertCircle,
  HelpCircle,
  Bookmark,
  CheckSquare,
  Square,
  ListTodo,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { RoutineTask, SubjectCategory } from '../types';
import { INITIAL_CATEGORIES } from '../data/initialContent';
import {
  ITA_WEEK_SCHEDULE,
  ITA_13_WEEKS_PLAN,
  ITA_MASTERY_TOPICS,
  ITA_MULTI_YEAR_ROADMAP,
  ITA_MONTH_BY_MONTH,
  ITA_ROUTINE_RULES,
  DaySchedule,
  DailyBlock
} from '../data/itaRoutineData';

export const RoutinePlannerView: React.FC = () => {
  const {
    routineTasks,
    addRoutineTask,
    toggleRoutineTask,
    deleteRoutineTask,
    logStudySession,
    profile,
    updateProfile,
    courses,
    navigateTo,
    triggerNotification
  } = useStudy();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    'ita_schedule' | 'thirteen_weeks' | 'mastery_map' | 'roadmap_2031' | 'schedule_progress' | 'my_tasks'
  >('ita_schedule');

  // Day selection for Rota ITA 2031
  const todayDayIndex = new Date().getDay(); // 0 = Dom, 1 = Seg ...
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(todayDayIndex);

  // Daily blocks completion state (persisted in localStorage)
  const getTodayDateStr = () => new Date().toISOString().split('T')[0];
  const [completedBlocks, setCompletedBlocks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('aethon_ita_completed_blocks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('aethon_ita_completed_blocks', JSON.stringify(completedBlocks));
  }, [completedBlocks]);

  // Topic mastery state: 'dominado' | 'revisar' | 'nao_dominado'
  const [masteryStatus, setMasteryStatus] = useState<Record<string, 'dominado' | 'revisar' | 'nao_dominado'>>(() => {
    const saved = localStorage.getItem('aethon_mastery_status');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    // Default initial states based on PDF screenshot (primeiros 5 dominados)
    return {
      mat_b_1: 'dominado',
      mat_b_2: 'dominado',
      mat_b_3: 'dominado',
      mat_b_4: 'dominado',
      mat_b_5: 'dominado'
    };
  });

  useEffect(() => {
    localStorage.setItem('aethon_mastery_status', JSON.stringify(masteryStatus));
  }, [masteryStatus]);

  // 13 Weeks day completion state
  const [completedWeekDays, setCompletedWeekDays] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('aethon_week_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('aethon_week_progress', JSON.stringify(completedWeekDays));
  }, [completedWeekDays]);

  // Selected week in 13-week plan accordion
  const [expandedWeek, setExpandedWeek] = useState<number>(1);
  const [phaseFilter, setPhaseFilter] = useState<number | 'all'>('all');

  // Topic mastery filter
  const [topicCategoryFilter, setTopicCategoryFilter] = useState<'all' | 'basica_nivel1' | 'setimo_ano'>('all');

  // Expanded courses in schedule progress
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    courses.slice(0, 3).forEach(c => { init[c.id] = true; });
    return init;
  });

  // Pomodoro / Stopwatch timer state
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeTaskSubject, setActiveTaskSubject] = useState('Matemática');
  const [timerInitialMinutes, setTimerInitialMinutes] = useState(25);

  // New task form state
  const [modalOpen, setModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState('Matemática');
  const [taskTime, setTaskTime] = useState('14:00');
  const [taskDuration, setTaskDuration] = useState(45);

  // Timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      logStudySession({
        subject: activeTaskSubject,
        activityType: 'videoaula',
        durationMinutes: timerInitialMinutes,
        date: getTodayDateStr(),
        notes: `Bloco concluído: ${activeTaskSubject}`
      });
      triggerNotification({
        category: 'routine_session',
        title: 'Sessão Concluída!',
        message: `Excelente trabalho, cadete! Você cumpriu ${timerInitialMinutes} min de estudo focado em ${activeTaskSubject}.`,
        priority: 'high'
      });
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds]);

  const handleStartTimer = (durationMinutes: number, subject: string) => {
    setTimerInitialMinutes(durationMinutes);
    setTimerSeconds(durationMinutes * 60);
    setActiveTaskSubject(subject);
    setTimerRunning(true);
    triggerNotification({
      category: 'routine_session',
      title: `Foco Iniciado: ${subject}`,
      message: `Cronômetro de ${durationMinutes} minutos ativado para sua sessão de ${subject}. Bom estudo!`,
      priority: 'medium'
    });
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(timerInitialMinutes * 60);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Phase computation
  const now = new Date();
  const getPhaseIndex = () => {
    const year = now.getFullYear();
    const month = now.getMonth();
    const val = year * 12 + month;
    if (val < 2027 * 12) return 0; // Até dez/2026: Fase Base
    if (val < 2027 * 12 + 6) return 1; // Jan a Jun/2027: Física entra
    return 2; // Jul/2027 em diante: Química entra
  };
  const phaseIndex = getPhaseIndex();

  const getResolvedBlockSubject = (block: DailyBlock) => {
    const p = phaseIndex;
    if (block.subjectCode === '@F') {
      return p === 0 ? 'Matemática (Reforço)' : 'Física';
    }
    if (block.subjectCode === '@Q') {
      return p < 2 ? 'Português' : 'Química';
    }
    if (block.subjectCode === '@FQ') {
      const wk = Math.floor(now.getTime() / 6048e5) % 2;
      return p === 0
        ? 'Matemática (Lista Extra)'
        : (p === 1 || wk === 0 ? 'Física' : 'Química');
    }
    if (block.subjectCode === '@S') {
      return p === 0 ? 'Simulado de Matemática (Livro)' : (p === 1 ? 'Simulado Misto (Mat + Fis)' : 'Simulado Geral (Mat + Fis + Quim)');
    }
    return block.defaultSubject;
  };

  const getResolvedBlockDescription = (block: DailyBlock) => {
    const p = phaseIndex;
    if (block.subjectCode === '@F' && p === 0) {
      return 'Refazer a lista da semana + 10 questões de fixação da base.';
    }
    if (block.subjectCode === '@Q' && p < 2) {
      return 'Gramática normativa + resolução guiada de interpretação de texto.';
    }
    if (block.subjectCode === '@FQ' && p === 0) {
      return 'Exercícios extras de aritmética e álgebra básica.';
    }
    return block.description;
  };

  // Block key for day & block
  const getBlockKey = (dayIdx: number, blockId: string) => {
    return `${getTodayDateStr()}:d${dayIdx}:${blockId}`;
  };

  const toggleBlock = (dayIdx: number, blockId: string) => {
    const key = getBlockKey(dayIdx, blockId);
    setCompletedBlocks(prev => {
      const next = !prev[key];
      if (next) {
        triggerNotification({
          category: 'routine_session',
          title: 'Bloco de Estudo Concluído!',
          message: 'Parabéns pela disciplina. Seu progresso foi gravado na rotina diária.',
          priority: 'medium'
        });
      }
      return { ...prev, [key]: next };
    });
  };

  // Day calculations
  const activeDaySchedule = ITA_WEEK_SCHEDULE.find(d => d.dayIndex === selectedDayIndex) || ITA_WEEK_SCHEDULE[1];
  const dayCompletedBlocksCount = activeDaySchedule.blocks.filter(b => completedBlocks[getBlockKey(selectedDayIndex, b.id)]).length;
  const dayTotalBlocks = activeDaySchedule.blocks.length;
  const dayProgressPercent = dayTotalBlocks > 0 ? Math.round((dayCompletedBlocksCount / dayTotalBlocks) * 100) : 0;

  // 13 Weeks Day toggle
  const toggleWeekDay = (weekNum: number, dayName: string) => {
    const key = `w${weekNum}-${dayName}`;
    setCompletedWeekDays(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Topic mastery toggle
  const cycleMastery = (topicId: string) => {
    setMasteryStatus(prev => {
      const current = prev[topicId] || 'nao_dominado';
      const next = current === 'nao_dominado' ? 'revisar' : (current === 'revisar' ? 'dominado' : 'nao_dominado');
      return { ...prev, [topicId]: next };
    });
  };

  const setMasteryExplicit = (topicId: string, status: 'dominado' | 'revisar' | 'nao_dominado') => {
    setMasteryStatus(prev => ({ ...prev, [topicId]: status }));
  };

  // Topic metrics
  const totalMasteryTopics = ITA_MASTERY_TOPICS.length;
  const dominatedTopicsCount = ITA_MASTERY_TOPICS.filter(t => masteryStatus[t.id] === 'dominado').length;
  const reviewTopicsCount = ITA_MASTERY_TOPICS.filter(t => masteryStatus[t.id] === 'revisar').length;
  const masteryPercent = totalMasteryTopics > 0 ? Math.round((dominatedTopicsCount / totalMasteryTopics) * 100) : 0;

  // Custom task creation
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addRoutineTask({
      title: taskTitle,
      subject: taskSubject,
      scheduledTime: taskTime,
      durationMinutes: taskDuration,
      status: 'pendente',
      date: getTodayDateStr()
    });

    setModalOpen(false);
    setTaskTitle('');
  };

  // Cronograma metrics across all courses and modules
  const totalScheduleLessons = courses.reduce((acc, c) => acc + (c.modules?.flatMap(m => m.lessons).length || c.lessonsCount || 0), 0);
  const totalCompletedScheduleLessons = courses.reduce((acc, c) => acc + (c.modules?.flatMap(m => m.lessons).filter(l => l.isCompleted).length || 0), 0);
  const overallSchedulePercent = totalScheduleLessons > 0 ? Math.round((totalCompletedScheduleLessons / totalScheduleLessons) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20 font-mono">
              ROTA ITA 2031 • PLANEJAMENTO DE ELITE
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {phaseIndex === 0 ? 'Fase Base Ativa' : (phaseIndex === 1 ? 'Fase Física Ativa' : 'Fase Química Ativa')}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
            <Compass className="w-7 h-7 text-blue-400" />
            <span>Rotina & Cronograma Militar</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Estrutura diária rigorosa (9h às 11h e 21h às 00h30), plano semana a semana do 6º ao 7º ano e mapa de domínio de longo prazo até 2031.
          </p>
        </div>

        {/* Quick Launch Pomodoro / Add Task */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('my_tasks')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Cronômetro: {formatTimer(timerSeconds)}</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-800 gap-2 pb-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('ita_schedule')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'ita_schedule'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Rota ITA (Grade & Horários)</span>
        </button>

        <button
          onClick={() => setActiveTab('thirteen_weeks')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'thirteen_weeks'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Plano 13 Semanas (6º/7º Ano)</span>
        </button>

        <button
          onClick={() => setActiveTab('mastery_map')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'mastery_map'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-amber-400" />
          <span>Mapa de Progresso & Domínio</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap_2031')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'roadmap_2031'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4 text-indigo-400" />
          <span>Plano 2026-2031 (12 aos 18)</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule_progress')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'schedule_progress'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-sky-400" />
          <span>Aulas & Módulos</span>
        </button>

        <button
          onClick={() => setActiveTab('my_tasks')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'my_tasks'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <ListTodo className="w-4 h-4 text-rose-400" />
          <span>Tarefas & Pomodoro</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ROTA ITA 2031 (GRADE DIÁRIA & BLOCOS DE ESTUDO)  */}
      {/* ======================================================== */}
      {activeTab === 'ita_schedule' && (
        <div className="space-y-6">
          {/* Phase Notice Card */}
          <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-800/40 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                  {phaseIndex === 0
                    ? 'Fase 1 Atual: Base Sólida (Matemática & Português)'
                    : (phaseIndex === 1 ? 'Fase 2: Física Ativa + Matemática' : 'Fase 3: Física, Química & Matemática')}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                {phaseIndex === 0 &&
                  'Fase atual: base inabalável. Física entra oficialmente em jan/2027 e Química em jul/2027. Até lá, as noites são dedicadas a reforço e listas de Matemática, Português, Inglês e Redação.'}
                {phaseIndex === 1 &&
                  'Fase atual: Física ativa no cronograma noturno. Química entra em jul/2027.'}
                {phaseIndex === 2 &&
                  'Fase atual: Tríade completa de Exatas ativada (Matemática, Física e Química no ritmo militar).'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <button
                onClick={() => {
                  // Mark all blocks for today
                  activeDaySchedule.blocks.forEach(b => {
                    const k = getBlockKey(selectedDayIndex, b.id);
                    setCompletedBlocks(prev => ({ ...prev, [k]: true }));
                  });
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all cursor-pointer"
              >
                Concluir Dia
              </button>
              <button
                onClick={() => {
                  activeDaySchedule.blocks.forEach(b => {
                    const k = getBlockKey(selectedDayIndex, b.id);
                    setCompletedBlocks(prev => ({ ...prev, [k]: false }));
                  });
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 text-xs transition-all cursor-pointer"
              >
                Resetar Dia
              </button>
            </div>
          </div>

          {/* Day of Week Selector */}
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-4 md:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span>{activeDaySchedule.name}</span>
                  {selectedDayIndex === todayDayIndex && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white font-mono">
                      Hoje
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Estudo diário das 9h às 11h e das 21h às 00h30 (descanso de 8h garantido).
                </p>
              </div>

              {/* Day Progress Indicator */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-sm font-bold text-white font-mono">
                    {dayCompletedBlocksCount} de {dayTotalBlocks} blocos feitos
                  </span>
                  <span className="text-xs text-emerald-400 font-mono ml-2">({dayProgressPercent}%)</span>
                </div>
              </div>
            </div>

            {/* Day Selector Buttons */}
            <div className="grid grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 0].map(dIdx => {
                const day = ITA_WEEK_SCHEDULE.find(d => d.dayIndex === dIdx)!;
                const isSelected = selectedDayIndex === dIdx;
                const isToday = dIdx === todayDayIndex;
                const doneCount = day.blocks.filter(b => completedBlocks[getBlockKey(dIdx, b.id)]).length;
                const allDone = doneCount === day.blocks.length && day.blocks.length > 0;

                return (
                  <button
                    key={dIdx}
                    onClick={() => setSelectedDayIndex(dIdx)}
                    className={`py-3 px-2 rounded-xl text-center flex flex-col items-center gap-1 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
                        : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
                    } ${isToday && !isSelected ? 'border-blue-500/60 ring-1 ring-blue-500/30' : ''}`}
                  >
                    <span className="text-xs font-bold uppercase">{day.shortName}</span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      {doneCount}/{day.blocks.length}
                    </span>
                    {allDone && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Daily Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${dayProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Daily Blocks List */}
          <div className="space-y-3">
            {activeDaySchedule.blocks.map((block, idx) => {
              const blockKey = getBlockKey(selectedDayIndex, block.id);
              const isDone = !!completedBlocks[blockKey];
              const resolvedSubject = getResolvedBlockSubject(block);
              const resolvedDescription = getResolvedBlockDescription(block);

              return (
                <div
                  key={block.id}
                  className={`bg-[#0B1120] border rounded-2xl p-4 md:p-5 transition-all ${
                    isDone
                      ? 'border-emerald-500/40 bg-emerald-950/10 opacity-80'
                      : 'border-slate-800 hover:border-slate-700 shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => toggleBlock(selectedDayIndex, block.id)}
                      className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        isDone
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                          : 'border-2 border-slate-600 hover:border-blue-400 bg-slate-900'
                      }`}
                      aria-label="Marcar bloco como concluído"
                    >
                      {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    {/* Block Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-0.5 rounded-md">
                          {block.timeRange}
                        </span>
                        <span className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          resolvedSubject.includes('Matemática')
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : (resolvedSubject.includes('Física')
                            ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                            : (resolvedSubject.includes('Química')
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : (resolvedSubject.includes('Redação')
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : (resolvedSubject.includes('Simulado') || resolvedSubject.includes('Correção')
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-300'))))
                        }`}>
                          {resolvedSubject}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          ~{block.estimatedMinutes} min
                        </span>
                      </div>

                      <h4 className={`text-base font-bold text-white mt-1.5 ${isDone ? 'line-through text-slate-400' : ''}`}>
                        {block.defaultSubject}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {resolvedDescription}
                      </p>
                    </div>

                    {/* Block Quick Launch Button */}
                    <div className="flex items-center gap-2 self-start shrink-0">
                      <button
                        onClick={() => handleStartTimer(block.estimatedMinutes, resolvedSubject)}
                        title="Iniciar cronômetro de foco para este bloco"
                        className="p-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">Focar</span>
                      </button>

                      {resolvedSubject.includes('Matemática') && (
                        <button
                          onClick={() => navigateTo('courses')}
                          title="Ir para as videoaulas de Matemática"
                          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rules Banner (Regras que seguram o plano) */}
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>Regras de Ouro que Seguram a Rotina Militar</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {ITA_ROUTINE_RULES.map((rule, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                  <p className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {rule.title}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed pl-3.5">
                    {rule.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: PLANO 13 SEMANAS (6º AO 7º ANO + MATEMÁTICA BÁSICA)*/}
      {/* ======================================================== */}
      {activeTab === 'thirteen_weeks' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-[#0B1120] border border-emerald-900/40 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 font-mono">
                  CURRÍCULO ESTRUTURADO SEMANA A SEMANA
                </span>
                <h2 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
                  <span>Plano dos 12 aos 18 Anos: 13 Semanas Iniciais</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Fechamento da Matemática Básica Nível 1 em 3 semanas e domínio de toda a base do 7º ano (inteiros, racionais, álgebra, geometria e estatística).
                </p>
              </div>

              {/* Filter by Phase */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setPhaseFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    phaseFilter === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todas (13)
                </button>
                <button
                  onClick={() => setPhaseFilter(1)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    phaseFilter === 1 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Fase 1 (Sem. 1-3)
                </button>
                <button
                  onClick={() => setPhaseFilter(2)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    phaseFilter === 2 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Fase 2 (Sem. 4-9)
                </button>
                <button
                  onClick={() => setPhaseFilter(3)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    phaseFilter === 3 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Fase 3 (Sem. 10-13)
                </button>
              </div>
            </div>
          </div>

          {/* Weeks Accordion */}
          <div className="space-y-4">
            {ITA_13_WEEKS_PLAN.filter(w => phaseFilter === 'all' || w.phaseNumber === phaseFilter).map(week => {
              const isExpanded = expandedWeek === week.weekNumber;
              const daysCompletedInWeek = week.days.filter(d => completedWeekDays[`w${week.weekNumber}-${d.dayName}`]).length;
              const weekAllDone = daysCompletedInWeek === week.days.length;

              return (
                <div
                  key={week.weekNumber}
                  className="bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden transition-all shadow-md"
                >
                  {/* Week Header */}
                  <div
                    onClick={() => setExpandedWeek(isExpanded ? 0 : week.weekNumber)}
                    className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-extrabold text-sm border ${
                        weekAllDone
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-slate-900 text-cyan-400 border-slate-700'
                      }`}>
                        S{week.weekNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">
                            {week.period} • {week.phaseName}
                          </span>
                          {weekAllDone && (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              Semana Concluída ✓
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-white mt-0.5">
                          Semana {week.weekNumber}: {week.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400">
                        {daysCompletedInWeek}/{week.days.length} dias
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Week Days Content */}
                  {isExpanded && (
                    <div className="border-t border-slate-800 p-5 space-y-4 bg-slate-950/40 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {week.days.map((day, dIdx) => {
                          const dayKey = `w${week.weekNumber}-${day.dayName}`;
                          const isDayDone = !!completedWeekDays[dayKey];

                          return (
                            <div
                              key={dIdx}
                              className={`p-4 rounded-xl border transition-all ${
                                isDayDone
                                  ? 'bg-emerald-950/15 border-emerald-500/30'
                                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="text-[11px] font-mono font-bold text-cyan-400">
                                    {day.dayName}
                                  </span>
                                  <p className="text-xs font-bold text-white mt-0.5">
                                    {day.subject}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => toggleWeekDay(week.weekNumber, day.dayName)}
                                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                                    isDayDone
                                      ? 'bg-emerald-500 text-white'
                                      : 'border border-slate-600 hover:border-blue-400 bg-slate-800'
                                  }`}
                                  aria-label="Marcar dia como concluído"
                                >
                                  {isDayDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </button>
                              </div>

                              {/* Topics list */}
                              <ul className="mt-2 space-y-1 text-xs text-slate-300">
                                {day.topics.map((tp, tIdx) => (
                                  <li key={tIdx} className="flex items-start gap-1.5">
                                    <span className="text-blue-400 mt-0.5">•</span>
                                    <span className={isDayDone ? 'line-through text-slate-400' : ''}>{tp}</span>
                                  </li>
                                ))}
                              </ul>

                              {/* Goal */}
                              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-amber-300/90 font-medium">
                                🎯 <span className="font-semibold text-slate-300">Meta:</span> {day.goal}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: MAPA DE PROGRESSO & DOMÍNIO DOS CONTEÚDOS         */}
      {/* ======================================================== */}
      {activeTab === 'mastery_map' && (
        <div className="space-y-6">
          {/* Mastery Stats Banner */}
          <div className="bg-[#0B1120] border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20 font-mono">
                  CRITÉRIO RIGOROSO DE DOMÍNIO
                </span>
                <h2 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
                  <span>Mapa de Domínio dos Conteúdos</span>
                  <span className="text-sm font-mono text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-800/40">
                    {masteryPercent}% Dominado
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Classifique cada tópico com honestidade: <strong>Dominei</strong> (~80-90%+ de acertos sem olhar resposta), <strong>Precisa revisar</strong> (entende a ideia mas erra contas) ou <strong>Não domino</strong>.
                </p>
              </div>

              {/* Counters */}
              <div className="flex items-center gap-3">
                <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <p className="text-xs text-emerald-400 font-bold">Dominei</p>
                  <p className="text-lg font-black text-white font-mono">{dominatedTopicsCount}</p>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <p className="text-xs text-amber-400 font-bold">Revisar</p>
                  <p className="text-lg font-black text-white font-mono">{reviewTopicsCount}</p>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                  <p className="text-xs text-slate-400 font-bold">Restantes</p>
                  <p className="text-lg font-black text-white font-mono">
                    {totalMasteryTopics - dominatedTopicsCount - reviewTopicsCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Overall Mastery Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${masteryPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>0% Iniciado</span>
                <span>{dominatedTopicsCount} de {totalMasteryTopics} tópicos dominados</span>
                <span>100% Meta Nível 1 & 7º Ano</span>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setTopicCategoryFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                topicCategoryFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Todos os Tópicos ({ITA_MASTERY_TOPICS.length})
            </button>
            <button
              onClick={() => setTopicCategoryFilter('basica_nivel1')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                topicCategoryFilter === 'basica_nivel1'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Matemática Básica - Nível 1 (19)
            </button>
            <button
              onClick={() => setTopicCategoryFilter('setimo_ano')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                topicCategoryFilter === 'setimo_ano'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Matemática - 7º Ano (19)
            </button>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {ITA_MASTERY_TOPICS.filter(t => topicCategoryFilter === 'all' || t.category === topicCategoryFilter).map(topic => {
              const status = masteryStatus[topic.id] || 'nao_dominado';

              return (
                <div
                  key={topic.id}
                  className={`bg-[#0B1120] border rounded-2xl p-4 transition-all space-y-3 ${
                    status === 'dominado'
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : (status === 'revisar'
                      ? 'border-amber-500/40 bg-amber-950/10'
                      : 'border-slate-800 hover:border-slate-700')
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                        {topic.categoryLabel}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        {topic.title}
                      </h4>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono shrink-0 ${
                      status === 'dominado'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : (status === 'revisar'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700')
                    }`}>
                      {status === 'dominado' ? 'Dominei ✓' : (status === 'revisar' ? 'Revisar ⚠️' : 'Pendente')}
                    </span>
                  </div>

                  {topic.description && (
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {topic.description}
                    </p>
                  )}

                  {topic.subtopics && topic.subtopics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {topic.subtopics.map((sub, sIdx) => (
                        <span key={sIdx} className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Mastery 3-Button Controller */}
                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setMasteryExplicit(topic.id, 'dominado')}
                      className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        status === 'dominado'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      Dominei
                    </button>
                    <button
                      type="button"
                      onClick={() => setMasteryExplicit(topic.id, 'revisar')}
                      className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        status === 'revisar'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      Revisar
                    </button>
                    <button
                      type="button"
                      onClick={() => setMasteryExplicit(topic.id, 'nao_dominado')}
                      className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        status === 'nao_dominado'
                          ? 'bg-slate-800 text-slate-200 shadow-xs'
                          : 'bg-slate-900 text-slate-500 hover:text-white'
                      }`}
                    >
                      Não domino
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: PLANO 2026 A 2031 (DOS 12 AOS 18 ANOS)           */}
      {/* ======================================================== */}
      {activeTab === 'roadmap_2031' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-[#0B1120] border border-indigo-900/40 rounded-2xl p-6 shadow-xl space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20 font-mono">
              VISÃO ESTRATÉGICA DE LONGO PRAZO
            </span>
            <h2 className="text-xl font-extrabold text-white">
              Caminho para o ITA: Planejamento dos 12 aos 18 Anos
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Uma vantagem enorme de começar aos 12 anos é <strong>não precisar correr</strong>: dá para aprender cada assunto com máxima profundidade e ir aumentando a dificuldade aos poucos, com tempo de sobra até o vestibular valendo em 2031.
            </p>
          </div>

          {/* Age vs School Grade Progression */}
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span>Progressão Escolar até o Ingresso no ITA</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { age: '12 anos', grade: '6º ano', note: 'Base de Matemática' },
                { age: '13 anos', grade: '7º ano', note: 'Álgebra e Geometria' },
                { age: '14 anos', grade: '8º ano', note: 'Mecânica e Química' },
                { age: '15 anos', grade: '9º ano', note: 'Exatas Fortes' },
                { age: '15/16 anos', grade: '1º ano EM', note: 'Aprofundamento' },
                { age: '16/17 anos', grade: '2º ano EM', note: 'Treineiro no ITA' },
                { age: '17/18 anos', grade: '3º ano EM', note: 'Aprovação Valendo' }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                  <span className="text-xs font-mono font-bold text-blue-400">{item.age}</span>
                  <p className="text-sm font-bold text-white">{item.grade}</p>
                  <p className="text-[10px] text-slate-400">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-Year Phases Cards */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">
              Fases de Preparação (2026 a 2031)
            </h3>

            {ITA_MULTI_YEAR_ROADMAP.map((phase, idx) => (
              <div key={idx} className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-bold font-mono">
                      0{idx + 1}
                    </span>
                    <h4 className="text-base font-bold text-white">{phase.period}</h4>
                  </div>
                  <span className="text-xs font-semibold text-cyan-300 font-mono">
                    {phase.focus}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {phase.details}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block font-mono">
                      Foco em Matemática
                    </span>
                    <p className="text-xs text-slate-300 mt-1">{phase.mathFocus}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block font-mono">
                      Outras Disciplinas (Física, Química, Redação)
                    </span>
                    <p className="text-xs text-slate-300 mt-1">{phase.otherSubjectsFocus}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Month-by-month table */}
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>Quando Começa Cada Assunto (Cronograma Mês a Mês)</span>
            </h3>

            <div className="divide-y divide-slate-800 overflow-x-auto">
              {ITA_MONTH_BY_MONTH.map((item, idx) => (
                <div key={idx} className="py-3.5 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                  <div className="md:col-span-3 font-mono font-bold text-cyan-400">
                    {item.period}
                  </div>
                  <div className="md:col-span-5 text-slate-300">
                    <strong className="text-white block sm:inline">Matemática:</strong> {item.math}
                  </div>
                  <div className="md:col-span-4 text-slate-400">
                    <strong className="text-slate-300 block sm:inline">Outras:</strong> {item.others}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: PROGRESSO POR CURSOS & MÓDULOS (ORIGINAL VIEW)     */}
      {/* ======================================================== */}
      {activeTab === 'schedule_progress' && (
        <div className="space-y-6">
          {/* General Cronograma Banner */}
          <div className="bg-[#0B1120] border border-blue-900/40 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                  Cronograma Geral Militar
                </span>
                <h2 className="text-xl font-extrabold text-white mt-1.5 flex items-center gap-2">
                  <span>Conclusão Global das Videoaulas</span>
                  <span className="text-sm font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-800/40">
                    {overallSchedulePercent}%
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Aulas assistidas versus total de aulas disponíveis distribuídas em todos os cursos e módulos da plataforma.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-2xl font-black text-white font-mono">{totalCompletedScheduleLessons}</span>
                  <span className="text-xs text-slate-500 font-mono"> / {totalScheduleLessons} aulas</span>
                </div>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-700/60">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${overallSchedulePercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Courses Accordion List */}
          <div className="space-y-4">
            {courses.map(course => {
              const cLessons = course.modules?.flatMap(m => m.lessons) || [];
              const cCompleted = cLessons.filter(l => l.isCompleted).length;
              const cTotal = cLessons.length;
              const cPercent = cTotal > 0 ? Math.round((cCompleted / cTotal) * 100) : 0;
              const isExpanded = !!expandedCourses[course.id];

              return (
                <div
                  key={course.id}
                  className="bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden shadow-md transition-all"
                >
                  <div
                    onClick={() => setExpandedCourses(prev => ({ ...prev, [course.id]: !prev[course.id] }))}
                    className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">
                            {course.category}
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded">
                            {cPercent}%
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white truncate">{course.title}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-xs font-mono text-slate-400">
                        {cCompleted} / {cTotal} aulas
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-800 p-5 space-y-4 bg-slate-950/40 animate-in fade-in duration-200">
                      {course.modules?.map((module, mIdx) => {
                        const mCompleted = module.lessons.filter(l => l.isCompleted).length;
                        const mTotal = module.lessons.length;
                        const mPercent = mTotal > 0 ? Math.round((mCompleted / mTotal) * 100) : 0;

                        return (
                          <div key={module.id} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                <span className="w-5 h-5 rounded-md bg-blue-600/20 text-blue-400 flex items-center justify-center text-[10px] font-mono">
                                  {mIdx + 1}
                                </span>
                                <span>{module.title}</span>
                              </h4>
                              <span className="text-xs font-mono text-slate-400">
                                {mCompleted}/{mTotal} ({mPercent}%)
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              {module.lessons.map(lesson => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-850 text-xs"
                                >
                                  <div className="flex items-center gap-2.5 truncate">
                                    <span className={lesson.isCompleted ? 'text-emerald-400' : 'text-slate-600'}>
                                      {lesson.isCompleted ? '✓' : '○'}
                                    </span>
                                    <span className={`truncate ${lesson.isCompleted ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                                      {lesson.title}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => navigateTo('lesson-player', course.id, lesson.id)}
                                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer shrink-0 ml-2"
                                  >
                                    Assistir
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: MINHAS TAREFAS & CRONÔMETRO POMODORO              */}
      {/* ======================================================== */}
      {activeTab === 'my_tasks' && (
        <div className="space-y-6">
          {/* Pomodoro Timer Widget */}
          <div className="bg-[#0B1120] border border-blue-900/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20 font-mono">
                CRONÔMETRO DE ESTUDO FOCADO
              </span>
              <h3 className="text-xl font-bold text-white">
                Foco Ativo: {activeTaskSubject}
              </h3>
              <p className="text-xs text-slate-400 max-w-md">
                Dispare blocos cronometrados de foco de 25, 45 ou 60 minutos. A conclusão é registrada automaticamente no seu tempo total de estudo do perfil.
              </p>

              {/* Subject Selector */}
              <div className="flex flex-wrap gap-1.5 pt-2 justify-center md:justify-start">
                {INITIAL_CATEGORIES.slice(0, 5).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveTaskSubject(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeTaskSubject === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Display and Controls */}
            <div className="flex flex-col items-center gap-4">
              <div className="text-5xl md:text-6xl font-black font-mono tracking-tight text-white bg-slate-950 px-8 py-4 rounded-3xl border border-slate-800 shadow-inner">
                {formatTimer(timerSeconds)}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                    timerRunning
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                  }`}
                >
                  {timerRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{timerRunning ? 'Pausar' : 'Iniciar Foco'}</span>
                </button>

                <button
                  onClick={handleResetTimer}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Preset buttons */}
              <div className="flex items-center gap-2 text-xs">
                {[25, 45, 60, 90].map(mins => (
                  <button
                    key={mins}
                    onClick={() => handleStartTimer(mins, activeTaskSubject)}
                    className={`px-2.5 py-1 rounded-md border text-slate-300 hover:text-white cursor-pointer ${
                      timerInitialMinutes === mins ? 'bg-blue-600/30 border-blue-500 text-white' : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User's Custom Tasks List */}
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-blue-400" />
                  <span>Minhas Tarefas Criadas ({routineTasks.length})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Tarefas personalizadas que você adicionou à sua rotina.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar</span>
              </button>
            </div>

            {routineTasks.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                Nenhuma tarefa personalizada criada ainda. Use o botão acima para adicionar lembretes ou metas específicas do seu dia!
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {routineTasks.map(task => (
                  <div key={task.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => toggleRoutineTask(task.id)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                          task.status === 'concluida'
                            ? 'bg-emerald-500 text-white'
                            : 'border border-slate-600 bg-slate-900'
                        }`}
                      >
                        {task.status === 'concluida' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold text-white truncate ${task.status === 'concluida' ? 'line-through text-slate-400' : ''}`}>
                          {task.title}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {task.scheduledTime} • {task.subject} ({task.durationMinutes} min)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartTimer(task.durationMinutes, task.subject)}
                        className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Focar nesta tarefa"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                      <button
                        onClick={() => deleteRoutineTask(task.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={e => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-md bg-[#0B1120] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-400" />
              <span>Nova Tarefa na Rotina</span>
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Título da Tarefa
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Resolver lista de frações e produtos notáveis"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Disciplina
                  </label>
                  <select
                    value={taskSubject}
                    onChange={e => setTaskSubject(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {INITIAL_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Horário Previsto
                  </label>
                  <input
                    type="time"
                    value={taskTime}
                    onChange={e => setTaskTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Duração Estimada (minutos)
                </label>
                <input
                  type="number"
                  min="10"
                  max="240"
                  step="5"
                  value={taskDuration}
                  onChange={e => setTaskDuration(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors"
                >
                  Salvar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
