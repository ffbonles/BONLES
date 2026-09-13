import React from 'react';
import { ShoppingBag, Eye, Star, AlertTriangle, CheckCircle2, Ban, Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetail: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetail,
  onAddToCart,
}) => {
  const isOutOfStock = product.STOCK <= 0;
  const isLowStock = product.STOCK > 0 && product.STOCK <= 5;
  const hasDiscount = product.DISCOUNT_PRICE > 0 && product.DISCOUNT_PRICE < product.PRICE;
  const effectivePrice = hasDiscount ? product.DISCOUNT_PRICE : product.PRICE;

  const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

  return (
    <div
      id={`product-card-${product.SKU}`}
      className="group bg-white border border-orange-200/80 hover:border-orange-400 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/15 active:scale-[0.99]"
    >
      {/* Image Container with responsive mobile aspect ratio */}
      <div className="relative aspect-4/3 sm:aspect-4/3 w-full bg-orange-50/50 overflow-hidden">
        <img
          src={product.MAIN_IMAGE_URL || fallbackImage}
          alt={product.NAME}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Soft Warm Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

        {/* Badges Top Left */}
        <div className="absolute top-2 sm:top-2.5 left-2 sm:left-2.5 flex flex-col gap-1 z-10">
          {product.FEATURED && (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#FFB703] to-[#FB8500] text-[#2B1408] text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-md tracking-wider uppercase shadow-sm">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#2B1408]" />
              Unggulan
            </span>
          )}
          {hasDiscount && (
            <span className="inline-flex items-center bg-gradient-to-r from-[#E63946] to-[#D90429] text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-md tracking-wider uppercase shadow-sm">
              Hemat Rp {(product.PRICE - product.DISCOUNT_PRICE).toLocaleString('id-ID')}
            </span>
          )}
        </div>

        {/* Stock Badge Top Right */}
        <div className="absolute top-2 sm:top-2.5 right-2 sm:right-2.5 z-10">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 bg-stone-900/90 text-stone-200 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              <Ban className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400" />
              HABIS
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 bg-amber-100/95 border border-amber-300 text-amber-900 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs animate-pulse">
              <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600" />
              Sisa {product.STOCK}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-white/95 border border-emerald-200 text-emerald-700 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600" />
              Stok: {product.STOCK}
            </span>
          )}
        </div>

        {/* Quick View Button on Desktop Hover */}
        <button
          onClick={() => onViewDetail(product)}
          className="hidden md:flex absolute inset-0 items-center justify-center bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          aria-label="Lihat Detail Produk"
        >
          <span className="bg-white/95 text-[#2B1408] border border-orange-300 px-3.5 py-1.5 rounded-xl text-xs tracking-wider uppercase font-bold flex items-center gap-1.5 shadow-lg">
            <Eye className="w-3.5 h-3.5 text-[#FF5500]" />
            Lihat Detail
          </span>
        </button>
      </div>

      {/* Content Info */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3 bg-white">
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-stone-500 mb-1">
            <span className="uppercase tracking-wider text-[#EA580C] font-extrabold truncate max-w-[120px]">
              {product.CATEGORY_NAME}
            </span>
            <span className="font-mono text-stone-400 text-[10px] font-medium">{product.SKU}</span>
          </div>

          <h3
            onClick={() => onViewDetail(product)}
            className="text-xs sm:text-sm font-bold text-[#2B1408] group-hover:text-[#FF5500] transition-colors line-clamp-2 cursor-pointer leading-snug"
            title={product.NAME}
          >
            {product.NAME}
          </h3>

          <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
            <span>Kemasan:</span>
            <span className="text-stone-800 font-semibold">{product.WEIGHT || '100g'}</span>
          </div>
        </div>

        {/* Pricing & Icon Action Buttons */}
        <div className="pt-2 border-t border-orange-100">
          <div className="flex items-baseline gap-1.5 mb-2.5">
            <span className="text-base sm:text-lg font-black text-[#EA3A1E] tracking-tight">
              Rp {effectivePrice.toLocaleString('id-ID')}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-stone-400 line-through font-medium">
                Rp {product.PRICE.toLocaleString('id-ID')}
              </span>
            )}
          </div>

          {/* Touch-Friendly Icon Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {/* Detail Icon Button */}
            <button
              onClick={() => onViewDetail(product)}
              className="w-full bg-orange-50 hover:bg-orange-100 active:bg-orange-200 text-[#4A2D1B] hover:text-[#2B1408] border border-orange-200 py-2 sm:py-2.5 rounded-xl text-xs tracking-wider uppercase font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              aria-label={`Detail ${product.NAME}`}
            >
              <Eye className="w-3.5 h-3.5 text-[#FF7B00]" />
              <span className="text-[11px] sm:text-xs font-bold">Detail</span>
            </button>

            {/* Add to Cart Icon Button */}
            <button
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              className={`w-full py-2 sm:py-2.5 rounded-xl text-xs tracking-wider uppercase font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-stone-200 text-stone-400 border border-stone-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#FF5500] via-[#FF7B00] to-[#FFAA00] hover:from-[#FF4500] hover:to-[#FF9500] active:scale-95 text-white shadow-sm hover:shadow-md hover:shadow-orange-500/25'
              }`}
              aria-label={`Tambah ${product.NAME} ke Keranjang`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="text-[11px] sm:text-xs font-bold">{isOutOfStock ? 'Habis' : '+ Pesan'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
