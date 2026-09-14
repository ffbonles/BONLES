import React, { useEffect, useState } from 'react';
import {
  X,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  Ban,
  Star,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
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
  /*
   * ============================================================
   * HOOKS
   * ============================================================
   *
   * Hooks sengaja diletakkan sebelum conditional return.
   * Ini mengikuti Rules of Hooks React.
   */

  const [selectedImage, setSelectedImage] = useState<string>('');

  const [quantity, setQuantity] = useState<number>(1);

  /*
   * ============================================================
   * RESET STATE WHEN PRODUCT CHANGES
   * ============================================================
   */

  useEffect(() => {
    if (!product) return;

    setSelectedImage(
      product.MAIN_IMAGE_URL ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    );

    setQuantity(1);
  }, [product]);

  /*
   * ============================================================
   * LOCK BODY SCROLL
   * ============================================================
   *
   * Saat modal terbuka, halaman di belakang tidak ikut bergerak.
   */

  useEffect(() => {
    if (!product) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [product]);

  /*
   * ============================================================
   * ESCAPE KEY
   * ============================================================
   */

  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  /*
   * ============================================================
   * CONDITIONAL RETURN
   * ============================================================
   */

  if (!product) return null;

  /*
   * ============================================================
   * PRODUCT STATE
   * ============================================================
   */

  const isOutOfStock = product.STOCK <= 0;

  const isLowStock =
    product.STOCK > 0 && product.STOCK <= 5;

  const hasDiscount =
    product.DISCOUNT_PRICE > 0 &&
    product.DISCOUNT_PRICE < product.PRICE;

  const effectivePrice = hasDiscount
    ? product.DISCOUNT_PRICE
    : product.PRICE;

  /*
   * ============================================================
   * GALLERY
   * ============================================================
   */

  const galleryList = [
    {
      title: 'Utama',
      url: product.MAIN_IMAGE_URL,
    },
    {
      title: 'Galeri 1',
      url: product.GALLERY_1_URL,
    },
    {
      title: 'Galeri 2',
      url: product.GALLERY_2_URL,
    },
    {
      title: 'Galeri 3',
      url: product.GALLERY_3_URL,
    },
  ].filter(
    (item) => Boolean(item.url)
  );

  /*
   * ============================================================
   * QUANTITY
   * ============================================================
   */

  const handleIncrease = () => {
    if (quantity < product.STOCK) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  /*
   * ============================================================
   * ADD TO CART
   * ============================================================
   */

  const handleAdd = () => {
    if (isOutOfStock) return;

    onAddToCart(product, quantity);
    onClose();
  };

  /*
   * ============================================================
   * MODAL
   * ============================================================
   */

  return (
    <div
      className="
        fixed
        inset-0
        z-[200]
        flex
        items-center
        justify-center
        bg-stone-900/65
        p-2
        sm:p-4
        md:p-6
        backdrop-blur-sm
      "
      role="dialog"
      aria-modal="true"
      aria-label={`Detail produk ${product.NAME}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {/*
       * ========================================================
       * MODAL CONTAINER
       * ========================================================
       *
       * max-h menggunakan dvh + fallback vh.
       *
       * Ini membuat modal menyesuaikan tinggi viewport:
       *
       * Desktop       → normal
       * Laptop pendek → mengecil
       * Tablet         → adaptif
       * Mobile         → adaptif
       * Landscape      → adaptif
       */}
      <div
        className="
          relative
          flex
          w-full
          max-w-4xl
          max-h-[calc(100vh-16px)]
          max-h-[calc(100dvh-16px)]
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-orange-200
          bg-white
          shadow-2xl

          sm:max-h-[calc(100vh-32px)]
          sm:max-h-[calc(100dvh-32px)]
          sm:rounded-3xl

          md:max-h-[calc(100vh-48px)]
          md:max-h-[calc(100dvh-48px)]
        "
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {/* ======================================================
            TOP ACCENT
        ======================================================= */}

        <div
          className="
            h-[3px]
            w-full
            shrink-0
            bg-gradient-to-r
            from-[#FF5E0E]
            via-[#FFAA00]
            to-emerald-500
          "
        />

        {/* ======================================================
            CLOSE BUTTON
        =======================================================

            Tombol berada di layer paling atas dan tidak ikut
            berada di dalam scroll content.
        */}

        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-3
            top-3
            z-[100]
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-orange-200
            bg-white/95
            text-stone-500
            shadow-lg
            backdrop-blur-md
            transition-all
            duration-200
            hover:border-orange-300
            hover:bg-orange-50
            hover:text-stone-900
            active:scale-95
            focus:outline-none
            focus:ring-2
            focus:ring-[#FF7A00]/40
            sm:right-4
            sm:top-4
          "
          aria-label="Tutup detail produk"
          title="Tutup"
        >
          <X className="h-5 w-5" />
        </button>

        {/* ======================================================
            SCROLLABLE CONTENT
        =======================================================

            Hanya area ini yang melakukan scrolling.

            Tombol X tetap berada di atas modal.
        */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            scroll-smooth
          "
        >
          <div
            className="
              grid
              grid-cols-1
              gap-5
              p-4
              pt-14

              sm:gap-6
              sm:p-6
              sm:pt-14

              md:grid-cols-12
              md:p-7
              md:pt-7

              lg:p-8
            "
          >
            {/* ==================================================
                LEFT / MEDIA
            =================================================== */}

            <div
              className="
                flex
                min-w-0
                flex-col
                gap-3

                md:col-span-5
              "
            >
              {/* Main Image */}

              <div
                className="
                  relative
                  mx-auto
                  aspect-square
                  w-full
                  max-w-[460px]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-orange-100
                  bg-orange-50/40
                  shadow-inner

                  md:max-w-none
                "
              >
                <img
                  src={selectedImage}
                  alt={product.NAME}
                  referrerPolicy="no-referrer"
                  className="
                    h-full
                    w-full
                    object-cover
                    object-center
                  "
                />

                {product.FEATURED && (
                  <span
                    className="
                      absolute
                      left-3
                      top-3
                      flex
                      items-center
                      gap-1
                      rounded-md
                      bg-gradient-to-r
                      from-amber-400
                      to-amber-500
                      px-2.5
                      py-1
                      text-[10px]
                      font-extrabold
                      uppercase
                      tracking-wider
                      text-stone-900
                      shadow
                    "
                  >
                    <Star className="h-3 w-3 fill-stone-900" />

                    Unggulan
                  </span>
                )}
              </div>

              {/* =================================================
                  THUMBNAILS
              ================================================== */}

              {galleryList.length > 1 && (
                <div
                  className="
                    flex
                    gap-2
                    overflow-x-auto
                    pb-1
                    scrollbar-thin
                  "
                >
                  {galleryList.map((img, index) => (
                    <button
                      type="button"
                      key={`${img.url}-${index}`}
                      onClick={() =>
                        setSelectedImage(img.url)
                      }
                      className={`
                        relative
                        h-14
                        w-14
                        shrink-0
                        overflow-hidden
                        rounded-xl
                        border
                        transition-all
                        duration-200
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#FF7A00]/40

                        ${
                          selectedImage === img.url
                            ? 'border-[#FF7A00] ring-2 ring-[#FF7A00]/40'
                            : 'border-orange-100 opacity-70 hover:opacity-100'
                        }
                      `}
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        referrerPolicy="no-referrer"
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* =================================================
                  TRUST INFO
              ================================================== */}

              <div
                className="
                  rounded-xl
                  border
                  border-orange-200/70
                  bg-orange-50/60
                  p-3.5
                  text-xs
                  text-stone-600
                "
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-[#EA580C]" />

                    <span className="font-medium">
                      Pangan Olahan Berkualitas Nusantara
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-emerald-600" />

                    <span className="font-medium">
                      Diproduksi Bersih dengan Standar Higienis
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                RIGHT / PRODUCT INFORMATION
            =================================================== */}

            <div
              className="
                flex
                min-w-0
                flex-col

                md:col-span-7
              "
            >
              <div className="space-y-4">
                {/* =================================================
                    CATEGORY + SKU
                ================================================== */}

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-2
                    pr-10
                  "
                >
                  <span
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-widest
                      text-[#EA580C]
                    "
                  >
                    {product.CATEGORY_NAME}
                  </span>

                  <span
                    className="
                      rounded-lg
                      border
                      border-orange-200/80
                      bg-orange-50
                      px-2.5
                      py-0.5
                      font-mono
                      text-xs
                      text-stone-500
                    "
                  >
                    SKU: {product.SKU}
                  </span>
                </div>

                {/* =================================================
                    NAME
                ================================================== */}

                <h2
                  className="
                    pr-8
                    font-serif-luxury
                    text-xl
                    font-bold
                    leading-snug
                    text-stone-900

                    sm:text-2xl
                  "
                >
                  {product.NAME}
                </h2>

                {/* =================================================
                    PRICE
                ================================================== */}

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                    border-b
                    border-orange-100
                    pb-3
                  "
                >
                  <span
                    className="
                      text-2xl
                      font-extrabold
                      tracking-tight
                      text-stone-900
                    "
                  >
                    Rp {effectivePrice.toLocaleString('id-ID')}
                  </span>

                  {hasDiscount && (
                    <span
                      className="
                        text-sm
                        text-stone-400
                        line-through
                      "
                    >
                      Rp {product.PRICE.toLocaleString('id-ID')}
                    </span>
                  )}

                  <span
                    className="
                      rounded-lg
                      border
                      border-orange-200
                      bg-orange-50
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      text-stone-700

                      sm:ml-auto
                    "
                  >
                    Netto: {product.WEIGHT || '100g'}
                  </span>
                </div>

                {/* =================================================
                    STOCK
                ================================================== */}

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {isOutOfStock ? (
                    <span
                      className="
                        flex
                        items-center
                        gap-1.5
                        rounded-lg
                        border
                        border-red-300
                        bg-red-100
                        px-3
                        py-1
                        font-bold
                        text-red-700
                      "
                    >
                      <Ban className="h-3.5 w-3.5 text-red-600" />

                      STOK HABIS
                    </span>
                  ) : isLowStock ? (
                    <span
                      className="
                        flex
                        items-center
                        gap-1.5
                        rounded-lg
                        border
                        border-amber-300
                        bg-amber-100
                        px-3
                        py-1
                        font-bold
                        text-amber-800
                      "
                    >
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />

                      Stok Terbatas: Sisa {product.STOCK} unit
                    </span>
                  ) : (
                    <span
                      className="
                        flex
                        items-center
                        gap-1.5
                        rounded-lg
                        border
                        border-emerald-300
                        bg-emerald-100
                        px-3
                        py-1
                        font-bold
                        text-emerald-800
                      "
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />

                      Stok Tersedia: {product.STOCK} unit siap kirim
                    </span>
                  )}
                </div>

                {/* =================================================
                    DESCRIPTION
                ================================================== */}

                <div className="space-y-1">
                  <h4
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-stone-400
                    "
                  >
                    Deskripsi
                  </h4>

                  <p
                    className="
                      text-xs
                      font-normal
                      leading-relaxed
                      text-stone-600

                      sm:text-sm
                    "
                  >
                    {product.DESCRIPTION ||
                      'Deskripsi produk resmi Bonles Food Nusantara.'}
                  </p>
                </div>

                {/* =================================================
                    COMPOSITION + NUTRITION
                ================================================== */}

                {(product.COMPOSITION ||
                  product.NUTRITION) && (
                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-3

                      sm:grid-cols-2
                    "
                  >
                    {product.COMPOSITION && (
                      <div
                        className="
                          rounded-xl
                          border
                          border-orange-100
                          bg-orange-50/50
                          p-3
                        "
                      >
                        <h5
                          className="
                            mb-1
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-[#EA580C]
                          "
                        >
                          Komposisi
                        </h5>

                        <p
                          className="
                            text-[11px]
                            leading-snug
                            text-stone-600
                          "
                        >
                          {product.COMPOSITION}
                        </p>
                      </div>
                    )}

                    {product.NUTRITION && (
                      <div
                        className="
                          rounded-xl
                          border
                          border-orange-100
                          bg-orange-50/50
                          p-3
                        "
                      >
                        <h5
                          className="
                            mb-1
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-[#EA580C]
                          "
                        >
                          Informasi Gizi
                        </h5>

                        <p
                          className="
                            text-[11px]
                            leading-snug
                            text-stone-600
                          "
                        >
                          {product.NUTRITION}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ==================================================
                  CART ACTION
              =================================================== */}

              <div
                className="
                  mt-5
                  border-t
                  border-orange-100
                  pt-4
                "
              >
                {!isOutOfStock && (
                  <div
                    className="
                      mb-3
                      flex
                      flex-wrap
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <span
                      className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        text-stone-600
                      "
                    >
                      Jumlah Pesanan:
                    </span>

                    <div
                      className="
                        flex
                        items-center
                        rounded-xl
                        border
                        border-orange-200
                        bg-white
                        shadow-sm
                      "
                    >
                      <button
                        type="button"
                        onClick={handleDecrease}
                        disabled={quantity <= 1}
                        className="
                          px-3.5
                          py-1.5
                          font-bold
                          text-stone-700
                          transition-colors
                          hover:text-[#EA580C]
                          disabled:cursor-not-allowed
                          disabled:opacity-30
                        "
                        aria-label="Kurangi jumlah"
                      >
                        -
                      </button>

                      <span
                        className="
                          min-w-10
                          px-4
                          py-1
                          text-center
                          font-mono
                          text-sm
                          font-bold
                          text-stone-900
                        "
                      >
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={handleIncrease}
                        disabled={
                          quantity >= product.STOCK
                        }
                        className="
                          px-3.5
                          py-1.5
                          font-bold
                          text-stone-700
                          transition-colors
                          hover:text-[#EA580C]
                          disabled:cursor-not-allowed
                          disabled:opacity-30
                        "
                        aria-label="Tambah jumlah"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className={`
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    py-3.5
                    text-xs
                    font-bold
                    uppercase
                    tracking-widest
                    transition-all
                    duration-200

                    ${
                      isOutOfStock
                        ? `
                          cursor-not-allowed
                          border
                          border-stone-300
                          bg-stone-200
                          text-stone-400
                        `
                        : `
                          cursor-pointer
                          bg-gradient-to-r
                          from-[#FF5E0E]
                          via-[#FF7A00]
                          to-[#FFAA00]
                          text-white
                          shadow-lg
                          shadow-orange-500/25
                          hover:from-[#EA580C]
                          hover:to-[#FF9500]
                          active:scale-[0.99]
                        `
                    }
                  `}
                >
                  <ShoppingBag className="h-4 w-4" />

                  <span>
                    {isOutOfStock
                      ? 'Stok Tidak Tersedia'
                      : `Tambah ke Keranjang • Rp ${(
                          effectivePrice * quantity
                        ).toLocaleString('id-ID')}`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
