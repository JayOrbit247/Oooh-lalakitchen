import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Grid2x2, List } from 'lucide-react';
import { useCategories, useMenuItems } from '@/hooks/useData';
import FoodCard from '@/components/FoodCard';
import QuickViewModal from '@/components/QuickViewModal';
import type { MenuItem } from '@/types';

const sortOptions = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
] as const;

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useCategories();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'popularity' | 'price_low' | 'price_high' | 'rating'>('popularity');
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewItem, setQuickViewItem] = useState<MenuItem | null>(null);

  const categorySlug = searchParams.get('category') ?? '';
  const selectedCategory = useMemo(
    () => categories.find((c) => c.slug === categorySlug)?.id ?? '',
    [categories, categorySlug]
  );

  const { items, loading } = useMenuItems({
    categoryId: selectedCategory || undefined,
    search,
    sortBy,
    maxPrice,
  });

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearch(q);
  }, [searchParams]);

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) params.set('category', slug);
    else params.delete('category');
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-charcoal-50">
      {/* Page Header */}
      <div className="gradient-charcoal py-16 text-white">
        <div className="container-padding px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">Our Menu</h1>
          <p className="mt-3 text-white/70">
            Explore our full selection of premium meals, freshly prepared and delivered to your door.
          </p>
        </div>
      </div>

      <div className="container-padding px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Sort Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for meals..."
              className="w-full rounded-full border border-charcoal-200 bg-white py-3 pl-12 pr-4 text-sm text-charcoal-800 placeholder:text-charcoal-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-full border border-charcoal-200 bg-white px-4 py-3 text-sm font-medium text-charcoal-700 focus:border-primary-500 focus:outline-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-full border border-charcoal-200 bg-white px-4 py-3 text-sm font-medium text-charcoal-700 transition-colors hover:border-primary-500 hover:text-primary-600"
            >
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="card sticky top-24 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-lg font-semibold text-charcoal-900">Categories</h3>
                {showFilters && (
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-charcoal-400 hover:text-charcoal-600 lg:hidden"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => setCategory('')}
                  className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    !categorySlug
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-charcoal-600 hover:bg-charcoal-50'
                  }`}
                >
                  All Meals
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.slug)}
                    className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      categorySlug === cat.slug
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-charcoal-600 hover:bg-charcoal-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <hr className="my-5 border-charcoal-100" />

              <h3 className="mb-3 font-serif text-lg font-semibold text-charcoal-900">
                Price Range
              </h3>
              <div>
                <input
                  type="range"
                  min="1000"
                  max="15000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary-600"
                />
                <div className="mt-2 flex justify-between text-xs text-charcoal-500">
                  <span>₦1,000</span>
                  <span className="font-semibold text-primary-600">Max ₦{maxPrice.toLocaleString()}</span>
                </div>
              </div>

              {categorySlug && (
                <button
                  onClick={() => setCategory('')}
                  className="mt-5 w-full rounded-lg bg-charcoal-50 py-2.5 text-sm font-medium text-charcoal-600 transition-colors hover:bg-charcoal-100"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Menu Grid */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-charcoal-600">
                {loading ? 'Loading...' : `${items.length} meal${items.length !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="card overflow-hidden">
                    <div className="h-52 shimmer-bg" />
                    <div className="p-4">
                      <div className="h-5 w-2/3 shimmer-bg rounded" />
                      <div className="mt-3 h-4 w-full shimmer-bg rounded" />
                      <div className="mt-4 flex justify-between">
                        <div className="h-6 w-20 shimmer-bg rounded" />
                        <div className="h-8 w-16 shimmer-bg rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center">
                <Search size={48} className="text-charcoal-300" />
                <h3 className="mt-4 font-serif text-xl font-semibold text-charcoal-700">
                  No meals found
                </h3>
                <p className="mt-2 text-sm text-charcoal-500">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <FoodCard key={item.id} item={item} onQuickView={setQuickViewItem} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <QuickViewModal item={quickViewItem} onClose={() => setQuickViewItem(null)} />
    </div>
  );
}
