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
      className="relative overflow-hidden border-t border-[#D8C9B3] bg-[#FCFAF5] py-20 sm:py-24 lg:py-32"
    >
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#B18B4B]/5 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#09271F]/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">

          {/* LEFT — VISUAL */}
          <div className="lg:col-span-5">
            <div className="relative">

              <div
                className="absolute -left-3 -top-3 z-10 h-16 w-16 border-l border-t border-[#B18B4B]/70"
                aria-hidden="true"
              />

              <div
                className="absolute -bottom-3 -right-3 z-10 h-16 w-16 border-b border-r border-[#B18B4B]/70"
                aria-hidden="true"
              />

              <div className="relative overflow-hidden rounded-[1.5rem] border border-[#D8C9B3] bg-white p-2 shadow-[0_20px_50px_rgba(9,39,31,0.10)]">
                <div className="relative overflow-hidden rounded-[1.15rem]">

                  <img
                    src={BONLES_IMAGES.heroBanner}
                    alt="BONLES Food Nusantara — Cita Rasa Borneo"
                    referrerPolicy="no-referrer"
                    className="h-80 w-full object-cover transition-transform duration-700 hover:scale-[1.02] sm:h-[26rem]"
                  />

                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#09271F]/90 via-[#09271F]/10 to-transparent"
                    aria-hidden="true"
                  />

                  <div className="absolute left-5 top-5 rounded-xl border border-white/70 bg-[#FCFAF5]/95 p-2.5 shadow-lg backdrop-blur-sm">
                    <BonlesLogo size="sm" variant="horizontal" />
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="border-l-2 border-[#D8B878] pl-4">

                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D8B878]" />

                        <span className="font-brand text-[9px] font-semibold uppercase tracking-[0.24em] text-[#D8B878]">
                          Born in Borneo
                        </span>
                      </div>

                      <p className="mt-2 max-w-sm font-display text-xl leading-tight text-white sm:text-2xl">
                        Kekayaan pangan lokal,
                        <span className="block italic">
                          dalam bentuk yang modern.
                        </span>
                      </p>

                    </div>
                  </div>

                </div>
              </div>

              <div className="mt-5 flex items-center justify-between px-1">
                <span className="font-brand text-[9px] uppercase tracking-[0.25em] text-[#9E793A]">
                  EAST BORNEO • INDONESIA
                </span>

                <span className="h-px w-16 bg-[#B18B4B]/50 sm:w-24" />
              </div>

            </div>
          </div>

          {/* RIGHT — STORY */}
          <div className="lg:col-span-7">
            <div className="max-w-2xl">

              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-[#B18B4B]" />

                <span className="font-brand text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9E793A]">
                  Our Story
                </span>
              </div>

              <h2 className="font-display text-4xl font-semibold leading-[1.08] text-[#09271F] sm:text-5xl lg:text-6xl">
                {aboutTitle}
              </h2>

              <div className="mt-7 flex items-center gap-3">
                <span className="h-px w-12 bg-[#B18B4B]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#B18B4B]" />
              </div>

              <div className="mt-7 space-y-5">
                <p className="text-base leading-8 text-[#4B554F] sm:text-lg">
                  {aboutDescription}
                </p>

                <p className="text-base leading-8 text-[#4B554F]">
                  Ikan Bawis kami pilih dan olah menjadi keripik ikan tanpa
                  tulang tengah, sehingga menghasilkan camilan yang renyah,
                  praktis, dan kaya protein.
                </p>

                <p className="text-base leading-8 text-[#4B554F]">
                  Melalui BONLES, kami ingin membawa cita rasa dan kekayaan
                  pangan lokal Borneo lebih dekat dengan masyarakat Indonesia,
                  sekaligus membuka cerita tentang potensi pangan lokal kepada
                  dunia.
                </p>
              </div>

              {/* VALUES */}
              <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">

                {/* 01 */}
                <div className="group border-t border-[#D8C9B3] pt-5">
                  <div className="flex items-center gap-3">

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B18B4B]/40 text-[#9E793A] transition-all duration-300 group-hover:border-[#B18B4B] group-hover:bg-[#B18B4B]/5">
                      <MapPin className="h-4 w-4" />
                    </span>

                    <div>
                      <span className="font-brand text-[8px] uppercase tracking-[0.22em] text-[#9E793A]">
                        01
                      </span>

                      <h3 className="mt-0.5 font-display text-lg text-[#09271F]">
                        Khas Borneo
                      </h3>
                    </div>

                  </div>

                  <p className="mt-3 pl-[3.25rem] text-sm leading-6 text-[#65706A]">
                    Berangkat dari kekayaan hasil perairan dan pangan lokal
                    Kalimantan Timur.
                  </p>
                </div>

                {/* 02 */}
                <div className="group border-t border-[#D8C9B3] pt-5">
                  <div className="flex items-center gap-3">

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B18B4B]/40 text-[#9E793A] transition-all duration-300 group-hover:border-[#B18B4B] group-hover:bg-[#B18B4B]/5">
                      <Fish className="h-4 w-4" />
                    </span>

                    <div>
                      <span className="font-brand text-[8px] uppercase tracking-[0.22em] text-[#9E793A]">
                        02
                      </span>

                      <h3 className="mt-0.5 font-display text-lg text-[#09271F]">
                        Ikan Bawis
                      </h3>
                    </div>

                  </div>

                  <p className="mt-3 pl-[3.25rem] text-sm leading-6 text-[#65706A]">
                    Diolah menjadi keripik ikan tanpa tulang tengah yang renyah,
                    praktis, dan kaya protein.
                  </p>
                </div>

                {/* 03 */}
                <div className="group border-t border-[#D8C9B3] pt-5">
                  <div className="flex items-center gap-3">

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B18B4B]/40 text-[#9E793A] transition-all duration-300 group-hover:border-[#B18B4B] group-hover:bg-[#B18B4B]/5">
                      <Sparkles className="h-4 w-4" />
                    </span>

                    <div>
                      <span className="font-brand text-[8px] uppercase tracking-[0.22em] text-[#9E793A]">
                        03
                      </span>

                      <h3 className="mt-0.5 font-display text-lg text-[#09271F]">
                        Modern Craft
                      </h3>
                    </div>

                  </div>

                  <p className="mt-3 pl-[3.25rem] text-sm leading-6 text-[#65706A]">
                    Pangan lokal diolah menjadi camilan modern dengan nilai dan
                    pengalaman yang lebih tinggi.
                  </p>
                </div>

                {/* 04 */}
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
                        From Borneo to the World
                      </h3>
                    </div>

                  </div>

                  <p className="mt-3 pl-[3.25rem] text-sm leading-6 text-[#65706A]">
                    Membawa cerita, cita rasa, dan potensi pangan lokal Borneo
                    lebih jauh.
                  </p>
                </div>

              </div>

              {/* Brand statement */}
              <div className="mt-10 border-t border-[#D8C9B3] pt-6">
                <div className="flex items-start gap-4">

                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#9E793A]" />

                  <p className="font-display text-base italic leading-7 text-[#09271F] sm:text-lg">
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
