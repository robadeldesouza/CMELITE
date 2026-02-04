import React, { useState, useEffect } from 'react';
import { useCore } from '../core/CoreContext';
import { 
  LayoutDashboard, ShieldAlert, FileText, Bot, Users, Activity, 
  Server, Settings, ToggleLeft, ToggleRight, Database,
  Terminal, AlertTriangle, CheckCircle2, Globe, Lock, Save, FolderTree, Type, HelpCircle, Package, MessageSquare, Plus, Trash2, Mail,
  Zap, Play, Pause, RefreshCw, HardDrive, Download, Search, Timer, TrendingUp, DollarSign, Menu, X, ChevronRight, Edit3, GripVertical, Gift, Ghost, Calendar, Clock, Rocket, Info, Sparkles, ListChecks, History, BookOpen, FileCode
} from 'lucide-react';
import { FeatureFlags, UserRole, PricingMode, PlanContent } from '../core/types';
import { formatCurrency } from '../data/pricing';
import { useDiscountTimer } from '../hooks/useDiscountTimer';

type MenuSection = 
  | 'dashboard' 
  | 'pricing' 
  | 'content' 
  | 'automation' 
  | 'users' 
  | 'system'
  | 'documentation'
  | 'changelog'
  | 'roadmap';

interface MockUser {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    status: 'active' | 'pending';
}

interface Workflow {
    id: string;
    name: string;
    trigger: string;
    status: 'active' | 'paused';
    executions: number;
    lastRun: string;
}

const availableUsersToInvite = [
    { name: "Carlos Ferreira", email: "carlos.ferreira@dev.com" },
    { name: "Amanda Souza", email: "amanda.souza@design.com" },
    { name: "Bruno Lima", email: "bruno.lima@marketing.com" },
    { name: "Diana Prince", email: "diana.prince@security.com" },
    { name: "Erik Lehnsherr", email: "erik.magneto@ops.com" },
    { name: "Natasha Romanoff", email: "nat.spy@agency.com" }
];

// DOCUMENTAÇÃO TÉCNICA (INTEGRADA)
const DOCS_DATA = [
  { 
    id: 'manifesto', 
    title: '00. Manifesto Jarvis v4.7', 
    content: `ESTADO DO PROJETO: PRODUÇÃO / HIGH-FIDELITY PROTOTYPE\nDATA DE AUDITORIA: 29 de Janeiro de 2026\n\nEste ecossistema foi desenhado sob o Protocolo Jarvis para dominação do mercado de otimização de jogos.\n\nFILOSOFIA DE OPERAÇÃO:\n- Autoridade Visual: Estética Hacker/Stealth.\n- Prova Social Híbrida: Chat Global e Sales Toasts.\n- Retenção Crítica: Protocolo Nêmesis disparado em intenção de saída.\n- Suporte de Elite: IA Jade para quebra de objeções técnicas.` 
  },
  { 
    id: 'jade_rules', 
    title: '03. IA Jade (Intelligence Engine)', 
    content: `MODELO: Gemini 3 Flash Preview\nSERVICE: /services/JadeAI.ts\n\nREGRAS DE SEGURANÇA IA:\n- Proibido usar termos como 'hack' ou 'ilegal'.\n- Terminologia autorizada: 'Bypass de Algoritmos Predatórios'.` 
  }
];

const SyntaxHighlighter = ({ content }: { content: string }) => {
    const lines = content.split('\n');
    return (
        <div className="font-mono text-sm leading-relaxed space-y-1">
            {lines.map((line, i) => {
                if (line.endsWith(':') || line.startsWith('-')) {
                    return <div key={i} className="text-brand-400 font-black mt-4 mb-2">{line}</div>;
                }
                return <div key={i} className="text-slate-300">{line}</div>;
            })}
        </div>
    );
};

export const AdminDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { config, features, logs, content, updateConfig, toggleFeature, updateContent, logAction, triggerNemesisPopup } = useCore();
  const { timeLeft, formatTime } = useDiscountTimer();
  const [activeSection, setActiveSection] = useState<MenuSection>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDocId, setActiveDocId] = useState(DOCS_DATA[0].id);

  const [selectedPricingMode, setSelectedPricingMode] = useState<PricingMode>(config.pricingMode);
  const [anchorPrice, setAnchorPrice] = useState<number>(config.nemesisAnchorPrice || 350);
  
  const [plans, setPlans] = useState<PlanContent[]>([]);
  const [editingPlan, setEditingPlan] = useState<PlanContent | null>(null);
  const [isPricingSaved, setIsPricingSaved] = useState(false);

  useEffect(() => {
      setSelectedPricingMode(config.pricingMode);
      setAnchorPrice(config.nemesisAnchorPrice || 350);
      if (content.plans) {
          setPlans([...content.plans].sort((a, b) => a.order - b.order));
      }
  }, [config.pricingMode, config.nemesisAnchorPrice, content.plans]);

  const [users, setUsers] = useState<MockUser[]>([
      { id: 1, name: "Admin Master", email: "root@system.com", role: 'super_admin', status: 'active' },
      { id: 2, name: "Suporte N1", email: "sup@system.com", role: 'viewer', status: 'active' },
      { id: 3, name: "Editor Conteúdo", email: "content@system.com", role: 'editor', status: 'pending' },
  ]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('viewer');

  const [workflows, setWorkflows] = useState<Workflow[]>([
      { id: 'wf_01', name: 'Anti-Fraud Watchdog', trigger: 'ON_LOGIN_ATTEMPT', status: 'active', executions: 1420, lastRun: '2s ago' },
      { id: 'wf_02', name: 'Welcome Sequence Email', trigger: 'ON_SIGNUP_SUCCESS', status: 'active', executions: 85, lastRun: '15m ago' },
      { id: 'wf_03', name: 'Abandoned Cart Recovery', trigger: 'ON_CHECKOUT_EXIT', status: 'active', executions: 342, lastRun: '1h ago' },
      { id: 'wf_04', name: 'Database Hourly Backup', trigger: 'CRON_HOURLY', status: 'paused', executions: 0, lastRun: 'Never' },
  ]);

  const [storageItems, setStorageItems] = useState<{key: string, size: string, value: string}[]>([]);

  useEffect(() => {
      if (activeSection === 'system') {
          const items = [];
          for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && key.startsWith('cm_elite')) {
                  const val = localStorage.getItem(key) || '';
                  items.push({
                      key: key,
                      size: (val.length / 1024).toFixed(2) + ' KB',
                      value: val.substring(0, 50) + '...'
                  });
              }
          }
          setStorageItems(items);
      }
  }, [activeSection]);

  const handleMenuClick = (id: MenuSection) => {
      setActiveSection(id);
      setIsMobileMenuOpen(false); 
  };

  const MenuButton = ({ id, icon: Icon, label }: { id: MenuSection, icon: any, label: string }) => (
    <button 
      onClick={() => handleMenuClick(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-l-4 whitespace-nowrap ${
        activeSection === id 
        ? 'bg-brand-600/10 text-brand-400 border-brand-500' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  const updateProduct = (index: number, key: string, val: string) => {
      const newProducts = [...content.products];
      (newProducts[index] as any)[key] = val;
      updateContent('products', '', newProducts);
  };

  const updateFaq = (index: number, key: string, val: string) => {
      const newFaq = [...content.faq];
      (newFaq[index] as any)[key] = val;
      updateContent('faq', '', newFaq);
  };

  const updateSocialProof = (key: string, val: string) => {
      const newSocialProof = { ...content.socialProof, [key]: val };
      updateContent('socialProof', '', newSocialProof);
  };

  const handleSavePricingConfig = () => {
      updateConfig('pricingMode', selectedPricingMode);
      updateConfig('nemesisAnchorPrice', anchorPrice);
      updateContent('plans', '', plans);
      setIsPricingSaved(true);
      setTimeout(() => setIsPricingSaved(false), 3000);
  };

  const handleEditPlan = (plan: PlanContent) => {
      setEditingPlan({ ...plan });
  };

  const handleCreatePlan = () => {
      const newPlan: PlanContent = {
          id: `plan_${Date.now()}`,
          name: 'Novo Plano',
          type: 'annual',
          active: true,
          priceFrom: 0,
          priceTo: 0,
          highlight: false,
          order: plans.length + 1,
          description: '',
          features: [],
          includedTools: []
      };
      setEditingPlan(newPlan);
  };

  const handleDeletePlan = (id: string) => {
      if (confirm('Tem certeza que deseja remover este plano?')) {
          const updated = plans.filter(p => p.id !== id);
          setPlans(updated);
      }
  };

  const handleSavePlan = () => {
      if (!editingPlan) return;
      const exists = plans.find(p => p.id === editingPlan.id);
      let updatedPlans;
      if (exists) {
          updatedPlans = plans.map(p => p.id === editingPlan.id ? editingPlan : p);
      } else {
          updatedPlans = [...plans, editingPlan];
      }
      updatedPlans.sort((a, b) => a.order - b.order);
      setPlans(updatedPlans);
      setEditingPlan(null);
  };

  const toggleIncludedTool = (toolId: string) => {
      if (!editingPlan) return;
      const currentTools = editingPlan.includedTools || [];
      const newTools = currentTools.includes(toolId)
          ? currentTools.filter(t => t !== toolId)
          : [...currentTools, toolId];
      setEditingPlan({ ...editingPlan, includedTools: newTools });
  };

  const handleAddUser = () => {
      if (!newUserEmail) return;
      const selectedUser = availableUsersToInvite.find(u => u.email === newUserEmail);
      const name = selectedUser ? selectedUser.name : newUserEmail.split('@')[0];
      const newUser: MockUser = {
          id: Date.now(),
          name: name,
          email: newUserEmail,
          role: newUserRole,
          status: 'pending'
      };
      setUsers([...users, newUser]);
      setNewUserEmail('');
      logAction('USER_INVITE', `Invited ${newUserEmail} as ${newUserRole}`, 'info');
  };

  const handleDeleteUser = (id: number) => {
      setUsers(users.filter(u => u.id !== id));
      logAction('USER_DELETE', `Removed user ID ${id}`, 'warning');
  };

  const toggleWorkflow = (id: string) => {
      setWorkflows(prev => prev.map(wf => 
          wf.id === id ? { ...wf, status: wf.status === 'active' ? 'paused' : 'active' } : wf
      ));
      logAction('WORKFLOW_TOGGLE', `Toggled workflow ${id}`, 'info');
  };

  const handleTestNemesisTrigger = () => {
    onClose(); 
    setTimeout(() => {
        triggerNemesisPopup(true);
    }, 200);
  };

  const renderLegacyContent = (section: MenuSection) => {
      if (section === 'content') {
          return (
            <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-white mb-6 font-mono flex items-center gap-2">
                    <FolderTree className="w-6 h-6 text-brand-500" />
                    CONTEÚDO (CMS HEADLESS)
                </h2>
                
                <div className="bg-slate-900 border border-slate-700 rounded p-6">
                    <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-pink-500" /> Prova Social & Números
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Total de Membros</label>
                            <input 
                                type="text"
                                value={content.socialProof.totalMembers}
                                onChange={(e) => updateSocialProof('totalMembers', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white focus:border-brand-500 outline-none font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Total de Reviews</label>
                            <input 
                                type="text"
                                value={content.socialProof.totalReviews}
                                onChange={(e) => updateSocialProof('totalReviews', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white focus:border-brand-500 outline-none font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Taxa Satisfação</label>
                            <input 
                                type="text"
                                value={content.socialProof.satisfactionRate}
                                onChange={(e) => updateSocialProof('satisfactionRate', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white focus:border-brand-500 outline-none font-bold"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-700 rounded p-6">
                    <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-2">
                        <Type className="w-4 h-4 text-blue-500" /> Hero Section (Página Inicial)
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Título Linha 1</label>
                                <input 
                                    value={content.hero.titleLine1}
                                    onChange={(e) => updateContent('hero', 'titleLine1', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white focus:border-brand-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Título Linha 2 (Gradiente)</label>
                                <input 
                                    value={content.hero.titleLine2}
                                    onChange={(e) => updateContent('hero', 'titleLine2', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white focus:border-brand-500 outline-none"
                                />
                            </div>
                        </div>
                        <div>
                             <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Subtítulo</label>
                             <textarea 
                                value={content.hero.subtitle}
                                onChange={(e) => updateContent('hero', 'subtitle', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white focus:border-brand-500 outline-none resize-none h-20"
                             />
                        </div>
                        <div>
                             <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Texto Botão CTA</label>
                             <input 
                                value={content.hero.ctaButton}
                                onChange={(e) => updateContent('hero', 'ctaButton', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white focus:border-brand-500 outline-none"
                             />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-700 rounded p-6">
                    <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-2">
                        <Package className="w-4 h-4 text-yellow-500" /> Lista de Produtos
                    </h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {content.products.map((prod, idx) => (
                            <div key={prod.id} className="bg-slate-950 border border-slate-800 rounded p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-brand-500">{prod.id}</span>
                                    <span className="text-[10px] text-slate-500">Popularidade: {prod.popularity}</span>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    <input 
                                        value={prod.name}
                                        onChange={(e) => updateProduct(idx, 'name', e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-sm text-white"
                                        placeholder="Nome do Produto"
                                    />
                                    <textarea 
                                        value={prod.description}
                                        onChange={(e) => updateProduct(idx, 'description', e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-300 resize-none h-16"
                                        placeholder="Descrição"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                 <div className="bg-slate-900 border border-slate-700 rounded p-6">
                    <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-purple-500" /> FAQ Editor
                    </h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {content.faq.map((item, idx) => (
                            <div key={idx} className="bg-slate-950 border border-slate-800 rounded p-4">
                                <div className="mb-2">
                                    <input 
                                        value={item.question}
                                        onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-sm text-brand-400 font-bold"
                                        placeholder="Pergunta"
                                    />
                                </div>
                                <div>
                                    <textarea 
                                        value={item.answer}
                                        onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-300 resize-none h-20"
                                        placeholder="Resposta"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          );
      }
      if (section === 'automation') {
          return (
             <div className="space-y-6 animate-fade-in">
                 <h2 className="text-2xl font-bold text-white mb-6 font-mono flex items-center gap-2">
                    <Bot className="w-6 h-6 text-brand-500" />
                    AUTOMAÇÃO & WORKFLOWS
                </h2>

                <div className="bg-slate-900 border border-brand-500/20 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                            <div className={`p-4 rounded-xl border ${features.geminiEnabled ? 'bg-brand-500/10 border-brand-500 text-brand-400 shadow-neon' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                <Sparkles className={features.geminiEnabled ? 'animate-pulse' : ''} />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-lg uppercase">Jade Intelligence Core</h3>
                                <p className="text-slate-500 text-xs">Integração nativa com Google Gemini API para suporte técnico.</p>
                            </div>
                        </div>
                        <button onClick={() => toggleFeature('geminiEnabled')} className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${features.geminiEnabled ? 'bg-brand-600' : 'bg-slate-700'}`}>
                            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${features.geminiEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-700 rounded p-6">
                    <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest border-b border-slate-800 pb-2">Active Workflows</h3>
                    <div className="space-y-3">
                        {workflows.map(wf => (
                            <div key={wf.id} className="bg-slate-950 border border-slate-800 rounded p-4 flex items-center justify-between group hover:border-slate-600 transition-colors">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${wf.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></span>
                                        <h4 className="text-white font-bold text-sm">{wf.name}</h4>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-500 font-mono">
                                        <span>ID: {wf.id}</span>
                                        <span>TRIGGER: {wf.trigger}</span>
                                        <span>RUNS: {wf.executions}</span>
                                        <span>LAST: {wf.lastRun}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => toggleWorkflow(wf.id)}
                                        className={`p-2 rounded transition-colors ${wf.status === 'active' ? 'bg-emerald-900/20 text-emerald-500 hover:bg-emerald-900/40' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                    >
                                        {wf.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded">
                                        <Settings className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             </div>
          );
      }
      if (section === 'users') {
        return (
            <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-white mb-6 font-mono flex items-center gap-2">
                    <Users className="w-6 h-6 text-brand-500" />
                    GESTÃO DE ACESSOS
                </h2>

                <div className="bg-slate-900 border border-slate-700 rounded p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6 pb-6 border-b border-slate-800">
                        <input 
                            type="text" 
                            placeholder="Email do novo usuário..." 
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded p-3 text-white text-sm focus:border-brand-500 outline-none"
                        />
                        <select 
                            value={newUserRole}
                            onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                            className="bg-slate-950 border border-slate-800 rounded p-3 text-white text-sm focus:border-brand-500 outline-none"
                        >
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button 
                            onClick={handleAddUser}
                            className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-6 py-3 rounded text-sm flex items-center gap-2 transition-colors whitespace-nowrap"
                        >
                            <Mail className="w-4 h-4" /> Convidar
                        </button>
                    </div>

                    <div className="space-y-2">
                        {users.map(u => (
                            <div key={u.id} className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${u.role === 'super_admin' ? 'bg-red-600' : 'bg-slate-700'}`}>
                                        {u.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white flex items-center gap-2">
                                            {u.name}
                                            {u.status === 'pending' && <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1 rounded">PENDENTE</span>}
                                        </div>
                                        <div className="text-xs text-slate-500">{u.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-mono uppercase text-slate-400">{u.role}</span>
                                    {u.role !== 'super_admin' && (
                                        <button onClick={() => handleDeleteUser(u.id)} className="text-slate-500 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
      }
      if (section === 'system') {
        return (
            <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-white mb-6 font-mono flex items-center gap-2">
                    <Database className="w-6 h-6 text-brand-500" />
                    BANCO DE DADOS (LOCALSTORAGE)
                </h2>

                <div className="bg-slate-900 border border-slate-700 rounded p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest">Storage Explorer</h3>
                        <button className="text-xs text-brand-400 hover:text-white flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" /> Refresh
                        </button>
                    </div>

                    <div className="bg-black border border-slate-800 rounded overflow-hidden font-mono text-xs">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900 text-slate-400">
                                <tr>
                                    <th className="p-3">KEY</th>
                                    <th className="p-3">SIZE</th>
                                    <th className="p-3">PREVIEW</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-slate-300">
                                {storageItems.map((item, i) => (
                                    <tr key={i} className="hover:bg-slate-900/50">
                                        <td className="p-3 text-brand-500">{item.key}</td>
                                        <td className="p-3 text-slate-500">{item.size}</td>
                                        <td className="p-3 text-slate-400 truncate max-w-[200px]">{item.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
      }
      return null;
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6 font-mono flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6 text-brand-500" />
                VISÃO GERAL
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-700 p-4 rounded flex justify-between items-center">
                <div>
                    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest whitespace-nowrap">Taxa de Conversão</div>
                    <div className="text-2xl text-emerald-400 font-mono mt-1 font-bold">3.8%</div>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-500/50" />
              </div>
              
              <div className="bg-slate-900 border border-slate-700 p-4 rounded flex justify-between items-center">
                <div>
                    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest whitespace-nowrap">Relógio Nêmesis (Real)</div>
                    <div className="text-xl text-yellow-400 font-mono mt-1 flex items-center gap-2">
                        {formatTime(timeLeft)} <span className="text-[10px] text-slate-500 font-normal">restantes</span>
                    </div>
                </div>
                <Clock className="w-8 h-8 text-yellow-500/50" />
              </div>

              <div className="bg-slate-900 border border-slate-700 p-4 rounded flex justify-between items-center">
                <div>
                    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest whitespace-nowrap">System Version</div>
                    <div className="text-xl text-white font-mono mt-1">{config.version}</div>
                </div>
                <Server className="w-8 h-8 text-slate-700" />
              </div>
            </div>
            
            <div className="bg-slate-900 rounded border border-slate-700 p-4">
                <h3 className="text-slate-300 font-bold mb-4 text-xs uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Terminal className="w-4 h-4 text-brand-500" /> Logs & Diagnóstico (Core Stream)
                </h3>
                
                <div className="bg-black border border-slate-800 rounded overflow-hidden font-mono text-[10px]">
                    <div className="bg-slate-900 p-2 border-b border-slate-800 flex justify-between">
                        <span className="text-slate-400">/var/log/core_stream.log</span>
                        <span className="text-green-500">● LIVE</span>
                    </div>
                    <div className="p-4 h-[40vh] overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
                        {logs.map(log => (
                            <div key={log.id} className="flex gap-3 hover:bg-slate-900/50 whitespace-nowrap w-fit pr-4">
                                <span className="text-slate-600 shrink-0">{new Date(log.timestamp).toISOString()}</span>
                                <span className={`w-16 shrink-0 font-bold ${
                                    log.severity === 'critical' ? 'text-red-500' :
                                    log.severity === 'warning' ? 'text-yellow-500' :
                                    log.severity === 'error' ? 'text-orange-500' :
                                    log.severity === 'info' ? 'text-blue-400' :
                                    'text-slate-400'
                                }`}>[{log.severity.toUpperCase()}]</span>
                                <span className="text-slate-500 w-24 shrink-0">[{log.environment}]</span>
                                <span className="text-slate-300">{log.action}: {log.details}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-8 animate-fade-in relative">
            <h2 className="text-2xl font-bold text-white mb-6 font-mono flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-brand-500" />
                PRECIFICAÇÃO & PLANOS
            </h2>
            
            <div className="bg-slate-900 border border-red-900/50 rounded-2xl p-6 mb-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[60px] pointer-events-none"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-4 mb-4">
                    <div>
                        <h3 className="text-red-500 font-black text-sm uppercase tracking-[0.2em] flex items-center gap-2">
                            <Ghost className="w-5 h-5" /> Protocolo Nêmesis (Gatilho)
                        </h3>
                        <p className="text-slate-500 text-xs mt-1">Gatilho de intenção de saída para recuperação de carrinho.</p>
                    </div>
                    <button onClick={handleTestNemesisTrigger} className="flex items-center gap-3 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-lg transition-all"><Rocket className="w-5 h-5" /> DISPARAR TESTE</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block flex items-center gap-1"><Clock className="w-3 h-3" /> Janela de Oportunidade</span>
                        <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-red-500/20">
                            <span className="text-white font-mono font-black text-2xl animate-pulse">{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block flex items-center gap-1"><DollarSign className="w-3 h-3" /> Ancoragem Nêmesis</span>
                        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
                            <span className="pl-3 text-slate-500 font-bold text-sm">R$</span>
                            <input type="number" value={anchorPrice} onChange={(e) => setAnchorPrice(parseFloat(e.target.value) || 0)} className="w-full bg-transparent p-2.5 text-white font-black text-xl outline-none" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex-1 w-full">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Modo Operacional Ativo</label>
                      <select 
                        value={selectedPricingMode}
                        onChange={(e) => setSelectedPricingMode(e.target.value as PricingMode)}
                        className="w-full bg-slate-950 text-white border border-slate-800 rounded p-3 text-sm focus:border-brand-500 outline-none font-mono"
                      >
                        <option value="LayoutPRINCIPAL">MODO NORMAL (Preço de Tabela)</option>
                        <option value="LayoutPROMO">MODO CAMPANHA (Preço Reduzido Global)</option>
                      </select>
                  </div>
                  <div className="pt-6">
                      <button 
                        onClick={handleSavePricingConfig}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isPricingSaved ? 'bg-emerald-600 text-white' : 'bg-brand-600 hover:bg-brand-500 text-white'}`}
                      >
                          {isPricingSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                          {isPricingSaved ? 'SALVO' : 'SALVAR'}
                      </button>
                  </div>
              </div>
            </div>

            {!editingPlan ? (
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest">Planos de Assinatura</h3>
                        <button onClick={handleCreatePlan} className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase"><Plus className="w-4 h-4" /> Adicionar Plano</button>
                    </div>
                    <div className="space-y-3">
                        {plans.map((plan) => (
                            <div key={plan.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between group hover:border-brand-500/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center justify-center w-8 h-8 bg-slate-900 rounded-lg text-slate-500 font-mono font-bold text-xs border border-slate-800">{plan.order}</div>
                                    <div>
                                        <h4 className="text-white font-bold">{plan.name}</h4>
                                        <div className="text-xs text-slate-500">{formatCurrency(plan.priceTo)} • {plan.features.length} Benefícios</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleEditPlan(plan)} className="p-2 hover:bg-slate-800 text-slate-400 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDeletePlan(plan.id)} className="p-2 hover:bg-red-900/20 text-slate-400 hover:text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 animate-slide-up-fade">
                    <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-800">
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest">Editando: {editingPlan.name}</h3>
                        <button onClick={() => setEditingPlan(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-4">
                            <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nome</label><input value={editingPlan.name} onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Preço DE</label><input type="number" value={editingPlan.priceFrom} onChange={(e) => setEditingPlan({...editingPlan, priceFrom: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" /></div>
                                <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Preço POR</label><input type="number" value={editingPlan.priceTo} onChange={(e) => setEditingPlan({...editingPlan, priceTo: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-brand-400 font-bold" /></div>
                            </div>
                            <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Descrição</label><textarea value={editingPlan.description} onChange={(e) => setEditingPlan({...editingPlan, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white h-16 resize-none" /></div>
                        </div>
                        <div className="space-y-4">
                            <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Benefícios (1 por linha)</label><textarea value={editingPlan.features.join('\n')} onChange={(e) => setEditingPlan({...editingPlan, features: e.target.value.split('\n')})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white h-32 font-mono text-xs" /></div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Hacks Liberados</label>
                                <div className="bg-slate-950 border border-slate-800 rounded p-2 max-h-32 overflow-y-auto space-y-1">
                                    {content.products.map(p => (
                                        <div key={p.id} className="flex items-center gap-2 cursor-pointer" onClick={() => toggleIncludedTool(p.id)}>
                                            <div className={`w-4 h-4 border rounded flex items-center justify-center ${editingPlan.includedTools.includes(p.id) ? 'bg-brand-500 border-brand-500 text-black' : 'border-slate-600'}`}>{editingPlan.includedTools.includes(p.id) && <CheckCircle2 className="w-3 h-3" />}</div>
                                            <span className="text-[10px] text-slate-300">{p.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3"><button onClick={() => setEditingPlan(null)} className="px-4 py-2 bg-slate-800 text-white rounded text-xs font-bold uppercase">Cancelar</button><button onClick={handleSavePlan} className="px-6 py-2 bg-emerald-600 text-white rounded text-xs font-bold uppercase flex items-center gap-2"><Save className="w-4 h-4" /> Salvar</button></div>
                </div>
            )}
          </div>
        );

      case 'documentation':
        return (
          <div className="space-y-6 animate-fade-in h-[calc(100vh-120px)] flex flex-col">
            <div className="flex justify-between items-center shrink-0">
                <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-brand-500" />
                    MANUAL TÉCNICO ELITE
                </h2>
                <a href="/OPERATIONS_MANUAL.html" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[10px] font-black uppercase tracking-widest text-brand-400 transition-all">
                    <FileCode className="w-4 h-4" /> Manual Externo
                </a>
            </div>
            <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
                <div className="w-full md:w-72 bg-slate-900 border border-slate-800 rounded-xl overflow-y-auto p-2 shrink-0 flex md:flex-col gap-1">
                    {DOCS_DATA.map(doc => (
                        <button key={doc.id} onClick={() => setActiveDocId(doc.id)} className={`text-left p-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${activeDocId === doc.id ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                            {doc.title}
                        </button>
                    ))}
                </div>
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-y-auto p-6 md:p-10 relative scrollbar-thin scrollbar-thumb-slate-800">
                    <SyntaxHighlighter content={DOCS_DATA.find(d => d.id === activeDocId)?.content || ''} />
                </div>
            </div>
          </div>
        );

      case 'changelog':
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6 font-mono flex items-center gap-2"><History className="w-6 h-6 text-brand-500" /> HISTÓRICO DE VERSÕES</h2>
            <div className="relative pl-10 border-l-2 border-slate-800 ml-4">
                <div className="absolute left-[-11px] top-1 w-5 h-5 bg-brand-600 rounded-full border-4 border-slate-950" />
                <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl">
                    <h3 className="text-white font-bold">v4.7.0 (Atual) - 29/01/2026</h3>
                    <ul className="text-xs text-slate-400 space-y-1 mt-2">
                        <li>- Novo motor de CMS Integrado</li>
                        <li>- Gestão de Workflows em tempo real</li>
                        <li>- Editor de Planos com Indicação Dinâmica</li>
                    </ul>
                </div>
            </div>
          </div>
        );

      case 'roadmap':
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6 font-mono flex items-center gap-2"><ListChecks className="w-6 h-6 text-brand-500" /> CATÁLOGO DE FEATURES</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{ name: 'IA Oráculo', status: 'Ativo', desc: 'Previsão de roleta RNG' }, { name: 'Bypass Rhino', status: 'Ativo', desc: 'Ignora escudos' }, { name: 'Stealth 7', status: 'Ativo', desc: 'Camuflagem de Kernel' }].map((f, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <div className="flex-1"><h4 className="text-sm font-bold text-white">{f.name}</h4><p className="text-[10px] text-slate-500">{f.desc}</p></div>
                    </div>
                ))}
            </div>
          </div>
        );

      default:
          return renderLegacyContent(activeSection);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 text-slate-200 flex font-sans overflow-hidden animate-fade-in">
      
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-full shrink-0">
         <div className="p-6 border-b border-slate-800">
            <h1 className="text-xl font-black text-white tracking-tighter flex items-center gap-2">
               <ShieldAlert className="w-6 h-6 text-brand-500" />
               ADMIN<span className="text-brand-500">PANEL</span>
            </h1>
            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">Core v{config.version}</p>
         </div>

         <div className="flex-1 overflow-y-auto py-4">
             <div className="mb-2 px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Main Menu</div>
             <MenuButton id="dashboard" icon={LayoutDashboard} label="Dashboard" />
             <MenuButton id="pricing" icon={DollarSign} label="Planos & Preços" />
             <MenuButton id="content" icon={FileText} label="Conteúdo (CMS)" />
             <MenuButton id="automation" icon={Bot} label="Automação" />
             
             <div className="mt-6 mb-2 px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Intelligence</div>
             <MenuButton id="documentation" icon={BookOpen} label="Documentação" />
             <MenuButton id="changelog" icon={History} label="Versões" />
             <MenuButton id="roadmap" icon={ListChecks} label="Features" />

             <div className="mt-6 mb-2 px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">System</div>
             <MenuButton id="users" icon={Users} label="Usuários" />
             <MenuButton id="system" icon={Database} label="Database" />
         </div>

         <div className="p-4 border-t border-slate-800">
             <button onClick={onClose} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold uppercase transition-colors whitespace-nowrap">
                 Sair do Painel
             </button>
         </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-[201]">
         <div className="font-bold text-white flex items-center gap-2">
             <ShieldAlert className="w-5 h-5 text-brand-500" /> Admin
         </div>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
             {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
         </button>
      </div>

      {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-slate-950 z-[200] overflow-y-auto p-4">
             <MenuButton id="dashboard" icon={LayoutDashboard} label="Dashboard" />
             <MenuButton id="pricing" icon={DollarSign} label="Planos & Preços" />
             <MenuButton id="content" icon={FileText} label="Conteúdo" />
             <MenuButton id="automation" icon={Bot} label="Automação" />
             <MenuButton id="documentation" icon={BookOpen} label="Documentação" />
             <MenuButton id="users" icon={Users} label="Usuários" />
             <MenuButton id="system" icon={Database} label="Database" />
             <button onClick={onClose} className="w-full mt-8 py-4 bg-red-900/20 text-red-500 border border-red-900 rounded font-bold uppercase whitespace-nowrap">Sair</button>
          </div>
      )}

      <main className="flex-1 h-full overflow-y-auto bg-slate-950 p-4 md:p-8 pt-20 md:pt-8 scrollbar-thin scrollbar-thumb-slate-800">
         <div className="max-w-5xl mx-auto">
             {renderContent()}
         </div>
      </main>

    </div>
  );
};