import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, ShieldCheck, Crown, X, Terminal, Activity, Music, 
  Play, Pause, Cpu, Database, RefreshCw, Layers, ListFilter, 
  Radio, Waves, Disc, Volume2, Trophy, Star, Users, UserCheck, 
  Fingerprint, Layout, Image as ImageIcon, Search
} from 'lucide-react';

// --- COMPONENTES DE INTERFACE ---
const TemplateBox: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8 w-full border-y border-slate-800 bg-slate-900/10 animate-fade-in group hover:bg-slate-900/20 transition-colors">
        <div className="flex items-center gap-3 py-2 px-4 bg-slate-900/50 border-b border-slate-800">
            <span className="bg-brand-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shrink-0 shadow-sm">Elite Module</span>
            <h3 className="text-white font-bold text-[10px] uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity truncate">{title}</h3>
        </div>
        <div className="relative w-full min-h-[80px] flex items-center overflow-x-auto overflow-y-hidden no-scrollbar py-6 px-4">
            <div className="flex items-center min-w-max mx-auto gap-8">
                {children}
            </div>
        </div>
    </div>
);

// --- MOTORES DE ÁUDIO EXPERIMENTAIS ---

const StandardEngine: React.FC<{ src: string; title: string }> = ({ src, title }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const toggle = () => {
        if (!audioRef.current) return;
        if (playing) audioRef.current.pause();
        else audioRef.current.play().catch(e => console.warn("Motor 1 Falhou", e));
        setPlaying(!playing);
    };
    return (
        <div className="w-80 bg-emerald-950/20 border-2 border-emerald-500/30 p-5 rounded-2xl flex flex-col gap-3 font-mono">
            <div className="flex items-center justify-between text-emerald-500">
                <div className="flex items-center gap-2"><Terminal size={14}/> <span className="text-[10px] font-bold tracking-tighter">MOTOR_01_HTML5</span></div>
                {playing && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"/>}
            </div>
            <p className="text-white text-xs font-bold truncate opacity-80">ASSET: {title}</p>
            <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} />
            <button onClick={toggle} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-lg uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2">
                {playing ? <Pause size={14}/> : <Play size={14}/>} {playing ? 'STOP_SIGNAL' : 'EXEC_NATIVE'}
            </button>
        </div>
    );
};

// --- CATÁLOGO DE IDENTIDADES ---

const IdentityCard: React.FC<{ id: string; name: string; role: string; image: string; assetId: string }> = ({ id, name, role, image, assetId }) => (
    <div className="w-64 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center group hover:border-brand-500/50 transition-all hover:-translate-y-1">
        <div className="relative mb-4">
            <div className="absolute -inset-1 bg-gradient-to-tr from-brand-600 to-brand-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="w-28 h-28 rounded-full border-4 border-slate-800 overflow-hidden relative z-10 shadow-2xl">
                <img src={image} alt={name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" />
            </div>
        </div>
        
        <h4 className="text-white font-display font-bold text-lg uppercase tracking-tight mb-1">{name}</h4>
        <span className="text-[9px] font-black bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest mb-4">
            {role}
        </span>

        <div className="w-full bg-black/40 rounded-xl p-3 border border-white/5 space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-[8px] font-bold text-slate-500 uppercase">Tech ID</span>
                <span className="text-[9px] font-mono text-brand-500 font-black">{assetId}</span>
            </div>
            <div className="h-px bg-white/5"></div>
            <div className="flex justify-between items-center">
                <span className="text-[8px] font-bold text-slate-500 uppercase">Status</span>
                <span className="text-[8px] font-bold text-emerald-500 flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                    VERIFIED_ASSET
                </span>
            </div>
        </div>
    </div>
);

export const TemplateViewer: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [activeTab, setActiveTab] = useState<'engines' | 'identities'>('identities');
    const [filterText, setFilterText] = useState('');

    const audioAssets = [
        { id: 'carlos', title: 'Carlos_Pereira_Audio_v4', src: '/assets/Eli.mp3' },
        { id: 'olga', title: 'Olga_Silva_Audio_v2', src: '/assets/Olga.mp3' },
        { id: 'joao', title: 'Joao_Pablo_Audio_v1', src: '/assets/JoaoPablo.mp3' }
    ];

    const identityAssets = [
        // DESTAQUES ATUALIZADOS (CARLOS PEREIRA AGORA É O PRINCIPAL)
        { id: 'carlos', name: "Carlos Pereira", role: "Algorithm Expert", assetId: "ASSET_MALE_PRO_06", image: "https://randomuser.me/api/portraits/men/75.jpg" },
        { id: 'olga', name: "Olga Silva", role: "Auditora", assetId: "OLGA_PRO_LATAM_01", image: "https://randomuser.me/api/portraits/women/68.jpg" },
        { id: 'joao', name: "João Pablo", role: "Beta Tester", assetId: "JOAO_PABLO_PRO_01", image: "https://randomuser.me/api/portraits/men/85.jpg" },
        
        // CATÁLOGO MASCULINO
        { id: 'm1', name: "Marcos Vinícius", role: "Farmer", assetId: "ASSET_MALE_PRO_01", image: "https://randomuser.me/api/portraits/men/32.jpg" },
        { id: 'm2', name: "Ricardo Alves", role: "Veteran", assetId: "ASSET_MALE_PRO_02", image: "https://randomuser.me/api/portraits/men/11.jpg" },
        { id: 'm3', name: "Bruno Lima", role: "Crypto Analyst", assetId: "ASSET_MALE_PRO_03", image: "https://randomuser.me/api/portraits/men/22.jpg" },
        { id: 'm4', name: "André Santos", role: "Security Tech", assetId: "ASSET_MALE_PRO_04", image: "https://randomuser.me/api/portraits/men/52.jpg" },
        { id: 'm5', name: "Fernando Costa", role: "Whale Hunter", assetId: "ASSET_MALE_PRO_05", image: "https://randomuser.me/api/portraits/men/62.jpg" },
        { id: 'm7', name: "Daniel Rocha", role: "RNG Specialist", assetId: "ASSET_MALE_PRO_07", image: "https://randomuser.me/api/portraits/men/91.jpg" },
        { id: 'm8', name: "Rafael Gomes", role: "Stealth Agent", assetId: "ASSET_MALE_PRO_08", image: "https://randomuser.me/api/portraits/men/1.jpg" },
        
        // CATÁLOGO FEMININO
        { id: 'f1', name: "Júlia Soares", role: "Event Lead", assetId: "ASSET_FEMALE_PRO_01", image: "https://randomuser.me/api/portraits/women/32.jpg" },
        { id: 'f2', name: "Mariana Luz", role: "Card Collector", assetId: "ASSET_FEMALE_PRO_02", image: "https://randomuser.me/api/portraits/women/44.jpg" },
        { id: 'f3', name: "Fernanda Silva", role: "Viking Master", assetId: "ASSET_FEMALE_PRO_03", image: "https://randomuser.me/api/portraits/women/17.jpg" },
        { id: 'f4', name: "Beatriz Mello", role: "Data Scientist", assetId: "ASSET_FEMALE_PRO_04", image: "https://randomuser.me/api/portraits/women/65.jpg" },
        { id: 'f5', name: "Camila Dantas", role: "Raid Strategist", assetId: "ASSET_FEMALE_PRO_05", image: "https://randomuser.me/api/portraits/women/26.jpg" },
        { id: 'f6', name: "Amanda Oliveira", role: "UI Designer", assetId: "ASSET_FEMALE_PRO_06", image: "https://randomuser.me/api/portraits/women/50.jpg" },
        { id: 'f7', name: "Letícia Ribeiro", role: "Support Elite", assetId: "ASSET_FEMALE_PRO_07", image: "https://randomuser.me/api/portraits/women/60.jpg" },
        { id: 'f8', name: "Priscila Neves", role: "Account Shield", assetId: "ASSET_FEMALE_PRO_08", image: "https://randomuser.me/api/portraits/women/3.jpg" },
    ];

    const filteredIdentities = identityAssets.filter(asset => 
        asset.name.toLowerCase().includes(filterText.toLowerCase()) || 
        asset.assetId.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[1000] bg-slate-950 flex flex-col animate-fade-in overflow-hidden">
            {/* Header Suite */}
            <header className="bg-slate-900 border-b border-slate-800 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-neon">
                        <Cpu className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">EngineSuite <span className="text-brand-500">Showroom</span></h2>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Laboratório de Ativos de Elite v4.7</p>
                    </div>
                </div>

                <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 shadow-inner">
                    <button 
                        onClick={() => setActiveTab('engines')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'engines' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Radio size={14} /> Engines de Áudio
                    </button>
                    <button 
                        onClick={() => setActiveTab('identities')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'identities' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Users size={14} /> Identidades Pro
                    </button>
                </div>

                <button onClick={onExit} className="p-3 bg-red-950/20 text-red-500 border border-red-900/30 rounded-2xl hover:bg-red-600 hover:text-white transition-all active:scale-95">
                    <X size={20} />
                </button>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-12 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                
                {activeTab === 'engines' ? (
                    <div className="max-w-7xl mx-auto space-y-8">
                        <TemplateBox title="Runtime Audio Processing Unit">
                            {audioAssets.map(asset => (
                                <StandardEngine key={asset.id} src={asset.src} title={asset.title} />
                            ))}
                        </TemplateBox>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 opacity-40 grayscale select-none">
                            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col items-center text-center">
                                <Waves className="w-12 h-12 text-slate-700 mb-4" />
                                <h4 className="text-slate-700 font-bold uppercase tracking-widest text-xs">Visualizer_Engine_L7</h4>
                                <p className="text-[10px] text-slate-800 font-mono mt-2">Módulo em desenvolvimento</p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col items-center text-center">
                                <Database className="w-12 h-12 text-slate-700 mb-4" />
                                <h4 className="text-slate-700 font-bold uppercase tracking-widest text-xs">Cortex_Sync_Module</h4>
                                <p className="text-[10px] text-slate-800 font-mono mt-2">Aguardando injeção de kernel</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        <div className="mb-12 border-b border-slate-800 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
                            <div>
                                <h3 className="text-white font-display font-black text-3xl uppercase tracking-tighter">Identidades de <span className="text-brand-500">Alta Fidelidade</span></h3>
                                <p className="text-slate-500 text-sm mt-2 max-w-xl">Catálogo unificado de ativos visuais para depoimentos e perfis de suporte. Use o <strong>Asset ID</strong> para referência rápida.</p>
                            </div>
                            <div className="bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
                                <Search size={14} className="text-slate-600" />
                                <input 
                                    type="text" 
                                    placeholder="Filtrar por nome ou ID..." 
                                    value={filterText}
                                    onChange={(e) => setFilterText(e.target.value)}
                                    className="bg-transparent border-none outline-none text-xs text-slate-300 font-mono w-32 md:w-48" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                            {filteredIdentities.map(identity => (
                                <IdentityCard 
                                    key={identity.id}
                                    name={identity.name}
                                    role={identity.role}
                                    image={identity.image}
                                    assetId={identity.assetId}
                                    id={identity.id}
                                />
                            ))}
                        </div>

                        <div className="mt-20 p-8 bg-brand-950/20 border border-brand-500/20 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                <div className="p-5 bg-brand-500/10 rounded-3xl border border-brand-500/20">
                                    <ImageIcon className="text-brand-500 w-10 h-10" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-xl uppercase tracking-tight">Solicitar Novos Personagens</h4>
                                    <p className="text-slate-400 text-sm mt-1 leading-relaxed">Nossa equipe de design pode processar identidades específicas sob demanda para aumentar a autenticidade dos seus depoimentos sociais.</p>
                                </div>
                                <button className="md:ml-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-brand-400 border border-brand-500/30 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Sugerir Perfil</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Suite */}
            <footer className="bg-slate-900 border-t border-slate-800 p-3 flex justify-between items-center text-[10px] font-mono text-slate-600">
                <div className="flex gap-4 px-4">
                    <span>ENGINE: 4.7.0_STABLE</span>
                    <span className="hidden md:inline">SYSTEM_INT: JARVIS_KERNEL</span>
                </div>
                <div className="flex items-center gap-2 px-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span>SYNC_STABLE_READY</span>
                </div>
            </footer>
        </div>
    );
};