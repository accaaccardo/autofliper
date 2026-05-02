'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, ArrowLeftRight } from 'lucide-react';
import { CAR_MAKES, FUEL_TYPES, TRANSMISSION_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function BrowseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [expanded, setExpanded] = useState(false);

  // Read current filter values
  const search = searchParams.get('search') || '';
  const make = searchParams.get('make') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minYear = searchParams.get('minYear') || '';
  const maxYear = searchParams.get('maxYear') || '';
  const fuelType = searchParams.get('fuelType') || '';
  const transmission = searchParams.get('transmission') || '';
  const onlyExchange = searchParams.get('onlyExchange') === 'true';
  const sortBy = searchParams.get('sortBy') || 'newest';

  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    params.delete('page'); // Reset page on filter change
    router.push(`/browse?${params.toString()}`);
  }, [router, searchParams]);

  const clearAll = () => {
    router.push('/browse');
  };

  const activeFilterCount = [
    make, minPrice, maxPrice, minYear, maxYear, fuelType, transmission, onlyExchange
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
      {/* Search bar */}
      <div className="p-4 border-b border-surface-100">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search make, model, keyword..."
            defaultValue={search}
            className="input pl-10 pr-4"
            onChange={(e) => {
              const val = e.target.value;
              if (val.length === 0 || val.length >= 2) {
                updateFilters({ search: val || null });
              }
            }}
          />
        </div>
      </div>

      {/* Quick filters */}
      <div className="p-4 flex flex-wrap gap-2 border-b border-surface-100">
        {/* Exchange only toggle */}
        <button
          onClick={() => updateFilters({ onlyExchange: onlyExchange ? null : 'true' })}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all',
            onlyExchange
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-white text-surface-700 border-surface-200 hover:border-blue-300 hover:text-blue-600'
          )}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          Exchange Only
        </button>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => updateFilters({ sortBy: e.target.value })}
          className="px-4 py-2 rounded-full text-sm font-medium border border-surface-200 bg-white text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="year_desc">Year: Newest</option>
          <option value="mileage_asc">Mileage: Lowest</option>
        </select>

        {/* More filters toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ml-auto',
            expanded || activeFilterCount > 0
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white text-surface-700 border-surface-200 hover:border-brand-300'
          )}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-white/25 text-xs px-1.5 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {expanded && (
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 bg-surface-50">
          {/* Make */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <label className="label text-xs">Make</label>
            <select
              value={make}
              onChange={(e) => updateFilters({ make: e.target.value || null, model: null })}
              className="input text-sm"
            >
              <option value="">All Makes</option>
              {CAR_MAKES.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Fuel */}
          <div>
            <label className="label text-xs">Fuel Type</label>
            <select
              value={fuelType}
              onChange={(e) => updateFilters({ fuelType: e.target.value || null })}
              className="input text-sm"
            >
              <option value="">Any Fuel</option>
              {FUEL_TYPES.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Transmission */}
          <div>
            <label className="label text-xs">Gearbox</label>
            <select
              value={transmission}
              onChange={(e) => updateFilters({ transmission: e.target.value || null })}
              className="input text-sm"
            >
              <option value="">Any</option>
              {TRANSMISSION_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Price range */}
          <div>
            <label className="label text-xs">Min Price (€)</label>
            <input
              type="number"
              placeholder="0"
              defaultValue={minPrice}
              className="input text-sm"
              onBlur={(e) => updateFilters({ minPrice: e.target.value || null })}
            />
          </div>
          <div>
            <label className="label text-xs">Max Price (€)</label>
            <input
              type="number"
              placeholder="Any"
              defaultValue={maxPrice}
              className="input text-sm"
              onBlur={(e) => updateFilters({ maxPrice: e.target.value || null })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
