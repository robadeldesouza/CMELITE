
export type PricingMode = 'LayoutPRINCIPAL' | 'LayoutPROMO';
export type ThemeMode = 'gold' | 'cyber' | 'matrix';
export type ProviderType = 'mock' | 'sqlite';
export type Environment = 'dev' | 'staging' | 'prod';
export type UserRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

export interface AppConfig {
  pricingMode: PricingMode;
  themeMode: ThemeMode;
  provider: ProviderType;
  environment: Environment;
  maintenanceMode: boolean;
  version: string;
  nemesisAnchorPrice: number; 
}

export interface FeatureFlags {
  salesToast: boolean;
  exitPopup: boolean;
  floatingChat: boolean;
  topBanner: boolean;
  emulator: boolean;
  nemesisCampaignActive: boolean; 
  geminiEnabled: boolean;
  globalNotes: boolean; 
}

export interface SecurityConfig {
  activeRoles: UserRole[];
  permissions: Record<UserRole, string[]>;
}

export interface HeroContent {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaButton: string;
}

export interface ProductContent {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  iconName: string;
  badge?: string;
  popularity: number;
}

export interface PlanContent {
  id: string;
  name: string;
  type: 'free' | 'annual' | 'lifetime';
  active: boolean;
  priceFrom: number;
  priceTo: number;
  highlight: boolean;
  order: number;
  description: string;
  features: string[];
  includedTools: string[];
  paymentSettings?: PaymentSettings;
}

export interface FeatureItemContent {
  iconName: string;
  title: string;
  description: string;
}

export interface FaqItemContent {
  category?: string;
  question: string;
  answer: string;
}

export interface FooterContent {
  copyrightText: string;
  disclaimerText: string;
}

export interface PaymentMethodConfig {
  enabled: boolean;
  titular: string;
}

export interface PaymentSettings {
  pix: PaymentMethodConfig & { chave: string; };
  copyPaste: PaymentMethodConfig & { code: string; };
  paymentLink: PaymentMethodConfig & { url: string; };
  card: PaymentMethodConfig & { gatewayUrl?: string; };
  crypto: PaymentMethodConfig & {
    selectedCoin: 'BTC' | 'ETH' | 'DOGE';
    wallets: {
      BTC: string;
      ETH: string;
      DOGE: string;
    }
  };
}

export interface SocialProofContent {
  totalMembers: string;
  totalReviews: string;
  satisfactionRate: string;
  refundRate: string;
  averageRating: string;
  recentOpensTemplate: string;
  recentOpensMin: string;
  recentOpensMax: string;
  chatOnlineMin: string;
  chatOnlineMax: string;
  userAddedTemplate: string;
}

export interface AppContent {
  hero: HeroContent;
  plans: PlanContent[];
  products: ProductContent[];
  features: FeatureItemContent[];
  faq: FaqItemContent[];
  footer: FooterContent;
  socialProof: SocialProofContent;
  paymentSettings: PaymentSettings;
}

export interface SystemAuditLog {
  id: string;
  timestamp: number;
  action: string;
  user: string;
  details: string;
  environment: Environment;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface CoreState {
  config: AppConfig;
  features: FeatureFlags;
  security: SecurityConfig;
  content: AppContent;
  logs: SystemAuditLog[];
  isInitialized: boolean;
  isNemesisPopupForced: boolean;
}

export interface CoreActions {
  updateConfig: (key: keyof AppConfig, value: any) => void;
  toggleFeature: (key: keyof FeatureFlags) => void;
  updateContent: (section: keyof AppContent, key: string, value: any) => void;
  logAction: (action: string, details: string, severity?: SystemAuditLog['severity']) => void;
  setProvider: (provider: ProviderType) => void;
  setEnvironment: (env: Environment) => void;
  triggerNemesisPopup: (show: boolean) => void;
}
