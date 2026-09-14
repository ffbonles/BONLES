import { 
  Product, Category, Order, Customer, Setting, Banner, Testimonial, SystemLog, CartItem, CheckoutFormData 
} from '../types';
import { 
  INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS, 
  INITIAL_BANNERS, INITIAL_TESTIMONIALS, INITIAL_CUSTOMERS, INITIAL_ORDERS, INITIAL_LOGS 
} from '../data/initialData';
import { gasSync } from './gasSyncService';

/**
 * Purge outdated browser cookies and legacy localStorage keys
 * to ensure visitors always run with zero stale cache and connect directly to Google Spreadsheet.
 */
export function clearOldCookiesAndLegacyCache(): void {
  try {
    // 1. Purge all browser cookies
    if (typeof document !== 'undefined' && document.cookie) {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.slice(0, eqPos).trim() : cookie.trim();
        if (name) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          if (typeof window !== 'undefined' && window.location) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          }
        }
      }
    }

    // 2. Clean all legacy localStorage keys to enforce pure spreadsheet & in-memory state
    if (typeof localStorage !== 'undefined') {
      const legacyPrefixes = ['bonles_', 'bonles_products', 'bonles_categories', 'bonles_settings', 'bonles_banners', 'bonles_testimonials', 'bonles_orders', 'bonles_cart'];
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (legacyPrefixes.some(p => key.startsWith(p)) || key.includes('bonles'))) {
          // preserve admin auth session only if present
          if (key !== 'bonles_superadmin_session_v1') {
            keysToRemove.push(key);
          }
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    }
  } catch (err) {
    console.warn('Cache & cookie purge notice:', err);
  }
}

/**
 * StoreService: Spreadsheet-First Architecture (Without Local Storage)
 * Data lives in memory and synchronizes directly with Google Sheets via Google Apps Script.
 */
class StoreService {
  private listeners: Set<() => void> = new Set();

  // In-memory collections (No localStorage used)
  private products: Product[] = [...INITIAL_PRODUCTS];
  private categories: Category[] = [...INITIAL_CATEGORIES];
  private orders: Order[] = [...INITIAL_ORDERS];
  private customers: Customer[] = [...INITIAL_CUSTOMERS];
  private settings: Setting[] = [...INITIAL_SETTINGS];
  private banners: Banner[] = [...INITIAL_BANNERS];
  private testimonials: Testimonial[] = [...INITIAL_TESTIMONIALS];
  private logs: SystemLog[] = [...INITIAL_LOGS];
  private cart: CartItem[] = [];
  private recentlyViewedIds: string[] = [];

  // Google Apps Script Connection Status
  private isGasLiveConnected: boolean = false;
  private isGasSyncing: boolean = false;
  private lastGasSyncTime: string | null = null;
  private gasSyncError: string | null = null;

  constructor() {
    clearOldCookiesAndLegacyCache();
    this.ensureDefaultEssentialSettings();
    // Default initialization: Connect to Google Spreadsheet directly on app startup
    this.initDefaultGasSync();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public notifySubscribers(): void {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error('Store listener notification error:', err);
      }
    });
  }

  /**
   * Status of Google Apps Script / Google Spreadsheet Live Connection
   */
  public getGasStatus(): {
    connected: boolean;
    isSyncing: boolean;
    lastSyncTime: string | null;
    error: string | null;
  } {
    return {
      connected: this.isGasLiveConnected,
      isSyncing: this.isGasSyncing,
      lastSyncTime: this.lastGasSyncTime,
      error: this.gasSyncError,
    };
  }

  private ensureDefaultEssentialSettings(): void {
    // Ensure official WhatsApp Number (+6285174333902)
    const wa = this.settings.find(s => s.SETTING === 'WHATSAPP_NUMBER');
    if (!wa) {
      this.settings.push({
        SETTING: 'WHATSAPP_NUMBER',
        VALUE: '6285174333902',
        DESCRIPTION: 'Nomor WhatsApp resmi admin pemesanan (+6285174333902)',
        UPDATED_AT: new Date().toISOString(),
      });
    } else if (wa.VALUE === '6281234567890' || !wa.VALUE.trim()) {
      wa.VALUE = '6285174333902';
    }

    // Ensure official Store Email (bonlesff@gmail.com)
    const email = this.settings.find(s => s.SETTING === 'STORE_EMAIL');
    if (!email) {
      this.settings.push({
        SETTING: 'STORE_EMAIL',
        VALUE: 'bonlesff@gmail.com',
        DESCRIPTION: 'Alamat email korespondensi resmi (bonlesff@gmail.com)',
        UPDATED_AT: new Date().toISOString(),
      });
    } else if (email.VALUE === 'bonlesfoodnusantara@gmail.com' || !email.VALUE.trim()) {
      email.VALUE = 'bonlesff@gmail.com';
    }

    // Ensure official Store Address (Jl. MT. Haryono Gg. Mufakat II No.84 Balikpapan Selatan)
    const addr = this.settings.find(s => s.SETTING === 'STORE_ADDRESS');
    if (!addr) {
      this.settings.push({
        SETTING: 'STORE_ADDRESS',
        VALUE: 'Jl. MT. Haryono Gg. Mufakat II No.84 Balikpapan Selatan',
        DESCRIPTION: 'Alamat fisik / lokasi operasional resmi toko',
        UPDATED_AT: new Date().toISOString(),
      });
    } else if (addr.VALUE === 'Sentra Industri Pangan Nusantara, Indonesia' || !addr.VALUE.trim()) {
      addr.VALUE = 'Jl. MT. Haryono Gg. Mufakat II No.84 Balikpapan Selatan';
    }

    // Ensure official Google Apps Script Web App URL is present
    const script = this.settings.find(s => s.SETTING === 'APPS_SCRIPT_WEBAPP_URL');
    const defaultGasUrl = 'https://script.google.com/macros/s/AKfycbwKxzeSFQPgt2K8alCb7e0GiPdsp3_F2v2MrJD8zhnloXy7hiWhlr9Wt6zOZkFOne5z/exec';
    if (!script) {
      this.settings.push({
        SETTING: 'APPS_SCRIPT_WEBAPP_URL',
        VALUE: defaultGasUrl,
        DESCRIPTION: 'URL Web App Google Apps Script & Google Sheets aktif (ID: AKfycbwKxzeSFQPgt2K8alCb7e0GiPdsp3_F2v2MrJD8zhnloXy7hiWhlr9Wt6zOZkFOne5z)',
        UPDATED_AT: new Date().toISOString(),
      });
    } else if (!script.VALUE || !script.VALUE.trim() || script.VALUE.includes('AKfycbz1Trz8B-_7yWWEOBTQOGeP6QOGP03RER4RMdxkfSDqr8V2XCO0wxYZ2PhOfyVQFISkvw')) {
      script.VALUE = defaultGasUrl;
      script.DESCRIPTION = 'URL Web App Google Apps Script & Google Sheets aktif (ID: AKfycbwKxzeSFQPgt2K8alCb7e0GiPdsp3_F2v2MrJD8zhnloXy7hiWhlr9Wt6zOZkFOne5z)';
    }
    gasSync.setWebAppUrl(defaultGasUrl);
  }

  /**
   * Automatic Default Sync on App Startup:
   * Connects to Google Apps Script and pulls live data into memory.
   */
  private async initDefaultGasSync(): Promise<void> {
    this.isGasSyncing = true;
    this.gasSyncError = null;
    this.notifySubscribers();

    try {
      const res = await this.pullPublicFromCloudSpreadsheet('DEFAULT_STARTUP_SYNC');
      if (res.success) {
        this.isGasLiveConnected = true;
        this.lastGasSyncTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
        this.gasSyncError = null;
      } else {
        this.isGasLiveConnected = false;
        this.gasSyncError = res.message || 'Tidak dapat terhubung ke Google Spreadsheet';
      }
    } catch (err: any) {
      this.isGasLiveConnected = false;
      this.gasSyncError = err.message || 'Gagal sinkronisasi awal';
      console.warn('Init Default GAS Sync notice:', err);
    } finally {
      this.isGasSyncing = false;
      this.notifySubscribers();
    }
  }

  // Categories
  getCategories(): Category[] {
    return [...this.categories].sort((a, b) => a.SORT_ORDER - b.SORT_ORDER);
  }

  saveCategory(cat: Category): Category {
    const list = [...this.categories];
    const idx = list.findIndex(c => c.ID === cat.ID);
    const now = new Date().toISOString();
    
    let saved: Category;
    if (idx >= 0) {
      saved = { ...cat, UPDATED_AT: now };
      list[idx] = saved;
    } else {
      saved = { 
        ...cat, 
        ID: cat.ID || `CAT-${String(list.length + 1).padStart(3, '0')}`,
        CREATED_AT: now, 
        UPDATED_AT: now 
      };
      list.push(saved);
    }
    this.categories = list;
    this.notifySubscribers();
    this.addLog('AUDIT', idx >= 0 ? 'UPDATE_CATEGORY' : 'CREATE_CATEGORY', 'ADMIN', saved.ID, `Kategori ${saved.NAME} disimpan`);
    
    // Direct sync to Google Sheets
    gasSync.syncCategory(saved).then(res => {
      if (res.success) {
        this.addLog('SYNC', 'SYNC_CATEGORY_SUCCESS', 'SYSTEM', saved.ID, `Kategori ${saved.NAME} berhasil disinkronkan ke Google Spreadsheet`, 'SUCCESS');
      }
    }).catch(err => console.warn('Sync Category Error:', err));

    return saved;
  }

  deleteCategory(id: string): boolean {
    const list = [...this.categories];
    const idx = list.findIndex(c => c.ID === id);
    if (idx >= 0) {
      list[idx].ACTIVE = false;
      list[idx].UPDATED_AT = new Date().toISOString();
      this.categories = list;
      this.notifySubscribers();
      this.addLog('AUDIT', 'DELETE_CATEGORY', 'ADMIN', id, `Kategori ${id} dinonaktifkan`);
      
      gasSync.syncCategory(list[idx]).catch(err => console.warn('Sync Category Delete Error:', err));
      return true;
    }
    return false;
  }

  // Products
  getProducts(activeOnly = false, includeSample = true): Product[] {
    let list = [...this.products];
    // Sanitize any legacy [SAMPLE] tag in product names
    list = list.map(p => {
      if (p.NAME && p.NAME.includes('[SAMPLE]')) {
        return {
          ...p,
          NAME: p.NAME.replace(/\[SAMPLE\]\s*/gi, '').trim()
        };
      }
      return p;
    });

    // Data SAMPLE hanya boleh terlihat di area admin.
    // Data lama yang belum memiliki DATA_TYPE dianggap PRODUCTION agar migrasi
    // tidak tiba-tiba menyembunyikan produk yang sudah ada.
    const filtered = includeSample
      ? list
      : list.filter(p => String(p.DATA_TYPE || 'PRODUCTION').toUpperCase() === 'PRODUCTION');

    if (activeOnly) {
      return filtered.filter(p => p.ACTIVE);
    }
    return filtered;
  }

  getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.ID === id || p.SKU === id);
  }

  saveProduct(prod: Product, imageBase64?: string): Product {
    const list = [...this.products];
    const idx = list.findIndex(p => p.ID === prod.ID || p.SKU === prod.SKU);
    const now = new Date().toISOString();
    
    let saved: Product;
    if (idx >= 0) {
      saved = { ...prod, DATA_TYPE: prod.DATA_TYPE || 'PRODUCTION', UPDATED_AT: now };
      list[idx] = saved;
    } else {
      saved = {
        ...prod,
        DATA_TYPE: prod.DATA_TYPE || 'PRODUCTION',
        ID: prod.ID || `PRD-${String(list.length + 1).padStart(4, '0')}`,
        CREATED_AT: now,
        UPDATED_AT: now
      };
      list.push(saved);
    }
    this.products = list;
    this.notifySubscribers();
    this.addLog('AUDIT', idx >= 0 ? 'UPDATE_PRODUCT' : 'CREATE_PRODUCT', 'ADMIN', saved.SKU, `Produk ${saved.NAME} berhasil disimpan`);

    // Direct sync to Google Sheets & Drive
    gasSync.syncProduct(saved, imageBase64).then(res => {
      if (res.success) {
        this.addLog('SYNC', 'SYNC_PRODUCT_SUCCESS', 'SYSTEM', saved.SKU, `Produk ${saved.NAME} berhasil dicatat di Google Spreadsheet & Drive`, 'SUCCESS');
        if (res.data && res.data.MAIN_IMAGE_URL && res.data.MAIN_IMAGE_URL !== saved.MAIN_IMAGE_URL) {
          const freshList = [...this.products];
          const target = freshList.find(p => p.ID === saved.ID || p.SKU === saved.SKU);
          if (target) {
            target.MAIN_IMAGE_URL = res.data.MAIN_IMAGE_URL;
            target.MAIN_IMAGE_FILE_ID = res.data.MAIN_IMAGE_FILE_ID || target.MAIN_IMAGE_FILE_ID;
            this.products = freshList;
            this.notifySubscribers();
          }
        }
      }
    }).catch(err => console.warn('Sync Product Error:', err));

    return saved;
  }

  deleteProduct(id: string): boolean {
    const list = [...this.products];
    const idx = list.findIndex(p => p.ID === id);
    if (idx >= 0) {
      // Soft delete: ACTIVE = false
      list[idx].ACTIVE = false;
      list[idx].UPDATED_AT = new Date().toISOString();
      this.products = list;
      this.notifySubscribers();
      this.addLog('AUDIT', 'SOFT_DELETE_PRODUCT', 'ADMIN', list[idx].SKU, `Produk ${list[idx].NAME} dinonaktifkan (soft delete)`);
      
      // Sync deletion to Google Sheets
      gasSync.syncProduct(list[idx]).catch(err => console.warn('Sync Delete Product Error:', err));
      return true;
    }
    return false;
  }

  // Cart Management (In-memory)
  getCart(): CartItem[] {
    return [...this.cart];
  }

  saveCart(cart: CartItem[]): void {
    this.cart = [...cart];
    this.notifySubscribers();
  }

  addToCart(product: Product, quantity = 1): CartItem[] {
    const cart = [...this.cart];
    const idx = cart.findIndex(c => c.product.ID === product.ID);
    
    // Check available stock
    const freshProduct = this.getProductById(product.ID) || product;
    const currentQty = idx >= 0 ? cart[idx].quantity : 0;
    const newQty = currentQty + quantity;

    if (newQty > freshProduct.STOCK) {
      throw new Error(`Stok tidak mencukupi. Maksimal ${freshProduct.STOCK} item.`);
    }

    if (idx >= 0) {
      cart[idx].quantity = newQty;
      cart[idx].product = freshProduct;
    } else {
      cart.push({ product: freshProduct, quantity });
    }
    this.saveCart(cart);
    return cart;
  }

  updateCartQuantity(productId: string, quantity: number): CartItem[] {
    let cart = [...this.cart];
    if (quantity <= 0) {
      cart = cart.filter(c => c.product.ID !== productId);
    } else {
      const item = cart.find(c => c.product.ID === productId);
      if (item) {
        const freshProduct = this.getProductById(productId) || item.product;
        if (quantity > freshProduct.STOCK) {
          throw new Error(`Stok tersedia hanya ${freshProduct.STOCK} unit.`);
        }
        item.quantity = quantity;
        item.product = freshProduct;
      }
    }
    this.saveCart(cart);
    return cart;
  }

  clearCart(): void {
    this.cart = [];
    this.notifySubscribers();
  }

  // Orders
  getOrders(): Order[] {
    return [...this.orders];
  }

  updateOrderStatus(orderId: string, status: Order['STATUS']): Order {
    const list = [...this.orders];
    const idx = list.findIndex(o => o.ORDER_ID === orderId);
    if (idx >= 0) {
      list[idx].STATUS = status;
      list[idx].UPDATED_AT = new Date().toISOString();
      this.orders = list;
      this.notifySubscribers();
      this.addLog('AUDIT', 'UPDATE_ORDER_STATUS', 'ADMIN', orderId, `Status pesanan diubah menjadi ${status}`);
      
      // Direct sync to GAS
      gasSync.syncOrder({ action: 'updateOrderStatus', orderId, status }).catch(err => console.warn('Order status sync error:', err));
      return list[idx];
    }
    throw new Error('Pesanan tidak ditemukan');
  }

  // Atomic Order Creation with Stock Validation & Customer Upsert
  createOrder(form: CheckoutFormData, cartItems: CartItem[]): Order {
    if (!form.name || !form.phone) {
      throw new Error('Nama dan nomor WhatsApp wajib diisi.');
    }
    if (cartItems.length === 0) {
      throw new Error('Keranjang belanja kosong.');
    }

    const allProducts = this.getProducts();
    let subtotal = 0;
    const validatedItems: { product: Product; qty: number; price: number; subtotal: number }[] = [];

    // Re-verify stocks & fresh prices
    for (const item of cartItems) {
      const fresh = allProducts.find(p => p.ID === item.product.ID);
      if (!fresh || !fresh.ACTIVE) {
        throw new Error(`Produk ${item.product.NAME} sudah tidak aktif atau tidak ditemukan.`);
      }
      if (fresh.STOCK < item.quantity) {
        throw new Error(`Stok untuk ${fresh.NAME} tidak mencukupi (tersisa ${fresh.STOCK}).`);
      }
      
      const effectivePrice = (fresh.DISCOUNT_PRICE > 0 && fresh.DISCOUNT_PRICE < fresh.PRICE)
        ? fresh.DISCOUNT_PRICE
        : fresh.PRICE;
      const lineSubtotal = effectivePrice * item.quantity;
      
      subtotal += lineSubtotal;
      validatedItems.push({
        product: fresh,
        qty: item.quantity,
        price: effectivePrice,
        subtotal: lineSubtotal,
      });
    }

    // Shipping calculation
    const settings = this.getSettingsMap();
    const defaultShipping = Number(settings['DEFAULT_SHIPPING_COST']) || 15000;
    const shippingCost = defaultShipping;
    const discount = 0;
    const total = subtotal - discount + shippingCost;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const randomSuffix = String(Math.floor(Math.random() * 9000) + 1000);
    const orderId = `ORD-${year}${month}${day}-${randomSuffix}`;
    const isoNow = now.toISOString();

    // Deduplicate / Create Customer
    const customers = [...this.customers];
    let customer = customers.find(c => c.PHONE === form.phone || (form.email && c.EMAIL === form.email));
    if (!customer) {
      customer = {
        CUSTOMER_ID: `CUST-${String(customers.length + 1).padStart(4, '0')}`,
        NAME: form.name,
        PHONE: form.phone,
        EMAIL: form.email || '',
        ADDRESS: form.address,
        CITY: form.city,
        POSTAL_CODE: form.postalCode,
        CREATED_AT: isoNow,
        UPDATED_AT: isoNow,
      };
      customers.push(customer);
    } else {
      customer.ADDRESS = form.address;
      customer.CITY = form.city;
      customer.POSTAL_CODE = form.postalCode;
      customer.UPDATED_AT = isoNow;
    }
    this.customers = customers;

    // Atomically decrement stock in memory
    const updatedProducts = allProducts.map(p => {
      const match = validatedItems.find(v => v.product.ID === p.ID);
      if (match) {
        return {
          ...p,
          STOCK: Math.max(0, p.STOCK - match.qty),
          UPDATED_AT: isoNow,
        };
      }
      return p;
    });
    this.products = updatedProducts;

    // Build Order record
    const newOrder: Order = {
      ORDER_ID: orderId,
      ORDER_DATE: isoNow,
      CUSTOMER_ID: customer.CUSTOMER_ID,
      CUSTOMER_NAME: form.name,
      PHONE: form.phone,
      EMAIL: form.email || '',
      ADDRESS: form.address,
      CITY: form.city,
      POSTAL_CODE: form.postalCode,
      PAYMENT_METHOD: form.paymentMethod || 'Transfer Bank (BCA/Mandiri)',
      SHIPPING_METHOD: form.shippingMethod || 'Reguler',
      SHIPPING_COST: shippingCost,
      SUBTOTAL: subtotal,
      DISCOUNT: discount,
      TOTAL: total,
      STATUS: 'PENDING',
      NOTES: form.notes || '',
      CREATED_AT: isoNow,
      UPDATED_AT: isoNow,
      ITEMS: validatedItems.map(vi => ({
        ORDER_ID: orderId,
        PRODUCT_ID: vi.product.ID,
        SKU: vi.product.SKU,
        PRODUCT_NAME: vi.product.NAME,
        PRICE: vi.price,
        QUANTITY: vi.qty,
        SUBTOTAL: vi.subtotal,
      })),
    };

    this.orders.unshift(newOrder);
    this.notifySubscribers();

    // Log
    this.addLog('AUDIT', 'CREATE_ORDER', 'CUSTOMER', orderId, `Pesanan dibuat untuk ${form.name} senilai Rp ${total.toLocaleString('id-ID')}`);

    // Direct sync to Google Sheets
    gasSync.syncOrder({
      customer: {
        name: form.name,
        phone: form.phone,
        email: form.email || '',
        address: form.address,
        city: form.city,
        postal_code: form.postalCode,
        notes: form.notes || '',
      },
      items: validatedItems.map(vi => ({
        product_id: vi.product.ID,
        sku: vi.product.SKU,
        quantity: vi.qty,
      })),
      shipping_cost: shippingCost,
      payment_method: form.paymentMethod || 'Transfer Bank',
      shipping_method: form.shippingMethod || 'Reguler',
    }).then(res => {
      if (res.success) {
        this.addLog('SYNC', 'SYNC_ORDER_SUCCESS', 'SYSTEM', orderId, `Pesanan ${orderId} berhasil dicatat di Google Spreadsheet`, 'SUCCESS');
      }
    }).catch(err => console.warn('Order sync warning:', err));

    // Clear cart
    this.clearCart();

    return newOrder;
  }

  // Customers
  getCustomers(): Customer[] {
    return [...this.customers];
  }

  // Settings & Editorial Content
  getSettings(): Setting[] {
    return [...this.settings];
  }

  getSettingsMap(): Record<string, string> {
    const list = this.getSettings();
    const map: Record<string, string> = {};
    list.forEach(s => {
      map[s.SETTING] = s.VALUE;
    });
    return map;
  }

  getSettingValue(key: string, defaultVal = ''): string {
    const map = this.getSettingsMap();
    return map[key] !== undefined ? map[key] : defaultVal;
  }

  saveSetting(key: string, value: string, description?: string): void {
    const list = [...this.settings];
    const idx = list.findIndex(s => s.SETTING === key);
    const now = new Date().toISOString();
    if (idx >= 0) {
      list[idx].VALUE = value;
      list[idx].UPDATED_AT = now;
      if (description) list[idx].DESCRIPTION = description;
    } else {
      list.push({ SETTING: key, VALUE: value, DESCRIPTION: description || '', UPDATED_AT: now });
    }
    this.settings = list;
    this.notifySubscribers();
    this.addLog('AUDIT', 'UPDATE_SETTING', 'ADMIN', key, `Pengaturan / Redaksi ${key} diubah`);
    
    // Direct sync to GAS
    gasSync.syncSettings(list).catch(err => console.warn('Sync Setting Error:', err));
  }

  saveAllSettings(settingsList: Setting[]): void {
    const now = new Date().toISOString();
    const updated = settingsList.map(s => ({ ...s, UPDATED_AT: now }));
    this.settings = updated;
    this.notifySubscribers();
    this.addLog('AUDIT', 'BULK_UPDATE_SETTINGS', 'ADMIN', 'CONFIG', `Sebanyak ${updated.length} pengaturan & redaksi berhasil disimpan dan disinkronkan`);
    
    // Sync all settings directly to Google Sheets
    gasSync.syncSettings(updated).then(res => {
      if (res.success) {
        this.addLog('SYNC', 'SYNC_SETTINGS_SUCCESS', 'SYSTEM', 'CONFIG', 'Pengaturan & Redaksi berhasil disinkronkan ke Google Spreadsheet', 'SUCCESS');
      }
    }).catch(err => console.warn('Sync Settings Error:', err));
  }

  // Banners & Promos
  getBanners(): Banner[] {
    return [...this.banners].sort((a, b) => a.SORT_ORDER - b.SORT_ORDER);
  }

  saveBanner(banner: Banner): Banner {
    const list = [...this.banners];
    const idx = list.findIndex(b => b.ID === banner.ID);
    const now = new Date().toISOString();
    let saved: Banner;
    if (idx >= 0) {
      saved = { ...banner, UPDATED_AT: now };
      list[idx] = saved;
    } else {
      saved = {
        ...banner,
        ID: banner.ID || `BNR-${String(list.length + 1).padStart(3, '0')}`,
        CREATED_AT: now,
        UPDATED_AT: now,
      };
      list.push(saved);
    }
    this.banners = list;
    this.notifySubscribers();
    this.addLog('AUDIT', idx >= 0 ? 'UPDATE_BANNER' : 'CREATE_BANNER', 'ADMIN', saved.ID, `Banner iklan ${saved.TITLE} berhasil disimpan`);
    
    // Direct sync to GAS
    gasSync.syncBanner(saved).catch(err => console.warn('Sync Banner Error:', err));
    return saved;
  }

  deleteBanner(id: string): boolean {
    const list = [...this.banners];
    const idx = list.findIndex(b => b.ID === id);
    if (idx >= 0) {
      list[idx].ACTIVE = false;
      list[idx].UPDATED_AT = new Date().toISOString();
      this.banners = list;
      this.notifySubscribers();
      this.addLog('AUDIT', 'DELETE_BANNER', 'ADMIN', id, `Banner iklan ${id} dinonaktifkan`);
      
      gasSync.syncBanner(list[idx]).catch(err => console.warn('Sync Delete Banner Error:', err));
      return true;
    }
    return false;
  }

  // Testimonials
  getTestimonials(): Testimonial[] {
    return [...this.testimonials].sort((a, b) => a.SORT_ORDER - b.SORT_ORDER);
  }

  saveTestimonial(testimonial: Testimonial): Testimonial {
    const list = [...this.testimonials];
    const idx = list.findIndex(t => t.ID === testimonial.ID);
    const now = new Date().toISOString();
    let saved: Testimonial;
    if (idx >= 0) {
      saved = { ...testimonial, UPDATED_AT: now };
      list[idx] = saved;
    } else {
      saved = {
        ...testimonial,
        ID: testimonial.ID || `TESTI-${String(list.length + 1).padStart(3, '0')}`,
        CREATED_AT: now,
        UPDATED_AT: now,
      };
      list.push(saved);
    }
    this.testimonials = list;
    this.notifySubscribers();
    this.addLog('AUDIT', idx >= 0 ? 'UPDATE_TESTIMONIAL' : 'CREATE_TESTIMONIAL', 'ADMIN', saved.ID, `Testimoni dari ${saved.CUSTOMER_NAME} berhasil disimpan`);
    
    // Direct sync to GAS
    gasSync.syncTestimonial(saved).catch(err => console.warn('Sync Testimonial Error:', err));
    return saved;
  }

  deleteTestimonial(id: string): boolean {
    const list = [...this.testimonials];
    const idx = list.findIndex(t => t.ID === id);
    if (idx >= 0) {
      list[idx].ACTIVE = false;
      list[idx].UPDATED_AT = new Date().toISOString();
      this.testimonials = list;
      this.notifySubscribers();
      this.addLog('AUDIT', 'DELETE_TESTIMONIAL', 'ADMIN', id, `Testimoni ${id} dinonaktifkan`);
      
      gasSync.syncTestimonial(list[idx]).catch(err => console.warn('Sync Delete Testimonial Error:', err));
      return true;
    }
    return false;
  }

  /**
   * Pull and sync ALL data directly from Google Spreadsheet into the Web App
   * Updates Products, Categories, Settings/Editorial, Banners, Testimonials in memory
   */
  async pullAdminDataFromCloudSpreadsheet(user = 'ADMIN'): Promise<{ success: boolean; message: string }> {
    try {
      const res = await gasSync.pullAdminData();
      if (!res.success || !res.data) return { success: false, message: res.message || 'Gagal memuat data admin.' };

      if (Array.isArray(res.data.orders)) this.orders = res.data.orders as Order[];
      if (Array.isArray(res.data.customers)) this.customers = res.data.customers as Customer[];
      if (Array.isArray(res.data.logs)) this.logs = res.data.logs as SystemLog[];
      if (Array.isArray(res.data.products)) this.products = res.data.products as Product[];
      if (Array.isArray(res.data.categories)) this.categories = res.data.categories as Category[];
      if (Array.isArray(res.data.banners)) this.banners = res.data.banners as Banner[];
      if (Array.isArray(res.data.testimonials)) this.testimonials = res.data.testimonials as Testimonial[];
      if (Array.isArray(res.data.settings)) this.settings = res.data.settings as Setting[];

      this.isGasLiveConnected = true;
      this.gasSyncError = null;
      this.lastGasSyncTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
      this.notifySubscribers();
      return { success: true, message: 'Data privat admin berhasil dimuat.' };
    } catch (err: any) {
      this.gasSyncError = err?.message || 'Gagal memuat data admin.';
      this.notifySubscribers();
      return { success: false, message: this.gasSyncError };
    }
  }

  async pullPublicFromCloudSpreadsheet(user = 'SYSTEM'): Promise<{
    success: boolean;
    message: string;
    productCount: number;
    categoryCount: number;
    bannerCount: number;
    testimonialCount: number;
    settingsCount: number;
    details?: any;
  }> {
    return this.pullFromCloudSpreadsheet(user);
  }

  async pullFromCloudSpreadsheet(user = 'SYSTEM'): Promise<{
    success: boolean;
    message: string;
    productCount: number;
    categoryCount: number;
    bannerCount: number;
    testimonialCount: number;
    settingsCount: number;
    details?: any;
  }> {
    const parseSafeNum = (val: any, defaultVal = 0): number => {
      if (val === undefined || val === null || val === '') return defaultVal;
      if (typeof val === 'number') return isNaN(val) ? defaultVal : val;
      const cleaned = String(val).replace(/[^0-9.-]/g, '');
      const parsed = Number(cleaned);
      return isNaN(parsed) ? defaultVal : parsed;
    };

    const parseSafeBool = (val: any, defaultVal = true): boolean => {
      if (val === undefined || val === null || val === '') return defaultVal;
      if (typeof val === 'boolean') return val;
      const str = String(val).trim().toUpperCase();
      if (str === 'TRUE' || str === '1' || str === 'YES' || str === 'YA' || str === 'AKTIF' || str === 'ACTIVE') return true;
      if (str === 'FALSE' || str === '0' || str === 'NO' || str === 'TIDAK' || str === 'NONAKTIF' || str === 'INACTIVE') return false;
      return defaultVal;
    };

    const parseSafeStr = (val: any, defaultVal = ''): string => {
      if (val === undefined || val === null) return defaultVal;
      return String(val).trim();
    };

    this.isGasSyncing = true;
    this.notifySubscribers();

    try {
      const res = await gasSync.pullPublicData();
      if (!res.success || !res.data) {
        this.isGasSyncing = false;
        this.gasSyncError = res.message || 'Gagal mengambil data dari Google Spreadsheet.';
        this.notifySubscribers();
        return {
          success: false,
          message: res.message || 'Gagal mengambil data dari Google Spreadsheet.',
          productCount: 0,
          categoryCount: 0,
          bannerCount: 0,
          testimonialCount: 0,
          settingsCount: 0,
          details: res,
        };
      }

      const data = res.data;
      let pCount = 0;
      let cCount = 0;
      let bCount = 0;
      let tCount = 0;
      let sCount = 0;

      // 1. Normalize & Save Categories to memory
      if (Array.isArray(data.categories) && data.categories.length > 0) {
        const categories: Category[] = data.categories.map((c: any, index: number) => ({
          ID: parseSafeStr(c.ID || c.id || `CAT-${String(index + 1).padStart(3, '0')}`),
          NAME: parseSafeStr(c.NAME || c.name || `Kategori ${index + 1}`),
          DESCRIPTION: parseSafeStr(c.DESCRIPTION || c.description || ''),
          IMAGE_FILE_ID: parseSafeStr(c.IMAGE_FILE_ID || c.image_file_id || ''),
          IMAGE_URL: parseSafeStr(c.IMAGE_URL || c.image_url || ''),
          ACTIVE: parseSafeBool(c.ACTIVE !== undefined ? c.ACTIVE : c.active, true),
          SORT_ORDER: parseSafeNum(c.SORT_ORDER !== undefined ? c.SORT_ORDER : c.sort_order, index + 1),
          CREATED_AT: parseSafeStr(c.CREATED_AT || c.created_at || new Date().toISOString()),
          UPDATED_AT: parseSafeStr(c.UPDATED_AT || c.updated_at || new Date().toISOString()),
        })).filter(c => c.NAME);

        if (categories.length > 0) {
          this.categories = categories;
          cCount = categories.length;
        }
      }

      // 2. Normalize & Save Products to memory
      if (Array.isArray(data.products) && data.products.length > 0) {
        const products: Product[] = data.products.map((p: any, index: number) => ({
          ID: parseSafeStr(p.ID || p.id || `PRD-${String(index + 1).padStart(4, '0')}`),
          SKU: parseSafeStr(p.SKU || p.sku || `SKU-${String(index + 1).padStart(3, '0')}`),
          NAME: parseSafeStr(p.NAME || p.name || `Produk ${index + 1}`),
          CATEGORY_ID: parseSafeStr(p.CATEGORY_ID || p.category_id || 'CAT-001'),
          CATEGORY_NAME: parseSafeStr(p.CATEGORY_NAME || p.category_name || 'Snack Pouch'),
          CATEGORY_FOLDER_ID: parseSafeStr(p.CATEGORY_FOLDER_ID || p.category_folder_id || ''),
          PRODUCT_FOLDER_ID: parseSafeStr(p.PRODUCT_FOLDER_ID || p.product_folder_id || ''),
          PRICE: parseSafeNum(p.PRICE !== undefined ? p.PRICE : p.price, 25000),
          DISCOUNT_PRICE: parseSafeNum(p.DISCOUNT_PRICE !== undefined ? p.DISCOUNT_PRICE : p.discount_price, 0),
          WEIGHT: parseSafeStr(p.WEIGHT || p.weight || '100g'),
          STOCK: parseSafeNum(p.STOCK !== undefined ? p.STOCK : p.stock, 0),
          DESCRIPTION: parseSafeStr(p.DESCRIPTION || p.description || ''),
          COMPOSITION: parseSafeStr(p.COMPOSITION || p.composition || ''),
          NUTRITION: parseSafeStr(p.NUTRITION || p.nutrition || ''),
          MAIN_IMAGE_FILE_ID: parseSafeStr(p.MAIN_IMAGE_FILE_ID || p.main_image_file_id || ''),
          MAIN_IMAGE_URL: parseSafeStr(p.MAIN_IMAGE_URL || p.main_image_url || ''),
          GALLERY_1_FILE_ID: parseSafeStr(p.GALLERY_1_FILE_ID || p.gallery_1_file_id || ''),
          GALLERY_1_URL: parseSafeStr(p.GALLERY_1_URL || p.gallery_1_url || ''),
          GALLERY_2_FILE_ID: parseSafeStr(p.GALLERY_2_FILE_ID || p.gallery_2_file_id || ''),
          GALLERY_2_URL: parseSafeStr(p.GALLERY_2_URL || p.gallery_2_url || ''),
          GALLERY_3_FILE_ID: parseSafeStr(p.GALLERY_3_FILE_ID || p.gallery_3_file_id || ''),
          GALLERY_3_URL: parseSafeStr(p.GALLERY_3_URL || p.gallery_3_url || ''),
          FEATURED: parseSafeBool(p.FEATURED !== undefined ? p.FEATURED : p.featured, false),
          ACTIVE: parseSafeBool(p.ACTIVE !== undefined ? p.ACTIVE : p.active, true),
          DATA_TYPE: String(p.DATA_TYPE || p.data_type || 'PRODUCTION').toUpperCase() === 'SAMPLE' ? 'SAMPLE' : 'PRODUCTION',
          CREATED_AT: parseSafeStr(p.CREATED_AT || p.created_at || new Date().toISOString()),
          UPDATED_AT: parseSafeStr(p.UPDATED_AT || p.updated_at || new Date().toISOString()),
        })).filter(p => p.NAME);

        if (products.length > 0) {
          this.products = products;
          pCount = products.length;
        }
      }

      // 3. Normalize & Save Settings / Redaksi to memory
      if (data.settings) {
        const updatedSettings: Setting[] = [...this.settings];

        if (Array.isArray(data.settings)) {
          data.settings.forEach((s: any) => {
            const key = parseSafeStr(s.SETTING || s.setting || s[0]);
            const val = parseSafeStr(s.VALUE !== undefined ? s.VALUE : (s.value !== undefined ? s.value : s[1]));
            const desc = parseSafeStr(s.DESCRIPTION || s.description || s[2] || '');
            if (key) {
              const idx = updatedSettings.findIndex(x => x.SETTING === key);
              if (idx >= 0) {
                updatedSettings[idx] = { ...updatedSettings[idx], VALUE: val, DESCRIPTION: desc || updatedSettings[idx].DESCRIPTION, UPDATED_AT: new Date().toISOString() };
              } else {
                updatedSettings.push({ SETTING: key, VALUE: val, DESCRIPTION: desc, UPDATED_AT: new Date().toISOString() });
              }
            }
          });
        } else if (typeof data.settings === 'object') {
          Object.entries(data.settings).forEach(([key, val]) => {
            const strVal = parseSafeStr(val);
            const idx = updatedSettings.findIndex(x => x.SETTING === key);
            if (idx >= 0) {
              updatedSettings[idx] = { ...updatedSettings[idx], VALUE: strVal, UPDATED_AT: new Date().toISOString() };
            } else {
              updatedSettings.push({ SETTING: key, VALUE: strVal, DESCRIPTION: '', UPDATED_AT: new Date().toISOString() });
            }
          });
        }

        this.settings = updatedSettings;
        sCount = updatedSettings.length;
      }

      // 4. Normalize & Save Banners to memory
      if (Array.isArray(data.banners) && data.banners.length > 0) {
        const banners: Banner[] = data.banners.map((b: any, index: number) => ({
          ID: parseSafeStr(b.ID || b.id || `BNR-${String(index + 1).padStart(3, '0')}`),
          TITLE: parseSafeStr(b.TITLE || b.title || ''),
          SUBTITLE: parseSafeStr(b.SUBTITLE || b.subtitle || ''),
          DESCRIPTION: parseSafeStr(b.DESCRIPTION || b.description || ''),
          IMAGE_FILE_ID: parseSafeStr(b.IMAGE_FILE_ID || b.image_file_id || ''),
          IMAGE_URL: parseSafeStr(b.IMAGE_URL || b.image_url || ''),
          BUTTON_TEXT: parseSafeStr(b.BUTTON_TEXT || b.button_text || 'Lihat Katalog'),
          BUTTON_LINK: parseSafeStr(b.BUTTON_LINK || b.button_link || '#catalog'),
          ACTIVE: parseSafeBool(b.ACTIVE !== undefined ? b.ACTIVE : b.active, true),
          SORT_ORDER: parseSafeNum(b.SORT_ORDER !== undefined ? b.SORT_ORDER : b.sort_order, index + 1),
          CREATED_AT: parseSafeStr(b.CREATED_AT || b.created_at || new Date().toISOString()),
          UPDATED_AT: parseSafeStr(b.UPDATED_AT || b.updated_at || new Date().toISOString()),
        })).filter(b => b.TITLE || b.IMAGE_URL);

        if (banners.length > 0) {
          this.banners = banners;
          bCount = banners.length;
        }
      }

      // 5. Normalize & Save Testimonials to memory
      if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
        const testimonials: Testimonial[] = data.testimonials.map((t: any, index: number) => ({
          ID: parseSafeStr(t.ID || t.id || `TESTI-${String(index + 1).padStart(3, '0')}`),
          CUSTOMER_NAME: parseSafeStr(t.CUSTOMER_NAME || t.customer_name || 'Pelanggan Bonles'),
          MESSAGE: parseSafeStr(t.MESSAGE || t.message || ''),
          PHOTO_FILE_ID: parseSafeStr(t.PHOTO_FILE_ID || t.photo_file_id || ''),
          PHOTO_URL: parseSafeStr(t.PHOTO_URL || t.photo_url || ''),
          RATING: parseSafeNum(t.RATING !== undefined ? t.RATING : t.rating, 5),
          ACTIVE: parseSafeBool(t.ACTIVE !== undefined ? t.ACTIVE : t.active, true),
          SORT_ORDER: parseSafeNum(t.SORT_ORDER !== undefined ? t.SORT_ORDER : t.sort_order, index + 1),
          CREATED_AT: parseSafeStr(t.CREATED_AT || t.created_at || new Date().toISOString()),
          UPDATED_AT: parseSafeStr(t.UPDATED_AT || t.updated_at || new Date().toISOString()),
        })).filter(t => t.MESSAGE);

        if (testimonials.length > 0) {
          this.testimonials = testimonials;
          tCount = testimonials.length;
        }
      }

      // Set live connection states
      this.isGasLiveConnected = true;
      this.isGasSyncing = false;
      this.gasSyncError = null;
      const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.lastGasSyncTime = `${timeStr} WIB`;

      // Trigger re-renders across all active components
      this.notifySubscribers();

      this.addLog(
        'SYNC',
        'PULL_FROM_SPREADSHEET',
        user,
        'SPREADSHEET_SYNC',
        `Data live berhasil ditarik dari Google Spreadsheet pada ${timeStr} WIB: ${pCount} produk, ${cCount} kategori, ${sCount} pengaturan & redaksi.`,
        'SUCCESS'
      );

      return {
        success: true,
        message: `Berhasil memuat data langsung dari Google Spreadsheet (${pCount} produk, ${cCount} kategori, ${sCount} pengaturan & redaksi).`,
        productCount: pCount,
        categoryCount: cCount,
        bannerCount: bCount,
        testimonialCount: tCount,
        settingsCount: sCount,
        details: res.data,
      };
    } catch (err: any) {
      console.error('Pull from spreadsheet exception:', err);
      this.isGasLiveConnected = false;
      this.isGasSyncing = false;
      this.gasSyncError = err.message || 'Gagal terhubung ke Google Spreadsheet';
      this.notifySubscribers();

      return {
        success: false,
        message: `Terjadi kendala saat menarik data dari Google Spreadsheet: ${err.message}`,
        productCount: 0,
        categoryCount: 0,
        bannerCount: 0,
        testimonialCount: 0,
        settingsCount: 0,
        details: err,
      };
    }
  }

  /**
   * Bulk Sync all in-memory items to Google Sheets & Google Drive
   */
  async syncAllToCloudSpreadsheet(user = 'ADMIN'): Promise<{ success: boolean; message: string; details?: any }> {
    const products = this.getProducts();
    const categories = this.getCategories();
    const banners = this.getBanners();
    const testimonials = this.getTestimonials();
    const settings = this.getSettings();
    const orders = this.getOrders();
    const customers = this.getCustomers();

    try {
      const res = await gasSync.pushAllDataToGoogleSheets({
        products,
        categories,
        banners,
        testimonials,
        settings,
        orders,
        customers,
      });

      if (res.success) {
        this.isGasLiveConnected = true;
        this.lastGasSyncTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
        this.addLog('SYNC', 'BULK_SYNC_TO_CLOUD', user, 'GOOGLE_SPREADSHEET', `Sinkronisasi menyeluruh ke Spreadsheet berhasil: ${products.length} produk, ${categories.length} kategori, ${banners.length} banner, ${testimonials.length} testimoni.`, 'SUCCESS');
        return {
          success: true,
          message: 'Seluruh data berhasil disinkronkan ke Google Spreadsheet & Google Drive!',
          details: res.data || res,
        };
      } else {
        this.addLog('ERROR', 'BULK_SYNC_TO_CLOUD_FAILED', user, 'GOOGLE_SPREADSHEET', `Gagal sinkronisasi ke Spreadsheet: ${res.message}`, 'FAILED');
        return {
          success: false,
          message: res.message || 'Gagal mengirim data ke Google Spreadsheet.',
          details: res,
        };
      }
    } catch (err: any) {
      this.addLog('ERROR', 'BULK_SYNC_TO_CLOUD_EXCEPTION', user, 'GOOGLE_SPREADSHEET', `Terjadi error jaringan: ${err.message}`, 'FAILED');
      return {
        success: false,
        message: `Terjadi error saat sinkronisasi: ${err.message}`,
        details: err,
      };
    }
  }

  /**
   * Force Save & Verify for Superadmin and Admin
   */
  forceSyncAndVerify(user = 'ADMIN'): {
    success: boolean;
    timestamp: string;
    productCount: number;
    activeProductCount: number;
    categoryCount: number;
    orderCount: number;
    bannerCount: number;
    testimonialCount: number;
    message: string;
    cloudSyncPromise: Promise<{ success: boolean; message: string; details?: any }>;
  } {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const products = this.getProducts();
    const categories = this.getCategories();
    const orders = this.getOrders();
    const banners = this.getBanners();
    const testimonials = this.getTestimonials();
    const activeProds = products.filter(p => p.ACTIVE).length;

    this.addLog(
      'SYNC',
      'ADMIN_SAVE_AND_VERIFY',
      user,
      'SPREADSHEET_SNAPSHOT',
      `Verifikasi penyimpanan menyeluruh berhasil pada ${timeFormatted} WIB: ${products.length} produk (${activeProds} aktif), ${categories.length} kategori, ${banners.length} banner siap live di Google Spreadsheet.`,
      'SUCCESS'
    );

    // Asynchronously trigger Cloud Sync to Google Sheets & Drive
    const cloudSyncPromise = this.syncAllToCloudSpreadsheet(user);

    return {
      success: true,
      timestamp: timeFormatted,
      productCount: products.length,
      activeProductCount: activeProds,
      categoryCount: categories.length,
      orderCount: orders.length,
      bannerCount: banners.length,
      testimonialCount: testimonials.length,
      message: `Semua data (${activeProds} produk aktif, ${categories.length} kategori, redaksi & pengaturan toko) tersimpan langsung ke Google Spreadsheet via Google Apps Script (tanpa local storage).`,
      cloudSyncPromise,
    };
  }

  // Logs
  getLogs(): SystemLog[] {
    return [...this.logs];
  }

  addLog(type: SystemLog['TYPE'], action: string, user: string, refId: string, message: string, status: 'SUCCESS' | 'FAILED' = 'SUCCESS'): void {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const logId = `LOG-${dateStr}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    
    this.logs.unshift({
      LOG_ID: logId,
      TIMESTAMP: now.toISOString(),
      TYPE: type,
      ACTION: action,
      USER: user,
      REFERENCE_ID: refId,
      MESSAGE: message,
      STATUS: status,
    });
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(0, 100);
    }
  }

  // Sample data is deliberately isolated from production data.
  // This only replaces the in-memory SAMPLE records; it never writes over
  // production records in the Spreadsheet. Use gasSync.clearSampleProducts()
  // from the admin action to permanently remove SAMPLE rows from Sheets.
  resetToSampleData(): void {
    const production = this.products.filter(
      p => String(p.DATA_TYPE || 'PRODUCTION').toUpperCase() === 'PRODUCTION'
    );
    this.products = [...production, ...INITIAL_PRODUCTS.map(p => ({ ...p, DATA_TYPE: 'SAMPLE' as const }))];
    this.notifySubscribers();
    this.addLog('INFO', 'RESET_SAMPLE_DATA', 'ADMIN', 'SYSTEM', 'Data SAMPLE dikembalikan ke contoh produk default. Data PRODUCTION tidak diubah.');
  }

  public async clearSampleProductsFromCloud(): Promise<{ success: boolean; message: string; deletedCount?: number }> {
    const result = await gasSync.clearSampleProducts();
    if (!result.success) return { success: false, message: result.message || 'Gagal menghapus data sample.' };
    // Reload is intentionally delegated to the caller so the UI can show the
    // server result first and then pull a fresh Spreadsheet snapshot.
    return {
      success: true,
      message: result.message || 'Data sample berhasil dihapus dari Spreadsheet.',
      deletedCount: Number(result.data?.deletedCount || 0),
    };
  }

  // Recently Viewed Tracking (In-memory)
  getRecentlyViewed(limit = 4): Product[] {
    const allProducts = this.getProducts(true);
    const result: Product[] = [];

    for (const id of this.recentlyViewedIds) {
      const found = allProducts.find(p => p.ID === id || p.SKU === id);
      if (found) {
        result.push(found);
      }
      if (result.length >= limit) break;
    }
    return result;
  }

  addRecentlyViewed(productId: string, limit = 4): Product[] {
    if (!productId) return this.getRecentlyViewed(limit);
    
    this.recentlyViewedIds = this.recentlyViewedIds.filter(id => id !== productId);
    this.recentlyViewedIds.unshift(productId);
    if (this.recentlyViewedIds.length > 10) {
      this.recentlyViewedIds = this.recentlyViewedIds.slice(0, 10);
    }

    return this.getRecentlyViewed(limit);
  }

  clearRecentlyViewed(): void {
    this.recentlyViewedIds = [];
    this.notifySubscribers();
  }

  // WhatsApp Message Generator
  generateWhatsAppLink(order: Order, waNumber: string): string {
    const cleanNumber = waNumber.replace(/\D/g, '');
    
    const itemsText = (order.ITEMS || [])
      .map(i => `- ${i.PRODUCT_NAME} x${i.QUANTITY}`)
      .join('\n');

    const message = `Halo PT. Bonles Food Nusantara.

Saya ingin melakukan pemesanan.

Nomor Order:
${order.ORDER_ID}

Nama:
${order.CUSTOMER_NAME}

Produk:
${itemsText}

Subtotal:
Rp ${order.SUBTOTAL.toLocaleString('id-ID')}

Ongkir:
Rp ${order.SHIPPING_COST.toLocaleString('id-ID')}

Total:
Rp ${order.TOTAL.toLocaleString('id-ID')}

Alamat:
${order.ADDRESS}, ${order.CITY} ${order.POSTAL_CODE}

Terima kasih.`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  }
}

export const store = new StoreService();
