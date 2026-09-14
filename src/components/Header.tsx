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
        bg-[#FCFAF5]/95
        backdrop-blur-xl
        border-b border-[#D8C9B3]/70
      "
    >
      {/* =====================================================
          TOP MICRO BAR
          ===================================================== */}
      <div
        className="
          bg-[#09271F]
          border-b border-[#B18B4B]/25
          px-3 sm:px-6
          py-2
          text-[10px] sm:text-[11px]
          tracking-wide
          text-[#F8F4EA]
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
                text-[#C9A45C]
                shrink-0
              "
            />

            <span
              className="
                font-medium
                truncate
                text-[#F8F4EA]
              "
            >
              {tagline}
            </span>

            <span
              className="
                hidden md:inline
                text-[#B18B4B]/50
              "
            >
              •
            </span>

            <span
              className="
                hidden md:inline
                truncate
                text-[#D8C9B3]
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
                  border border-[#D8C9B3]/25
                  bg-white/5
                  text-[#E9DFCF]
                  font-mono
                  text-[9px]
                "
              >
                <RefreshCw
                  className="
                    w-2.5 h-2.5
                    animate-spin
                    text-[#C9A45C]
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
                  border border-[#B18B4B]/35
                  bg-[#123C32]/60
                  text-[#E9DFCF]
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
                  border border-[#D8C9B3]/25
                  bg-white/5
                  hover:bg-white/10
                  text-[#E9DFCF]
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
                    text-[#C9A45C]
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
                    bg-[#09271F]
                    text-[#F8F4EA]
                    border-[#09271F]
                    shadow-lg
                    shadow-[#09271F]/15
                  `
                  : `
                    bg-[#F3EDE0]
                    text-[#185043]
                    border-[#D8C9B3]
                    hover:bg-[#E9DFCF]
                    hover:border-[#B18B4B]
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
              text-[#303934]
              hover:text-[#185043]
              transition-colors
              cursor-pointer
            "
          >
            <LayoutGrid
              className="
                w-3.5 h-3.5
                text-[#9E793A]
                group-hover:text-[#185043]
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
              text-[#303934]
              hover:text-[#185043]
              transition-colors
              cursor-pointer
            "
          >
            <BookOpen
              className="
                w-3.5 h-3.5
                text-[#9E793A]
                group-hover:text-[#185043]
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
              text-[#303934]
              hover:text-[#185043]
              transition-colors
              cursor-pointer
            "
          >
            <ShieldCheck
              className="
                w-3.5 h-3.5
                text-[#9E793A]
                group-hover:text-[#185043]
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
              text-[#7C8580]
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
              bg-[#F8F4EA]
              border border-[#D8C9B3]
              rounded-full
              pl-10
              pr-8
              py-2.5
              text-xs
              text-[#18201D]
              placeholder-[#7C8580]
              focus:outline-none
              focus:border-[#9E793A]
              focus:ring-2
              focus:ring-[#B18B4B]/15
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
                text-[#7C8580]
                hover:text-[#09271F]
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
                    bg-[#09271F]
                    text-[#F8F4EA]
                    border-[#09271F]
                  `
                  : `
                    bg-[#F3EDE0]
                    text-[#185043]
                    border-[#D8C9B3]
                    hover:border-[#B18B4B]
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
              bg-[#EEF5F0]
              hover:bg-[#E3EFE6]
              border border-[#BFD4C5]
              text-[#185043]
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
                text-[#2C765B]
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
                      bg-[#09271F]
                      text-[#F8F4EA]
                      border-[#09271F]
                    `
                    : `
                      bg-[#F3EDE0]
                      text-[#185043]
                      border-[#D8C9B3]
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
              bg-[#09271F]
              hover:bg-[#123C32]
              text-[#F8F4EA]
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
              shadow-[#09271F]/10
              hover:shadow-lg
              hover:shadow-[#09271F]/15
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
                  bg-[#C9A45C]
                  text-[#09271F]
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
            bg-[#F3EDE0]
            border-b border-[#D8C9B3]
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
                text-[#7C8580]
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
                bg-[#FCFAF5]
                border border-[#D8C9B3]
                rounded-full
                pl-9
                pr-8
                py-2.5
                text-xs
                text-[#18201D]
                placeholder-[#7C8580]
                focus:outline-none
                focus:border-[#9E793A]
                focus:ring-2
                focus:ring-[#B18B4B]/15
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
                  text-[#7C8580]
                  hover:text-[#09271F]
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
              bg-[#09271F]
              hover:bg-[#123C32]
              text-[#F8F4EA]
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
            border-[#D8C9B3]
            bg-[#FCFAF5]/98
            backdrop-blur-2xl
            shadow-2xl
            shadow-[#09271F]/8
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
                border-b border-[#E9DFCF]
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    w-9 h-9
                    rounded-full
                    bg-[#F3EDE0]
                    border border-[#D8C9B3]
                    flex items-center
                    justify-center
                  "
                >
                  <LayoutGrid
                    className="
                      w-4 h-4
                      text-[#9E793A]
                    "
                  />
                </div>

                <div>
                  <h3
                    className="
                      font-display
                      text-sm
                      font-semibold
                      text-[#09271F]
                    "
                  >
                    Menu Cepat BONLES
                  </h3>

                  <p
                    className="
                      text-[10px]
                      text-[#65706A]
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
                  text-[#65706A]
                  hover:text-[#09271F]
                  flex items-center
                  gap-1.5
                  bg-[#F3EDE0]
                  border border-[#D8C9B3]
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
                    bg-[#F8F4EA]
                    hover:bg-[#F3EDE0]
                    border border-[#E9DFCF]
                    hover:border-[#C9A45C]
                    transition-all
                    text-left
                    cursor-pointer
                  "
                >
                  <div
                    className="
                      w-9 h-9
                      rounded-full
                      bg-[#E9DFCF]
                      group-hover:bg-[#09271F]
                      text-[#185043]
                      group-hover:text-[#F8F4EA]
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
                        text-[#18201D]
                        block
                      "
                    >
                      Beranda
                    </span>

                    <span
                      className="
                        text-[10px]
                        text-[#7C8580]
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
                    bg-[#F8F4EA]
                    hover:bg-[#F3EDE0]
                    border border-[#E9DFCF]
                    hover:border-[#C9A45C]
                    transition-all
                    text-left
                    cursor-pointer
                  "
                >
                  <div
                    className="
                      w-9 h-9
                      rounded-full
                      bg-[#E9DFCF]
                      group-hover:bg-[#09271F]
                      text-[#185043]
                      group-hover:text-[#F8F4EA]
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
                        text-[#18201D]
                        block
                      "
                    >
                      Katalog Snack
                    </span>

                    <span
                      className="
                        text-[10px]
                        text-[#7C8580]
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
                    bg-[#F8F4EA]
                    hover:bg-[#F3EDE0]
                    border border-[#E9DFCF]
                    hover:border-[#C9A45C]
                    transition-all
                    text-left
                    cursor-pointer
                  "
                >
                  <div
                    className="
                      w-9 h-9
                      rounded-full
                      bg-[#E9DFCF]
                      group-hover:bg-[#09271F]
                      text-[#185043]
                      group-hover:text-[#F8F4EA]
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
                        text-[#18201D]
                        block
                      "
                    >
                      Our Story
                    </span>

                    <span
                      className="
                        text-[10px]
                        text-[#7C8580]
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
                    bg-[#F8F4EA]
                    hover:bg-[#F3EDE0]
                    border border-[#E9DFCF]
                    hover:border-[#C9A45C]
                    transition-all
                    text-left
                    cursor-pointer
                  "
                >
                  <div
                    className="
                      w-9 h-9
                      rounded-full
                      bg-[#E9DFCF]
                      group-hover:bg-[#09271F]
                      text-[#185043]
                      group-hover:text-[#F8F4EA]
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
                        text-[#18201D]
                        block
                      "
                    >
                      Tentang Kami
                    </span>

                    <span
                      className="
                        text-[10px]
                        text-[#7C8580]
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
                      bg-[#09271F]
                      text-[#F8F4EA]
                      border border-[#09271F]
                      hover:bg-[#123C32]
                      transition-all
                      cursor-pointer
                    "
                  >
                    <Sparkles className="w-3 h-3 text-[#C9A45C]" />
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
                        bg-[#F8F4EA]
                        hover:bg-[#F3EDE0]
                        border border-[#D8C9B3]
                        text-[#303934]
                        hover:text-[#185043]
                        hover:border-[#B18B4B]
                        transition-all
                        cursor-pointer
                      "
                    >
                      <Flame
                        className="
                          w-3 h-3
                          text-[#9E793A]
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
                bg-[#F3EDE0]
                border border-[#D8C9B3]
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
                    text-[#185043]
                    font-bold
                    text-xs
                  "
                >
                  <MessageCircle
                    className="
                      w-4 h-4
                      text-[#2C765B]
                    "
                  />

                  <span>
                    Customer Care & Pemesanan
                  </span>
                </div>

                <p
                  className="
                    text-[10px]
                    text-[#4B554F]
                    font-medium
                  "
                >
                  +{waNumber} • {email}
                </p>

                <p
                  className="
                    text-[10px]
                    text-[#65706A]
                    flex items-center
                    gap-1.5
                  "
                >
                  <MapPin
                    className="
                      w-3 h-3
                      text-[#9E793A]
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
                  bg-[#185043]
                  hover:bg-[#09271F]
                  text-[#F8F4EA]
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
