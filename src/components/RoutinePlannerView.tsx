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
  Bell
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { RoutineTask, SubjectCategory } from '../types';
import { INITIAL_CATEGORIES } from '../data/initialContent';

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

  const [activeTab, setActiveTab] = useState<'today' | 'schedule_progress' | 'goals'>('schedule_progress');
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>(() => {
    // Open the first 3 courses by default
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
        date: new Date().toISOString().split('T')[0],
        notes: 'Sessão concluída via cronômetro da rotina.'
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

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addRoutineTask({
      title: taskTitle,
      subject: taskSubject,
      scheduledTime: taskTime,
      durationMinutes: taskDuration,
      status: 'pendente',
      date: new Date().toISOString().split('T')[0]
    });

    setModalOpen(false);
    setTaskTitle('');
  };

  const completedCount = routineTasks.filter(t => t.status === 'concluida').length;
  const routinePercent = routineTasks.length > 0 ? Math.round((completedCount / routineTasks.length) * 100) : 0;

  // Cronograma metrics across all courses and modules
  const totalScheduleLessons = courses.reduce((acc, c) => acc + (c.modules?.flatMap(m => m.lessons).length || c.lessonsCount || 0), 0);
  const totalCompletedScheduleLessons = courses.reduce((acc, c) => acc + (c.modules?.flatMap(m => m.lessons).filter(l => l.isCompleted).length || 0), 0);
  const overallSchedulePercent = totalScheduleLessons > 0 ? Math.round((totalCompletedScheduleLessons / totalScheduleLessons) * 100) : 0;

  const totalScheduleVideos = courses.reduce((acc, c) => acc + (c.modules?.flatMap(m => m.lessons).filter(l => l.type === 'video').length || 0), 0);
  const totalCompletedScheduleVideos = courses.reduce((acc, c) => acc + (c.modules?.flatMap(m => m.lessons).filter(l => l.type === 'video' && l.isCompleted).length || 0), 0);
  const overallVideosPercent = totalScheduleVideos > 0 ? Math.round((totalCompletedScheduleVideos / totalScheduleVideos) * 100) : 0;

  const totalScheduleModules = courses.reduce((acc, c) => acc + (c.modules?.length || c.modulesCount || 0), 0);
  const totalCompletedScheduleModules = courses.reduce((acc, c) => acc + (c.modules?.filter(m => m.lessons.length > 0 && m.lessons.every(l => l.isCompleted)).length || 0), 0);

  const toggleCourseExpand = (cId: string) => {
    setExpandedCourses(prev => ({ ...prev, [cId]: !prev[cId] }));
  };

  const expandAllCourses = () => {
    const all: Record<string, boolean> = {};
    courses.forEach(c => { all[c.id] = true; });
    setExpandedCourses(all);
  };

  const collapseAllCourses = () => {
    setExpandedCourses({});
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-400" />
            <span>Planejamento & Rotina de Estudos</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Acompanhe o cronograma de aulas concluídas de cada curso e módulo com cronômetro de foco.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Tarefa na Rotina</span>
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex border-b border-slate-800 gap-2 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('schedule_progress')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'schedule_progress'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span>Progresso do Cronograma (Cursos & Módulos)</span>
        </button>

        <button
          onClick={() => setActiveTab('today')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'today'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Minha Rotina Diária & Foco</span>
        </button>

        <button
          onClick={() => setActiveTab('goals')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'goals'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Metas Semanais</span>
        </button>
      </div>

      {/* TAB 1: SCHEDULE PROGRESS (Cursos & Módulos Individuais) */}
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
                  <span>Conclusão Global do Cronograma</span>
                  <span className="text-sm font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-800/40">
                    {overallSchedulePercent}%
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Aulas assistidas versus total de aulas disponíveis distribuídas em todos os cursos e módulos.
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
              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>
                  <strong>{totalCompletedScheduleLessons}</strong> de <strong>{totalScheduleLessons}</strong> aulas concluídas no cronograma ({overallSchedulePercent}%)
                </span>
                <span>
                  🎬 Videoaulas: <strong>{totalCompletedScheduleVideos} / {totalScheduleVideos}</strong> ({overallVideosPercent}%)
                </span>
                <span>
                  📦 Módulos: <strong>{totalCompletedScheduleModules} / {totalScheduleModules}</strong> finalizados
                </span>
              </div>
            </div>
          </div>

          {/* Individual Courses & Modules List */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm md:text-base font-bold text-white">
                  Cursos do Cronograma & Barras de Progresso por Módulo
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={expandAllCourses}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors"
                >
                  Expandir Todos os Módulos
                </button>
                <button
                  type="button"
                  onClick={collapseAllCourses}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/80 transition-colors"
                >
                  Recolher Todos
                </button>
                <span className="text-slate-500 pl-2">
                  {courses.length} cursos
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {courses.map((course) => {
                const isExpanded = !!expandedCourses[course.id];
                const cLessons = course.modules?.flatMap(m => m.lessons) || [];
                const cTotal = cLessons.length || course.lessonsCount || 0;
                const cCompleted = cLessons.filter(l => l.isCompleted).length || 0;
                const cPercent = cTotal > 0 ? Math.round((cCompleted / cTotal) * 100) : course.progressPercent;
                const cVideos = cLessons.filter(l => l.type === 'video');
                const cVideosCompleted = cVideos.filter(l => l.isCompleted).length;

                return (
                  <div
                    key={course.id}
                    className="bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-colors hover:border-slate-700"
                  >
                    {/* Course Level Header & Progress Bar */}
                    <div className="p-5 md:p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0">
                          <div className="w-14 h-14 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-800">
                            <img
                              src={course.coverUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop'}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-bold text-blue-400 uppercase bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                                {course.category}
                              </span>
                              {cPercent === 100 ? (
                                <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                  ✓ Curso Concluído
                                </span>
                              ) : cCompleted > 0 ? (
                                <span className="text-[10px] font-bold text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                                  Em Andamento
                                </span>
                              ) : (
                                <span className="text-[10px] font-medium text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                                  Não Iniciado
                                </span>
                              )}
                            </div>
                            <h4 className="text-base font-bold text-white mt-1 truncate">
                              {course.title}
                            </h4>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                              {course.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          <button
                            onClick={() => toggleCourseExpand(course.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>{isExpanded ? 'Recolher Módulos' : `Ver Módulos & Progresso (${course.modules?.length || 0})`}</span>
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-blue-400" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => navigateTo('course-detail', course.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Abrir Curso</span>
                          </button>
                        </div>
                      </div>

                      {/* Barra de Progresso Individual do Curso */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                        <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                          <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                            <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                            <span>Barra de Progresso Individual do Curso</span>
                          </span>
                          <span className="font-extrabold text-white font-mono text-sm bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                            {cPercent}%
                          </span>
                        </div>

                        <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800 p-0.5 shadow-inner">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              cPercent === 100
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                : cPercent > 0
                                ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400'
                                : 'bg-transparent'
                            }`}
                            style={{ width: `${cPercent}%` }}
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span>
                            Conclusão de aulas: <strong className="text-white">{cCompleted}</strong> de <strong className="text-white">{cTotal}</strong> aulas disponíveis no cronograma ({cPercent}%)
                          </span>
                          {cVideos.length > 0 && (
                            <span className="text-blue-300">
                              🎬 {cVideosCompleted} de {cVideos.length} videoaulas assistidas
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Barra de Progresso Individual de CADA MÓDULO */}
                    {isExpanded && course.modules && course.modules.length > 0 && (
                      <div className="border-t border-slate-800 bg-slate-950/60 p-5 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-blue-400" />
                            <span>Módulos do Cronograma & Barras de Progresso Individuais</span>
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {course.modules.length} módulos no cronograma
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                          {course.modules.map((mod) => {
                            const modTotal = mod.lessons.length;
                            const modCompleted = mod.lessons.filter(l => l.isCompleted).length;
                            const modPercent = modTotal > 0 ? Math.round((modCompleted / modTotal) * 100) : 0;
                            const isModComplete = modTotal > 0 && modCompleted === modTotal;
                            const modVideos = mod.lessons.filter(l => l.type === 'video');
                            const modVideosCompleted = modVideos.filter(l => l.isCompleted).length;

                            return (
                              <div
                                key={mod.id}
                                className="p-4 rounded-xl bg-[#0B1120] border border-slate-800/90 hover:border-blue-500/40 transition-colors space-y-3 flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-2">
                                    <h5 className="text-xs font-bold text-white truncate max-w-[240px]" title={mod.title}>
                                      {mod.title}
                                    </h5>
                                    {isModComplete ? (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                        ✓ 100%
                                      </span>
                                    ) : modCompleted > 0 ? (
                                      <span className="font-extrabold text-cyan-300 font-mono text-[11px] bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40 shrink-0">
                                        {modPercent}%
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                                        0%
                                      </span>
                                    )}
                                  </div>

                                  {mod.description && (
                                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                      {mod.description}
                                    </p>
                                  )}
                                </div>

                                {/* Barra de Progresso Individual do Módulo */}
                                <div className="space-y-1.5 pt-1">
                                  <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800 p-0.5 shadow-inner">
                                    <div
                                      className={`h-full rounded-full transition-all duration-500 ${
                                        isModComplete
                                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                          : modPercent > 0
                                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                                          : 'bg-transparent'
                                      }`}
                                      style={{ width: `${modPercent}%` }}
                                    />
                                  </div>

                                  <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 font-mono gap-1">
                                    <span>
                                      Progresso: <strong className="text-white">{modCompleted}</strong> de <strong className="text-white">{modTotal}</strong> aulas assistidas ({modPercent}%)
                                    </span>
                                    {modVideos.length > 0 && (
                                      <span className="text-blue-300">
                                        🎬 {modVideosCompleted}/{modVideos.length} vídeos
                                      </span>
                                    )}
                                  </div>
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
        </div>
      )}

      {/* TAB 2 & 3: TODAY ROTINA & GOALS */}
      {activeTab === 'today' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tactical Study Timer (Left Column, 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 text-center shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cronômetro Tático de Foco</span>
              <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                {activeTaskSubject}
              </span>
            </div>

            {/* Timer Dial Display */}
            <div className="relative py-4 flex flex-col items-center justify-center">
              <div className="w-56 h-56 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center relative shadow-inner bg-slate-950/60">
                <span className="text-5xl font-black text-white font-mono tracking-tighter">
                  {formatTimer(timerSeconds)}
                </span>
                <span className="text-[11px] text-slate-500 uppercase tracking-widest mt-1 font-semibold">
                  {timerRunning ? 'Em Concentração' : 'Pausado'}
                </span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex justify-center gap-2">
              {[25, 45, 60, 90].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleStartTimer(mins, activeTaskSubject)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                    timerInitialMinutes === mins && !timerRunning
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>

            {/* Control Actions */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg transition-all ${
                  timerRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/40 hover:scale-105'
                }`}
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                    <span>Iniciar Foco</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetTimer}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Reiniciar Cronômetro"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Goals Card */}
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span>Metas Pessoais de Estudo</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Meta Diária:</span>
                <span className="font-bold text-white font-mono">{Math.floor(profile.dailyGoalMinutes / 60)}h líquidas</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Meta Semanal:</span>
                <span className="font-bold text-white font-mono">{profile.weeklyGoalHours}h líquidas</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Concurso Alvo:</span>
                <span className="font-bold text-blue-400 font-mono">{profile.targetExam}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Routine Tasks Schedule (Right Column, 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Daily Routine Summary Bar */}
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Tarefas da Rotina</h3>
                <p className="text-xs text-slate-400">Clique na tarefa para alternar seu status.</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-emerald-400 font-mono">{routinePercent}%</span>
                <span className="text-[11px] text-slate-500 block">{completedCount} de {routineTasks.length} concluídas</span>
              </div>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${routinePercent}%` }}
              />
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {routineTasks.map((task) => {
              const isDone = task.status === 'concluida';
              const isWorking = task.status === 'em_andamento';

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                      : isWorking
                      ? 'bg-blue-950/20 border-blue-500/50 shadow-md'
                      : 'bg-[#0B1120] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => toggleRoutineTask(task.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border mt-0.5 transition-colors ${
                        isDone
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : isWorking
                          ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                          : 'border-slate-700 hover:border-slate-500 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="min-w-0">
                      <p className={`text-xs md:text-sm font-semibold truncate ${isDone ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                        {task.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                        <span>Horário: <strong>{task.scheduledTime}</strong></span>
                        <span>•</span>
                        <span>Duração: <strong>{task.durationMinutes} min</strong></span>
                        <span>•</span>
                        <span className="text-blue-400 font-semibold">{task.subject}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800 w-full sm:w-auto justify-between sm:justify-end">
                    {!isDone && (
                      <button
                        onClick={() => {
                          triggerNotification({
                            category: 'routine_session',
                            title: `Lembrete de Estudo: ${task.title}`,
                            message: `Horário: ${task.scheduledTime} (${task.durationMinutes} min de ${task.subject}). Inicie agora para manter seu ritmo!`,
                            actionLabel: 'Iniciar Foco',
                            actionView: 'routine',
                            priority: 'urgent'
                          });
                        }}
                        className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer border border-slate-700/80"
                        title="Disparar notificação desta tarefa"
                      >
                        <Bell className="w-3 h-3 text-blue-400" />
                        <span className="hidden sm:inline">Lembrar</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleStartTimer(task.durationMinutes, task.subject)}
                      className="px-2.5 py-1 rounded-md bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      title="Lançar no cronômetro"
                    >
                      <Play className="w-3 h-3" />
                      <span>Focar</span>
                    </button>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      isDone
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : isWorking
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>

                    <button
                      onClick={() => deleteRoutineTask(task.id)}
                      className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}

      {/* TAB 3: GOALS */}
      {activeTab === 'goals' && (
        <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span>Metas Semanais de Conclusão do Cronograma</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Acompanhe o ritmo de aulas assistidas por semana para cumprir os editais militares.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-md border border-cyan-800/40">
              Meta Semanal: 25 Aulas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Aulas Assistidas no Cronograma</span>
              <div className="text-2xl font-bold font-mono text-white">
                {totalCompletedScheduleLessons} <span className="text-xs text-slate-500">/ {totalScheduleLessons}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full" style={{ width: `${overallSchedulePercent}%` }} />
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">{overallSchedulePercent}% do cronograma completo</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Videoaulas Assistidas</span>
              <div className="text-2xl font-bold font-mono text-white">
                {totalCompletedScheduleVideos} <span className="text-xs text-slate-500">/ {totalScheduleVideos}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${overallVideosPercent}%` }} />
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">{overallVideosPercent}% das videoaulas</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Módulos Finalizados</span>
              <div className="text-2xl font-bold font-mono text-white">
                {totalCompletedScheduleModules} <span className="text-xs text-slate-500">/ {totalScheduleModules}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  style={{ width: `${totalScheduleModules > 0 ? Math.round((totalCompletedScheduleModules / totalScheduleModules) * 100) : 0}%` }}
                />
              </div>
              <span className="text-[10px] text-purple-400 font-mono">
                {totalScheduleModules > 0 ? Math.round((totalCompletedScheduleModules / totalScheduleModules) * 100) : 0}% dos módulos
              </span>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Adicionar Tarefa na Rotina</h3>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título da Atividade *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Resolução de 20 questões de Dinâmica"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Matéria</label>
                <select
                  value={taskSubject}
                  onChange={(e) => setTaskSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {INITIAL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Horário Previsto</label>
                  <input
                    type="time"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duração (Minutos)</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={taskDuration}
                    onChange={(e) => setTaskDuration(parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
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
