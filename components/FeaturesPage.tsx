
import React from 'react';
import { Shield, Zap, Target, Cpu, Lock, ArrowRight, Terminal } from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      id: 1,
      title: "Protocolo Fantasma (Ghost Mode)",
      subtitle: "INVISIBILIDADE AVANÇADA",
      description: "Nosso algoritmo não apenas 'esconde' você. Ele reescreve os pacotes de dados enviados ao servidor, simulando toques humanos imperfeitos e latência natural de rede. Para o sistema do jogo, você é apenas mais um jogador sortudo. Zero risco. Total anonimato.",
      details: [
        "Spoofing de ID de Dispositivo",
        "Latência Randômica Humana",
        "Bypass de Verificação de Integridade"
      ],
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80", // Hacker aesthetic
      icon: Shield,
      align: "left"
    },
    {
      id: 2,
      title: "Engenharia Reversa de RNG",
      subtitle: "DOMINE A SORTE",
      description: "Slots não são aleatórios; são matemáticos. O CM Elite decodifica a 'seed' (semente) do próximo giro em tempo real. O painel te avisa exatamente quando apostar x100 e quando apostar x1. Pare de queimar spins. Comece a multiplicar.",
      details: [
        "Previsão de Sequência de Giros",
        "Alerta de 'Big Win' Antecipado",
        "Mapeamento de Eventos (Símbolos)"
      ],
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&q=80", // Data/Tech aesthetic
      icon: Cpu,
      align: "right"
    },
    {
      id: 3,
      title: "Sniper de Vilas Ricas",
      subtitle: "LUCRO MÁXIMO",
      description: "Esqueça ataques aleatórios. Nosso Radar varre o banco de dados do servidor procurando 'Baleias' (contas com +100M de moedas) que estão com escudos desativados. Você recebe as coordenadas e ataca com precisão cirúrgica.",
      details: [
        "Filtro de Saldo (>10M, >100M, >1B)",
        "Detector de Escudos Desativados",
        "Auto-Targeting"
      ],
      image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80", // Target/Screen aesthetic
      icon: Target,
      align: "left"
    },
    {
      id: 4,
      title: "Acelerador Neural",
      subtitle: "TEMPO É DINHEIRO",
      description: "Elimine animações inúteis. Construa vilas, gire a roleta e abra baús 8x mais rápido que um humano normal. Em um evento de 30 minutos, você fará o progresso que um jogador comum levaria 4 horas para conseguir.",
      details: [
        "Speedhack 8x Estável",
        "Skip de Diálogos/Popups",
        "Farm Automático de Eventos"
      ],
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", // Speed/Technology
      icon: Zap,
      align: "right"
    }
  ];

  return (
    <div className="min-h-screen bg-page text-primary font-sans selection:bg-brand-500 selection:text-white pb-20">
      
      {/* HEADER DA PÁGINA */}
      <div className="relative pt-32 pb-20 px-4 overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-20 right-20 w-96 h-96 bg-brand-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]"></div>
         </div>

         <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900/30 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
                <Lock className="w-3 h-3" /> Acesso Confidencial Nível 5
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-primary mb-8 leading-tight tracking-tight">
                DOMINE O <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-400 to-brand-600">ALGORITMO</span>.
                <br />
                QUEBRE O JOGO.
            </h1>
            
            <p className="text-lg md:text-xl text-secondary max-w-3xl mx-auto leading-relaxed border-l-4 border-brand-600 pl-6 text-left md:text-center md:border-l-0 md:pl-0">
                A diferença entre um jogador comum e um membro da Elite não é habilidade. É informação privilegiada. 
                Abaixo, revelamos as ferramentas exatas que usamos para gerar recursos infinitos.
            </p>
         </div>
      </div>

      {/* SESSÃO ZIG-ZAG */}
      <div className="max-w-7xl mx-auto px-4 space-y-32">
        {features.map((feature) => (
            <div key={feature.id} className={`flex flex-col md:flex-row gap-12 md:gap-20 items-center ${feature.align === 'right' ? 'md:flex-row-reverse' : ''}`}>
                
                {/* LADO DO TEXTO */}
                <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-brand-900/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                            <feature.icon className="w-7 h-7" />
                        </div>
                        <span className="text-brand-500 font-bold tracking-[0.2em] text-sm uppercase">
                            {feature.subtitle}
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-primary leading-none">
                        {feature.title}
                    </h2>

                    <p className="text-secondary text-lg leading-relaxed">
                        {feature.description}
                    </p>

                    <div className="bg-surface/50 border border-border-dim rounded-xl p-6">
                        <h4 className="text-primary font-bold text-sm mb-4 flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-brand-500" />
                            CAPACIDADES TÉCNICAS:
                        </h4>
                        <ul className="space-y-3">
                            {feature.details.map((detail, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-sm text-secondary">
                                    <div className="w-1.5 h-1.5 bg-brand-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                                    {detail}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* LADO DA IMAGEM */}
                <div className="flex-1 w-full relative group">
                    {/* Elementos decorativos "Hacker" */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    
                    <div className="relative rounded-2xl overflow-hidden border border-border-dim shadow-2xl bg-surface aspect-[4/3] md:aspect-auto md:h-[500px]">
                        <div className="absolute inset-0 bg-brand-500/10 mix-blend-overlay z-10 pointer-events-none"></div>
                        
                        {/* Imagem com efeito */}
                        <img 
                            src={feature.image} 
                            alt={feature.title} 
                            className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                        />

                        {/* Overlay de Interface "System" */}
                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-page/90 to-transparent z-20">
                            <div className="flex justify-between items-end">
                                <div className="font-mono text-xs text-brand-400">
                                    <div>STATUS: <span className="text-white">ACTIVE</span></div>
                                    <div>PROCESS: <span className="text-white">RUNNING_DAEMON_V4.exe</span></div>
                                </div>
                                <div className="px-2 py-1 bg-brand-500 text-black text-[10px] font-bold rounded">
                                    SYSTEM OVERRIDE
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* CTA FINAL */}
      <div className="mt-32 max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-surface to-page border border-brand-500/30 rounded-3xl p-8 md:p-16 relative overflow-hidden group hover:border-brand-500/60 transition-colors">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50"></div>
              
              <h2 className="text-3xl md:text-5xl font-black text-primary mb-6">
                  Pare de Jogar.<br/>
                  Comece a <span className="text-brand-500">Lucrar</span>.
              </h2>
              <p className="text-secondary text-lg mb-8 max-w-xl mx-auto">
                  Essas ferramentas não estão disponíveis ao público geral. O acesso é limitado para manter a segurança do método.
              </p>
              
              <button className="w-full md:w-auto px-10 py-5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-lg rounded-xl shadow-[0_0_40px_rgba(34,197,94,0.3)] hover:shadow-[0_0_60px_rgba(34,197,94,0.5)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                  OBTER ACESSO ELITE AGORA
                  <ArrowRight className="w-6 h-6" />
              </button>
          </div>
      </div>
    </div>
  );
};
