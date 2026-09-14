import React from 'react';
import {
  Home,
  LayoutGrid,
  ShoppingBag,
  MessageCircle,
  Menu,
  X,
} from 'lucide-react';

interface MobileNavBarProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigateHome: () => void;
  onNavigateCatalog: () => void;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  waNumber?: string;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  cartCount,
  onOpenCart,
  onNavigateHome,
  onNavigateCatalog,
  isMenuOpen,
  onToggleMenu,
  waNumber = '6285174333902',
}) => {
  const cleanWa = waNumber.replace(/[^0-9]/g, '');

  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    'Halo PT. BONLES FOOD NUSANTARA, saya ingin memesan camilan khas dan menanyakan ketersediaan produk.'
  )}`;

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Navigasi Utama Ponsel"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E8CFC2]/80 bg-[#FFFDFC]/95 shadow-[0_-10px_35px_rgba(127,23,18,0.10)] backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto flex max-w-md items-end justify-between px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 sm:px-4">

        {/* =====================================================
            BERANDA
        ====================================================== */}

        <button
          onClick={onNavigateHome}
          id="btn-nav-home"
          className="group flex min-w-0 flex-1 flex-col items-center justify-center py-1.5 transition-all duration-200 active:scale-90"
          aria-label="Halaman Beranda"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#F1DDD3] bg-[#FFF5EF] transition-all duration-200 group-hover:border-[#F04438]/40 group-hover:bg-[#FEEAE3]">
            <Home className="h-[17px] w-[17px] text-[#B92B21] transition-transform duration-200 group-hover:-translate-y-0.5" />
          </div>

          <span className="mt-1.5 text-[9px] font-bold tracking-wide text-[#6F625D] transition-colors group-hover:text-[#B92B21]">
            Beranda
          </span>
        </button>

        {/* =====================================================
            KATALOG
        ====================================================== */}

        <button
          onClick={onNavigateCatalog}
          id="btn-nav-catalog"
          className="group flex min-w-0 flex-1 flex-col items-center justify-center py-1.5 transition-all duration-200 active:scale-90"
          aria-label="Buka Katalog Snack"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#F1DDD3] bg-[#FFF5EF] transition-all duration-200 group-hover:border-[#F97316]/40 group-hover:bg-[#FFF0E6]">
            <LayoutGrid className="h-[17px] w-[17px] text-[#E85D04] transition-transform duration-200 group-hover:scale-105" />
          </div>

          <span className="mt-1.5 text-[9px] font-bold tracking-wide text-[#6F625D] transition-colors group-hover:text-[#E85D04]">
            Katalog
          </span>
        </button>

        {/* =====================================================
            KERANJANG — PRIMARY ACTION
        ====================================================== */}

        <button
          onClick={onOpenCart}
          id="btn-nav-cart"
          className="group relative flex min-w-0 flex-1 flex-col items-center justify-center py-1 transition-all duration-200 active:scale-90"
          aria-label="Buka Keranjang Belanja"
        >
          <div className="relative -mt-5">

            {/* Outer glow */}
            <div
              className="absolute inset-0 rounded-full bg-[#F04438]/20 blur-md"
              aria-hidden="true"
            />

            {/* Main button */}
            <div className="relative flex h-[3.35rem] w-[3.35rem] items-center justify-center rounded-full border-[3px] border-[#FFFDFC] bg-gradient-to-br from-[#C91F16] via-[#F04438] to-[#FFB703] text-white shadow-[0_8px_24px_rgba(217,45,32,0.30)] transition-transform duration-200 group-hover:-translate-y-0.5">

              <ShoppingBag className="h-5 w-5 text-white" />

              {/* Cart badge */}
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#74140F] text-[9px] font-black text-white shadow-md">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
          </div>

          <span className="mt-1 text-[9px] font-extrabold tracking-wide text-[#B92B21]">
            Keranjang
          </span>
        </button>

        {/* =====================================================
            WHATSAPP
        ====================================================== */}

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          id="btn-nav-whatsapp"
          className="group flex min-w-0 flex-1 flex-col items-center justify-center py-1.5 transition-all duration-200 active:scale-90"
          aria-label="Chat WhatsApp CS Resmi"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#B7DEC8] bg-[#EFFAF3] transition-all duration-200 group-hover:border-[#82C99D] group-hover:bg-[#E1F5E8]">
            <MessageCircle className="h-[17px] w-[17px] text-[#168A4A] transition-transform duration-200 group-hover:scale-105" />
          </div>

          <span className="mt-1.5 text-[9px] font-bold tracking-wide text-[#6F625D] transition-colors group-hover:text-[#168A4A]">
            Chat WA
          </span>
        </a>

        {/* =====================================================
            MENU
        ====================================================== */}

        <button
          onClick={onToggleMenu}
          id="btn-nav-menu-toggle"
          className="group flex min-w-0 flex-1 flex-col items-center justify-center py-1.5 transition-all duration-200 active:scale-90"
          aria-label={isMenuOpen ? 'Tutup Menu' : 'Buka Menu Lengkap'}
          aria-expanded={isMenuOpen}
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 ${
              isMenuOpen
                ? 'border-[#D92D20] bg-gradient-to-br from-[#B91C1C] to-[#F04438] shadow-[0_5px_15px_rgba(217,45,32,0.22)]'
                : 'border-[#F1DDD3] bg-[#FFF5EF] group-hover:border-[#F04438]/40 group-hover:bg-[#FEEAE3]'
            }`}
          >
            {isMenuOpen ? (
              <X className="h-[17px] w-[17px] text-white" />
            ) : (
              <Menu className="h-[17px] w-[17px] text-[#B92B21]" />
            )}
          </div>

          <span
            className={`mt-1.5 text-[9px] font-bold tracking-wide transition-colors ${
              isMenuOpen
                ? 'text-[#B92B21]'
                : 'text-[#6F625D] group-hover:text-[#B92B21]'
            }`}
          >
            {isMenuOpen ? 'Tutup' : 'Menu'}
          </span>
        </button>

      </div>
    </nav>
  );
};
