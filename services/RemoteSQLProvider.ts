import { IDataProvider } from './DataProvider';
import { AppConfig, FeatureFlags, SystemAuditLog, AppContent } from '../core/types';

/**
 * REMOTESQL PROVIDER (Production Architecture)
 * Centraliza persistência em API externa seguindo padrões de Backend.
 */
const API_BASE = 'https://api.cm-elite.tech/v1'; // Endpoint fictício de produção

export class RemoteSQLProvider implements IDataProvider {
  private authKey: string | null = null;

  constructor() {
      // Recupera credenciais do ambiente ou storage seguro
      this.authKey = localStorage.getItem('cm_remote_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      const headers = {
          'Content-Type': 'application/json',
          'X-Core-Version': '4.7.0',
          ...(this.authKey ? { 'Authorization': `Bearer ${this.authKey}` } : {}),
          ...options.headers,
      };

      try {
          const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
          
          if (response.status === 401) {
              console.error("[RemoteSQL] Não autorizado. Resetando sessão...");
              localStorage.removeItem('cm_remote_token');
          }

          if (!response.ok) {
              throw new Error(`[RemoteSQL] HTTP Error: ${response.status}`);
          }

          return await response.json();
      } catch (error) {
          console.warn(`[RemoteSQL] Falha ao sincronizar com ${endpoint}. Usando Fallback...`, error);
          throw error;
      }
  }

  async init(): Promise<void> {
      console.log('[RemoteSQL] Handshake iniciado...');
      // Implementação real verificaria conectividade aqui
  }

  async getConfig(): Promise<AppConfig> {
      return this.request<AppConfig>('/system/config');
  }

  async saveConfig(config: AppConfig): Promise<void> {
      await this.request('/system/config', {
          method: 'PATCH',
          body: JSON.stringify(config)
      });
  }

  async getFeatures(): Promise<FeatureFlags> {
      return this.request<FeatureFlags>('/system/features');
  }

  async saveFeatures(features: FeatureFlags): Promise<void> {
      await this.request('/system/features', {
          method: 'PATCH',
          body: JSON.stringify(features)
      });
  }

  async getContent(): Promise<AppContent> {
      return this.request<AppContent>('/cms/content');
  }

  async saveContent(content: AppContent): Promise<void> {
      await this.request('/cms/content', {
          method: 'PUT',
          body: JSON.stringify(content)
      });
  }

  async getLogs(): Promise<SystemAuditLog[]> {
      return this.request<SystemAuditLog[]>('/audit/logs');
  }

  async addLog(log: SystemAuditLog): Promise<void> {
      this.request('/audit/logs', {
          method: 'POST',
          body: JSON.stringify(log)
      }).catch(() => {}); // Logs são fire-and-forget
  }
}