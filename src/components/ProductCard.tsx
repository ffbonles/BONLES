import React from 'react';
import {
  ShoppingBag,
  Eye,
  Star,
  AlertTriangle,
  CheckCircle2,
  Ban,
} from 'lucide-react';
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
  const isLowStock =
    product.STOCK > 0 && product.STOCK <= 5;

  const hasDiscount =
    product.DISCOUNT_PRICE > 0 &&
    product.DISCOUNT_PRICE < product.PRICE;

  const effectivePrice = hasDiscount
    ? product.DISCOUNT_PRICE
    : product.PRICE;

  const fallbackImage =
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

  return (
    <article
      id={`product-card-${product.SKU}`}
      className="
        group
        bonles-card
        overflow-hidden
        flex
        flex-col
        bg-[#FCFAF5]
      "
    >
      {/* =====================================================
          IMAGE
          ===================================================== */}
      <div
        className="
          relative
          aspect-[4/4.3]
          w-full
          overflow-hidden
          bg-[#F3EDE0]
        "
      >
        <img
          src={
            product.MAIN_IMAGE_URL ||
            fallbackImage
          }
          alt={product.NAME}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              fallbackImage;
          }}
          className="
            bonles-image
            object-center
            transition-transform
            duration-700
            ease-out
            group-hover:scale-[1.035]
          "
        />

        {/* Soft premium image overlay */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-[#09271F]/25
            via-transparent
            to-transparent
            opacity-50
          "
        />

        {/* =================================================
            FEATURE BADGES
            ================================================= */}
        <div
          className="
            absolute
            left-3
            top-3
            z-10
            flex
            flex-col
            gap-1.5
          "
        >
          {product.FEATURED && (
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                border
                border-[#C9A45C]/50
                bg-[#FCFAF5]/95
                px-2.5
                py-1
                text-[9px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-[#123C32]
                backdrop-blur-sm
              "
            >
              <Star
                className="h-3 w-3 fill-[#C9A45C] text-[#C9A45C]"
              />

              Unggulan
            </span>
          )}

          {hasDiscount && (
            <span
              className="
                inline-flex
                items-center
                border
                border-[#B83B32]/20
                bg-[#B83B32]/95
                px-2.5
                py-1
                text-[9px]
                font-bold
                uppercase
                tracking-[0.1em]
                text-white
              "
            >
              Hemat Rp{' '}
              {(
                product.PRICE -
                product.DISCOUNT_PRICE
              ).toLocaleString('id-ID')}
            </span>
          )}
        </div>

        {/* =================================================
            STOCK STATUS
            ================================================= */}
        <div
          className="
            absolute
            right-3
            top-3
            z-10
          "
        >
          {isOutOfStock ? (
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                border
                border-white/20
                bg-[#09271F]/90
                px-2.5
                py-1
                text-[9px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-white
                backdrop-blur-sm
              "
            >
              <Ban className="h-3 w-3" />
              Habis
            </span>
          ) : isLowStock ? (
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                border
                border-[#C9A45C]/50
                bg-[#FCFAF5]/95
                px-2.5
                py-1
                text-[9px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-[#9E793A]
              "
            >
              <AlertTriangle className="h-3 w-3" />

              Sisa {product.STOCK}
            </span>
          ) : (
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                border
                border-[#3E7657]/20
                bg-[#FCFAF5]/95
                px-2.5
                py-1
                text-[9px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-[#3E7657]
              "
            >
              <CheckCircle2 className="h-3 w-3" />

              Tersedia
            </span>
          )}
        </div>

        {/* =================================================
            DESKTOP QUICK VIEW
            ================================================= */}
        <button
          onClick={() => onViewDetail(product)}
          className="
            absolute
            inset-0
            hidden
            cursor-pointer
            items-center
            justify-center
            bg-[#09271F]/25
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
            md:flex
          "
          aria-label={`Lihat detail ${product.NAME}`}
        >
          <span
            className="
              inline-flex
              items-center
              gap-2
              border
              border-[#FCFAF5]/60
              bg-[#FCFAF5]/95
              px-4
              py-2.5
              text-[10px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-[#09271F]
              shadow-lg
              transition-transform
              duration-300
              group-hover:translate-y-0
              translate-y-2
            "
          >
            <Eye className="h-3.5 w-3.5 text-[#B18B4B]" />

            Lihat Detail
          </span>
        </button>
      </div>

      {/* =====================================================
          CONTENT
          ===================================================== */}
      <div
        className="
          flex
          flex-1
          flex-col
          justify-between
          gap-5
          p-4
          sm:p-5
        "
      >
        <div>
          {/* Category */}
          <div
            className="
              mb-2
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <span
              className="
                truncate
                text-[9px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-[#B18B4B]
              "
            >
              {product.CATEGORY_NAME}
            </span>

            <span
              className="
                shrink-0
                font-mono
                text-[9px]
                tracking-wide
                text-[#9BA29D]
              "
            >
              {product.SKU}
            </span>
          </div>

          {/* Product name */}
          <h3
            onClick={() => onViewDetail(product)}
            title={product.NAME}
            className="
              cursor-pointer
              font-display
              text-[19px]
              font-medium
              leading-[1.15]
              tracking-[-0.02em]
              text-[#09271F]
              transition-colors
              duration-300
              group-hover:text-[#185043]
              line-clamp-2
            "
          >
            {product.NAME}
          </h3>

          {/* Weight */}
          <div
            className="
              mt-2.5
              flex
              items-center
              gap-2
              text-[11px]
              text-[#7C8580]
            "
          >
            <span>Net weight</span>

            <span
              className="
                h-1
                w-1
                rounded-full
                bg-[#C9A45C]
              "
            />

            <span className="font-semibold text-[#4B554F]">
              {product.WEIGHT || '100g'}
            </span>
          </div>
        </div>

        {/* =================================================
            PRICE + ACTION
            ================================================= */}
        <div>
          <div
            className="
              mb-4
              border-t
              border-[#123C32]/10
              pt-4
            "
          >
            <div className="flex items-baseline gap-2">
              <span
                className="
                  font-sans
                  text-[18px]
                  font-bold
                  tracking-[-0.02em]
                  text-[#123C32]
                "
              >
                Rp{' '}
                {effectivePrice.toLocaleString(
                  'id-ID'
                )}
              </span>

              {hasDiscount && (
                <span
                  className="
                    text-[10px]
                    font-medium
                    text-[#9BA29D]
                    line-through
                  "
                >
                  Rp{' '}
                  {product.PRICE.toLocaleString(
                    'id-ID'
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewDetail(product)}
              className="
                bonles-btn
                bonles-btn-outline
                min-h-[44px]
                w-full
                px-3
                text-[10px]
              "
              aria-label={`Detail ${product.NAME}`}
            >
              <Eye className="h-3.5 w-3.5" />

              Detail
            </button>

            <button
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              className={`
                bonles-btn
                min-h-[44px]
                w-full
                px-3
                text-[10px]
                ${
                  isOutOfStock
                    ? 'cursor-not-allowed border border-[#D8D8D2] bg-[#E9E6DE] text-[#9BA29D]'
                    : 'bonles-btn-primary'
                }
              `}
              aria-label={`Tambah ${product.NAME} ke Keranjang`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />

              {isOutOfStock
                ? 'Habis'
                : 'Tambah'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
