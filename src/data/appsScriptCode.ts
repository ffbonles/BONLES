export interface ScriptFile {
  filename: string;
  description: string;
  code: string;
}

export const APPS_SCRIPT_FILES: ScriptFile[] = [
  {
    filename: 'Config.gs',
    description: 'Konfigurasi terpusat nama sheet, folder Google Drive, durasi lock, dan parameter sistem.',
    code: `/**
 * PT. BONLES FOOD NUSANTARA
 * File: Config.gs - Konfigurasi Utama Google Apps Script
 */

const CONFIG = {
  // Nama Root Folder di Google Drive
  DRIVE_ROOT_FOLDER: "BONLES FOOD NUSANTARA",
  
  // Nama-nama Sheet Database
  SHEETS: {
    PRODUCTS: "Products",
    CATEGORIES: "Categories",
    ORDERS: "Orders",
    ORDER_ITEMS: "Order_Items",
    CUSTOMERS: "Customers",
    SETTINGS: "Settings",
    BANNERS: "Banners",
    TESTIMONIALS: "Testimonials",
    SYSTEM_LOG: "System_Log"
  },
  
  // Folder Standar Drive
  FOLDERS: {
    PRODUCTS: "Products",
    CATEGORIES: "Categories",
    BANNERS: "Banners",
    TESTIMONIALS: "Testimonials",
    DOCUMENTS: "Documents",
    ARCHIVE: "Archive"
  },
  
  // Pengaturan Concurrency Lock
  LOCK_TIMEOUT_MS: 15000,
  
  // Cache Time to Live (detik)
  CACHE_TTL_SECONDS: 600,
  
  // Maksimal ukuran upload (10MB)
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024
};

function getActiveSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet(sheetName) {
  const ss = getActiveSpreadsheet();
  return ss.getSheetByName(sheetName);
}
`
  },
  {
    filename: 'Logger.gs',
    description: 'Pencatatan log transaksi, audit data, sinkronisasi Google Drive, dan penanganan error ke sheet System_Log.',
    code: `/**
 * PT. BONLES FOOD NUSANTARA
 * File: Logger.gs - Audit & Error Logger
 */

function logSystemEvent(type, action, user, referenceId, message, status) {
  try {
    const sheet = getSheet(CONFIG.SHEETS.SYSTEM_LOG);
    if (!sheet) return;
    
    const timestamp = new Date().toISOString();
    const logId = "LOG-" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd") + "-" + Utilities.getUuid().substring(0, 6).toUpperCase();
    
    sheet.appendRow([
      logId,
      timestamp,
      type || "INFO",
      action || "GENERAL",
      user || "SYSTEM",
      referenceId || "-",
      message || "",
      status || "SUCCESS"
    ]);
  } catch (err) {
    console.error("Gagal mencatat log sistem:", err);
  }
}
`
  },
  {
    filename: 'Utils.gs',
    description: 'Fungsi pembantu sanitasi input, validasi parameter, dan pembentukan JSON response standar.',
    code: `/**
 * PT. BONLES FOOD NUSANTARA
 * File: Utils.gs - Helper & Response Utilities
 */

function jsonResponse(data, success = true, message = "Data berhasil diproses") {
  const output = {
    success: success,
    message: message,
    data: data,
    timestamp: new Date().toISOString()
  };
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonError(message = "Terjadi kesalahan", statusCode = 400) {
  const output = {
    success: false,
    message: message,
    data: null,
    statusCode: statusCode,
    timestamp: new Date().toISOString()
  };
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
}

function parseNumber(val, defaultVal = 0) {
  const num = Number(val);
  return isNaN(num) ? defaultVal : num;
}
`
  },
  {
    filename: 'Database.gs',
    description: 'Inisialisasi otomatis seluruh sheet database, sinkronisasi massal (Bulk Sync), dan manajemen pengaturan.',
    code: `/**
 * PT. BONLES FOOD NUSANTARA
 * File: Database.gs - Skema Spreadsheet, Inisialisasi & Sinkronisasi
 */

const SCHEMAS = {
  [CONFIG.SHEETS.PRODUCTS]: [
    "ID", "SKU", "NAME", "CATEGORY_ID", "CATEGORY_NAME", 
    "CATEGORY_FOLDER_ID", "PRODUCT_FOLDER_ID", "PRICE", "DISCOUNT_PRICE", 
    "WEIGHT", "STOCK", "DESCRIPTION", "COMPOSITION", "NUTRITION", 
    "MAIN_IMAGE_FILE_ID", "MAIN_IMAGE_URL", "GALLERY_1_FILE_ID", "GALLERY_1_URL", 
    "GALLERY_2_FILE_ID", "GALLERY_2_URL", "GALLERY_3_FILE_ID", "GALLERY_3_URL", 
    "FEATURED", "ACTIVE", "CREATED_AT", "UPDATED_AT"
  ],
  [CONFIG.SHEETS.CATEGORIES]: [
    "ID", "NAME", "DESCRIPTION", "IMAGE_FILE_ID", "IMAGE_URL", "ACTIVE", "SORT_ORDER", "CREATED_AT", "UPDATED_AT"
  ],
  [CONFIG.SHEETS.ORDERS]: [
    "ORDER_ID", "ORDER_DATE", "CUSTOMER_ID", "CUSTOMER_NAME", "PHONE", "EMAIL", 
    "ADDRESS", "CITY", "POSTAL_CODE", "PAYMENT_METHOD", "SHIPPING_METHOD", 
    "SHIPPING_COST", "SUBTOTAL", "DISCOUNT", "TOTAL", "STATUS", "NOTES", "CREATED_AT", "UPDATED_AT"
  ],
  [CONFIG.SHEETS.ORDER_ITEMS]: [
    "ORDER_ID", "PRODUCT_ID", "SKU", "PRODUCT_NAME", "PRICE", "QUANTITY", "SUBTOTAL"
  ],
  [CONFIG.SHEETS.CUSTOMERS]: [
    "CUSTOMER_ID", "NAME", "PHONE", "EMAIL", "ADDRESS", "CITY", "POSTAL_CODE", "CREATED_AT", "UPDATED_AT"
  ],
  [CONFIG.SHEETS.SETTINGS]: [
    "SETTING", "VALUE", "DESCRIPTION", "UPDATED_AT"
  ],
  [CONFIG.SHEETS.BANNERS]: [
    "ID", "TITLE", "SUBTITLE", "DESCRIPTION", "IMAGE_FILE_ID", "IMAGE_URL", "BUTTON_TEXT", "BUTTON_LINK", "ACTIVE", "SORT_ORDER", "CREATED_AT", "UPDATED_AT"
  ],
  [CONFIG.SHEETS.TESTIMONIALS]: [
    "ID", "CUSTOMER_NAME", "MESSAGE", "PHOTO_FILE_ID", "PHOTO_URL", "RATING", "ACTIVE", "SORT_ORDER", "CREATED_AT", "UPDATED_AT"
  ],
  [CONFIG.SHEETS.SYSTEM_LOG]: [
    "LOG_ID", "TIMESTAMP", "TYPE", "ACTION", "USER", "REFERENCE_ID", "MESSAGE", "STATUS"
  ]
};

function setupDatabase() {
  const ss = getActiveSpreadsheet();
  
  for (const sheetName in SCHEMAS) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(SCHEMAS[sheetName]);
      sheet.getRange(1, 1, 1, SCHEMAS[sheetName].length)
        .setFontWeight("bold")
        .setBackground("#161618")
        .setFontColor("#C5A059");
      sheet.setFrozenRows(1);
    } else {
      // Pastikan header lengkap
      const lastRow = sheet.getLastRow();
      if (lastRow === 0) {
        sheet.appendRow(SCHEMAS[sheetName]);
        sheet.getRange(1, 1, 1, SCHEMAS[sheetName].length)
          .setFontWeight("bold")
          .setBackground("#161618")
          .setFontColor("#C5A059");
        sheet.setFrozenRows(1);
      }
    }
  }
  
  setupDefaultSettings();
  logSystemEvent("INFO", "SETUP_DATABASE", "SYSTEM", ss.getId(), "Inisialisasi struktur database Google Sheets selesai.", "SUCCESS");
  return "Database berhasil disiapkan.";
}

function setupDefaultSettings() {
  const sheet = getSheet(CONFIG.SHEETS.SETTINGS);
  if (!sheet) return;
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    const now = new Date().toISOString();
    const defaults = [
      ["STORE_NAME", "PT. BONLES FOOD NUSANTARA", "Nama resmi entitas bisnis", now],
      ["TAGLINE", "Snack Tinggi Protein & Oleh-Oleh Khas Nusantara", "Slogan dan positioning produk", now],
      ["WHATSAPP_NUMBER", "6285174333902", "Nomor WhatsApp admin pemesanan (+6285174333902)", now],
      ["STORE_EMAIL", "bonlesff@gmail.com", "Alamat email resmi", now],
      ["STORE_ADDRESS", "Jl. MT. Haryono Gg. Mufakat II No.84 Balikpapan Selatan", "Alamat toko & sentra produksi", now],
      ["CURRENCY", "IDR", "Mata uang transaksi", now],
      ["SHIPPING_ENABLED", "TRUE", "Status layanan pengiriman ekspedisi", now],
      ["DEFAULT_SHIPPING_COST", "15000", "Estimasi ongkir standar", now]
    ];
    
    defaults.forEach(row => sheet.appendRow(row));
  }
}

function getSettings() {
  const sheet = getSheet(CONFIG.SHEETS.SETTINGS);
  if (!sheet) return {};
  
  const rows = sheet.getDataRange().getValues();
  const settings = {};
  for (let i = 1; i < rows.length; i++) {
    const key = rows[i][0];
    const val = rows[i][1];
    if (key) settings[key] = val;
  }
  return settings;
}

function saveSettingsList(settingsList) {
  setupDatabase();
  const sheet = getSheet(CONFIG.SHEETS.SETTINGS);
  if (!sheet || !settingsList || !settingsList.length) return false;
  
  const now = new Date().toISOString();
  const existing = sheet.getDataRange().getValues();
  
  settingsList.forEach(s => {
    const key = s.SETTING || s.setting;
    const val = s.VALUE !== undefined ? s.VALUE : s.value;
    const desc = s.DESCRIPTION || s.description || "";
    
    let found = false;
    for (let i = 1; i < existing.length; i++) {
      if (existing[i][0] === key) {
        sheet.getRange(i + 1, 2).setValue(val);
        sheet.getRange(i + 1, 3).setValue(desc);
        sheet.getRange(i + 1, 4).setValue(now);
        found = true;
        break;
      }
    }
    if (!found) {
      sheet.appendRow([key, val, desc, now]);
    }
  });
  
  logSystemEvent("AUDIT", "SAVE_SETTINGS", "ADMIN", "SETTINGS", "Pengaturan toko berhasil diperbarui", "SUCCESS");
  return true;
}

/**
 * Sinkronisasi Massal (Bulk Sync) seluruh data dari Web App ke Spreadsheet & Drive
 */
function syncAllDataFromApp(payload) {
  setupDatabase();
  setupDriveStructure();
  
  const result = {
    productsSynced: 0,
    categoriesSynced: 0,
    bannersSynced: 0,
    testimonialsSynced: 0,
    settingsSynced: 0,
    ordersSynced: 0
  };
  
  // 1. Categories
  if (payload.categories && Array.isArray(payload.categories)) {
    const catSheet = getSheet(CONFIG.SHEETS.CATEGORIES);
    // Kosongkan baris lama kecuali header
    if (catSheet.getLastRow() > 1) {
      catSheet.getRange(2, 1, catSheet.getLastRow() - 1, SCHEMAS[CONFIG.SHEETS.CATEGORIES].length).clearContent();
    }
    const catRows = payload.categories.map(c => [
      c.ID, c.NAME, c.DESCRIPTION || "", c.IMAGE_FILE_ID || "", c.IMAGE_URL || "",
      c.ACTIVE === true || c.ACTIVE === "TRUE" ? "TRUE" : "FALSE",
      parseNumber(c.SORT_ORDER, 1),
      c.CREATED_AT || new Date().toISOString(),
      c.UPDATED_AT || new Date().toISOString()
    ]);
    if (catRows.length > 0) {
      catSheet.getRange(2, 1, catRows.length, SCHEMAS[CONFIG.SHEETS.CATEGORIES].length).setValues(catRows);
      result.categoriesSynced = catRows.length;
    }
  }
  
  // 2. Products
  if (payload.products && Array.isArray(payload.products)) {
    const prodSheet = getSheet(CONFIG.SHEETS.PRODUCTS);
    if (prodSheet.getLastRow() > 1) {
      prodSheet.getRange(2, 1, prodSheet.getLastRow() - 1, SCHEMAS[CONFIG.SHEETS.PRODUCTS].length).clearContent();
    }
    const prodRows = payload.products.map(p => [
      p.ID, p.SKU, p.NAME, p.CATEGORY_ID, p.CATEGORY_NAME,
      p.CATEGORY_FOLDER_ID || "", p.PRODUCT_FOLDER_ID || "",
      parseNumber(p.PRICE, 0), parseNumber(p.DISCOUNT_PRICE, 0),
      p.WEIGHT || "", parseNumber(p.STOCK, 0),
      p.DESCRIPTION || "", p.COMPOSITION || "", p.NUTRITION || "",
      p.MAIN_IMAGE_FILE_ID || "", p.MAIN_IMAGE_URL || "",
      p.GALLERY_1_FILE_ID || "", p.GALLERY_1_URL || "",
      p.GALLERY_2_FILE_ID || "", p.GALLERY_2_URL || "",
      p.GALLERY_3_FILE_ID || "", p.GALLERY_3_URL || "",
      p.FEATURED === true || p.FEATURED === "TRUE" ? "TRUE" : "FALSE",
      p.ACTIVE === true || p.ACTIVE === "TRUE" ? "TRUE" : "FALSE",
      p.CREATED_AT || new Date().toISOString(),
      p.UPDATED_AT || new Date().toISOString()
    ]);
    if (prodRows.length > 0) {
      prodSheet.getRange(2, 1, prodRows.length, SCHEMAS[CONFIG.SHEETS.PRODUCTS].length).setValues(prodRows);
      result.productsSynced = prodRows.length;
    }
  }
  
  // 3. Banners
  if (payload.banners && Array.isArray(payload.banners)) {
    const bnrSheet = getSheet(CONFIG.SHEETS.BANNERS);
    if (bnrSheet.getLastRow() > 1) {
      bnrSheet.getRange(2, 1, bnrSheet.getLastRow() - 1, SCHEMAS[CONFIG.SHEETS.BANNERS].length).clearContent();
    }
    const bnrRows = payload.banners.map(b => [
      b.ID, b.TITLE, b.SUBTITLE || "", b.DESCRIPTION || "",
      b.IMAGE_FILE_ID || "", b.IMAGE_URL || "",
      b.BUTTON_TEXT || "", b.BUTTON_LINK || "",
      b.ACTIVE === true || b.ACTIVE === "TRUE" ? "TRUE" : "FALSE",
      parseNumber(b.SORT_ORDER, 1),
      b.CREATED_AT || new Date().toISOString(),
      b.UPDATED_AT || new Date().toISOString()
    ]);
    if (bnrRows.length > 0) {
      bnrSheet.getRange(2, 1, bnrRows.length, SCHEMAS[CONFIG.SHEETS.BANNERS].length).setValues(bnrRows);
      result.bannersSynced = bnrRows.length;
    }
  }
  
  // 4. Testimonials
  if (payload.testimonials && Array.isArray(payload.testimonials)) {
    const tsmSheet = getSheet(CONFIG.SHEETS.TESTIMONIALS);
    if (tsmSheet.getLastRow() > 1) {
      tsmSheet.getRange(2, 1, tsmSheet.getLastRow() - 1, SCHEMAS[CONFIG.SHEETS.TESTIMONIALS].length).clearContent();
    }
    const tsmRows = payload.testimonials.map(t => [
      t.ID, t.CUSTOMER_NAME, t.MESSAGE || "",
      t.PHOTO_FILE_ID || "", t.PHOTO_URL || "",
      parseNumber(t.RATING, 5),
      t.ACTIVE === true || t.ACTIVE === "TRUE" ? "TRUE" : "FALSE",
      parseNumber(t.SORT_ORDER, 1),
      t.CREATED_AT || new Date().toISOString(),
      t.UPDATED_AT || new Date().toISOString()
    ]);
    if (tsmRows.length > 0) {
      tsmSheet.getRange(2, 1, tsmRows.length, SCHEMAS[CONFIG.SHEETS.TESTIMONIALS].length).setValues(tsmRows);
      result.testimonialsSynced = tsmRows.length;
    }
  }
  
  // 5. Settings
  if (payload.settings && Array.isArray(payload.settings)) {
    saveSettingsList(payload.settings);
    result.settingsSynced = payload.settings.length;
  }
  
  logSystemEvent("SYNC", "BULK_SYNC", "ADMIN", "ALL_SHEETS", "Sinkronisasi menyeluruh berhasil: " + result.productsSynced + " produk, " + result.categoriesSynced + " kategori.", "SUCCESS");
  return result;
}
`
  },
  {
    filename: 'DriveManager.gs',
    description: 'Manajemen hierarki Google Drive otomatis, upload foto base64, dan pembuatan folder SKU.',
    code: `/**
 * PT. BONLES FOOD NUSANTARA
 * File: DriveManager.gs - Pengelolaan Google Drive
 */

function getOrCreateRootFolder() {
  const folders = DriveApp.getFoldersByName(CONFIG.DRIVE_ROOT_FOLDER);
  if (folders.hasNext()) {
    return folders.next();
  }
  const folder = DriveApp.createFolder(CONFIG.DRIVE_ROOT_FOLDER);
  folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return folder;
}

function setupDriveStructure() {
  const root = getOrCreateRootFolder();
  const subfolders = [
    CONFIG.FOLDERS.PRODUCTS,
    CONFIG.FOLDERS.CATEGORIES,
    CONFIG.FOLDERS.BANNERS,
    CONFIG.FOLDERS.TESTIMONIALS,
    CONFIG.FOLDERS.DOCUMENTS,
    CONFIG.FOLDERS.ARCHIVE
  ];
  
  const folderMap = {};
  subfolders.forEach(name => {
    const existing = root.getFoldersByName(name);
    if (existing.hasNext()) {
      folderMap[name] = existing.next();
    } else {
      const f = root.createFolder(name);
      f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      folderMap[name] = f;
    }
  });
  
  logSystemEvent("INFO", "SETUP_DRIVE", "SYSTEM", root.getId(), "Struktur Google Drive berhasil disiapkan.", "SUCCESS");
  return {
    rootId: root.getId(),
    subfolders: folderMap
  };
}

function getOrCreateCategoryFolder(categoryName) {
  const root = getOrCreateRootFolder();
  let productsFolder;
  const prodFolders = root.getFoldersByName(CONFIG.FOLDERS.PRODUCTS);
  if (prodFolders.hasNext()) {
    productsFolder = prodFolders.next();
  } else {
    productsFolder = root.createFolder(CONFIG.FOLDERS.PRODUCTS);
    productsFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  }
  
  const cleanName = sanitizeString(categoryName) || "Uncategorized";
  const catFolders = productsFolder.getFoldersByName(cleanName);
  if (catFolders.hasNext()) {
    return catFolders.next();
  }
  const f = productsFolder.createFolder(cleanName);
  f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return f;
}

function getOrCreateProductFolder(categoryName, sku) {
  if (!sku) throw new Error("SKU produk wajib diisi");
  const catFolder = getOrCreateCategoryFolder(categoryName);
  const cleanSku = sanitizeString(sku);
  
  const prodFolders = catFolder.getFoldersByName(cleanSku);
  if (prodFolders.hasNext()) {
    return prodFolders.next();
  }
  const f = catFolder.createFolder(cleanSku);
  f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return f;
}

function uploadProductImage(categoryName, sku, base64Data, filename, imageSlot) {
  setupDatabase();
  const targetFolder = getOrCreateProductFolder(categoryName, sku);
  
  let cleanBase64 = base64Data;
  if (cleanBase64.indexOf("base64,") !== -1) {
    cleanBase64 = cleanBase64.split("base64,")[1];
  }
  
  const decoded = Utilities.base64Decode(cleanBase64);
  const blob = Utilities.newBlob(decoded, "image/jpeg", filename || (imageSlot + ".jpg"));
  
  const file = targetFolder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  const fileId = file.getId();
  const directUrl = "https://lh3.googleusercontent.com/d/" + fileId;
  
  logSystemEvent("AUDIT", "UPLOAD_IMAGE", "ADMIN", sku, "Upload " + imageSlot + " berhasil. ID: " + fileId, "SUCCESS");
  
  return {
    fileId: fileId,
    url: directUrl,
    downloadUrl: "https://drive.google.com/uc?export=view&id=" + fileId
  };
}
`
  },
  {
    filename: 'Products.gs',
    description: 'Operasi pembacaan, penambahan, pembaruan, dan penghapusan produk di Spreadsheet.',
    code: `/**
 * PT. BONLES FOOD NUSANTARA
 * File: Products.gs - Logika Produk & Katalog
 */

function getProducts(onlyActive = true) {
  setupDatabase();
  const sheet = getSheet(CONFIG.SHEETS.PRODUCTS);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const products = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const item = {};
    for (let j = 0; j < headers.length; j++) {
      item[headers[j]] = row[j];
    }
    
    if (!onlyActive || item.ACTIVE === true || item.ACTIVE === "TRUE") {
      products.push(item);
    }
  }
  return products;
}

function getProduct(productIdOrSku) {
  const sheet = getSheet(CONFIG.SHEETS.PRODUCTS);
  if (!sheet) return null;
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0] === productIdOrSku || row[1] === productIdOrSku) {
      const item = {};
      for (let j = 0; j < headers.length; j++) {
        item[headers[j]] = row[j];
      }
      return item;
    }
  }
  return null;
}

function saveProductToSheet(prod, imageBase64) {
  setupDatabase();
  const sheet = getSheet(CONFIG.SHEETS.PRODUCTS);
  if (!sheet || !prod) throw new Error("Data produk tidak valid");
  
  // Jika ada upload gambar baru dalam bentuk base64
  let mainImgUrl = prod.MAIN_IMAGE_URL || "";
  let mainImgId = prod.MAIN_IMAGE_FILE_ID || "";
  
  if (imageBase64 && imageBase64.length > 50) {
    try {
      const uploaded = uploadProductImage(prod.CATEGORY_NAME || "Snack", prod.SKU, imageBase64, prod.SKU + "-main.jpg", "main");
      if (uploaded && uploaded.url) {
        mainImgUrl = uploaded.url;
        mainImgId = uploaded.fileId;
      }
    } catch (e) {
      console.warn("Gagal upload gambar ke Drive:", e);
    }
  }
  
  const data = sheet.getDataRange().getValues();
  const now = new Date().toISOString();
  const id = prod.ID || ("PRD-" + Utilities.formatString("%04d", Math.max(1, data.length)));
  
  const rowData = [
    id,
    prod.SKU,
    prod.NAME,
    prod.CATEGORY_ID || "CAT-001",
    prod.CATEGORY_NAME || "Snack",
    prod.CATEGORY_FOLDER_ID || "",
    prod.PRODUCT_FOLDER_ID || "",
    parseNumber(prod.PRICE, 0),
    parseNumber(prod.DISCOUNT_PRICE, 0),
    prod.WEIGHT || "",
    parseNumber(prod.STOCK, 0),
    prod.DESCRIPTION || "",
    prod.COMPOSITION || "",
    prod.NUTRITION || "",
    mainImgId,
    mainImgUrl,
    prod.GALLERY_1_FILE_ID || "",
    prod.GALLERY_1_URL || "",
    prod.GALLERY_2_FILE_ID || "",
    prod.GALLERY_2_URL || "",
    prod.GALLERY_3_FILE_ID || "",
    prod.GALLERY_3_URL || "",
    prod.FEATURED === true || prod.FEATURED === "TRUE" ? "TRUE" : "FALSE",
    prod.ACTIVE === true || prod.ACTIVE === "TRUE" ? "TRUE" : "FALSE",
    prod.CREATED_AT || now,
    now
  ];
  
  let foundRow = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id || data[i][1] === prod.SKU) {
      foundRow = i + 1;
      break;
    }
  }
  
  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, rowData.length).setValues([rowData]);
    logSystemEvent("AUDIT", "UPDATE_PRODUCT", "ADMIN", prod.SKU, "Produk " + prod.NAME + " berhasil diperbarui", "SUCCESS");
  } else {
    sheet.appendRow(rowData);
    logSystemEvent("AUDIT", "CREATE_PRODUCT", "ADMIN", prod.SKU, "Produk baru " + prod.NAME + " berhasil dibuat", "SUCCESS");
  }
  
  return { ...prod, ID: id, MAIN_IMAGE_URL: mainImgUrl, MAIN_IMAGE_FILE_ID: mainImgId, UPDATED_AT: now };
}
`
  },
  {
    filename: 'Orders.gs',
    description: 'Pemrosesan pesanan terisolasi dengan LockService, validasi harga server-side, pemotongan stok aman, dan pembuatan Order ID.',
    code: `/**
 * PT. BONLES FOOD NUSANTARA
 * File: Orders.gs - Order Processing & LockService Concurrency
 */

function generateOrderId() {
  const dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd");
  const randomSuffix = Utilities.formatString("%04d", Math.floor(Math.random() * 9000) + 1000);
  return "ORD-" + dateStr + "-" + randomSuffix;
}

function getOrders() {
  setupDatabase();
  const sheet = getSheet(CONFIG.SHEETS.ORDERS);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const h = data[0];
  const orders = [];
  for (let i = 1; i < data.length; i++) {
    const o = {};
    for (let j = 0; j < h.length; j++) o[h[j]] = data[i][j];
    orders.push(o);
  }
  return orders;
}

function updateOrderStatusInSheet(orderId, newStatus) {
  setupDatabase();
  const sheet = getSheet(CONFIG.SHEETS.ORDERS);
  if (!sheet) return false;
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === orderId) {
      sheet.getRange(i + 1, 16).setValue(newStatus);
      sheet.getRange(i + 1, 19).setValue(new Date().toISOString());
      logSystemEvent("AUDIT", "UPDATE_ORDER_STATUS", "ADMIN", orderId, "Status diubah menjadi " + newStatus, "SUCCESS");
      return true;
    }
  }
  return false;
}

function createOrder(orderPayload) {
  setupDatabase();
  const lock = LockService.getScriptLock();
  
  try {
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);
    
    const prodSheet = getSheet(CONFIG.SHEETS.PRODUCTS);
    const orderSheet = getSheet(CONFIG.SHEETS.ORDERS);
    const itemsSheet = getSheet(CONFIG.SHEETS.ORDER_ITEMS);
    const custSheet = getSheet(CONFIG.SHEETS.CUSTOMERS);
    
    const customer = orderPayload.customer;
    const rawItems = orderPayload.items || [];
    
    if (!customer || !customer.name || !customer.phone) {
      throw new Error("Data pelanggan (nama dan nomor WhatsApp) tidak lengkap.");
    }
    if (rawItems.length === 0) {
      throw new Error("Keranjang belanja kosong.");
    }
    
    const prodData = prodSheet.getDataRange().getValues();
    const prodHeaders = prodData[0];
    const idIdx = prodHeaders.indexOf("ID");
    const skuIdx = prodHeaders.indexOf("SKU");
    const nameIdx = prodHeaders.indexOf("NAME");
    const priceIdx = prodHeaders.indexOf("PRICE");
    const discIdx = prodHeaders.indexOf("DISCOUNT_PRICE");
    const stockIdx = prodHeaders.indexOf("STOCK");
    const activeIdx = prodHeaders.indexOf("ACTIVE");
    
    let subtotal = 0;
    const validatedItems = [];
    const stockUpdates = [];
    
    for (const item of rawItems) {
      let foundRow = -1;
      for (let r = 1; r < prodData.length; r++) {
        if (prodData[r][idIdx] === item.product_id || prodData[r][skuIdx] === item.sku) {
          foundRow = r;
          break;
        }
      }
      
      if (foundRow === -1) {
        throw new Error("Produk dengan ID " + (item.product_id || item.sku) + " tidak ditemukan.");
      }
      
      const rowData = prodData[foundRow];
      const isActive = rowData[activeIdx] === true || rowData[activeIdx] === "TRUE";
      const currentStock = parseNumber(rowData[stockIdx], 0);
      const reqQty = parseNumber(item.quantity, 1);
      
      if (!isActive) {
        throw new Error("Produk " + rowData[nameIdx] + " sedang tidak aktif.");
      }
      if (currentStock < reqQty) {
        throw new Error("Stok untuk produk " + rowData[nameIdx] + " tidak mencukupi (sisa: " + currentStock + ").");
      }
      
      const regularPrice = parseNumber(rowData[priceIdx], 0);
      const discountPrice = parseNumber(rowData[discIdx], 0);
      const effectivePrice = (discountPrice > 0 && discountPrice < regularPrice) ? discountPrice : regularPrice;
      const lineSubtotal = effectivePrice * reqQty;
      
      subtotal += lineSubtotal;
      validatedItems.push({
        productId: rowData[idIdx],
        sku: rowData[skuIdx],
        productName: rowData[nameIdx],
        price: effectivePrice,
        quantity: reqQty,
        subtotal: lineSubtotal
      });
      
      stockUpdates.push({
        row: foundRow + 1,
        col: stockIdx + 1,
        newStock: currentStock - reqQty
      });
    }
    
    const settings = getSettings();
    const defaultShipping = parseNumber(settings.DEFAULT_SHIPPING_COST, 15000);
    const shippingCost = (orderPayload.shipping_cost !== undefined) ? parseNumber(orderPayload.shipping_cost, defaultShipping) : defaultShipping;
    const discount = 0;
    const total = subtotal - discount + shippingCost;
    
    const orderId = generateOrderId();
    const now = new Date().toISOString();
    
    let customerId = "CUST-" + Utilities.formatString("%04d", Math.max(1, custSheet.getLastRow()));
    let existingCustRow = -1;
    const custData = custSheet.getDataRange().getValues();
    for (let c = 1; c < custData.length; c++) {
      if (custData[c][2] === customer.phone || (customer.email && custData[c][3] === customer.email)) {
        existingCustRow = c;
        customerId = custData[c][0];
        break;
      }
    }
    
    if (existingCustRow === -1) {
      custSheet.appendRow([
        customerId,
        customer.name,
        customer.phone,
        customer.email || "",
        customer.address || "",
        customer.city || "",
        customer.postal_code || "",
        now,
        now
      ]);
    } else {
      custSheet.getRange(existingCustRow + 1, 5).setValue(customer.address || "");
      custSheet.getRange(existingCustRow + 1, 6).setValue(customer.city || "");
      custSheet.getRange(existingCustRow + 1, 9).setValue(now);
    }
    
    orderSheet.appendRow([
      orderId,
      now,
      customerId,
      customer.name,
      customer.phone,
      customer.email || "",
      customer.address || "",
      customer.city || "",
      customer.postal_code || "",
      orderPayload.payment_method || "Transfer Bank",
      orderPayload.shipping_method || "Reguler",
      shippingCost,
      subtotal,
      discount,
      total,
      "PENDING",
      customer.notes || "",
      now,
      now
    ]);
    
    validatedItems.forEach(vi => {
      itemsSheet.appendRow([
        orderId,
        vi.productId,
        vi.sku,
        vi.productName,
        vi.price,
        vi.quantity,
        vi.subtotal
      ]);
    });
    
    stockUpdates.forEach(su => {
      prodSheet.getRange(su.row, su.col).setValue(su.newStock);
    });
    
    logSystemEvent("AUDIT", "CREATE_ORDER", "CUSTOMER", orderId, "Pesanan baru dibuat senilai Rp " + total, "SUCCESS");
    
    return {
      orderId: orderId,
      orderDate: now,
      subtotal: subtotal,
      shippingCost: shippingCost,
      discount: discount,
      total: total,
      status: "PENDING",
      items: validatedItems
    };
    
  } catch (err) {
    logSystemEvent("ERROR", "CREATE_ORDER", "CUSTOMER", "-", "Gagal membuat pesanan: " + err.message, "FAILED");
    throw err;
  } finally {
    lock.releaseLock();
  }
}
`
  },
  {
    filename: 'Security.gs',
    description: 'Autentikasi server-side admin menggunakan Script Properties, hash SHA-256, token sementara di CacheService, dan validasi role.',
    code: `/**
 * PT. BONLES FOOD NUSANTARA
 * File: Security.gs - Server-side Admin Authentication
 *
 * PENTING:
 * Jangan simpan username/password admin di repository.
 * Jalankan setBonlesAdminUser(...) sekali dari Apps Script editor untuk membuat akun.
 */

const SECURITY_CONFIG = {
  USERS_PROPERTY: 'BONLES_ADMIN_USERS_JSON',
  TOKEN_PREFIX: 'BONLES_ADMIN_SESSION_',
  TOKEN_TTL_SECONDS: 6 * 60 * 60,
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_WINDOW_SECONDS: 10 * 60
};

function sha256Hex(value) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(value),
    Utilities.Charset.UTF_8
  );
  return bytes.map(function(b) {
    const n = b < 0 ? b + 256 : b;
    return ('0' + n.toString(16)).slice(-2);
  }).join('');
}

function constantTimeEqual(a, b) {
  a = String(a || '');
  b = String(b || '');
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function normalizeAdminUsername(value) {
  return String(value || '').trim().toLowerCase();
}

function getAdminUsers() {
  const raw = PropertiesService.getScriptProperties().getProperty(SECURITY_CONFIG.USERS_PROPERTY);
  if (!raw) return [];
  try {
    const users = JSON.parse(raw);
    return Array.isArray(users) ? users : [];
  } catch (err) {
    console.error('BONLES_ADMIN_USERS_JSON invalid:', err);
    return [];
  }
}

function saveAdminUsers(users) {
  PropertiesService.getScriptProperties().setProperty(
    SECURITY_CONFIG.USERS_PROPERTY,
    JSON.stringify(users)
  );
}

function setBonlesAdminUser(username, password, email, role, name) {
  username = normalizeAdminUsername(username);
  if (!username || !password || String(password).length < 10) {
    throw new Error('Username dan password wajib diisi; password minimal 10 karakter.');
  }
  const users = getAdminUsers().filter(function(u) {
    return normalizeAdminUsername(u.username) !== username;
  });
  users.push({
    username: username,
    email: String(email || username),
    role: String(role || 'Administrator'),
    name: String(name || 'Administrator Bonles'),
    passwordHash: sha256Hex(password),
    active: true
  });
  saveAdminUsers(users);
  return 'Admin berhasil disimpan untuk: ' + username;
}

function disableBonlesAdminUser(username) {
  username = normalizeAdminUsername(username);
  const users = getAdminUsers();
  let changed = false;
  users.forEach(function(u) {
    if (normalizeAdminUsername(u.username) === username) {
      u.active = false;
      changed = true;
    }
  });
  if (changed) saveAdminUsers(users);
  return changed;
}

function getLoginThrottleKey(username) {
  return 'BONLES_LOGIN_FAIL_' + sha256Hex(normalizeAdminUsername(username)).slice(0, 24);
}

function authenticateAdmin(username, password) {
  username = normalizeAdminUsername(username);
  if (!username || !password) throw new Error('Kredensial tidak lengkap.');

  const cache = CacheService.getScriptCache();
  const throttleKey = getLoginThrottleKey(username);
  const attempts = Number(cache.get(throttleKey) || 0);
  if (attempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
    throw new Error('Terlalu banyak percobaan login. Coba lagi beberapa menit lagi.');
  }

  const passwordHash = sha256Hex(password);
  const user = getAdminUsers().find(function(u) {
    return u.active !== false && normalizeAdminUsername(u.username) === username;
  });

  if (!user || !constantTimeEqual(user.passwordHash, passwordHash)) {
    cache.put(throttleKey, String(attempts + 1), SECURITY_CONFIG.LOGIN_WINDOW_SECONDS);
    throw new Error('Username/email atau password tidak valid.');
  }

  cache.remove(throttleKey);
  const token = Utilities.getUuid() + '-' + Utilities.getUuid();
  cache.put(SECURITY_CONFIG.TOKEN_PREFIX + token, JSON.stringify({
    username: username,
    email: user.email,
    role: user.role,
    name: user.name,
    issuedAt: new Date().toISOString()
  }), SECURITY_CONFIG.TOKEN_TTL_SECONDS);

  logSystemEvent('AUDIT', 'ADMIN_LOGIN', user.email, '-', 'Login admin berhasil.', 'SUCCESS');
  return {
    token: token,
    email: user.email,
    role: user.role,
    name: user.name
  };
}

function getAdminSession(token) {
  if (!token) return null;
  const raw = CacheService.getScriptCache().get(SECURITY_CONFIG.TOKEN_PREFIX + String(token));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function requireAdmin(token) {
  const session = getAdminSession(token);
  if (!session) throw new Error('Sesi admin tidak valid atau sudah kedaluwarsa. Silakan login kembali.');
  return session;
}

function revokeAdminToken(token) {
  if (token) CacheService.getScriptCache().remove(SECURITY_CONFIG.TOKEN_PREFIX + String(token));
}
` 
  },
  {
    filename: 'Code.gs',
    description: 'Dispatcher utama API GET & POST untuk melayani Web App, sinkronisasi massal, dan inisialisasi sistem.',
    code: `/**
 * PT. BONLES FOOD NUSANTARA
 * File: Code.gs - Secure API Routing Entrypoint
 */

function getRowsAsObjects(sheetName) {
  const sheet = getSheet(sheetName);
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  const headers = values[0];
  return values.slice(1).map(function(row) {
    const obj = {};
    headers.forEach(function(key, index) { obj[key] = row[index]; });
    return obj;
  });
}

function upsertSheetObject(sheetName, object, columns) {
  setupDatabase();
  const sheet = getSheet(sheetName);
  if (!sheet) throw new Error('Sheet tidak ditemukan: ' + sheetName);
  const now = new Date().toISOString();
  const values = sheet.getDataRange().getValues();
  const id = String(object.ID || '');
  let rowIndex = -1;
  if (id && values.length > 1) {
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][0]) === id) { rowIndex = i + 1; break; }
    }
  }
  const row = columns.map(function(column) {
    if (column === 'CREATED_AT') return object.CREATED_AT || now;
    if (column === 'UPDATED_AT') return now;
    const value = object[column];
    if (column === 'ACTIVE') return value === true || value === 'TRUE' ? 'TRUE' : 'FALSE';
    return value === undefined || value === null ? '' : value;
  });
  if (rowIndex > 0) sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  else sheet.appendRow(row);
  return object;
}

function saveBannerToSheet(banner) {
  return upsertSheetObject(CONFIG.SHEETS.BANNERS, banner, SCHEMAS[CONFIG.SHEETS.BANNERS]);
}

function saveTestimonialToSheet(testimonial) {
  return upsertSheetObject(CONFIG.SHEETS.TESTIMONIALS, testimonial, SCHEMAS[CONFIG.SHEETS.TESTIMONIALS]);
}

function getPublicData() {
  setupDatabase();
  const settings = getSettings();
  const publicSettingKeys = [
    'WHATSAPP_NUMBER', 'STORE_EMAIL', 'STORE_ADDRESS',
    'DEFAULT_SHIPPING_COST', 'STORE_NAME', 'STORE_DESCRIPTION',
    'INSTAGRAM_URL', 'FACEBOOK_URL', 'TIKTOK_URL'
  ];
  const safeSettings = (Array.isArray(settings) ? settings : []).filter(function(item) {
    return publicSettingKeys.indexOf(String(item.SETTING || '')) >= 0;
  });
  return {
    products: getProducts(true),
    categories: getRowsAsObjects(CONFIG.SHEETS.CATEGORIES).filter(function(x) { return x.ACTIVE === true || x.ACTIVE === 'TRUE'; }),
    settings: safeSettings,
    banners: getRowsAsObjects(CONFIG.SHEETS.BANNERS).filter(function(x) { return x.ACTIVE === true || x.ACTIVE === 'TRUE'; }),
    testimonials: getRowsAsObjects(CONFIG.SHEETS.TESTIMONIALS).filter(function(x) { return x.ACTIVE === true || x.ACTIVE === 'TRUE'; })
  };
}

function getAdminData(token) {
  const session = requireAdmin(token);
  return {
    session: session,
    products: getProducts(false),
    categories: getRowsAsObjects(CONFIG.SHEETS.CATEGORIES),
    settings: getSettings(),
    banners: getRowsAsObjects(CONFIG.SHEETS.BANNERS),
    testimonials: getRowsAsObjects(CONFIG.SHEETS.TESTIMONIALS),
    orders: getOrders(),
    customers: getRowsAsObjects(CONFIG.SHEETS.CUSTOMERS),
    logs: getRowsAsObjects(CONFIG.SHEETS.SYSTEM_LOG).slice(-200)
  };
}

function getDashboardSummarySecure(token) {
  const session = requireAdmin(token);
  setupDatabase();
  const prods = getProducts(false);
  const orderData = getSheet(CONFIG.SHEETS.ORDERS).getDataRange().getValues();
  let totalSales = 0;
  let pendingOrders = 0;
  for (let i = 1; i < orderData.length; i++) {
    totalSales += parseNumber(orderData[i][14], 0);
    if (String(orderData[i][15]) === 'PENDING') pendingOrders++;
  }
  return {
    totalProducts: prods.length,
    activeProducts: prods.filter(function(p) { return p.ACTIVE === true || p.ACTIVE === 'TRUE'; }).length,
    lowStockProducts: prods.filter(function(p) { const n = parseNumber(p.STOCK, 0); return n > 0 && n <= 5; }).length,
    outOfStockProducts: prods.filter(function(p) { return parseNumber(p.STOCK, 0) === 0; }).length,
    totalOrders: Math.max(0, orderData.length - 1),
    pendingOrders: pendingOrders,
    totalSales: totalSales,
    admin: { email: session.email, role: session.role, name: session.name }
  };
}

function doGet(e) {
  try {
    const action = e && e.parameter && e.parameter.action ? e.parameter.action : 'publicData';
    switch (action) {
      case 'publicData':
      case 'getProducts':
        return jsonResponse(getPublicData(), true, 'Katalog publik berhasil dimuat');
      case 'getProduct':
        const id = e.parameter.id || e.parameter.sku;
        const prod = getProduct(id);
        return prod && (prod.ACTIVE === true || prod.ACTIVE === 'TRUE')
          ? jsonResponse(prod, true)
          : jsonError('Produk tidak ditemukan', 404);
      case 'adminData':
        return jsonResponse(getAdminData(e.parameter.token), true, 'Data admin berhasil dimuat');
      case 'getDashboardSummary':
        return jsonResponse(getDashboardSummarySecure(e.parameter.token), true, 'Dashboard summary berhasil dimuat');
      default:
        return jsonError('Action GET tidak valid.', 400);
    }
  } catch (err) {
    const message = err && err.message ? err.message : 'Internal Server Error';
    const status = message.indexOf('Sesi admin') >= 0 ? 401 : 500;
    return jsonError(message, status);
  }
}

function doPost(e) {
  try {
    let postData = {};
    if (e && e.postData && e.postData.contents) {
      try { postData = JSON.parse(e.postData.contents); }
      catch (err) { postData = e.parameter || {}; }
    } else if (e && e.parameter) {
      postData = e.parameter;
    }

    const action = String(postData.action || '');
    switch (action) {
      case 'ping':
        return jsonResponse({ status: 'ok' }, true, 'Web App aktif.');
      case 'publicData':
        return jsonResponse(getPublicData(), true, 'Katalog publik berhasil dimuat');
      case 'adminLogin':
        return jsonResponse(authenticateAdmin(postData.username, postData.password), true, 'Autentikasi admin berhasil');
      case 'adminLogout':
        revokeAdminToken(postData.token);
        return jsonResponse({ loggedOut: true }, true, 'Sesi admin diakhiri');
      case 'createOrder':
        // Public endpoint: pricing, stock, and totals are recalculated server-side by createOrder().
        return jsonResponse(createOrder(postData), true, 'Pesanan berhasil dibuat dan dicatat');

      case 'syncAll':
      case 'pullAllData':
        return jsonResponse(getAdminData(postData.token), true, 'Data admin berhasil dimuat');
      case 'syncAllData':
        requireAdmin(postData.token);
        return jsonResponse(syncAllDataFromApp(postData.payload || postData), true, 'Seluruh data berhasil disinkronkan');
      case 'init':
        requireAdmin(postData.token);
        setupDatabase();
        setupDriveStructure();
        return jsonResponse({ status: 'initialized' }, true, 'Database & Drive berhasil diinisialisasi');
      case 'saveProduct':
        requireAdmin(postData.token);
        return jsonResponse(saveProductToSheet(postData.product, postData.imageBase64), true, 'Produk berhasil disimpan');
      case 'saveCategory':
        requireAdmin(postData.token);
        setupDatabase();
        const catSheet = getSheet(CONFIG.SHEETS.CATEGORIES);
        const cat = postData.category;
        const now = new Date().toISOString();
        const catData = catSheet.getDataRange().getValues();
        let catFound = -1;
        for (let i = 1; i < catData.length; i++) {
          if (catData[i][0] === cat.ID || catData[i][1] === cat.NAME) { catFound = i + 1; break; }
        }
        const catRow = [cat.ID, cat.NAME, cat.DESCRIPTION || '', cat.IMAGE_FILE_ID || '', cat.IMAGE_URL || '',
          cat.ACTIVE === true || cat.ACTIVE === 'TRUE' ? 'TRUE' : 'FALSE', parseNumber(cat.SORT_ORDER, 1), cat.CREATED_AT || now, now];
        if (catFound > 0) catSheet.getRange(catFound, 1, 1, catRow.length).setValues([catRow]);
        else catSheet.appendRow(catRow);
        return jsonResponse(cat, true, 'Kategori berhasil disimpan');
      case 'saveSettings':
        requireAdmin(postData.token);
        saveSettingsList(postData.settings);
        return jsonResponse({ updated: true }, true, 'Pengaturan berhasil disimpan');
      case 'saveBanner':
        requireAdmin(postData.token);
        return jsonResponse(saveBannerToSheet(postData.banner), true, 'Banner berhasil disimpan');
      case 'saveTestimonial':
        requireAdmin(postData.token);
        return jsonResponse(saveTestimonialToSheet(postData.testimonial), true, 'Testimoni berhasil disimpan');
      case 'uploadImage':
        requireAdmin(postData.token);
        return jsonResponse(uploadProductImage(postData.categoryName, postData.sku, postData.base64, postData.filename, postData.imageSlot || 'main'), true, 'Foto berhasil diunggah');
      case 'updateOrderStatus':
        requireAdmin(postData.token);
        return jsonResponse({ updated: updateOrderStatusInSheet(postData.orderId, postData.status) }, true, 'Status pesanan diperbarui');
      default:
        return jsonError('Action POST tidak valid.', 400);
    }
  } catch (err) {
    const message = err && err.message ? err.message : 'Gagal memproses request POST';
    const status = message.indexOf('Sesi admin') >= 0 ? 401 : 500;
    return jsonError(message, status);
  }
}

function initializeBonlesSystem() {
  setupDatabase();
  setupDriveStructure();
  logSystemEvent('INFO', 'INITIALIZE_SYSTEM', 'SYSTEM', 'ALL', 'Inisialisasi sistem lengkap berhasil dijalankan.', 'SUCCESS');
  return 'Inisialisasi PT. Bonles Food Nusantara berhasil.';
}

`
  }
];

export function getCombinedAppsScriptCode(): string {
  return APPS_SCRIPT_FILES.map(f => 
    `// ==========================================\n// FILE: ${f.filename}\n// ${f.description}\n// ==========================================\n\n${f.code.trim()}`
  ).join('\n\n\n');
}
