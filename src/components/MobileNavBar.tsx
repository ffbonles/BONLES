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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#16080A]/95 backdrop-blur-xl border-t border-[#D82824]/25 shadow-[0_-8px_24px_rgba(0,0,0,0.5)] transition-all"
    >
      <div className="max-w-md mx-auto px-3 py-2 flex items-center justify-between">
        {/* 1. Beranda Button */}
        <button
          onClick={onNavigateHome}
          id="btn-nav-home"
          className="flex-1 flex flex-col items-center justify-center py-1.5 text-[#D1C3B2] hover:text-[#F5A623] active:scale-95 transition-all cursor-pointer group"
          aria-label="Halaman Beranda"
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#230C10]/60 group-hover:bg-[#341117] transition-colors border border-[#D82824]/20">
            <Home className="w-4 h-4 text-[#F5A623]" />
          </div>
          <span className="text-[10px] font-medium tracking-wide mt-1 text-[#E5D8C7]">
            Beranda
          </span>
        </button>

        {/* 2. Katalog Button */}
        <button
          onClick={onNavigateCatalog}
          id="btn-nav-catalog"
          className="flex-1 flex flex-col items-center justify-center py-1.5 text-[#D1C3B2] hover:text-[#F5A623] active:scale-95 transition-all cursor-pointer group"
          aria-label="Buka Katalog Snack"
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#230C10]/60 group-hover:bg-[#341117] transition-colors border border-[#D82824]/20">
            <LayoutGrid className="w-4 h-4 text-[#F5A623]" />
          </div>
          <span className="text-[10px] font-medium tracking-wide mt-1 text-[#E5D8C7]">
            Katalog
          </span>
        </button>

        {/* 3. Keranjang Button (Prominent Center Button) */}
        <button
          onClick={onOpenCart}
          id="btn-nav-cart"
          className="flex-1 flex flex-col items-center justify-center py-1.5 text-[#D1C3B2] active:scale-95 transition-all cursor-pointer relative group"
          aria-label="Buka Keranjang Belanja"
        >
          <div className="relative w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#D82824] via-[#B71C1C] to-[#801316] text-white shadow-lg shadow-[#D82824]/40 border border-[#FF6B6B]/40">
            <ShoppingBag className="w-4 h-4 text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F5A623] text-black text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-wide mt-1 text-[#FFF4E0]">
            Keranjang
          </span>
        </button>

        {/* 4. WhatsApp CS Button */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          id="btn-nav-whatsapp"
          className="flex-1 flex flex-col items-center justify-center py-1.5 text-[#D1C3B2] hover:text-[#00D222] active:scale-95 transition-all cursor-pointer group"
          aria-label="Chat WhatsApp CS Resmi"
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#00D222]/15 group-hover:bg-[#00D222]/25 transition-colors border border-[#00D222]/40">
            <MessageCircle className="w-4 h-4 text-[#00D222]" />
          </div>
          <span className="text-[10px] font-medium tracking-wide mt-1 text-[#D1C3B2] group-hover:text-[#00D222]">
            Chat WA
          </span>
        </a>

        {/* 5. Menu Push Dropdown Toggle Button */}
        <button
          onClick={onToggleMenu}
          id="btn-nav-menu-toggle"
          className="flex-1 flex flex-col items-center justify-center py-1.5 text-[#D1C3B2] hover:text-[#F5A623] active:scale-95 transition-all cursor-pointer group"
          aria-label={isMenuOpen ? 'Tutup Menu' : 'Buka Menu Lengkap'}
          aria-expanded={isMenuOpen}
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border ${
              isMenuOpen
                ? 'bg-[#D82824] text-white border-[#FF7070]'
                : 'bg-[#230C10]/60 group-hover:bg-[#341117] border-[#D82824]/20 text-[#F5A623]'
            }`}
          >
            {isMenuOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4" />}
          </div>
          <span className="text-[10px] font-medium tracking-wide mt-1 text-[#E5D8C7]">
            {isMenuOpen ? 'Tutup' : 'Menu'}
          </span>
        </button>
      </div>
    </nav>
  );
};
