import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onClearCart: () => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onClearCart,
  onProceedCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => {
    const p = item.product;
    const price = p.DISCOUNT_PRICE > 0 && p.DISCOUNT_PRICE < p.PRICE ? p.DISCOUNT_PRICE : p.PRICE;
    return sum + price * item.quantity;
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-orange-200 flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-orange-100 flex items-center justify-between bg-gradient-to-r from-orange-50/80 to-amber-50/60">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#FF7A00]" />
              <h2 className="text-lg font-serif-luxury text-stone-900 font-bold">Keranjang Belanja</h2>
              <span className="text-xs bg-orange-100 text-[#EA580C] font-bold px-2.5 py-0.5 rounded-full border border-orange-200">
                {totalItems} item
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg border border-orange-200/70 hover:bg-orange-50 transition-colors"
              aria-label="Tutup Keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF7A00]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Keranjang Anda Masih Kosong</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Pilih aneka snack tinggi protein dan oleh-oleh nusantara favorit Anda dari katalog.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-2 bg-gradient-to-r from-[#FF5E0E] via-[#FF7A00] to-[#FFAA00] hover:from-[#EA580C] hover:to-[#FF9500] text-white px-6 py-2.5 rounded-xl text-xs tracking-wider uppercase font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-orange-100 text-xs text-stone-500">
                  <span className="font-medium">Daftar Produk</span>
                  <button
                    onClick={onClearCart}
                    className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 text-[11px] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    Kosongkan Keranjang
                  </button>
                </div>

                <div className="space-y-3">
                  {cartItems.map(({ product, quantity }) => {
                    const price =
                      product.DISCOUNT_PRICE > 0 && product.DISCOUNT_PRICE < product.PRICE
                        ? product.DISCOUNT_PRICE
                        : product.PRICE;
                    const lineTotal = price * quantity;
                    const isExceedStock = quantity > product.STOCK;

                    return (
                      <div
                        key={product.ID}
                        className="bg-orange-50/40 border border-orange-100 rounded-xl p-3 flex gap-3 items-center justify-between hover:border-orange-200 transition-colors"
                      >
                        <img
                          src={
                            product.MAIN_IMAGE_URL ||
                            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'
                          }
                          alt={product.NAME}
                          className="w-14 h-14 object-cover rounded-lg border border-orange-100 shrink-0"
                        />

                        <div className="flex-1 min-w-0 pr-2">
                          <h4 className="text-xs font-bold text-stone-900 truncate" title={product.NAME}>
                            {product.NAME}
                          </h4>
                          <p className="text-[11px] text-stone-500 font-mono">
                            Rp {price.toLocaleString('id-ID')} x {quantity}
                          </p>
                          <p className="text-xs font-extrabold text-[#EA580C]">
                            Rp {lineTotal.toLocaleString('id-ID')}
                          </p>

                          {isExceedStock && (
                            <div className="flex items-center gap-1 text-[10px] text-red-600 font-semibold mt-1">
                              <AlertCircle className="w-3 h-3" />
                              <span>Stok hanya tersisa {product.STOCK}</span>
                            </div>
                          )}
                        </div>

                        {/* Quantity controls */}
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center border border-orange-200 rounded-lg bg-white shadow-2xs">
                            <button
                              onClick={() => onUpdateQuantity(product.ID, quantity - 1)}
                              className="px-2 py-1 text-xs text-stone-700 hover:text-[#EA580C] transition-colors"
                              aria-label="Kurangi"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 py-0.5 text-xs font-bold text-stone-900 font-mono min-w-6 text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(product.ID, quantity + 1)}
                              disabled={quantity >= product.STOCK}
                              className="px-2 py-1 text-xs text-stone-700 hover:text-[#EA580C] disabled:opacity-30 transition-colors"
                              aria-label="Tambah"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onUpdateQuantity(product.ID, 0)}
                            className="text-[11px] text-stone-400 hover:text-red-600 font-medium transition-colors cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Footer Summary & Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-orange-100 bg-gradient-to-b from-orange-50/60 to-amber-50/60 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal Produk</span>
                  <span className="text-stone-900 font-bold font-mono">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Estimasi Pengiriman</span>
                  <span className="text-stone-700 font-medium">Dihitung saat checkout</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-orange-200/80">
                  <span>Total Belanja</span>
                  <span className="text-[#EA580C] font-extrabold font-mono text-base">
                    Rp {subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button
                onClick={onProceedCheckout}
                className="w-full bg-gradient-to-r from-[#FF5E0E] via-[#FF7A00] to-[#FFAA00] hover:from-[#EA580C] hover:to-[#FF9500] text-white font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-98"
              >
                <span>Lanjut ke Form Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
