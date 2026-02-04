
import React, { useState, useEffect, useRef } from 'react';
// Added missing Monitor icon to imports
import { RotateCw, ShieldCheck, Terminal, Wifi, Lock, Server, Globe, Cpu, Zap, Activity, CheckCircle2, Monitor } from 'lucide-react';
import { CoinMasterEmulator } from './CoinMasterEmulator';

interface GeneratorDemoProps {
  onOpenCheckout: () => void;
}

const generateGuestSession = () => {
    const randomId = Math.floor(Math.random() * 899999999) + 100000000;
    const servers = ['US_EAST_1', 'EU_WEST_2', 'SA_BRA_01', 'ASIA_TOK_04'];
    
    return {
        guestId: `GUEST_${randomId}`,
        server: servers[Math.floor(Math.random() * servers.length)],
        ping: Math.floor(Math.random() * 40) + 12,
        sessionKey: Math.random().toString(36).substring(2, 15).toUpperCase()
    };
};

export const GeneratorDemo: React.FC<GeneratorDemoProps> = ({ onOpenCheckout }) => {
  const [status, setStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [logs, setLogs] = useState<{text: string, type: 'info'|'success'|'error'|'warn'|'system'}[]>([]);
  const [progress, setProgress] = useState(0);
  const [guestData, setGuestData] = useState<ReturnType<typeof generateGuestSession> | null>(null);

  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsContainerRef.current) {
        logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (text: string, type: 'info'|'success'|'error'|'warn'|'system' = 'info') => {
    setLogs(prev => [...prev, { text, type }]);
  };

  const startDiagnosis = async () => {
    if (status === 'running') return;
    setStatus('running');
    setLogs([]);
    setProgress(0);
    setGuestData(null);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const session = generateGuestSession();

    addLog(`[INIT] Iniciando protocolo de conexão segura...`, 'system');
    await delay(600);
    addLog(`[NET] Pingando servidores MoonActive...`);
    await delay(800);
    addLog(`[NET] Resposta recebida: ${session.ping}ms (${session.server})`, 'info');
    setProgress(15);
    
    await delay(800);
    addLog(`[AUTH] Tentando injeção direta na porta 443...`);
    await delay(1200);
    addLog(`[ERROR] Acesso negado pelo Firewall (Erro 403).`, 'error');
    addLog(`[WARN] Detectada proteção Anti-Cheat v4.2.`, 'warn');
    setProgress(30);
    await delay(1000);

    addLog(`[AUTO] Ativando protocolo "Guest Spoofing"...`, 'system');
    await delay(800);
    addLog(`[GEN] Gerando ID de Convidado temporário...`);
    await delay(1000);
    addLog(`[SUCCESS] Token Gerado: ${session.guestId}`, 'success');
    setGuestData(session); 
    setProgress(60);
    
    await delay(800);
    addLog(`[TUNNEL] Estabelecendo túnel via Sessão ${session.guestId}...`);
    await delay(800);
    addLog(`[CHECK] Integridade do pacote: 100%`);
    addLog(`[Inject] Recursos liberados para injeção.`);
    setProgress(90);
    await delay(1000);

    addLog(`[DONE] Conexão estável. Pronto para vincular conta real.`, 'success');
    setProgress(100);
    setStatus('finished');
  };

  return (
    <section className="bg-page relative overflow-hidden flex flex-col items-center">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute top-10 right-10 text-emerald-900 animate-pulse">
              <Server size={300} strokeWidth={0.5} />
          </div>
      </div>

      <div className="max-w-4xl w-full px-4 relative z-10">
        
        <div className="text-center mb-8">
            <h2 className="text-2xl md:text-4xl font-display font-black text-primary mb-2">
                DIAGNÓSTICO DE REDE
            </h2>
            <p className="text-secondary text-sm">
                Teste a conexão segura com os servidores antes de ativar sua licença.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mb-20">
            
            {/* LADO ESQUERDO: CONTROLE COMPACTO */}
            <div className="bg-surface/80 border border-border-dim rounded-xl p-5 shadow-2xl backdrop-blur-sm relative overflow-hidden flex flex-col justify-center min-h-[250px]">
                {status === 'idle' ? (
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-surface-highlight rounded-full flex items-center justify-center mx-auto border border-border-highlight shadow-inner">
                            <Wifi className="w-8 h-8 text-secondary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-primary mb-1">Verificar Status</h3>
                            <p className="text-xs text-secondary max-w-[200px] mx-auto">
                                Teste o bypass do Anti-Cheat via ID Temporário.
                            </p>
                        </div>
                        <button 
                            onClick={startDiagnosis}
                            className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg shadow-neon transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-display"
                        >
                            <Zap className="w-4 h-4 fill-current" />
                            INICIAR TESTE
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${status === 'finished' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-brand-500/20 border-brand-500 text-brand-500 animate-pulse'}`}>
                                {status === 'finished' ? <CheckCircle2 className="w-5 h-5" /> : <RotateCw className="w-5 h-5 animate-spin" />}
                            </div>
                            <div>
                                <h3 className="font-bold text-primary text-base">
                                    {status === 'finished' ? 'Conexão Estabelecida' : 'Executando...'}
                                </h3>
                                <p className="text-[10px] text-muted font-mono uppercase tracking-wider">
                                    {status === 'finished' ? 'Latência: 14ms' : `Etapa ${Math.floor(progress / 20) + 1}/5`}
                                </p>
                            </div>
                        </div>

                        {guestData && (
                            <div className="bg-black/40 rounded-lg p-3 border border-brand-500/20 animate-slide-up-fade">
                                <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                                    <div>
                                        <span className="text-muted block">GUEST ID</span>
                                        <span className="text-primary font-bold">{guestData.guestId}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-muted block">SERVER</span>
                                        <span className="text-brand-400">{guestData.server.split('_')[0]}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {status === 'finished' && (
                            <button 
                                onClick={onOpenCheckout}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-600/20 animate-bounce-in flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
                            >
                                <Lock className="w-4 h-4" />
                                VINCULAR CONTA REAL
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* LADO DIREITO: TERMINAL MINIFICADO */}
            <div className="bg-black border border-border-dim rounded-xl shadow-2xl overflow-hidden flex flex-col h-[300px] font-mono text-[10px] relative">
                <div className="bg-surface-highlight px-3 py-2 flex items-center justify-between border-b border-border-dim shrink-0">
                    <div className="flex items-center gap-2 text-secondary">
                        <Terminal className="w-3 h-3" />
                        <span className="font-bold tracking-wider">ROOT_ACCESS_LOG</span>
                    </div>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                    </div>
                </div>

                <div 
                    ref={logsContainerRef}
                    className="flex-1 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-border-highlight bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"
                >
                    {logs.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted opacity-30 space-y-2">
                            <Cpu className="w-8 h-8" />
                            <p className="font-bold tracking-widest uppercase">AGUARDANDO START</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {logs.map((log, i) => (
                                <div key={i} className={`flex items-start gap-2 font-medium animate-fade-in ${
                                    log.type === 'error' ? 'text-red-500' : 
                                    log.type === 'warn' ? 'text-yellow-400' : 
                                    log.type === 'success' ? 'text-emerald-400' : 
                                    log.type === 'system' ? 'text-blue-400' :
                                    'text-slate-300'
                                }`}>
                                    <span className="text-secondary shrink-0 opacity-50 select-none">
                                        {`>`}
                                    </span>
                                    <span className="break-all leading-tight">{log.text}</span>
                                </div>
                            ))}
                            {status === 'running' && (
                                <div className="w-1.5 h-3 bg-brand-500 animate-pulse mt-1"></div>
                            )}
                        </div>
                    )}
                </div>

                {/* Progress Line */}
                <div className="h-0.5 w-full bg-surface-highlight">
                    <div 
                        className={`h-full transition-all duration-300 ${status === 'finished' ? 'bg-emerald-500' : 'bg-brand-500'}`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

        </div>

        {/* EMULADOR SANDBOX INTEGRADO */}
        <div className="w-full flex flex-col items-center gap-8 mb-20 animate-fade-in">
             <div className="text-center">
                <h3 className="text-xl md:text-2xl font-black text-brand-500 uppercase tracking-tighter mb-2 flex items-center justify-center gap-2">
                    <Monitor className="w-6 h-6" />
                    AMBIENTE DE SIMULAÇÃO (SANDBOX)
                </h3>
                <p className="text-secondary text-xs md:text-sm max-w-xl mx-auto">
                    Abaixo, você pode interagir com uma instância controlada do sistema CM ELITE operando sobre o motor do Coin Master. Observe as injeções em tempo real no console do emulador.
                </p>
             </div>
             <CoinMasterEmulator />
        </div>

      </div>
    </section>
  );
};
