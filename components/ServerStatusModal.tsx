
import React from 'react';
import { X, Terminal, ShieldCheck } from 'lucide-react';

interface ServerStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServerStatusModal: React.FC<ServerStatusModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
       {/* Backdrop Escuro */}
       <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={onClose}></div>
       
       <div className="relative w-full max-w-lg bg-page border-2 border-green-500 rounded-lg shadow-[0_0_50px_rgba(34,197,94,0.3)] overflow-hidden font-mono text-sm animate-bounce-in">
          {/* Header Terminal */}
          <div className="bg-surface border-b border-green-900 p-3 flex justify-between items-center">
             <div className="flex items-center gap-2 text-green-500">
                <Terminal className="w-4 h-4" />
                <span className="font-bold tracking-widest text-xs">ROOT@CM-ELITE:~# STATUS</span>
             </div>
             <button onClick={onClose} className="text-green-700 hover:text-green-400 transition-colors">
                <X className="w-5 h-5" />
             </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6">
             
             {/* Status Grid */}
             <div className="grid grid-cols-2 gap-4">
                <div className="border border-green-900/50 bg-green-900/10 p-3 rounded">
                   <div className="text-[10px] text-green-700 mb-1">UPTIME</div>
                   <div className="text-yellow-400 font-bold text-xl">99.98%</div>
                </div>
                <div className="border border-green-900/50 bg-green-900/10 p-3 rounded">
                   <div className="text-[10px] text-green-700 mb-1">LATÊNCIA</div>
                   <div className="text-green-500 font-bold text-xl">14ms</div>
                </div>
             </div>

             {/* Console Logs */}
             <div className="space-y-2 font-mono text-xs">
                <div className="flex gap-2">
                   <span className="text-green-600">[SUCCESS]</span>
                   <span className="text-yellow-200">Encryption module loaded...</span>
                </div>
                <div className="flex gap-2">
                   <span className="text-green-600">[SUCCESS]</span>
                   <span className="text-yellow-200">Bypass verification protocol... OK</span>
                </div>
                <div className="flex gap-2">
                   <span className="text-green-600">[SUCCESS]</span>
                   <span className="text-yellow-200">Connection to Mainframe established.</span>
                </div>
                <div className="flex gap-2 animate-pulse">
                   <span className="text-red-500">[ALERT]</span>
                   <span className="text-red-400">High traffic detected on node BRA-01</span>
                </div>
                <div className="mt-2 text-green-500 animate-pulse">_</div>
             </div>

             {/* Big Verify */}
             <div className="border-t border-green-900 pt-4 flex items-center justify-center gap-3">
                <ShieldCheck className="w-12 h-12 text-green-500" />
                <div>
                   <div className="text-green-500 font-bold text-lg tracking-wider">SISTEMA SEGURO</div>
                   <div className="text-green-800 text-xs">Última verificação: Agora mesmo</div>
                </div>
             </div>

          </div>

          {/* Footer Bar */}
          <div className="bg-green-900/20 p-2 text-center text-[10px] text-green-600 uppercase tracking-widest border-t border-green-900/30">
             Authorized Access Only • v4.2 Stable
          </div>
       </div>
    </div>
  );
};
