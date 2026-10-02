import React from 'react';
import {
  Flame,
  Clock,
  BookOpen,
  CheckCircle2,
  Play,
  ArrowRight,
  TrendingUp,
  Calendar,
  Shield,
  HelpCircle,
  FileCheck2,
  Sparkles,
  PlusCircle,
  RotateCcw,
  BookMarked,
  BookmarkCheck
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export const DashboardView: React.FC = () => {
  const {
    profile,
    courses,
    routineTasks,
    toggleRoutineTask,
    navigateTo,
    studySessions,
    questionAttempts,
    quizAttempts,
    notes,
    reviews,
    setOnboardingOpen,
    resetAllToZero
  } = useStudy();

  const inProgressCourses = courses.filter(c => c.progressPercent > 0 && c.progressPercent < 100);
  const completedCourses = courses.filter(c => c.progressPercent === 100);
  const recentCourse = courses[0];

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = routineTasks.filter(t => t.date === todayStr || !t.date);

  const totalQuestions = questionAttempts.length;
  const correctQuestions = questionAttempts.filter(q => q.isCorrect).length;
  const accuracyPercent = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

  const formatHours = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m > 0 ? `${m}m` : ''}`;
  };

  const weeklyProgressHours = Math.floor(profile.totalStudyMinutes / 60);
  const weeklyTarget = profile.weeklyGoalHours || 24;
  const weeklyPercent = weeklyTarget > 0 ? Math.min(100, Math.round((weeklyProgressHours / weeklyTarget) * 100)) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner Greeting */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-[#0A1020] border border-blue-800/40 p-6 md:p-8 shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>Preparação Focada: {profile.targetExam}</span>
              </span>
              <button
                onClick={() => setOnboardingOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>Refazer Quiz / Nivelamento</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Deseja zerar todas as horas, aulas e dados do painel para começar hoje do zero absoluto?')) {
                    resetAllToZero();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-rose-950/50 hover:border-rose-500/40 hover:text-rose-300 border border-slate-700 text-slate-400 text-xs transition-colors cursor-pointer"
                title="Zera contadores e inicia do zero absoluto"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Zerar Métricas (0h00)</span>
              </button>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Bem-vindo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">{profile.displayName}</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Mantenha a constância e a disciplina tática. Cada aula concluída e questão resolvida constrói a sua aprovação no ITA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigateTo('routine')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs md:text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Iniciar Sessão</span>
            </button>
            <button
              onClick={() => navigateTo('simulados')}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-xs md:text-sm border border-slate-700 transition-all flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4 text-blue-400" />
              <span>Simulados ITA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Streak */}
        <div className="bg-[#0B1120] border border-slate-800/80 rounded-xl p-4.5 hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>Sequência Ativa</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">{profile.streakDays}</span>
            <span className="text-xs text-amber-400 font-semibold">dias seguidos</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Disciplina militar ininterrupta</p>
        </div>

        {/* Metric 2: Tempo Total */}
        <div className="bg-[#0B1120] border border-slate-800/80 rounded-xl p-4.5 hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>Tempo Total de Estudo</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">{formatHours(profile.totalStudyMinutes)}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Meta diária: {formatHours(profile.dailyGoalMinutes)}</p>
        </div>

        {/* Metric 3: Aulas Assistidas */}
        <div className="bg-[#0B1120] border border-slate-800/80 rounded-xl p-4.5 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>Aulas Concluídas</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">{profile.completedLessonsCount}</span>
            <span className="text-xs text-emerald-400 font-semibold">aulas</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Em {courses.length} cursos cadastrados</p>
        </div>

        {/* Metric 4: Precisão em Questões */}
        <div className="bg-[#0B1120] border border-slate-800/80 rounded-xl p-4.5 hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>Aproveitamento em Questões</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">{accuracyPercent}%</span>
            <span className="text-xs text-slate-400 font-semibold">({correctQuestions}/{totalQuestions})</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Taxa de acerto real registrada</p>
        </div>
      </div>

      {/* Marcadores de Estudo — "Onde Eu Parei" */}
      <div className="bg-[#0B1120] border border-blue-900/40 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <BookmarkCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-extrabold text-white">Marcadores de Estudo — "Onde Eu Parei"</h3>
              <p className="text-xs text-slate-400">Continue diretamente do ponto exato onde você pausou em cada matéria do ITA.</p>
            </div>
          </div>
          <button
            onClick={() => setOnboardingOpen(true)}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Alterar via Quiz</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Matemática */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3 hover:border-blue-500/40 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Matemática</span>
                <span className="text-[10px] text-slate-500 font-mono">ITA / IME</span>
              </div>
              <h4 className="text-xs font-semibold text-white mt-1.5 line-clamp-2">
                {profile.stoppedCheckpoints?.['course-mat-telegram'] || 'Semana 1: Aula 1 - Números e Sistema Decimal'}
              </h4>
            </div>
            <button
              onClick={() => {
                const c = courses.find(item => item.id === 'course-mat-telegram');
                const targetLesson = c?.stoppedAtLessonId || c?.modules?.[0]?.lessons?.find(l => l.type === 'video')?.id || c?.modules?.[0]?.lessons?.[0]?.id;
                if (targetLesson) {
                  navigateTo('lesson-player', 'course-mat-telegram', targetLesson);
                } else {
                  navigateTo('course-detail', 'course-mat-telegram');
                }
              }}
              className="w-full py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 hover:border-blue-500 text-blue-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Abrir Videoaula (Onde Parei)</span>
            </button>
          </div>

          {/* Física */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3 hover:border-emerald-500/40 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Física</span>
                <span className="text-[10px] text-slate-500 font-mono">ITA / IME</span>
              </div>
              <h4 className="text-xs font-semibold text-white mt-1.5 line-clamp-2">
                {profile.stoppedCheckpoints?.['course-fis-telegram'] || 'Aula 1 - Cinemática Escalar e Movimento Uniforme'}
              </h4>
            </div>
            <button
              onClick={() => {
                const c = courses.find(item => item.id === 'course-fis-telegram');
                const targetLesson = c?.stoppedAtLessonId || c?.modules?.[0]?.lessons?.find(l => l.type === 'video')?.id || c?.modules?.[0]?.lessons?.[0]?.id;
                if (targetLesson) {
                  navigateTo('lesson-player', 'course-fis-telegram', targetLesson);
                } else {
                  navigateTo('course-detail', 'course-fis-telegram');
                }
              }}
              className="w-full py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 hover:border-emerald-500 text-emerald-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Abrir Videoaula (Onde Parei)</span>
            </button>
          </div>

          {/* Química */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Química</span>
                <span className="text-[10px] text-slate-500 font-mono">ITA / IME</span>
              </div>
              <h4 className="text-xs font-semibold text-white mt-1.5 line-clamp-2">
                {profile.stoppedCheckpoints?.['course-qui-telegram'] || 'Aula 1 - Matéria e Estados Físicos'}
              </h4>
            </div>
            <button
              onClick={() => {
                const c = courses.find(item => item.id === 'course-qui-telegram');
                const targetLesson = c?.stoppedAtLessonId || c?.modules?.[0]?.lessons?.find(l => l.type === 'video')?.id || c?.modules?.[0]?.lessons?.[0]?.id;
                if (targetLesson) {
                  navigateTo('lesson-player', 'course-qui-telegram', targetLesson);
                } else {
                  navigateTo('course-detail', 'course-qui-telegram');
                }
              }}
              className="w-full py-2 rounded-lg bg-amber-600/20 hover:bg-amber-600 border border-amber-500/30 hover:border-amber-500 text-amber-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Abrir Videoaula (Onde Parei)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Row: Continuar Estudando & Minha Rotina de Hoje */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Continuar Estudando (Left Column, 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
              <h2 className="text-base font-bold text-white">Continuar Estudando</h2>
            </div>
            <button
              onClick={() => navigateTo('courses')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <span>Ver todos os cursos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentCourse ? (
            <div className="bg-[#0B1120] border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/40 transition-all shadow-md group">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-56 h-40 sm:h-auto relative overflow-hidden bg-slate-900">
                  <img
                    src={recentCourse.coverUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop'}
                    alt={recentCourse.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-blue-600/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                    {recentCourse.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {recentCourse.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {recentCourse.description}
                    </p>
                  </div>

                  {(() => {
                    const compL = recentCourse.modules?.flatMap(m => m.lessons).filter(l => l.isCompleted).length || 0;
                    const totL = recentCourse.modules?.flatMap(m => m.lessons).length || recentCourse.lessonsCount || 0;
                    const pct = totL > 0 ? Math.round((compL / totL) * 100) : recentCourse.progressPercent;

                    return (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-300">
                          <span className="font-semibold">Progresso Individual do Curso</span>
                          <span className="font-bold text-white font-mono bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">{pct}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800 p-0.5 shadow-inner">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span>
                            Aulas assistidas: <strong className="text-white">{compL}</strong> de <strong className="text-white">{totL}</strong> no cronograma ({pct}%)
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-400">
                      {recentCourse.modulesCount} módulos • {recentCourse.lessonsCount} aulas
                    </span>
                    <button
                      onClick={() => {
                        let targetLessonId = recentCourse.stoppedAtLessonId;
                        if (!targetLessonId) {
                          const firstVideo = recentCourse.modules?.[0]?.lessons?.find(l => l.type === 'video') || recentCourse.modules?.[0]?.lessons?.[0];
                          targetLessonId = firstVideo?.id;
                        }
                        if (targetLessonId) {
                          navigateTo('lesson-player', recentCourse.id, targetLessonId);
                        } else {
                          navigateTo('course-detail', recentCourse.id);
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Assistir Videoaula</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0B1120] border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-400">
              <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm">Nenhum curso cadastrado ainda.</p>
              <button
                onClick={() => navigateTo('courses')}
                className="mt-3 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
              >
                Cadastrar Primeiro Curso
              </button>
            </div>
          )}

          {/* Quick Study Shelf */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Outros Cursos em Andamento</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {courses.slice(1, 3).map((course) => {
                const compL = course.modules?.flatMap(m => m.lessons).filter(l => l.isCompleted).length || 0;
                const totL = course.modules?.flatMap(m => m.lessons).length || course.lessonsCount || 0;
                const pct = totL > 0 ? Math.round((compL / totL) * 100) : course.progressPercent;

                return (
                  <div
                    key={course.id}
                    onClick={() => navigateTo('course-detail', course.id)}
                    className="p-3.5 rounded-xl bg-[#0B1120] border border-slate-800/80 hover:border-blue-500/40 cursor-pointer transition-all flex flex-col justify-between space-y-2 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-700">
                        <img src={course.coverUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">{course.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">{course.category}</p>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Aulas: {compL}/{totL} assistidas</span>
                        <span className="text-white font-bold">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full ${
                            pct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Minha Rotina de Hoje (Right Column, 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <h2 className="text-base font-bold text-white">Minha Rotina de Hoje</h2>
            </div>
            <button
              onClick={() => navigateTo('routine')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Organizar
            </button>
          </div>

          <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-4 space-y-2.5 shadow-md">
            {todayTasks.length > 0 ? (
              todayTasks.map((task) => {
                const isDone = task.status === 'concluida';
                const isWorking = task.status === 'em_andamento';

                return (
                  <div
                    key={task.id}
                    onClick={() => toggleRoutineTask(task.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isDone
                        ? 'bg-slate-900/40 border-slate-800/50 opacity-60'
                        : isWorking
                        ? 'bg-blue-950/30 border-blue-600/40 shadow-xs'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                        isDone
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                          : isWorking
                          ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                          : 'border-slate-700 hover:border-slate-500 text-transparent'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>

                      <div className="min-w-0">
                        <p className={`text-xs font-semibold truncate ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {task.scheduledTime} • {task.durationMinutes} min • <span className="text-blue-400 font-medium">{task.subject}</span>
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                      isDone
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : isWorking
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-xs text-slate-500 py-6">Nenhuma tarefa planejada para hoje.</p>
            )}

            <button
              onClick={() => navigateTo('routine')}
              className="w-full py-2.5 rounded-lg border border-dashed border-slate-700 hover:border-blue-500/50 text-slate-400 hover:text-blue-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Adicionar Tarefa ao Dia</span>
            </button>
          </div>

          {/* Spaced Reviews Alert Box */}
          <div className="bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-800/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-purple-200">Revisões Inteligentes</p>
                <p className="text-[11px] text-slate-400">Fixação espaçada de 1, 7 e 30 dias</p>
              </div>
            </div>
            <button
              onClick={() => navigateTo('reviews')}
              className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-purple-200 text-xs font-semibold transition-colors"
            >
              Revisar Agora
            </button>
          </div>
        </div>
      </div>

      {/* Military Readiness & Fast Access Hub */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <h2 className="text-base font-bold text-white">Preparatório para Forças Armadas</h2>
          </div>
          <button
            onClick={() => navigateTo('military')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Ver Detalhes do Edital
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'espcex', name: 'EsPCEx', title: 'Cadetes do Exército', color: 'border-amber-600/40 bg-amber-950/20 text-amber-400' },
            { id: 'esa', name: 'ESA', title: 'Sargentos das Armas', color: 'border-emerald-600/40 bg-emerald-950/20 text-emerald-400' },
            { id: 'eear', name: 'EEAR', title: 'Especialistas FAB', color: 'border-sky-600/40 bg-sky-950/20 text-sky-400' },
            { id: 'afa', name: 'AFA', title: 'Academia Força Aérea', color: 'border-blue-600/40 bg-blue-950/20 text-blue-400' },
            { id: 'escolanaval', name: 'Escola Naval', title: 'Oficiais Marinha', color: 'border-cyan-600/40 bg-cyan-950/20 text-cyan-400' },
            { id: 'efomm', name: 'EFOMM', title: 'Marinha Mercante', color: 'border-teal-600/40 bg-teal-950/20 text-teal-400' },
          ].map((exam) => (
            <button
              key={exam.id}
              onClick={() => navigateTo('military')}
              className={`p-3.5 rounded-xl border transition-all text-left hover:scale-[1.02] flex flex-col justify-between ${exam.color}`}
            >
              <div>
                <span className="font-extrabold text-sm block font-mono">{exam.name}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5 truncate">{exam.title}</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider mt-3 text-slate-300 flex items-center gap-1">
                <span>Edital & Matérias</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
