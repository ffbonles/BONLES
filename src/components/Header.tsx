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
    <header className="sticky top-0 z-40 bg-[#16080A]/95 backdrop-blur-md border-b border-[#D82824]/20 shadow-lg shadow-black/40">
      {/* Top micro banner - Customer-friendly messaging & Live Spreadsheet Sync */}
      <div className="bg-gradient-to-r from-[#240B0F] via-[#381117] to-[#240B0F] border-b border-[#D82824]/20 py-1.5 px-3 text-xs tracking-wider text-[#F5A623] font-medium flex items-center justify-between sm:justify-center gap-2">
        <div className="flex items-center gap-2 truncate">
          <Sparkles className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
          <span className="text-[#FFF2DC] font-semibold text-[11px] sm:text-xs truncate">{tagline}</span>
          <span className="hidden md:inline text-white/30">•</span>
          <span className="hidden md:inline text-white/80 text-[11px] truncate">{promoText}</span>
        </div>

        {/* Live Spreadsheet Status Indicator for all browsers */}
        <div className="flex items-center gap-1.5 shrink-0 pl-2">
          {gasStatus.isSyncing ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/30">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              <span className="hidden sm:inline">Memuat Spreadsheet...</span>
            </span>
          ) : gasStatus.connected ? (
            <span 
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#00D222]/20 text-[#00D222] border border-[#00D222]/30"
              title={`Database tersinkronisasi via Google Apps Script (${gasStatus.lastSyncTime || 'Aktif'})`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D222] animate-pulse"></span>
              <span>Spreadsheet Live</span>
            </span>
          ) : (
            <button
              onClick={() => store.pullFromCloudSpreadsheet('HEADER_RETRY')}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#260C11] text-[#E5D8C7] hover:text-[#F5A623] border border-[#D82824]/30 hover:border-[#F5A623] transition-colors cursor-pointer"
              title="Database siap: klik untuk muat data langsung dari spreadsheet"
            >
              <Database className="w-2.5 h-2.5 text-[#F5A623]" />
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
                ? 'bg-[#D82824] text-white border-[#FF6E6E] shadow-md shadow-[#D82824]/30'
                : 'bg-[#260C11] text-[#F5A623] hover:text-white border-[#D82824]/30 hover:border-[#F5A623]'
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
              <BonlesLogo size="md" variant="horizontal" />
            </div>
            <div className="sm:hidden">
              <BonlesLogo size="sm" variant="horizontal" />
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5">
          <button
            onClick={() => scrollToSection('catalog')}
            className="text-xs font-sans uppercase tracking-widest text-[#E5D8C7] hover:text-[#F5A623] transition-colors cursor-pointer flex items-center gap-1.5 py-2 px-1"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#F5A623]" />
            <span>Katalog Snack</span>
          </button>
          <button
            onClick={() => scrollToSection('our-story')}
            className="text-xs font-sans uppercase tracking-widest text-[#E5D8C7] hover:text-[#F5A623] transition-colors cursor-pointer flex items-center gap-1.5 py-2 px-1"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#F5A623]" />
            <span>Our Story</span>
          </button>
          <button
            onClick={() => scrollToSection('about-section')}
            className="text-xs font-sans uppercase tracking-widest text-[#E5D8C7] hover:text-[#F5A623] transition-colors cursor-pointer flex items-center gap-1.5 py-2 px-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#F5A623]" />
            <span>Tentang Kami</span>
          </button>
        </nav>

        {/* Center-Right: Desktop Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-xs mx-2 relative">
          <Search className="w-4 h-4 text-[#A89886] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari camilan kemasan..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#240C11] border border-[#D82824]/30 rounded-xl pl-10 pr-8 py-2 text-xs text-[#FFF5E6] placeholder-[#9A8778] focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623]/40 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-xs text-[#A89886] hover:text-white"
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
                ? 'bg-[#F5A623] text-black border-[#F5A623]'
                : 'bg-[#260C11] text-[#E5D8C7] border-[#D82824]/30'
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
            className="hidden sm:flex items-center gap-1.5 bg-[#00D222]/15 hover:bg-[#00D222]/25 border border-[#00D222]/40 text-[#00D222] px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm"
            title="Chat Langsung via WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden xl:inline">CS WhatsApp</span>
          </a>

          {/* Admin Toggle Button (if logged in) */}
          {isAuthenticated && (
            <button
              onClick={onToggleAdmin}
              id="btn-admin-toggle"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs tracking-wider uppercase font-medium transition-all ${
                isAdmin
                  ? 'bg-gradient-to-r from-[#D82824] to-[#B71C1C] text-white border-[#D82824] font-bold shadow-md shadow-[#D82824]/30'
                  : 'bg-[#260C11] text-[#00D222] border-[#00D222]/40 hover:border-[#00D222]'
              }`}
              title={isAdmin ? 'Kembali ke Tampilan Web' : 'Buka Dashboard Admin'}
            >
              <UserCheck className="w-4 h-4 text-[#00D222]" />
              <span className="hidden sm:inline">
                {isAdmin ? 'Mode Web' : 'Admin'}
              </span>
            </button>
          )}

          {/* Shopping Cart Icon Button */}
          <button
            onClick={onOpenCart}
            id="btn-open-cart"
            className="relative flex items-center gap-2 bg-[#260C11] hover:bg-[#341117] border border-[#D82824]/30 hover:border-[#F5A623]/60 text-white px-3 sm:px-3.5 py-2 rounded-xl text-xs tracking-wider uppercase font-medium transition-all shadow-sm cursor-pointer"
            aria-label="Buka Keranjang Belanja"
          >
            <ShoppingBag className="w-4 h-4 text-[#F5A623]" />
            <span className="hidden sm:inline">Keranjang</span>
            {cartCount > 0 && (
              <span className="bg-gradient-to-r from-[#D82824] to-[#E53935] text-white text-[11px] font-bold px-1.5 py-0.5 min-w-[20px] h-5 rounded-full flex items-center justify-center animate-pulse shadow-sm shadow-[#D82824]/50">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Drawer (collapsible under header) */}
      {isMobileSearchActive && (
        <div className="md:hidden bg-[#1D090D] border-b border-[#D82824]/30 px-3 py-2.5 flex items-center gap-2 animate-fadeIn">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#A89886] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari keripik tempe, amplang, pisang..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
              className="w-full bg-[#2A0E13] border border-[#D82824]/40 rounded-xl pl-9 pr-8 py-2 text-xs text-[#FFF5E6] placeholder-[#9A8778] focus:outline-none focus:border-[#F5A623]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#A89886] hover:text-white p-1"
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
            className="bg-[#D82824] text-white text-xs px-3 py-2 rounded-xl font-medium shrink-0"
          >
            Cari
          </button>
        </div>
      )}

      {/* PUSH DROP-DOWN MENU CONTAINER (Slides down directly from header) */}
      {isMenuOpen && (
        <div
          id="push-dropdown-menu"
          className="border-b-2 border-[#F5A623]/40 bg-[#16080A]/98 backdrop-blur-2xl shadow-2xl transition-all duration-300 overflow-hidden animate-slide-down"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
            {/* Header of Dropdown */}
            <div className="flex items-center justify-between pb-3 border-b border-[#D82824]/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2C0E14] border border-[#F5A623]/40 flex items-center justify-center">
                  <LayoutGrid className="w-4 h-4 text-[#F5A623]" />
                </div>
                <div>
                  <h3 className="text-xs uppercase font-bold tracking-widest text-[#FFF2DC]">
                    Menu Cepat Bonles
                  </h3>
                  <p className="text-[10px] text-[#A89886]">Pilihan menu & kategori snack khas nusantara</p>
                </div>
              </div>

              <button
                onClick={onToggleMenu}
                className="text-xs text-[#A89886] hover:text-white flex items-center gap-1 bg-[#260C11] border border-[#D82824]/20 px-2.5 py-1 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
                <span>Tutup</span>
              </button>
            </div>

            {/* Quick Navigation Icon Buttons Grid */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5A623] block mb-2.5">
                Navigasi Halaman
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* 1. Beranda */}
                <button
                  onClick={() => {
                    onNavigateHome();
                    onToggleMenu();
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#230C10] hover:bg-[#321117] border border-[#D82824]/20 hover:border-[#F5A623]/50 transition-all text-left cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#300F15] group-hover:bg-[#D82824] text-[#F5A623] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#FFFDF9] block">Beranda</span>
                    <span className="text-[10px] text-[#A89886]">Halaman Utama</span>
                  </div>
                </button>

                {/* 2. Katalog Snack */}
                <button
                  onClick={() => scrollToSection('catalog')}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#230C10] hover:bg-[#321117] border border-[#D82824]/20 hover:border-[#F5A623]/50 transition-all text-left cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#300F15] group-hover:bg-[#D82824] text-[#F5A623] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#FFFDF9] block">Katalog Snack</span>
                    <span className="text-[10px] text-[#A89886]">Semua Produk</span>
                  </div>
                </button>

                {/* 3. Our Story */}
                <button
                  onClick={() => scrollToSection('our-story')}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#230C10] hover:bg-[#321117] border border-[#D82824]/20 hover:border-[#F5A623]/50 transition-all text-left cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#300F15] group-hover:bg-[#D82824] text-[#F5A623] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#FFFDF9] block">Our Story</span>
                    <span className="text-[10px] text-[#A89886]">Kisah Dari Borneo</span>
                  </div>
                </button>

                {/* 4. Tentang Kami */}
                <button
                  onClick={() => scrollToSection('about-section')}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#230C10] hover:bg-[#321117] border border-[#D82824]/20 hover:border-[#F5A623]/50 transition-all text-left cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#300F15] group-hover:bg-[#D82824] text-[#F5A623] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#FFFDF9] block">Tentang Kami</span>
                    <span className="text-[10px] text-[#A89886]">Standar Mutu Pangan</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Category Filter Pills */}
            {categories.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5A623] block mb-2.5">
                  Kategori Pilihan Cepat
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory('ALL');
                      scrollToSection('catalog');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#2B0E14] hover:bg-[#3D141C] border border-[#D82824]/30 text-[#FFF2DC] transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-[#F5A623]" />
                    <span>Semua Kategori</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.ID}
                      onClick={() => {
                        if (onSelectCategory) onSelectCategory(cat.ID);
                        scrollToSection('catalog');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#230C10] hover:bg-[#321117] border border-[#D82824]/20 hover:border-[#F5A623]/40 text-[#E5D8C7] hover:text-white transition-all cursor-pointer"
                    >
                      <Flame className="w-3 h-3 text-[#F5A623]" />
                      <span>{cat.NAME}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Official Contact & Customer Care Card */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#260B10] to-[#1E080C] border border-[#D82824]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#00D222] font-semibold text-xs">
                  <MessageCircle className="w-4 h-4" />
                  <span>Customer Care & Pemesanan WhatsApp</span>
                </div>
                <p className="text-[11px] text-[#A89886]">
                  +{waNumber} • {email}
                </p>
                <p className="text-[11px] text-[#A89886] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#F5A623] shrink-0" />
                  <span className="truncate">{address}</span>
                </p>
              </div>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onToggleMenu}
                className="inline-flex items-center justify-center gap-2 bg-[#00D222] hover:bg-[#00B81E] text-black font-bold px-4 py-2.5 rounded-xl text-xs tracking-wide shadow-md transition-all shrink-0"
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
