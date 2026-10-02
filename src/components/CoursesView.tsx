import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List as ListIcon,
  Play,
  Heart,
  ExternalLink,
  BookMarked,
  FolderPlus,
  Clock,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  Layers,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { Course, SubjectCategory } from '../types';
import { INITIAL_CATEGORIES } from '../data/initialContent';

export const CoursesView: React.FC = () => {
  const { courses, addCourse, navigateTo } = useStudy();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in_progress' | 'not_started' | 'completed' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedCourseModules, setExpandedCourseModules] = useState<Record<string, boolean>>({});

  const toggleCourseModules = (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    setExpandedCourseModules(prev => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  // New course form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<string>('Concursos Militares');
  const [newInstructor, setNewInstructor] = useState('');
  const [newInstitution, setNewInstitution] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCoverUrl, setNewCoverUrl] = useState('');
  const [newOriginalUrl, setNewOriginalUrl] = useState('');
  const [newPlatform, setNewPlatform] = useState('');

  // Filtering
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'Todas' || course.category === selectedCategory;

    let matchesStatus = true;
    if (filterStatus === 'in_progress') matchesStatus = course.progressPercent > 0 && course.progressPercent < 100;
    if (filterStatus === 'not_started') matchesStatus = course.progressPercent === 0;
    if (filterStatus === 'completed') matchesStatus = course.progressPercent === 100;
    if (filterStatus === 'favorites') matchesStatus = !!course.isFavorite;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCourse({
      title: newTitle,
      category: newCategory,
      instructor: newInstructor,
      institution: newInstitution,
      description: newDescription,
      coverUrl: newCoverUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
      originalUrl: newOriginalUrl,
      platform: newPlatform || 'Manual'
    });

    setModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewInstructor('');
    setNewInstitution('');
    setNewCoverUrl('');
    setNewOriginalUrl('');
    setNewPlatform('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <span>Biblioteca de Cursos</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize cursos próprios, materiais externos, videoaulas e apostilas em um único painel tático.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Curso</span>
        </button>
      </div>

      {/* Category Pills Slider */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('Todas')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'Todas'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Todas as Categorias ({courses.length})
        </button>

        {INITIAL_CATEGORIES.map((cat) => {
          const count = courses.filter((c) => c.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat} {count > 0 && <span className="opacity-75">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="bg-[#0B1120] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título, matéria ou assunto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Status Filters & View Mode */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                filterStatus === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterStatus('in_progress')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                filterStatus === 'in_progress' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Em Andamento
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                filterStatus === 'completed' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Concluídos
            </button>
            <button
              onClick={() => setFilterStatus('favorites')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                filterStatus === 'favorites' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Favoritos
            </button>
          </div>

          {/* Grid vs List toggle */}
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-slate-400">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-slate-800 text-blue-400' : 'hover:text-white'}`}
              title="Visualização em Grade"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-slate-800 text-blue-400' : 'hover:text-white'}`}
              title="Visualização em Lista"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Courses Display */}
      {filteredCourses.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigateTo('course-detail', course.id)}
                className="bg-[#0B1120] border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/40 hover:shadow-xl transition-all cursor-pointer flex flex-col group"
              >
                {/* Course Cover */}
                <div className="h-44 relative bg-slate-900 overflow-hidden">
                  <img
                    src={course.coverUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-80" />

                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-blue-600/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                    {course.category}
                  </span>

                  {course.progressPercent === 100 && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                      Concluído
                    </span>
                  )}
                </div>

                {/* Course Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                    {course.instructor && (
                      <p className="text-[11px] text-slate-500 mt-2">
                        {course.instructor} {course.institution && `• ${course.institution}`}
                      </p>
                    )}
                  </div>

                  {/* Progress & Bottom Bar */}
                  <div className="space-y-3 pt-2 border-t border-slate-800/80">
                    {(() => {
                      const completedLessons = course.modules?.flatMap(m => m.lessons).filter(l => l.isCompleted).length || 0;
                      const totalLessons = course.modules?.flatMap(m => m.lessons).length || course.lessonsCount || 0;
                      const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : course.progressPercent;
                      const completedModules = course.modules?.filter(m => m.lessons.length > 0 && m.lessons.every(l => l.isCompleted)).length || 0;
                      const totalModules = course.modules?.length || course.modulesCount || 0;
                      const isModulesExpanded = !!expandedCourseModules[course.id];

                      return (
                        <>
                          {/* Barra de Progresso Individual do Curso */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-300 font-semibold flex items-center gap-1">
                                <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                                <span>Progresso do Curso</span>
                              </span>
                              <span className="font-extrabold text-white font-mono bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                                {percent}%
                              </span>
                            </div>

                            <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  percent === 100
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                    : percent > 0
                                    ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400'
                                    : 'bg-transparent'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                              <span>
                                <strong className="text-white">{completedLessons}</strong> de <strong className="text-white">{totalLessons}</strong> aulas assistidas
                              </span>
                              <span className="text-cyan-400">
                                {completedModules}/{totalModules} módulos
                              </span>
                            </div>
                          </div>

                          {/* Botão para Expandir/Recolher Módulos com Barras de Progresso Individuais */}
                          {course.modules && course.modules.length > 0 && (
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={(e) => toggleCourseModules(e, course.id)}
                                className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center justify-between transition-colors"
                              >
                                <span className="flex items-center gap-1.5">
                                  <Layers className="w-3 h-3 text-blue-400" />
                                  <span>Progresso dos Módulos ({course.modules.length})</span>
                                </span>
                                {isModulesExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5 text-blue-400" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                )}
                              </button>

                              {/* Lista de Barras de Progresso dos Módulos */}
                              {isModulesExpanded && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-1 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 divide-y divide-slate-800/50"
                                >
                                  {course.modules.map((mod) => {
                                    const modTotal = mod.lessons.length;
                                    const modCompleted = mod.lessons.filter(l => l.isCompleted).length;
                                    const modPercent = modTotal > 0 ? Math.round((modCompleted / modTotal) * 100) : 0;
                                    const isModDone = modTotal > 0 && modCompleted === modTotal;

                                    return (
                                      <div key={mod.id} className="pt-2 first:pt-0 space-y-1">
                                        <div className="flex items-center justify-between text-[11px] gap-2">
                                          <span className="text-slate-300 font-medium truncate max-w-[170px]" title={mod.title}>
                                            {mod.title}
                                          </span>
                                          <span className="font-mono text-[10px] font-bold text-white shrink-0">
                                            {modPercent}%
                                          </span>
                                        </div>

                                        {/* Barra de Progresso Individual deste Módulo */}
                                        <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                                          <div
                                            className={`h-full rounded-full transition-all duration-300 ${
                                              isModDone
                                                ? 'bg-emerald-400'
                                                : modPercent > 0
                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                                                : 'bg-transparent'
                                            }`}
                                            style={{ width: `${modPercent}%` }}
                                          />
                                        </div>

                                        <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                                          <span>
                                            {modCompleted} de {modTotal} aulas assistidas no cronograma
                                          </span>
                                          {isModDone && (
                                            <span className="text-emerald-400 font-bold">✓ Concluído</span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/50">
                            <span className="truncate max-w-[160px]">{course.instructor || 'Prof. Oficial'}</span>
                            <span className="text-blue-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                              Acessar Módulos →
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List Mode */
          <div className="space-y-3">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigateTo('course-detail', course.id)}
                className="bg-[#0B1120] border border-slate-800 hover:border-blue-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-800">
                    <img src={course.coverUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-blue-400 uppercase bg-blue-500/10 px-2 py-0.5 rounded">
                        {course.category}
                      </span>
                      {course.progressPercent === 100 && (
                        <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
                          Concluído
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mt-1 truncate">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{course.description}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800">
                  {(() => {
                    const completedLessons = course.modules?.flatMap(m => m.lessons).filter(l => l.isCompleted).length || 0;
                    const totalLessons = course.modules?.flatMap(m => m.lessons).length || course.lessonsCount || 0;
                    const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : course.progressPercent;
                    const isModulesExpanded = !!expandedCourseModules[course.id];

                    return (
                      <div className="w-full sm:w-56 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-medium text-slate-300">Progresso do Curso</span>
                          <span className="font-mono text-white font-extrabold bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/40">{percent}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              percent === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-blue-600 to-cyan-400'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>
                            <strong className="text-white">{completedLessons}</strong> de <strong className="text-white">{totalLessons}</strong> aulas
                          </span>
                          {course.modules && course.modules.length > 0 && (
                            <button
                              type="button"
                              onClick={(e) => toggleCourseModules(e, course.id)}
                              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5"
                            >
                              <span>{course.modules.length} mód</span>
                              {isModulesExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          )}
                        </div>

                        {/* Expandable Module Bars in List Mode */}
                        {isModulesExpanded && course.modules && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="mt-2 space-y-1.5 p-2 bg-slate-950/80 rounded border border-slate-800 text-left max-h-36 overflow-y-auto"
                          >
                            {course.modules.map(mod => {
                              const mTot = mod.lessons.length;
                              const mComp = mod.lessons.filter(l => l.isCompleted).length;
                              const mPct = mTot > 0 ? Math.round((mComp / mTot) * 100) : 0;
                              return (
                                <div key={mod.id} className="text-[9px] space-y-0.5">
                                  <div className="flex justify-between text-slate-300">
                                    <span className="truncate max-w-[120px]">{mod.title}</span>
                                    <span className="font-mono font-bold text-white">{mPct}%</span>
                                  </div>
                                  <div className="w-full h-1 rounded bg-slate-900 overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${mPct}%` }} />
                                  </div>
                                  <span className="text-slate-500 font-mono">{mComp}/{mTot} aulas</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <button className="px-3.5 py-1.5 rounded-lg bg-blue-600 group-hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0">
                    <Play className="w-3 h-3 fill-white" />
                    <span>Abrir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="bg-[#0B1120] border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-400">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Nenhum curso encontrado</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Não encontramos cursos com os filtros selecionados. Tente limpar os filtros ou cadastre um novo curso manualmente.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
          >
            Cadastrar Novo Curso
          </button>
        </div>
      )}

      {/* Manual Course Registration Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Cadastrar Novo Curso</h2>
                <p className="text-xs text-slate-400 mt-0.5">Adicione cursos que você já possui e organize suas matérias.</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Curso *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: Matemática Avançada para EsPCEx"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {INITIAL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Plataforma de Origem</label>
                  <input
                    type="text"
                    placeholder="Ex.: Telegram, Hotmart, Drive, YouTube"
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Professor</label>
                  <input
                    type="text"
                    placeholder="Ex.: Prof. Renato"
                    value={newInstructor}
                    onChange={(e) => setNewInstructor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Instituição</label>
                  <input
                    type="text"
                    placeholder="Ex.: Fênix Concursos, Estratégia, etc."
                    value={newInstitution}
                    onChange={(e) => setNewInstitution(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Link de Acesso Original</label>
                  <input
                    type="url"
                    placeholder="https://t.me/... ou https://..."
                    value={newOriginalUrl}
                    onChange={(e) => setNewOriginalUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">URL da Imagem de Capa (Opcional)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newCoverUrl}
                    onChange={(e) => setNewCoverUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição & Observações</label>
                  <textarea
                    rows={3}
                    placeholder="Anotações gerais sobre a ementa, cronograma ou tópicos prioritários..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  Salvar Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
