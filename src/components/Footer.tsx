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
    ? `+${cleanWaNumber}`
    : waNumber;

  const whatsappUrl = `https://wa.me/${cleanWaNumber}`;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#100406] text-[#F5EFE6] border-t border-[#D82824]/20">

      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#D82824]/5 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="py-16 lg:py-20">

          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 lg:gap-16">

            {/* =========================================================
                BRAND
            ========================================================== */}
            <div className="md:col-span-5">

              <div className="mb-5">
                <BonlesLogo
                  size="md"
                  variant="horizontal"
                />
              </div>

              <p className="max-w-md text-sm leading-7 text-[#A89886]">
                {tagline}. Komitmen kami menghadirkan camilan berbahan
                lokal pilihan dengan cita rasa khas Nusantara, dikemas
                secara higienis dan modern untuk menemani setiap momen.
              </p>

              {/* Quality highlights */}
              <div className="mt-7 space-y-3">

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#00D222]"
                    aria-hidden="true"
                  />

                  <span className="text-xs leading-5 text-[#DCD1C0]">
                    Standing pouch zipper kedap udara & higienis
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#00D222]"
                    aria-hidden="true"
                  />

                  <span className="text-xs leading-5 text-[#DCD1C0]">
                    Bahan baku pilihan kaya nutrisi & tinggi protein alami
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#00D222]"
                    aria-hidden="true"
                  />

                  <span className="text-xs leading-5 text-[#DCD1C0]">
                    Cita rasa lokal Borneo dengan sentuhan modern
                  </span>
                </div>

              </div>
            </div>

            {/* =========================================================
                PRODUCT CATEGORIES
            ========================================================== */}
            <div className="md:col-span-3">

              <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#F5A623]">
                Produk
              </h4>

              <ul className="space-y-3">

                <li>
                  <a
                    href="#catalog"
                    className="group inline-flex items-center gap-1.5 text-sm text-[#DCD1C0] transition-colors duration-200 hover:text-white"
                  >
                    Snack Tinggi Protein
                    <ArrowUpRight
                      className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </a>
                </li>

                <li>
                  <a
                    href="#catalog"
                    className="group inline-flex items-center gap-1.5 text-sm text-[#DCD1C0] transition-colors duration-200 hover:text-white"
                  >
                    Amplang & Keripik Ikan
                    <ArrowUpRight
                      className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </a>
                </li>

                <li>
                  <a
                    href="#catalog"
                    className="group inline-flex items-center gap-1.5 text-sm text-[#DCD1C0] transition-colors duration-200 hover:text-white"
                  >
                    Oleh-Oleh Khas Nusantara
                    <ArrowUpRight
                      className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </a>
                </li>

                <li>
                  <a
                    href="#catalog"
                    className="group inline-flex items-center gap-1.5 text-sm text-[#DCD1C0] transition-colors duration-200 hover:text-white"
                  >
                    Gift Box & Hampers
                    <ArrowUpRight
                      className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </a>
                </li>

              </ul>
            </div>

            {/* =========================================================
                CONTACT
            ========================================================== */}
            <div className="md:col-span-4">

              <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#F5A623]">
                Hubungi Kami
              </h4>

              <div className="space-y-4">

                {/* WhatsApp CTA */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Hubungi Bonles melalui WhatsApp ${formattedWaNumber}`}
                  className="group flex items-center gap-3 rounded-xl border border-[#00D222]/20 bg-[#00D222]/5 px-4 py-3.5 transition-all duration-300 hover:border-[#00D222]/40 hover:bg-[#00D222]/10"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00D222]/10">
                    <MessageCircle
                      className="h-4 w-4 text-[#00D222]"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-[#7F8B7F]">
                      WhatsApp Customer Service
                    </p>

                    <p className="mt-0.5 truncate font-mono text-sm text-white transition-colors group-hover:text-[#F5A623]">
                      {formattedWaNumber}
                    </p>
                  </div>

                  <ArrowUpRight
                    className="ml-auto h-4 w-4 shrink-0 text-[#5D6A5D] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#00D222]"
                    aria-hidden="true"
                  />
                </a>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5A623]/5">
                    <Mail
                      className="h-4 w-4 text-[#F5A623]"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#68574B]">
                      Email
                    </p>

                    <a
                      href={`mailto:${email}`}
                      className="mt-0.5 block text-sm text-[#DCD1C0] transition-colors hover:text-[#F5A623]"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D82824]/5">
                    <MapPin
                      className="h-4 w-4 text-[#D82824]"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#68574B]">
                      Lokasi
                    </p>

                    <p className="mt-0.5 max-w-sm text-sm leading-6 text-[#A89886]">
                      {address}
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* =========================================================
            BOTTOM BAR
        ========================================================== */}
        <div className="border-t border-[#D82824]/15 py-6">

          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">

            <p className="text-center text-[11px] text-[#68574B] sm:text-left">
              © {currentYear}{' '}
              <span className="text-[#8C7B6D]">
                {storeName}
              </span>
              . All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[10px]">

              <span className="text-[#F5A623]">
                Pemesanan Cepat
              </span>

              <span className="text-[#4D4039]">
                •
              </span>

              <span className="text-[#8C7B6D]">
                Kualitas Terjamin
              </span>

              {onOpenAdminLogin && (
                <>
                  <span className="text-[#4D4039]">
                    •
                  </span>

                  <button
                    type="button"
                    onClick={onOpenAdminLogin}
                    aria-label={
                      isAuthenticated
                        ? 'Buka Panel Admin'
                        : 'Buka Akses Staf'
                    }
                    className="group inline-flex cursor-pointer items-center gap-1.5 text-[#4D4039] transition-colors duration-200 hover:text-[#A89886]"
                    title="Akses Portal Pengelola"
                  >
                    <Lock
                      className="h-3 w-3 text-[#4D4039] transition-colors group-hover:text-[#A89886]"
                      aria-hidden="true"
                    />

                    <span>
                      {isAuthenticated
                        ? 'Panel Admin'
                        : 'Akses Staf'}
                    </span>
                  </button>
                </>
              )}

            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};
