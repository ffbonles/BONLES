import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Award, PackageCheck, ShoppingBag, MessageCircle } from 'lucide-react';
import { Banner } from '../types';
import { store } from '../services/store';

interface HeroProps {
  banner?: Banner;
  onExploreCatalog: () => void;
  onFeaturedClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ banner, onExploreCatalog, onFeaturedClick }) => {
  const [settings, setSettings] = useState<Record<string, string>>(() => store.getSettingsMap());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setSettings(store.getSettingsMap());
    });
    return unsubscribe;
  }, []);

  const heroBadge = settings['HERO_BADGE'] || 'PT. BONLES FOOD NUSANTARA • OFFICIAL STORE';
  const heroTitle = banner?.TITLE || settings['HERO_TITLE'] || 'Inovasi Snack Kemasan Pouch Tinggi Protein';
  const heroSubtitle = banner?.DESCRIPTION || settings['HERO_SUBTITLE'] ||
    'Cita rasa asli oleh-oleh Nusantara dengan bahan baku segar pilihan dalam kemasan standing pouch zipper higienis. Camilan renyah, gurih, dan bernutrisi tinggi untuk keluarga tercinta.';

  return (
    <section className="relative overflow-hidden border-b border-orange-200/80 bg-gradient-to-b from-[#FFF5E6] via-[#FFF9F0] to-[#FAF6ED]">
      {/* Warm ambient glows tailored for appetite-stimulating visual energy */}
      <div className="absolute top-0 right-1/4 w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] bg-gradient-to-br from-amber-300/35 to-orange-400/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[300px] sm:w-[420px] h-[300px] sm:h-[420px] bg-yellow-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-60 sm:w-80 h-60 sm:h-80 bg-orange-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-orange-200 rounded-xl shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[10px] sm:text-[11px] tracking-wider text-[#D95A00] font-extrabold uppercase truncate">
                {heroBadge}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#2B1408] tracking-tight leading-[1.2] font-bold">
              {heroTitle.includes('Tinggi Protein') ? (
                <>
                  {heroTitle.split('Tinggi Protein')[0]}
                  <span className="bg-gradient-to-r from-[#FF5500] to-[#FFAA00] bg-clip-text text-transparent underline decoration-orange-300/50">
                    Tinggi Protein
                  </span>
                  {heroTitle.split('Tinggi Protein')[1]}
                </>
              ) : (
                heroTitle
              )}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-[#5C402E] max-w-xl leading-relaxed font-normal">
              {heroSubtitle}
            </p>

            {/* Feature Badges with Crispy Appetite-Enticing Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 sm:pt-2 max-w-lg">
              <div className="bg-white border border-orange-200/90 p-2.5 sm:p-3 rounded-xl hover:border-orange-400 transition-all shadow-xs hover:shadow-md text-center sm:text-left group">
                <Flame className="w-4 h-4 text-[#FF5500] mx-auto sm:mx-0 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] sm:text-xs font-bold text-[#2B1408]">Tinggi Protein</p>
                <p className="text-[9px] sm:text-[10px] text-[#7A604E] hidden sm:block">Nutrisi padat alami</p>
              </div>
              <div className="bg-white border border-orange-200/90 p-2.5 sm:p-3 rounded-xl hover:border-emerald-400 transition-all shadow-xs hover:shadow-md text-center sm:text-left group">
                <PackageCheck className="w-4 h-4 text-emerald-600 mx-auto sm:mx-0 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] sm:text-xs font-bold text-[#2B1408]">Kemasan Pouch</p>
                <p className="text-[9px] sm:text-[10px] text-[#7A604E] hidden sm:block">Aluminium zipper foil</p>
              </div>
              <div className="bg-white border border-orange-200/90 p-2.5 sm:p-3 rounded-xl hover:border-amber-400 transition-all shadow-xs hover:shadow-md text-center sm:text-left group">
                <Award className="w-4 h-4 text-[#FFAA00] mx-auto sm:mx-0 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] sm:text-xs font-bold text-[#2B1408]">Rasa Autentik</p>
                <p className="text-[9px] sm:text-[10px] text-[#7A604E] hidden sm:block">Rempah asli nusantara</p>
              </div>
            </div>

            {/* CTAs with High Energy Appetizing Colors */}
            <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-4">
              <button
                onClick={onExploreCatalog}
                id="hero-btn-catalog"
                className="flex-1 sm:flex-initial bg-gradient-to-r from-[#FF5500] via-[#FF7B00] to-[#FFAA00] hover:from-[#FF4500] hover:to-[#FF9500] text-white font-extrabold px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 active:scale-95 transition-all cursor-pointer min-h-[44px]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buka Katalog Snack</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onFeaturedClick}
                id="hero-btn-featured"
                className="flex-1 sm:flex-initial bg-white hover:bg-orange-50 text-[#D95A00] border border-orange-300 hover:border-orange-500 font-bold px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 min-h-[44px]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFAA00]" />
                <span>Koleksi Pilihan</span>
              </button>
            </div>
          </div>

          {/* Right Column Featured Visual / Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white border border-orange-200/90 rounded-2xl p-3 sm:p-4 shadow-xl shadow-orange-500/10">
              {/* Packaging Signature Gradient Accent */}
              <div className="absolute top-0 left-4 right-4 h-[3px] bg-gradient-to-r from-[#FF5500] via-[#FFAA00] to-[#10B981] rounded-full" />

              <div className="relative h-56 sm:h-72 lg:h-80 w-full overflow-hidden rounded-xl bg-orange-50">
                <img
                  src={banner?.IMAGE_URL || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
                  alt="PT Bonles Food Nusantara Snack Kemasan"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B1408]/85 via-[#2B1408]/20 to-transparent" />

                {/* Floating Brand Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm border border-orange-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
                  <span className="text-[10px] text-[#2B1408] font-extrabold tracking-widest uppercase">
                    ORIGINAL PACKAGING
                  </span>
                </div>

                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                  <span className="text-[9px] sm:text-[10px] tracking-wider font-extrabold text-[#2B1408] uppercase bg-[#FFAA00] px-2 py-0.5 rounded-md inline-block mb-1 shadow-xs">
                    Oleh-Oleh Khas Nusantara
                  </span>
                  <h3 className="text-base sm:text-lg font-serif text-white font-bold leading-snug">
                    Amplang Ikan Tenggiri & Aneka Keripik
                  </h3>
                  <p className="text-[11px] sm:text-xs text-orange-100 font-medium">Kemasan Pouch Zipper • Renyah & Bernutrisi</p>
                </div>
              </div>

              {/* Bottom Quick Info Strip */}
              <div className="mt-3 sm:mt-4 pt-2.5 border-t border-orange-100 flex items-center justify-between text-[11px] sm:text-xs text-[#5C402E]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[#2B1408] font-bold">Stok Siap Kirim</span>
                </div>
                <span className="text-[#FF5500] font-extrabold tracking-wide text-[11px]">ORDER VIA WHATSAPP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
