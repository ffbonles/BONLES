import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Compass,
  Sparkles,
  Fish,
  Check,
  UtensilsCrossed,
  PackageCheck,
} from 'lucide-react';
import { BONLES_IMAGES } from '../assets/productImages';
import { BonlesLogo } from './BonlesLogo';
import { store } from '../services/store';

interface OurStoryProps {
  onExploreCatalog?: () => void;
}

export const OurStory: React.FC<OurStoryProps> = ({ onExploreCatalog }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [settings, setSettings] = useState<Record<string, string>>(
    () => store.getSettingsMap()
  );

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setSettings(store.getSettingsMap());
    });

    return unsubscribe;
  }, []);

  const ourStoryTitle =
    settings['OUR_STORY_TITLE'] || 'Dari Borneo, Lahir Sebuah Rasa.';

  const ourStoryQuote =
    settings['OUR_STORY_QUOTE'] ||
    'Kekayaan daerah bukan hanya untuk dikenang—tetapi bisa dikembangkan, dinikmati, dan dibawa lebih jauh melalui sebuah rasa.';

  const handleScrollToCatalog = (e: React.MouseEvent) => {
    e.preventDefault();

    if (onExploreCatalog) {
      onExploreCatalog();
    } else {
      const el = document.getElementById('catalog');

      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="our-story"
      aria-label="Brand Story — Dari Borneo, Lahir Sebuah Rasa"
      className="relative overflow-hidden bg-[#09271F] text-[#F8F4EA]"
    >
      {/* ============================================================
          AMBIENT BACKGROUND
      ============================================================ */}
      <div
        className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-[#B18B4B]/8 blur-[120px]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-40 bottom-1/3 h-[600px] w-[600px] rounded-full bg-[#185043]/40 blur-[140px]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute left-1/3 top-2/3 h-[400px] w-[400px] rounded-full bg-[#C9A45C]/5 blur-[120px]"
        aria-hidden="true"
      />

      {/* ============================================================
          SECTION INTRO
      ============================================================ */}
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
        {/* Eyebrow */}
        <div className="mb-8 flex items-center gap-3">
          <span className="h-px w-10 bg-[#C9A45C]" />

          <span className="font-brand text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D8B878]">
            Our Story & Dedication
          </span>

          <span className="h-px w-16 bg-[#C9A45C]/25 sm:w-24" />
        </div>

        {/* Editorial heading */}
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            <h2 className="font-display text-4xl font-medium leading-[1.1] tracking-tight text-[#FCFAF5] sm:text-5xl lg:text-6xl">
              {ourStoryTitle.includes(',') ? (
                <>
                  {ourStoryTitle.split(',')[0]},
                  <br className="hidden sm:inline" />
                  <span className="block italic text-[#D8B878] sm:inline">
                    {' '}
                    {ourStoryTitle.split(',').slice(1).join(',')}
                  </span>
                </>
              ) : (
                <span className="italic text-[#D8B878]">
                  {ourStoryTitle}
                </span>
              )}
            </h2>

            <p className="mt-6 max-w-2xl text-base font-light leading-8 text-[#D8DED9] sm:text-lg">
              Dari kekayaan hasil perairan Kalimantan Timur, kami membawa
              pangan lokal Borneo ke dalam bentuk camilan modern yang memiliki
              nilai, karakter, dan cerita.
            </p>
          </div>

          <div className="lg:col-span-4">
            <div className="border-l border-[#C9A45C]/50 pl-5">
              <p className="text-sm font-light leading-7 text-[#AEBDB5]">
                Menghubungkan kekayaan alam Borneo dengan kreativitas
                pengolahan modern untuk menghadirkan pengalaman rasa yang
                autentik.
              </p>

              <a
                href="#story-part-01"
                className="group mt-5 inline-flex items-center gap-2 font-brand text-[9px] font-semibold uppercase tracking-[0.2em] text-[#FCFAF5] transition-colors hover:text-[#D8B878]"
              >
                <span>Telusuri Cerita Kami</span>

                <ArrowRight className="h-3.5 w-3.5 text-[#C9A45C] transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        {/* ============================================================
            HERO STORY IMAGE
        ============================================================ */}
        <div className="relative mt-14 overflow-hidden rounded-[1.5rem] border border-[#C9A45C]/20 bg-[#0D3027] shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
          <div className="relative aspect-[21/9] min-h-[280px] w-full overflow-hidden sm:min-h-[420px]">
            <img
              src={ourStoryMainImage}
              alt="Bentang alam perairan Kalimantan Timur Borneo - PT Bonles Food Nusantara"
              referrerPolicy="no-referrer"
              loading="lazy"
              className="h-full w-full object-cover object-center brightness-[0.78] transition-transform duration-1000 hover:scale-[1.02]"
            />

            <div
              className="absolute inset-0 bg-gradient-to-t from-[#09271F] via-[#09271F]/15 to-[#09271F]/30"
              aria-hidden="true"
            />

            {/* Logo */}
            <div className="absolute left-5 top-5 rounded-xl border border-[#C9A45C]/30 bg-[#FCFAF5]/95 p-2.5 shadow-xl backdrop-blur-sm sm:left-7 sm:top-7">
              <BonlesLogo size="sm" variant="horizontal" />
            </div>

            {/* Caption */}
            <div className="absolute bottom-5 left-5 right-5 max-w-md sm:bottom-7 sm:left-7">
              <div className="border-l-2 border-[#D8B878] bg-[#09271F]/75 p-4 backdrop-blur-md sm:p-5">
                <div className="mb-1 flex items-center gap-2">
                  <Compass className="h-3.5 w-3.5 text-[#D8B878]" />

                  <span className="font-brand text-[9px] font-semibold uppercase tracking-[0.25em] text-[#D8B878]">
                    Kalimantan Timur, Indonesia
                  </span>
                </div>

                <p className="text-xs font-light leading-6 text-[#E3E8E4]">
                  Perairan, hutan, dan kekayaan pangan Borneo menjadi bagian
                  dari cerita yang menginspirasi perjalanan BONLES.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          STORY SEQUENCE
      ============================================================ */}
      <div className="relative mx-auto max-w-7xl space-y-24 px-4 py-16 sm:space-y-32 sm:px-6 sm:py-24 lg:px-8">

        {/* ==========================================================
            PART 01 — ROOTED IN BORNEO
        =========================================================== */}
        <article
          id="story-part-01"
          className="grid grid-cols-1 items-center gap-10 sm:gap-14 lg:grid-cols-12"
        >
          <div className="order-2 space-y-5 lg:col-span-5 lg:order-1">
            <div className="inline-flex items-center gap-2 border border-[#C9A45C]/35 bg-[#0D3027] px-3 py-1.5">
              <span className="font-brand text-[9px] font-semibold uppercase tracking-[0.2em] text-[#D8B878]">
                01 — Rooted in Borneo
              </span>
            </div>

            <h3 className="font-display text-3xl font-medium leading-tight text-[#FCFAF5] sm:text-4xl">
              Berawal dari
              <span className="block italic text-[#D8B878]">
                Kekayaan Lokal
              </span>
            </h3>

            <p className="text-sm font-light leading-7 text-[#D8DED9] sm:text-base">
              Berawal dari kekayaan hasil perairan Kalimantan Timur, kami ingin
              membuktikan bahwa pangan lokal Borneo dapat diolah menjadi
              camilan modern yang memiliki nilai dan cerita.
            </p>

            <div className="flex flex-col gap-2 pt-2 text-xs text-[#9FAFA7] sm:flex-row sm:items-center sm:gap-5">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D8B878]" />
                Pangan Lokal Borneo
              </span>

              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D8B878]/60" />
                Kearifan Nusantara
              </span>
            </div>
          </div>

          <div className="order-1 lg:col-span-7 lg:order-2">
            <div className="group relative overflow-hidden rounded-[1.25rem] border border-[#C9A45C]/20 bg-[#0D3027] p-2 shadow-2xl">
              <div className="relative overflow-hidden rounded-[0.9rem]">
                <img
                  src={ourStoryPart1Image}
                  alt="Perairan dan alam Borneo Kalimantan Timur"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="h-72 w-full object-cover object-center brightness-[0.82] transition-transform duration-700 group-hover:scale-105 sm:h-96"
                />

                <div className="absolute inset-0 bg-gradient-to-tr from-[#09271F]/80 via-transparent to-transparent" />

                <div className="absolute right-4 top-4 border border-[#C9A45C]/30 bg-[#09271F]/85 px-3 py-1.5 backdrop-blur-sm">
                  <span className="font-brand text-[8px] uppercase tracking-[0.18em] text-[#D8B878]">
                    Authentic Origin
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* ==========================================================
            PART 02 — IKAN BAWIS
        =========================================================== */}
        <article
          id="story-part-02"
          className="grid grid-cols-1 items-center gap-10 sm:gap-14 lg:grid-cols-12"
        >
          <div className="lg:col-span-7">
            <div className="group relative overflow-hidden rounded-[1.25rem] border border-[#C9A45C]/20 bg-[#0D3027] p-2 shadow-2xl">
              <div className="relative overflow-hidden rounded-[0.9rem]">
                <img
                  src={ourStoryPart2Image}
                  alt="Produk snack kemasan standing pouch BONLES"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="h-72 w-full object-cover object-center transition-transform duration-700 group-hover:scale-105 sm:h-96"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#09271F]/90 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 border border-[#C9A45C]/25 bg-[#09271F]/85 p-4 backdrop-blur-md">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="font-brand text-[8px] font-semibold uppercase tracking-[0.2em] text-[#D8B878]">
                        Keripik Ikan Bawis
                      </span>

                      <p className="mt-1 text-xs font-medium text-[#F8F4EA]">
                        High Protein Fish Crunch
                      </p>
                    </div>

                    <span className="inline-flex w-fit items-center gap-1.5 border border-[#C9A45C]/35 bg-[#B18B4B]/10 px-2.5 py-1 font-brand text-[8px] font-semibold uppercase tracking-[0.15em] text-[#D8B878]">
                      <PackageCheck className="h-3 w-3" />
                      Modern Snack
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5 lg:col-span-5">
            <div className="inline-flex items-center gap-2 border border-[#C9A45C]/35 bg-[#0D3027] px-3 py-1.5">
              <span className="font-brand text-[9px] font-semibold uppercase tracking-[0.2em] text-[#D8B878]">
                02 — The Innovation
              </span>
            </div>

            <h3 className="font-display text-3xl font-medium leading-tight text-[#FCFAF5] sm:text-4xl">
              Ikan Bawis
              <span className="block italic text-[#D8B878]">
                dalam Bentuk Modern
              </span>
            </h3>

            <p className="text-sm font-light leading-7 text-[#D8DED9] sm:text-base">
              Ikan Bawis kami pilih dan olah menjadi keripik ikan tanpa tulang
              tengah, menghasilkan camilan yang renyah, praktis, dan kaya
              protein.
            </p>

            <div className="border-l-2 border-[#C9A45C] pl-4">
              <p className="text-sm leading-7 text-[#F0E9DC]">
                Sebuah bahan pangan lokal diberi sentuhan pengolahan modern
                tanpa kehilangan karakter dan cerita asalnya.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 border border-[#C9A45C]/25 px-3 py-1.5 text-[10px] text-[#C5D0CA]">
                <Check className="h-3 w-3 text-[#D8B878]" />
                Renyah
              </span>

              <span className="inline-flex items-center gap-1.5 border border-[#C9A45C]/25 px-3 py-1.5 text-[10px] text-[#C5D0CA]">
                <Check className="h-3 w-3 text-[#D8B878]" />
                Praktis
              </span>

              <span className="inline-flex items-center gap-1.5 border border-[#C9A45C]/25 px-3 py-1.5 text-[10px] text-[#C5D0CA]">
                <Check className="h-3 w-3 text-[#D8B878]" />
                Tinggi Protein
              </span>
            </div>
          </div>
        </article>

        {/* ==========================================================
            PART 03 — BORNEO FLAVOR
        =========================================================== */}
        <article
          id="story-part-03"
          className="grid grid-cols-1 items-center gap-10 sm:gap-14 lg:grid-cols-12"
        >
          <div className="order-2 space-y-5 lg:col-span-5 lg:order-1">
            <div className="inline-flex items-center gap-2 border border-[#C9A45C]/35 bg-[#0D3027] px-3 py-1.5">
              <span className="font-brand text-[9px] font-semibold uppercase tracking-[0.2em] text-[#D8B878]">
                03 — The Borneo Flavor
              </span>
            </div>

            <h3 className="font-display text-3xl font-medium leading-tight text-[#FCFAF5] sm:text-4xl">
              Sentuhan Rasa
              <span className="block italic text-[#D8B878]">
                Khas Borneo
              </span>
            </h3>

            <p className="text-sm font-light leading-7 text-[#D8DED9] sm:text-base">
              Untuk memberikan pengalaman kuliner yang lebih khas, BONLES
              menghadirkan Sambal Bawang Dayak sebagai pendamping dalam satu
              sachet cocolan.
            </p>

            <div className="space-y-3 border border-[#C9A45C]/20 bg-[#0D3027] p-5">
              <div className="flex items-start gap-3">
                <UtensilsCrossed className="mt-0.5 h-4 w-4 shrink-0 text-[#D8B878]" />

                <div>
                  <p className="text-xs font-semibold text-[#F8F4EA]">
                    Keripik Ikan Bawis + Sambal Bawang Dayak
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#9FAFA7]">
                    Gurih-renyah berpadu dengan sensasi pedas dan karakter
                    rempah khas Borneo.
                  </p>
                </div>
              </div>

              <div className="border-t border-[#C9A45C]/15 pt-3">
                <span className="font-brand text-[9px] font-semibold uppercase tracking-[0.18em] text-[#D8B878]">
                  Cocol Sesuai Selera
                </span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:col-span-7 lg:order-2">
            <div className="group relative overflow-hidden rounded-[1.25rem] border border-[#C9A45C]/20 bg-[#0D3027] p-2 shadow-2xl">
              <div className="relative overflow-hidden rounded-[0.9rem]">
                <img
                  src={ourStoryPart3Image}
                  alt="Keripik dengan Sambal Bawang Dayak"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="h-72 w-full object-cover object-center transition-transform duration-700 group-hover:scale-105 sm:h-96"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#09271F]/80 via-transparent to-transparent" />

                <div className="absolute left-4 top-4 border border-[#C9A45C]/30 bg-[#09271F]/85 px-3 py-1.5 backdrop-blur-sm">
                  <span className="font-brand text-[8px] uppercase tracking-[0.18em] text-[#D8B878]">
                    Signature Dipping Sachet
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* ==========================================================
            PART 04 — MORE THAN A SNACK
        =========================================================== */}
        <article
          id="story-part-04"
          className="border-t border-[#C9A45C]/20 pt-16 sm:pt-20"
        >
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <div className="inline-flex items-center gap-2 border border-[#C9A45C]/35 bg-[#0D3027] px-3 py-1.5">
              <Sparkles className="h-3 w-3 text-[#D8B878]" />

              <span className="font-brand text-[9px] font-semibold uppercase tracking-[0.25em] text-[#D8B878]">
                04 — More Than a Snack
              </span>
            </div>

            <h3 className="font-display text-3xl font-medium leading-tight text-[#FCFAF5] sm:text-4xl lg:text-5xl">
              Lebih dari Sekadar Camilan
            </h3>

            <p className="mx-auto max-w-3xl font-display text-lg italic leading-8 text-[#E4DED2] sm:text-xl">
              “Bagi kami, produk ini bukan sekadar camilan. Ini adalah cerita
              tentang bagaimana kekayaan alam Borneo dan pangan lokal dapat
              diberi sentuhan kreativitas menjadi produk bernilai tambah.”
            </p>

            {/* Value journey */}
            <div className="pt-8">
              <div className="border border-[#C9A45C]/20 bg-[#0D3027] p-5 shadow-xl sm:p-7">
                <span className="font-brand text-[9px] font-semibold uppercase tracking-[0.25em] text-[#D8B878]">
                  The Value Creation Journey
                </span>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs sm:gap-3">
                  <span className="border border-[#C9A45C]/20 bg-[#09271F] px-3 py-2 text-[#D8DED9]">
                    Borneo
                  </span>

                  <span className="text-[#C9A45C]">→</span>

                  <span className="border border-[#C9A45C]/20 bg-[#09271F] px-3 py-2 text-[#D8DED9]">
                    Ikan Bawis
                  </span>

                  <span className="text-[#C9A45C]">→</span>

                  <span className="border border-[#C9A45C]/20 bg-[#09271F] px-3 py-2 text-[#D8DED9]">
                    Modern Craft
                  </span>

                  <span className="text-[#C9A45C]">→</span>

                  <span className="border border-[#C9A45C]/20 bg-[#09271F] px-3 py-2 text-[#D8DED9]">
                    High Protein
                  </span>

                  <span className="text-[#C9A45C]">→</span>

                  <span className="border border-[#C9A45C]/20 bg-[#09271F] px-3 py-2 text-[#D8DED9]">
                    Sambal Bawang Dayak
                  </span>

                  <span className="text-[#C9A45C]">→</span>

                  <span className="border border-[#C9A45C]/40 bg-[#B18B4B]/10 px-3 py-2 font-medium text-[#D8B878]">
                    Borneo to the World
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* ============================================================
          BRAND MANIFESTO
      ============================================================ */}
      <div className="relative overflow-hidden border-y border-[#C9A45C]/20 bg-[#0D3027] py-24 text-center sm:py-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'radial-gradient(#D8B878 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B18B4B]/10 blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-4xl space-y-8 px-4 sm:px-6 lg:px-8">
          <span className="mx-auto block h-px w-12 bg-[#D8B878]" />

          <blockquote className="mx-auto max-w-3xl font-display text-2xl font-medium leading-relaxed text-[#FCFAF5] sm:text-3xl lg:text-4xl">
            “{ourStoryQuote}”
          </blockquote>

          <div className="pt-2">
            <p className="font-brand text-[9px] font-semibold uppercase tracking-[0.25em] text-[#D8B878]">
              {settings['STORE_NAME'] || 'PT. BONLES FOOD NUSANTARA'}
            </p>

            <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[#879990]">
              Authentic Borneo • Modern Craft • Premium Snack
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================
          CLOSING CTA
      ============================================================ */}
      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-7">
          <div className="space-y-1">
            <p className="font-display text-2xl text-[#FCFAF5] sm:text-3xl lg:text-4xl">
              Dari{' '}
              <span className="italic text-[#D8B878]">
                Borneo
              </span>
              .
            </p>

            <p className="font-display text-xl text-[#D8DED9] sm:text-2xl">
              Lahir dari kekayaan lokal.
            </p>

            <p className="font-display text-xl font-light text-[#AEBDB5] sm:text-2xl">
              Menuju Indonesia dan dunia.
            </p>
          </div>

          <p className="mx-auto max-w-lg text-xs font-light leading-6 text-[#879990] sm:text-sm">
            Kenali produk BONLES dan temukan cita rasa Borneo dalam bentuk
            camilan modern yang renyah, praktis, dan kaya protein.
          </p>

          <div className="pt-3">
            <button
              onClick={handleScrollToCatalog}
              className="group inline-flex cursor-pointer items-center gap-3 border border-[#C9A45C]/60 bg-[#B18B4B] px-8 py-3.5 font-brand text-[9px] font-semibold uppercase tracking-[0.2em] text-[#09271F] transition-all duration-300 hover:bg-[#D8B878] hover:shadow-[0_12px_30px_rgba(201,164,92,0.18)]"
            >
              <span>Kenali Produk Kami</span>

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
