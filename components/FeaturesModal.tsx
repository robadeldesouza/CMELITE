
import React, { useState, useEffect } from 'react';
import { X, Shield, Zap, Cpu, Database, Activity, BarChart3, Layers, Box, Lock, Terminal, ShieldAlert, RefreshCw, Eye, Fingerprint, Network, BatteryCharging, FastForward, EyeOff, Key, Binary, Ghost, Calculator, Target, Brain, Microscope, ShieldCheck, ChevronRight, AlertTriangle } from 'lucide-react';

interface FeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeaturesModal: React.FC<FeaturesModalProps> = ({ isOpen, onClose }) => {
  const [showNotice, setShowNotice] = useState(true);

  // Resetar o aviso sempre que o modal for reaberto
  useEffect(() => {
    if (isOpen) {
      setShowNotice(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const technicalSpecs = [
    {
      title: "IA Oráculo: RNG Forensic Analysis",
      subtitle: "DECODIFICAÇÃO DE ALGORITMOS PREDATÓRIOS",
      problem: "Os resultados do jogo não são aleatórios. Eles utilizam o sistema 'RTP Variável' (Return to Player), uma técnica de cassinos digitais. O algoritmo induz o jogador a perder spins em sequências vazias para forçar a compra de pacotes.",
      solution: "O IA Oráculo realiza o mapeamento de entropia e a decodificação da 'Seed RNG' do servidor via interceptação de handshake TLS. Ao ler a semente de sorteio antes da animação, o sistema anula a vantagem da casa. Você saberá exatamente quando o ciclo de derrota termina, permitindo apostas x500 apenas em momentos de vitória real.",
      image: "https://i.imgur.com/3r0mzrf.png",
      icon: Brain,
      auditLog: "INTERNAL_INSPECTION: HOUSE_EDGE_BYPASSED",
      moduleId: "MODULE_ID: ORACLE_AI_v5.0"
    },
    {
      title: "Stealth 7: Kernel Abstraction",
      subtitle: "CAMADA DE INVISIBILIDADE ALPHA (L7)",
      problem: "O sistema anti-cheat (Moon Guard) executa varreduras constantes em busca de hooks de memória e processos externos ativos em paralelo ao motor do jogo.",
      solution: "O Stealth 7 opera em Ring-0 (nível de Kernel), criando uma camada de abstração entre o jogo e o hardware. Ele intercepta as chamadas de sistema, retornando valores 'limpos' enquanto o script de injeção opera em uma memória virtual isolada e inacessível para o scanner do servidor.",
      image: "https://i.imgur.com/Y09TX6V.png",
      icon: Ghost,
      auditLog: "INTERNAL_INSPECTION: SYSTEM_VISIBILITY_NULL",
      moduleId: "MODULE_ID: STEALTH_CORE_v7.2"
    },
    {
      title: "Time-Warp: Temporal Engine Modification",
      subtitle: "REWARD ACCELERATION (CLOCK INJECTION)",
      problem: "O Coin Master utiliza animações extensas e delays forçados para retardar o progresso do usuário durante eventos de tempo limitado, forçando a fadiga.",
      solution: "O módulo Time-Warp injeta pacotes de sincronização de clock falsos diretamente no motor Unity do jogo. Ele 'pula' o processamento de quadros de animação de construção, giros e abertura de baús, executando a transação instantaneamente. Isso permite um farm 8x mais rápido.",
      image: "https://i.imgur.com/BArHlW8.png",
      icon: FastForward,
      auditLog: "INTERNAL_INSPECTION: CLOCK_SYNC_BYPASSED",
      moduleId: "MODULE_ID: TIME_WARP_v8.4"
    },
    {
      title: "AES-256 Packet Tunneling",
      subtitle: "CRIPTOGRAFIA DE TRÁFEGO",
      problem: "A interceptação de pacotes (Packet Sniffing) por firewalls avançados pode revelar a manipulação de dados em trânsito antes que eles cheguem ao servidor.",
      solution: "Todo o tráfego gerado pelas ferramentas CM Elite é encapsulado em um túnel TLS 1.3 proprietário com criptografia AES de 256 bits. O payload original é mascarado como tráfego comum de assets do jogo, tornando a modificação invisível para inspeções profundas (DPI).",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
      icon: Key,
      auditLog: "INTERNAL_INSPECTION: ENCRYPT_TUNNEL_ACTIVE",
      moduleId: "MODULE_ID: TUNNEL_AES_TLS"
    },
    {
      title: "Dynamic Hardware ID Spoofing",
      subtitle: "IDENTIDADE VOLÁTIL",
      problem: "Uma vez que uma conta é marcada para auditoria, o Device ID e o Endereço MAC são catalogados em uma 'blacklist' permanente, impedindo o uso de novas contas.",
      solution: "O módulo gera identidades de hardware virtuais randômicas a cada 15 minutos. Ele mascara o IMEI, serial do processador e assinaturas de GPU, simulando um novo dispositivo 'limpo' para o servidor a cada sessão de farm intenso.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
      icon: Fingerprint,
      auditLog: "INTERNAL_INSPECTION: ID_ROTATION_STABLE",
      moduleId: "MODULE_ID: SPOOF_ENGINE_X"
    },
    {
      title: "Behavioral Mimetism (AI)",
      subtitle: "MIMETISMO COMPORTAMENTAL",
      problem: "Bots comuns executam ações com precisão matemática (ex: cliques a cada 1000ms), o que é facilmente detectável por algoritmos de análise heurística.",
      solution: "Implementamos um algoritmo de IA que injeta 'ruído humano' em todas as ações. O intervalo entre giros e cliques de construção varia conforme uma curva gaussiana, simulando fadiga, hesitação e latência de rede orgânica.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
      icon: Brain,
      auditLog: "INTERNAL_INSPECTION: HEURISTIC_BYPASS_CONFIRMED",
      moduleId: "MODULE_ID: AI_HUMANOID_SIM"
    }
  ];

  return (
    <div className="fixed inset-0 z-[120] bg-page overflow-y-auto animate-fade-in selection:bg-brand-500/30 selection:text-white font-sans">
      
      {/* INFORMATIVO DE SEGURANÇA (OVERLAY) */}
      {showNotice && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-2xl bg-black/60 overflow-hidden">
            <div className="w-full max-w-2xl bg-slate-900 border border-brand-500/30 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-bounce-in">
                {/* Header do Aviso */}
                <div className="bg-brand-500/10 border-b border-brand-500/20 p-6 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mb-4 border border-brand-500/30 shadow-neon">
                        <ShieldCheck className="w-10 h-10 text-brand-500 animate-pulse" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tighter leading-tight">
                        Protocolo de <span className="text-brand-500">Opacidade Estratégica</span>
                    </h2>
                    <p className="text-brand-400 text-[10px] font-mono font-bold mt-2 tracking-[0.3em] uppercase">
                        Access Policy: Restricted Tier-1
                    </p>
                </div>

                {/* Corpo do Aviso */}
                <div className="p-8 md:p-10 space-y-6">
                    <p className="text-secondary leading-relaxed text-sm md:text-base">
                        A transparência técnica deste relatório é deliberadamente segmentada por motivos de <span className="text-white font-bold">segurança de rede e preservação de métodos proprietários.</span>
                    </p>
                    
                    <div className="bg-black/40 border-l-4 border-brand-600 p-5 rounded-r-xl space-y-4">
                        <div className="flex gap-4">
                            <Lock className="w-6 h-6 text-brand-500 shrink-0" />
                            <p className="text-slate-300 text-sm leading-relaxed">
                                <span className="text-white font-bold block mb-1">Proteção contra Análise Reversa:</span>
                                Mitigamos a profundidade absoluta de nossos logs para evitar que entidades externas de vigilância (MoonActive) cataloguem assinaturas de injeção ou vetores de bypass.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Activity className="w-6 h-6 text-brand-500 shrink-0" />
                            <p className="text-slate-300 text-sm leading-relaxed">
                                <span className="text-white font-bold block mb-1">Blindagem de Conta:</span>
                                O ofuscamento de detalhes granulares é o que garante que seu ID de dispositivo permaneça isolado de qualquer auditoria heurística realizada pelos servidores oficiais.
                            </p>
                        </div>
                    </div>

                    <p className="text-slate-500 text-[11px] italic text-center">
                        Ao prosseguir, você confirma ciência de que os dados apresentados são para fins de auditoria de usuário e não representam a totalidade do código-fonte injetado.
                    </p>
                </div>

                {/* Botão de Acesso */}
                <div className="p-6 bg-slate-950/50 flex justify-center border-t border-white/5">
                    <button 
                        onClick={() => setShowNotice(false)}
                        className="group flex items-center gap-3 px-10 py-5 bg-brand-600 hover:bg-brand-500 text-white font-display font-black rounded-2xl text-lg transition-all shadow-neon hover:shadow-neon-strong active:scale-95 uppercase tracking-widest border border-brand-400/30"
                    >
                        Confirmar e Acessar Relatório
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* HEADER DE AUDITORIA */}
      <div className="sticky top-0 z-50 bg-page/90 backdrop-blur-xl border-b border-border-dim p-4 flex justify-between items-center shadow-2xl">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-brand-50" />
                <span className="bg-slate-800 text-brand-400 text-[10px] font-black px-2 py-1 rounded border border-brand-500/30 uppercase tracking-widest">
                    ESPECIFICAÇÕES TÉCNICAS
                </span>
            </div>
            <div className="h-4 w-px bg-border-dim hidden md:block"></div>
            <span className="text-secondary text-[10px] font-mono hidden md:inline uppercase opacity-60">Relatório de Vulnerabilidades v4.6.2</span>
         </div>
         <button 
            onClick={onClose}
            className="group flex items-center gap-2 px-3 py-1.5 bg-surface hover:bg-slate-800 text-white rounded-full transition-all border border-border-dim hover:border-brand-500/50"
         >
            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Fechar Auditoria</span>
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform text-brand-500" />
         </button>
      </div>

      <div className={`max-w-7xl mx-auto px-4 py-16 md:py-24 transition-all duration-700 ${showNotice ? 'blur-md opacity-20 scale-95 pointer-events-none' : 'blur-0 opacity-100 scale-100'}`}>
        
        {/* INTRODUÇÃO ESTRATÉGICA */}
        <div className="text-center mb-32 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] font-black text-white/[0.02] uppercase pointer-events-none select-none">
                TECH_STACK
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black text-primary mb-8 tracking-tighter uppercase leading-none">
                ARQUITETURA DE <span className="text-brand-500">DOMINAÇÃO</span> <br/>TECHNICAL SPECS.
            </h1>
            <p className="text-lg md:text-xl text-secondary max-w-3xl mx-auto leading-relaxed font-light mb-12">
                Nossas ferramentas não são hacks de memória volátil. São módulos de engenharia reversa que operam na fundação do protocolo de comunicação servidor-cliente.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-brand-500/5 border border-brand-500/20 rounded-full">
                    <Lock className="w-4 h-4 text-brand-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-400">Proteção Ring-0</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-full">
                    <Binary className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-400">99.9% Bypass Rate</span>
                </div>
            </div>
        </div>

        {/* LISTAGEM DE FERRAMENTAS */}
        <div className="space-y-40">
            {technicalSpecs.map((item, idx) => (
                <div key={idx} className={`flex flex-col md:flex-row gap-12 md:gap-24 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                    
                    {/* CONTEÚDO TÉCNICO */}
                    <div className="flex-1 space-y-8 animate-slide-up-fade">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-brand-500/10 rounded-2xl text-brand-400 border border-brand-500/20 shadow-neon">
                                <item.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <span className="text-brand-500 font-black tracking-[0.3em] text-[10px] uppercase block mb-1">
                                    {item.subtitle}
                                </span>
                                <h2 className="text-3xl md:text-5xl font-display font-bold text-primary leading-none uppercase">
                                    {item.title}
                                </h2>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="relative pl-6 border-l-2 border-red-500/30">
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block mb-2">Vulnerabilidade Explorada:</span>
                                <p className="text-secondary text-sm md:text-base leading-relaxed">
                                    {item.problem}
                                </p>
                            </div>

                            <div className="relative pl-6 border-l-2 border-brand-500/50">
                                <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest block mb-2">Protocolo CM Elite:</span>
                                <p className="text-primary text-base md:text-lg leading-relaxed font-medium">
                                    {item.solution}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-4">
                            <Terminal className="w-4 h-4 text-brand-500" />
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                                {item.moduleId}
                            </span>
                        </div>
                    </div>

                    {/* IMAGEM DA FERRAMENTA */}
                    <div className="flex-1 w-full group">
                        <div className="flex flex-col gap-3">
                            <div className="relative rounded-[2rem] overflow-hidden border border-border-dim shadow-2xl transition-all duration-700 group-hover:border-brand-500/30 group-hover:shadow-neon bg-slate-950 aspect-[4/3] md:aspect-auto md:h-[500px]">
                                
                                <div className="absolute inset-0 bg-brand-500/10 group-hover:bg-brand-500/0 transition-colors z-10"></div>
                                
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-all duration-[1.2s] ease-in-out grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100"
                                />
                                
                                {/* OVERLAY DE INTERFACE DE HACKER */}
                                <div className="absolute inset-0 pointer-events-none z-20">
                                    <div className="absolute top-6 left-6 flex flex-col gap-1">
                                        <div className="w-20 h-1 bg-brand-500/40 rounded-full"></div>
                                        <div className="w-12 h-1 bg-brand-500/20 rounded-full"></div>
                                    </div>
                                    <div className="absolute bottom-6 right-6 font-mono text-[8px] text-brand-500/60 text-right uppercase">
                                        Operation: Stable<br/>
                                        Data_Sync: 100%<br/>
                                        Detection: Null
                                    </div>
                                </div>

                                {/* SCANNING EFFECT */}
                                <div className="absolute top-0 right-0 p-4 z-30 opacity-20 group-hover:opacity-100 transition-opacity">
                                    <RefreshCw className="w-8 h-8 text-brand-500 animate-spin-slow" />
                                </div>
                            </div>
                            
                            {/* LEGENDA VERMELHA, PEQUENA E PULSANTE */}
                            <div className="px-6 flex items-center gap-2 animate-pulse">
                                <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                                <span className="text-[8px] md:text-[9px] font-mono font-black text-red-600 uppercase tracking-[0.2em] leading-none">
                                    {item.auditLog}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            ))}
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-48 p-12 md:p-24 bg-gradient-to-br from-slate-950 to-surface border border-border-dim rounded-[3rem] text-center relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-30"></div>
             
             <div className="relative z-10">
                <div className="inline-flex p-4 bg-brand-500/10 rounded-full border border-brand-500/20 mb-8 shadow-neon">
                    <Shield className="w-12 h-12 text-brand-500" />
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-black text-primary mb-8 uppercase tracking-tighter leading-none">
                    Engenharia de Elite <br/><span className="text-brand-500">Inviolável</span>.
                </h2>
                <p className="text-secondary text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                    O acesso técnico detalhado confirma o que nossos usuários já sabem: o CM ELITE opera em uma categoria à parte de qualquer outro software no mercado.
                </p>
                
                <button 
                    onClick={onClose} 
                    className="px-12 py-6 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-2xl text-xl shadow-neon transition-all transform hover:-translate-y-2 active:scale-95 uppercase tracking-widest border border-brand-400/30"
                >
                    FECHAR RELATÓRIO TÉCNICO
                </button>

                <div className="mt-8 flex justify-center gap-6 text-slate-500 font-mono text-[10px] uppercase tracking-widest opacity-40">
                    <span>Audit Level: Tier 1</span>
                    <span>•</span>
                    <span>Security Hash: {Math.random().toString(16).substring(2, 10).toUpperCase()}</span>
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};
