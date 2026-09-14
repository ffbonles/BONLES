import React from 'react';
import { ArrowDownRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const About: React.FC = () => {
return ( <section
   id="about"
   className="relative overflow-hidden bg-[var(--color-cream)] py-20 sm:py-24 lg:py-32"
 >
{/* Decorative background */} <div
     aria-hidden="true"
     className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full border border-[var(--color-gold)]/15"
   />

```
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-20 top-32 h-56 w-56 rounded-full border border-[var(--color-gold)]/10"
  />

  <div className="bonles-container relative">
    <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      
      {/* LEFT — Story visual */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative"
      >
        <div className="relative mx-auto max-w-xl">
          {/* Main image frame */}
          <div className="relative overflow-hidden rounded-[2rem] bg-[var(--color-green-deep)] p-3 shadow-[var(--shadow-premium)]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[var(--color-green)]">
              <img
                src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=85"
                alt="Inspirasi pangan lokal Borneo dan proses pengolahan pangan"
                className="h-full w-full object-cover"
                loading="lazy"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-green-deep)]/70 via-transparent to-transparent" />

              {/* Image label */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 text-white">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
                    <Sparkles size={16} />
                  </span>

                  <div>
                    <p className="font-brand text-[10px] uppercase tracking-[0.25em] text-[var(--color-gold-light)]">
                      Borneo Crafted
                    </p>
                    <p className="mt-1 font-display text-lg">
                      Pangan lokal, cerita yang hidup.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gold corner decoration */}
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

      {/* RIGHT — Story copy */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        className="max-w-2xl"
      >
        {/* Eyebrow */}
        <div className="bonles-eyebrow mb-5">
          <span className="h-px w-8 bg-[var(--color-gold)]" />
          Our Story
        </div>

        {/* Heading */}
        <h2 className="bonles-heading max-w-2xl text-4xl leading-[1.08] text-[var(--color-green-deep)] sm:text-5xl lg:text-6xl">
          Dari Borneo,
          <span className="block italic font-normal text-[var(--color-gold-dark)]">
            diolah dengan cara modern.
          </span>
        </h2>

        {/* Main story */}
        <div className="mt-8 space-y-5 text-[var(--color-ink-soft)]">
          <p className="bonles-copy text-base leading-8 sm:text-lg">
            Berawal dari kekayaan hasil perairan Kalimantan Timur, kami
            ingin membuktikan bahwa pangan lokal Borneo dapat diolah
            menjadi camilan modern yang memiliki nilai dan cerita.
          </p>

          <p className="bonles-copy text-base leading-8">
            Ikan Bawis kami pilih dan olah menjadi keripik ikan tanpa
            tulang tengah, sehingga menghasilkan camilan yang renyah,
            praktis, dan kaya protein.
          </p>

          <p className="bonles-copy text-base leading-8">
            Bagi kami, BONLES bukan hanya tentang sebuah camilan.
            Ini adalah cara untuk membawa cita rasa dan kekayaan pangan
            lokal Borneo ke lebih banyak orang — dari Indonesia hingga
            dunia.
          </p>
        </div>

        {/* Divider */}
        <div className="my-9 h-px w-full bg-[var(--color-border)]" />

        {/* Story pillars */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="font-brand text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">
              01
            </p>
            <h3 className="mt-2 font-display text-lg text-[var(--color-green-deep)]">
              Lokal
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-muted)]">
              Terinspirasi dari kekayaan pangan Borneo.
            </p>
          </div>

          <div>
            <p className="font-brand text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">
              02
            </p>
            <h3 className="mt-2 font-display text-lg text-[var(--color-green-deep)]">
              Modern
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-muted)]">
              Diolah menjadi camilan yang praktis dan relevan.
            </p>
          </div>

          <div>
            <p className="font-brand text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">
              03
            </p>
            <h3 className="mt-2 font-display text-lg text-[var(--color-green-deep)]">
              Mendunia
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-muted)]">
              Membawa cerita Borneo ke Indonesia dan dunia.
            </p>
          </div>
        </div>

        {/* Story CTA */}
        <div className="mt-9">
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

    {/* Bottom brand statement */}
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

export default About;
