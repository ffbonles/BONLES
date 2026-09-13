import React from 'react';
import { Home, LayoutGrid, ShoppingBag, MessageCircle, Menu, X } from 'lucide-react';

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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-orange-200/90 shadow-[0_-4px_24px_rgba(255,106,0,0.12)] transition-all"
    >
      <div className="max-w-md mx-auto px-3 py-2 flex items-center justify-between">
        {/* 1. Beranda Button */}
        <button
          onClick={onNavigateHome}
          id="btn-nav-home"
          className="flex-1 flex flex-col items-center justify-center py-1 text-stone-600 hover:text-[#FF5500] active:scale-95 transition-all cursor-pointer group"
          aria-label="Halaman Beranda"
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-orange-50 group-hover:bg-orange-100 transition-colors border border-orange-200/80">
            <Home className="w-4 h-4 text-[#FF7B00]" />
          </div>
          <span className="text-[10px] font-bold tracking-wide mt-1 text-stone-700 group-hover:text-[#FF5500]">
            Beranda
          </span>
        </button>

        {/* 2. Katalog Button */}
        <button
          onClick={onNavigateCatalog}
          id="btn-nav-catalog"
          className="flex-1 flex flex-col items-center justify-center py-1 text-stone-600 hover:text-[#FF5500] active:scale-95 transition-all cursor-pointer group"
          aria-label="Buka Katalog Snack"
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-orange-50 group-hover:bg-orange-100 transition-colors border border-orange-200/80">
            <LayoutGrid className="w-4 h-4 text-[#FF7B00]" />
          </div>
          <span className="text-[10px] font-bold tracking-wide mt-1 text-stone-700 group-hover:text-[#FF5500]">
            Katalog
          </span>
        </button>

        {/* 3. Keranjang Button (Prominent Center Button) */}
        <button
          onClick={onOpenCart}
          id="btn-nav-cart"
          className="flex-1 flex flex-col items-center justify-center py-1 text-stone-600 active:scale-95 transition-all cursor-pointer relative group"
          aria-label="Buka Keranjang Belanja"
        >
          <div className="relative w-11 h-11 -mt-2 rounded-full flex items-center justify-center bg-gradient-to-r from-[#FF5500] via-[#FF7B00] to-[#FFAA00] text-white shadow-lg shadow-orange-500/35 border-2 border-white">
            <ShoppingBag className="w-5 h-5 text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#EA3A1E] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce border-2 border-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-extrabold tracking-wide mt-0.5 text-[#D95A00]">
            Keranjang
          </span>
        </button>

        {/* 4. WhatsApp CS Button */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          id="btn-nav-whatsapp"
          className="flex-1 flex flex-col items-center justify-center py-1 text-stone-600 hover:text-emerald-600 active:scale-95 transition-all cursor-pointer group"
          aria-label="Chat WhatsApp CS Resmi"
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-emerald-50 group-hover:bg-emerald-100 transition-colors border border-emerald-300">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-[10px] font-bold tracking-wide mt-1 text-stone-700 group-hover:text-emerald-600">
            Chat WA
          </span>
        </a>

        {/* 5. Menu Push Dropdown Toggle Button */}
        <button
          onClick={onToggleMenu}
          id="btn-nav-menu-toggle"
          className="flex-1 flex flex-col items-center justify-center py-1 text-stone-600 hover:text-[#FF5500] active:scale-95 transition-all cursor-pointer group"
          aria-label={isMenuOpen ? 'Tutup Menu' : 'Buka Menu Lengkap'}
          aria-expanded={isMenuOpen}
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border ${
              isMenuOpen
                ? 'bg-gradient-to-r from-[#FF5500] to-[#FFAA00] text-white border-orange-400 shadow-sm'
                : 'bg-orange-50 group-hover:bg-orange-100 border-orange-200/80 text-[#FF7B00]'
            }`}
          >
            {isMenuOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4" />}
          </div>
          <span className="text-[10px] font-bold tracking-wide mt-1 text-stone-700 group-hover:text-[#FF5500]">
            {isMenuOpen ? 'Tutup' : 'Menu'}
          </span>
        </button>
      </div>
    </nav>
  );
};
