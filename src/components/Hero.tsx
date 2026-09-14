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
        bg-gradient-to-br
        from-[#6E1017]
        via-[#B91C1C]
        to-[#F59E0B]
        border-b
        border-[#FCD34D]/50
      "
    >
      {/* ======================================================
          BACKGROUND DECORATION
          ====================================================== */}

      <div
        className="
          absolute
          -top-40
          -right-40
          w-[500px]
          h-[500px]
          rounded-full
          bg-[#FDE047]/20
          blur-3xl
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          top-[35%]
          -left-48
          w-[480px]
          h-[480px]
          rounded-full
          bg-[#EA580C]/30
          blur-3xl
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-[-220px]
          right-[18%]
          w-[420px]
          h-[420px]
          rounded-full
          bg-[#991B1B]/30
          blur-3xl
          pointer-events-none
        "
      />

      {/* Subtle editorial grid lines */}
      <div
        className="
          hidden
          lg:block
          absolute
          left-[8%]
          top-0
          bottom-0
          w-px
          bg-white/15
          pointer-events-none
        "
      />

      <div
        className="
          hidden
          lg:block
          absolute
          right-[8%]
          top-0
          bottom-0
          w-px
          bg-white/10
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
          py-10
          sm:py-14
          lg:py-18
          xl:py-22
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-12
            gap-9
            lg:gap-12
            xl:gap-18
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
                  sm:w-12
                  h-[2px]
                  bg-[#FCD34D]
                "
              />

              <span
                className="
                  text-[9px]
                  sm:text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-[#FFF7ED]
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
                text-[2.45rem]
                sm:text-5xl
                lg:text-6xl
                xl:text-[68px]
                font-semibold
                tracking-[-0.04em]
                leading-[1.01]
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
                  h-[3px]
                  rounded-full
                  bg-gradient-to-r
                  from-[#FCD34D]
                  to-[#F59E0B]
                "
              />

              <span
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-[#FDE047]
                  shadow-[0_0_12px_rgba(253,224,71,0.7)]
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
                text-white/88
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
                  p-3.5
                  sm:p-4
                  rounded-xl
                  bg-white/[0.10]
                  backdrop-blur-md
                  border
                  border-white/20
                  hover:bg-white/[0.16]
                  hover:border-[#FCD34D]/80
                  transition-all
                  duration-300
                "
              >
                <div
                  className="
                    w-9
                    h-9
                    rounded-lg
                    bg-[#F59E0B]/20
                    border
                    border-[#FCD34D]/30
                    flex
                    items-center
                    justify-center
                    shrink-0
                    mb-0
                    sm:mb-3
                    group-hover:bg-[#FCD34D]
                    transition-all
                    duration-300
                  "
                >
                  <Flame
                    className="
                      w-4
                      h-4
                      text-[#FDE047]
                      group-hover:text-[#991B1B]
                      transition-colors
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
                      text-white/65
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
                  p-3.5
                  sm:p-4
                  rounded-xl
                  bg-white/[0.10]
                  backdrop-blur-md
                  border
                  border-white/20
                  hover:bg-white/[0.16]
                  hover:border-[#FCD34D]/80
                  transition-all
                  duration-300
                "
              >
                <div
                  className="
                    w-9
                    h-9
                    rounded-lg
                    bg-[#F59E0B]/20
                    border
                    border-[#FCD34D]/30
                    flex
                    items-center
                    justify-center
                    shrink-0
                    mb-0
                    sm:mb-3
                    group-hover:bg-[#FCD34D]
                    transition-all
                    duration-300
                  "
                >
                  <PackageCheck
                    className="
                      w-4
                      h-4
                      text-[#FDE047]
                      group-hover:text-[#991B1B]
                      transition-colors
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
                      text-white/65
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
                  p-3.5
                  sm:p-4
                  rounded-xl
                  bg-white/[0.10]
                  backdrop-blur-md
                  border
                  border-white/20
                  hover:bg-white/[0.16]
                  hover:border-[#FCD34D]/80
                  transition-all
                  duration-300
                "
              >
                <div
                  className="
                    w-9
                    h-9
                    rounded-lg
                    bg-[#F59E0B]/20
                    border
                    border-[#FCD34D]/30
                    flex
                    items-center
                    justify-center
                    shrink-0
                    mb-0
                    sm:mb-3
                    group-hover:bg-[#FCD34D]
                    transition-all
                    duration-300
                  "
                >
                  <Award
                    className="
                      w-4
                      h-4
                      text-[#FDE047]
                      group-hover:text-[#991B1B]
                      transition-colors
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
                      text-white/65
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
                  min-h-[50px]
                  sm:min-h-[54px]
                  inline-flex
                  items-center
                  justify-center
                  gap-2.5
                  rounded-xl
                  bg-[#FFF7ED]
                  px-6
                  sm:px-7
                  text-[10px]
                  sm:text-[11px]
                  font-bold
                  tracking-[0.14em]
                  text-[#991B1B]
                  shadow-[0_10px_30px_rgba(0,0,0,0.15)]
                  hover:bg-[#FDE047]
                  hover:text-[#7F1D1D]
                  hover:-translate-y-0.5
                  transition-all
                  duration-300
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
                  min-h-[50px]
                  sm:min-h-[54px]
                  inline-flex
                  items-center
                  justify-center
                  gap-2.5
                  rounded-xl
                  border
                  border-white/35
                  bg-white/[0.08]
                  backdrop-blur-md
                  px-6
                  sm:px-7
                  text-[10px]
                  sm:text-[11px]
                  font-bold
                  tracking-[0.14em]
                  text-white
                  hover:bg-white
                  hover:text-[#991B1B]
                  hover:border-white
                  transition-all
                  duration-300
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
                flex-wrap
                items-center
                gap-2
                text-[10px]
                text-white/65
              "
            >
              <MessageCircle
                className="
                  w-3.5
                  h-3.5
                  text-[#86EFAC]
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
                  text-[#FDE047]
                  hover:text-white
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
              {/* Decorative yellow frame */}
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
                  border-t-2
                  border-r-2
                  border-[#FCD34D]/70
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
                  border-b-2
                  border-l-2
                  border-[#FCD34D]/70
                  pointer-events-none
                "
              />

              {/* Image */}
              <div
                className="
                  relative
                  overflow-hidden
                  rounded-2xl
                  bg-[#7F1D1D]
                  aspect-[4/5]
                  sm:aspect-[5/6]
                  shadow-[0_24px_70px_rgba(0,0,0,0.28)]
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
                    from-[#450A0A]/95
                    via-[#7F1D1D]/15
                    to-transparent
                  "
                />

                {/* Warm glow */}
                <div
                  className="
                    absolute
                    inset-x-0
                    bottom-0
                    h-40
                    bg-gradient-to-t
                    from-[#EA580C]/25
                    to-transparent
                    pointer-events-none
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
                      rounded-lg
                      bg-[#FFF7ED]/95
                      backdrop-blur-sm
                      px-3
                      py-1.5
                      text-[8px]
                      sm:text-[9px]
                      tracking-[0.16em]
                      font-bold
                      text-[#991B1B]
                    "
                  >
                    <span
                      className="
                        w-1.5
                        h-1.5
                        rounded-full
                        bg-[#F59E0B]
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
                      rounded-lg
                      bg-[#450A0A]/75
                      backdrop-blur-sm
                      border
                      border-white/15
                      px-3
                      py-1.5
                      text-[8px]
                      tracking-[0.14em]
                      font-bold
                      text-[#FFF7ED]
                    "
                  >
                    <Sparkles
                      className="
                        w-3 h-3
                        text-[#FDE047]
                      "
                    />

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
                        h-[2px]
                        w-8
                        bg-[#FCD34D]
                      "
                    />

                    <span
                      className="
                        text-[8px]
                        sm:text-[9px]
                        tracking-[0.18em]
                        uppercase
                        font-bold
                        text-[#FDE047]
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
                      text-[#FED7AA]
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
                  divide-[#F5CBA7]
                  border
                  border-[#F5CBA7]
                  rounded-xl
                  overflow-hidden
                  bg-[#FFF7ED]
                  shadow-[0_10px_30px_rgba(127,29,29,0.12)]
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
                      text-[#DC2626]
                      mx-auto
                      mb-1.5
                    "
                  />

                  <p
                    className="
                      text-[9px]
                      sm:text-[10px]
                      font-bold
                      text-[#4A2520]
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
                      text-[#EA580C]
                      mx-auto
                      mb-1.5
                    "
                  />

                  <p
                    className="
                      text-[9px]
                      sm:text-[10px]
                      font-bold
                      text-[#4A2520]
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
                      text-[#D97706]
                      mx-auto
                      mb-1.5
                    "
                  />

                  <p
                    className="
                      text-[9px]
                      sm:text-[10px]
                      font-bold
                      text-[#4A2520]
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
                    text-[#FFE4C7]
                  "
                >
                  A local ingredient.
                </span>

                <span
                  className="
                    flex-1
                    h-px
                    bg-[#FCD34D]/40
                  "
                />

                <span
                  className="
                    text-[8px]
                    sm:text-[9px]
                    uppercase
                    tracking-[0.16em]
                    text-[#FFE4C7]
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
          border-white/15
          bg-[#450A0A]/20
          backdrop-blur-sm
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
              text-[#FFF7ED]
            "
          >
            BONLES FOOD NUSANTARA
          </span>

          <span
            className="
              hidden
              sm:block
              w-1.5
              h-1.5
              rounded-full
              bg-[#FCD34D]
            "
          />

          <span
            className="
              text-[9px]
              sm:text-[10px]
              tracking-wide
              text-white/70
            "
          >
            Dari Borneo, untuk Indonesia dan dunia.
          </span>
        </div>
      </div>
    </section>
  );
};
