import React, { useState, useEffect } from 'react';
import { ShieldCheck, HeartHandshake, Zap, Award, PackageCheck } from 'lucide-react';
import { BonlesLogo } from './BonlesLogo';
import { BONLES_IMAGES } from '../assets/productImages';
import { store } from '../services/store';

export const AboutSection: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>(() => store.getSettingsMap());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setSettings(store.getSettingsMap());
    });
    return unsubscribe;
  }, []);

  const aboutTitle = settings['ABOUT_TITLE'] || 'PT. Bonles Food Nusantara';
  const aboutDescription = settings['ABOUT_DESCRIPTION'] || 
    'PT. Bonles Food Nusantara berdedikasi menciptakan inovasi camilan snack kemasan sehat dan oleh-oleh berkualitas tinggi. Melalui perpaduan bahan baku nabati pilihan seperti kedelai nusantara dan rempah tradisional, kami menghadirkan produk snack dengan positioning unggulan: Snack Tinggi Protein dalam Kemasan Pouch Modern yang lezat, higienis, dan praktis dibawa ke mana saja.';

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-[#FFF8F0] via-white to-[#FFF5EB] border-t border-orange-200/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual Bento with Brand Key Visual Logo */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-white border border-orange-200 p-2.5 shadow-xl shadow-orange-500/10">
              <img
                src={BONLES_IMAGES.heroBanner}
                alt="Produksi dan Kemasan Snack PT. Bonles Food Nusantara"
                referrerPolicy="no-referrer"
                className="w-full h-80 object-cover rounded-2xl"
              />
              <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-orange-200 shadow-md">
                <BonlesLogo size="sm" variant="horizontal" />
              </div>

              <div className="absolute bottom-5 left-5 right-5 bg-stone-900/90 backdrop-blur-md p-4 rounded-2xl border border-orange-400/30 text-white">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] tracking-[0.2em] font-extrabold text-amber-400 uppercase block">
                    Key Visual & Kemasan Pouch
                  </span>
                </div>
                <p className="text-xs text-stone-200 mt-1 font-normal">
                  Inovasi camilan ringan kemasan standing pouch zipper berkualitas premium dengan cita rasa nusantara.
                </p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs tracking-[0.25em] text-[#EA580C] font-extrabold uppercase">
                  Tentang Brand Kami
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif-luxury text-stone-900 font-bold leading-tight">
                {aboutTitle}
              </h2>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed font-normal">
              {aboutDescription}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white border border-orange-100 p-4 rounded-2xl space-y-2 hover:border-orange-300 transition-all shadow-xs hover:shadow-md group">
                <div className="flex items-center gap-2 text-[#EA580C]">
                  <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Nutrisi Tinggi Protein
                  </h3>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Diolah dengan teknik pemanggangan presisi guna menjaga keutuhan gizi alami kedelai dan bahan pangan lokal.
                </p>
              </div>

              <div className="bg-white border border-emerald-100 p-4 rounded-2xl space-y-2 hover:border-emerald-300 transition-all shadow-xs hover:shadow-md group">
                <div className="flex items-center gap-2 text-emerald-600">
                  <PackageCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Kemasan Pouch Zipper
                  </h3>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Kemasan kedap udara aluminium foil yang menjaga kerenyahan maksimal serta higienis dan mudah ditutup kembali.
                </p>
              </div>

              <div className="bg-white border border-amber-100 p-4 rounded-2xl space-y-2 hover:border-amber-300 transition-all shadow-xs hover:shadow-md group">
                <div className="flex items-center gap-2 text-amber-500">
                  <Award className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Cita Rasa Nusantara
                  </h3>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Formula bumbu rempah autentik tanpa bahan pengawet berlebih untuk kenikmatan rasa yang otentik.
                </p>
              </div>

              <div className="bg-white border border-orange-100 p-4 rounded-2xl space-y-2 hover:border-orange-300 transition-all shadow-xs hover:shadow-md group">
                <div className="flex items-center gap-2 text-[#FF7A00]">
                  <HeartHandshake className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Pemberdayaan Petani
                  </h3>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Mendukung ketahanan pangan dan kesejahteraan petani kedelai serta hasil bumi lokal Indonesia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
