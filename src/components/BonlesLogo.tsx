import React from 'react';

/**
 * BONLES FOOD NUSANTARA
 * Main brand logo
 *
 * Source:
 * Google Drive
 * File ID: 1-Jx5r3beNRUhML37QbWnfskpaa8S26HG
 */

const LOGO_FILE_ID = '1-Jx5r3beNRUhML37QbWnfskpaa8S26HG';

/**
 * Google Drive image URL.
 *
 * File permission must be:
 * "Anyone with the link" -> Viewer
 */
export const BONLES_LOGO_URL =
  `https://drive.google.com/uc?export=view&id=${LOGO_FILE_ID}`;

export type BonlesLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type BonlesLogoVariant = 'horizontal' | 'stacked';

interface BonlesLogoProps {
  size?: BonlesLogoSize;
  variant?: BonlesLogoVariant;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
}

const sizeClasses: Record<BonlesLogoSize, string> = {
  xs: 'h-8',
  sm: 'h-10',
  md: 'h-12',
  lg: 'h-16',
  xl: 'h-24',
};

export const BonlesLogo: React.FC<BonlesLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  className = '',
  priority = false,
  onClick,
}) => {
  const isClickable = Boolean(onClick);

  return (
    <div
      className={`
        inline-flex
        items-center
        justify-center
        shrink-0
        ${variant === 'stacked' ? 'flex-col' : 'flex-row'}
        ${isClickable ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(event) => {
        if (!isClickable) return;

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.();
        }
      }}
      aria-label="BONLES FOOD NUSANTARA"
    >
      <img
        src={BONLES_LOGO_URL}
        alt="BONLES FOOD NUSANTARA"
        className={`
          ${sizeClasses[size]}
          w-auto
          max-w-[220px]
          object-contain
          object-center
          select-none
        `}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
      />
    </div>
  );
};

export default BonlesLogo;
Navbar.tsx

Navbar berikut dibuat agar logo asli dari Drive menjadi pusat identitas header, dengan tampilan premium, sticky, responsive, smooth-scroll, dan CTA WhatsApp.

import React, { useEffect, useState } from 'react';
import {
  Menu,
  X,
  MessageCircle,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

import { BonlesLogo } from './BonlesLogo';
import { store } from '../services/store';

interface NavbarProps {
  onOpenAdminLogin?: () => void;
  isAuthenticated?: boolean;
}

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Beranda',
    href: '#home',
  },
  {
    label: 'Produk',
    href: '#catalog',
  },
  {
    label: 'Cerita Kami',
    href: '#story',
  },
  {
    label: 'Keunggulan',
    href: '#advantages',
  },
  {
    label: 'Kontak',
    href: '#contact',
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdminLogin,
  isAuthenticated = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [settings, setSettings] = useState<Record<string, string>>(() =>
    store.getSettingsMap()
  );

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setSettings(store.getSettingsMap());
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const storeName =
    settings['STORE_NAME'] || 'PT. BONLES FOOD NUSANTARA';

  const waNumber =
    settings['WHATSAPP_NUMBER'] || '6285174333902';

  const cleanWaNumber = waNumber.replace(/\D/g, '');

  const whatsappUrl = cleanWaNumber
    ? `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
        'Halo BONLES FOOD NUSANTARA, saya ingin mengetahui produk BONLES.'
      )}`
    : '#';

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);

    if (!href.startsWith('#')) return;

    const element = document.querySelector(href);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <>
      <header
        className={`
          fixed
          inset-x-0
          top-0
          z-[100]
          transition-all
          duration-500
          ease-out
          ${
            isScrolled
              ? 'border-b border-[#D9A441]/15 bg-[#100406]/95 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl'
              : 'bg-gradient-to-b from-black/55 via-black/20 to-transparent'
          }
        `}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={`
              flex
              items-center
              justify-between
              transition-all
              duration-500
              ${
                isScrolled
                  ? 'h-[72px]'
                  : 'h-[84px]'
              }
            `}
          >
            {/* =====================================================
                LOGO
            ====================================================== */}
            <button
              type="button"
              onClick={() => handleNavClick('#home')}
              className="
                group
                flex
                shrink-0
                items-center
                outline-none
                focus-visible:ring-2
                focus-visible:ring-[#F5A623]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-transparent
              "
              aria-label={`${storeName} - Beranda`}
            >
              <BonlesLogo
                size={isScrolled ? 'sm' : 'md'}
                variant="horizontal"
                priority
                className="
                  transition-transform
                  duration-500
                  group-hover:scale-[1.03]
                "
              />
            </button>

            {/* =====================================================
                DESKTOP NAVIGATION
            ====================================================== */}
            <nav
              className="
                hidden
                items-center
                gap-1
                lg:flex
              "
              aria-label="Navigasi utama"
            >
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleNavClick(item.href)}
                  className="
                    group
                    relative
                    px-4
                    py-3
                    text-[13px]
                    font-medium
                    tracking-[0.02em]
                    text-[#F5EFE6]/85
                    transition-colors
                    duration-300
                    hover:text-white
                  "
                >
                  {item.label}

                  <span
                    className="
                      absolute
                      bottom-1
                      left-4
                      right-4
                      h-px
                      origin-left
                      scale-x-0
                      bg-gradient-to-r
                      from-[#F5A623]
                      to-[#D82824]
                      transition-transform
                      duration-300
                      group-hover:scale-x-100
                    "
                  />
                </button>
              ))}
            </nav>

            {/* =====================================================
                DESKTOP CTA
            ====================================================== */}
            <div className="hidden items-center gap-3 lg:flex">
              {onOpenAdminLogin && (
                <button
                  type="button"
                  onClick={onOpenAdminLogin}
                  className="
                    group
                    flex
                    h-10
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/10
                    px-3
                    text-[#F5EFE6]/55
                    transition-all
                    duration-300
                    hover:border-[#F5A623]/30
                    hover:bg-white/5
                    hover:text-[#F5EFE6]
                  "
                  aria-label={
                    isAuthenticated
                      ? 'Buka panel admin'
                      : 'Login admin'
                  }
                  title={
                    isAuthenticated
                      ? 'Buka panel admin'
                      : 'Login admin'
                  }
                >
                  <ShieldCheck
                    size={14}
                    strokeWidth={1.7}
                  />

                  <span className="text-[11px] font-medium tracking-wide">
                    {isAuthenticated ? 'Admin' : 'Staff'}
                  </span>
                </button>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[#D82824]
                  px-5
                  py-2.5
                  text-[12px]
                  font-semibold
                  tracking-wide
                  text-white
                  shadow-[0_8px_24px_rgba(216,40,36,0.24)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#B91F1C]
                  hover:shadow-[0_12px_30px_rgba(216,40,36,0.34)]
                "
              >
                <MessageCircle
                  size={15}
                  strokeWidth={2}
                />

                <span>Pesan Sekarang</span>

                <ArrowUpRight
                  size={13}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                />
              </a>
            </div>

            {/* =====================================================
                MOBILE BUTTON
            ====================================================== */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-[#D82824]
                  text-white
                  shadow-[0_8px_24px_rgba(216,40,36,0.24)]
                  transition-transform
                  active:scale-95
                "
                aria-label="Hubungi BONLES melalui WhatsApp"
              >
                <MessageCircle
                  size={18}
                  strokeWidth={2}
                />
              </a>

              <button
                type="button"
                onClick={() => setIsMobileOpen((value) => !value)}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/15
                  bg-black/20
                  text-[#F5EFE6]
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:border-[#F5A623]/40
                  hover:bg-white/10
                "
                aria-label={
                  isMobileOpen
                    ? 'Tutup menu'
                    : 'Buka menu'
                }
                aria-expanded={isMobileOpen}
              >
                {isMobileOpen ? (
                  <X size={20} />
                ) : (
                  <Menu size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================
          MOBILE MENU
      ========================================================== */}
      <div
        className={`
          fixed
          inset-0
          z-[90]
          lg:hidden
          transition-all
          duration-500
          ${
            isMobileOpen
              ? 'pointer-events-auto visible opacity-100'
              : 'pointer-events-none invisible opacity-0'
          }
        `}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setIsMobileOpen(false)}
          className="
            absolute
            inset-0
            bg-black/65
            backdrop-blur-sm
          "
        />

        {/* Menu Panel */}
        <div
          className={`
            absolute
            inset-x-0
            top-0
            overflow-hidden
            rounded-b-[28px]
            border-b
            border-[#D9A441]/15
            bg-[#100406]
            shadow-[0_30px_80px_rgba(0,0,0,0.45)]
            transition-transform
            duration-500
            ${
              isMobileOpen
                ? 'translate-y-0'
                : '-translate-y-full'
            }
          `}
        >
          <div className="px-5 pb-7 pt-24">
            {/* Mobile logo */}
            <div className="mb-7 border-b border-white/10 pb-6">
              <BonlesLogo
                size="md"
                variant="horizontal"
              />
            </div>

            {/* Mobile navigation */}
            <nav
              className="space-y-1"
              aria-label="Navigasi mobile"
            >
              {NAV_ITEMS.map((item, index) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleNavClick(item.href)}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-4
                    py-4
                    text-left
                    text-[15px]
                    font-medium
                    text-[#F5EFE6]/80
                    transition-all
                    duration-300
                    hover:bg-white/5
                    hover:text-white
                  "
                >
                  <span>
                    <span className="mr-3 text-[10px] tracking-widest text-[#F5A623]/60">
                      0{index + 1}
                    </span>

                    {item.label}
                  </span>

                  <ArrowUpRight
                    size={15}
                    className="text-[#F5A623]/60"
                  />
                </button>
              ))}
            </nav>

            {/* Mobile WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileOpen(false)}
              className="
                mt-6
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#D82824]
                px-5
                py-4
                text-sm
                font-semibold
                text-white
                shadow-[0_12px_30px_rgba(216,40,36,0.24)]
                transition-all
                duration-300
                hover:bg-[#B91F1C]
              "
            >
              <MessageCircle size={18} />

              <span>Pesan Sekarang</span>

              <ArrowUpRight size={15} />
            </a>

            {/* Admin */}
            {onOpenAdminLogin && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileOpen(false);
                  onOpenAdminLogin();
                }}
                className="
                  mt-3
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-white/10
                  px-5
                  py-3
                  text-xs
                  font-medium
                  text-[#F5EFE6]/55
                  transition-all
                  duration-300
                  hover:border-[#F5A623]/30
                  hover:bg-white/5
                  hover:text-[#F5EFE6]
                "
              >
                <ShieldCheck size={15} />

                <span>
                  {isAuthenticated
                    ? 'Buka Panel Admin'
                    : 'Akses Staff'}
                </span>
              </button>
            )}

            <p className="mt-6 text-center text-[10px] tracking-[0.18em] text-[#A89886]/50">
              {storeName}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
