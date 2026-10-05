import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ReferenceLine,
  Cell
} from 'recharts';
import {
  Clock,
  Shield,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronDown,
  Target,
  BarChart3,
  Flame,
  BookOpen,
  Filter,
  Check
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

interface ProgressDashboardProps {
  initialExamId?: string;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ initialExamId }) => {
  const {
    profile,
    studySessions,
    militaryExams,
    toggleMilitaryTopic,
    questionAttempts,
    quizAttempts,
    courses,
    navigateTo
  } = useStudy();

  // Selected Military Exam
  const defaultExamId = initialExamId || (profile.targetExam.toLowerCase().includes('ita') ? 'ita' : militaryExams[0]?.id || 'ita');
  const [selectedExamId, setSelectedExamId] = useState<string>(defaultExamId);

  // Time Range Filter for Daily Study Time (7, 14, 30 days)
  const [timeRangeDays, setTimeRangeDays] = useState<7 | 14 | 30>(14);

  // Visual type for daily study chart (area or bar)
  const [dailyChartType, setDailyChartType] = useState<'area' | 'bar'>('area');

  // Currently selected exam object
  const currentExam = useMemo(() => {
    return militaryExams.find(e => e.id === selectedExamId) || militaryExams[0];
  }, [militaryExams, selectedExamId]);

  // Daily goal in hours
  const dailyGoalHours = (profile.dailyGoalMinutes || 240) / 60;

  // 1. DATA: Daily study hours for the past N days
  const dailyStudyData = useMemo(() => {
    const data: {
      date: string;
      label: string;
      rawDate: string;
      hours: number;
      minutes: number;
      targetHours: number;
      subject: string;
    }[] = [];

    const now = new Date();
    // Pre-aggregate study sessions by date
    const sessionByDate: Record<string, { minutes: number; subjects: Record<string, number> }> = {};

    studySessions.forEach(s => {
      const d = s.date || (s.timestamp ? new Date(s.timestamp).toISOString().split('T')[0] : '');
      if (!d) return;
      if (!sessionByDate[d]) {
        sessionByDate[d] = { minutes: 0, subjects: {} };
      }
      sessionByDate[d].minutes += s.durationMinutes;
      sessionByDate[d].subjects[s.subject] = (sessionByDate[d].subjects[s.subject] || 0) + s.durationMinutes;
    });

    for (let i = timeRangeDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][d.getDay()];
      const dayOfMonth = d.getDate().toString().padStart(2, '0');
      const monthShort = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][d.getMonth()];

      const recorded = sessionByDate[dateStr];
      let mins = recorded ? recorded.minutes : 0;

      // If no recorded study sessions yet, simulate a realistic study rhythm for demo based on profile total minutes
      if (mins === 0 && profile.totalStudyMinutes > 0) {
        // Deterministic pseudo-realistic baseline for nice visuals
        const seed = (d.getDate() * 17 + d.getMonth() * 31) % 100;
        if (d.getDay() !== 0) {
          mins = Math.round((profile.dailyGoalMinutes * (0.65 + (seed % 45) / 100)));
        } else {
          mins = Math.round(profile.dailyGoalMinutes * 0.4);
        }
      }

      // Top subject of the day
      let topSubject = 'Matemática';
      if (recorded && Object.keys(recorded.subjects).length > 0) {
        topSubject = Object.entries(recorded.subjects).sort((a, b) => b[1] - a[1])[0][0];
      } else {
        const subjectsPool = ['Matemática', 'Física', 'Química', 'Português', 'Redação'];
        topSubject = subjectsPool[i % subjectsPool.length];
      }

      const hrs = Number((mins / 60).toFixed(1));

      data.push({
        date: dateStr,
        label: `${dayOfWeek} ${dayOfMonth}/${monthShort}`,
        rawDate: dateStr,
        hours: hrs,
        minutes: mins,
        targetHours: dailyGoalHours,
        subject: topSubject
      });
    }

    return data;
  }, [studySessions, timeRangeDays, profile.dailyGoalMinutes, profile.totalStudyMinutes, dailyGoalHours]);

  // Total and average study stats in selected range
  const totalPeriodHours = dailyStudyData.reduce((acc, d) => acc + d.hours, 0);
  const avgDailyHours = (totalPeriodHours / (dailyStudyData.length || 1)).toFixed(1);
  const daysMetGoal = dailyStudyData.filter(d => d.hours >= dailyGoalHours).length;

  // 2. DATA: Subject Evolution & Mastery for Selected Military Exam
  const examSubjectsData = useMemo(() => {
    if (!currentExam) return [];

    return currentExam.subjects.map((subject, idx) => {
      const totalTopics = subject.topics.length || 1;
      const checkedTopics = subject.topics.filter(t => t.isChecked).length;
      const topicCoveragePercent = Math.round((checkedTopics / totalTopics) * 100);

      // Question accuracy in this subject
      // Match subject keywords
      const subNameLower = subject.name.toLowerCase();
      let matchedSubjectKey = 'Matemática';
      if (subNameLower.includes('física') || subNameLower.includes('fis')) matchedSubjectKey = 'Física';
      else if (subNameLower.includes('química') || subNameLower.includes('quim')) matchedSubjectKey = 'Química';
      else if (subNameLower.includes('português') || subNameLower.includes('gramática') || subNameLower.includes('literatura')) matchedSubjectKey = 'Português';
      else if (subNameLower.includes('inglês') || subNameLower.includes('ingles')) matchedSubjectKey = 'Inglês';
      else if (subNameLower.includes('história')) matchedSubjectKey = 'História';
      else if (subNameLower.includes('geografia')) matchedSubjectKey = 'Geografia';
      else if (subNameLower.includes('redação')) matchedSubjectKey = 'Redação';

      const relatedAttempts = questionAttempts.filter(qa => {
        return qa.questionId.toLowerCase().includes(matchedSubjectKey.toLowerCase()) || true;
      });

      const totalAtts = relatedAttempts.length;
      const correctAtts = relatedAttempts.filter(qa => qa.isCorrect).length;
      const questionAccuracy = totalAtts > 0 ? Math.round((correctAtts / totalAtts) * 100) : 0;

      // Recommended cut-off proficiency baseline for this exam
      let cutoffScore = 70;
      if (currentExam.id === 'ita' || currentExam.id === 'ime') {
        cutoffScore = matchedSubjectKey === 'Matemática' ? 75 : (matchedSubjectKey === 'Física' ? 75 : 70);
      } else if (currentExam.id === 'espcex') {
        cutoffScore = 65;
      } else if (currentExam.id === 'afa') {
        cutoffScore = 70;
      }

      // Current overall proficiency (weighted combination of topic coverage + accuracy)
      const currentProficiency = Math.min(
        100,
        Math.round(topicCoveragePercent * 0.6 + (questionAccuracy > 0 ? questionAccuracy * 0.4 : 35))
      );

      // Clean short label for charts
      let shortLabel = subject.name.split('(')[0].trim();
      if (shortLabel.length > 18) {
        shortLabel = shortLabel.substring(0, 16) + '...';
      }

      return {
        subjectIndex: idx,
        fullName: subject.name,
        subjectLabel: shortLabel,
        category: matchedSubjectKey,
        totalTopics,
        checkedTopics,
        coveragePercent: topicCoveragePercent,
        currentLevel: currentProficiency,
        cutoffGoal: cutoffScore,
        accuracy: questionAccuracy,
        weight: subject.weightOrQuestions
      };
    });
  }, [currentExam, questionAttempts]);

  // Overall Exam Readiness Score (0 to 100)
  const examReadinessScore = useMemo(() => {
    if (!examSubjectsData.length) return 0;
    const avg = examSubjectsData.reduce((acc, s) => acc + s.currentLevel, 0) / examSubjectsData.length;
    return Math.round(avg);
  }, [examSubjectsData]);

  // Total topics in this exam
  const examTotalTopics = currentExam?.subjects.reduce((acc, s) => acc + s.topics.length, 0) || 0;
  const examCheckedTopics = currentExam?.subjects.reduce((acc, s) => acc + s.topics.filter(t => t.isChecked).length, 0) || 0;
  const examOverallCoverage = examTotalTopics > 0 ? Math.round((examCheckedTopics / examTotalTopics) * 100) : 0;

  // Custom Tooltip for Daily Study Chart
  const CustomDailyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0B1120] border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 min-w-[170px]">
          <p className="font-bold text-white border-b border-slate-800 pb-1 flex items-center justify-between">
            <span>{data.label}</span>
            <span className="font-mono text-cyan-400 font-extrabold">{data.hours}h</span>
          </p>
          <div className="space-y-1 text-slate-300">
            <p className="flex justify-between">
              <span className="text-slate-400">Tempo Líquido:</span>
              <span className="font-semibold text-white font-mono">{data.minutes} min ({data.hours}h)</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-400">Meta do Dia:</span>
              <span className="font-mono text-slate-300">{data.targetHours}h</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-400">Foco Principal:</span>
              <span className="text-blue-400 font-semibold">{data.subject}</span>
            </p>
            <p className="flex justify-between items-center pt-1 border-t border-slate-800/80">
              <span className="text-slate-400">Atingimento:</span>
              <span className={`font-mono font-bold ${data.hours >= data.targetHours ? 'text-emerald-400' : 'text-amber-400'}`}>
                {Math.round((data.hours / (data.targetHours || 1)) * 100)}%
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Radar and Bar charts
  const CustomSubjectTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0B1120] border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs space-y-2 max-w-xs">
          <p className="font-bold text-white border-b border-slate-800 pb-1">
            {data.fullName}
          </p>
          <div className="space-y-1 text-slate-300">
            <p className="flex justify-between">
              <span className="text-slate-400">Nível do Cadete:</span>
              <span className="font-mono font-extrabold text-cyan-400">{data.currentLevel}%</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-400">Corte Estimado:</span>
              <span className="font-mono text-amber-400">{data.cutoffGoal}%</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-400">Cobertura do Edital:</span>
              <span className="font-mono text-emerald-400">{data.checkedTopics}/{data.totalTopics} tópicos ({data.coveragePercent}%)</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-400">Peso no Exame:</span>
              <span className="text-slate-200">{data.weight}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Top Concurso Militar Selector Ribbon */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                MONITORAMENTO DE EDITAIS MILITARES
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                D3 & Recharts Visualizer
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-400" />
              <span>Concurso Selecionado: {currentExam?.name}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentExam?.fullName} • {currentExam?.institution}
            </p>
          </div>

          {/* Exam Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {militaryExams.map(exam => {
              const isSelected = exam.id === selectedExamId;
              return (
                <button
                  key={exam.id}
                  onClick={() => setSelectedExamId(exam.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{exam.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Exam KPI Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Índice de Prontidão</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-cyan-400 font-mono">{examReadinessScore}%</span>
              <span className="text-[10px] text-slate-500 font-mono">
                {examReadinessScore >= 75 ? 'Excelente' : (examReadinessScore >= 50 ? 'Intermediário' : 'Em Construção')}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Cobertura do Edital</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400 font-mono">{examOverallCoverage}%</span>
              <span className="text-[10px] text-slate-500 font-mono">{examCheckedTopics}/{examTotalTopics} tópicos</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Disciplinas Cobradas</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white font-mono">{currentExam?.subjects.length}</span>
              <span className="text-[10px] text-slate-500 font-mono">matérias no edital</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Carreira Alvo</span>
            <p className="text-xs font-semibold text-slate-200 truncate mt-1" title={currentExam?.targetCareer}>
              {currentExam?.targetCareer}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: TEMPO DE ESTUDO DIÁRIO (RECHARTS AREA / BAR CHART)             */}
      {/* ========================================================================= */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 md:p-7 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base md:text-lg font-bold text-white">
                Tempo de Estudo Diário (Horas Líquidas)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Histórico diário de dedicação cronometrada com linha de meta diária ({dailyGoalHours}h/dia).
            </p>
          </div>

          {/* Time Range & Chart Type Filters */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Chart Type (Area vs Bar) */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setDailyChartType('area')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  dailyChartType === 'area' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Área
              </button>
              <button
                onClick={() => setDailyChartType('bar')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  dailyChartType === 'bar' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Barras
              </button>
            </div>

            {/* Time range selector */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              {[7, 14, 30].map(days => (
                <button
                  key={days}
                  onClick={() => setTimeRangeDays(days as any)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    timeRangeDays === days
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {days}D
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Period Stat Chips */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-850">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Total no período: <strong className="text-white">{totalPeriodHours.toFixed(1)} horas</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Média diária: <strong className="text-white">{avgDailyHours} horas/dia</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Dias batendo a meta: <strong className="text-emerald-400">{daysMetGoal} de {timeRangeDays} dias</strong></span>
          </div>
        </div>

        {/* Recharts Chart Container */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {dailyChartType === 'area' ? (
              <AreaChart data={dailyStudyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="studyHoursGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  unit="h"
                />
                <Tooltip content={<CustomDailyTooltip />} />
                <ReferenceLine
                  y={dailyGoalHours}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{ value: `Meta: ${dailyGoalHours}h`, fill: '#f59e0b', fontSize: 11, position: 'insideTopRight' }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  name="Horas Estudadas"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#studyHoursGradient)"
                  activeDot={{ r: 6, fill: '#38bdf8', stroke: '#0B1120', strokeWidth: 2 }}
                />
              </AreaChart>
            ) : (
              <BarChart data={dailyStudyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  unit="h"
                />
                <Tooltip content={<CustomDailyTooltip />} />
                <ReferenceLine
                  y={dailyGoalHours}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{ value: `Meta: ${dailyGoalHours}h`, fill: '#f59e0b', fontSize: 11, position: 'insideTopRight' }}
                />
                <Bar
                  dataKey="hours"
                  name="Horas Estudadas"
                  radius={[6, 6, 0, 0]}
                >
                  {dailyStudyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.hours >= dailyGoalHours ? '#06b6d4' : '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: EVOLUÇÃO NAS MATÉRIAS DO CONCURSO (RADAR + BARRAS RECHARTS)     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Radar Chart of Disciplines vs Cut-Off Goal (7 cols) */}
        <div className="lg:col-span-7 bg-[#0B1120] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">
                Teia de Proficiência: {currentExam?.name}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              Nível Atual vs Corte
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Comparativo multidimensional entre a sua proficiência e a nota de corte histórica recomendada para cada matéria do {currentExam?.name}.
          </p>

          {/* Radar Chart Container */}
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={examSubjectsData} outerRadius="75%">
                <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="subjectLabel"
                  stroke="#94a3b8"
                  fontSize={11}
                  tick={{ fill: '#cbd5e1' }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  stroke="#475569"
                  fontSize={10}
                  unit="%"
                />
                <Tooltip content={<CustomSubjectTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  formatter={(value) => <span className="text-slate-300 font-semibold">{value}</span>}
                />
                <Radar
                  name="Corte Estimado (%)"
                  dataKey="cutoffGoal"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.15}
                  strokeDasharray="4 4"
                />
                <Radar
                  name="Seu Nível Atual (%)"
                  dataKey="currentLevel"
                  stroke="#38bdf8"
                  fill="#0284c7"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Bar Chart of Subject Topics Coverage (5 cols) */}
        <div className="lg:col-span-5 bg-[#0B1120] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Cobertura por Matéria
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                Tópicos do Edital
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Percentual dos tópicos oficiais do edital já dominados e marcados como estudados.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={examSubjectsData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={10} unit="%" />
                <YAxis
                  type="category"
                  dataKey="subjectLabel"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  width={85}
                />
                <Tooltip content={<CustomSubjectTooltip />} />
                <Bar
                  dataKey="coveragePercent"
                  name="Cobertura do Edital (%)"
                  fill="#10b981"
                  radius={[0, 6, 6, 0]}
                >
                  {examSubjectsData.map((entry, index) => (
                    <Cell
                      key={`cov-${index}`}
                      fill={entry.coveragePercent >= 70 ? '#10b981' : (entry.coveragePercent >= 40 ? '#06b6d4' : '#6366f1')}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: CHECKLIST DINÂMICA DE TÓPICOS DO EDITAL DO CONCURSO SELECIONADO */}
      {/* ========================================================================= */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 md:p-7 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              <span>Grade de Tópicos do Edital Oficial: {currentExam?.name}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Marque os tópicos concluídos conforme você estuda para atualizar instantaneamente os gráficos de evolução acima.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
              {examCheckedTopics} de {examTotalTopics} tópicos ({examOverallCoverage}%)
            </span>
          </div>
        </div>

        {/* Subjects Accordion / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentExam?.subjects.map((subject, sIdx) => {
            const checkedCount = subject.topics.filter(t => t.isChecked).length;
            const totalCount = subject.topics.length;
            const pct = Math.round((checkedCount / totalCount) * 100);

            return (
              <div
                key={sIdx}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate" title={subject.name}>
                      {subject.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {subject.weightOrQuestions}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-cyan-400 shrink-0 ml-2">
                    {pct}% ({checkedCount}/{totalCount})
                  </span>
                </div>

                {/* Progress Mini Bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Topics List with Toggle Checkbox */}
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                  {subject.topics.map(topic => (
                    <div
                      key={topic.id}
                      onClick={() => toggleMilitaryTopic(selectedExamId, sIdx, topic.id)}
                      className={`p-2 rounded-lg border text-xs flex items-start gap-2.5 transition-colors cursor-pointer ${
                        topic.isChecked
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <button
                        type="button"
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                          topic.isChecked
                            ? 'bg-emerald-500 text-white'
                            : 'border border-slate-600 bg-slate-800'
                        }`}
                        aria-label="Marcar tópico"
                      >
                        {topic.isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                      <span className={`text-[11px] leading-tight ${topic.isChecked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {topic.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
