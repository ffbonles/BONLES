import React, { useEffect, useState } from 'react';
import {
  MessageCircle,
  Mail,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowUpRight,
} from 'lucide-react';
import { store } from '../services/store';
import { BonlesLogo } from './BonlesLogo';

interface FooterProps {
  onOpenAdminLogin?: () => void;
  isAuthenticated?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdminLogin,
  isAuthenticated,
}) => {
  const [settings, setSettings] = useState<Record<string, string>>(() =>
    store.getSettingsMap()
  );

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setSettings(store.getSettingsMap());
    });

    return unsubscribe;
  }, []);

  const storeName =
    settings['STORE_NAME'] || 'PT. BONLES FOOD NUSANTARA';

  const tagline =
    settings['TAGLINE'] ||
    'Snack Tinggi Protein & Oleh-Oleh Khas Nusantara';

  const waNumber =
    settings['WHATSAPP_NUMBER'] || '6285174333902';

  const email =
    settings['STORE_EMAIL'] || 'bonlesff@gmail.com';

  const address =
    settings['STORE_ADDRESS'] ||
    'Jl. MT. Haryono Gg. Mufakat II No.84 Balikpapan Selatan';

  const cleanWaNumber = waNumber.replace(/\D/g, '');

  const formattedWaNumber = cleanWaNumber
    ? `+${cleanWaNumber.startsWith('62') ? cleanWaNumber : `62${cleanWaNumber.replace(/^0/, '')}`}`
    : '';

  const whatsappUrl = cleanWaNumber
    ? `https://wa.me/${
        cleanWaNumber.startsWith('62')
          ? cleanWaNumber
          : `62${cleanWaNumber.replace(/^0/, '')}`
      }`
    : '#';

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="
        relative
        overflow-hidden
        border-t
        border-[#C9A45C]/20
        bg-gradient-to-b
        from-[#09271F]
        via-[#0B3027]
        to-[#061B16]
        text-[#FCFAF5]
      "
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            -right-32
            -top-32
            h-80
            w-80
            rounded-full
            bg-[#16805F]/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -left-32
            h-96
            w-96
            rounded-full
            bg-[#B83B32]/5
            blur-3xl
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-72
            w-72
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#16805F]/5
            blur-3xl
          "
        />
      </div>

      {/* Main Footer */}
      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">

          {/* BRAND */}
          <div className="lg:col-span-5">
            <div className="max-w-md">
              <div className="mb-6">
                <BonlesLogo
                  variant="horizontal"
                  size="lg"
                  lightBg={false}
                />
              </div>

              <p className="max-w-md text-sm leading-7 text-[#CFCFC7] sm:text-[15px]">
                {tagline}
              </p>

              <p className="mt-4 max-w-lg text-sm leading-7 text-[#AEB8B2]">
                Menghadirkan cita rasa lokal Borneo dalam camilan modern
                yang renyah, praktis, dan memiliki cerita.
              </p>

              {/* Quality highlights */}
              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div
                  className="
                    rounded-xl
                    border
                    border-white/8
                    bg-white/[0.035]
                    px-4
                    py-3
                    backdrop-blur-sm
                  "
                >
                  <CheckCircle2
                    className="mb-2 h-5 w-5 text-[#C9A45C]"
                    strokeWidth={1.8}
                  />

                  <p className="text-xs font-semibold text-[#FCFAF5]">
                    Produk Lokal
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-[#91A19A]">
                    Rasa khas Borneo
                  </p>
                </div>

                <div
                  className="
                    rounded-xl
                    border
                    border-white/8
                    bg-white/[0.035]
                    px-4
                    py-3
                    backdrop-blur-sm
                  "
                >
                  <CheckCircle2
                    className="mb-2 h-5 w-5 text-[#C9A45C]"
                    strokeWidth={1.8}
                  />

                  <p className="text-xs font-semibold text-[#FCFAF5]">
                    High Protein
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-[#91A19A]">
                    Camilan bernutrisi
                  </p>
                </div>

                <div
                  className="
                    rounded-xl
                    border
                    border-white/8
                    bg-white/[0.035]
                    px-4
                    py-3
                    backdrop-blur-sm
                  "
                >
                  <CheckCircle2
                    className="mb-2 h-5 w-5 text-[#C9A45C]"
                    strokeWidth={1.8}
                  />

                  <p className="text-xs font-semibold text-[#FCFAF5]">
                    Dibuat Lokal
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-[#91A19A]">
                    Dari Borneo
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="lg:col-span-2">
            <h3
              className="
                mb-5
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#C9A45C]
              "
            >
              Navigasi
            </h3>

            <nav className="space-y-3">
              <a
                href="#home"
                className="
                  group
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-[#CFCFC7]
                  transition-colors
                  hover:text-white
                "
              >
                Beranda
                <ArrowUpRight
                  className="
                    h-3.5
                    w-3.5
                    opacity-0
                    transition-all
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                    group-hover:opacity-100
                  "
                />
              </a>

              <a
                href="#catalog"
                className="
                  group
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-[#CFCFC7]
                  transition-colors
                  hover:text-white
                "
              >
                Produk
                <ArrowUpRight
                  className="
                    h-3.5
                    w-3.5
                    opacity-0
                    transition-all
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                    group-hover:opacity-100
                  "
                />
              </a>

              <a
                href="#story"
                className="
                  group
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-[#CFCFC7]
                  transition-colors
                  hover:text-white
                "
              >
                Cerita Kami
                <ArrowUpRight
                  className="
                    h-3.5
                    w-3.5
                    opacity-0
                    transition-all
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                    group-hover:opacity-100
                  "
                />
              </a>

              <a
                href="#advantages"
                className="
                  group
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-[#CFCFC7]
                  transition-colors
                  hover:text-white
                "
              >
                Keunggulan
                <ArrowUpRight
                  className="
                    h-3.5
                    w-3.5
                    opacity-0
                    transition-all
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                    group-hover:opacity-100
                  "
                />
              </a>

              <a
                href="#contact"
                className="
                  group
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-[#CFCFC7]
                  transition-colors
                  hover:text-white
                "
              >
                Kontak
                <ArrowUpRight
                  className="
                    h-3.5
                    w-3.5
                    opacity-0
                    transition-all
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                    group-hover:opacity-100
                  "
                />
              </a>
            </nav>
          </div>

          {/* CONTACT */}
          <div className="lg:col-span-5">
            <h3
              className="
                mb-5
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#C9A45C]
              "
            >
              Hubungi Kami
            </h3>

            {/* WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                block
                rounded-2xl
                border
                border-[#C9A45C]/20
                bg-white/[0.045]
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#C9A45C]/40
                hover:bg-white/[0.07]
                hover:shadow-[0_15px_40px_rgba(0,0,0,0.22)]
              "
            >
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#16805F]/15
                    ring-1
                    ring-[#16805F]/30
                  "
                >
                  <MessageCircle
                    className="h-5 w-5 text-[#65C9A5]"
                    strokeWidth={1.8}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#91A19A]">
                    Pesan Sekarang
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#FCFAF5]">
                    Order via WhatsApp
                  </p>

                  <p className="mt-1 text-xs text-[#9EAAA4]">
                    {formattedWaNumber}
                  </p>
                </div>

                <ArrowUpRight
                  className="
                    h-5
                    w-5
                    shrink-0
                    text-[#C9A45C]
                    transition-transform
                    duration-300
                    group-hover:-translate-y-1
                    group-hover:translate-x-1
                  "
                />
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${email}`}
              className="
                mt-4
                flex
                items-center
                gap-3
                text-sm
                text-[#CFCFC7]
                transition-colors
                hover:text-white
              "
            >
              <Mail
                className="h-4 w-4 shrink-0 text-[#C9A45C]"
                strokeWidth={1.8}
              />
              <span className="truncate">{email}</span>
            </a>

            {/* Address */}
            <div className="mt-4 flex items-start gap-3">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A45C]"
                strokeWidth={1.8}
              />

              <p className="text-sm leading-6 text-[#AEB8B2]">
                {address}
              </p>
            </div>
          </div>
        </div>

        {/* Gold divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-[#C9A45C]/25 to-transparent" />

        {/* Bottom Bar */}
        <div
          className="
            flex
            flex-col
            gap-5
            text-xs
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div className="text-[#7F8C86]">
            © {currentYear}{' '}
            <span className="text-[#AEB8B2]">
              {storeName}
            </span>
            . All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-[#718079]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16805F]" />
              Produk Lokal Borneo
            </span>

            {onOpenAdminLogin && (
              <button
                type="button"
                onClick={onOpenAdminLogin}
                className="
                  group
                  flex
                  items-center
                  gap-1.5
                  text-[#596761]
                  transition-colors
                  hover:text-[#C9A45C]
                "
                aria-label={
                  isAuthenticated
                    ? 'Buka panel admin'
                    : 'Akses staf'
                }
              >
                <Lock
                  className="h-3 w-3"
                  strokeWidth={1.8}
                />

                <span>
                  {isAuthenticated
                    ? 'Admin'
                    : 'Staff'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
