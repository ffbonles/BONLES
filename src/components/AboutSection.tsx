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

  const aboutDescription =
    settings['ABOUT_DESCRIPTION'] ||
    'Berawal dari kekayaan hasil perairan Kalimantan Timur, kami ingin membuktikan bahwa pangan lokal Borneo dapat diolah menjadi camilan modern yang memiliki nilai dan cerita.';

  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-[#F2C4A8] bg-[#FFF9F4] py-20 sm:py-24 lg:py-32"
    >
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#F04438]/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#FFB703]/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-[#F97316]/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">

          {/* LEFT — VISUAL */}
          <div className="lg:col-span-5">
            <div className="relative">

              <div
                className="absolute -left-3 -top-3 z-10 h-16 w-16 border-l-2 border-t-2 border-[#F04438]/70"
                aria-hidden="true"
              />

              <div
                className="absolute -bottom-3 -right-3 z-10 h-16 w-16 border-b-2 border-r-2 border-[#FFB703]/80"
                aria-hidden="true"
              />

              <div className="relative overflow-hidden rounded-[1.5rem] border border-[#F2C4A8] bg-white p-2 shadow-[0_20px_50px_rgba(240,68,56,0.12)]">
                <div className="relative overflow-hidden rounded-[1.15rem]">

                  <img
                    src={BONLES_IMAGES.heroBanner}
                    alt="BONLES Food Nusantara — Cita Rasa Borneo"
                    referrerPolicy="no-referrer"
                    className="h-80 w-full object-cover transition-transform duration-700 hover:scale-[1.02] sm:h-[26rem]"
                  />

                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#8F1712]/90 via-[#D92D20]/15 to-transparent"
                    aria-hidden="true"
                  />

                  <div className="absolute left-5 top-5 rounded-xl border border-white/80 bg-white/95 p-2.5 shadow-lg backdrop-blur-sm">
                    <BonlesLogo size="sm" variant="horizontal" />
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="border-l-2 border-[#FFB703] pl-4">

                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FFB703]" />

                        <span className="font-brand text-[9px] font-semibold uppercase tracking-[0.24em] text-[#FFD166]">
                          Born in Borneo
                        </span>
                      </div>

                      <p className="mt-2 max-w-sm font-display text-xl leading-tight text-white sm:text-2xl">
                        Kekayaan pangan lokal,
                        <span className="block italic text-[#FFE08A]">
                          dalam bentuk yang modern.
                        </span>
                      </p>

                    </div>
                  </div>

                </div>
              </div>

              <div className="mt-5 flex items-center justify-between px-1">
                <span className="font-brand text-[9px] font-semibold uppercase tracking-[0.25em] text-[#D9382E]">
                  EAST BORNEO • INDONESIA
                </span>

                <span className="h-px w-16 bg-[#F97316]/60 sm:w-24" />
              </div>

            </div>
          </div>

          {/* RIGHT — STORY */}
          <div className="lg:col-span-7">
            <div className="max-w-2xl">

              <div className="mb-5 flex items-center gap-3">
                <span className="h-1 w-8 rounded-full bg-gradient-to-r from-[#F04438] to-[#FFB703]" />

                <span className="font-brand text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D9382E]">
                  Our Story
                </span>
              </div>

              <h2 className="font-display text-4xl font-semibold leading-[1.08] text-[#7F1712] sm:text-5xl lg:text-6xl">
                {aboutTitle}
              </h2>

              <div className="mt-7 flex items-center gap-3">
                <span className="h-1 w-12 rounded-full bg-[#F04438]" />
                <span className="h-2 w-2 rounded-full bg-[#FFB703]" />
              </div>

              <div className="mt-7 space-y-5">
                <p className="text-base leading-8 text-[#5F514B] sm:text-lg">
                  {aboutDescription}
                </p>

                <p className="text-base leading-8 text-[#5F514B]">
                  Ikan Bawis kami pilih dan olah menjadi keripik ikan tanpa
                  tulang tengah, sehingga menghasilkan camilan yang renyah,
                  praktis, dan kaya protein.
                </p>

                <p className="text-base leading-8 text-[#5F514B]">
                  Melalui BONLES, kami ingin membawa cita rasa dan kekayaan
                  pangan lokal Borneo lebih dekat dengan masyarakat Indonesia,
                  sekaligus membuka cerita tentang potensi pangan lokal kepada
                  dunia.
                </p>
              </div>

              {/* VALUES */}
              <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">

                {/* 01 */}
                <div className="group border-t border-[#F2C4A8] pt-5 transition-colors duration-300 hover:border-[#F04438]">
                  <div className="flex items-center gap-3">

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F04438]/35 bg-[#F04438]/5 text-[#D9382E] transition-all duration-300 group-hover:border-[#F04438] group-hover:bg-[#F04438] group-hover:text-white">
                      <MapPin className="h-4 w-4" />
                    </span>

                    <div>
                      <span className="font-brand text-[8px] font-semibold uppercase tracking-[0.22em] text-[#F97316]">
                        01
                      </span>

                      <h3 className="mt-0.5 font-display text-lg text-[#7F1712]">
                        Khas Borneo
                      </h3>
                    </div>

                  </div>

                  <p className="mt-3 pl-[3.25rem] text-sm leading-6 text-[#756963]">
                    Berangkat dari kekayaan hasil perairan dan pangan lokal
                    Kalimantan Timur.
                  </p>
                </div>

                {/* 02 */}
                <div className="group border-t border-[#F2C4A8] pt-5 transition-colors duration-300 hover:border-[#F04438]">
                  <div className="flex items-center gap-3">

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F04438]/35 bg-[#F04438]/5 text-[#D9382E] transition-all duration-300 group-hover:border-[#F04438] group-hover:bg-[#F04438] group-hover:text-white">
                      <Fish className="h-4 w-4" />
                    </span>

                    <div>
                      <span className="font-brand text-[8px] font-semibold uppercase tracking-[0.22em] text-[#F97316]">
                        02
                      </span>

                      <h3 className="mt-0.5 font-display text-lg text-[#7F1712]">
                        Ikan Bawis
                      </h3>
                    </div>

                  </div>

                  <p className="mt-3 pl-[3.25rem] text-sm leading-6 text-[#756963]">
                    Diolah menjadi keripik ikan tanpa tulang tengah yang renyah,
                    praktis, dan kaya protein.
                  </p>
                </div>

                {/* 03 */}
                <div className="group border-t border-[#F2C4A8] pt-5 transition-colors duration-300 hover:border-[#F04438]">
                  <div className="flex items-center gap-3">

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#FFB703]/45 bg-[#FFB703]/10 text-[#D97706] transition-all duration-300 group-hover:border-[#FFB703] group-hover:bg-[#FFB703] group-hover:text-[#7F1712]">
                      <Sparkles className="h-4 w-4" />
                    </span>

                    <div>
                      <span className="font-brand text-[8px] font-semibold uppercase tracking-[0.22em] text-[#F97316]">
                        03
                      </span>

                      <h3 className="mt-0.5 font-display text-lg text-[#7F1712]">
                        Modern Craft
                      </h3>
                    </div>

                  </div>

                  <p className="mt-3 pl-[3.25rem] text-sm leading-6 text-[#756963]">
                    Pangan lokal diolah menjadi camilan modern dengan nilai dan
                    pengalaman yang lebih tinggi.
                  </p>
                </div>

                {/* 04 */}
                <div className="group border-t border-[#F2C4A8] pt-5 transition-colors duration-300 hover:border-[#F04438]">
                  <div className="flex items-center gap-3">

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F04438]/35 bg-[#F04438]/5 text-[#D9382E] transition-all duration-300 group-hover:border-[#F04438] group-hover:bg-[#F04438] group-hover:text-white">
                      <HeartHandshake className="h-4 w-4" />
                    </span>

                    <div>
                      <span className="font-brand text-[8px] font-semibold uppercase tracking-[0.22em] text-[#F97316]">
                        04
                      </span>

                      <h3 className="mt-0.5 font-display text-lg text-[#7F1712]">
                        From Borneo to the World
                      </h3>
                    </div>

                  </div>

                  <p className="mt-3 pl-[3.25rem] text-sm leading-6 text-[#756963]">
                    Membawa cerita, cita rasa, dan potensi pangan lokal Borneo
                    lebih jauh.
                  </p>
                </div>

              </div>

              {/* Brand statement */}
              <div className="mt-10 border-t border-[#F2C4A8] pt-6">
                <div className="flex items-start gap-4">

                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#F04438]" />

                  <p className="font-display text-base italic leading-7 text-[#7F1712] sm:text-lg">
                    “Cita rasa Borneo dalam bentuk yang lebih modern, praktis,
                    dan bernilai.”
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
