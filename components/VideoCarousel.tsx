
import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight, Lock } from 'lucide-react';

const VIDEOS = [
  { id: 1, title: "Lucro de 50k Spins em 1h", thumb: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=800&q=80", user: "Marcos_Vip" },
  { id: 2, title: "Completando Álbum Dourado", thumb: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80", user: "Ana.Gamer" },
  { id: 3, title: "Raid de 500 Milhões", thumb: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&q=80", user: "PedroH" },
  { id: 4, title: "Speed Hack em Ação", thumb: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80", user: "Dr.Coin" },
];

export const VideoCarousel: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const next = () => setActiveIdx((prev) => (prev + 1) % VIDEOS.length);
  const prev = () => setActiveIdx((prev) => (prev - 1 + VIDEOS.length) % VIDEOS.length);

  return (
    <div className="relative w-full max-w-5xl mx-auto py-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-primary flex items-center justify-center gap-2">
            <Play className="w-5 h-5 text-brand-500 fill-brand-500" />
            Gravações de Tela Reais
        </h3>
        <p className="text-xs text-secondary">Enviado por membros da Elite (Nomes ocultos por segurança)</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl aspect-video md:aspect-[21/9] bg-surface shadow-2xl border border-border-dim group">
        
        {/* Main Video Display */}
        <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-500 flex items-center justify-center"
            style={{ backgroundImage: `url(${VIDEOS[activeIdx].thumb})` }}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
            
            <button className="relative w-20 h-20 bg-brand-600/90 hover:bg-brand-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-neon z-20 cursor-pointer border-4 border-white/10">
                <Play className="w-8 h-8 text-white ml-1 fill-white" />
            </button>

            <div className="absolute bottom-6 left-6 z-20 text-left">
                <span className="inline-flex items-center gap-1 bg-black/60 text-brand-400 px-2 py-0.5 rounded text-[10px] font-bold border border-brand-500/30 mb-2">
                    <Lock className="w-3 h-3" /> VERIFICADO
                </span>
                <h4 className="text-2xl font-bold text-white">{VIDEOS[activeIdx].title}</h4>
                <p className="text-sm text-slate-300">Enviado por: <span className="text-brand-400">{VIDEOS[activeIdx].user}</span></p>
            </div>
        </div>

        {/* Controls */}
        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-brand-600 text-white rounded-full backdrop-blur-md transition-colors z-30">
            <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-brand-600 text-white rounded-full backdrop-blur-md transition-colors z-30">
            <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center gap-2 mt-4">
        {VIDEOS.map((vid, idx) => (
            <button 
                key={vid.id}
                onClick={() => setActiveIdx(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === activeIdx ? 'w-8 bg-brand-500' : 'bg-surface-highlight'}`}
            />
        ))}
      </div>
    </div>
  );
};
