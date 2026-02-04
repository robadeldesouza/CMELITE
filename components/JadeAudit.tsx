import React, { useState, useEffect } from 'react';
import { Terminal, ShieldAlert, Cpu, Lock } from 'lucide-react';
import { jadeSecurity, SecurityScan } from '../core/JadeSecurity';

export const JadeAudit: React.FC = () => {
  const [logs, setLogs] = useState<SecurityScan[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const actions = ["Login", "Purchase_Intent", "Bypass_Trigger", "Stealth_Ping"];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const scan = jadeSecurity.auditRequest(randomAction);
      
      setLogs(prev => [scan, ...prev].slice(0, 5));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-24 right-6 w-64 bg-black/80 backdrop-blur-md border border-brand-500/20 rounded-xl overflow-hidden hidden xl:block animate-fade-in pointer-events-none">
      <div className="bg-brand-500/10 p-2 flex items-center gap-2 border-b border-brand-500/20">
        <Cpu className="w-3 h-3 text-brand-500 animate-pulse" />
        <span className="text-[9px] font-black text-brand-400 uppercase tracking-widest">Jade Monitoring Node</span>
      </div>
      <div className="p-3 space-y-2">
        {logs.map((log, i) => (
          <div key={i} className="font-mono text-[8px] flex flex-col gap-0.5 opacity-80">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
              <span className={log.status === 'SAFE' ? 'text-emerald-500' : 'text-red-500'}>[{log.status}]</span>
            </div>
            <div className="text-slate-300 truncate">TYPE: {log.type}</div>
            <div className="text-brand-500/60 truncate">PKT: {jadeSecurity.generateHash(log.payload)}</div>
          </div>
        ))}
        {logs.length === 0 && <div className="text-[8px] text-slate-600 animate-pulse">Initializing Security Mesh...</div>}
      </div>
    </div>
  );
};