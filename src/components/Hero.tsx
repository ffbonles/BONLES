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
    <section className="relative overflow-hidden border-b border-[#D82824]/20 bg-[#160709]">
      {/* Warm ambient glows tailored for comfortable visual atmosphere */}
      <div className="absolute top-0 right-1/4 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-[#D82824]/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[#F5A623]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-60 sm:w-80 h-60 sm:h-80 bg-[#00D222]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#260C11] border border-[#D82824]/30 rounded-xl shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#00D222] animate-pulse shrink-0" />
              <span className="text-[10px] sm:text-[11px] tracking-wider text-[#F5A623] font-bold uppercase truncate">
                {heroBadge}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif-luxury text-[#FFFDF9] tracking-tight leading-[1.2]">
              {heroTitle}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-[#E2D4C3] max-w-xl leading-relaxed font-light">
              {heroSubtitle}
            </p>

            {/* Feature Badges with Packaging Touch-Friendly Warm Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 sm:pt-2 max-w-lg">
              <div className="bg-[#240C11] border border-[#D82824]/25 p-2.5 sm:p-3 rounded-xl hover:border-[#D82824] transition-colors shadow-sm text-center sm:text-left">
                <Flame className="w-4 h-4 text-[#E53935] mx-auto sm:mx-0 mb-1" />
                <p className="text-[11px] sm:text-xs font-semibold text-[#FFFDF9]">Tinggi Protein</p>
                <p className="text-[9px] sm:text-[10px] text-[#A89886] hidden sm:block">Nutrisi padat alami</p>
              </div>
              <div className="bg-[#240C11] border border-[#00D222]/25 p-2.5 sm:p-3 rounded-xl hover:border-[#00D222] transition-colors shadow-sm text-center sm:text-left">
                <PackageCheck className="w-4 h-4 text-[#00D222] mx-auto sm:mx-0 mb-1" />
                <p className="text-[11px] sm:text-xs font-semibold text-[#FFFDF9]">Kemasan Pouch</p>
                <p className="text-[9px] sm:text-[10px] text-[#A89886] hidden sm:block">Aluminium zipper foil</p>
              </div>
              <div className="bg-[#240C11] border border-[#F5A623]/25 p-2.5 sm:p-3 rounded-xl hover:border-[#F5A623] transition-colors shadow-sm text-center sm:text-left">
                <Award className="w-4 h-4 text-[#F5A623] mx-auto sm:mx-0 mb-1" />
                <p className="text-[11px] sm:text-xs font-semibold text-[#FFFDF9]">Rasa Autentik</p>
                <p className="text-[9px] sm:text-[10px] text-[#A89886] hidden sm:block">Rempah asli nusantara</p>
              </div>
            </div>

            {/* CTAs with Comfortable Mobile Touch Targets */}
            <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-4">
              <button
                onClick={onExploreCatalog}
                id="hero-btn-catalog"
                className="flex-1 sm:flex-initial bg-gradient-to-r from-[#D82824] via-[#BE1A18] to-[#991313] hover:from-[#E53935] hover:to-[#B71C1C] text-white font-semibold px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#D82824]/25 hover:shadow-[#D82824]/40 active:scale-95 transition-all cursor-pointer min-h-[44px]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buka Katalog Snack</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onFeaturedClick}
                id="hero-btn-featured"
                className="flex-1 sm:flex-initial bg-[#260C11] hover:bg-[#341117] text-[#FFF1D6] border border-[#F5A623]/40 hover:border-[#F5A623] px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 min-h-[44px]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F5A623]" />
                <span>Koleksi Pilihan</span>
              </button>
            </div>
          </div>

          {/* Right Column Featured Visual / Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-[#240C11] border border-[#D82824]/30 rounded-2xl p-3 sm:p-4 shadow-2xl">
              {/* Packaging Signature Gradient Accent */}
              <div className="absolute top-0 left-4 right-4 h-[3px] bg-gradient-to-r from-[#D82824] via-[#F5A623] to-[#00D222] rounded-full" />

              <div className="relative h-56 sm:h-72 lg:h-80 w-full overflow-hidden rounded-xl bg-[#140608]">
                <img
                  src={banner?.IMAGE_URL || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
                  alt="PT Bonles Food Nusantara Snack Kemasan"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center opacity-95 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#240C11] via-transparent to-transparent opacity-85" />

                {/* Floating Brand Badge */}
                <div className="absolute top-3 right-3 bg-[#16080A]/90 backdrop-blur-sm border border-[#D82824]/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E53935]" />
                  <span className="text-[10px] text-white font-bold tracking-widest uppercase">
                    ORIGINAL PACKAGING
                  </span>
                </div>

                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                  <span className="text-[9px] sm:text-[10px] tracking-wider font-bold text-[#F5A623] uppercase bg-[#140608]/90 px-2 py-0.5 rounded-md inline-block mb-1 border border-[#F5A623]/40">
                    Oleh-Oleh Khas Nusantara
                  </span>
                  <h3 className="text-base sm:text-lg font-serif-luxury text-[#FFFDF9] font-medium leading-snug">
                    Amplang Ikan Tenggiri & Aneka Keripik
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#C8B8A6]">Kemasan Pouch Zipper • Renyah & Bernutrisi</p>
                </div>
              </div>

              {/* Bottom Quick Info Strip */}
              <div className="mt-3 sm:mt-4 pt-2.5 border-t border-[#D82824]/20 flex items-center justify-between text-[11px] sm:text-xs text-[#A89886]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#00D222] animate-pulse" />
                  <span className="text-[#FFF5E6] font-medium">Stok Siap Kirim</span>
                </div>
                <span className="text-[#F5A623] font-semibold tracking-wide text-[11px]">ORDER VIA WHATSAPP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
