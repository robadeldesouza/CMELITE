
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Lock, Users, Server, Activity, AlertTriangle, 
  DollarSign, Sparkles, Rocket, Clock, Save, Plus, Edit3, Trash2, 
  CheckCircle2, FileText, Type, MessageSquare, Package, HelpCircle,
  Database, RefreshCw, BookOpen, Terminal, Mail, Play, Pause, Cpu, 
  BrainCircuit, ChevronRight, X, Settings2, Zap, FolderTree, History, ListChecks, FileCode, GripVertical, TrendingUp, Ghost, Wrench, ClipboardList,
  Radio, UserPlus, Check, CreditCard, Link as LinkIcon, Bitcoin, QrCode, Wallet, Coins, ToggleLeft, ToggleRight, XCircle, ArrowLeft, Target, Crown
} from 'lucide-react';
import { useCore } from '../../core/CoreContext';
import { PricingMode, PlanContent, UserRole, PaymentSettings } from '../../core/types';
import { formatCurrency } from '../../data/pricing';
import { useDiscountTimer } from '../../hooks/useDiscountTimer';
import { TechnicalChecklist } from '../../tools/technical-checklist/TechnicalChecklist';

interface AdminDashboardProps {
  activeSection: string;
}

const DOCS_DATA = [
  { 
    id: 'manifesto', 
    title: '01. Manifesto Jarvis v4.7', 
    content: `ESTADO DO PROJETO: PRODUÇÃO / HIGH-FIDELITY PROTOTYPE\nDATA DE AUDITORIA: 29 de Janeiro de 2026\n\nEste ecossistema foi desenhado sob o Protocolo Jarvis para dominação do mercado de otimização de jogos.\n\nFILOSOFIA DE OPERAÇÃO:\n- Autoridade Visual: Estética Hacker/Stealth.\n- Prova Social Híbrida: Chat Global e Sales Toasts.\n- Retenção Crítica: Protocolo Nêmesis disparado em intenção de saída.\n- Suporte de Elite: IA Jade para quebra de objeções técnicas.` 
  },
  { 
    id: 'arquitetura', 
    title: '02. Arquitetura de Dados', 
    content: `ESTRUTURA: Single Source of Truth (CoreContext)\nSTORAGE: LocalStorage v3\n\nA sincronização entre Admin e Cliente é instantânea. Alterações em Gateways de Pagamento ou Preços refletem no Checkout sem necessidade de refresh no cliente final.` 
  },
  { 
    id: 'jade_rules', 
    title: '03. IA Jade (Intelligence Engine)', 
    content: `MODELO: Gemini 3 Flash Preview\nSERVICE: /services/JadeAI.ts\n\nREGRAS DE SEGURANÇA IA:\n- Proibido usar termos como 'hack' ou 'ilegal'.\n- Terminologia autorizada: 'Módulos de Otimização de Protocolo'.` 
  }
];

const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
    pix: { enabled: true, titular: "ELITE HACKS", chave: "" },
    copyPaste: { enabled: true, titular: "ELITE HACKS", code: "" },
    paymentLink: { enabled: true, titular: "ELITE HACKS", url: "" },
    card: { enabled: true, titular: "ELITE GATEWAY", gatewayUrl: "" },
    crypto: {
        enabled: true,
        titular: "ELITE CRYPTO",
        selectedCoin: 'BTC',
        wallets: { BTC: "", ETH: "", DOGE: "" }
    }
};

const SyntaxHighlighter = ({ content }: { content: string }) => {
    const lines = content.split('\n');
    return (
        <div className="font-mono text-[11px] leading-relaxed space-y-1">
            {lines.map((line, i) => {
                if (line.includes(':')) {
                    const [key, ...rest] = line.split(':');
                    return <div key={i} className="text-slate-400 dark:text-slate-500 whitespace-pre-wrap"><span className="text-blue-500 font-bold">{key}:</span>{rest.join(':')}</div>;
                }
                return <div key={i} className="text-slate-400 dark:text-slate-500 whitespace-pre-wrap">{line}</div>;
            })}
        </div>
    );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeSection }) => {
  const { config, content, features, logs, updateConfig, toggleFeature, updateContent, logAction, triggerNemesisPopup } = useCore();
  
  // ESTADOS LÓGICOS
  const [selectedPricingMode, setSelectedPricingMode] = useState<PricingMode>(config.pricingMode);
  const [anchorPrice, setAnchorPrice] = useState<number>(config.nemesisAnchorPrice || 350);
  const [plans, setPlans] = useState<PlanContent[]>([]);
  const [editingPlan, setEditingPlan] = useState<PlanContent | null>(null);
  const [configuringPaymentsPlanId, setConfiguringPaymentsPlanId] = useState<string | null>(null);
  const [isPricingSaved, setIsPricingSaved] = useState(false);
  const [activeDocId, setActiveDocId] = useState(DOCS_DATA[0].id);

  useEffect(() => {
      if (content.plans) {
          setPlans([...content.plans].sort((a, b) => a.order - b.order));
      }
  }, [content.plans]);

  const handleSavePricingConfig = () => {
      updateConfig('pricingMode', selectedPricingMode);
      updateConfig('nemesisAnchorPrice', anchorPrice);
      updateContent('plans', '', plans);
      setIsPricingSaved(true);
      logAction('PRICING_SYNC', `Configurações de Faturamento Atualizadas.`, 'critical');
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
          includedTools: content.products.map(p => p.id),
          paymentSettings: { ...DEFAULT_PAYMENT_SETTINGS }
      };
      setEditingPlan(newPlan);
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
      updateContent('plans', '', updatedPlans);
      setEditingPlan(null);
  };

  const handleDeletePlan = (id: string) => {
      if (confirm('Tem certeza que deseja remover este plano?')) {
          const updated = plans.filter(p => p.id !== id);
          setPlans(updated);
          updateContent('plans', '', updated);
      }
  };

  const updatePlanPayment = (planId: string, method: keyof PaymentSettings, field: string, val: any) => {
    const updatedPlans = plans.map(p => {
        if (p.id !== planId) return p;
        const currentSettings = p.paymentSettings || { ...DEFAULT_PAYMENT_SETTINGS };
        return {
            ...p,
            paymentSettings: {
                ...currentSettings,
                [method]: {
                    ...(currentSettings[method] as any),
                    [field]: val
                }
            }
        };
    });
    setPlans(updatedPlans);
  };

  const updatePlanCryptoWallet = (planId: string, coin: string, address: string) => {
    const updatedPlans = plans.map(p => {
        if (p.id !== planId) return p;
        const currentSettings = p.paymentSettings || { ...DEFAULT_PAYMENT_SETTINGS };
        return {
            ...p,
            paymentSettings: {
                ...currentSettings,
                crypto: {
                    ...currentSettings.crypto,
                    wallets: {
                        ...currentSettings.crypto.wallets,
                        [coin]: address
                    }
                }
            }
        };
    });
    setPlans(updatedPlans);
  };

  const currentConfigPlan = plans.find(p => p.id === configuringPaymentsPlanId);

  const renderSection = () => {
    switch (activeSection) {
      case 'root':
      case 'overview':
        return (
          <div className="space-y-8 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <AdminStatCard 
                  icon={<Server size={20}/>} 
                  title="Integridade" 
                  value="100%" 
                  sub="Operacional" 
                  color="text-teal-600 dark:text-teal-400"
                  badge="Master"
                />
                <AdminStatCard icon={<Users size={20}/>} title="Membros" value="1.284" sub="+12.4% /mês" color="text-blue-600 dark:text-blue-400" />
                <AdminStatCard icon={<Lock size={20}/>} title="Segurança" value="ATIVO" sub="Criptografia SSL" color="text-indigo-600 dark:text-indigo-400" />
             </div>
             <div className="bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-blue-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="bg-white dark:bg-slate-900 px-8 py-5 border-b border-blue-50 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-slate-800 dark:text-white font-black text-sm uppercase tracking-widest flex items-center gap-2"><Activity className="text-blue-500" size={18} /> Fluxo de Atividade Core</h3>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase">Live Sincronizado</span>
                </div>
                <div className="p-8 font-mono text-[11px] space-y-3 max-h-[400px] overflow-y-auto bg-white/10 dark:bg-black/20 text-slate-700 dark:text-slate-400 text-balance">
                  {logs.map(log => (
                    <div key={log.id} className="flex gap-4">
                      <span className="text-blue-400 dark:text-blue-500 font-bold shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span className="break-all"><span className="text-slate-400 dark:text-slate-500">[{log.severity.toUpperCase()}]</span> {log.action}: {log.details}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        );

      case 'tools':
        return (
          <div className="space-y-8 animate-fade-in h-[calc(100vh-250px)]">
            <SectionHeader icon={<Wrench size={24}/>} title="Ferramentas de Desenvolvimento e Auditoria" />
            <div className="h-full">
                <TechnicalChecklist isOpen={true} onClose={() => {}} embedded={true} />
            </div>
          </div>
        );

      case 'pricing':
        if (configuringPaymentsPlanId && currentConfigPlan) {
            const pay = currentConfigPlan.paymentSettings || { ...DEFAULT_PAYMENT_SETTINGS };
            return (
              <div className="space-y-8 animate-fade-in">
                 <div className="flex items-center justify-between border-b border-blue-100 dark:border-slate-800 pb-4">
                    <button onClick={() => setConfiguringPaymentsPlanId(null)} className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2 text-sm uppercase">
                        <ArrowLeft size={16} /> Voltar aos Planos
                    </button>
                    <div className="text-right">
                        <h3 className="text-slate-800 dark:text-white font-black text-xl uppercase">{currentConfigPlan.name}</h3>
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Configuração de Gateways</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <PaymentCard 
                        icon={<QrCode />} 
                        title="PIX Transferência" 
                        color="blue"
                        enabled={pay.pix?.enabled}
                        onToggle={(v) => updatePlanPayment(currentConfigPlan.id, 'pix', 'enabled', v)}
                    >
                        <CMSInput label="Titular (Opcional)" value={pay.pix?.titular || ""} onChange={v => updatePlanPayment(currentConfigPlan.id, 'pix', 'titular', v)} />
                        <CMSInput label="Chave Pix" value={pay.pix?.chave || ""} onChange={v => updatePlanPayment(currentConfigPlan.id, 'pix', 'chave', v)} />
                    </PaymentCard>

                    <PaymentCard 
                        icon={<Plus />} 
                        title="Pix Copia e Cola" 
                        color="emerald"
                        enabled={pay.copyPaste?.enabled}
                        onToggle={(v) => updatePlanPayment(currentConfigPlan.id, 'copyPaste', 'enabled', v)}
                    >
                        <CMSInput label="Titular (Opcional)" value={pay.copyPaste?.titular || ""} onChange={v => updatePlanPayment(currentConfigPlan.id, 'copyPaste', 'titular', v)} />
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">BR Code</label>
                            <textarea value={pay.copyPaste?.code || ""} onChange={e => updatePlanPayment(currentConfigPlan.id, 'copyPaste', 'code', e.target.value)} className="w-full h-24 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-xs font-mono outline-none" />
                        </div>
                    </PaymentCard>

                    <PaymentCard 
                        icon={<CreditCard />} 
                        title="Cartão de Crédito" 
                        color="indigo"
                        enabled={pay.card?.enabled}
                        onToggle={(v) => updatePlanPayment(currentConfigPlan.id, 'card', 'enabled', v)}
                    >
                        <CMSInput label="Titular / Exibição (Opcional)" value={pay.card?.titular || ""} onChange={v => updatePlanPayment(currentConfigPlan.id, 'card', 'titular', v)} />
                        <CMSInput label="URL do Gateway" value={pay.card?.gatewayUrl || ''} onChange={v => updatePlanPayment(currentConfigPlan.id, 'card', 'gatewayUrl', v)} />
                    </PaymentCard>

                    <PaymentCard 
                        icon={<LinkIcon />} 
                        title="Link de Pagamento" 
                        color="purple"
                        enabled={pay.paymentLink?.enabled}
                        onToggle={(v) => updatePlanPayment(currentConfigPlan.id, 'paymentLink', 'enabled', v)}
                    >
                        <CMSInput label="Titular (Opcional)" value={pay.paymentLink?.titular || ""} onChange={v => updatePlanPayment(currentConfigPlan.id, 'paymentLink', 'titular', v)} />
                        <CMSInput label="URL do Link" value={pay.paymentLink?.url || ""} onChange={v => updatePlanPayment(currentConfigPlan.id, 'paymentLink', 'url', v)} />
                    </PaymentCard>

                    <PaymentCard 
                        icon={<Bitcoin />} 
                        title="Criptomoedas" 
                        color="orange"
                        enabled={pay.crypto?.enabled}
                        onToggle={(v) => updatePlanPayment(currentConfigPlan.id, 'crypto', 'enabled', v)}
                    >
                        <CMSInput label="Titular (Opcional)" value={pay.crypto?.titular || ""} onChange={v => updatePlanPayment(currentConfigPlan.id, 'crypto', 'titular', v)} />
                        <div className="flex gap-2 mb-4">
                            {['BTC', 'ETH', 'DOGE'].map(c => (
                                <button key={c} onClick={() => updatePlanPayment(currentConfigPlan.id, 'crypto', 'selectedCoin', c)} className={`flex-1 py-2 rounded-lg font-black text-[10px] border ${pay.crypto?.selectedCoin === c ? 'bg-orange-500 text-white border-orange-600' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'}`}>{c}</button>
                            ))}
                        </div>
                        <CMSInput label={`Carteira ${pay.crypto?.selectedCoin}`} value={pay.crypto?.wallets?.[pay.crypto.selectedCoin as 'BTC' | 'ETH' | 'DOGE'] || ""} onChange={v => updatePlanCryptoWallet(currentConfigPlan.id, pay.crypto?.selectedCoin || "BTC", v)} />
                    </PaymentCard>
                 </div>

                 <div className="flex justify-end pt-8">
                    <button onClick={handleSavePricingConfig} className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all">
                        <Save size={20} /> Salvar Configurações do Plano
                    </button>
                 </div>
              </div>
            );
        }

        return (
          <div className="space-y-8 animate-fade-in relative">
            <SectionHeader icon={<DollarSign size={24}/>} title="Gestão de Planos e Billing" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 border-2 border-blue-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 block flex items-center gap-2"><Clock className="w-3 h-3" /> Modo Operacional</span>
                    <select value={selectedPricingMode} onChange={(e) => setSelectedPricingMode(e.target.value as PricingMode)} className="w-full bg-white dark:bg-slate-900 border border-blue-50 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-white font-bold outline-none appearance-none">
                        <option value="LayoutPRINCIPAL">MODO NORMAL</option>
                        <option value="LayoutPROMO">MODO CAMPANHA</option>
                    </select>
                </div>
                <div className="bg-white dark:bg-slate-900 border-2 border-blue-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 block flex items-center gap-2"><DollarSign className="w-3 h-3" /> Ancoragem Nêmesis</span>
                    <div className="flex items-center bg-white dark:bg-slate-900 border border-blue-50 dark:border-slate-700 rounded-xl overflow-hidden px-4">
                        <span className="text-blue-400 dark:text-blue-500 font-bold text-sm">R$</span>
                        <input type="number" value={anchorPrice} onChange={(e) => setAnchorPrice(Number(e.target.value))} className="w-full bg-transparent p-3 text-slate-800 dark:text-white font-bold text-xl outline-none" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 backdrop-blur-md border-2 border-blue-100 dark:border-slate-800 rounded-[2.5rem] p-8 transition-colors duration-300">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-slate-800 dark:text-slate-200 font-bold text-sm uppercase tracking-widest">Planos de Assinatura</h3>
                <button onClick={handleCreatePlan} className="flex items-center gap-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-xs font-bold uppercase shadow-sm transition-all">
                  <Plus className="w-4 h-4" /> Criar Plano
                </button>
              </div>

              {editingPlan ? (
                <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl border-2 border-blue-100 dark:border-slate-700 animate-slide-up-fade">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-slate-800 dark:text-white font-bold text-lg uppercase tracking-tight">Módulo: {editingPlan.name}</h4>
                        <button onClick={() => setEditingPlan(null)} className="text-slate-400 dark:text-slate-500 hover:text-red-500"><X size={24}/></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-6">
                            <CMSInput label="Nome do Plano" value={editingPlan.name} onChange={v => setEditingPlan({...editingPlan, name: v})} />
                            <div className="grid grid-cols-2 gap-3">
                                <CMSInput label="Preço DE" value={editingPlan.priceFrom.toString()} onChange={v => setEditingPlan({...editingPlan, priceFrom: parseFloat(v) || 0})} />
                                <CMSInput label="Preço POR" value={editingPlan.priceTo.toString()} onChange={v => setEditingPlan({...editingPlan, priceTo: parseFloat(v) || 0})} />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hacks Incluídos (Pills)</label>
                                <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin">
                                    {content.products.map(product => {
                                        const isIncluded = (editingPlan.includedTools || []).includes(product.id);
                                        return (
                                            <button
                                                key={product.id}
                                                onClick={() => {
                                                    const currentTools = editingPlan.includedTools || [];
                                                    const newTools = isIncluded 
                                                        ? currentTools.filter(id => id !== product.id)
                                                        : [...currentTools, product.id];
                                                    setEditingPlan({...editingPlan, includedTools: newTools});
                                                }}
                                                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${isIncluded ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-400'}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Crown size={14} className={isIncluded ? 'text-brand-500' : 'opacity-20'} />
                                                    <span className="text-[10px] font-bold uppercase truncate max-w-[150px]">{product.name}</span>
                                                </div>
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${isIncluded ? 'border-blue-500 bg-blue-500' : 'border-slate-200'}`}>
                                                    {isIncluded && <Check size={10} className="text-white" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tipo de Plano</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['free', 'annual', 'lifetime'].map(t => (
                                        <button 
                                            key={t}
                                            onClick={() => setEditingPlan({...editingPlan, type: t as any})}
                                            className={`py-2 rounded-xl border text-[10px] font-black uppercase tracking-tighter ${editingPlan.type === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-400'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Benefícios (Um por linha)</label>
                                <textarea 
                                    value={editingPlan.features.join('\n')}
                                    onChange={e => setEditingPlan({...editingPlan, features: e.target.value.split('\n')})}
                                    className="w-full h-[180px] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-xs font-mono outline-none"
                                    placeholder="Ex: Suporte Prioritário"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setEditingPlan(null)} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Cancelar</button>
                        <button onClick={handleSavePlan} className="flex-[2] bg-blue-600 dark:bg-blue-500 text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-blue-700 shadow-lg transition-all">Salvar Plano</button>
                    </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {plans.map((p, i) => (
                    <div key={p.id} className="bg-white/60 dark:bg-slate-800/60 border border-white dark:border-slate-700 rounded-2xl p-5 flex items-center justify-between group hover:border-blue-300 dark:hover:border-blue-500 transition-colors shadow-sm">
                       <div className="flex items-center gap-5">
                          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm border border-blue-100 dark:border-blue-800">{i+1}</div>
                          <div>
                            <h4 className="text-slate-800 dark:text-white font-bold text-base uppercase tracking-tight">{p.name}</h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">{formatCurrency(p.priceTo)} • {p.type}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <button onClick={() => setConfiguringPaymentsPlanId(p.id)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
                              <CreditCard size={14} /> Meios de Pagamento
                          </button>
                          <button onClick={() => handleEditPlan(p)} className="p-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all"><Edit3 size={18}/></button>
                          <button onClick={() => handleDeletePlan(p.id)} className="p-2.5 hover:bg-red-50 dark:hover:bg-red-900/40 text-slate-400 dark:text-slate-500 hover:text-red-500 rounded-xl transition-all"><Trash2 size={18}/></button>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end pt-4">
                 <button onClick={handleSavePricingConfig} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Sincronizar Todos os Planos</button>
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-8 animate-fade-in">
            <SectionHeader icon={<FileText size={24}/>} title="Gerenciamento de Conteúdo" />
            <div className="bg-white dark:bg-slate-900 border-2 border-blue-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
                <CMSInput label="Título Hero" value={content.hero.titleLine1} onChange={v => updateContent('hero', 'titleLine1', v)} />
                <CMSInput label="Subtítulo Hero" value={content.hero.subtitle} onChange={v => updateContent('hero', 'subtitle', v)} />
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-8 animate-fade-in">
            <SectionHeader icon={<Users size={24}/>} title="Controle de Acessos" />
            <div className="bg-white dark:bg-slate-900 border-2 border-blue-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
                <p className="text-slate-500 dark:text-slate-400">Em breve: Módulo de gerenciamento de membros administrativo.</p>
            </div>
          </div>
        );

      case 'docs':
        return (
          <div className="space-y-6 animate-fade-in h-[calc(100vh-250px)] flex flex-col">
            <div className="flex justify-between items-center shrink-0">
                <SectionHeader icon={<BookOpen size={24}/>} title="Manual Técnico e Diretrizes" />
                <a href="/OPERATIONS_MANUAL.html" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 transition-all">
                    <FileCode className="w-4 h-4" /> Manual Completo
                </a>
            </div>
            <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
                <div className="w-full md:w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-y-auto p-2 shrink-0 flex md:flex-col gap-1 shadow-sm">
                    {DOCS_DATA.map(doc => (
                        <button key={doc.id} onClick={() => setActiveDocId(doc.id)} className={`text-left p-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${activeDocId === doc.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                            {doc.title}
                        </button>
                    ))}
                </div>
                <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-y-auto p-6 md:p-8 relative shadow-sm custom-scrollbar">
                    <SyntaxHighlighter content={DOCS_DATA.find(d => d.id === activeDocId)?.content || ''} />
                </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-8 animate-fade-in">
            <SectionHeader icon={<Database size={24}/>} title="Logs do Sistema" />
            <div className="bg-white dark:bg-slate-900 border-2 border-blue-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
                <SyntaxHighlighter content={JSON.stringify(logs, null, 2)} />
            </div>
          </div>
        );

      default:
        return <div className="p-20 text-center opacity-30 font-semibold uppercase tracking-[0.2em]">Módulo em Desenvolvimento</div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="border-b border-blue-100 dark:border-slate-800 pb-6 transition-colors duration-300">
        <h1 className="text-3xl font-semibold text-slate-800 dark:text-white tracking-tight">Painel de Controle</h1>
        <p className="text-[10px] text-blue-500 dark:text-blue-400 font-bold uppercase tracking-[0.2em] mt-2 opacity-70">ADMINISTRAÇÃO / {activeSection.toUpperCase()}</p>
      </div>
      {renderSection()}
    </div>
  );
};

const PaymentCard = ({ icon, title, color, enabled, onToggle, children }: any) => (
    <div className={`bg-white dark:bg-slate-900 border-2 rounded-[2.5rem] p-8 shadow-sm flex flex-col transition-all ${enabled ? `border-${color}-100 dark:border-${color}-900/30` : 'border-slate-100 dark:border-slate-800 opacity-60'}`}>
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${enabled ? `bg-${color}-50 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400` : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {React.cloneElement(icon, { size: 24 })}
                </div>
                <h3 className="text-slate-800 dark:text-white font-black text-lg uppercase tracking-tight">{title}</h3>
            </div>
            <button onClick={() => onToggle(!enabled)} className={`p-2 rounded-xl transition-all ${enabled ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                {enabled ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
            </button>
        </div>
        <div className={`space-y-4 ${!enabled ? 'pointer-events-none opacity-40' : ''}`}>
            {children}
        </div>
    </div>
);

const SectionHeader = ({ icon, title }: any) => (
  <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-8 flex items-center gap-4 uppercase tracking-[0.1em] transition-colors duration-300">
    <span className="text-blue-600 dark:text-blue-400 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-blue-100 dark:border-slate-700">{icon}</span> {title}
  </h2>
);

const AdminStatCard = ({ icon, title, value, sub, color, badge }: any) => (
    <div className="bg-white dark:bg-slate-900 backdrop-blur-md p-8 rounded-[2rem] border-2 border-blue-100/50 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
      <div className="absolute -top-4 -right-4 p-8 opacity-5 text-slate-900 dark:text-white group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 duration-700">{icon}</div>
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-slate-400 dark:text-slate-50 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">{icon} {title}</h3>
        {badge && <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-indigo-100 dark:border-indigo-800">{badge}</span>}
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{value}</span>
        <span className={`${color} text-[10px] font-bold uppercase tracking-wider`}>{sub}</span>
      </div>
      <div className="mt-6 h-1.5 bg-blue-50 dark:bg-slate-800 rounded-full overflow-hidden">
         <div className={`h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[85%] shadow-sm`}></div>
      </div>
    </div>
);

const CMSInput = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="space-y-2">
      <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white dark:bg-slate-800 border-2 border-blue-50 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-slate-800 dark:text-white font-semibold focus:border-blue-400 dark:focus:border-blue-500 outline-none shadow-sm transition-all" />
  </div>
);
