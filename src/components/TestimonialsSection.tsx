import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#FAF6ED] via-[#FFF9F2] to-[#FFF5EB] border-t border-orange-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs tracking-[0.25em] text-[#EA580C] font-extrabold uppercase block">
            Ulasan Konsumen
          </span>
          <h2 className="text-3xl font-serif text-[#2B1408] font-bold">
            Apa Kata Mereka Tentang Bonles
          </h2>
          <p className="text-xs sm:text-sm text-[#5C402E]">
            Kepuasan pelanggan atas kerenyahan, kebersihan, dan kenikmatan camilan tinggi protein Bonles Food Nusantara.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.ID}
              className="bg-white border border-orange-200/90 p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/10 transition-all shadow-xs"
            >
              <div className="space-y-3">
                {/* Rating stars */}
                <div className="flex gap-1 text-[#FFAA00]">
                  {Array.from({ length: item.RATING || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFAA00]" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[#5C402E] italic leading-relaxed">
                  "{item.MESSAGE}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-orange-100">
                <img
                  src={
                    item.PHOTO_URL ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={item.CUSTOMER_NAME}
                  className="w-10 h-10 rounded-full object-cover border-2 border-orange-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#2B1408]">{item.CUSTOMER_NAME}</h4>
                  <span className="text-[10px] text-stone-500 font-medium">Pelanggan Terverifikasi</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
