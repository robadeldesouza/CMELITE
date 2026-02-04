
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, Users, Server, Activity, AlertTriangle, 
  DollarSign, Sparkles, Rocket, Clock, Save, Plus, Edit3, Trash2, 
  CheckCircle2, FileText, Type, MessageSquare, Package, HelpCircle,
  Database, RefreshCw, BookOpen, Terminal, Mail, Play, Pause, Cpu, Wind, Waves, Settings2
} from 'lucide-react';

interface AdminDashboardProps {
  activeSection: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeSection }) => {
  const [anchorPrice, setAnchorPrice] = useState(350);
  const [users] = useState([
    { id: 1, name: "Administrador Master", email: "master@sistema.com", role: 'super_admin', status: 'ativo' },
    { id: 2, name: "Analista de Operações", email: "ops@sistema.com", role: 'editor', status: 'ativo' },
  ]);
  const [storageItems, setStorageItems] = useState<{key: string, size: string, value: string}[]>([]);

  useEffect(() => {
    if (activeSection === 'system') {
      const items = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const val = localStorage.getItem(key) || '';
          items.push({
            key,
            size: (val.length / 1024).toFixed(2) + ' KB',
            value: val.substring(0, 50) + '...'
          });
        }
      }
      setStorageItems(items);
    }
  }, [activeSection]);

  const renderSection = () => {
    switch (activeSection) {
      case 'root':
      case 'overview':
        return (
          <div className="space-y-8 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <AdminStatCard 
                  icon={<Server size={20}/>} 
                  title="Integridade do Sistema" 
                  value="100%" 
                  sub="Estado Operacional" 
                  color="text-teal-600"
                  badge="Acesso Master"
                />
                <AdminStatCard icon={<Users size={20}/>} title="Usuários Cadastrados" value="1.284" sub="+12.4% este mês" color="text-blue-600" />
                <AdminStatCard icon={<Lock size={20}/>} title="Camada de Segurança" value="ATIVO" sub="Criptografia SSL" color="text-indigo-600" />
             </div>
             
             <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] border-2 border-blue-100/50 shadow-sm overflow-hidden">
                <div className="bg-white/40 px-8 py-5 border-b border-blue-100 flex justify-between items-center">
                  <h3 className="text-slate-800 font-semibold tracking-tight text-base flex items-center gap-2">
                    <Activity size={18} className="text-blue-500" /> Log de Eventos do Sistema
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Build v1.0.42-estável</span>
                </div>
                <div className="p-8 font-mono text-[11px] space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar bg-white/10">
                  <LogLine time="14:02" msg="[SYS]: Módulos de orquestração iniciados com sucesso." />
                  <LogLine time="14:05" msg="[DATA]: Cache de persistência sincronizado." />
                  <LogLine time="14:10" msg="[IA-CORE]: Motor Gemini em modo de espera (Offline)." type="info" />
                  <LogLine time="14:15" msg="[AUTH]: Validação de token administrativo concedida." />
                  <LogLine time="14:20" msg="[SYS]: Monitoramento de tráfego em tempo real ativo." />
                </div>
             </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-8 animate-fade-in">
            <SectionHeader icon={<DollarSign size={24}/>} title="Gestão de Planos e Billing" />
            
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 border-2 border-white rounded-[2.5rem] p-8 relative overflow-hidden shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-blue-100/50 pb-6 mb-8">
                    <div>
                        <h3 className="text-blue-700 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                            <Settings2 className="w-5 h-5" /> Regras de Faturamento
                        </h3>
                        <p className="text-slate-500 text-xs mt-1">Configure parâmetros de cobrança e descontos automáticos.</p>
                    </div>
                    <button className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest shadow-md shadow-blue-200 transition-all">
                        <Save className="w-5 h-5" /> Salvar Configurações
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white/60 border border-blue-100 rounded-2xl p-6 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2"><Clock className="w-3 h-3" /> Janela de Cancelamento</span>
                        <div className="text-blue-600 font-semibold text-3xl">15 min</div>
                    </div>
                    <div className="bg-white/60 border border-blue-100 rounded-2xl p-6 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2"><DollarSign className="w-3 h-3" /> Ticket Médio Sugerido</span>
                        <div className="flex items-center bg-white border border-blue-50 rounded-xl overflow-hidden px-4">
                            <span className="text-blue-400 font-bold text-sm">R$</span>
                            <input type="number" value={anchorPrice} onChange={(e) => setAnchorPrice(Number(e.target.value))} className="w-full bg-transparent p-3 text-slate-800 font-bold text-xl outline-none" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white/40 backdrop-blur-md border-2 border-blue-100 rounded-[2.5rem] p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-slate-800 font-bold text-sm uppercase tracking-widest">Níveis de Serviço (SLA)</h3>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-xs font-bold uppercase shadow-sm transition-all"><Plus className="w-4 h-4" /> Criar Plano</button>
              </div>
              <div className="space-y-4">
                {['Plano Essencial', 'Plano Profissional', 'Plano Enterprise'].map((p, i) => (
                  <div key={p} className="bg-white/60 border border-white rounded-2xl p-5 flex items-center justify-between group hover:border-blue-300 transition-colors shadow-sm">
                     <div className="flex items-center gap-5">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100">{i+1}</div>
                        <div><h4 className="text-slate-800 font-bold text-base">{p}</h4><p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Faturamento Recorrente</p></div>
                     </div>
                     <div className="flex items-center gap-3">
                        <button className="p-2.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"><Edit3 size={16}/></button>
                        <button className="p-2.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all"><Trash2 size={16}/></button>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-8 animate-fade-in">
            <SectionHeader icon={<FileText size={24}/>} title="Gerenciamento de Conteúdo Estático" />
            
            <div className="bg-white/40 border-2 border-blue-100 rounded-[2.5rem] p-8">
                <h3 className="text-slate-800 font-bold mb-6 text-sm uppercase tracking-widest border-b border-blue-50 pb-3 flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-teal-500" /> Indicadores de Retenção
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <CMSInput label="Total de Visualizações" value="12.400" />
                    <CMSInput label="Interações Simuladas" value="850.320" />
                    <CMSInput label="Taxa de Conversão" value="98.5%" />
                </div>
            </div>

            <div className="bg-white/40 border-2 border-blue-100 rounded-[2.5rem] p-8">
                <h3 className="text-slate-800 font-bold mb-6 text-sm uppercase tracking-widest border-b border-blue-50 pb-3 flex items-center gap-3">
                    <Type className="w-5 h-5 text-indigo-500" /> Textos da Home (Marketing)
                </h3>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CMSInput label="Título Principal" value="Otimize sua Prova Social" />
                        <CMSInput label="Subtítulo" value="Engajamento Automático 24/7" />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Descrição Institucional</label>
                      <textarea className="w-full bg-white/60 border border-blue-50 rounded-2xl p-5 text-slate-700 font-medium focus:border-blue-400 outline-none resize-none h-24 shadow-inner" defaultValue="Plataforma líder em simulação de engajamento social, focada em aumentar a autoridade de marca através de interações orgânicas." />
                    </div>
                </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-8 animate-fade-in">
            <SectionHeader icon={<Users size={24}/>} title="Controle de Acessos e Membros" />
            <div className="bg-white/40 border-2 border-blue-100 rounded-[2.5rem] p-8">
                <div className="flex flex-col md:flex-row gap-6 mb-8 pb-8 border-b border-blue-50">
                    <input type="text" placeholder="Email do colaborador..." className="flex-1 bg-white border border-blue-100 rounded-2xl px-5 py-4 text-slate-800 text-sm focus:border-blue-500 outline-none shadow-sm" />
                    <select className="bg-white border border-blue-100 rounded-2xl px-5 py-4 text-slate-800 text-sm focus:border-blue-500 outline-none shadow-sm">
                        <option value="viewer">Apenas Leitura</option>
                        <option value="editor">Editor de Conteúdo</option>
                        <option value="admin">Administrador Geral</option>
                    </select>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl text-sm flex items-center gap-3 shadow-md transition-all whitespace-nowrap"><Plus className="w-4 h-4" /> Convidar Membro</button>
                </div>

                <div className="space-y-3">
                    {users.map(u => (
                        <div key={u.id} className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-blue-50 hover:border-blue-200 transition-all shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold ${u.role === 'super_admin' ? 'bg-indigo-100 text-indigo-600 border border-indigo-200' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>{u.name.substring(0, 2).toUpperCase()}</div>
                                <div>
                                    <div className="text-base font-semibold text-slate-800 flex items-center gap-2">{u.name}</div>
                                    <div className="text-xs text-slate-400 font-medium">{u.email}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-[10px] font-bold uppercase text-slate-500 border border-blue-100 px-3 py-1.5 rounded-full bg-blue-50/50">{u.role}</span>
                                {u.role !== 'super_admin' && <button className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-8 animate-fade-in">
            <SectionHeader icon={<Database size={24}/>} title="Gerenciamento de Dados Locais" />
            <div className="bg-white/40 border-2 border-blue-100 rounded-[2.5rem] p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-slate-800 font-bold text-sm uppercase tracking-widest flex items-center gap-3"><Database size={16} className="text-blue-500" /> Registro de Cache</h3>
                    <button onClick={() => window.location.reload()} className="text-xs text-blue-600 font-bold hover:text-blue-800 flex items-center gap-2 transition-all"><RefreshCw size={14} /> Sincronizar Agora</button>
                </div>
                <div className="bg-white/40 border border-blue-100 rounded-3xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-blue-50/50 text-blue-700 uppercase tracking-widest text-[10px] font-bold"><tr className="border-b border-blue-100"><th className="p-4">CHAVE</th><th className="p-4">TAMANHO</th><th className="p-4">DADOS</th></tr></thead>
                        <tbody className="divide-y divide-blue-50 text-slate-600 font-mono text-[11px]">
                            {storageItems.map((item, i) => (
                                <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="p-4 text-blue-700 font-bold">{item.key}</td>
                                    <td className="p-4 text-slate-400">{item.size}</td>
                                    <td className="p-4 text-slate-400 italic truncate max-w-[200px]">{item.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        );

      default:
        return <div className="p-20 text-center opacity-30 uppercase tracking-widest font-semibold">Área Administrativa</div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="border-b border-blue-100 pb-6">
        <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">
          Configurações Gerais
        </h1>
        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.2em] mt-2 opacity-70">
          ADMINISTRAÇÃO / {activeSection === 'overview' ? 'DASHBOARD' : activeSection.toUpperCase()}
        </p>
      </div>
      {renderSection()}
    </div>
  );
};

const AdminStatCard = ({ icon, title, value, sub, color, badge }: any) => (
  <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border-2 border-blue-100/50 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
    <div className="absolute -top-4 -right-4 p-8 opacity-5 text-slate-900 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 duration-700">{icon}</div>
    <div className="flex justify-between items-start mb-6">
      <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">{icon} {title}</h3>
      {badge && (
        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-indigo-100">
          {badge}
        </span>
      )}
    </div>
    <div className="flex items-baseline gap-3">
      <span className="text-3xl font-bold text-slate-800 tracking-tight">{value}</span>
      <span className={`${color} text-[10px] font-bold uppercase tracking-wider`}>{sub}</span>
    </div>
    <div className="mt-6 h-1.5 bg-blue-50 rounded-full overflow-hidden">
       <div className={`h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[85%] shadow-sm shadow-blue-200`}></div>
    </div>
  </div>
);

const SectionHeader = ({ icon, title }: any) => (
  <h2 className="text-xl font-semibold text-slate-800 mb-8 flex items-center gap-4 uppercase tracking-[0.1em]">
    <span className="text-blue-600 p-2 bg-white rounded-xl shadow-sm border border-blue-100">{icon}</span> {title}
  </h2>
);

const CMSInput = ({ label, value }: any) => (
  <div className="space-y-2">
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <input type="text" defaultValue={value} className="w-full bg-white border-2 border-blue-50 rounded-2xl px-5 py-3.5 text-slate-800 font-semibold focus:border-blue-400 outline-none shadow-sm transition-all" />
  </div>
);

const LogLine = ({ time, msg, type }: any) => {
  const isInfo = type === 'info';
  return (
    <div className={`flex gap-4 font-medium ${isInfo ? 'text-blue-500' : 'text-slate-500'}`}>
      <span className="text-blue-400 font-bold">[{time}]</span>
      <span className="flex items-center gap-2"> {msg}</span>
    </div>
  );
};
