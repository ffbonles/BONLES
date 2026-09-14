import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Zap,
  Award,
  PackageCheck,
  ShieldCheck,
} from 'lucide-react';
import { BonlesLogo } from './BonlesLogo';
import { BONLES_IMAGES } from '../assets/productImages';
import { store } from '../services/store';

export const AboutSection: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>(
    () => store.getSettingsMap()
  );

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setSettings(store.getSettingsMap());
    });

    return unsubscribe;
  }, []);

  const aboutTitle =
    settings['ABOUT_TITLE'] || 'PT. Bonles Food Nusantara';

  const aboutDescription =
    settings['ABOUT_DESCRIPTION'] ||
    'PT. Bonles Food Nusantara berdedikasi menciptakan inovasi camilan snack kemasan sehat dan oleh-oleh berkualitas tinggi. Melalui perpaduan bahan baku nabati pilihan seperti kedelai nusantara dan rempah tradisional, kami menghadirkan produk snack dengan positioning unggulan: Snack Tinggi Protein dalam Kemasan Pouch Modern yang lezat, higienis, dan praktis dibawa ke mana saja.';

  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-[#D8C9B3] bg-[#FCFAF5] py-20 sm:py-24 lg:py-32"
    >
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#B18B4B]/5 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#09271F]/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">

          {/* =====================================================
              LEFT — BRAND VISUAL
          ====================================================== */}
          <div className="lg:col-span-5">
            <div className="relative">

              {/* Decorative corner */}
              <div
                className="absolute -left-3 -top-3 z-10 h-16 w-16 border-l border-t border-[#B18B4B]/70"
                aria-hidden="true"
              />

              <div
                className="absolute -bottom-3 -right-3 z-10 h-16 w-16 border-b border-r border-[#B18B4B]/70"
                aria-hidden="true"
              />

              {/* Main image card */}
              <div className="relative overflow-hidden rounded-[1.5rem] border border-[#D8C9B3] bg-white p-2 shadow-[0_20px_50px_rgba(9,39,31,0.10)]">
                <div className="relative overflow-hidden rounded-[1.15rem]">

                  <img
                    src={BONLES_IMAGES.heroBanner}
                    alt="Produksi dan Kemasan Snack PT. Bonles Food Nusantara"
                    referrerPolicy="no-referrer"
                    className="h-80 w-full object-cover transition-transform duration-700 hover:scale-[1.02] sm:h-[26rem]"
                  />

                  {/* Image overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#09271F]/90 via-[#09271F]/10 to-transparent"
                    aria-hidden="true"
                  />

                  {/* Logo */}
                  <div className="absolute left-5 top-5 rounded-xl border border-white/70 bg-[#FCFAF5]/95 p-2.5 shadow-lg backdrop-blur-sm">
                    <BonlesLogo size="sm" variant="horizontal" />
                  </div>

                  {/* Caption */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="border-l-2 border-[#D8B878] pl-4">

                      <div className="flex items-center gap-2">
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-[#D8B878]"
                          aria-hidden="true"
                        />

                        <span className="font-brand text-[9px] font-semibold uppercase tracking-[0.24em] text-[#D8B878]">
                          Brand Heritage
                        </span>
                      </div>

                      <p className="mt-2 max-w-sm font-display text-xl leading-tight text-white sm:text-2xl">
                        Inovasi lokal dengan karakter yang modern.
                      </p>

                    </div>
                  </div>
                </div>
              </div>

              {/* Brand label */}
              <div className="mt-5 flex items-center justify-between px-1">
                <span className="font-brand text-[9px] uppercase tracking-[0.25em] text-[#9E793A]">
                  BONLES FOOD NUSANTARA
                </span>

                <span className="h-px w-16 bg-[#B18B4B]/50 sm:w-24" />
              </div>
            </div>
          </div>

          {/* =====================================================
              RIGHT — BRAND STORY
          ====================================================== */}
          <div className="lg:col-span-7">
            <div className="max-w-2xl">

              {/* Eyebrow */}
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-[#B18B4B]" />

                <span className="font-brand text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9E793A]">
                  Tentang Brand Kami
                </span>
              </div>

              {/* Heading */}
              <h2 className="font-display text-4xl font-semibold leading-[1.08] text-[#09271F] sm:text-5xl lg:text-6xl">
                {aboutTitle}
              </h2>

              {/* Gold divider */}
              <div className="mt-7 flex items-center gap-3">
                <span className="h-px w-12 bg-[#B18B4B]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#B18B4B]" />
              </div>

              {/* Description */}
              <p className="mt-7 text-base leading-8 text-[#4B554F] sm:text-lg">
                {aboutDescription}
              </p>

              {/* Values */}
              <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">

                {/* Value 01 */}
                <div className="group border-t border-[#D8C9B3] pt-5">
                  <div className="flex items-center gap-3">

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B18B4B]/40 text-[#9E793A] transition-all duration-300 group-hover:border-[#B18B4B] group-hover:bg-[#B18B4B]/5">
                      <Zap className="h-4 w-4" />
                    </span>

                    <div>
                      <span className="font-brand text-[8px] uppercase tracking-[0.22em] text-[#9E793A]">
                        01
                      </span>

                      <h3 className="mt-0.5 font-display text-lg text-[#09271F]">
                        Nutrisi Tinggi Protein
                      </h3>
                    </div>

                  </div>

                  <p className="mt-3 pl-[3.25rem] text-sm leading-6 text-[#65706A]">
                    Diolah dengan teknik pemanggangan presisi guna menjaga
                    keutuhan gizi alami kedelai dan bahan pangan lokal.
                  </p>
                </div>

                {/* Value 02 */}
                <div className="group border-t border-[#D8C9B3] pt-5">
                  <div className="flex items-center gap-3">

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B18B4B]/40 text-[#9E793A] transition-all duration-300 group-hover:border-[#B18B4B] group-hover:bg-[#B18B4B]/5">
                      <PackageCheck className="h-4 w-4" />
                    </span>

                    <div>
                      <span className="font-brand text-[8px] uppercase tracking-[0.22em] text-[#9E793A]">
                        02
                      </span>

                      <h3 className="mt-0.5 font-display text-lg text-[#09271F]">
                        Kemasan Pouch Zipper
                      </h3>
                    </div>

                  </div>

                  <p className="mt-3 pl-[3.25rem] text-sm leading-6 text-[#65706A]">
                    Kemasan kedap udara aluminium foil yang menjaga kerenyahan
                    maksimal serta higienis dan mudah ditutup kembali.
                  </p>
                </div>

                {/* Value 03 */}
                <div className="group border-t border-[#D8C9B3] pt-5">
                  <div className="flex items-center gap-3">

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B18B4B]/40 text-[#9E793A] transition-all duration-300 group-hover:border-[#B18B4B] group-hover:bg-[#B18B4B]/5">
                      <Award className="h-4 w-4" />
                    </span>

                    <div>
                      <span className="font-brand text-[8px] uppercase tracking-[0.22em] text-[#9E793A]">
                        03
                      </span>

                      <h3 className="mt-0.5 font-display text-lg text-[#09271F]">
                        Cita Rasa Nusantara
                      </h3>
                    </div>

                  </div>

                  <p className="mt-3 pl-[3.25rem] text-sm leading-6 text-[#65706A]">
                    Formula bumbu rempah autentik tanpa bahan pengawet berlebih
                    untuk kenikmatan rasa yang otentik.
                  </p>
                </div>

                {/* Value 04 */}
                <div className="group border-t border-[#D8C9B3] pt-5">
                  <div className="flex items-center gap-3">

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B18B4B]/40 text-[#9E793A] transition-all duration-300 group-hover:border-[#B18B4B] group-hover:bg-[#B18B4B]/5">
                      <HeartHandshake className="h-4 w-4" />
                    </span>

                    <div>
                      <span className="font-brand text-[8px] uppercase tracking-[0.22em] text-[#9E793A]">
                        04
                      </span>

                      <h3 className="mt-0.5 font-display text-lg text-[#09271F]">
                        Pemberdayaan Petani
                      </h3>
                    </div>

                  </div>

                  <p className="mt-3 pl-[3.25rem] text-sm leading-6 text-[#65706A]">
                    Mendukung ketahanan pangan dan kesejahteraan petani kedelai
                    serta hasil bumi lokal Indonesia.
                  </p>
                </div>

              </div>

              {/* Brand statement */}
              <div className="mt-10 border-t border-[#D8C9B3] pt-6">
                <div className="flex items-start gap-4">

                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#9E793A]" />

                  <p className="font-display text-base italic leading-7 text-[#09271F] sm:text-lg">
                    Menghadirkan camilan berkualitas dengan perhatian pada
                    bahan, proses, rasa, dan pengalaman.
                  </p>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
