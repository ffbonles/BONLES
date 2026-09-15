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
    settings['ANNOUNCEMENT_BAR_TEXT'] ||
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
        border-b border-[#EED6C8]
        bg-[#FFFDFC]/95
        backdrop-blur-xl
        shadow-[0_4px_24px_rgba(127,23,18,0.04)]
      "
    >

      {/* =====================================================
          TOP MICRO BAR
      ====================================================== */}

      {settings['ANNOUNCEMENT_BAR_ACTIVE'] !== 'FALSE' && (
      <div
        className="
          border-b border-white/15
          bg-gradient-to-r
          from-[#74140F]
          via-[#D92D20]
          to-[#F97316]
          px-3 py-2
          text-white
          sm:px-6
        "
      >
        <div
          className="
            mx-auto
            flex max-w-7xl
            items-center justify-between
            gap-3
          "
        >

          {/* Brand Message */}
          <div className="flex min-w-0 items-center gap-2">

            <Sparkles
              className="
                h-3.5 w-3.5
                shrink-0
                text-[#FFD166]
              "
            />

            <span
              className="
                truncate
                text-[10px]
                font-semibold
                tracking-wide
                text-white
                sm:text-[11px]
              "
            >
              {tagline}
            </span>

            <span
              className="
                hidden
                text-white/40
                md:inline
              "
            >
              •
            </span>

            <span
              className="
                hidden
                truncate
                text-[10px]
                text-white/75
                md:inline
                sm:text-[11px]
              "
            >
              {promoText}
            </span>
          </div>

          {/* GAS Status */}
          <div className="flex shrink-0 items-center gap-1.5">

            {gasStatus.isSyncing ? (

              <span
                className="
                  inline-flex
                  items-center gap-1.5
                  rounded-full
                  border border-white/25
                  bg-white/10
                  px-2.5 py-1
                  font-mono
                  text-[9px]
                  text-white/90
                "
              >
                <RefreshCw
                  className="
                    h-2.5 w-2.5
                    animate-spin
                    text-[#FFD166]
                  "
                />

                <span className="hidden sm:inline">
                  Memuat Spreadsheet...
                </span>
              </span>

            ) : gasStatus.connected ? (

              <span
                className="
                  inline-flex
                  items-center gap-1.5
                  rounded-full
                  border border-white/25
                  bg-black/10
                  px-2.5 py-1
                  font-mono
                  text-[9px]
                  text-white/90
                "
                title={`Database tersinkronisasi via Google Apps Script (${gasStatus.lastSyncTime || 'Aktif'})`}
              >
                <span
                  className="
                    h-1.5 w-1.5
                    animate-pulse
                    rounded-full
                    bg-[#86EFAC]
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
                  inline-flex
                  items-center gap-1.5
                  rounded-full
                  border border-white/25
                  bg-white/10
                  px-2.5 py-1
                  font-mono
                  text-[9px]
                  text-white/90
                  transition-all
                  hover:bg-white/20
                  cursor-pointer
                "
                title="Muat ulang data dari Spreadsheet"
              >
                <Database
                  className="
                    h-2.5 w-2.5
                    text-[#FFD166]
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
      )}

      {/* =====================================================
          MAIN NAVBAR
      ====================================================== */}

      <div
        className="
          mx-auto
          flex
          h-[68px]
          max-w-7xl
          items-center
          justify-between
          gap-3
          px-3
          sm:h-[80px]
          sm:gap-5
          sm:px-6
          lg:px-8
        "
      >

        {/* LEFT */}
        <div className="flex items-center gap-2.5 sm:gap-4">

          {/* Menu */}
          <button
            onClick={onToggleMenu}
            id="btn-header-menu"
            className={`
              flex
              h-10 w-10
              items-center justify-center
              rounded-xl
              border
              transition-all duration-300
              cursor-pointer
              active:scale-95
              sm:h-11 sm:w-11
              ${
                isMenuOpen
                  ? `
                    border-[#74140F]
                    bg-gradient-to-br
                    from-[#74140F]
                    to-[#D92D20]
                    text-white
                    shadow-lg
                    shadow-[#D92D20]/20
                  `
                  : `
                    border-[#F0D2C2]
                    bg-[#FFF5EF]
                    text-[#9F2118]
                    hover:border-[#F97316]
                    hover:bg-[#FFE9DD]
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
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Logo */}
          <button
            onClick={onNavigateHome}
            className="
              flex
              items-center
              text-left
              cursor-pointer
              focus:outline-none
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
        ================================================== */}

        <nav
          className="
            hidden
            items-center
            gap-5
            xl:flex
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
              font-bold
              uppercase
              tracking-[0.14em]
              text-[#463C38]
              transition-colors
              hover:text-[#C2410C]
              cursor-pointer
            "
          >
            <LayoutGrid
              className="
                h-3.5 w-3.5
                text-[#E85D04]
                transition-colors
                group-hover:text-[#C2410C]
              "
            />

            <span>Katalog</span>
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
              font-bold
              uppercase
              tracking-[0.14em]
              text-[#463C38]
              transition-colors
              hover:text-[#C2410C]
              cursor-pointer
            "
          >
            <BookOpen
              className="
                h-3.5 w-3.5
                text-[#E85D04]
                transition-colors
                group-hover:text-[#C2410C]
              "
            />

            <span>Our Story</span>
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
              font-bold
              uppercase
              tracking-[0.14em]
              text-[#463C38]
              transition-colors
              hover:text-[#C2410C]
              cursor-pointer
            "
          >
            <ShieldCheck
              className="
                h-3.5 w-3.5
                text-[#E85D04]
                transition-colors
                group-hover:text-[#C2410C]
              "
            />

            <span>Tentang Kami</span>
          </button>

        </nav>

        {/* =================================================
            DESKTOP SEARCH
        ================================================== */}

        <div
          className="
            relative
            hidden
            max-w-[250px]
            flex-1
            items-center
            lg:flex
            xl:max-w-xs
          "
        >
          <Search
            className="
              pointer-events-none
              absolute
              left-3.5
              h-4 w-4
              text-[#91847D]
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
              rounded-full
              border border-[#EED6C8]
              bg-[#FFF9F4]
              py-2.5
              pl-10
              pr-8
              text-xs
              font-medium
              text-[#302824]
              placeholder-[#91847D]
              transition-all
              focus:border-[#F04438]
              focus:outline-none
              focus:ring-2
              focus:ring-[#F97316]/15
            "
          />

          {searchQuery && (
            <button
              onClick={() =>
                onSearchChange('')
              }
              className="
                absolute right-3
                cursor-pointer
                text-[#91847D]
                transition-colors
                hover:text-[#A82018]
              "
              aria-label="Hapus Pencarian"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* =================================================
            RIGHT ACTIONS
        ================================================== */}

        <div className="flex items-center gap-1.5 sm:gap-2.5">

          {/* Mobile Search */}
          <button
            onClick={() =>
              setIsMobileSearchActive(
                !isMobileSearchActive
              )
            }
            className={`
              flex
              h-10 w-10
              items-center justify-center
              rounded-xl
              border
              transition-all
              cursor-pointer
              active:scale-95
              lg:hidden
              ${
                isMobileSearchActive
                  ? `
                    border-[#74140F]
                    bg-[#74140F]
                    text-white
                  `
                  : `
                    border-[#F0D2C2]
                    bg-[#FFF5EF]
                    text-[#9F2118]
                    hover:border-[#F97316]
                    hover:bg-[#FFE9DD]
                  `
              }
            `}
            aria-label="Cari Produk"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              hidden
              items-center gap-1.5
              rounded-full
              border border-[#B7DEC8]
              bg-[#F0FDF4]
              px-3 py-2
              text-[10px]
              font-bold
              tracking-wide
              text-[#3F5147]
              transition-all
              hover:border-[#86C8A1]
              hover:bg-[#DCFCE7]
              md:flex
            "
            title="Chat Langsung via WhatsApp"
          >
            <MessageCircle
              className="
                h-4 w-4
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
                rounded-full
                border
                px-3 py-2
                text-[10px]
                font-bold
                uppercase
                tracking-[0.12em]
                transition-all
                cursor-pointer
                active:scale-95
                ${
                  isAdmin
                    ? `
                      border-[#74140F]
                      bg-gradient-to-r
                      from-[#74140F]
                      to-[#D92D20]
                      text-white
                      shadow-sm
                    `
                    : `
                      border-[#F0D2C2]
                      bg-[#FFF5EF]
                      text-[#9F2118]
                      hover:border-[#F97316]
                      hover:bg-[#FFE9DD]
                    `
                }
              `}
              title={
                isAdmin
                  ? 'Kembali ke Tampilan Web'
                  : 'Buka Dashboard Admin'
              }
            >
              <UserCheck className="h-4 w-4" />

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
              flex items-center gap-2
              rounded-full
              bg-gradient-to-r
              from-[#74140F]
              via-[#D92D20]
              to-[#F97316]
              px-3 py-2.5
              text-[10px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-white
              shadow-md
              shadow-[#D92D20]/15
              transition-all
              hover:-translate-y-0.5
              hover:shadow-lg
              hover:shadow-[#D92D20]/20
              active:scale-95
              cursor-pointer
              sm:px-4
              sm:text-[11px]
            "
            aria-label="Buka Keranjang Belanja"
          >
            <ShoppingBag className="h-4 w-4" />

            <span className="hidden sm:inline">
              Keranjang
            </span>

            {cartCount > 0 && (
              <span
                className="
                  flex
                  h-5 min-w-[20px]
                  items-center justify-center
                  rounded-full
                  bg-[#FFC107]
                  px-1.5
                  text-[10px]
                  font-black
                  text-[#74140F]
                "
              >
                {cartCount > 99
                  ? '99+'
                  : cartCount}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* =====================================================
          MOBILE SEARCH DRAWER
      ====================================================== */}

      {isMobileSearchActive && (
        <div
          className="
            flex
            items-center
            gap-2
            border-b border-[#EED6C8]
            bg-[#FFF5EF]
            px-3 py-3
            lg:hidden
            sm:px-6
          "
        >
          <div className="relative flex-1">

            <Search
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                h-4 w-4
                -translate-y-1/2
                text-[#91847D]
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
                rounded-full
                border border-[#EED6C8]
                bg-[#FFFDFC]
                py-2.5
                pl-9
                pr-8
                text-xs
                text-[#302824]
                placeholder-[#91847D]
                focus:border-[#F04438]
                focus:outline-none
                focus:ring-2
                focus:ring-[#F97316]/15
              "
            />

            {searchQuery && (
              <button
                onClick={() =>
                  onSearchChange('')
                }
                className="
                  absolute
                  right-2.5
                  top-1/2
                  -translate-y-1/2
                  p-1
                  text-[#91847D]
                  hover:text-[#A82018]
                  cursor-pointer
                "
                aria-label="Hapus Pencarian"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

          </div>

          <button
            onClick={() => {
              setIsMobileSearchActive(false);
              scrollToSection('catalog');
            }}
            className="
              shrink-0
              rounded-full
              bg-[#D92D20]
              px-4 py-2.5
              text-xs
              font-bold
              text-white
              transition-all
              hover:bg-[#74140F]
              active:scale-95
              cursor-pointer
            "
          >
            Cari
          </button>
        </div>
      )}

      {/* =====================================================
          PUSH DROP-DOWN MENU
      ====================================================== */}

      {isMenuOpen && (
        <div
          id="push-dropdown-menu"
          className="
            animate-slide-down
            overflow-hidden
            border-b border-[#EED6C8]
            bg-[#FFFDFC]/98
            shadow-2xl
            shadow-[#74140F]/10
            backdrop-blur-2xl
          "
        >
          <div
            className="
              mx-auto
              max-w-7xl
              space-y-6
              px-4 py-6
              sm:px-6
              lg:px-8
            "
          >

            {/* Dropdown Header */}
            <div
              className="
                flex items-center
                justify-between
                border-b border-[#F1DDD3]
                pb-4
              "
            >
              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-9 w-9
                    items-center justify-center
                    rounded-xl
                    border border-[#F1D2C2]
                    bg-[#FFF1E8]
                  "
                >
                  <LayoutGrid
                    className="
                      h-4 w-4
                      text-[#D92D20]
                    "
                  />
                </div>

                <div>
                  <h3
                    className="
                      font-display
                      text-sm
                      font-semibold
                      text-[#74140F]
                    "
                  >
                    Menu Cepat BONLES
                  </h3>

                  <p
                    className="
                      mt-0.5
                      text-[10px]
                      text-[#766B65]
                    "
                  >
                    Navigasi & kategori camilan khas Borneo
                  </p>
                </div>

              </div>

              <button
                onClick={onToggleMenu}
                className="
                  flex items-center gap-1.5
                  rounded-full
                  border border-[#EED6C8]
                  bg-[#FFF5EF]
                  px-3 py-1.5
                  text-[10px]
                  font-semibold
                  text-[#766B65]
                  transition-all
                  hover:border-[#F04438]
                  hover:text-[#A82018]
                  cursor-pointer
                "
              >
                <X className="h-3.5 w-3.5" />
                <span>Tutup</span>
              </button>

            </div>

            {/* Navigation */}
            <div>

              <span className="bonles-eyebrow mb-3 block">
                Navigasi Halaman
              </span>

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                  sm:grid-cols-4
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
                    flex items-center gap-3
                    rounded-2xl
                    border border-[#F1DDD3]
                    bg-[#FFF9F4]
                    p-3.5
                    text-left
                    transition-all
                    hover:border-[#F97316]
                    hover:bg-[#FFF1E8]
                    cursor-pointer
                  "
                >
                  <div
                    className="
                      flex
                      h-9 w-9
                      shrink-0
                      items-center justify-center
                      rounded-xl
                      bg-[#FFE5D6]
                      text-[#A82018]
                      transition-all
                      group-hover:bg-[#D92D20]
                      group-hover:text-white
                    "
                  >
                    <Home className="h-4 w-4" />
                  </div>

                  <div>
                    <span
                      className="
                        block
                        text-xs
                        font-bold
                        text-[#302824]
                      "
                    >
                      Beranda
                    </span>

                    <span
                      className="
                        text-[10px]
                        text-[#7A706A]
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
                    flex items-center gap-3
                    rounded-2xl
                    border border-[#F1DDD3]
                    bg-[#FFF9F4]
                    p-3.5
                    text-left
                    transition-all
                    hover:border-[#F97316]
                    hover:bg-[#FFF1E8]
                    cursor-pointer
                  "
                >
                  <div
                    className="
                      flex
                      h-9 w-9
                      shrink-0
                      items-center justify-center
                      rounded-xl
                      bg-[#FFE5D6]
                      text-[#E85D04]
                      transition-all
                      group-hover:bg-[#D92D20]
                      group-hover:text-white
                    "
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </div>

                  <div>
                    <span
                      className="
                        block
                        text-xs
                        font-bold
                        text-[#302824]
                      "
                    >
                      Katalog Snack
                    </span>

                    <span
                      className="
                        text-[10px]
                        text-[#7A706A]
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
                    flex items-center gap-3
                    rounded-2xl
                    border border-[#F1DDD3]
                    bg-[#FFF9F4]
                    p-3.5
                    text-left
                    transition-all
                    hover:border-[#F97316]
                    hover:bg-[#FFF1E8]
                    cursor-pointer
                  "
                >
                  <div
                    className="
                      flex
                      h-9 w-9
                      shrink-0
                      items-center justify-center
                      rounded-xl
                      bg-[#FFE5D6]
                      text-[#E85D04]
                      transition-all
                      group-hover:bg-[#D92D20]
                      group-hover:text-white
                    "
                  >
                    <BookOpen className="h-4 w-4" />
                  </div>

                  <div>
                    <span
                      className="
                        block
                        text-xs
                        font-bold
                        text-[#302824]
                      "
                    >
                      Our Story
                    </span>

                    <span
                      className="
                        text-[10px]
                        text-[#7A706A]
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
                    flex items-center gap-3
                    rounded-2xl
                    border border-[#F1DDD3]
                    bg-[#FFF9F4]
                    p-3.5
                    text-left
                    transition-all
                    hover:border-[#F97316]
                    hover:bg-[#FFF1E8]
                    cursor-pointer
                  "
                >
                  <div
                    className="
                      flex
                      h-9 w-9
                      shrink-0
                      items-center justify-center
                      rounded-xl
                      bg-[#FFE5D6]
                      text-[#E85D04]
                      transition-all
                      group-hover:bg-[#D92D20]
                      group-hover:text-white
                    "
                  >
                    <ShieldCheck className="h-4 w-4" />
                  </div>

                  <div>
                    <span
                      className="
                        block
                        text-xs
                        font-bold
                        text-[#302824]
                      "
                    >
                      Tentang Kami
                    </span>

                    <span
                      className="
                        text-[10px]
                        text-[#7A706A]
                      "
                    >
                      Standar Mutu Pangan
                    </span>
                  </div>
                </button>

              </div>
            </div>

            {/* =================================================
                CATEGORIES
            ================================================== */}

            {categories.length > 0 && (
              <div>

                <span className="bonles-eyebrow mb-3 block">
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
                      flex items-center gap-1.5
                      rounded-full
                      border border-[#74140F]
                      bg-[#74140F]
                      px-3.5 py-2
                      text-[10px]
                      font-bold
                      text-white
                      transition-all
                      hover:bg-[#D92D20]
                      cursor-pointer
                    "
                  >
                    <Sparkles
                      className="
                        h-3 w-3
                        text-[#FFD166]
                      "
                    />

                    <span>
                      Semua Kategori
                    </span>
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
                        flex items-center gap-1.5
                        rounded-full
                        border border-[#EED6C8]
                        bg-[#FFF9F4]
                        px-3.5 py-2
                        text-[10px]
                        font-semibold
                        text-[#463C38]
                        transition-all
                        hover:border-[#F97316]
                        hover:bg-[#FFF1E8]
                        hover:text-[#C2410C]
                        cursor-pointer
                      "
                    >
                      <Flame
                        className="
                          h-3 w-3
                          text-[#F97316]
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

            {/* =================================================
                CONTACT CARD
            ================================================== */}

            <div
              className="
                flex flex-col
                gap-4
                rounded-2xl
                border border-[#F0CBB7]
                bg-gradient-to-r
                from-[#FFF1E8]
                via-[#FFF8F3]
                to-[#FFF4D8]
                p-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div className="space-y-1.5">

                <div
                  className="
                    flex items-center gap-2
                    text-xs
                    font-bold
                    text-[#74140F]
                  "
                >
                  <MessageCircle
                    className="
                      h-4 w-4
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
                    font-medium
                    text-[#514640]
                  "
                >
                  +{waNumber} • {email}
                </p>

                <p
                  className="
                    flex items-center gap-1.5
                    text-[10px]
                    text-[#766B65]
                  "
                >
                  <MapPin
                    className="
                      h-3 w-3
                      shrink-0
                      text-[#E85D04]
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
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-gradient-to-r
                  from-[#168A4A]
                  to-[#20A85A]
                  px-5 py-2.5
                  text-[10px]
                  font-bold
                  tracking-wide
                  text-white
                  shadow-sm
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >
                <span>
                  Buka Chat WhatsApp
                </span>

                <ArrowRight className="h-3.5 w-3.5" />
              </a>

            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
