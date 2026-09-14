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
    ? `+${
        cleanWaNumber.startsWith('62')
          ? cleanWaNumber
          : `62${cleanWaNumber.replace(/^0/, '')}`
      }`
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
      id="contact"
      className="
        relative
        overflow-hidden
        border-t
        border-[#F97316]/20
        bg-gradient-to-b
        from-[#7A0F18]
        via-[#5C0B12]
        to-[#35070C]
        text-[#FFF8F0]
      "
    >
      {/* Decorative Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            -right-32
            -top-32
            h-80
            w-80
            rounded-full
            bg-[#F97316]/15
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
            bg-[#F04438]/15
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
            bg-[#F59E0B]/8
            blur-3xl
          "
        />

        <div
          className="
            absolute
            right-1/4
            bottom-0
            h-56
            w-56
            rounded-full
            bg-[#F04438]/8
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

              <p className="max-w-md text-sm leading-7 text-[#FFE9D6] sm:text-[15px]">
                {tagline}
              </p>

              <p className="mt-4 max-w-lg text-sm leading-7 text-[#EBC9B8]">
                Menghadirkan cita rasa lokal Borneo dalam camilan modern
                yang renyah, praktis, dan memiliki cerita.
              </p>

              {/* Quality Highlights */}
              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">

                <div
                  className="
                    rounded-xl
                    border
                    border-[#F97316]/15
                    bg-white/[0.045]
                    px-4
                    py-3
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-[#F97316]/35
                    hover:bg-white/[0.07]
                  "
                >
                  <CheckCircle2
                    className="mb-2 h-5 w-5 text-[#F59E0B]"
                    strokeWidth={1.8}
                  />

                  <p className="text-xs font-semibold text-[#FFF8F0]">
                    Produk Lokal
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-[#DDB9A9]">
                    Rasa khas Borneo
                  </p>
                </div>

                <div
                  className="
                    rounded-xl
                    border
                    border-[#F97316]/15
                    bg-white/[0.045]
                    px-4
                    py-3
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-[#F97316]/35
                    hover:bg-white/[0.07]
                  "
                >
                  <CheckCircle2
                    className="mb-2 h-5 w-5 text-[#F59E0B]"
                    strokeWidth={1.8}
                  />

                  <p className="text-xs font-semibold text-[#FFF8F0]">
                    High Protein
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-[#DDB9A9]">
                    Camilan bernutrisi
                  </p>
                </div>

                <div
                  className="
                    rounded-xl
                    border
                    border-[#F97316]/15
                    bg-white/[0.045]
                    px-4
                    py-3
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-[#F97316]/35
                    hover:bg-white/[0.07]
                  "
                >
                  <CheckCircle2
                    className="mb-2 h-5 w-5 text-[#F59E0B]"
                    strokeWidth={1.8}
                  />

                  <p className="text-xs font-semibold text-[#FFF8F0]">
                    Dibuat Lokal
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-[#DDB9A9]">
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
                text-[#F59E0B]
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
                  text-[#EBC9B8]
                  transition-colors
                  hover:text-[#FFD166]
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
                    text-[#F97316]
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
                  text-[#EBC9B8]
                  transition-colors
                  hover:text-[#FFD166]
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
                    text-[#F97316]
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
                  text-[#EBC9B8]
                  transition-colors
                  hover:text-[#FFD166]
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
                    text-[#F97316]
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
                  text-[#EBC9B8]
                  transition-colors
                  hover:text-[#FFD166]
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
                    text-[#F97316]
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
                  text-[#EBC9B8]
                  transition-colors
                  hover:text-[#FFD166]
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
                    text-[#F97316]
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
                text-[#F59E0B]
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
                border-[#F97316]/20
                bg-white/[0.045]
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#F59E0B]/50
                hover:bg-white/[0.075]
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
                    bg-[#F97316]/15
                    ring-1
                    ring-[#F97316]/30
                  "
                >
                  <MessageCircle
                    className="h-5 w-5 text-[#25D366]"
                    strokeWidth={1.8}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#DDB9A9]">
                    Pesan Sekarang
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#FFF8F0]">
                    Order via WhatsApp
                  </p>

                  <p className="mt-1 text-xs text-[#D3AA99]">
                    {formattedWaNumber}
                  </p>
                </div>

                <ArrowUpRight
                  className="
                    h-5
                    w-5
                    shrink-0
                    text-[#F59E0B]
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
                text-[#EBC9B8]
                transition-colors
                hover:text-[#FFD166]
              "
            >
              <Mail
                className="h-4 w-4 shrink-0 text-[#F59E0B]"
                strokeWidth={1.8}
              />

              <span className="truncate">
                {email}
              </span>
            </a>

            {/* Address */}
            <div className="mt-4 flex items-start gap-3">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-[#F59E0B]"
                strokeWidth={1.8}
              />

              <p className="text-sm leading-6 text-[#DDB9A9]">
                {address}
              </p>
            </div>
          </div>
        </div>

        {/* Warm Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-[#F97316]/35 to-transparent" />

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
          <div className="text-[#B98C7D]">
            © {currentYear}{' '}
            <span className="text-[#DDB9A9]">
              {storeName}
            </span>
            . All rights reserved.
          </div>

          <div className="flex items-center gap-4">

            <span className="flex items-center gap-2 text-[#B98C7D]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
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
                  text-[#9E7064]
                  transition-colors
                  hover:text-[#FFD166]
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
