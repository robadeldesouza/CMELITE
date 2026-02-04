
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { BotManager } from './pages/BotManager';
import { RoomList } from './pages/RoomList';
import { RoomEditor } from './pages/RoomEditor';
import { Templates } from './pages/Templates';
import { AdminDashboard } from './pages/AdminDashboard';
import { ConfigurationPage } from './pages/configuration';
import { useStore } from './store';

interface AdminAppProps {
  onExit?: () => void;
}

const App: React.FC<AdminAppProps> = ({ onExit }) => {
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const appMode = useStore(state => state.appMode);
  const logoutStore = useStore(state => state.logout);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewState, setViewState] = useState<'list' | 'editor'>('list');

  // Sincroniza abas ao trocar de modo (Operações vs Admin)
  useEffect(() => {
    if (appMode === 'admin') setActiveTab('admin_overview');
    else if (appMode === 'orchestration') setActiveTab('dashboard');
  }, [appMode]);

  const handleLogout = () => {
    logoutStore();
    if (onExit) onExit();
  };

  if (!isAuthenticated || appMode === 'none') {
    return <ConfigurationPage />;
  }

  const handleRoomSelect = (id: string) => {
    setActiveTab('rooms');
    setViewState('editor');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setViewState('list');
  };

  const renderContent = () => {
    if (appMode === 'orchestration') {
        switch (activeTab) {
            case 'dashboard': return <Dashboard />;
            case 'bots': return <BotManager />;
            case 'rooms':
              if (viewState === 'editor') return <RoomEditor onBack={() => setViewState('list')} />;
              return <RoomList onSelect={handleRoomSelect} />;
            case 'templates': return <Templates />;
            default: return <Dashboard />;
          }
    }

    if (appMode === 'admin') {
        return <AdminDashboard activeSection={activeTab.replace('admin_', '')} />;
    }

    return null;
  };

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange} onExit={onExit} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
};

export default App;
