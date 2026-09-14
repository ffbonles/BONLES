import React, { useEffect, useState } from 'react';
import { Fish, PackageCheck, Sparkles } from 'lucide-react';
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

```
return unsubscribe;
```

}, []);

const title =
settings['ABOUT_TITLE'] ||
'Dari Borneo, diolah dengan cara modern.';

const description =
settings['ABOUT_DESCRIPTION'] ||
'Berawal dari kekayaan hasil perairan Kalimantan Timur, kami ingin membuktikan bahwa pangan lokal Borneo dapat diolah menjadi camilan modern yang memiliki nilai dan cerita.';

const image =
settings['ABOUT_IMAGE_URL'] || BONLES_IMAGES.heroBanner;

return ( <section
   id="about"
   className="bg-[var(--color-cream)] py-20 sm:py-24 lg:py-32"
 > <div className="bonles-container"> <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

```
      <div className="relative">
        <div className="overflow-hidden rounded-[2rem] bg-[var(--color-green-deep)] p-3">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
            <img
              src={image}
              alt="BONLES Food Nusantara"
              className="h-full w-full object-cover"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-green-deep)]/80 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-brand text-[9px] uppercase tracking-[0.25em] text-[var(--color-gold-light)]">
                Local Heritage
              </p>

              <p className="mt-2 font-display text-2xl leading-tight text-white sm:text-3xl">
                Kekayaan Borneo,
                <span className="block italic">
                  dalam setiap gigitan.
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-4 -left-4 h-20 w-20 border-b border-l border-[var(--color-gold)]/60" />

        <div className="absolute -right-4 -top-4 h-20 w-20 border-r border-t border-[var(--color-gold)]/60" />
      </div>

      <div className="max-w-2xl">

        <div className="bonles-eyebrow mb-5">
          <span className="h-px w-8 bg-[var(--color-gold)]" />
          Our Story
        </div>

        <h2 className="bonles-heading text-4xl leading-tight text-[var(--color-green-deep)] sm:text-5xl lg:text-6xl">
          {title}
        </h2>

        <div className="mt-8 space-y-5">
          <p className="bonles-copy text-base leading-8 sm:text-lg">
            {description}
          </p>

          <p className="bonles-copy text-base leading-8">
            Ikan Bawis kami pilih dan olah menjadi keripik ikan tanpa
            tulang tengah, sehingga menghasilkan camilan yang renyah,
            praktis, dan kaya protein.
          </p>

          <p className="bonles-copy text-base leading-8">
            Bagi kami, BONLES bukan hanya tentang sebuah camilan. Ini
            adalah cara untuk membawa cita rasa dan kekayaan pangan lokal
            Borneo ke lebih banyak orang, dari Indonesia hingga dunia.
          </p>
        </div>

        <div className="my-9 h-px w-full bg-[var(--color-border)]" />

        <div className="grid gap-6 sm:grid-cols-3">

          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-gold)]/40 text-[var(--color-gold-dark)]">
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

          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-gold)]/40 text-[var(--color-gold-dark)]">
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

          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-gold)]/40 text-[var(--color-gold-dark)]">
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
      </div>
    </div>

    <div className="mt-20 border-t border-[var(--color-border)] pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-brand text-[10px] uppercase tracking-[0.25em] text-[var(--color-gold-dark)]">
          BONLES FOOD NUSANTARA
        </p>

        <p className="text-sm text-[var(--color-ink-muted)]">
          Cita rasa Borneo dalam bentuk yang lebih modern, praktis,
          dan bernilai.
        </p>
      </div>
    </div>

  </div>
</section>
```

);
};

export default AboutSection;
