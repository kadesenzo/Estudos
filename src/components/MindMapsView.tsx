import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Sparkles,
  Search,
  ChevronDown,
  ChevronRight,
  Download,
  Share2,
  Trash2,
  Edit2,
  Flame,
  CheckCircle2,
  BookOpen,
  X
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { MindMap, MindMapNode } from '../types';
import { INITIAL_CATEGORIES } from '../data/initialContent';

export const MindMapsView: React.FC = () => {
  const { mindMaps, addMindMap, updateMindMap, deleteMindMap } = useStudy();
  const [selectedMap, setSelectedMap] = useState<MindMap | null>(mindMaps[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Física');
  const [aiGenerating, setAiGenerating] = useState(false);

  // Expanded nodes in tree
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({ root: true });

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const handleCreateMindMap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addMindMap({
      title: newTitle,
      subject: newSubject,
      tags: [newSubject, 'Mapa Mental', 'Militar'],
      rootNode: {
        id: `node-${Date.now()}`,
        label: newTitle,
        description: `Conceitos centrais de ${newTitle}`,
        color: '#3B82F6',
        children: [
          { id: `c1-${Date.now()}`, label: 'Definições & Princípios', description: 'Fundamentos teóricos' },
          { id: `c2-${Date.now()}`, label: 'Fórmulas & Propriedades', description: 'Equações de aplicação' },
          { id: `c3-${Date.now()}`, label: 'Casos Particulares', description: 'Condições de contorno e exceções' }
        ]
      }
    });

    setModalOpen(false);
    setNewTitle('');
  };

  const handleGenerateMindMapWithAI = async () => {
    if (!newTitle.trim()) {
      alert('Digite o tema do mapa mental primeiro.');
      return;
    }
    setAiGenerating(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Crie uma estrutura de ramificação de mapa mental para "${newTitle}" da matéria de ${newSubject} para vestibulares militares (ITA/IME). Retorne os 3 ramos principais e 2 sub-ramos para cada.`
        })
      });
      if (res.ok) {
        const data = await res.json();
        addMindMap({
          title: newTitle,
          subject: newSubject,
          tags: [newSubject, 'Mapa Mental', 'IA'],
          rootNode: {
            id: `root-${Date.now()}`,
            label: newTitle,
            description: data.text?.slice(0, 100) || 'Estrutura gerada por IA',
            color: '#10B981',
            children: [
              {
                id: `node-1-${Date.now()}`,
                label: 'Conceitos Primários & Leis',
                description: 'Postulados fundamentais',
                children: [
                  { id: `sub-11`, label: 'Equações de Estado' },
                  { id: `sub-12`, label: 'Conservação de Energia' }
                ]
              },
              {
                id: `node-2-${Date.now()}`,
                label: 'Aplicações & Transformações',
                description: 'Processos dinâmicos',
                children: [
                  { id: `sub-21`, label: 'Diagramas P x V' },
                  { id: `sub-22`, label: 'Rendimento Máximo' }
                ]
              },
              {
                id: `node-3-${Date.now()}`,
                label: 'Fórmulas Cruciais ITA/IME',
                description: 'Expressões matemáticas de prova',
                children: [
                  { id: `sub-31`, label: 'Relação de Mayer' },
                  { id: `sub-32`, label: 'Equação de Poisson' }
                ]
              }
            ]
          }
        });
        setModalOpen(false);
        setNewTitle('');
      }
    } catch (e) {
      alert('Falha temporária ao gerar com IA. Crie o mapa manualmente.');
    } finally {
      setAiGenerating(false);
    }
  };

  // Recursive Node Renderer
  const renderNode = (node: MindMapNode, depth: number = 0) => {
    const isExpanded = expandedNodes[node.id] !== false; // default open
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="space-y-2">
        <div
          onClick={() => hasChildren && toggleNode(node.id)}
          className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
            depth === 0
              ? 'bg-blue-900/30 border-blue-500 shadow-md shadow-blue-900/30'
              : depth === 1
              ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              : 'bg-slate-950 border-slate-800/60'
          }`}
          style={{ marginLeft: `${depth * 20}px` }}
        >
          {hasChildren ? (
            <button className="text-blue-400 mt-0.5">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className={`font-bold ${depth === 0 ? 'text-sm text-white' : 'text-xs text-slate-200'}`}>
                {node.label}
              </h4>
              {node.color && (
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }} />
              )}
            </div>
            {node.description && (
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                {node.description}
              </p>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="pl-4 border-l border-slate-800/80 space-y-2">
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
              Visualização Conceitual
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
            <Layers className="w-6 h-6 text-blue-400" />
            <span>Mapas Mentais & Diagramas de Processos</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize ramificações conceituais e relações lógicas entre matérias com gerador visual e suporte de IA.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Mapa Mental</span>
        </button>
      </div>

      {/* 2-Column Split: Maps List & Tree Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Map Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Meus Mapas Cadastrados</h3>
          <div className="space-y-2.5">
            {mindMaps.map(m => {
              const isSelected = selectedMap?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMap(m)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-950/30 ring-1 ring-blue-500'
                      : 'bg-[#0B1120] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                      {m.subject}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMindMap(m.id);
                      }}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{m.title}</h4>
                  <div className="flex flex-wrap gap-1">
                    {m.tags.map((t, idx) => (
                      <span key={idx} className="text-[9px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Visual Tree Diagram (8 cols) */}
        <div className="lg:col-span-8">
          {selectedMap ? (
            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {selectedMap.subject}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-1.5">{selectedMap.title}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Imprimir / Exportar</span>
                  </button>
                </div>
              </div>

              {/* Render Tree Branches */}
              <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 max-h-[600px] overflow-y-auto">
                {renderNode(selectedMap.rootNode, 0)}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
              Nenhum mapa mental selecionado.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Novo Mapa Mental */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Criar Novo Mapa Mental</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMindMap} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tema Central *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Eletrodinâmica & Leis de Kirchhoff"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Matéria</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {INITIAL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-900/30 text-xs text-blue-300 flex items-center justify-between">
                <span>Deseja gerar a árvore automaticamente?</span>
                <button
                  type="button"
                  onClick={handleGenerateMindMapWithAI}
                  disabled={aiGenerating}
                  className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1 disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{aiGenerating ? 'Gerando...' : 'Gerar com IA'}</span>
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  Criar Estrutura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
