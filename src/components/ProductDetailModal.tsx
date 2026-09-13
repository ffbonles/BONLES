import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle2, AlertTriangle, Ban, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState<string>(
    product.MAIN_IMAGE_URL || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
  );
  const [quantity, setQuantity] = useState<number>(1);

  const isOutOfStock = product.STOCK <= 0;
  const isLowStock = product.STOCK > 0 && product.STOCK <= 5;
  const hasDiscount = product.DISCOUNT_PRICE > 0 && product.DISCOUNT_PRICE < product.PRICE;
  const effectivePrice = hasDiscount ? product.DISCOUNT_PRICE : product.PRICE;

  // Build available gallery images list
  const galleryList = [
    { title: 'Utama', url: product.MAIN_IMAGE_URL },
    { title: 'Galeri 1', url: product.GALLERY_1_URL },
    { title: 'Galeri 2', url: product.GALLERY_2_URL },
    { title: 'Galeri 3', url: product.GALLERY_3_URL },
  ].filter(item => Boolean(item.url));

  const handleIncrease = () => {
    if (quantity < product.STOCK) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAdd = () => {
    if (!isOutOfStock) {
      onAddToCart(product, quantity);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-white border border-orange-200 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Accent Line */}
        <div className="h-[4px] w-full bg-gradient-to-r from-[#FF5E0E] via-[#FFAA00] to-emerald-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-stone-500 hover:text-stone-900 bg-orange-50 hover:bg-orange-100 p-2 rounded-full border border-orange-200 transition-colors shadow-2xs cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Left Gallery & Media Column */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-orange-50/40 border border-orange-100 shadow-inner">
              <img
                src={selectedImage}
                alt={product.NAME}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              {product.FEATURED && (
                <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-900 text-[10px] font-extrabold px-2.5 py-1 rounded-md tracking-wider uppercase flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 fill-stone-900" />
                  Unggulan
                </span>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {galleryList.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {galleryList.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img.url)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border shrink-0 transition-all cursor-pointer ${
                      selectedImage === img.url
                        ? 'border-[#FF7A00] ring-2 ring-[#FF7A00]/40'
                        : 'border-orange-100 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Micro Trust Info */}
            <div className="bg-orange-50/60 border border-orange-200/70 p-3.5 rounded-xl text-xs space-y-2 text-stone-600 mt-auto">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
                <span className="font-medium">Pangan Olahan Berkualitas Nusantara</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">Diproduksi Bersih dengan Standar Higienis</span>
              </div>
            </div>
          </div>

          {/* Right Info Column */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#EA580C] tracking-widest uppercase font-bold">
                  {product.CATEGORY_NAME}
                </span>
                <span className="font-mono text-stone-500 bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-200/80">
                  SKU: {product.SKU}
                </span>
              </div>

              {/* Product Name */}
              <h2 className="text-xl sm:text-2xl font-serif-luxury text-stone-900 font-bold leading-snug">
                {product.NAME}
              </h2>

              {/* Price & Weight */}
              <div className="flex items-baseline gap-3 pb-3 border-b border-orange-100">
                <span className="text-2xl font-extrabold text-stone-900 tracking-tight">
                  Rp {effectivePrice.toLocaleString('id-ID')}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-stone-400 line-through">
                    Rp {product.PRICE.toLocaleString('id-ID')}
                  </span>
                )}
                <span className="ml-auto text-xs text-stone-700 font-semibold bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-lg">
                  Netto: {product.WEIGHT || '100g'}
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-xs">
                {isOutOfStock ? (
                  <span className="flex items-center gap-1.5 text-red-700 bg-red-100 border border-red-300 px-3 py-1 rounded-lg font-bold">
                    <Ban className="w-3.5 h-3.5 text-red-600" />
                    STOK HABIS (Tidak dapat dipesan)
                  </span>
                ) : isLowStock ? (
                  <span className="flex items-center gap-1.5 text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-lg font-bold animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Stok Terbatas: Sisa {product.STOCK} unit
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-lg font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Stok Tersedia: {product.STOCK} unit siap kirim
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-xs uppercase tracking-wider text-stone-400 font-bold">Deskripsi</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {product.DESCRIPTION || 'Deskripsi produk resmi Bonles Food Nusantara.'}
                </p>
              </div>

              {/* Composition & Nutrition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {product.COMPOSITION && (
                  <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C] mb-1">
                      Komposisi
                    </h5>
                    <p className="text-[11px] text-stone-600 leading-snug">{product.COMPOSITION}</p>
                  </div>
                )}

                {product.NUTRITION && (
                  <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C] mb-1">
                      Informasi Gizi
                    </h5>
                    <p className="text-[11px] text-stone-600 leading-snug">{product.NUTRITION}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity and Add to Cart Section */}
            <div className="pt-4 border-t border-orange-100 space-y-3">
              {!isOutOfStock && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-600 uppercase tracking-wider font-bold">
                    Jumlah Pesanan:
                  </span>
                  <div className="flex items-center border border-orange-200 rounded-xl bg-white shadow-2xs">
                    <button
                      onClick={handleDecrease}
                      disabled={quantity <= 1}
                      className="px-3.5 py-1.5 text-stone-700 hover:text-[#EA580C] disabled:opacity-30 disabled:hover:text-stone-700 transition-colors font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-sm font-bold text-stone-900 min-w-10 text-center font-mono">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrease}
                      disabled={quantity >= product.STOCK}
                      className="px-3.5 py-1.5 text-stone-700 hover:text-[#EA580C] disabled:opacity-30 disabled:hover:text-stone-700 transition-colors font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`w-full py-3.5 rounded-xl text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isOutOfStock
                    ? 'bg-stone-200 text-stone-400 border border-stone-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#FF5E0E] via-[#FF7A00] to-[#FFAA00] hover:from-[#EA580C] hover:to-[#FF9500] text-white shadow-lg shadow-orange-500/25 active:scale-98'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {isOutOfStock
                    ? 'Stok Tidak Tersedia'
                    : `Tambah ke Keranjang • Rp ${(effectivePrice * quantity).toLocaleString('id-ID')}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
