import React, { useState } from 'react';
import {
  Shield,
  Clock,
  Target,
  BookOpen,
  Award,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  X,
  Flame,
  Zap,
  BookmarkCheck,
  AlertTriangle,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStudy } from '../context/StudyContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { updateProfile, profile, resetAllToZero, setCourseCheckpoint, courses, setAuthModalOpen } = useStudy();

  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState(profile.displayName || 'Cadete ITA');
  const [exam, setExam] = useState(profile.targetExam || 'ITA');
  const [targetYear, setTargetYear] = useState('2025/2026');
  const [dailyHours, setDailyHours] = useState(4);
  const [preferredShift, setPreferredShift] = useState('Tarde / Noite');
  const [studyMethod, setStudyMethod] = useState('Resolução Intensa de Questões + Videoaulas');

  // Checkpoints: Where did you stop?
  const [mathStopped, setMathStopped] = useState('Do Zero Absoluto (Alfabetização Matemática e Frações)');
  const [physicsStopped, setPhysicsStopped] = useState('Do Zero Absoluto (Cinemática e Vetores)');
  const [chemistryStopped, setChemistryStopped] = useState('Do Zero Absoluto (Atomística e Tabela Periódica)');
  const [weakPoint, setWeakPoint] = useState('Matemática ITA');

  if (!isOpen) return null;

  const handleFinish = async () => {
    // 1. Reset all data so everything starts strictly at zero!
    await resetAllToZero();

    // 2. Set the user's customized profile and checkpoints
    await updateProfile({
      displayName: userName.trim() || 'Cadete ITA',
      targetExam: exam,
      targetYear: targetYear,
      dailyGoalMinutes: dailyHours * 60,
      weeklyGoalHours: dailyHours * 6,
      totalStudyMinutes: 0,
      completedLessonsCount: 0,
      streakDays: 0,
      lastStudyDate: new Date().toISOString().split('T')[0],
      stoppedCheckpoints: {
        'course-mat-telegram': mathStopped,
        'course-fis-telegram': physicsStopped,
        'course-qui-telegram': chemistryStopped
      }
    });

    // 3. Mark the checkpoints in the respective courses
    const matCourse = courses.find(c => c.id === 'course-mat-telegram');
    if (matCourse) {
      await setCourseCheckpoint(matCourse.id, matCourse.id, mathStopped);
    }
    const fisCourse = courses.find(c => c.id === 'course-fis-telegram');
    if (fisCourse) {
      await setCourseCheckpoint(fisCourse.id, fisCourse.id, physicsStopped);
    }
    const quiCourse = courses.find(c => c.id === 'course-qui-telegram');
    if (quiCourse) {
      await setCourseCheckpoint(quiCourse.id, quiCourse.id, chemistryStopped);
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    localStorage.setItem('aethon_onboarding_completed', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-[#0B1120] border border-blue-900/70 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-5 md:p-6 bg-gradient-to-r from-blue-950/80 via-slate-900 to-[#0B1120] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Diagnóstico Tático
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Foco: {exam}
                </span>
              </div>
              <h2 className="text-base md:text-lg font-black text-white tracking-tight">
                Quiz de Nivelamento & Onde Você Parou
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Breadcrumbs */}
        <div className="px-6 pt-3 pb-1 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/40">
          {[
            { num: 1, label: 'Objetivo' },
            { num: 2, label: 'Rotina' },
            { num: 3, label: 'Onde Parei' },
            { num: 4, label: 'Foco ITA' },
            { num: 5, label: 'Zerar' }
          ].map((s) => (
            <div key={s.num} className="flex-1 flex items-center">
              <button
                type="button"
                onClick={() => setStep(s.num)}
                className="flex items-center gap-1.5 group cursor-pointer"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                    step === s.num
                      ? 'bg-blue-600 text-white ring-4 ring-blue-600/20 scale-110'
                      : step > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`hidden sm:inline text-[11px] font-medium ${
                  step === s.num ? 'text-blue-400 font-bold' : 'text-slate-400'
                }`}>
                  {s.label}
                </span>
              </button>
              {s.num < 5 && (
                <div className={`flex-1 h-0.5 mx-2 transition-colors ${
                  step > s.num ? 'bg-emerald-600/70' : 'bg-slate-800'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Steps Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: OBJETIVO & NOME */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Passo 1 de 5</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setAuthModalOpen(true);
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Já tem conta? Fazer Login</span>
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Qual concurso militar é a sua prioridade máxima?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configuraremos as metas, simulados e cadernos de questões com o rigor do seu edital.
                </p>
              </div>

              {/* ITA Featured Banner */}
              <button
                type="button"
                onClick={() => setExam('ITA')}
                className={`w-full p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start justify-between ${
                  exam === 'ITA'
                    ? 'bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/40 shadow-xl shadow-blue-950/50'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500 text-white text-[10px] font-black tracking-widest uppercase">
                      RECOMENDADO / FOCO DO ALUNO
                    </span>
                    <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" /> Nível Máximo
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white tracking-wide">
                    ITA — Instituto Tecnológico de Aeronáutica
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Preparação em nível de excelência máxima em Matemática, Física e Química, além de Português, Inglês e Redação com foco nas bancas mais rigorosas do país.
                  </p>
                </div>
                {exam === 'ITA' && (
                  <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0 ml-3" />
                )}
              </button>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                {[
                  { id: 'IME', title: 'IME', desc: 'Engenharia do Exército' },
                  { id: 'EsPCEx', title: 'EsPCEx', desc: 'Cadetes do Exército (AMAN)' },
                  { id: 'AFA', title: 'AFA', desc: 'Oficiais Aviadores (FAB)' },
                  { id: 'Escola Naval', title: 'Escola Naval', desc: 'Oficiais da Marinha' },
                  { id: 'EEAR', title: 'EEAR', desc: 'Especialistas da Aeronáutica' },
                  { id: 'EFOMM', title: 'EFOMM', desc: 'Marinha Mercante' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setExam(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      exam === item.id
                        ? 'bg-blue-950/50 border-blue-500 text-blue-200 ring-2 ring-blue-500/30'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-black block font-mono text-white">{item.title}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{item.desc}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Como devemos te chamar na plataforma?
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Cadete ITA, Guerreiro, etc..."
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Ano pretendido para a prova
                  </label>
                  <select
                    value={targetYear}
                    onChange={(e) => setTargetYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="2025/2026">Vestibular 2025 / 2026</option>
                    <option value="2026/2027">Vestibular 2026 / 2027</option>
                    <option value="2027+">Longo Prazo (2027 ou mais)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CARGA HORÁRIA & ROTINA */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">Passo 2 de 5</span>
                <h3 className="text-lg font-bold text-white">Carga Horária & Rotina Diária</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Definiremos suas metas diárias reais para calcular seu rendimento com precisão.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Quantas horas líquidas diárias de estudo você planeja?
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[2, 4, 6, 8].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setDailyHours(h)}
                      className={`py-3 rounded-xl text-xs font-bold font-mono transition-all flex flex-col items-center justify-center gap-1 ${
                        dailyHours === h
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-sm font-black">{h}h / dia</span>
                      <span className="text-[10px] opacity-75">{h * 6}h semanais</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Turno com maior rendimento e concentração
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Manhã (06h às 12h)', 'Tarde / Noite (14h às 22h)', 'Madrugada'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setPreferredShift(t)}
                        className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                          preferredShift === t
                            ? 'bg-blue-950/60 border-blue-500 text-blue-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Metodologia principal preferida
                  </label>
                  <div className="space-y-2">
                    {[
                      'Resolução Intensa de Questões + Videoaulas da Biblioteca',
                      'Teoria Completa da Base com Cadernos e Apostilas em PDF',
                      'Ciclo Rápido: Videoaula -> Questões -> Revisão Espaçada'
                    ].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setStudyMethod(m)}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          studyMethod === m
                            ? 'bg-blue-950/40 border-blue-500 text-blue-200 font-semibold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span>{m}</span>
                        {studyMethod === m && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ONDE VOCÊ PAROU NAS MATÉRIAS */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">Passo 3 de 5</span>
                <h3 className="text-lg font-bold text-white">Onde você parou em cada matéria? (Ponto de Partida)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Marque o ponto exato onde você está para que a plataforma aponte seu marcador e você não perca tempo.
                </p>
              </div>

              {/* Matemática */}
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-2">
                <label className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <BookmarkCheck className="w-4 h-4" /> Em qual ponto parou em Matemática?
                </label>
                <select
                  value={mathStopped}
                  onChange={(e) => setMathStopped(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Do Zero Absoluto (Alfabetização Matemática e Frações)">Começar do Zero Absoluto (Alfabetização Matemática e Frações)</option>
                  <option value="Álgebra Elementar e Funções (Afim, Quadrática, Exponencial)">Álgebra Elementar e Funções (Afim, Quadrática, Exponencial)</option>
                  <option value="Trigonometria, Complexos e Polinômios">Trigonometria, Complexos e Polinômios</option>
                  <option value="Geometria Plana Euclidiana e Espacial">Geometria Plana Euclidiana e Espacial</option>
                  <option value="Geometria Analítica e Cônicas (Elipse, Hipérbole)">Geometria Analítica e Cônicas (Elipse, Hipérbole)</option>
                  <option value="Combinatória Avançada, Probabilidade e Matrizes">Combinatória Avançada, Probabilidade e Matrizes</option>
                  <option value="Cálculo Diferencial e Integral para o ITA">Cálculo Diferencial e Integral para o ITA</option>
                </select>
                <span className="text-[11px] text-slate-500 block">
                  Marcador salvo no curso: Matemática Completa da Biblioteca
                </span>
              </div>

              {/* Física */}
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-2">
                <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <BookmarkCheck className="w-4 h-4" /> Em qual ponto parou em Física?
                </label>
                <select
                  value={physicsStopped}
                  onChange={(e) => setPhysicsStopped(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Do Zero Absoluto (Cinemática e Vetores)">Começar do Zero Absoluto (Cinemática e Vetores)</option>
                  <option value="Dinâmica Newtoniana, Atrito e Forças Inerciais">Dinâmica Newtoniana, Atrito e Forças Inerciais</option>
                  <option value="Trabalho, Energia Mecânica e Gravitação">Trabalho, Energia Mecânica e Gravitação</option>
                  <option value="Termologia, Calorimetria e Termodinâmica">Termologia, Calorimetria e Termodinâmica</option>
                  <option value="Ondas, Acústica e Óptica Geométrica/Física">Ondas, Acústica e Óptica Geométrica/Física</option>
                  <option value="Eletrostática, Circuitos Elétricos e Magnetismo">Eletrostática, Circuitos Elétricos e Magnetismo</option>
                </select>
                <span className="text-[11px] text-slate-500 block">
                  Marcador salvo no curso: Física Completa da Biblioteca
                </span>
              </div>

              {/* Química */}
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-2">
                <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <BookmarkCheck className="w-4 h-4" /> Em qual ponto parou em Química?
                </label>
                <select
                  value={chemistryStopped}
                  onChange={(e) => setChemistryStopped(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Do Zero Absoluto (Atomística e Tabela Periódica)">Começar do Zero Absoluto (Atomística e Tabela Periódica)</option>
                  <option value="Ligações Químicas e Funções Inorgânicas">Ligações Químicas e Funções Inorgânicas</option>
                  <option value="Estequiometria Avançada e Gases">Estequiometria Avançada e Gases</option>
                  <option value="Físico-Química (Soluções, Equilíbrio e Eletroquímica)">Físico-Química (Soluções, Equilíbrio e Eletroquímica)</option>
                  <option value="Química Orgânica Completa e Reações">Química Orgânica Completa e Reações</option>
                </select>
                <span className="text-[11px] text-slate-500 block">
                  Marcador salvo no curso: Química Geral e Orgânica da Biblioteca
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: FOCO ITA & PONTO FRACO */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">Passo 4 de 5</span>
                <h3 className="text-lg font-bold text-white">Qual é seu principal gargalo no ITA?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Priorizaremos mais recomendações de questões e simulados autorais nessa área.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'Matemática ITA',
                    title: 'Matemática ITA',
                    desc: 'Cálculo, Cônicas, Complexos e Combinatória rigorosa'
                  },
                  {
                    id: 'Física ITA',
                    title: 'Física ITA',
                    desc: 'Mecânica fina, Termodinâmica, Ondulatória e Eletromagnetismo'
                  },
                  {
                    id: 'Química ITA',
                    title: 'Química ITA',
                    desc: 'Equilíbrio iônico, Físico-Química profunda e Reações Orgânicas'
                  },
                  {
                    id: 'Redação & Português ITA',
                    title: 'Redação & Português',
                    desc: 'Engenharia argumentativa, dialética e norma culta impecável'
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setWeakPoint(item.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      weakPoint === item.id
                        ? 'bg-blue-950/60 border-blue-500 text-blue-200 ring-2 ring-blue-500/30'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block">{item.title}</span>
                    <span className="text-[11px] text-slate-400 block mt-1">{item.desc}</span>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-blue-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-400" /> Banco de Questões do ITA Ativado
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  As questões cadastradas no seu banco contam com resoluções comentadas passo a passo de provas oficiais e autorais do ITA.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRMAÇÃO DO ZERO ABSOLUTO */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">Passo 5 de 5</span>
                <h3 className="text-lg font-bold text-white">Confirmação: Iniciar do Zero Real</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Todas as informações fictícias serão limpas para que você veja exclusivamente seus resultados reais.
                </p>
              </div>

              {/* Zero Confirmation Summary Box */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Configuração Pronta para o {exam}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">TEMPO INICIAL</span>
                    <span className="text-white font-mono font-bold text-sm">0h 00m</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">AULAS CONCLUÍDAS</span>
                    <span className="text-white font-mono font-bold text-sm">0 aulas</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">SEQUÊNCIA (STREAK)</span>
                    <span className="text-white font-mono font-bold text-sm">0 dias</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">META DIÁRIA</span>
                    <span className="text-white font-mono font-bold text-sm">{dailyHours} horas / dia</span>
                  </div>
                </div>

                <div className="space-y-1 pt-1 text-xs border-t border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1">Seus Marcadores ("Onde Parei"):</span>
                  <div className="space-y-1 text-[11px] text-slate-300 font-mono">
                    <p className="flex items-center gap-1.5 truncate">
                      <span className="text-blue-400">📍 Mat:</span> {mathStopped}
                    </p>
                    <p className="flex items-center gap-1.5 truncate">
                      <span className="text-emerald-400">📍 Fís:</span> {physicsStopped}
                    </p>
                    <p className="flex items-center gap-1.5 truncate">
                      <span className="text-amber-400">📍 Quím:</span> {chemistryStopped}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Todos os mais de 600 conteúdos e simulados da biblioteca estarão intactos com 0% de progresso, prontos para você marcar conforme for assistindo ou estudando.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 md:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all hover:scale-102"
            >
              <span>Próximo Passo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluir Quiz & Começar do Zero (0h00)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
