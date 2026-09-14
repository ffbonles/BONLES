import {
  Product,
  Category,
  Order,
  Customer,
  Setting,
  Banner,
  Testimonial,
  SystemLog,
} from '../types';

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

/**
 * ============================================================
 * BONLES FOOD NUSANTARA
 * GOOGLE APPS SCRIPT SYNC SERVICE
 * ============================================================
 *
 * File:
 * src/services/gasSyncService.ts
 *
 * Google Apps Script Web App:
 * https://script.google.com/macros/s/AKfycbytpAZ7CM7t-2uuLdr08gYiTZbbqZXAGtxj36iYeSID1BRqHSIcZ4elsp5oYodatD0u/exec
 *
 * Catatan:
 * - URL GAS sudah dipasang langsung di file ini.
 * - Admin authentication menggunakan token dari GAS.
 * - Data publik dapat diambil tanpa login.
 * - Operasi admin menggunakan token authentication.
 * - Jangan menyimpan password admin di frontend.
 */

class GasSyncService {
  /**
   * URL Google Apps Script Web App BONLES
   *
   * PENTING:
   * Gunakan URL deployment yang berakhiran /exec.
   * Jangan menggunakan /dev.
   */
  private readonly GAS_URL =
    'https://script.google.com/macros/s/AKfycbytpAZ7CM7t-2uuLdr08gYiTZbbqZXAGtxj36iYeSID1BRqHSIcZ4elsp5oYodatD0u/exec';

  /**
   * Token session admin.
   *
   * Token tidak ditulis permanen di source code.
   * Token akan diisi setelah login berhasil.
   */
  private authToken: string | null = null;

  /**
   * Waktu sinkronisasi terakhir.
   */
  private lastSyncTime: string | null = null;

  /**
   * Error terakhir.
   */
  private lastError: string | null = null;

  /**
   * Status sinkronisasi.
   */
  private isSyncing = false;

  /**
   * Mendapatkan URL Web App GAS.
   */
  public getWebAppUrl(): string {
    return this.GAS_URL;
  }

  /**
   * Setter disediakan agar kompatibel dengan kode frontend
   * lama yang mungkin masih memanggil setWebAppUrl().
   *
   * URL tetap dibatasi ke deployment GAS BONLES.
   */
  public setWebAppUrl(urlOrId: string): void {
    const clean = String(urlOrId || '').trim();

    if (!clean) {
      return;
    }

    console.warn(
      '[BONLES GAS] URL Web App dikunci ke deployment GAS BONLES yang sudah dikonfigurasi.'
    );
  }

  /**
   * ============================================================
   * AUTH TOKEN
   * ============================================================
   */

  public setAuthToken(token: string | null): void {
    this.authToken = token || null;
  }

  public getAuthToken(): string | null {
    return this.authToken;
  }

  public clearAuthToken(): void {
    this.authToken = null;
  }

  /**
   * ============================================================
   * REQUEST HELPER
   * ============================================================
   */

  /**
   * POST ke Google Apps Script.
   *
   * Menggunakan Content-Type text/plain agar tidak menimbulkan
   * CORS preflight OPTIONS pada browser.
   */
  private async postToGas<T = any>(
    payload: any,
    requiresAuth = false
  ): Promise<GasApiResponse<T>> {
    const url = this.getWebAppUrl();

    if (!url) {
      return {
        success: false,
        message: 'URL Google Apps Script Web App belum dikonfigurasi.',
      };
    }

    if (requiresAuth && !this.authToken) {
      return {
        success: false,
        message: 'Sesi admin tidak ditemukan. Silakan login kembali.',
        error: 'AUTH_REQUIRED',
      };
    }

    const finalPayload = {
      ...payload,
    };

    if (requiresAuth) {
      finalPayload.token = this.authToken;
    }

    try {
      this.isSyncing = true;
      this.lastError = null;

      const controller = new AbortController();

      const timeoutId = window.setTimeout(() => {
        controller.abort();
      }, 30000);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(finalPayload),
        signal: controller.signal,
      });

      window.clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const responseText = await response.text();

      if (!responseText) {
        return {
          success: false,
          message: 'Google Apps Script tidak mengembalikan response.',
          error: 'EMPTY_RESPONSE',
        };
      }

      try {
        const jsonResponse = JSON.parse(responseText);

        this.lastSyncTime = new Date().toISOString();

        return jsonResponse;
      } catch {
        /**
         * Google Apps Script kadang mengembalikan HTML jika deployment
         * atau fungsi bermasalah.
         */
        if (
          responseText.includes('Script function not found') ||
          responseText.includes('doPost') ||
          responseText.includes('Cannot find function')
        ) {
          return {
            success: false,
            message:
              'Fungsi doPost tidak ditemukan pada Google Apps Script. Pastikan semua file GAS sudah dipasang dan deployment menggunakan versi terbaru.',
            error: 'DOPOST_FUNCTION_MISSING',
          };
        }

        return {
          success: false,
          message:
            'Response Google Apps Script bukan JSON yang valid.',
          error: responseText.substring(0, 500),
        };
      }
    } catch (error: any) {
      const isTimeout = error?.name === 'AbortError';

      const message = isTimeout
        ? 'Koneksi ke Google Apps Script timeout setelah 30 detik.'
        : error?.message ||
          'Gagal terhubung ke Google Apps Script Web App.';

      this.lastError = message;

      return {
        success: false,
        message,
        error: String(error),
      };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * GET ke Google Apps Script.
   */
  private async getFromGas<T = any>(
    action: string,
    params: Record<string, string> = {},
    requiresAuth = false
  ): Promise<GasApiResponse<T>> {
    const baseUrl = this.getWebAppUrl();

    if (!baseUrl) {
      return {
        success: false,
        message: 'URL Google Apps Script Web App belum dikonfigurasi.',
      };
    }

    if (requiresAuth && !this.authToken) {
      return {
        success: false,
        message: 'Sesi admin tidak ditemukan. Silakan login kembali.',
        error: 'AUTH_REQUIRED',
      };
    }

    const query = new URLSearchParams();

    query.set('action', action);

    Object.entries(params).forEach(([key, value]) => {
      query.set(key, value);
    });

    if (requiresAuth && this.authToken) {
      query.set('token', this.authToken);
    }

    const fullUrl = `${baseUrl}${
      baseUrl.includes('?') ? '&' : '?'
    }${query.toString()}`;

    try {
      const controller = new AbortController();

      const timeoutId = window.setTimeout(() => {
        controller.abort();
      }, 30000);

      const response = await fetch(fullUrl, {
        method: 'GET',
        signal: controller.signal,
      });

      window.clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const responseText = await response.text();

      if (!responseText) {
        return {
          success: false,
          message: 'Google Apps Script tidak mengembalikan response.',
          error: 'EMPTY_RESPONSE',
        };
      }

      try {
        const jsonResponse = JSON.parse(responseText);

        this.lastSyncTime = new Date().toISOString();

        return jsonResponse;
      } catch {
        if (
          responseText.includes('Script function not found') ||
          responseText.includes('doGet') ||
          responseText.includes('Cannot find function')
        ) {
          return {
            success: false,
            message:
              'Fungsi doGet tidak ditemukan pada Google Apps Script. Pastikan deployment GAS sudah menggunakan versi terbaru.',
            error: 'DOGET_FUNCTION_MISSING',
          };
        }

        return {
          success: false,
          message:
            'Format response Google Apps Script tidak valid.',
          error: responseText.substring(0, 500),
        };
      }
    } catch (error: any) {
      const isTimeout = error?.name === 'AbortError';

      const message = isTimeout
        ? 'Koneksi ke Google Apps Script timeout setelah 30 detik.'
        : error?.message ||
          'Gagal mengambil data dari Google Apps Script Web App.';

      this.lastError = message;

      return {
        success: false,
        message,
        error: String(error),
      };
    }
  }

  /**
   * ============================================================
   * STATUS
   * ============================================================
   */

  public getStatus(): SyncStatus {
    return {
      connected: !this.lastError,
      lastSyncTime: this.lastSyncTime,
      lastError: this.lastError,
      isSyncing: this.isSyncing,
      webAppUrl: this.getWebAppUrl(),
    };
  }

  /**
   * ============================================================
   * PUBLIC DATA
   * ============================================================
   */

  /**
   * Mengambil data publik dari Google Sheets.
   *
   * Tidak membutuhkan login admin.
   */
  async pullPublicData(): Promise<GasApiResponse> {
    try {
      const response = await this.getFromGas<any>(
        'publicData'
      );

      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          'Gagal mengambil data publik dari Google Apps Script.',
        error: String(error),
      };
    }
  }

  /**
   * Alias kompatibilitas.
   */
  async getPublicData(): Promise<GasApiResponse> {
    return this.pullPublicData();
  }

  /**
   * ============================================================
   * CONNECTION TEST
   * ============================================================
   */

  async testConnection(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      /**
       * Ping publik terlebih dahulu.
       */
      const pingResponse = await this.getFromGas<any>('ping');

      if (pingResponse?.success) {
        return {
          success: true,
          message:
            'Koneksi ke Google Apps Script Web App BONLES BERHASIL.',
          details: pingResponse.data || pingResponse,
        };
      }

      /**
       * Fallback POST.
       */
      const postResponse = await this.postToGas<any>({
        action: 'ping',
      });

      if (postResponse?.success) {
        return {
          success: true,
          message:
            'Koneksi ke Google Apps Script Web App BONLES BERHASIL.',
          details:
            postResponse.data || postResponse,
        };
      }

      return {
        success: false,
        message:
          pingResponse?.message ||
          postResponse?.message ||
          'Google Apps Script merespons tetapi status gagal.',
        details: {
          ping: pingResponse,
          post: postResponse,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          'Gagal menghubungi Google Apps Script. Pastikan Web App sudah dideploy dan aksesnya benar.',
        details: String(error),
      };
    }
  }

  /**
   * ============================================================
   * ADMIN LOGIN
   * ============================================================
   */

  /**
   * Login admin.
   *
   * Password dikirim ke GAS melalui HTTPS.
   * Password tidak disimpan di frontend.
   */
  async loginAdmin(
    username: string,
    password: string
  ): Promise<GasApiResponse> {
    const response = await this.postToGas<any>({
      action: 'adminLogin',
      username,
      password,
    });

    if (
      response.success &&
      response.data?.token
    ) {
      this.authToken = response.data.token;
    }

    return response;
  }

  /**
   * Logout admin.
   */
  async logoutAdmin(): Promise<GasApiResponse> {
    try {
      if (!this.authToken) {
        return {
          success: true,
          message: 'Sesi admin sudah tidak aktif.',
        };
      }

      const response = await this.postToGas<any>(
        {
          action: 'adminLogout',
        },
        true
      );

      this.authToken = null;

      return response;
    } catch (error: any) {
      this.authToken = null;

      return {
        success: false,
        message: 'Gagal logout dari server.',
        error: String(error),
      };
    }
  }

  /**
   * ============================================================
   * ADMIN DATA
   * ============================================================
   */

  /**
   * Mengambil seluruh data privat untuk dashboard admin.
   */
  async pullAdminData(): Promise<GasApiResponse> {
    return this.postToGas<any>(
      {
        action: 'adminData',
      },
      true
    );
  }

  /**
   * Alias untuk kompatibilitas.
   */
  async pullAdminDataFromGoogleSheets(): Promise<GasApiResponse> {
    return this.pullAdminData();
  }

  /**
   * ============================================================
   * INITIALIZE
   * ============================================================
   */

  /**
   * Inisialisasi Spreadsheet + Google Drive.
   *
   * Membutuhkan login admin.
   */
  async initializeSpreadsheet(): Promise<GasApiResponse> {
    return this.postToGas<any>(
      {
        action: 'init',
      },
      true
    );
  }

  /**
   * ============================================================
   * PUSH ALL DATA
   * ============================================================
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
    return this.postToGas<any>(
      {
        action: 'syncAllData',
        payload: data,
      },
      true
    );
  }

  /**
   * ============================================================
   * PULL ALL DATA
   * ============================================================
   *
   * Data privat hanya boleh diambil oleh admin.
   */
  async pullAllDataFromGoogleSheets(): Promise<
    GasApiResponse<{
      products: any[];
      categories: any[];
      banners: any[];
      testimonials: any[];
      settings: any;
      orders: any[];
      customers: any[];
    }>
  > {
    return this.postToGas<any>(
      {
        action: 'syncAll',
      },
      true
    );
  }

  /**
   * ============================================================
   * PRODUCTS
   * ============================================================
   */

  async syncProduct(
    product: Product,
    base64Image?: string
  ): Promise<GasApiResponse> {
    return this.postToGas<any>(
      {
        action: 'saveProduct',
        product,
        imageBase64: base64Image,
      },
      true
    );
  }

  /**
   * ============================================================
   * CATEGORIES
   * ============================================================
   */

  async syncCategory(
    category: Category
  ): Promise<GasApiResponse> {
    return this.postToGas<any>(
      {
        action: 'saveCategory',
        category,
      },
      true
    );
  }

  /**
   * ============================================================
   * BANNERS
   * ============================================================
   */

  async syncBanner(
    banner: Banner
  ): Promise<GasApiResponse> {
    return this.postToGas<any>(
      {
        action: 'saveBanner',
        banner,
      },
      true
    );
  }

  /**
   * ============================================================
   * TESTIMONIALS
   * ============================================================
   */

  async syncTestimonial(
    testimonial: Testimonial
  ): Promise<GasApiResponse> {
    return this.postToGas<any>(
      {
        action: 'saveTestimonial',
        testimonial,
      },
      true
    );
  }

  /**
   * ============================================================
   * SETTINGS
   * ============================================================
   */

  async syncSettings(
    settings: Setting[]
  ): Promise<GasApiResponse> {
    return this.postToGas<any>(
      {
        action: 'saveSettings',
        settings,
      },
      true
    );
  }

  /**
   * ============================================================
   * IMAGE / GOOGLE DRIVE
   * ============================================================
   */

  async uploadImageToDrive(params: {
    categoryName: string;
    sku: string;
    base64: string;
    filename?: string;
    imageSlot?: string;
  }): Promise<
    GasApiResponse<{
      fileId: string;
      url: string;
    }>
  > {
    return this.postToGas<any>(
      {
        action: 'uploadImage',
        ...params,
      },
      true
    );
  }

  /**
   * ============================================================
   * ORDERS
   * ============================================================
   */

  /**
   * Membuat order baru dari customer.
   *
   * CREATE ORDER adalah endpoint publik,
   * sehingga tidak membutuhkan token admin.
   */
  async syncOrder(
    orderPayload: any
  ): Promise<GasApiResponse> {
    return this.postToGas<any>({
      action: 'createOrder',
      ...orderPayload,
    });
  }

  /**
   * Update status order.
   *
   * Hanya admin.
   */
  async updateOrderStatus(
    orderId: string,
    status: string
  ): Promise<GasApiResponse> {
    return this.postToGas<any>(
      {
        action: 'updateOrderStatus',
        orderId,
        status,
      },
      true
    );
  }

  /**
   * ============================================================
   * COMPATIBILITY METHODS
   * ============================================================
   */

  /**
   * Beberapa bagian frontend lama mungkin memanggil method
   * berikut. Method-method ini tetap disediakan agar tidak
   * menyebabkan error TypeScript.
   */

  async getProducts(): Promise<GasApiResponse> {
    return this.getFromGas<any>(
      'getProducts'
    );
  }

  async getProduct(
    id: string
  ): Promise<GasApiResponse> {
    return this.getFromGas<any>(
      'getProduct',
      {
        id,
      }
    );
  }

  async getAllProducts(): Promise<GasApiResponse> {
    return this.getFromGas<any>(
      'getAllProducts'
    );
  }

  async getDashboardSummary(): Promise<GasApiResponse> {
    return this.getFromGas<any>(
      'getDashboardSummary',
      {},
      true
    );
  }

  async syncAll(
    data: any
  ): Promise<GasApiResponse> {
    return this.postToGas<any>(
      {
        action: 'syncAllData',
        payload: data,
      },
      true
    );
  }

  async saveProduct(
    product: Product,
    imageBase64?: string
  ): Promise<GasApiResponse> {
    return this.syncProduct(
      product,
      imageBase64
    );
  }

  async saveCategory(
    category: Category
  ): Promise<GasApiResponse> {
    return this.syncCategory(category);
  }

  async saveBanner(
    banner: Banner
  ): Promise<GasApiResponse> {
    return this.syncBanner(banner);
  }

  async saveTestimonial(
    testimonial: Testimonial
  ): Promise<GasApiResponse> {
    return this.syncTestimonial(
      testimonial
    );
  }

  async saveSettings(
    settings: Setting[]
  ): Promise<GasApiResponse> {
    return this.syncSettings(settings);
  }

  async uploadImage(
    params: {
      categoryName: string;
      sku: string;
      base64: string;
      filename?: string;
      imageSlot?: string;
    }
  ): Promise<GasApiResponse> {
    return this.uploadImageToDrive(params);
  }

  /**
   * ============================================================
   * DEBUG
   * ============================================================
   */

  public getDebugInfo(): {
    gasUrl: string;
    hasAuthToken: boolean;
    lastSyncTime: string | null;
    lastError: string | null;
    isSyncing: boolean;
  } {
    return {
      gasUrl: this.getWebAppUrl(),
      hasAuthToken: Boolean(this.authToken),
      lastSyncTime: this.lastSyncTime,
      lastError: this.lastError,
      isSyncing: this.isSyncing,
    };
  }
}

/**
 * Singleton service.
 *
 * Gunakan:
 *
 * import { gasSync } from './services/gasSyncService';
 */
export const gasSync = new GasSyncService();
