import React, { useEffect, useState } from 'react';
import {
ArrowDownRight,
Fish,
PackageCheck,
Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import { BONLES_IMAGES } from '../assets/productImages';
import { store } from '../services/store';

export const AboutSection: React.FC = () => {
const [settings, setSettings] = useState<Record<string, string>>(() =>
store.getSettingsMap()
);

useEffect(() => {
const unsubscribe = store.subscribe(() => {
setSettings(store.getSettingsMap());
});

```
return unsubscribe;
```

}, []);

const aboutTitle =
settings['ABOUT_TITLE'] ||
'Dari Borneo, diolah dengan cara modern.';

const aboutDescription =
settings['ABOUT_DESCRIPTION'] ||
'Berawal dari kekayaan hasil perairan Kalimantan Timur, kami ingin membuktikan bahwa pangan lokal Borneo dapat diolah menjadi camilan modern yang memiliki nilai dan cerita.';

const aboutImage =
settings['ABOUT_IMAGE_URL'] ||
BONLES_IMAGES.heroBanner;

return ( <section
   id="about"
   className="relative overflow-hidden bg-[var(--color-cream)] py-20 sm:py-24 lg:py-32"
 >
{/* Decorative background */} <div
     aria-hidden="true"
     className="pointer-events-none absolute -right-32 top-16 h-80 w-80 rounded-full border border-[var(--color-gold)]/15"
   />

```
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-20 top-28 h-56 w-56 rounded-full border border-[var(--color-gold)]/10"
  />

  <div className="bonles-container relative">
    <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      {/* =====================================================
          LEFT — VISUAL
      ====================================================== */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative"
      >
        <div className="relative mx-auto max-w-xl">
          {/* Main frame */}
          <div className="relative rounded-[2rem] bg-[var(--color-green-deep)] p-3 shadow-[var(--shadow-premium)]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[var(--color-green)]">
              <img
                src={aboutImage}
                alt="BONLES Food Nusantara - Cita rasa Borneo"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
                loading="lazy"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-green-deep)]/80 via-transparent to-transparent" />

              {/* Brand label */}
              <div className="absolute left-6 right-6 top-6 flex items-center justify-between">
                <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 font-brand text-[9px] uppercase tracking-[0.2em] text-white backdrop-blur-md">
                  Borneo Crafted
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-[var(--color-gold-light)] backdrop-blur-md">
                  <Sparkles size={15} />
                </span>
              </div>

              {/* Bottom story */}
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-brand text-[9px] uppercase tracking-[0.25em] text-[var(--color-gold-light)]">
                  Local Heritage
                </p>

                <p className="mt-2 max-w-sm font-display text-2xl leading-tight text-white sm:text-3xl">
                  Kekayaan Borneo,
                  <span className="block italic font-normal">
                    dalam setiap gigitan.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Gold corner decorations */}
          <div
            aria-hidden="true"
            className="absolute -bottom-5 -left-5 h-24 w-24 border-b border-l border-[var(--color-gold)]/60"
          />

          <div
            aria-hidden="true"
            className="absolute -right-5 -top-5 h-24 w-24 border-r border-t border-[var(--color-gold)]/60"
          />

          {/* Floating number */}
          <div className="absolute -bottom-7 right-6 hidden h-20 w-20 items-center justify-center rounded-full border border-[var(--color-gold)]/40 bg-[var(--color-cream)] shadow-lg sm:flex">
            <span className="font-display text-2xl text-[var(--color-green-deep)]">
              01
            </span>
          </div>
        </div>
      </motion.div>

      {/* =====================================================
          RIGHT — STORY
      ====================================================== */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: 0.7,
          ease: 'easeOut',
          delay: 0.1,
        }}
        className="max-w-2xl"
      >
        {/* Eyebrow */}
        <div className="bonles-eyebrow mb-5">
          <span className="h-px w-8 bg-[var(--color-gold)]" />
          Our Story
        </div>

        {/* Heading */}
        <h2 className="bonles-heading max-w-2xl text-4xl leading-[1.08] text-[var(--color-green-deep)] sm:text-5xl lg:text-6xl">
          {aboutTitle.includes(',') ? (
            <>
              {aboutTitle.split(',')[0]},
              <span className="block italic font-normal text-[var(--color-gold-dark)]">
                {aboutTitle.split(',').slice(1).join(',').trim()}
              </span>
            </>
          ) : (
            aboutTitle
          )}
        </h2>

        {/* Story paragraphs */}
        <div className="mt-8 space-y-5">
          <p className="bonles-copy text-base leading-8 sm:text-lg">
            {aboutDescription}
          </p>

          <p className="bonles-copy text-base leading-8">
            Ikan Bawis kami pilih dan olah menjadi keripik ikan tanpa
            tulang tengah, sehingga menghasilkan camilan yang renyah,
            praktis, dan kaya protein.
          </p>

          <p className="bonles-copy text-base leading-8">
            Bagi kami, BONLES bukan hanya tentang sebuah camilan. Ini
            adalah cara untuk membawa cita rasa dan kekayaan pangan lokal
            Borneo ke lebih banyak orang — dari Indonesia hingga dunia.
          </p>
        </div>

        {/* Divider */}
        <div className="my-9 h-px w-full bg-[var(--color-border)]" />

        {/* =====================================================
            STORY PILLARS
        ====================================================== */}
        <div className="grid gap-6 sm:grid-cols-3">
          {/* Local */}
          <div className="group">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-gold)]/40 bg-[var(--color-cream-soft)] text-[var(--color-gold-dark)]">
                <Fish size={16} />
              </span>

              <span className="font-brand text-[9px] uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">
                01
              </span>
            </div>

            <h3 className="mt-4 font-display text-lg text-[var(--color-green-deep)]">
              Lokal
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-muted)]">
              Terinspirasi dari kekayaan pangan Borneo.
            </p>
          </div>

          {/* Modern */}
          <div className="group">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-gold)]/40 bg-[var(--color-cream-soft)] text-[var(--color-gold-dark)]">
                <Sparkles size={16} />
              </span>

              <span className="font-brand text-[9px] uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">
                02
              </span>
            </div>

            <h3 className="mt-4 font-display text-lg text-[var(--color-green-deep)]">
              Modern
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-muted)]">
              Diolah menjadi camilan praktis dengan nilai tambah.
            </p>
          </div>

          {/* Premium */}
          <div className="group">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-gold)]/40 bg-[var(--color-cream-soft)] text-[var(--color-gold-dark)]">
                <PackageCheck size={16} />
              </span>

              <span className="font-brand text-[9px] uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">
                03
              </span>
            </div>

            <h3 className="mt-4 font-display text-lg text-[var(--color-green-deep)]">
              Mendunia
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-muted)]">
              Membawa cerita dan cita rasa Borneo lebih jauh.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <a
            href="#our-story"
            className="group inline-flex items-center gap-3 text-sm font-semibold text-[var(--color-green-deep)]"
          >
            <span className="border-b border-[var(--color-gold)] pb-1 transition-colors group-hover:border-[var(--color-green-deep)]">
              Kenali cerita BONLES
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border-strong)] transition-all duration-300 group-hover:border-[var(--color-gold)] group-hover:bg-[var(--color-gold)] group-hover:text-white">
              <ArrowDownRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              />
            </span>
          </a>
        </div>
      </motion.div>
    </div>

    {/* =====================================================
        BOTTOM BRAND STATEMENT
    ====================================================== */}
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="mt-20 border-t border-[var(--color-border)] pt-8 lg:mt-28"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-brand text-[10px] uppercase tracking-[0.25em] text-[var(--color-gold-dark)]">
          BONLES FOOD NUSANTARA
        </p>

        <p className="max-w-xl text-sm leading-6 text-[var(--color-ink-muted)] sm:text-right">
          Cita rasa Borneo dalam bentuk yang lebih modern, praktis,
          dan bernilai.
        </p>
      </div>
    </motion.div>
  </div>
</section>
```

);
};

export default AboutSection;
