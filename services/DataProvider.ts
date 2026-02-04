
import { AppConfig, FeatureFlags, SystemAuditLog, AppContent } from '../core/types';

export interface IDataProvider {
  init(): Promise<void>;
  getConfig(): Promise<AppConfig>;
  saveConfig(config: AppConfig): Promise<void>;
  getFeatures(): Promise<FeatureFlags>;
  saveFeatures(features: FeatureFlags): Promise<void>;
  getContent(): Promise<AppContent>;
  saveContent(content: AppContent): Promise<void>;
  getLogs(): Promise<SystemAuditLog[]>;
  addLog(log: SystemAuditLog): Promise<void>;
}
