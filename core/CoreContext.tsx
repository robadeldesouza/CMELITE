
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CoreState, CoreActions, AppConfig, FeatureFlags, ProviderType, Environment, SecurityConfig, AppContent } from './types.ts';
import { IDataProvider } from '../services/DataProvider.ts';
import { MockProvider } from '../services/MockProvider.ts';
import { RemoteSQLProvider } from '../services/RemoteSQLProvider.ts';
import { SEMANTIC_PALETTE } from '../layout/fragments/Colors.ts';

const providers: Record<ProviderType, IDataProvider> = {
  mock: new MockProvider(),
  sqlite: new RemoteSQLProvider()
};

interface CoreContextType extends CoreState, CoreActions {}

const CoreContext = createContext<CoreContextType | null>(null);

export const CoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeProvider, setActiveProvider] = useState<IDataProvider>(providers.mock);
  const [isNemesisPopupForced, setIsNemesisPopupForced] = useState(false);
  
  const [state, setState] = useState<CoreState>({
    config: {
      pricingMode: 'LayoutPRINCIPAL',
      themeMode: 'gold',
      provider: 'mock',
      environment: 'prod',
      maintenanceMode: false,
      version: '4.7.0',
      nemesisAnchorPrice: 350
    },
    features: {
      salesToast: true,
      exitPopup: true,
      floatingChat: true,
      topBanner: true,
      emulator: true,
      nemesisCampaignActive: false,
      geminiEnabled: false, // AI PERMANENTLY DISABLED
      globalNotes: true
    },
    security: {
      activeRoles: [],
      permissions: {} as any
    },
    content: {
      hero: {
        titleLine1: "DOMINE O JOGO.",
        titleLine2: "ATÉ 10x MAIS SPINS.",
        subtitle: "Carregando...",
        ctaButton: "LIBERAR ACESSO"
      },
      products: [],
      features: [],
      faq: [],
      plans: [],
      footer: {
        copyrightText: "",
        disclaimerText: ""
      },
      socialProof: {
        totalMembers: "0",
        totalReviews: "0",
        satisfactionRate: "0%",
        refundRate: "0%",
        averageRating: "0",
        recentOpensTemplate: "",
        recentOpensMin: "0",
        recentOpensMax: "0",
        chatOnlineMin: "0",
        chatOnlineMax: "0",
        userAddedTemplate: ""
      },
      paymentSettings: {
        pix: { enabled: false, titular: "", chave: "" },
        copyPaste: { enabled: false, titular: "", code: "" },
        paymentLink: { enabled: false, titular: "", url: "" },
        card: { enabled: false, titular: "", gatewayUrl: "" },
        crypto: {
          enabled: false,
          titular: "",
          selectedCoin: 'BTC',
          wallets: { BTC: "", ETH: "", DOGE: "" }
        }
      }
    },
    logs: [],
    isInitialized: false,
    isNemesisPopupForced: false
  });

  useEffect(() => {
    const boot = async () => {
      try {
          await activeProvider.init();
          const config = await activeProvider.getConfig();
          const features = await activeProvider.getFeatures();
          // Force AI off regardless of stored state
          features.geminiEnabled = false;
          
          const logs = await activeProvider.getLogs();
          const content = await activeProvider.getContent();
          
          const security: SecurityConfig = {
              activeRoles: ['super_admin', 'admin', 'editor', 'viewer'],
              permissions: {
                super_admin: ['all'],
                admin: ['configure', 'manage_users'],
                editor: ['edit_content'],
                viewer: ['read_only']
              }
          };

          setState(prev => ({
            ...prev,
            config,
            features,
            logs,
            security,
            content,
            isInitialized: true
          }));

          applyVisualTheme(config.themeMode);
      } catch (error) {
          console.error("Falha crítica ao inicializar o Provider:", error);
          if (state.config.provider !== 'mock') {
              setActiveProvider(providers.mock);
          }
      }
    };
    boot();
  }, [activeProvider]);

  const applyVisualTheme = (mode: string) => {
    const root = document.documentElement;
    Object.entries(SEMANTIC_PALETTE).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
    });
    if (mode === 'gold') root.style.setProperty('--brand-rgb', '234, 179, 8');
    if (mode === 'cyber') root.style.setProperty('--brand-rgb', '14, 165, 233');
    if (mode === 'matrix') root.style.setProperty('--brand-rgb', '34, 197, 94');
  };

  const actions: CoreActions = {
    updateConfig: async (key, value) => {
      const newConfig = { ...state.config, [key]: value };
      setState(prev => ({ ...prev, config: newConfig }));
      try {
          await activeProvider.saveConfig(newConfig);
          if (key === 'themeMode') applyVisualTheme(value);
          actions.logAction('CONFIG_CHANGE', `Changed ${key} to ${value}`, 'info');
      } catch (e) { console.error(e); }
    },

    toggleFeature: async (key) => {
      // Prevent turning AI on via toggle
      if (key === 'geminiEnabled') return;

      const newFeatures = { ...state.features, [key]: !state.features[key] };
      setState(prev => ({ ...prev, features: newFeatures }));
      try {
          await activeProvider.saveFeatures(newFeatures);
          actions.logAction('FEATURE_TOGGLE', `Toggled ${key}`, 'info');
      } catch (e) { console.error(e); }
    },

    updateContent: async (section, key, value) => {
      let sectionData = state.content[section];
      if (key === '' || key === null || key === undefined) {
          sectionData = value;
      } else {
          if (typeof sectionData === 'object' && !Array.isArray(sectionData)) {
              sectionData = { ...sectionData, [key]: value };
          }
      }
      const newContent = { ...state.content, [section]: sectionData };
      setState(prev => ({ ...prev, content: newContent }));
      try {
          await activeProvider.saveContent(newContent);
          actions.logAction('CONTENT_UPDATE', `Updated ${section}${key ? '.'+key : ''}`, 'info');
      } catch (e) { console.error(e); }
    },

    setEnvironment: async (env: Environment) => {
        const newConfig = { ...state.config, environment: env };
        setState(prev => ({ ...prev, config: newConfig }));
        try {
            await activeProvider.saveConfig(newConfig);
            actions.logAction('ENV_CHANGE', `Environment set to ${env}`, 'warning');
        } catch (e) { console.error(e); }
    },

    logAction: async (action, details, severity = 'info') => {
      const log = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        action,
        user: 'ADMIN', 
        details,
        environment: state.config.environment,
        severity
      };
      try {
          await activeProvider.addLog(log);
          const logs = await activeProvider.getLogs();
          setState(prev => ({ ...prev, logs }));
      } catch (e) { console.error(e); }
    },

    setProvider: (type: ProviderType) => {
      setActiveProvider(providers[type]);
    },

    triggerNemesisPopup: (show: boolean) => {
        setIsNemesisPopupForced(show);
    }
  };

  return (
    <CoreContext.Provider value={{ ...state, ...actions, isNemesisPopupForced }}>
      {children}
    </CoreContext.Provider>
  );
};

export const useCore = () => {
  const context = useContext(CoreContext);
  if (!context) throw new Error("Core not found. System Failure.");
  return context;
};
