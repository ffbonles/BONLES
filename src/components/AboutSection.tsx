import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Fish,
  Sparkles,
  MapPin,
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
    settings['ABOUT_TITLE'] ||
    'Dari Borneo, diolah menjadi cerita yang bernilai.';

  const aboutEyebrow = settings['ABOUT_EYEBROW'] || 'Our Story';

  const aboutDescription =
    settings['ABOUT_DESCRIPTION'] ||
    'Berawal dari kekayaan hasil perairan Kalimantan Timur, kami ingin membuktikan bahwa pangan lokal Borneo dapat diolah menjadi camilan modern yang memiliki nilai dan cerita.';

  const aboutDescription2 =
    settings['ABOUT_DESCRIPTION_2'] ||
    'Ikan Bawis kami pilih dan olah menjadi keripik ikan tanpa tulang tengah, sehingga menghasilkan camilan yang renyah, praktis, dan kaya protein.';

  const aboutDescription3 =
    settings['ABOUT_DESCRIPTION_3'] ||
    'Melalui BONLES, kami ingin membawa cita rasa dan kekayaan pangan lokal Borneo lebih dekat dengan masyarakat Indonesia, sekaligus membuka cerita tentang potensi pangan lokal kepada dunia.';

  const values = [
    {
      number: '01',
      title: settings['ABOUT_VALUE_1_TITLE'] || 'Khas Borneo',
      description:
        settings['ABOUT_VALUE_1_TEXT'] ||
        'Berangkat dari kekayaan hasil perairan dan pangan lokal Kalimantan Timur.',
      icon: MapPin,
      iconStyle:
        'border-[#F04438]/30 bg-[#F04438]/8 text-[#D92D20] group-hover:border-[#F04438] group-hover:bg-[#F04438] group-hover:text-white',
    },
    {
      number: '02',
      title: settings['ABOUT_VALUE_2_TITLE'] || 'Ikan Bawis',
      description:
        settings['ABOUT_VALUE_2_TEXT'] ||
        'Diolah menjadi keripik ikan tanpa tulang tengah yang renyah, praktis, dan kaya protein.',
      icon: Fish,
      iconStyle:
        'border-[#F97316]/30 bg-[#F97316]/8 text-[#EA580C] group-hover:border-[#F97316] group-hover:bg-[#F97316] group-hover:text-white',
    },
    {
      number: '03',
      title: settings['ABOUT_VALUE_3_TITLE'] || 'Modern Craft',
      description:
        settings['ABOUT_VALUE_3_TEXT'] ||
        'Pangan lokal diolah menjadi camilan modern dengan nilai dan pengalaman yang lebih tinggi.',
      icon: Sparkles,
      iconStyle:
        'border-[#FFB703]/40 bg-[#FFB703]/10 text-[#D97706] group-hover:border-[#FFB703] group-hover:bg-[#FFB703] group-hover:text-[#7F1712]',
    },
    {
      number: '04',
      title: settings['ABOUT_VALUE_4_TITLE'] || 'From Borneo to the World',
      description:
        settings['ABOUT_VALUE_4_TEXT'] ||
        'Membawa cerita, cita rasa, dan potensi pangan lokal Borneo lebih jauh.',
      icon: HeartHandshake,
      iconStyle:
        'border-[#F04438]/30 bg-[#F04438]/8 text-[#D92D20] group-hover:border-[#F04438] group-hover:bg-[#F04438] group-hover:text-white',
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-[#F3D2BD] bg-[#FFF9F4] py-20 sm:py-24 lg:py-32"
    >
      {/* =========================================================
          BACKGROUND DECORATION
      ========================================================== */}

      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#F04438]/8 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#FFB703]/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F97316]/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">

          {/* =====================================================
              LEFT — BRAND VISUAL
          ====================================================== */}

          <div className="lg:col-span-5">
            <div className="relative">

              {/* Corner accents */}
              <div
                className="absolute -left-3 -top-3 z-10 h-16 w-16 border-l-2 border-t-2 border-[#F04438]"
                aria-hidden="true"
              />

              <div
                className="absolute -bottom-3 -right-3 z-10 h-16 w-16 border-b-2 border-r-2 border-[#FFB703]"
                aria-hidden="true"
              />

              {/* Image container */}
              <div className="relative overflow-hidden rounded-[1.75rem] border border-[#F3D2BD] bg-white p-2 shadow-[0_24px_70px_rgba(127,23,18,0.12)]">

                <div className="relative overflow-hidden rounded-[1.35rem]">

                  <img
                    src={BONLES_IMAGES.heroBanner}
                    alt="BONLES Food Nusantara — Cita Rasa Borneo"
                    referrerPolicy="no-referrer"
                    className="h-[22rem] w-full object-cover transition-transform duration-700 hover:scale-[1.025] sm:h-[28rem]"
                  />

                  {/* Image overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#65100C]/95 via-[#8F1712]/25 to-transparent"
                    aria-hidden="true"
                  />

                  {/* Logo */}
                  <div className="absolute left-5 top-5 rounded-xl border border-white/70 bg-white/95 p-2.5 shadow-xl backdrop-blur-md sm:left-6 sm:top-6">
                    <BonlesLogo size="sm" variant="horizontal" />
                  </div>

                  {/* Image copy */}
                  <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7">
                    <div className="border-l-2 border-[#FFB703] pl-4">

                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FFB703]" />

                        <span className="font-brand text-[9px] font-bold uppercase tracking-[0.25em] text-[#FFD166]">
                          Born in Borneo
                        </span>
                      </div>

                      <p className="mt-2 max-w-sm font-display text-xl leading-[1.15] text-white sm:text-2xl">
                        Kekayaan pangan lokal,
                        <span className="block italic text-[#FFE08A]">
                          dalam bentuk yang modern.
                        </span>
                      </p>

                    </div>
                  </div>

                </div>
              </div>

              {/* Location line */}
              <div className="mt-5 flex items-center justify-between px-1">
                <span className="font-brand text-[9px] font-bold uppercase tracking-[0.25em] text-[#C92C22]">
                  EAST BORNEO • INDONESIA
                </span>

                <div className="flex items-center gap-2">
                  <span className="h-px w-10 bg-[#F97316]/50 sm:w-16" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFB703]" />
                </div>
              </div>

            </div>
          </div>

          {/* =====================================================
              RIGHT — STORY
          ====================================================== */}

          <div className="lg:col-span-7">
            <div className="max-w-2xl">

              {/* Section label */}
              <div className="mb-5 flex items-center gap-3">
                <span className="h-1 w-9 rounded-full bg-gradient-to-r from-[#F04438] to-[#FFB703]" />

                <span className="font-brand text-[10px] font-bold uppercase tracking-[0.25em] text-[#D9382E]">
                  {aboutEyebrow}
                </span>
              </div>

              {/* Heading */}
              <h2 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-[#74140F] sm:text-5xl lg:text-6xl">
                {aboutTitle}
              </h2>

              {/* Accent divider */}
              <div className="mt-7 flex items-center gap-3">
                <span className="h-1 w-14 rounded-full bg-[#F04438]" />
                <span className="h-2 w-2 rounded-full bg-[#FFB703]" />
                <span className="h-px w-12 bg-[#F97316]/40" />
              </div>

              {/* Story */}
              <div className="mt-7 space-y-5">
                <p className="text-base leading-8 text-[#5F514B] sm:text-lg">
                  {aboutDescription}
                </p>

                <p className="text-base leading-8 text-[#5F514B]">
                  {aboutDescription2}
                </p>

                <p className="text-base leading-8 text-[#5F514B]">
                  {aboutDescription3}
                </p>
              </div>

              {/* =================================================
                  VALUES
              ================================================== */}

              <div className="mt-10 grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-x-8">

                {values.map((value) => {
                  const Icon = value.icon;

                  return (
                    <div
                      key={value.number}
                      className="group border-t border-[#EBCFBE] py-6 transition-all duration-300 first:pt-5 sm:py-6"
                    >
                      <div className="flex items-start gap-4">

                        {/* Icon */}
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${value.iconStyle}`}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </span>

                        {/* Content */}
                        <div className="min-w-0">

                          <div className="flex items-center gap-2">
                            <span className="font-brand text-[8px] font-bold uppercase tracking-[0.22em] text-[#F97316]">
                              {value.number}
                            </span>

                            <span className="h-px w-4 bg-[#F3D2BD]" />
                          </div>

                          <h3 className="mt-1 font-display text-lg font-semibold text-[#74140F] transition-colors duration-300 group-hover:text-[#D9382E]">
                            {value.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-[#756963]">
                            {value.description}
                          </p>

                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>

              {/* =================================================
                  BRAND STATEMENT
              ================================================== */}

              <div className="relative mt-8 overflow-hidden rounded-2xl border border-[#F1C6AA] bg-gradient-to-r from-[#FFF1E8] via-[#FFF8F2] to-[#FFF3D1] p-5 sm:p-6">

                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#FFB703]/15 blur-2xl"
                  aria-hidden="true"
                />

                <div className="relative flex items-start gap-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F04438]/10">
                    <ShieldCheck className="h-4.5 w-4.5 text-[#D92D20]" />
                  </div>

                  <div>
                    <span className="font-brand text-[8px] font-bold uppercase tracking-[0.22em] text-[#F97316]">
                      BONLES PHILOSOPHY
                    </span>

                    <p className="mt-1 font-display text-base italic leading-7 text-[#74140F] sm:text-lg">
                      “Cita rasa Borneo dalam bentuk yang lebih modern,
                      praktis, dan bernilai.”
                    </p>
                  </div>

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
