import React, { useState, useEffect } from 'react';
import { 
  Sparkles,
  Filter,
  ArrowUpDown,
  ShoppingBag, 
  CheckCircle2,
  ChevronRight,
  Search,
  ArrowUp,
  Flame,
  RotateCcw
} from 'lucide-react';

import {
  Product,
  Category,
  CartItem,
  Order,
  Banner,
  Testimonial
} from './types';

import {
  store,
  clearOldCookiesAndLegacyCache
} from './services/store';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AboutSection } from './components/AboutSection';
import { OurStory } from './components/OurStory';
import { TestimonialsSection } from './components/TestimonialsSection';
import { RecentlyViewedSection } from './components/RecentlyViewedSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { MobileNavBar } from './components/MobileNavBar';
import { authService } from './services/auth';

export default function App() {
  // ==========================================================
  // APP STATE
  // ==========================================================

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // ==========================================================
  // FILTERING & SORTING
  // ==========================================================

  const [selectedCategory, setSelectedCategory] =
    useState<string>('ALL');

  const [searchQuery, setSearchQuery] =
    useState<string>('');

  const [sortBy, setSortBy] =
    useState<
      'featured' |
      'price-low' |
      'price-high' |
      'newest'
    >('featured');

  const [stockFilter, setStockFilter] =
    useState<'all' | 'in-stock'>('all');

  // ==========================================================
  // UI / NAVIGATION STATE
  // ==========================================================

  const [isMenuOpen, setIsMenuOpen] =
    useState<boolean>(false);

  const [showBackToTop, setShowBackToTop] =
    useState<boolean>(false);

  const [isAdminView, setIsAdminView] =
    useState<boolean>(false);

  const [isSuperAdminAuthenticated, setIsSuperAdminAuthenticated] =
    useState<boolean>(() => authService.isAuthenticated());

  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] =
    useState<boolean>(false);

  const [isCartOpen, setIsCartOpen] =
    useState<boolean>(false);

  const [isCheckoutOpen, setIsCheckoutOpen] =
    useState<boolean>(false);

  const [activeDetailProduct, setActiveDetailProduct] =
    useState<Product | null>(null);

  const [completedOrder, setCompletedOrder] =
    useState<Order | null>(null);

  // ==========================================================
  // TOAST
  // ==========================================================

  const [toastMsg, setToastMsg] =
    useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);

    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  // ==========================================================
  // ADMIN
  // ==========================================================

  const handleToggleAdmin = () => {
    if (isAdminView) {
      setIsAdminView(false);
    } else {
      if (authService.isAuthenticated()) {
        setIsAdminView(true);
      } else {
        setIsAdminLoginModalOpen(true);
      }
    }
  };

  const handleSuperAdminLoginSuccess = () => {
    setIsSuperAdminAuthenticated(true);
    setIsAdminView(true);

    showToast(
      'Autentifikasi berhasil: Hak akses Admin aktif.'
    );
  };

  const handleLogoutSuperAdmin = () => {
    authService.logout();

    setIsSuperAdminAuthenticated(false);
    setIsAdminView(false);

    showToast(
      'Sesi Admin telah berhasil di-logout.'
    );
  };

  // ==========================================================
  // LIVE SYNC
  // ==========================================================

  const [isLiveSyncing, setIsLiveSyncing] =
    useState<boolean>(false);

  const loadData = () => {
    setProducts(
      store.getProducts(true, false)
    );

    setCategories(
      store
        .getCategories()
        .filter(c => c.ACTIVE)
    );

    setBanners(
      store
        .getBanners()
        .filter(b => b.ACTIVE)
    );

    setTestimonials(
      store
        .getTestimonials()
        .filter(t => t.ACTIVE)
    );

    setCartItems(
      store.getCart()
    );

    setRecentlyViewed(
      store.getRecentlyViewed(4)
    );
  };

  const handleManualSyncLive = async () => {
    setIsLiveSyncing(true);

    try {
      const res =
        await store.pullFromCloudSpreadsheet(
          'MANUAL_USER_REFRESH'
        );

      if (res.success) {
        showToast(res.message);
      } else {
        showToast(
          `Sinkronisasi: ${res.message}`
        );
      }
    } catch {
      showToast(
        'Gagal menarik data terbaru dari Google Spreadsheet.'
      );
    } finally {
      setIsLiveSyncing(false);
      loadData();
    }
  };

  // ==========================================================
  // INITIALIZATION
  // ==========================================================

  useEffect(() => {
    clearOldCookiesAndLegacyCache();

    loadData();

    const unsubscribe =
      store.subscribe(() => {
        loadData();
      });

    const handleKeyDown =
      (e: KeyboardEvent) => {
        if (
          (e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          (e.key === 'A' || e.key === 'a')
        ) {
          e.preventDefault();
          handleToggleAdmin();
        }
      };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    const handleScroll = () => {
      setShowBackToTop(
        window.scrollY > 350
      );
    };

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true }
    );

    return () => {
      unsubscribe();

      window.removeEventListener(
        'keydown',
        handleKeyDown
      );

      window.removeEventListener(
        'scroll',
        handleScroll
      );
    };
  }, []);

  // ==========================================================
  // PRODUCT DETAIL
  // ==========================================================

  const handleViewProduct =
    (product: Product) => {
      setActiveDetailProduct(product);

      const updated =
        store.addRecentlyViewed(
          product.ID,
          4
        );

      setRecentlyViewed([
        ...updated
      ]);
    };

  // ==========================================================
  // CART OPERATIONS
  // ==========================================================

  const handleAddToCart =
    (
      product: Product,
      quantity = 1
    ) => {
      try {
        const updatedCart =
          store.addToCart(
            product,
            quantity
          );

        setCartItems([
          ...updatedCart
        ]);

        const updatedRecentlyViewed =
          store.addRecentlyViewed(
            product.ID,
            4
          );

        setRecentlyViewed([
          ...updatedRecentlyViewed
        ]);

        showToast(
          `${quantity}x ${product.NAME} ditambahkan ke keranjang.`
        );
      } catch (err: any) {
        alert(
          err.message ||
          'Gagal menambahkan ke keranjang'
        );
      }
    };

  const handleClearRecentlyViewed =
    () => {
      store.clearRecentlyViewed();

      setRecentlyViewed([]);

      showToast(
        'Riwayat produk terakhir dilihat telah dikosongkan.'
      );
    };

  const handleUpdateCartQty =
    (
      productId: string,
      quantity: number
    ) => {
      try {
        const updatedCart =
          store.updateCartQuantity(
            productId,
            quantity
          );

        setCartItems([
          ...updatedCart
        ]);
      } catch (err: any) {
        alert(
          err.message ||
          'Gagal memperbarui kuantitas'
        );
      }
    };

  const handleClearCart =
    () => {
      store.clearCart();

      setCartItems([]);

      showToast(
        'Keranjang belanja dikosongkan.'
      );
    };

  const handleOrderCompleted =
    (order: Order) => {
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      setCartItems([]);

      loadData();

      setCompletedOrder(order);
    };

  // ==========================================================
  // FILTER & SEARCH
  // ==========================================================

  const filteredProducts =
    products.filter(p => {
      const matchCategory =
        selectedCategory === 'ALL' ||
        p.CATEGORY_ID === selectedCategory ||
        p.CATEGORY_NAME === selectedCategory;

      const q =
        searchQuery
          .toLowerCase()
          .trim();

      const matchSearch =
        !q ||
        p.NAME.toLowerCase().includes(q) ||
        p.SKU.toLowerCase().includes(q) ||
        p.CATEGORY_NAME
          .toLowerCase()
          .includes(q) ||
        p.DESCRIPTION
          .toLowerCase()
          .includes(q);

      const matchStock =
        stockFilter === 'all' ||
        p.STOCK > 0;

      return (
        matchCategory &&
        matchSearch &&
        matchStock
      );
    });

  // ==========================================================
  // SORT
  // ==========================================================

  const sortedProducts =
    [...filteredProducts].sort(
      (a, b) => {
        const priceA =
          a.DISCOUNT_PRICE > 0 &&
          a.DISCOUNT_PRICE < a.PRICE
            ? a.DISCOUNT_PRICE
            : a.PRICE;

        const priceB =
          b.DISCOUNT_PRICE > 0 &&
          b.DISCOUNT_PRICE < b.PRICE
            ? b.DISCOUNT_PRICE
            : b.PRICE;

        if (sortBy === 'price-low') {
          return priceA - priceB;
        }

        if (sortBy === 'price-high') {
          return priceB - priceA;
        }

        if (sortBy === 'newest') {
          return (
            new Date(b.CREATED_AT).getTime() -
            new Date(a.CREATED_AT).getTime()
          );
        }

        return (
          (b.FEATURED ? 1 : 0) -
          (a.FEATURED ? 1 : 0)
        );
      }
    );

  const featuredProducts =
    products.filter(
      p => p.FEATURED
    );

  const totalCartCount =
    cartItems.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

  // ==========================================================
  // ADMIN VIEW
  // ==========================================================

  if (isAdminView) {
    return (
      <AdminDashboard
        onCloseAdmin={() => {
          setIsAdminView(false);
          loadData();
        }}
        onRefreshData={loadData}
        onLogout={handleLogoutSuperAdmin}
      />
    );
  }

  // ==========================================================
  // LANDING PAGE
  // ==========================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#FFF8F2]
        text-[#3F2925]
        flex
        flex-col
        pb-20
        md:pb-0
        selection:bg-[#B91C1C]
        selection:text-white
      "
    >

      {/* ======================================================
          GLOBAL TOAST
          ====================================================== */}

      {toastMsg && (
        <div
          className="
            fixed
            bottom-20
            md:bottom-6
            right-4
            md:right-6
            z-50
            bg-[#6E1017]
            border
            border-[#F59E0B]/60
            text-white
            px-4
            py-3
            rounded-xl
            shadow-[0_12px_40px_rgba(110,16,23,0.28)]
            flex
            items-center
            gap-2.5
            animate-slide-up
            text-xs
            font-medium
          "
        >
          <CheckCircle2
            className="
              w-4
              h-4
              text-[#FDE047]
              shrink-0
            "
          />

          <span>
            {toastMsg}
          </span>
        </div>
      )}

      {/* ======================================================
          HEADER
          ====================================================== */}

      <Header
        cartCount={totalCartCount}
        onOpenCart={() =>
          setIsCartOpen(true)
        }
        isAdmin={isAdminView}
        isAuthenticated={
          isSuperAdminAuthenticated
        }
        onToggleAdmin={
          handleToggleAdmin
        }
        searchQuery={searchQuery}
        onSearchChange={
          setSearchQuery
        }
        onNavigateHome={() => {
          setSelectedCategory('ALL');
          setSearchQuery('');
          setIsMenuOpen(false);

          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }}
        isMenuOpen={isMenuOpen}
        onToggleMenu={() =>
          setIsMenuOpen(
            !isMenuOpen
          )
        }
        categories={categories}
        onSelectCategory={
          (catId) => {
            setSelectedCategory(
              catId
            );

            setIsMenuOpen(false);
          }
        }
      />

      {/* ======================================================
          HERO
          ====================================================== */}

      <Hero
        banner={banners[0]}
        onExploreCatalog={() => {
          setIsMenuOpen(false);

          const el =
            document.getElementById(
              'catalog'
            );

          if (el) {
            el.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }}
        onFeaturedClick={() => {
          setIsMenuOpen(false);

          setSelectedCategory('ALL');
          setSortBy('featured');

          const el =
            document.getElementById(
              'catalog'
            );

          if (el) {
            el.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }}
      />

      {/* ======================================================
          OUR STORY
          ====================================================== */}

      <OurStory
        onExploreCatalog={() => {
          setIsMenuOpen(false);

          const el =
            document.getElementById(
              'catalog'
            );

          if (el) {
            el.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }}
      />

      {/* ======================================================
          FEATURED PRODUCTS
          ====================================================== */}

      {!searchQuery &&
        featuredProducts.length > 0 && (
          <section
            className="
              py-10
              sm:py-14
              bg-[#FFF1E6]
              border-b
              border-[#E85D04]/15
              relative
              overflow-hidden
            "
          >
            {/* Decorative glow */}
            <div
              className="
                absolute
                -top-32
                -right-32
                w-72
                h-72
                rounded-full
                bg-[#F59E0B]/10
                blur-3xl
                pointer-events-none
              "
            />

            <div
              className="
                max-w-7xl
                mx-auto
                px-3
                sm:px-6
                lg:px-8
                relative
                z-10
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-5
                  sm:mb-8
                "
              >
                <div>
                  <span
                    className="
                      text-[10px]
                      tracking-[0.2em]
                      text-[#C2410C]
                      font-bold
                      uppercase
                      block
                    "
                  >
                    Pilihan Rekomendasi
                  </span>

                  <h2
                    className="
                      text-xl
                      sm:text-2xl
                      font-serif-luxury
                      text-[#541B16]
                      font-medium
                    "
                  >
                    Produk Unggulan Bonles
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSortBy('featured');

                    const el =
                      document.getElementById(
                        'catalog'
                      );

                    if (el) {
                      el.scrollIntoView({
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className="
                    text-xs
                    text-[#C2410C]
                    hover:text-[#991B1B]
                    flex
                    items-center
                    gap-1
                    transition-colors
                    font-semibold
                    p-1.5
                  "
                  aria-label="Lihat Semua Rekomendasi"
                >
                  <span>
                    Lihat Semua
                  </span>

                  <ChevronRight
                    className="w-4 h-4"
                  />
                </button>
              </div>

              <div
                className="
                  grid
                  grid-cols-2
                  sm:grid-cols-2
                  lg:grid-cols-3
                  gap-3
                  sm:gap-6
                "
              >
                {featuredProducts
                  .slice(0, 3)
                  .map(product => (
                    <ProductCard
                      key={product.ID}
                      product={product}
                      onViewDetail={
                        handleViewProduct
                      }
                      onAddToCart={
                        handleAddToCart
                      }
                    />
                  ))}
              </div>
            </div>
          </section>
        )}

      {/* ======================================================
          MAIN CATALOG
          ====================================================== */}

      <main
        id="catalog"
        className="
          flex-1
          bg-[#FFF8F2]
          max-w-7xl
          w-full
          mx-auto
          px-3
          sm:px-6
          lg:px-8
          py-10
          sm:py-16
          space-y-6
          sm:space-y-8
        "
      >
        {/* Catalog Header */}
        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-end
            justify-between
            gap-4
            sm:gap-6
            border-b
            border-[#D97706]/20
            pb-5
          "
        >
          <div>
            <span
              className="
                text-xs
                tracking-[0.2em]
                text-[#C2410C]
                font-bold
                uppercase
                block
              "
            >
              Digital Catalog
            </span>

            <h2
              className="
                text-2xl
                sm:text-3xl
                font-serif-luxury
                text-[#541B16]
                font-medium
              "
            >
              Katalog Produk Resmi
            </h2>

            <p
              className="
                text-xs
                text-[#876E65]
                mt-1
              "
            >
              Menampilkan {sortedProducts.length} produk
              siap pesan langsung via WhatsApp.
            </p>
          </div>

          {/* Controls */}
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
              sm:gap-3
            "
          >
            {/* Sort */}
            <div
              className="
                flex
                items-center
                gap-2
                bg-white
                border
                border-[#E8CFC2]
                rounded-xl
                px-3
                py-2
                text-xs
                text-[#6F5148]
                shadow-sm
              "
            >
              <ArrowUpDown
                className="
                  w-3.5
                  h-3.5
                  text-[#E85D04]
                  shrink-0
                "
              />

              <select
                value={sortBy}
                onChange={e =>
                  setSortBy(
                    e.target.value as any
                  )
                }
                className="
                  bg-transparent
                  text-[#541B16]
                  focus:outline-none
                  cursor-pointer
                  text-xs
                "
                aria-label="Urutkan Produk"
              >
                <option value="featured">
                  Produk Unggulan
                </option>

                <option value="price-low">
                  Harga Terendah
                </option>

                <option value="price-high">
                  Harga Tertinggi
                </option>

                <option value="newest">
                  Produk Terbaru
                </option>
              </select>
            </div>

            {/* Stock Filter */}
            <button
              onClick={() =>
                setStockFilter(
                  stockFilter === 'all'
                    ? 'in-stock'
                    : 'all'
                )
              }
              className={`
                flex
                items-center
                gap-1.5
                px-3.5
                py-2
                rounded-xl
                text-xs
                font-medium
                border
                transition-all
                cursor-pointer
                shadow-sm

                ${
                  stockFilter === 'in-stock'
                    ? `
                      bg-[#FFF1E6]
                      text-[#C2410C]
                      border-[#E85D04]/50
                    `
                    : `
                      bg-white
                      text-[#876E65]
                      border-[#E8CFC2]
                      hover:text-[#991B1B]
                      hover:border-[#E85D04]/40
                    `
                }
              `}
              aria-label="Filter Stok"
            >
              <CheckCircle2
                className={`
                  w-3.5
                  h-3.5
                  ${
                    stockFilter === 'in-stock'
                      ? 'text-[#E85D04]'
                      : 'text-[#A98C82]'
                  }
                `}
              />

              <span>
                {stockFilter === 'in-stock'
                  ? 'Ready Stock'
                  : 'Semua Stok'}
              </span>
            </button>
          </div>
        </div>

        {/* ====================================================
            CATEGORY FILTER
            ==================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
            overflow-x-auto
            pb-2
            scrollbar-none
            -mx-1
            px-1
          "
        >
          {/* ALL */}
          <button
            onClick={() =>
              setSelectedCategory('ALL')
            }
            className={`
              flex
              items-center
              gap-1.5
              px-3.5
              sm:px-4
              py-2
              rounded-xl
              text-xs
              tracking-wider
              uppercase
              font-semibold
              shrink-0
              transition-all
              cursor-pointer

              ${
                selectedCategory === 'ALL'
                  ? `
                    bg-gradient-to-r
                    from-[#B91C1C]
                    via-[#DC2626]
                    to-[#F97316]
                    text-white
                    shadow-md
                    shadow-[#B91C1C]/25
                  `
                  : `
                    bg-white
                    text-[#876E65]
                    border
                    border-[#E8CFC2]
                    hover:text-[#991B1B]
                    hover:border-[#E85D04]/50
                  `
              }
            `}
          >
            <Sparkles
              className={`
                w-3.5
                h-3.5
                ${
                  selectedCategory === 'ALL'
                    ? 'text-[#FDE047]'
                    : 'text-[#E85D04]'
                }
              `}
            />

            <span>
              Semua ({products.length})
            </span>
          </button>

          {categories.map(cat => {
            const count =
              products.filter(
                p =>
                  p.CATEGORY_ID === cat.ID ||
                  p.CATEGORY_NAME === cat.NAME
              ).length;

            const isSelected =
              selectedCategory === cat.ID;

            return (
              <button
                key={cat.ID}
                onClick={() =>
                  setSelectedCategory(
                    cat.ID
                  )
                }
                className={`
                  flex
                  items-center
                  gap-1.5
                  px-3.5
                  sm:px-4
                  py-2
                  rounded-xl
                  text-xs
                  tracking-wider
                  uppercase
                  font-semibold
                  shrink-0
                  transition-all
                  cursor-pointer

                  ${
                    isSelected
                      ? `
                        bg-gradient-to-r
                        from-[#B91C1C]
                        via-[#DC2626]
                        to-[#F97316]
                        text-white
                        shadow-md
                        shadow-[#B91C1C]/25
                      `
                      : `
                        bg-white
                        text-[#876E65]
                        border
                        border-[#E8CFC2]
                        hover:text-[#991B1B]
                        hover:border-[#E85D04]/50
                      `
                  }
                `}
              >
                <Flame
                  className={`
                    w-3.5
                    h-3.5
                    ${
                      isSelected
                        ? 'text-[#FDE047]'
                        : 'text-[#E85D04]'
                    }
                  `}
                />

                <span>
                  {cat.NAME} ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* ====================================================
            ACTIVE FILTER SUMMARY
            ==================================================== */}

        {(searchQuery ||
          selectedCategory !== 'ALL' ||
          stockFilter !== 'all') && (
          <div
            className="
              bg-[#FFF1E6]
              border
              border-[#E85D04]/20
              p-3
              rounded-xl
              flex
              items-center
              justify-between
              text-xs
              text-[#876E65]
              shadow-sm
            "
          >
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <Filter
                className="
                  w-3.5
                  h-3.5
                  text-[#E85D04]
                  shrink-0
                "
              />

              <span>
                Filter:
              </span>

              {searchQuery && (
                <span
                  className="
                    text-[#541B16]
                    font-medium
                    bg-white
                    px-2
                    py-0.5
                    rounded-md
                    border
                    border-[#E8CFC2]
                  "
                >
                  "{searchQuery}"
                </span>
              )}

              {selectedCategory !== 'ALL' && (
                <span
                  className="
                    text-[#C2410C]
                    font-semibold
                    bg-white
                    px-2
                    py-0.5
                    rounded-md
                    border
                    border-[#E8CFC2]
                  "
                >
                  {
                    categories.find(
                      c =>
                        c.ID ===
                        selectedCategory
                    )?.NAME
                  }
                </span>
              )}

              {stockFilter === 'in-stock' && (
                <span
                  className="
                    text-[#C2410C]
                    font-semibold
                    bg-white
                    px-2
                    py-0.5
                    rounded-md
                    border
                    border-[#E85D04]/30
                  "
                >
                  • Ready Stock
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
                setStockFilter('all');
              }}
              className="
                flex
                items-center
                gap-1
                text-xs
                text-[#C2410C]
                hover:text-[#991B1B]
                hover:underline
                shrink-0
                ml-2
              "
            >
              <RotateCcw
                className="w-3 h-3"
              />

              <span>
                Reset
              </span>
            </button>
          </div>
        )}

        {/* ====================================================
            PRODUCTS
            ==================================================== */}

        {sortedProducts.length === 0 ? (
          <div
            className="
              py-16
              text-center
              bg-white
              border
              border-[#E8CFC2]
              rounded-2xl
              p-6
              sm:p-8
              space-y-4
              max-w-lg
              mx-auto
              shadow-sm
            "
          >
            <div
              className="
                w-14
                h-14
                mx-auto
                rounded-full
                bg-[#FFF1E6]
                border
                border-[#E85D04]/20
                flex
                items-center
                justify-center
                text-[#A98C82]
              "
            >
              <Search
                className="
                  w-6
                  h-6
                  text-[#E85D04]
                "
              />
            </div>

            <div>
              <h3
                className="
                  text-base
                  sm:text-lg
                  font-serif-luxury
                  text-[#541B16]
                "
              >
                Produk Tidak Ditemukan
              </h3>

              <p
                className="
                  text-xs
                  text-[#876E65]
                  mt-1
                "
              >
                Coba kata kunci atau kategori
                yang berbeda, atau reset filter
                pencarian.
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
                setStockFilter('all');
              }}
              className="
                bg-gradient-to-r
                from-[#B91C1C]
                via-[#DC2626]
                to-[#F97316]
                text-white
                font-semibold
                px-5
                py-2.5
                rounded-xl
                text-xs
                tracking-wider
                uppercase
                transition-all
                cursor-pointer
                shadow-md
                shadow-[#B91C1C]/20
                hover:-translate-y-0.5
              "
            >
              Lihat Semua Produk
            </button>
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-2.5
              sm:gap-6
            "
          >
            {sortedProducts.map(
              product => (
                <ProductCard
                  key={product.ID}
                  product={product}
                  onViewDetail={
                    handleViewProduct
                  }
                  onAddToCart={
                    handleAddToCart
                  }
                />
              )
            )}
          </div>
        )}
      </main>

      {/* ======================================================
          ABOUT
          ====================================================== */}

      <AboutSection />

      {/* ======================================================
          TESTIMONIALS
          ====================================================== */}

      <TestimonialsSection
        testimonials={
          testimonials
        }
      />

      {/* ======================================================
          RECENTLY VIEWED
          ====================================================== */}

      <RecentlyViewedSection
        products={
          recentlyViewed
        }
        onViewDetail={
          handleViewProduct
        }
        onAddToCart={
          handleAddToCart
        }
        onClearHistory={
          handleClearRecentlyViewed
        }
      />

      {/* ======================================================
          FOOTER
          ====================================================== */}

      <Footer
        onOpenAdminLogin={() =>
          handleToggleAdmin()
        }
        isAuthenticated={
          isSuperAdminAuthenticated
        }
      />

      {/* ======================================================
          BACK TO TOP
          ====================================================== */}

      {showBackToTop && (
        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            })
          }
          className="
            fixed
            bottom-20
            md:bottom-8
            right-4
            z-30
            w-11
            h-11
            rounded-2xl
            bg-[#6E1017]/95
            backdrop-blur-md
            border
            border-[#F59E0B]/50
            text-[#FDE047]
            hover:text-white
            hover:bg-[#B91C1C]
            flex
            items-center
            justify-center
            shadow-xl
            transition-all
            active:scale-95
            cursor-pointer
          "
          aria-label="Kembali ke Bagian Atas Halaman"
          title="Kembali ke Atas"
        >
          <ArrowUp
            className="w-5 h-5"
          />
        </button>
      )}

      {/* ======================================================
          MOBILE NAVIGATION
          ====================================================== */}

      <MobileNavBar
        cartCount={
          totalCartCount
        }
        onOpenCart={() =>
          setIsCartOpen(true)
        }
        onNavigateHome={() => {
          setSelectedCategory('ALL');
          setSearchQuery('');
          setIsMenuOpen(false);

          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }}
        onNavigateCatalog={() => {
          setIsMenuOpen(false);

          const el =
            document.getElementById(
              'catalog'
            );

          if (el) {
            el.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }}
        isMenuOpen={
          isMenuOpen
        }
        onToggleMenu={() =>
          setIsMenuOpen(
            !isMenuOpen
          )
        }
        waNumber={
          store.getSettingsMap()[
            'WHATSAPP_NUMBER'
          ] ||
          '6285174333902'
        }
      />

      {/* ======================================================
          MODALS
          ====================================================== */}

      <ProductDetailModal
        product={
          activeDetailProduct
        }
        onClose={() =>
          setActiveDetailProduct(null)
        }
        onAddToCart={
          handleAddToCart
        }
      />

      <CartDrawer
        isOpen={
          isCartOpen
        }
        onClose={() =>
          setIsCartOpen(false)
        }
        cartItems={
          cartItems
        }
        onUpdateQuantity={
          handleUpdateCartQty
        }
        onClearCart={
          handleClearCart
        }
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={
          isCheckoutOpen
        }
        onClose={() =>
          setIsCheckoutOpen(false)
        }
        cartItems={
          cartItems
        }
        onOrderCompleted={
          handleOrderCompleted
        }
      />

      <OrderSuccessModal
        order={
          completedOrder
        }
        onClose={() =>
          setCompletedOrder(null)
        }
      />

      <AdminLoginModal
        isOpen={
          isAdminLoginModalOpen
        }
        onClose={() =>
          setIsAdminLoginModalOpen(false)
        }
        onLoginSuccess={
          handleSuperAdminLoginSuccess
        }
      />
    </div>
  );
}
