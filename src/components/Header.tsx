import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Search,
  UserCheck,
  Menu,
  X,
  Home,
  LayoutGrid,
  BookOpen,
  ShieldCheck,
  MessageCircle,
  MapPin,
  ArrowRight,
  Flame,
  Database,
  RefreshCw,
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

  const [settings, setSettings] = useState<Record<string, string>>(() =>
    store.getSettingsMap()
  );

  const [gasStatus, setGasStatus] = useState(() =>
    store.getGasStatus()
  );

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setSettings(store.getSettingsMap());
      setGasStatus(store.getGasStatus());
    });

    return unsubscribe;
  }, []);

  const tagline =
    settings['TAGLINE'] ||
    'Snack Tinggi Protein & Oleh-Oleh Khas Nusantara';

  const promoText =
    settings['PROMO_BANNER_TEXT'] ||
    'Pemesanan Langsung Terintegrasi WhatsApp';

  const waNumber =
    settings['WHATSAPP_NUMBER'] ||
    '6285174333902';

  const email =
    settings['STORE_EMAIL'] ||
    'bonlesff@gmail.com';

  const address =
    settings['STORE_ADDRESS'] ||
    'Jl. MT. Haryono Gg. Mufakat II No.84 Balikpapan Selatan';

  const cleanWa = waNumber.replace(/[^0-9]/g, '');

  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    'Halo PT. BONLES FOOD NUSANTARA, saya ingin memesan produk camilan khas.'
  )}`;

  const scrollToSection = (sectionId: string) => {
    if (isMenuOpen) {
      onToggleMenu();
    }

    const el = document.getElementById(sectionId);

    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <header
      className="
        sticky top-0 z-40
        bg-white/95
        backdrop-blur-xl
        border-b border-[#F1D5C8]/80
      "
    >
      {/* =====================================================
          TOP MICRO BAR
          ===================================================== */}
      <div
        className="
          bg-gradient-to-r from-[#7A0F18] via-[#E64A19] to-[#FFC107]
          border-b border-white/20
          px-3 sm:px-6
          py-2
          text-[10px] sm:text-[11px]
          tracking-wide
          text-white
        "
      >
        <div
          className="
            max-w-7xl mx-auto
            flex items-center
            justify-between
            gap-3
          "
        >
          {/* Brand Message */}
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles
              className="
                w-3.5 h-3.5
                text-[#FFD54F]
                shrink-0
              "
            />

            <span
              className="
                font-medium
                truncate
                text-white
              "
            >
              {tagline}
            </span>

            <span
              className="
                hidden md:inline
                text-white/40
              "
            >
              •
            </span>

            <span
              className="
                hidden md:inline
                truncate
                text-white/75
              "
            >
              {promoText}
            </span>
          </div>

          {/* GAS Status */}
          <div className="flex items-center gap-1.5 shrink-0">
            {gasStatus.isSyncing ? (
              <span
                className="
                  inline-flex items-center gap-1.5
                  px-2.5 py-1
                  rounded-full
                  border border-white/25
                  bg-white/10
                  text-white/85
                  font-mono
                  text-[9px]
                "
              >
                <RefreshCw
                  className="
                    w-2.5 h-2.5
                    animate-spin
                    text-[#FFD54F]
                  "
                />

                <span className="hidden sm:inline">
                  Memuat Spreadsheet...
                </span>
              </span>
            ) : gasStatus.connected ? (
              <span
                className="
                  inline-flex items-center gap-1.5
                  px-2.5 py-1
                  rounded-full
                  border border-white/30
                  bg-black/15
                  text-white/85
                  font-mono
                  text-[9px]
                "
                title={`Database tersinkronisasi via Google Apps Script (${gasStatus.lastSyncTime || 'Aktif'})`}
              >
                <span
                  className="
                    w-1.5 h-1.5
                    rounded-full
                    bg-[#8FBF9D]
                    animate-pulse
                  "
                />

                <span>
                  Spreadsheet Live
                </span>
              </span>
            ) : (
              <button
                onClick={() =>
                  store.pullFromCloudSpreadsheet('HEADER_RETRY')
                }
                className="
                  inline-flex items-center gap-1.5
                  px-2.5 py-1
                  rounded-full
                  border border-white/25
                  bg-white/10
                  hover:bg-white/15
                  text-white/85
                  transition-colors
                  cursor-pointer
                  font-mono
                  text-[9px]
                "
                title="Muat ulang data dari Spreadsheet"
              >
                <Database
                  className="
                    w-2.5 h-2.5
                    text-[#FFD54F]
                  "
                />

                <span className="hidden sm:inline">
                  Spreadsheet GAS
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN NAVBAR
          ===================================================== */}
      <div
        className="
          max-w-7xl mx-auto
          px-3 sm:px-6 lg:px-8
          h-[68px] sm:h-[82px]
          flex items-center
          justify-between
          gap-3 sm:gap-5
        "
      >
        {/* =================================================
            LEFT
            ================================================= */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Menu Button */}
          <button
            onClick={onToggleMenu}
            id="btn-header-menu"
            className={`
              w-10 h-10
              sm:w-11 sm:h-11
              rounded-full
              flex items-center justify-center
              border
              transition-all duration-300
              cursor-pointer
              ${
                isMenuOpen
                  ? `
                    bg-[#7A0F18]
                    text-white
                    border-[#7A0F18]
                    shadow-lg
                    shadow-[#E64A19]/15
                  `
                  : `
                    bg-[#FFF4E8]
                    text-[#8A1C25]
                    border-[#F0CFC2]
                    hover:bg-[#FFE4D1]
                    hover:border-[#F59E0B]
                  `
              }
            `}
            aria-label={
              isMenuOpen
                ? 'Tutup Menu'
                : 'Buka Menu'
            }
            title="Menu Navigasi"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Logo */}
          <button
            onClick={onNavigateHome}
            className="
              flex items-center
              text-left
              focus:outline-none
              cursor-pointer
            "
            aria-label="Kembali ke Beranda BONLES"
          >
            <div className="hidden sm:block">
              <BonlesLogo
                size="md"
                variant="horizontal"
                lightBg={true}
              />
            </div>

            <div className="sm:hidden">
              <BonlesLogo
                size="sm"
                variant="horizontal"
                lightBg={true}
              />
            </div>
          </button>
        </div>

        {/* =================================================
            DESKTOP NAVIGATION
            ================================================= */}
        <nav
          className="
            hidden xl:flex
            items-center
            gap-5
            2xl:gap-7
          "
        >
          <button
            onClick={() =>
              scrollToSection('catalog')
            }
            className="
              group
              flex items-center gap-2
              py-2
              text-[11px]
              uppercase
              tracking-[0.14em]
              font-semibold
              text-[#303030]
              hover:text-[#C2410C]
              transition-colors
              cursor-pointer
            "
          >
            <LayoutGrid
              className="
                w-3.5 h-3.5
                text-[#E05A2A]
                group-hover:text-[#C2410C]
                transition-colors
              "
            />

            <span>
              Katalog
            </span>
          </button>

          <button
            onClick={() =>
              scrollToSection('our-story')
            }
            className="
              group
              flex items-center gap-2
              py-2
              text-[11px]
              uppercase
              tracking-[0.14em]
              font-semibold
              text-[#303030]
              hover:text-[#C2410C]
              transition-colors
              cursor-pointer
            "
          >
            <BookOpen
              className="
                w-3.5 h-3.5
                text-[#E05A2A]
                group-hover:text-[#C2410C]
                transition-colors
              "
            />

            <span>
              Our Story
            </span>
          </button>

          <button
            onClick={() =>
              scrollToSection('about-section')
            }
            className="
              group
              flex items-center gap-2
              py-2
              text-[11px]
              uppercase
              tracking-[0.14em]
              font-semibold
              text-[#303030]
              hover:text-[#C2410C]
              transition-colors
              cursor-pointer
            "
          >
            <ShieldCheck
              className="
                w-3.5 h-3.5
                text-[#E05A2A]
                group-hover:text-[#C2410C]
                transition-colors
              "
            />

            <span>
              Tentang Kami
            </span>
          </button>
        </nav>

        {/* =================================================
            SEARCH DESKTOP
            ================================================= */}
        <div
          className="
            hidden lg:flex
            items-center
            flex-1
            max-w-[250px]
            xl:max-w-xs
            relative
          "
        >
          <Search
            className="
              w-4 h-4
              text-[#7A7773]
              absolute
              left-3.5
              pointer-events-none
            "
          />

          <input
            type="text"
            placeholder="Cari camilan..."
            value={searchQuery}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            className="
              w-full
              bg-[#FFF9F4]
              border border-[#F0CFC2]
              rounded-full
              pl-10
              pr-8
              py-2.5
              text-xs
              text-[#2B2522]
              placeholder-[#7C8580]
              focus:outline-none
              focus:border-[#E64A19]
              focus:ring-2
              focus:ring-[#F59E0B]/20
              transition-all
              font-medium
            "
          />

          {searchQuery && (
            <button
              onClick={() =>
                onSearchChange('')
              }
              className="
                absolute right-3
                text-[#7A7773]
                hover:text-[#7A0F18]
                cursor-pointer
              "
              aria-label="Hapus Pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* =================================================
            RIGHT ACTIONS
            ================================================= */}
        <div
          className="
            flex items-center
            gap-1.5 sm:gap-2.5
          "
        >
          {/* Mobile Search */}
          <button
            onClick={() =>
              setIsMobileSearchActive(
                !isMobileSearchActive
              )
            }
            className={`
              lg:hidden
              w-10 h-10
              rounded-full
              flex items-center justify-center
              border
              transition-all
              cursor-pointer
              ${
                isMobileSearchActive
                  ? `
                    bg-[#7A0F18]
                    text-white
                    border-[#09271F]
                  `
                  : `
                    bg-[#FFF4E8]
                    text-[#8A1C25]
                    border-[#F0CFC2]
                    hover:border-[#F59E0B]
                  `
              }
            `}
            aria-label="Cari Produk"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              hidden md:flex
              items-center
              gap-1.5
              bg-[#F0FDF4]
              hover:bg-[#DCFCE7]
              border border-[#BBE7C5]
              text-[#8A1C25]
              px-3
              py-2
              rounded-full
              text-[10px]
              font-bold
              tracking-wide
              transition-all
            "
            title="Chat Langsung via WhatsApp"
          >
            <MessageCircle
              className="
                w-4 h-4
                text-[#16A34A]
              "
            />

            <span className="hidden xl:inline">
              WhatsApp
            </span>
          </a>

          {/* Admin */}
          {isAuthenticated && (
            <button
              onClick={onToggleAdmin}
              id="btn-admin-toggle"
              className={`
                flex items-center gap-1.5
                px-3
                py-2
                rounded-full
                border
                text-[10px]
                tracking-[0.12em]
                uppercase
                font-bold
                transition-all
                cursor-pointer
                ${
                  isAdmin
                    ? `
                      bg-[#7A0F18]
                      text-white
                      border-[#09271F]
                    `
                    : `
                      bg-[#FFF4E8]
                      text-[#8A1C25]
                      border-[#F0CFC2]
                      hover:border-[#9E793A]
                    `
                }
              `}
              title={
                isAdmin
                  ? 'Kembali ke Tampilan Web'
                  : 'Buka Dashboard Admin'
              }
            >
              <UserCheck className="w-4 h-4" />

              <span className="hidden sm:inline">
                {isAdmin
                  ? 'Mode Web'
                  : 'Admin'}
              </span>
            </button>
          )}

          {/* Cart */}
          <button
            onClick={onOpenCart}
            id="btn-open-cart"
            className="
              relative
              flex items-center
              gap-2
              bg-gradient-to-r from-[#7A0F18] via-[#E64A19] to-[#F59E0B]
              hover:from-[#641018] hover:via-[#C2410C] hover:to-[#D97706]
              text-white
              px-3
              sm:px-4
              py-2.5
              rounded-full
              text-[10px]
              sm:text-[11px]
              tracking-[0.12em]
              uppercase
              font-bold
              transition-all
              shadow-md
              shadow-[#E64A19]/10
              hover:shadow-lg
              hover:shadow-[#E64A19]/15
              cursor-pointer
              active:scale-95
            "
            aria-label="Buka Keranjang Belanja"
          >
            <ShoppingBag className="w-4 h-4" />

            <span className="hidden sm:inline">
              Keranjang
            </span>

            {cartCount > 0 && (
              <span
                className="
                  bg-[#FFC107]
                  text-[#7A0F18]
                  text-[10px]
                  font-black
                  px-1.5
                  min-w-[20px]
                  h-5
                  rounded-full
                  flex items-center
                  justify-center
                "
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          MOBILE SEARCH DRAWER
          ===================================================== */}
      {isMobileSearchActive && (
        <div
          className="
            lg:hidden
            bg-[#FFF4E8]
            border-b border-[#F0CFC2]
            px-3 sm:px-6
            py-3
            flex items-center
            gap-2
          "
        >
          <div className="relative flex-1">
            <Search
              className="
                w-4 h-4
                text-[#7A7773]
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                pointer-events-none
              "
            />

            <input
              type="text"
              placeholder="Cari keripik, amplang, camilan..."
              value={searchQuery}
              onChange={(e) =>
                onSearchChange(e.target.value)
              }
              autoFocus
              className="
                w-full
                bg-[#FFFDFC]
                border border-[#F0CFC2]
                rounded-full
                pl-9
                pr-8
                py-2.5
                text-xs
                text-[#2B2522]
                placeholder-[#7C8580]
                focus:outline-none
                focus:border-[#E64A19]
                focus:ring-2
                focus:ring-[#F59E0B]/20
              "
            />

            {searchQuery && (
              <button
                onClick={() =>
                  onSearchChange('')
                }
                className="
                  absolute right-2.5
                  top-1/2
                  -translate-y-1/2
                  text-[#7A7773]
                  hover:text-[#7A0F18]
                  p-1
                  cursor-pointer
                "
                aria-label="Hapus Pencarian"
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
            className="
              bg-[#7A0F18]
              hover:bg-[#14532D]
              text-white
              text-xs
              px-4
              py-2.5
              rounded-full
              font-bold
              shrink-0
              transition-colors
            "
          >
            Cari
          </button>
        </div>
      )}

      {/* =====================================================
          PUSH DROP-DOWN MENU
          ===================================================== */}
      {isMenuOpen && (
        <div
          id="push-dropdown-menu"
          className="
            border-b
            border-[#F0CFC2]
            bg-[#FFFDFC]/98
            backdrop-blur-2xl
            shadow-2xl
            shadow-[#7A0F18]/10
            overflow-hidden
            animate-slide-down
          "
        >
          <div
            className="
              max-w-7xl mx-auto
              px-4 sm:px-6 lg:px-8
              py-6
              space-y-6
            "
          >
            {/* Dropdown Header */}
            <div
              className="
                flex items-center
                justify-between
                pb-4
                border-b border-[#F3DDD3]
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    w-9 h-9
                    rounded-full
                    bg-[#FFF4E8]
                    border border-[#F0CFC2]
                    flex items-center
                    justify-center
                  "
                >
                  <LayoutGrid
                    className="
                      w-4 h-4
                      text-[#E05A2A]
                    "
                  />
                </div>

                <div>
                  <h3
                    className="
                      font-display
                      text-sm
                      font-semibold
                      text-[#7A0F18]
                    "
                  >
                    Menu Cepat BONLES
                  </h3>

                  <p
                    className="
                      text-[10px]
                      text-[#6B625D]
                      mt-0.5
                    "
                  >
                    Navigasi & kategori camilan khas Borneo
                  </p>
                </div>
              </div>

              <button
                onClick={onToggleMenu}
                className="
                  text-[10px]
                  text-[#6B625D]
                  hover:text-[#7A0F18]
                  flex items-center
                  gap-1.5
                  bg-[#FFF4E8]
                  border border-[#F0CFC2]
                  px-3
                  py-1.5
                  rounded-full
                  font-semibold
                  transition-colors
                  cursor-pointer
                "
              >
                <X className="w-3.5 h-3.5" />
                <span>Tutup</span>
              </button>
            </div>

            {/* Navigation */}
            <div>
              <span
                className="
                  bonles-eyebrow
                  block
                  mb-3
                "
              >
                Navigasi Halaman
              </span>

              <div
                className="
                  grid
                  grid-cols-2
                  sm:grid-cols-4
                  gap-3
                "
              >
                {/* Home */}
                <button
                  onClick={() => {
                    onNavigateHome();
                    onToggleMenu();
                  }}
                  className="
                    group
                    flex items-center
                    gap-3
                    p-3.5
                    rounded-2xl
                    bg-[#FFF9F4]
                    hover:bg-[#FFF4E8]
                    border border-[#F3DDD3]
                    hover:border-[#F59E0B]
                    transition-all
                    text-left
                    cursor-pointer
                  "
                >
                  <div
                    className="
                      w-9 h-9
                      rounded-full
                      bg-[#FFE8D8]
                      group-hover:bg-[#7A0F18]
                      text-[#8A1C25]
                      group-hover:text-white
                      flex items-center
                      justify-center
                      shrink-0
                      transition-colors
                    "
                  >
                    <Home className="w-4 h-4" />
                  </div>

                  <div>
                    <span
                      className="
                        text-xs
                        font-bold
                        text-[#2B2522]
                        block
                      "
                    >
                      Beranda
                    </span>

                    <span
                      className="
                        text-[10px]
                        text-[#7A7773]
                      "
                    >
                      Halaman Utama
                    </span>
                  </div>
                </button>

                {/* Catalog */}
                <button
                  onClick={() =>
                    scrollToSection('catalog')
                  }
                  className="
                    group
                    flex items-center
                    gap-3
                    p-3.5
                    rounded-2xl
                    bg-[#FFF9F4]
                    hover:bg-[#FFF4E8]
                    border border-[#F3DDD3]
                    hover:border-[#F59E0B]
                    transition-all
                    text-left
                    cursor-pointer
                  "
                >
                  <div
                    className="
                      w-9 h-9
                      rounded-full
                      bg-[#FFE8D8]
                      group-hover:bg-[#7A0F18]
                      text-[#8A1C25]
                      group-hover:text-white
                      flex items-center
                      justify-center
                      shrink-0
                      transition-colors
                    "
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </div>

                  <div>
                    <span
                      className="
                        text-xs
                        font-bold
                        text-[#2B2522]
                        block
                      "
                    >
                      Katalog Snack
                    </span>

                    <span
                      className="
                        text-[10px]
                        text-[#7A7773]
                      "
                    >
                      Semua Produk
                    </span>
                  </div>
                </button>

                {/* Our Story */}
                <button
                  onClick={() =>
                    scrollToSection('our-story')
                  }
                  className="
                    group
                    flex items-center
                    gap-3
                    p-3.5
                    rounded-2xl
                    bg-[#FFF9F4]
                    hover:bg-[#FFF4E8]
                    border border-[#F3DDD3]
                    hover:border-[#F59E0B]
                    transition-all
                    text-left
                    cursor-pointer
                  "
                >
                  <div
                    className="
                      w-9 h-9
                      rounded-full
                      bg-[#FFE8D8]
                      group-hover:bg-[#7A0F18]
                      text-[#8A1C25]
                      group-hover:text-white
                      flex items-center
                      justify-center
                      shrink-0
                      transition-colors
                    "
                  >
                    <BookOpen className="w-4 h-4" />
                  </div>

                  <div>
                    <span
                      className="
                        text-xs
                        font-bold
                        text-[#2B2522]
                        block
                      "
                    >
                      Our Story
                    </span>

                    <span
                      className="
                        text-[10px]
                        text-[#7A7773]
                      "
                    >
                      Kisah Dari Borneo
                    </span>
                  </div>
                </button>

                {/* About */}
                <button
                  onClick={() =>
                    scrollToSection('about-section')
                  }
                  className="
                    group
                    flex items-center
                    gap-3
                    p-3.5
                    rounded-2xl
                    bg-[#FFF9F4]
                    hover:bg-[#FFF4E8]
                    border border-[#F3DDD3]
                    hover:border-[#F59E0B]
                    transition-all
                    text-left
                    cursor-pointer
                  "
                >
                  <div
                    className="
                      w-9 h-9
                      rounded-full
                      bg-[#FFE8D8]
                      group-hover:bg-[#7A0F18]
                      text-[#8A1C25]
                      group-hover:text-white
                      flex items-center
                      justify-center
                      shrink-0
                      transition-colors
                    "
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>

                  <div>
                    <span
                      className="
                        text-xs
                        font-bold
                        text-[#2B2522]
                        block
                      "
                    >
                      Tentang Kami
                    </span>

                    <span
                      className="
                        text-[10px]
                        text-[#7A7773]
                      "
                    >
                      Standar Mutu Pangan
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div>
                <span
                  className="
                    bonles-eyebrow
                    block
                    mb-3
                  "
                >
                  Kategori Pilihan
                </span>

                <div className="flex flex-wrap gap-2">
                  {/* All */}
                  <button
                    onClick={() => {
                      if (onSelectCategory) {
                        onSelectCategory('ALL');
                      }

                      scrollToSection('catalog');
                    }}
                    className="
                      flex items-center
                      gap-1.5
                      px-3.5
                      py-2
                      rounded-full
                      text-[10px]
                      font-bold
                      bg-[#7A0F18]
                      text-white
                      border border-[#09271F]
                      hover:bg-[#14532D]
                      transition-all
                      cursor-pointer
                    "
                  >
                    <Sparkles className="w-3 h-3 text-[#FFD54F]" />
                    <span>Semua Kategori</span>
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.ID}
                      onClick={() => {
                        if (onSelectCategory) {
                          onSelectCategory(cat.ID);
                        }

                        scrollToSection('catalog');
                      }}
                      className="
                        flex items-center
                        gap-1.5
                        px-3.5
                        py-2
                        rounded-full
                        text-[10px]
                        font-semibold
                        bg-[#FFF9F4]
                        hover:bg-[#FFF4E8]
                        border border-[#F0CFC2]
                        text-[#303030]
                        hover:text-[#C2410C]
                        hover:border-[#F59E0B]
                        transition-all
                        cursor-pointer
                      "
                    >
                      <Flame
                        className="
                          w-3 h-3
                          text-[#E05A2A]
                        "
                      />

                      <span>
                        {cat.NAME}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Card */}
            <div
              className="
                p-4
                rounded-2xl
                bg-[#FFF4E8]
                border border-[#F0CFC2]
                flex flex-col
                sm:flex-row
                sm:items-center
                justify-between
                gap-4
              "
            >
              <div className="space-y-1.5">
                <div
                  className="
                    flex items-center
                    gap-2
                    text-[#8A1C25]
                    font-bold
                    text-xs
                  "
                >
                  <MessageCircle
                    className="
                      w-4 h-4
                      text-[#16A34A]
                    "
                  />

                  <span>
                    Customer Care & Pemesanan
                  </span>
                </div>

                <p
                  className="
                    text-[10px]
                    text-[#4B403B]
                    font-medium
                  "
                >
                  +{waNumber} • {email}
                </p>

                <p
                  className="
                    text-[10px]
                    text-[#6B625D]
                    flex items-center
                    gap-1.5
                  "
                >
                  <MapPin
                    className="
                      w-3 h-3
                      text-[#E05A2A]
                      shrink-0
                    "
                  />

                  <span className="truncate">
                    {address}
                  </span>
                </p>
              </div>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onToggleMenu}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  bg-[#C2410C]
                  hover:bg-[#7A0F18]
                  text-white
                  font-bold
                  px-5
                  py-2.5
                  rounded-full
                  text-[10px]
                  tracking-wide
                  transition-all
                  shrink-0
                "
              >
                <span>
                  Buka Chat WhatsApp
                </span>

                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
