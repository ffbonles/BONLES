import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Sparkles, Search, UserCheck, Menu, X, 
  Home, LayoutGrid, BookOpen, ShieldCheck, MessageCircle, 
  MapPin, Mail, ChevronRight, ArrowRight, Flame, HeartHandshake,
  Database, RefreshCw
} from 'lucide-react';
import { BonlesLogo } from './BonlesLogo';
import { store } from '../services/store';
import { Category } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
  onToggleAdmin: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateHome: () => void;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  categories?: Category[];
  onSelectCategory?: (categoryId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  isAdmin,
  isAuthenticated,
  onToggleAdmin,
  searchQuery,
  onSearchChange,
  onNavigateHome,
  isMenuOpen,
  onToggleMenu,
  categories = [],
  onSelectCategory,
}) => {
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>(() => store.getSettingsMap());
  const [gasStatus, setGasStatus] = useState(() => store.getGasStatus());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setSettings(store.getSettingsMap());
      setGasStatus(store.getGasStatus());
    });
    return unsubscribe;
  }, []);

  const tagline = settings['TAGLINE'] || 'Snack Tinggi Protein & Oleh-Oleh Khas Nusantara';
  const promoText = settings['PROMO_BANNER_TEXT'] || 'Pemesanan Langsung Terintegrasi WhatsApp';
  const waNumber = settings['WHATSAPP_NUMBER'] || '6285174333902';
  const email = settings['STORE_EMAIL'] || 'bonlesff@gmail.com';
  const address = settings['STORE_ADDRESS'] || 'Jl. MT. Haryono Gg. Mufakat II No.84 Balikpapan Selatan';

  const cleanWa = waNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    'Halo PT. BONLES FOOD NUSANTARA, saya ingin memesan produk camilan khas.'
  )}`;

  const scrollToSection = (sectionId: string) => {
    if (isMenuOpen) onToggleMenu();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-orange-200/80 shadow-sm shadow-orange-500/5">
      {/* Top micro banner - Customer-friendly messaging & Live Spreadsheet Sync */}
      <div className="bg-gradient-to-r from-[#FF5500] via-[#FF7B00] to-[#FFAA00] border-b border-orange-300/40 py-1.5 px-3 text-xs tracking-wider text-white font-medium flex items-center justify-between sm:justify-center gap-2 shadow-xs">
        <div className="flex items-center gap-2 truncate">
          <Sparkles className="w-3.5 h-3.5 text-yellow-200 shrink-0" />
          <span className="text-white font-bold text-[11px] sm:text-xs truncate drop-shadow-xs">{tagline}</span>
          <span className="hidden md:inline text-white/40">•</span>
          <span className="hidden md:inline text-white/95 text-[11px] truncate font-medium">{promoText}</span>
        </div>

        {/* Live Spreadsheet Status Indicator for all browsers */}
        <div className="flex items-center gap-1.5 shrink-0 pl-2">
          {gasStatus.isSyncing ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20 text-white border border-white/30 backdrop-blur-xs">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              <span className="hidden sm:inline">Memuat Spreadsheet...</span>
            </span>
          ) : gasStatus.connected ? (
            <span 
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-900/30 text-white border border-emerald-300/60"
              title={`Database tersinkronisasi via Google Apps Script (${gasStatus.lastSyncTime || 'Aktif'})`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
              <span>Spreadsheet Live</span>
            </span>
          ) : (
            <button
              onClick={() => store.pullFromCloudSpreadsheet('HEADER_RETRY')}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20 hover:bg-white/30 text-white border border-white/40 transition-colors cursor-pointer"
              title="Database siap: klik untuk muat data langsung dari spreadsheet"
            >
              <Database className="w-2.5 h-2.5 text-yellow-200" />
              <span className="hidden sm:inline">Spreadsheet GAS</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Hamburger / Push Dropdown Menu Button + Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Push Dropdown Trigger Icon Button */}
          <button
            onClick={onToggleMenu}
            id="btn-header-menu"
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
              isMenuOpen
                ? 'bg-gradient-to-r from-[#FF5500] to-[#FF8800] text-white border-[#FF7B00] shadow-md shadow-orange-500/30'
                : 'bg-orange-50 hover:bg-orange-100/80 text-[#E05A00] hover:text-[#C44E00] border-orange-200 hover:border-orange-400'
            }`}
            aria-label={isMenuOpen ? 'Tutup Menu Dropdown' : 'Buka Menu Push Dropdown'}
            title="Menu Navigasi Lengkap"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Official Brand Logo */}
          <button
            onClick={onNavigateHome}
            className="flex items-center text-left focus:outline-none cursor-pointer"
            aria-label="Kembali ke Beranda Bonles Food"
          >
            <div className="hidden sm:block">
              <BonlesLogo size="md" variant="horizontal" lightBg={true} />
            </div>
            <div className="sm:hidden">
              <BonlesLogo size="sm" variant="horizontal" lightBg={true} />
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          <button
            onClick={() => scrollToSection('catalog')}
            className="text-xs font-sans uppercase tracking-widest text-[#4A2D1B] hover:text-[#FF5500] transition-colors cursor-pointer flex items-center gap-1.5 py-2 px-1 font-bold"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#FF7B00]" />
            <span>Katalog Snack</span>
          </button>
          <button
            onClick={() => scrollToSection('our-story')}
            className="text-xs font-sans uppercase tracking-widest text-[#4A2D1B] hover:text-[#FF5500] transition-colors cursor-pointer flex items-center gap-1.5 py-2 px-1 font-bold"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FF7B00]" />
            <span>Our Story</span>
          </button>
          <button
            onClick={() => scrollToSection('about-section')}
            className="text-xs font-sans uppercase tracking-widest text-[#4A2D1B] hover:text-[#FF5500] transition-colors cursor-pointer flex items-center gap-1.5 py-2 px-1 font-bold"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF7B00]" />
            <span>Tentang Kami</span>
          </button>
        </nav>

        {/* Center-Right: Desktop Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-xs mx-2 relative">
          <Search className="w-4 h-4 text-[#A88874] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari camilan kemasan..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#FFF8EE] border border-orange-200/90 rounded-xl pl-10 pr-8 py-2 text-xs text-[#2B1408] placeholder-[#9E8270] focus:outline-none focus:border-[#FF7B00] focus:ring-2 focus:ring-orange-400/20 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-xs text-[#A88874] hover:text-[#2B1408]"
              aria-label="Hapus Pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Actions: Search Icon (mobile), WhatsApp Direct, Cart */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Mobile Search Toggle Icon Button */}
          <button
            onClick={() => setIsMobileSearchActive(!isMobileSearchActive)}
            className={`md:hidden w-10 h-10 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
              isMobileSearchActive
                ? 'bg-gradient-to-r from-[#FF5500] to-[#FFAA00] text-white border-transparent'
                : 'bg-orange-50 text-[#D95A00] border-orange-200'
            }`}
            aria-label="Cari Produk"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Quick WhatsApp Contact Icon Button (visible on tablet/desktop) */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300/80 text-emerald-700 px-3 py-2 rounded-xl text-xs font-bold tracking-wide transition-all shadow-xs"
            title="Chat Langsung via WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span className="hidden xl:inline">CS WhatsApp</span>
          </a>

          {/* Admin Toggle Button (if logged in) */}
          {isAuthenticated && (
            <button
              onClick={onToggleAdmin}
              id="btn-admin-toggle"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs tracking-wider uppercase font-bold transition-all ${
                isAdmin
                  ? 'bg-gradient-to-r from-[#FF5500] to-[#E63946] text-white border-orange-400 shadow-md shadow-orange-500/25'
                  : 'bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100'
              }`}
              title={isAdmin ? 'Kembali ke Tampilan Web' : 'Buka Dashboard Admin'}
            >
              <UserCheck className="w-4 h-4 text-orange-600" />
              <span className="hidden sm:inline">
                {isAdmin ? 'Mode Web' : 'Admin'}
              </span>
            </button>
          )}

          {/* Shopping Cart Icon Button */}
          <button
            onClick={onOpenCart}
            id="btn-open-cart"
            className="relative flex items-center gap-2 bg-gradient-to-r from-[#FF5500] via-[#FF7B00] to-[#FFAA00] hover:from-[#FF4500] hover:to-[#FF9500] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs tracking-wider uppercase font-bold transition-all shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 cursor-pointer active:scale-95"
            aria-label="Buka Keranjang Belanja"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span className="hidden sm:inline font-bold">Keranjang</span>
            {cartCount > 0 && (
              <span className="bg-white text-[#FF5500] text-[11px] font-black px-1.5 py-0.5 min-w-[20px] h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Drawer (collapsible under header) */}
      {isMobileSearchActive && (
        <div className="md:hidden bg-[#FFF9F0] border-b border-orange-200 px-3 py-2.5 flex items-center gap-2 animate-fadeIn">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9E8270] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari keripik tempe, amplang, pisang..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
              className="w-full bg-white border border-orange-200 rounded-xl pl-9 pr-8 py-2 text-xs text-[#2B1408] placeholder-[#9E8270] focus:outline-none focus:border-[#FF7B00]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#9E8270] hover:text-[#2B1408] p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => {
              setIsMobileSearchActive(false);
              scrollToSection('catalog');
            }}
            className="bg-gradient-to-r from-[#FF5500] to-[#FFAA00] text-white text-xs px-3.5 py-2 rounded-xl font-bold shrink-0 shadow-sm"
          >
            Cari
          </button>
        </div>
      )}

      {/* PUSH DROP-DOWN MENU CONTAINER (Slides down directly from header) */}
      {isMenuOpen && (
        <div
          id="push-dropdown-menu"
          className="border-b-2 border-orange-400 bg-[#FFFDF9]/98 backdrop-blur-2xl shadow-2xl transition-all duration-300 overflow-hidden animate-slide-down"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
            {/* Header of Dropdown */}
            <div className="flex items-center justify-between pb-3 border-b border-orange-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 border border-orange-300/60 flex items-center justify-center">
                  <LayoutGrid className="w-4 h-4 text-[#FF6A00]" />
                </div>
                <div>
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#2B1408]">
                    Menu Cepat Bonles
                  </h3>
                  <p className="text-[10px] text-[#7A604E]">Pilihan menu & kategori snack khas nusantara</p>
                </div>
              </div>

              <button
                onClick={onToggleMenu}
                className="text-xs text-[#7A604E] hover:text-[#2B1408] flex items-center gap-1 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-lg font-medium"
              >
                <X className="w-3.5 h-3.5" />
                <span>Tutup</span>
              </button>
            </div>

            {/* Quick Navigation Icon Buttons Grid */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D95A00] block mb-2.5">
                Navigasi Halaman
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* 1. Beranda */}
                <button
                  onClick={() => {
                    onNavigateHome();
                    onToggleMenu();
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-orange-50/80 border border-orange-100 hover:border-orange-300 shadow-xs hover:shadow-md transition-all text-left cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-lg bg-orange-100 group-hover:bg-gradient-to-r group-hover:from-[#FF5500] group-hover:to-[#FFAA00] text-[#D95A00] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2B1408] block">Beranda</span>
                    <span className="text-[10px] text-[#7A604E]">Halaman Utama</span>
                  </div>
                </button>

                {/* 2. Katalog Snack */}
                <button
                  onClick={() => scrollToSection('catalog')}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-orange-50/80 border border-orange-100 hover:border-orange-300 shadow-xs hover:shadow-md transition-all text-left cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-lg bg-orange-100 group-hover:bg-gradient-to-r group-hover:from-[#FF5500] group-hover:to-[#FFAA00] text-[#D95A00] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2B1408] block">Katalog Snack</span>
                    <span className="text-[10px] text-[#7A604E]">Semua Produk</span>
                  </div>
                </button>

                {/* 3. Our Story */}
                <button
                  onClick={() => scrollToSection('our-story')}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-orange-50/80 border border-orange-100 hover:border-orange-300 shadow-xs hover:shadow-md transition-all text-left cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-lg bg-orange-100 group-hover:bg-gradient-to-r group-hover:from-[#FF5500] group-hover:to-[#FFAA00] text-[#D95A00] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2B1408] block">Our Story</span>
                    <span className="text-[10px] text-[#7A604E]">Kisah Dari Borneo</span>
                  </div>
                </button>

                {/* 4. Tentang Kami */}
                <button
                  onClick={() => scrollToSection('about-section')}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-orange-50/80 border border-orange-100 hover:border-orange-300 shadow-xs hover:shadow-md transition-all text-left cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-lg bg-orange-100 group-hover:bg-gradient-to-r group-hover:from-[#FF5500] group-hover:to-[#FFAA00] text-[#D95A00] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2B1408] block">Tentang Kami</span>
                    <span className="text-[10px] text-[#7A604E]">Standar Mutu Pangan</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Category Filter Pills */}
            {categories.length > 0 && (
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D95A00] block mb-2.5">
                  Kategori Pilihan Cepat
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory('ALL');
                      scrollToSection('catalog');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#FF5500] to-[#FFAA00] text-white shadow-xs transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-yellow-200" />
                    <span>Semua Kategori</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.ID}
                      onClick={() => {
                        if (onSelectCategory) onSelectCategory(cat.ID);
                        scrollToSection('catalog');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-orange-50 border border-orange-200 text-[#4A2D1B] hover:text-[#FF5500] transition-all cursor-pointer shadow-2xs"
                    >
                      <Flame className="w-3 h-3 text-[#FF7B00]" />
                      <span>{cat.NAME}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Official Contact & Customer Care Card */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Customer Care & Pemesanan WhatsApp</span>
                </div>
                <p className="text-[11px] text-[#5C4230] font-medium">
                  +{waNumber} • {email}
                </p>
                <p className="text-[11px] text-[#7A604E] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#FF7B00] shrink-0" />
                  <span className="truncate">{address}</span>
                </p>
              </div>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onToggleMenu}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs tracking-wide shadow-md transition-all shrink-0"
              >
                <span>Buka Chat WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
