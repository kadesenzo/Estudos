import React, { useState } from 'react';
import {
  Shield,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Award,
  ChevronRight,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export const MilitaryExamsView: React.FC = () => {
  const { militaryExams, toggleMilitaryTopic, profile, updateProfile, navigateTo } = useStudy();
  const [selectedExamId, setSelectedExamId] = useState<string>(() => {
    return profile.targetExam ? profile.targetExam.toLowerCase().replace(/\s+/g, '') : 'ita';
  });

  const selectedExam = militaryExams.find(e => e.id === selectedExamId) || militaryExams[0];

  // Calculate syllabus coverage
  const totalTopics = selectedExam.subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const checkedTopics = selectedExam.subjects.reduce((acc, s) => acc + s.topics.filter(t => t.isChecked).length, 0);
  const syllabusPercent = totalTopics > 0 ? Math.round((checkedTopics / totalTopics) * 100) : 0;

  const handleSetTarget = (examName: string) => {
    updateProfile({ targetExam: examName });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" />
            <span>Central de Concursos Militares</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organização oficial de editais, requisitos de idade, fases do concurso e checklist do edital verticalizado.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-800/50 text-xs">
          <span className="text-slate-400">Seu Alvo Atual:</span>
          <span className="font-extrabold text-blue-400 font-mono">{profile.targetExam}</span>
        </div>
      </div>

      {/* Military Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {militaryExams.map((exam) => {
          const isSelected = exam.id === selectedExam.id;
          const isUserTarget = profile.targetExam.toLowerCase() === exam.name.toLowerCase();

          return (
            <button
              key={exam.id}
              onClick={() => setSelectedExamId(exam.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-950/50'
                  : 'bg-[#0B1120] border-slate-800 hover:border-slate-700'
              }`}
            >
              {isUserTarget && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
              <div>
                <span className={`text-base font-extrabold font-mono block ${isSelected ? 'text-blue-400' : 'text-white'}`}>
                  {exam.name}
                </span>
                <span className="text-[11px] text-slate-400 block line-clamp-1 mt-0.5">{exam.institution}</span>
              </div>

              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-3">
                {exam.targetCareer.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Exam Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Details, Requirements, Stages (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Card */}
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                  {selectedExam.institution}
                </span>
                <h2 className="text-2xl font-black text-white mt-1.5 font-mono">{selectedExam.name}</h2>
                <p className="text-xs text-slate-400 font-medium">{selectedExam.fullName}</p>
              </div>

              {profile.targetExam.toLowerCase() !== selectedExam.name.toLowerCase() && (
                <button
                  onClick={() => handleSetTarget(selectedExam.name)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-colors"
                >
                  Definir como Meu Alvo
                </button>
              )}
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-500 block text-[11px]">Carreira & Posto de Formação</span>
              <span className="text-slate-200 font-semibold">{selectedExam.targetCareer}</span>
            </div>

            <a
              href={selectedExam.officialEditalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span>Acessar Página Oficial do Concurso</span>
            </a>
          </div>

          {/* Official Requirements Card */}
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400" />
              <span>Requisitos Oficiais do Concurso</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="font-bold text-slate-400 block mb-0.5">Faixa Etária:</span>
                <p className="text-slate-200">{selectedExam.requirements.age}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="font-bold text-slate-400 block mb-0.5">Escolaridade:</span>
                <p className="text-slate-200">{selectedExam.requirements.education}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="font-bold text-slate-400 block mb-0.5">Estatura Mínima:</span>
                <p className="text-slate-200">{selectedExam.requirements.height}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="font-bold text-slate-400 block mb-0.5">Estado Civil:</span>
                <p className="text-slate-200">{selectedExam.requirements.maritalStatus}</p>
              </div>
            </div>
          </div>

          {/* Stages Card */}
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              <span>Etapas do Concurso</span>
            </h3>

            <div className="space-y-2 text-xs">
              {selectedExam.stages.map((stage, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/50">
                  <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-300 leading-snug">{stage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Edital Verticalizado & Checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Syllabus Progress Hero */}
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Edital Verticalizado & Cobertura</h3>
                <p className="text-xs text-slate-400">Marque os tópicos já estudados e revisados.</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-blue-400 font-mono">{syllabusPercent}%</span>
                <span className="text-[11px] text-slate-500 block">{checkedTopics} de {totalTopics} tópicos</span>
              </div>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${syllabusPercent}%` }}
              />
            </div>
          </div>

          {/* Subjects Accordion Checklist */}
          <div className="space-y-4">
            {selectedExam.subjects.map((sub, sIdx) => {
              const subDone = sub.topics.filter(t => t.isChecked).length;
              const subPercent = sub.topics.length > 0 ? Math.round((subDone / sub.topics.length) * 100) : 0;

              return (
                <div key={sub.name} className="bg-[#0B1120] border border-slate-800 rounded-xl overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{sub.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{sub.weightOrQuestions}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {subDone}/{sub.topics.length} ({subPercent}%)
                      </span>
                    </div>
                  </div>

                  <div className="p-4 divide-y divide-slate-800/60 space-y-1">
                    {sub.topics.map((topic) => (
                      <div
                        key={topic.id}
                        onClick={() => toggleMilitaryTopic(selectedExam.id, sIdx, topic.id)}
                        className="py-2.5 flex items-center gap-3 cursor-pointer group select-none"
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${
                          topic.isChecked
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-700 group-hover:border-slate-500 text-transparent'
                        }`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>

                        <span className={`text-xs transition-colors ${
                          topic.isChecked ? 'text-slate-400 line-through' : 'text-slate-200 group-hover:text-blue-400'
                        }`}>
                          {topic.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tactical Advice Box */}
          <div className="bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-800/40 rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Diretriz Estratégica do Concurso</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedExam.tips}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
