import React from 'react';
import { Star, Quote, ShieldCheck } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
}) => {
  return (
    <section
      id="testimonials"
      aria-label="Ulasan Konsumen BONLES"
      className="relative overflow-hidden border-t border-[#C9A45C]/20 bg-[#F8F4EA] py-20 sm:py-28"
    >
      {/* ============================================================
          AMBIENT DECORATION
      ============================================================ */}
      <div
        className="pointer-events-none absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-[#D8B878]/8 blur-[110px]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#185043]/8 blur-[110px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ==========================================================
            SECTION HEADER
        =========================================================== */}
        <div className="mx-auto mb-14 max-w-2xl text-center sm:mb-16">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#C9A45C]" />

            <span className="font-brand text-[9px] font-semibold uppercase tracking-[0.28em] text-[#9E793A]">
              Customer Voices
            </span>

            <span className="h-px w-10 bg-[#C9A45C]" />
          </div>

          <h2 className="font-display text-3xl font-medium leading-tight text-[#09271F] sm:text-4xl lg:text-5xl">
            Apa Kata Mereka
            <span className="block italic text-[#9E793A]">
              Tentang BONLES
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm font-light leading-7 text-[#65706A] sm:text-base">
            Pengalaman pelanggan menikmati camilan BONLES—dari kerenyahan
            hingga cita rasa yang membawa karakter Borneo ke setiap gigitan.
          </p>
        </div>

        {/* ==========================================================
            TESTIMONIAL GRID
        =========================================================== */}
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <article
                key={item.ID}
                className="group relative flex min-h-[280px] flex-col justify-between overflow-hidden border border-[#D8C9B3]/70 bg-[#FCFAF5] p-6 shadow-[0_10px_35px_rgba(9,39,31,0.05)] transition-all duration-500 hover:-translate-y-1 hover:border-[#C9A45C]/60 hover:shadow-[0_18px_45px_rgba(9,39,31,0.09)] sm:p-7"
              >
                {/* Decorative quote */}
                <div
                  className="pointer-events-none absolute -right-2 -top-6 font-display text-[110px] leading-none text-[#C9A45C]/10"
                  aria-hidden="true"
                >
                  “
                </div>

                <div className="relative z-10 space-y-5">
                  {/* Number + rating */}
                  <div className="flex items-center justify-between">
                    <span className="font-brand text-[9px] font-semibold tracking-[0.2em] text-[#9E793A]">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div
                      className="flex items-center gap-1"
                      aria-label={`Rating ${item.RATING || 5} dari 5`}
                    >
                      {Array.from({
                        length: item.RATING || 5,
                      }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-[#B18B4B] text-[#B18B4B]"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="flex gap-3">
                    <Quote className="mt-1 h-4 w-4 shrink-0 text-[#C9A45C]" />

                    <p className="text-sm font-light italic leading-7 text-[#303934] sm:text-[15px]">
                      “{item.MESSAGE}”
                    </p>
                  </div>
                </div>

                {/* ==================================================
                    CUSTOMER
                =================================================== */}
                <div className="relative z-10 mt-7 border-t border-[#D8C9B3]/60 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={
                          item.PHOTO_URL ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                        }
                        alt={item.CUSTOMER_NAME}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="h-11 w-11 rounded-full border border-[#C9A45C]/50 object-cover grayscale-[15%] transition-all duration-300 group-hover:grayscale-0"
                      />

                      <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#FCFAF5] bg-[#185043]">
                        <ShieldCheck className="h-2.5 w-2.5 text-[#D8B878]" />
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate text-xs font-semibold text-[#18201D]">
                        {item.CUSTOMER_NAME}
                      </h4>

                      <span className="mt-0.5 block font-brand text-[8px] uppercase tracking-[0.15em] text-[#7C8580]">
                        Pelanggan Terverifikasi
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gold hover line */}
                <div className="absolute bottom-0 left-0 h-px w-0 bg-[#C9A45C] transition-all duration-500 group-hover:w-full" />
              </article>
            ))}
          </div>
        ) : (
          /* ============================================================
             EMPTY STATE
          ============================================================ */
          <div className="mx-auto max-w-xl border border-[#D8C9B3]/70 bg-[#FCFAF5] px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#0D3027]">
              <Quote className="h-4 w-4 text-[#D8B878]" />
            </div>

            <h3 className="font-display text-xl text-[#09271F]">
              Cerita pelanggan akan hadir di sini.
            </h3>

            <p className="mt-2 text-xs leading-6 text-[#65706A]">
              Jadilah bagian dari perjalanan BONLES dan bagikan pengalaman
              Anda menikmati cita rasa Borneo.
            </p>
          </div>
        )}

        {/* ==========================================================
            BOTTOM BRAND STATEMENT
        =========================================================== */}
        {testimonials.length > 0 && (
          <div className="mt-14 border-t border-[#D8C9B3]/60 pt-8 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#C9A45C]/60" />

              <span className="font-brand text-[8px] font-semibold uppercase tracking-[0.25em] text-[#9E793A]">
                Made with Local Pride
              </span>

              <span className="h-px w-8 bg-[#C9A45C]/60" />
            </div>

            <p className="mx-auto mt-3 max-w-md font-display text-sm italic text-[#65706A]">
              “Dari Borneo, untuk dinikmati lebih jauh.”
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
