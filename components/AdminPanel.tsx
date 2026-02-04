
import React from 'react';
import AdminApp from '../admin/App';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  // O wrapper abaixo força o tema light e reseta cores base para evitar conflitos com a classe 'dark' do index.html
  return (
    <div className="fixed inset-0 z-[500] light bg-slate-50 text-slate-900 overflow-hidden select-none font-sans">
      <AdminApp onExit={onClose} />
    </div>
  );
};
