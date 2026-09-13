import { Product, Category, Order, Customer, Setting, Banner, Testimonial, SystemLog } from '../types';

export interface GasApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp?: string;
}

export interface SyncStatus {
  connected: boolean;
  lastSyncTime: string | null;
  lastError: string | null;
  isSyncing: boolean;
  webAppUrl: string;
  sheetId?: string;
  driveFolderId?: string;
}

class GasSyncService {
  private defaultDeploymentId = 'AKfycbwKxzeSFQPgt2K8alCb7e0GiPdsp3_F2v2MrJD8zhnloXy7hiWhlr9Wt6zOZkFOne5z';
  private inMemoryUrl: string = 'https://script.google.com/macros/s/AKfycbwKxzeSFQPgt2K8alCb7e0GiPdsp3_F2v2MrJD8zhnloXy7hiWhlr9Wt6zOZkFOne5z/exec';
  
  public getWebAppUrl(): string {
    if (this.inMemoryUrl && !this.inMemoryUrl.includes('AKfycbz1Trz8B-_7yWWEOBTQOGeP6QOGP03RER4RMdxkfSDqr8V2XCO0wxYZ2PhOfyVQFISkvw')) {
      return this.inMemoryUrl;
    }
    return `https://script.google.com/macros/s/${this.defaultDeploymentId}/exec`;
  }

  public setWebAppUrl(urlOrId: string): void {
    const clean = urlOrId.trim();
    if (!clean || clean.includes('AKfycbz1Trz8B-_7yWWEOBTQOGeP6QOGP03RER4RMdxkfSDqr8V2XCO0wxYZ2PhOfyVQFISkvw')) {
      this.inMemoryUrl = `https://script.google.com/macros/s/${this.defaultDeploymentId}/exec`;
      return;
    }
    const fullUrl = clean.startsWith('http') ? clean : `https://script.google.com/macros/s/${clean}/exec`;
    this.inMemoryUrl = fullUrl;
  }

  /**
   * Helper to send POST request to Google Apps Script
   * Uses text/plain payload to bypass CORS preflight issues across all browsers (Desktop, Tablet, Mobile/HP)
   */
  private async postToGas<T>(payload: any): Promise<GasApiResponse<T>> {
    const url = this.getWebAppUrl();
    if (!url) {
      return {
        success: false,
        message: 'URL Google Apps Script Web App belum dikonfigurasi.',
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 18000);

      // Send as text/plain to avoid OPTIONS preflight failure on mobile/tablet networks
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const resText = await response.text();
      try {
        const jsonRes = JSON.parse(resText);
        return jsonRes;
      } catch {
        // If response is HTML or plain text error page from Google Apps Script
        if (resText.includes('找不到以下指令碼函式') || resText.includes('Script function not found') || resText.includes('doPost')) {
          return {
            success: false,
            message: 'Web App terhubung, namun fungsi doPost belum disimpan di Google Apps Script editor. Buka Apps Script, tempel kode backend, lalu Deploy > New version.',
            error: 'DOPOST_FUNCTION_MISSING',
          };
        }
        return {
          success: true,
          message: 'Data terkirim ke Google Apps Script.',
          data: resText as any,
        };
      }
    } catch (err: any) {
      const isTimeout = err.name === 'AbortError';
      const msg = isTimeout 
        ? 'Batas waktu koneksi habis (timeout 18 detik). Periksa koneksi internet perangkat Anda.'
        : err.message || 'Gagal terhubung ke Google Apps Script Web App.';
      return {
        success: false,
        message: msg,
        error: err.toString(),
      };
    }
  }

  /**
   * Helper to send GET request to Google Apps Script
   * Includes fallback and safe HTML error diagnosis for desktop, tablet, and mobile browsers
   */
  private async getFromGas<T>(action: string, params: Record<string, string> = {}): Promise<GasApiResponse<T>> {
    const baseUrl = this.getWebAppUrl();
    if (!baseUrl) {
      return {
        success: false,
        message: 'URL Google Apps Script Web App belum dikonfigurasi.',
      };
    }

    const queryParams = new URLSearchParams({ action, ...params }).toString();
    const fullUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${queryParams}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 18000);

      const response = await fetch(fullUrl, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const resText = await response.text();
      try {
        const resJson = JSON.parse(resText);
        return resJson;
      } catch {
        if (resText.includes('找不到以下指令碼函式') || resText.includes('Script function not found') || resText.includes('doGet')) {
          return {
            success: false,
            message: 'Fungsi doGet belum aktif di Web App Apps Script. Pastikan kode sudah dideploy dengan New version.',
            error: 'DOGET_FUNCTION_MISSING',
          };
        }
        return {
          success: false,
          message: 'Format respon dari Apps Script tidak valid.',
          error: resText.substring(0, 150),
        };
      }
    } catch (err: any) {
      const isTimeout = err.name === 'AbortError';
      const msg = isTimeout 
        ? 'Koneksi ke Google Apps Script melebihi batas waktu (timeout).'
        : err.message || 'Gagal mengambil data dari Google Apps Script Web App.';
      return {
        success: false,
        message: msg,
        error: err.toString(),
      };
    }
  }

  /**
   * Test Connection with Google Apps Script Web App
   */
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    const url = this.getWebAppUrl();
    if (!url) {
      return {
        success: false,
        message: 'URL Web App kosong. Masukkan Deployment ID atau URL Web App terlebih dahulu.',
      };
    }

    try {
      const res = await this.getFromGas('getDashboardSummary');
      if (res && (res.success || res.data)) {
        return {
          success: true,
          message: 'Koneksi ke Google Apps Script & Spreadsheet BERHASIL aktif dan terhubung!',
          details: res.data || res,
        };
      } else {
        // Try fallback post ping
        const postRes = await this.postToGas({ action: 'ping' });
        if (postRes.success) {
          return {
            success: true,
            message: 'Koneksi ke Google Apps Script Web App BERHASIL (via POST)!',
            details: postRes,
          };
        }
        return {
          success: false,
          message: res.message || 'Google Apps Script merespons tetapi mengembalikan status gagal.',
          details: res,
        };
      }
    } catch (err: any) {
      return {
        success: false,
        message: `Gagal menghubungi Google Apps Script: ${err.message}. Pastikan deployment diset 'Who has access: Anyone'.`,
        details: err.toString(),
      };
    }
  }

  /**
   * Initialize Spreadsheet & Google Drive Folders
   */
  async initializeSpreadsheet(): Promise<GasApiResponse> {
    return this.postToGas({ action: 'init' });
  }

  /**
   * Push ALL local data (Products, Categories, Banners, Testimonials, Settings, Orders, Customers)
   * to Google Spreadsheet & Google Drive in one comprehensive batch!
   */
  async pushAllDataToGoogleSheets(data: {
    products: Product[];
    categories: Category[];
    banners: Banner[];
    testimonials: Testimonial[];
    settings: Setting[];
    orders: Order[];
    customers: Customer[];
  }): Promise<GasApiResponse> {
    return this.postToGas({
      action: 'syncAllData',
      payload: data,
    });
  }

  /**
   * Pull ALL data from Google Sheets into local memory with resilient GET and POST fallback
   */
  async pullAllDataFromGoogleSheets(): Promise<GasApiResponse<{
    products: any[];
    categories: any[];
    banners: any[];
    testimonials: any[];
    settings: any;
    orders: any[];
    customers: any[];
  }>> {
    // 1. Try GET request first
    try {
      const getRes = await this.getFromGas<any>('syncAll');
      if (getRes && (getRes.success || getRes.data)) {
        return getRes;
      }
    } catch (e) {
      console.warn('GET syncAll warning, trying POST fallback...', e);
    }

    // 2. Fallback to POST request
    try {
      const postRes = await this.postToGas<any>({ action: 'syncAll' });
      if (postRes && (postRes.success || postRes.data)) {
        return postRes;
      }
      return postRes;
    } catch (err: any) {
      return {
        success: false,
        message: `Gagal menarik data dari Google Spreadsheet: ${err.message}`,
        error: err.toString(),
      };
    }
  }

  /**
   * Save single Product to Google Sheets & Google Drive
   */
  async syncProduct(product: Product, base64Image?: string): Promise<GasApiResponse> {
    return this.postToGas({
      action: 'saveProduct',
      product: product,
      imageBase64: base64Image,
    });
  }

  /**
   * Save single Category to Google Sheets & Google Drive
   */
  async syncCategory(category: Category): Promise<GasApiResponse> {
    return this.postToGas({
      action: 'saveCategory',
      category: category,
    });
  }

  /**
   * Save single Banner to Google Sheets
   */
  async syncBanner(banner: Banner): Promise<GasApiResponse> {
    return this.postToGas({
      action: 'saveBanner',
      banner: banner,
    });
  }

  /**
   * Save single Testimonial to Google Sheets
   */
  async syncTestimonial(testimonial: Testimonial): Promise<GasApiResponse> {
    return this.postToGas({
      action: 'saveTestimonial',
      testimonial: testimonial,
    });
  }

  /**
   * Save Settings to Google Sheets
   */
  async syncSettings(settings: Setting[]): Promise<GasApiResponse> {
    return this.postToGas({
      action: 'saveSettings',
      settings: settings,
    });
  }

  /**
   * Upload an image to Google Drive
   */
  async uploadImageToDrive(params: {
    categoryName: string;
    sku: string;
    base64: string;
    filename?: string;
    imageSlot?: string;
  }): Promise<GasApiResponse<{ fileId: string; url: string }>> {
    return this.postToGas({
      action: 'uploadImage',
      ...params,
    });
  }

  /**
   * Record new Order to Google Sheets
   */
  async syncOrder(orderPayload: any): Promise<GasApiResponse> {
    return this.postToGas({
      action: 'createOrder',
      ...orderPayload,
    });
  }
}

export const gasSync = new GasSyncService();
