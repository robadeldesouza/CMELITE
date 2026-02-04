
import React, { useState, useEffect, useRef } from 'react';
import { ClipboardCheck, AlertTriangle, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, Copy, Check, RotateCcw, ShieldAlert, Cpu, Layers, Download, Upload, MessageSquare, FileJson, FileText } from 'lucide-react';
import { TechChecklistItem, RiskLevel, DecisionStatus, TechArea } from './types';
import { INITIAL_CHECKLIST } from './checklistData';

interface TechnicalChecklistProps {
  isOpen: boolean;
  onClose: () => void;
  embedded?: boolean; // Novo prop para integração
}

const STORAGE_KEY = 'cm_elite_tech_audit_v1';

// Mapeamento de Tradução
const FILTER_LABELS: Record<string, string> = {
  'ALL': 'TODOS',
  'BUILD_INFRA': 'INFRAESTRUTURA',
  'SECURITY': 'SEGURANÇA',
  'ARCHITECTURE': 'ARQUITETURA',
  'PERFORMANCE': 'DESEMPENHO'
};

const RISK_LABELS: Record<RiskLevel, string> = {
  'CRITICAL': 'CRÍTICO',
  'HIGH': 'ALTO',
  'MEDIUM': 'MÉDIO',
  'LOW': 'BAIXO'
};

const STATUS_LABELS: Record<DecisionStatus, string> = {
  'APPROVED': 'APROVADO',
  'REJECTED': 'REJEITADO',
  'DEFERRED': 'ADIADO',
  'PENDING': 'PENDENTE'
};

export const TechnicalChecklist: React.FC<TechnicalChecklistProps> = ({ isOpen, onClose, embedded = false }) => {
  const [items, setItems] = useState<TechChecklistItem[]>(INITIAL_CHECKLIST);
  const [filter, setFilter] = useState<TechArea | 'ALL'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Feedback States
  const [isReportCopied, setIsReportCopied] = useState(false);
  const [isJsonCopied, setIsJsonCopied] = useState(false);
  
  // Estados para Importação
  const [isImporting, setIsImporting] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  // Estados para Observação
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');
  const lastEnterTime = useRef<number>(0);

  // Load from Storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load audit data", e);
      }
    }
  }, []);

  // Auto-Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // GERAÇÃO DE RELATÓRIO (TEXTO FORMATADO)
  const generateExecutionReport = () => {
      const now = new Date().toLocaleString('pt-BR');
      let report = `📋 RELATÓRIO DE AUDITORIA TÉCNICA - ORDEM DE EXECUÇÃO\n`;
      report += `Gerado em: ${now}\n`;
      report += `========================================================\n`;

      const groups: Record<DecisionStatus, TechChecklistItem[]> = {
          'APPROVED': [],
          'DEFERRED': [],
          'REJECTED': [],
          'PENDING': []
      };

      items.forEach(item => groups[item.decision].push(item));

      const sections: { key: DecisionStatus, title: string, icon: string }[] = [
          { key: 'APPROVED', title: 'APROVADOS - FILA DE EXECUÇÃO', icon: '✅' },
          { key: 'DEFERRED', title: 'ADIADOS - BACKLOG', icon: '⏳' },
          { key: 'REJECTED', title: 'REJEITADOS / ARQUIVADOS', icon: '❌' },
          { key: 'PENDING', title: 'PENDENTES DE ANÁLISE', icon: '⚠️' }
      ];

      sections.forEach(section => {
          const groupItems = groups[section.key];
          if (groupItems.length > 0) {
              report += `\n${section.icon} ${section.title} (${groupItems.length})\n`;
              report += `--------------------------------------------------------\n`;
              
              groupItems.forEach((item, idx) => {
                  report += `${idx + 1}. [${RISK_LABELS[item.technicalRisk]}] ${item.topic}\n`;
                  if (item.notes) {
                      report += `   📝 OBS: ${item.notes}\n`;
                  } else {
                      report += `   ℹ️ Impacto: ${item.impact}\n`;
                  }
                  report += `\n`;
              });
          }
      });

      report += `========================================================\n`;
      report += `Total Auditado: ${items.length} itens\n\n`;
      report += `#Aquilo que foi aceito, deve ser removido do check list de auditoria após a implementação.`;
      
      return report;
  };

  const handleCopyReport = async () => {
    const text = generateExecutionReport();
    try {
        await navigator.clipboard.writeText(text);
        setIsReportCopied(true);
        setTimeout(() => setIsReportCopied(false), 2000);
    } catch (err) {
        copyFallback(text, () => {
            setIsReportCopied(true);
            setTimeout(() => setIsReportCopied(false), 2000);
        });
    }
  };

  const handleCopyJSON = async () => {
    const data = JSON.stringify(items, null, 2);
    try {
        await navigator.clipboard.writeText(data);
        setIsJsonCopied(true);
        setTimeout(() => setIsJsonCopied(false), 2000);
    } catch (err) {
        copyFallback(data, () => {
            setIsJsonCopied(true);
            setTimeout(() => setIsJsonCopied(false), 2000);
        });
    }
  };

  const copyFallback = (text: string, onSuccess: () => void) => {
      try {
          const textArea = document.createElement("textarea");
          textArea.value = text;
          textArea.style.position = "fixed";
          textArea.style.left = "-9999px";
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          onSuccess();
      } catch (e) {
          alert('Erro ao copiar. Use Ctrl+C no console.');
      }
  };

  const handleImportState = () => {
    if (!importText.trim()) {
        setImportError("Cole o JSON antes de importar.");
        return;
    }

    try {
        const parsed = JSON.parse(importText);
        if (!Array.isArray(parsed) || (parsed.length > 0 && !parsed[0].id)) {
             throw new Error("Formato inválido. Certifique-se de usar o botão '{ }' para gerar o backup compatível.");
        }
        setItems(parsed);
        setIsImporting(false);
        setImportText('');
        setImportError(null);
        alert("Estado restaurado com sucesso!");
    } catch (e: any) {
        setImportError(`Erro ao ler JSON: ${e.message}`);
    }
  };

  const handleDecision = (id: string, status: DecisionStatus) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, decision: status } : item
    ));
  };

  const handleStartEditNote = (e: React.MouseEvent, item: TechChecklistItem) => {
      e.stopPropagation();
      if (editingNoteId === item.id) {
          setEditingNoteId(null);
      } else {
          setEditingNoteId(item.id);
          setTempNote(item.notes || '');
      }
  };

  const handleSaveNote = (id: string) => {
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, notes: tempNote } : item
      ));
      setEditingNoteId(null);
      setTempNote('');
  };

  const handleNoteKeyDown = (e: React.KeyboardEvent, id: string) => {
      if (e.key === 'Enter' && !e.repeat) {
          const now = Date.now();
          if (now - lastEnterTime.current < 500) {
              e.preventDefault();
              handleSaveNote(id);
          }
          lastEnterTime.current = now;
      }
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL': return 'text-red-500 border-red-500 bg-red-500/10';
      case 'HIGH': return 'text-orange-500 border-orange-500 bg-orange-500/10';
      case 'MEDIUM': return 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
      case 'LOW': return 'text-blue-500 border-blue-500 bg-blue-500/10';
    }
  };

  const getStatusIcon = (status: DecisionStatus) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'REJECTED': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'DEFERRED': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <div className="w-3 h-3 rounded-full border-2 border-slate-500" />;
    }
  };

  const filteredItems = filter === 'ALL' ? items : items.filter(i => i.area === filter);

  if (!isOpen) return null;

  // Lógica de Container baseada no modo Embedded
  const containerClass = embedded 
    ? "w-full h-full flex flex-col bg-slate-900 border border-slate-700 rounded-lg overflow-hidden relative shadow-inner"
    : "bg-slate-900 border border-slate-700 w-full max-w-4xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden relative";

  const wrapperClass = embedded
    ? "h-full w-full animate-fade-in"
    : "fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in";

  return (
    <div className={wrapperClass}>
      <div className={containerClass}>
        
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white font-bold font-mono text-lg tracking-tight">REGISTRO TÉCNICO</h2>
              <p className="text-xs text-slate-400 font-mono">AUDITORIA DO SISTEMA</p>
            </div>
          </div>
          <div className="flex gap-2">
             <button 
                onClick={() => setIsImporting(true)} 
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Importar Backup"
             >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">IMPORTAR</span>
             </button>
             
             {/* Botão Secundário: Backup JSON */}
             <button 
                onClick={handleCopyJSON} 
                className={`flex items-center justify-center px-3 py-2 rounded-lg text-xs font-bold transition-all border ${isJsonCopied ? 'bg-emerald-900/50 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
                title="Copiar JSON (Backup para Importação)"
             >
                {isJsonCopied ? <Check className="w-4 h-4" /> : <FileJson className="w-4 h-4" />}
                <span className="hidden sm:inline ml-2">{isJsonCopied ? 'COPIADO' : '{ }'}</span>
             </button>

             {/* Botão Principal: Relatório de Execução */}
             <button 
                onClick={handleCopyReport} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${isReportCopied ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'}`}
             >
                {isReportCopied ? <Check className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                {isReportCopied ? 'COPIADO!' : 'RELATÓRIO'}
             </button>

             {!embedded && (
                 <button onClick={onClose} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors">
                    <XCircle className="w-6 h-6" />
                 </button>
             )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-900 border-b border-slate-800 p-2 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
          {['ALL', 'BUILD_INFRA', 'SECURITY', 'ARCHITECTURE', 'PERFORMANCE'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                filter === f 
                  ? 'bg-slate-100 text-slate-900' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {FILTER_LABELS[f] || f}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/50">
          {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                  <ShieldAlert className="w-10 h-10 mb-2 opacity-20" />
                  <p className="text-xs font-mono">NENHUM ITEM NESTA CATEGORIA</p>
              </div>
          ) : (
            filteredItems.map((item) => (
            <div 
              key={item.id} 
              className={`border rounded-lg bg-slate-800/50 transition-all duration-200 ${
                expandedId === item.id ? 'border-indigo-500/50 shadow-lg bg-slate-800' : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              {/* Card Header */}
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-widest ${getRiskColor(item.technicalRisk)}`}>
                    {RISK_LABELS[item.technicalRisk] || item.technicalRisk}
                  </span>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-slate-200 font-bold text-sm truncate">{item.topic}</h3>
                    <p className="text-xs text-slate-500 truncate font-mono">{item.currentStatus}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 rounded border border-slate-800">
                     <span className="text-[10px] text-slate-500 font-bold uppercase">Decisão:</span>
                     {getStatusIcon(item.decision)}
                     <span className={`text-[10px] font-bold ${
                        item.decision === 'APPROVED' ? 'text-emerald-500' :
                        item.decision === 'REJECTED' ? 'text-red-500' :
                        item.decision === 'DEFERRED' ? 'text-yellow-500' : 'text-slate-400'
                     }`}>
                        {STATUS_LABELS[item.decision] || item.decision}
                     </span>
                  </div>
                  {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </div>
              </div>

              {/* Card Details (Expanded) */}
              {expandedId === item.id && (
                <div className="px-4 pb-4 border-t border-slate-700/50 animate-slide-down">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-slate-950/50 p-3 rounded border border-slate-800">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Impacto Técnico
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{item.impact}</p>
                    </div>
                    
                    <div className="bg-indigo-900/10 p-3 rounded border border-indigo-500/20">
                      <h4 className="text-[10px] font-bold text-indigo-400 uppercase mb-2 flex items-center gap-1">
                        <Cpu className="w-3 h-3" /> Recomendação
                      </h4>
                      <p className="text-sm text-indigo-200 leading-relaxed">{item.recommendation}</p>
                    </div>
                  </div>

                  {/* OBSERVAÇÃO EDITOR */}
                  {editingNoteId === item.id && (
                      <div className="mt-4 bg-slate-950 p-3 rounded border border-slate-700 animate-fade-in">
                          <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Observação Interna</span>
                              <span className="text-[9px] text-slate-600">Pressione <span className="text-slate-400 font-bold">Enter 2x</span> para salvar</span>
                          </div>
                          <textarea
                              autoFocus
                              value={tempNote}
                              onChange={(e) => setTempNote(e.target.value)}
                              onKeyDown={(e) => handleNoteKeyDown(e, item.id)}
                              placeholder="Digite sua observação aqui (sem limite)..."
                              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none min-h-[80px] resize-y scrollbar-thin scrollbar-thumb-slate-700"
                          />
                      </div>
                  )}

                  <div className="mt-4 flex justify-end gap-2 border-t border-slate-700/50 pt-4">
                     <button
                        onClick={(e) => handleStartEditNote(e, item)}
                        className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors mr-auto ${
                            item.notes ? 'bg-indigo-900/30 text-indigo-400 border border-indigo-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                        }`}
                        title="Adicionar/Editar Observação"
                     >
                        <MessageSquare className="w-3.5 h-3.5" />
                        {item.notes ? '[OBSERVAÇÃO *]' : '[OBSERVAÇÃO]'}
                     </button>

                     <button 
                        onClick={(e) => { e.stopPropagation(); handleDecision(item.id, 'APPROVED'); }}
                        className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors ${item.decision === 'APPROVED' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
                     >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Implementar
                     </button>
                     <button 
                        onClick={(e) => { e.stopPropagation(); handleDecision(item.id, 'DEFERRED'); }}
                        className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors ${item.decision === 'DEFERRED' ? 'bg-yellow-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
                     >
                        <Clock className="w-3.5 h-3.5" /> Adiar
                     </button>
                     <button 
                        onClick={(e) => { e.stopPropagation(); handleDecision(item.id, 'REJECTED'); }}
                        className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors ${item.decision === 'REJECTED' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
                     >
                        <XCircle className="w-3.5 h-3.5" /> Rejeitar
                     </button>
                  </div>
                </div>
              )}
            </div>
          ))
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-slate-950 p-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono shrink-0">
           <span>Total de Itens: {items.length}</span>
           <span>Críticos Pendentes: {items.filter(i => i.technicalRisk === 'CRITICAL' && i.decision === 'PENDING').length}</span>
        </div>

        {/* IMPORT OVERLAY */}
        {isImporting && (
            <div className="absolute inset-0 bg-slate-900/95 z-50 flex flex-col p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <Upload className="w-5 h-5 text-indigo-400" />
                        Importar Estado (JSON)
                    </h3>
                    <button onClick={() => setIsImporting(false)} className="text-slate-400 hover:text-white">
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>
                
                <p className="text-xs text-slate-400 mb-2">
                    Cole abaixo o código JSON de backup. <br/>
                    <span className="text-indigo-400">Dica: Use o botão secundário &#123; &#125; na tela principal para gerar este código.</span>
                </p>
                
                <textarea 
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder='Cole o JSON aqui...'
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-4 text-xs font-mono text-indigo-200 focus:outline-none focus:border-indigo-500 resize-none mb-4"
                />
                
                {importError && (
                    <div className="p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-xs mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        {importError}
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => setIsImporting(false)}
                        className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                        CANCELAR
                    </button>
                    <button 
                        onClick={handleImportState}
                        className="px-6 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        CARREGAR DADOS
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
