import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw,
  FileCheck2,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export const CalendarView: React.FC = () => {
  const { routineTasks, reviews, studySessions } = useStudy();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayIndex }, (_, i) => i);

  const getEventsForDay = (day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const tasks = routineTasks.filter(t => t.date === formattedDate);
    const revs = reviews.filter(r => r.nextReviewDate === formattedDate);
    const sessions = studySessions.filter(s => s.date === formattedDate);

    return { tasks, revs, sessions };
  };

  const isToday = (day: number) => {
    const now = new Date();
    return now.getDate() === day && now.getMonth() === month && now.getFullYear() === year;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-blue-400" />
            <span>Calendário de Estudos</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Planejamento mensal de blocos, revisões programadas e sessões executadas.
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-3 bg-[#0B1120] border border-slate-800 rounded-xl p-1.5 px-3">
          <button
            onClick={prevMonth}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-white min-w-[140px] text-center font-mono">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-slate-800 text-center text-xs font-bold text-slate-400 py-3 bg-slate-900/60">
          <span>Dom</span>
          <span>Seg</span>
          <span>Ter</span>
          <span>Qua</span>
          <span>Qui</span>
          <span>Sex</span>
          <span>Sáb</span>
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-800/80 bg-slate-950/30">
          {emptyDays.map((_, idx) => (
            <div key={`empty-${idx}`} className="min-h-[110px] p-2 bg-slate-950/40" />
          ))}

          {daysArray.map((day) => {
            const { tasks, revs, sessions } = getEventsForDay(day);
            const today = isToday(day);

            return (
              <div
                key={`day-${day}`}
                className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                  today ? 'bg-blue-950/20' : 'hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold font-mono w-6 h-6 rounded-full flex items-center justify-center ${
                    today
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300'
                  }`}>
                    {day}
                  </span>

                  {sessions.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Sessão de estudo realizada" />
                  )}
                </div>

                {/* Day events stack */}
                <div className="space-y-1 overflow-hidden">
                  {tasks.slice(0, 2).map((t) => (
                    <div
                      key={t.id}
                      className="px-1.5 py-0.5 rounded text-[10px] truncate bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium"
                      title={t.title}
                    >
                      {t.title}
                    </div>
                  ))}

                  {revs.slice(0, 1).map((r) => (
                    <div
                      key={r.id}
                      className="px-1.5 py-0.5 rounded text-[10px] truncate bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium"
                      title={`Revisão: ${r.title}`}
                    >
                      Revisão: {r.subject}
                    </div>
                  ))}

                  {(tasks.length + revs.length) > 3 && (
                    <span className="text-[9px] text-slate-500 font-bold block px-1">
                      +{(tasks.length + revs.length) - 3} mais
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
