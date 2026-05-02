import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import ListingCard from '@/components/listings/ListingCard';
import BrowseFilters from '@/components/listings/BrowseFilters';
import { ArrowLeftRight, Car } from 'lucide-react';
import Link from 'next/link';

interface BrowsePageProps {
  searchParams: {
    page?: string;
    search?: string;
    make?: string;
    model?: string;
    minPrice?: string;
    maxPrice?: string;
    minYear?: string;
    maxYear?: string;
    fuelType?: string;
    transmission?: string;
    onlyExchange?: string;
    sortBy?: string;
  };
}

async function getListings(params: BrowsePageProps['searchParams']) {
  const page = parseInt(params.page || '1');
  const limit = 12;
  const onlyExchange = params.onlyExchange === 'true';

  const where: any = { status: 'ACTIVE' };

  if (params.make) where.make = { equals: params.make, mode: 'insensitive' };
  if (params.model) where.model = { contains: params.model, mode: 'insensitive' };
  if (params.fuelType) where.fuelType = params.fuelType;
  if (params.transmission) where.transmission = params.transmission;
  if (onlyExchange) where.openToExchange = true;

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) where.price.gte = parseFloat(params.minPrice);
    if (params.maxPrice) where.price.lte = parseFloat(params.maxPrice);
  }

  if (params.minYear || params.maxYear) {
    where.year = {};
    if (params.minYear) where.year.gte = parseInt(params.minYear);
    if (params.maxYear) where.year.lte = parseInt(params.maxYear);
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { make: { contains: params.search, mode: 'insensitive' } },
      { model: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  const sortBy = params.sortBy || 'newest';
  const orderBy: any =
    sortBy === 'price_asc' ? { price: 'asc' } :
    sortBy === 'price_desc' ? { price: 'desc' } :
    sortBy === 'year_desc' ? { year: 'desc' } :
    sortBy === 'mileage_asc' ? { mileage: 'asc' } :
    { createdAt: 'desc' };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        user: { select: { id: true, name: true, avatar: true, location: true } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.listing.count({ where }),
  ]);

  return {
    listings,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const { listings, pagination } = await getListings(searchParams);
  const isExchangeOnly = searchParams.onlyExchange === 'true';

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Page header */}
      <div className="bg-white border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            {isExchangeOnly ? (
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <ArrowLeftRight className="w-5 h-5 text-blue-600" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-brand-600" />
              </div>
            )}
            <div>
              <h1 className="font-display text-2xl font-bold text-surface-900">
                {isExchangeOnly ? 'Exchange Cars' : 'Browse Cars'}
              </h1>
              <p className="text-sm text-surface-500 mt-0.5">
                {pagination.total.toLocaleString()} {isExchangeOnly ? 'cars available for exchange' : 'cars found'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <Suspense fallback={<div className="h-20 bg-white rounded-2xl animate-pulse mb-6" />}>
          <div className="mb-6">
            <BrowseFilters />
          </div>
        </Suspense>

        {/* Results */}
        {listings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-10 h-10 text-surface-300" />
            </div>
            <h3 className="font-display text-xl font-bold text-surface-900 mb-2">No cars found</h3>
            <p className="text-surface-500 mb-6">Try adjusting your filters or search terms</p>
            <Link href="/browse" className="btn-secondary">Clear All Filters</Link>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {listings.map((listing, i) => (
                <div
                  key={listing.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${Math.min(i * 0.04, 0.3)}s` }}
                >
                  <ListingCard listing={listing as any} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {pagination.page > 1 && (
                  <Link
                    href={`/browse?${new URLSearchParams({ ...searchParams, page: String(pagination.page - 1) })}`}
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    Previous
                  </Link>
                )}

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <Link
                        key={p}
                        href={`/browse?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-colors
                          ${p === pagination.page
                            ? 'bg-brand-600 text-white shadow-brand'
                            : 'bg-white text-surface-700 hover:bg-surface-100 border border-surface-200'
                          }`}
                      >
                        {p}
                      </Link>
                    );
                  })}
                </div>

                {pagination.page < pagination.pages && (
                  <Link
                    href={`/browse?${new URLSearchParams({ ...searchParams, page: String(pagination.page + 1) })}`}
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
