import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  Brain,
  Shield,
  FileText
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

export const AIAssistantView: React.FC = () => {
  const { profile, courses, notes } = useStudy();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `Olá, ${profile.displayName}! Sou o AETHON AI, seu orientador acadêmico tático para concursos militares (${profile.targetExam}) e vestibulares de alta concorrência.\n\nPosso te ajudar a:\n1. Desmistificar fórmulas e conceitos difíceis de Física, Matemática e Química.\n2. Tirar dúvidas gramaticais, crase, regência e estrutura de Redação militar.\n3. Resumir anotações do seu caderno.\n4. Gerar questões inéditas para treinar seu raciocínio.\n\nQual tópico você quer dominar hoje?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    { label: 'Explicar Vértice da Parábola na EsPCEx', prompt: 'Explique de forma didática e tática como as bancas militares (EsPCEx, ESA, EEAR) cobram o vértice da parábola (Xv e Yv), com um exemplo resolvido passo a passo.' },
    { label: 'Como não errar Crase', prompt: 'Apresente um guia mnemônico definitivo dos 5 casos proibidos e dos casos obrigatórios de crase para concursos militares.' },
    { label: 'Decomposição de Forças no Plano Inclinado', prompt: 'Explique o passo a passo da decomposição da força peso em plano inclinado com atrito estático e dinâmico, fornecendo as fórmulas de P_x e P_y.' },
    { label: 'Montar Estrutura de Redação Militar', prompt: 'Qual é o modelo ideal de introdução, desenvolvimento em 2 parágrafos com repertório e conclusão para a redação dissertativo-argumentativa militar?' }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      role: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          context: `Usuário focado em ${profile.targetExam}. Plataforma Aethon Militar.`
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: data.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        // Fallback didactic response
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: `Análise Tática Aethon sobre: "${query}"\n\n1. Fundamento Conceitual: Este tópico é um dos pilares mais frequentes em provas das Forças Armadas.\n2. Aplicação Prática: Ao resolver problemas desta natureza, destaque sempre as incógnitas e unidades no Sistema Internacional (SI).\n3. Dica Militar: Não tente memorizar apenas o resultado final; compreenda a dedução lógica passo a passo para não cair nas pegadinhas da banca.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `Resposta de Orientação: Mantenha o foco em resolver exercícios práticos após estudar a teoria. Se precisar de uma explicação detalhada de matemática ou física, utilize também o caderno de resoluções de simulados!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-400" />
            <span>Assistente Tático de Estudos (AETHON AI)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tire dúvidas conceituais, gere resumos, esclareça cálculos e analise erros com inteligência militar aplicada.
          </p>
        </div>

        <span className="text-[10px] font-bold font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
          Tutor Militar Ativo
        </span>
      </div>

      {/* Messages Chat Box */}
      <div className="flex-1 overflow-y-auto bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs md:text-sm leading-relaxed whitespace-pre-line shadow-md ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-xs font-medium'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs'
              }`}
            >
              <p>{m.text}</p>
              <span className={`block text-[10px] mt-2 font-mono ${m.role === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
                {m.time}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              O Tutor Aethon está formulando a explicação passo a passo...
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp.prompt)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-white text-xs whitespace-nowrap transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="shrink-0 flex items-center gap-2">
        <input
          type="text"
          placeholder="Faça uma pergunta sobre matemática, física, química, gramática ou estratégias de prova..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-3 bg-[#0B1120] border border-slate-800 rounded-xl text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-md"
        />
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-semibold flex items-center gap-2 disabled:opacity-40 transition-colors shadow-lg shadow-blue-600/30"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </form>
    </div>
  );
};
