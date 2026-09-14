import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Award,
  Check,
  Flame,
  MessageCircle,
  PackageCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

import { Banner } from '../types';
import { store } from '../services/store';

interface HeroProps {
  banner?: Banner;
  onExploreCatalog: () => void;
  onFeaturedClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  banner,
  onExploreCatalog,
  onFeaturedClick,
}) => {
  const [settings, setSettings] = useState<Record<string, string>>(
    () => store.getSettingsMap()
  );

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setSettings(store.getSettingsMap());
    });

    return unsubscribe;
  }, []);

  /* ==========================================================
     DATA DARI GOOGLE SHEETS / SETTINGS
     ========================================================== */

  const heroBadge =
    settings['HERO_BADGE'] ||
    'BORNEO CRAFTED • HIGH PROTEIN FISH SNACK';

  const heroTitle =
    settings['HERO_TITLE'] ||
    'Cita Rasa Borneo, Dalam Bentuk Modern.';

  const heroSubtitle =
    settings['HERO_SUBTITLE'] ||
    'Berawal dari kekayaan hasil perairan Kalimantan Timur, BONLES mengolah Ikan Bawis menjadi keripik ikan tanpa tulang tengah yang renyah, praktis, dan kaya protein.';

  const productName =
    settings['HERO_PRODUCT_NAME'] ||
    'Keripik Ikan Bawis';

  const productTagline =
    settings['HERO_PRODUCT_TAGLINE'] ||
    'High Protein Fish Crunch';

  const imageUrl =
    banner?.IMAGE_URL ||
    settings['HERO_IMAGE_URL'] ||
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85';

  /* ==========================================================
     WHATSAPP
     ========================================================== */

  const waNumber =
    settings['WHATSAPP_NUMBER'] ||
    '6285174333902';

  const cleanWa = waNumber.replace(/[^0-9]/g, '');

  const waUrl =
    `https://wa.me/${cleanWa}?text=${encodeURIComponent(
      'Halo BONLES Food Nusantara, saya ingin mengetahui produk Keripik Ikan Bawis.'
    )}`;

  return (
    <section
      id="hero"
      className="
        relative
        overflow-hidden
        bg-gradient-to-br from-[#7A0F18] via-[#E64A19] to-[#FFC107]
        border-b
        border-[#FFD54F]/50
      "
    >
      {/* ======================================================
          BACKGROUND DECORATION
          ====================================================== */}

      <div
        className="
          absolute
          -top-32
          -right-32
          w-[420px]
          h-[420px]
          rounded-full
          bg-[#FFD54F]/20
          blur-3xl
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          -bottom-40
          -left-40
          w-[420px]
          h-[420px]
          rounded-full
          bg-[#FF7043]/20
          blur-3xl
          pointer-events-none
        "
      />

      {/* Subtle vertical editorial line */}
      <div
        className="
          hidden
          lg:block
          absolute
          left-[8%]
          top-0
          bottom-0
          w-px
          bg-white/20
          pointer-events-none
        "
      />

      {/* ======================================================
          MAIN CONTAINER
          ====================================================== */}

      <div
        className="
          bonles-container
          relative
          z-10
          py-12
          sm:py-16
          lg:py-20
          xl:py-24
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-12
            gap-10
            lg:gap-14
            xl:gap-20
            items-center
          "
        >
          {/* ==================================================
              LEFT — BRAND STORY
              ================================================== */}

          <div
            className="
              lg:col-span-6
              xl:col-span-7
              order-2
              lg:order-1
            "
          >
            {/* Eyebrow */}
            <div
              className="
                flex
                items-center
                gap-3
                mb-5
                sm:mb-6
              "
            >
              <span
                className="
                  w-8
                  sm:w-10
                  h-px
                  bg-[#FFB300]
                "
              />

              <span
                className="
                  text-[9px]
                  sm:text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-[#E65100]
                "
              >
                {heroBadge}
              </span>
            </div>

            {/* Main Heading */}
            <h1
              className="
                font-display
                text-white
                text-4xl
                sm:text-5xl
                lg:text-6xl
                xl:text-[68px]
                font-semibold
                tracking-[-0.035em]
                leading-[1.02]
                max-w-3xl
              "
            >
              {heroTitle}
            </h1>

            {/* Gold divider */}
            <div
              className="
                mt-6
                sm:mt-7
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  w-14
                  sm:w-20
                  h-[2px]
                  bg-[#FFB300]
                "
              />

              <span
                className="
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-[#FFD54F]
                "
              />
            </div>

            {/* Description */}
            <p
              className="
                mt-6
                sm:mt-7
                text-sm
                sm:text-base
                lg:text-[17px]
                leading-[1.8]
                text-white/90
                max-w-2xl
              "
            >
              {heroSubtitle}
            </p>

            {/* =================================================
                VALUE POINTS
                ================================================= */}

            <div
              className="
                mt-7
                sm:mt-8
                grid
                grid-cols-1
                sm:grid-cols-3
                gap-3
                max-w-2xl
              "
            >
              {/* Value 1 */}
              <div
                className="
                  group
                  flex
                  sm:block
                  items-center
                  gap-3
                  p-3
                  sm:p-4
                  bg-white/12
                  backdrop-blur-md
                  border
                  border-white/20
                  hover:border-[#FFD54F]
                  transition-colors
                "
              >
                <div
                  className="
                    w-8
                    h-8
                    rounded-full
                    bg-white/15
                    flex
                    items-center
                    justify-center
                    shrink-0
                    mb-0
                    sm:mb-3
                    group-hover:bg-white
                    transition-colors
                  "
                >
                  <Flame
                    className="
                      w-3.5
                      h-3.5
                      text-[#FFD54F]
                      group-hover:text-[#E65100]
                    "
                  />
                </div>

                <div>
                  <p
                    className="
                      text-[11px]
                      sm:text-xs
                      font-bold
                      text-white
                    "
                  >
                    Tinggi Protein
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      sm:text-[10px]
                      text-white/70
                    "
                  >
                    Fish-based snack
                  </p>
                </div>
              </div>

              {/* Value 2 */}
              <div
                className="
                  group
                  flex
                  sm:block
                  items-center
                  gap-3
                  p-3
                  sm:p-4
                  bg-white/12
                  backdrop-blur-md
                  border
                  border-white/20
                  hover:border-[#FFD54F]
                  transition-colors
                "
              >
                <div
                  className="
                    w-8
                    h-8
                    rounded-full
                    bg-white/15
                    flex
                    items-center
                    justify-center
                    shrink-0
                    mb-0
                    sm:mb-3
                    group-hover:bg-white
                    transition-colors
                  "
                >
                  <PackageCheck
                    className="
                      w-3.5
                      h-3.5
                      text-[#FFD54F]
                      group-hover:text-[#E65100]
                    "
                  />
                </div>

                <div>
                  <p
                    className="
                      text-[11px]
                      sm:text-xs
                      font-bold
                      text-white
                    "
                  >
                    Praktis
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      sm:text-[10px]
                      text-white/70
                    "
                  >
                    Ready to enjoy
                  </p>
                </div>
              </div>

              {/* Value 3 */}
              <div
                className="
                  group
                  flex
                  sm:block
                  items-center
                  gap-3
                  p-3
                  sm:p-4
                  bg-white/12
                  backdrop-blur-md
                  border
                  border-white/20
                  hover:border-[#FFD54F]
                  transition-colors
                "
              >
                <div
                  className="
                    w-8
                    h-8
                    rounded-full
                    bg-white/15
                    flex
                    items-center
                    justify-center
                    shrink-0
                    mb-0
                    sm:mb-3
                    group-hover:bg-white
                    transition-colors
                  "
                >
                  <Award
                    className="
                      w-3.5
                      h-3.5
                      text-[#FFD54F]
                      group-hover:text-[#E65100]
                    "
                  />
                </div>

                <div>
                  <p
                    className="
                      text-[11px]
                      sm:text-xs
                      font-bold
                      text-white
                    "
                  >
                    Khas Borneo
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      sm:text-[10px]
                      text-white/70
                    "
                  >
                    Authentic local story
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                CTA
                ================================================= */}

            <div
              className="
                mt-7
                sm:mt-9
                flex
                flex-col
                sm:flex-row
                items-stretch
                sm:items-center
                gap-3
              "
            >
              <button
                onClick={onExploreCatalog}
                id="hero-btn-catalog"
                className="
                  bonles-btn
                  bonles-btn-primary
                  min-h-[48px]
                  sm:min-h-[52px]
                  px-6
                  sm:px-7
                  text-[10px]
                  sm:text-[11px]
                  tracking-[0.14em]
                "
              >
                <ShoppingBag className="w-4 h-4" />

                <span>
                  Jelajahi Katalog
                </span>

                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onFeaturedClick}
                id="hero-btn-featured"
                className="
                  bonles-btn
                  bonles-btn-outline
                  min-h-[48px]
                  sm:min-h-[52px]
                  px-6
                  sm:px-7
                  text-[10px]
                  sm:text-[11px]
                  tracking-[0.14em]
                "
              >
                <Sparkles className="w-3.5 h-3.5" />

                <span>
                  Koleksi Pilihan
                </span>
              </button>
            </div>

            {/* WhatsApp micro CTA */}
            <div
              className="
                mt-5
                flex
                items-center
                gap-2
                text-[10px]
                text-[#7A6858]
              "
            >
              <MessageCircle
                className="
                  w-3.5
                  h-3.5
                  text-[#2E7D32]
                "
              />

              <span>
                Ingin pesan langsung?
              </span>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  font-bold
                  text-[#D84315]
                  hover:text-[#E65100]
                  transition-colors
                "
              >
                Hubungi WhatsApp
              </a>
            </div>
          </div>

          {/* ==================================================
              RIGHT — HERO PRODUCT VISUAL
              ================================================== */}

          <div
            className="
              lg:col-span-6
              xl:col-span-5
              order-1
              lg:order-2
            "
          >
            <div
              className="
                relative
                mx-auto
                max-w-[560px]
              "
            >
              {/* Decorative gold frame */}
              <div
                className="
                  absolute
                  -top-3
                  -right-3
                  sm:-top-4
                  sm:-right-4
                  w-20
                  h-20
                  sm:w-28
                  sm:h-28
                  border-t
                  border-r
                  border-[#FFB300]/60
                  pointer-events-none
                "
              />

              <div
                className="
                  absolute
                  -bottom-3
                  -left-3
                  sm:-bottom-4
                  sm:-left-4
                  w-20
                  h-20
                  sm:w-28
                  sm:h-28
                  border-b
                  border-l
                  border-[#FFB300]/60
                  pointer-events-none
                "
              />

              {/* Image */}
              <div
                className="
                  relative
                  overflow-hidden
                  bg-[#FFE0B2]
                  aspect-[4/5]
                  sm:aspect-[5/6]
                "
              >
                <img
                  src={imageUrl}
                  alt={`${productName} — ${productTagline}`}
                  referrerPolicy="no-referrer"
                  className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                    object-center
                    transition-transform
                    duration-1000
                    hover:scale-[1.035]
                  "
                />

                {/* Image overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#6E1017]/90
                    via-[#6E1017]/10
                    to-transparent
                  "
                />

                {/* Top label */}
                <div
                  className="
                    absolute
                    top-4
                    left-4
                    right-4
                    sm:top-5
                    sm:left-5
                    sm:right-5
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-2
                      bg-[#FFF8F0]/95
                      backdrop-blur-sm
                      px-3
                      py-1.5
                      text-[8px]
                      sm:text-[9px]
                      tracking-[0.16em]
                      font-bold
                      text-[#D84315]
                    "
                  >
                    <span
                      className="
                        w-1.5
                        h-1.5
                        rounded-full
                        bg-[#FFD54F]
                      "
                    />

                    BORNEO CRAFTED
                  </span>

                  <span
                    className="
                      hidden
                      sm:inline-flex
                      items-center
                      gap-1.5
                      bg-[#6E1017]/80
                      backdrop-blur-sm
                      border
                      border-white/15
                      px-3
                      py-1.5
                      text-[8px]
                      tracking-[0.14em]
                      font-bold
                      text-[#FFF3E0]
                    "
                  >
                    <Sparkles className="w-3 h-3 text-[#FFE082]" />

                    SIGNATURE
                  </span>
                </div>

                {/* Bottom product information */}
                <div
                  className="
                    absolute
                    left-5
                    right-5
                    bottom-5
                    sm:left-7
                    sm:right-7
                    sm:bottom-7
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      mb-2.5
                    "
                  >
                    <span
                      className="
                        h-px
                        w-8
                        bg-[#FFE082]
                      "
                    />

                    <span
                      className="
                        text-[8px]
                        sm:text-[9px]
                        tracking-[0.18em]
                        uppercase
                        font-bold
                        text-[#FFE082]
                      "
                    >
                      High Protein Fish Crunch
                    </span>
                  </div>

                  <h2
                    className="
                      font-display
                      text-2xl
                      sm:text-3xl
                      lg:text-4xl
                      font-semibold
                      text-white
                      leading-tight
                    "
                  >
                    {productName}
                  </h2>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      sm:text-xs
                      text-[#FFE0B2]
                      tracking-wide
                    "
                  >
                    {productTagline}
                  </p>
                </div>
              </div>

              {/* =================================================
                  PRODUCT INFO STRIP
                  ================================================= */}

              <div
                className="
                  mt-3
                  sm:mt-4
                  grid
                  grid-cols-3
                  divide-x
                  divide-[#FFD1A8]
                  border
                  border-[#FFD1A8]
                  bg-[#FFF3E0]
                "
              >
                <div
                  className="
                    px-3
                    py-3
                    sm:px-4
                    sm:py-4
                    text-center
                  "
                >
                  <Check
                    className="
                      w-3.5
                      h-3.5
                      text-[#2E7D32]
                      mx-auto
                      mb-1.5
                    "
                  />

                  <p
                    className="
                      text-[9px]
                      sm:text-[10px]
                      font-bold
                      text-[#3F3026]
                    "
                  >
                    Tanpa Tulang Tengah
                  </p>
                </div>

                <div
                  className="
                    px-3
                    py-3
                    sm:px-4
                    sm:py-4
                    text-center
                  "
                >
                  <Flame
                    className="
                      w-3.5
                      h-3.5
                      text-[#E65100]
                      mx-auto
                      mb-1.5
                    "
                  />

                  <p
                    className="
                      text-[9px]
                      sm:text-[10px]
                      font-bold
                      text-[#3F3026]
                    "
                  >
                    Kaya Protein
                  </p>
                </div>

                <div
                  className="
                    px-3
                    py-3
                    sm:px-4
                    sm:py-4
                    text-center
                  "
                >
                  <PackageCheck
                    className="
                      w-3.5
                      h-3.5
                      text-[#2E7D32]
                      mx-auto
                      mb-1.5
                    "
                  />

                  <p
                    className="
                      text-[9px]
                      sm:text-[10px]
                      font-bold
                      text-[#3F3026]
                    "
                  >
                    Praktis
                  </p>
                </div>
              </div>

              {/* Small editorial caption */}
              <div
                className="
                  mt-4
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <span
                  className="
                    text-[8px]
                    sm:text-[9px]
                    uppercase
                    tracking-[0.16em]
                    text-[#8B735B]
                  "
                >
                  A local ingredient.
                </span>

                <span
                  className="
                    flex-1
                    h-px
                    bg-[#FFD1A8]
                  "
                />

                <span
                  className="
                    text-[8px]
                    sm:text-[9px]
                    uppercase
                    tracking-[0.16em]
                    text-[#8B735B]
                  "
                >
                  A modern experience.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          BOTTOM BRAND STATEMENT
          ====================================================== */}

      <div
        className="
          relative
          z-10
          border-t
          border-[#FFD1A8]/60
          bg-black/10
        "
      >
        <div
          className="
            bonles-container
            py-4
            sm:py-5
            flex
            flex-col
            sm:flex-row
            items-center
            justify-center
            gap-2
            sm:gap-4
            text-center
          "
        >
          <span
            className="
              font-brand
              text-[10px]
              sm:text-xs
              tracking-[0.16em]
              text-[#FFF3E0]
            "
          >
            BONLES FOOD NUSANTARA
          </span>

          <span
            className="
              hidden
              sm:block
              w-1
              h-1
              rounded-full
              bg-[#FFB300]
            "
          />

          <span
            className="
              text-[9px]
              sm:text-[10px]
              tracking-wide
              text-white/75
            "
          >
            Dari Borneo, untuk Indonesia dan dunia.
          </span>
        </div>
      </div>
    </section>
  );
};

