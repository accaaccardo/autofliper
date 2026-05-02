import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { findMatches } from '@/lib/matching';
import { formatPrice, formatMileage, getFuelLabel, getTransmissionLabel, getBodyTypeLabel, formatTimeAgo } from '@/lib/utils';
import {
  ArrowLeftRight, Gauge, Fuel, Settings, Calendar, MapPin,
  Eye, User, CheckCircle, Zap, Car, ChevronRight, Share2
} from 'lucide-react';
import ListingCard from '@/components/listings/ListingCard';
import ImageGallery from '@/components/listings/ImageGallery';

interface ListingPageProps {
  params: { id: string };
}

async function getListing(id: string) {
  const listing = await prisma.listing.findUnique({
    where: { id, status: 'ACTIVE' },
    include: {
      images: { orderBy: { order: 'asc' } },
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
          location: true,
          phone: true,
          createdAt: true,
          _count: { select: { listings: true } },
        },
      },
    },
  });
  return listing;
}

export default async function ListingPage({ params }: ListingPageProps) {
  const listing = await getListing(params.id);
  if (!listing) notFound();

  // Increment view
  await prisma.listing.update({ where: { id: params.id }, data: { views: { increment: 1 } } });

  const matches = listing.openToExchange ? await findMatches(params.id) : [];

  const specs = [
    { label: 'Make', value: listing.make, icon: Car },
    { label: 'Model', value: listing.model, icon: Car },
    { label: 'Year', value: listing.year.toString(), icon: Calendar },
    { label: 'Mileage', value: formatMileage(listing.mileage), icon: Gauge },
    { label: 'Fuel', value: getFuelLabel(listing.fuelType), icon: Fuel },
    { label: 'Gearbox', value: getTransmissionLabel(listing.transmission), icon: Settings },
    ...(listing.bodyType ? [{ label: 'Body Type', value: getBodyTypeLabel(listing.bodyType), icon: Car }] : []),
    ...(listing.color ? [{ label: 'Color', value: listing.color, icon: Car }] : []),
    ...(listing.doors ? [{ label: 'Doors', value: listing.doors.toString(), icon: Car }] : []),
    ...(listing.power ? [{ label: 'Power', value: `${listing.power} kW`, icon: Zap }] : []),
    ...(listing.engineSize ? [{ label: 'Engine', value: `${listing.engineSize}L`, icon: Settings }] : []),
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-surface-500">
            <Link href="/" className="hover:text-surface-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/browse" className="hover:text-surface-900 transition-colors">Browse</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/browse?make=${listing.make}`} className="hover:text-surface-900 transition-colors">{listing.make}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-surface-900 font-medium truncate max-w-[200px]">{listing.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <ImageGallery images={listing.images} title={listing.title} />

            {/* Title & Price */}
            <div className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {listing.openToExchange && (
                      <span className="exchange-flag">
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                        Open to Exchange
                      </span>
                    )}
                  </div>
                  <h1 className="font-display text-3xl font-bold text-surface-900 mb-1">{listing.title}</h1>
                  <div className="flex items-center gap-3 text-surface-500 text-sm">
                    {listing.user.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {listing.user.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      {listing.views} views
                    </span>
                    <span>{formatTimeAgo(listing.createdAt.toString())}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {listing.price ? (
                    <>
                      <p className="font-display text-4xl font-bold text-surface-900">{formatPrice(listing.price)}</p>
                      {listing.priceNegotiable && (
                        <p className="text-sm text-surface-500 mt-1">Price negotiable</p>
                      )}
                    </>
                  ) : (
                    <p className="font-display text-xl font-bold text-surface-500">Price on<br />request</p>
                  )}
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className="card p-6">
              <h2 className="font-display text-xl font-bold text-surface-900 mb-5">Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {specs.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-start gap-3 p-3 bg-surface-50 rounded-xl">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-card">
                      <Icon className="w-4 h-4 text-surface-500" />
                    </div>
                    <div>
                      <p className="text-xs text-surface-400 font-medium">{label}</p>
                      <p className="text-sm font-semibold text-surface-900 mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {listing.features.length > 0 && (
              <div className="card p-6">
                <h2 className="font-display text-xl font-bold text-surface-900 mb-5">Features & Equipment</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {listing.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-surface-700">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <div className="card p-6">
                <h2 className="font-display text-xl font-bold text-surface-900 mb-4">Description</h2>
                <p className="text-surface-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
              </div>
            )}

            {/* Exchange info */}
            {listing.openToExchange && (
              <div className="card p-6 border-2 border-blue-100 bg-blue-50/30">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <ArrowLeftRight className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-surface-900">Exchange Information</h2>
                    <p className="text-sm text-blue-600 font-medium">Owner is open to swap</p>
                  </div>
                </div>

                {listing.lookingForMakes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-surface-700 mb-2">Looking for makes:</p>
                    <div className="flex flex-wrap gap-2">
                      {listing.lookingForMakes.map((make) => (
                        <Link
                          key={make}
                          href={`/browse?make=${make}`}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                          {make}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {listing.lookingForModels.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-surface-700 mb-2">Preferred models:</p>
                    <div className="flex flex-wrap gap-2">
                      {listing.lookingForModels.map((model) => (
                        <span key={model} className="px-3 py-1.5 bg-white text-surface-700 rounded-full text-sm font-medium border border-surface-200">
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {listing.cashAdjustment && (
                  <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2.5 rounded-xl mb-4">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Cash adjustment accepted</span>
                  </div>
                )}

                {listing.exchangeNotes && (
                  <div className="bg-white rounded-xl p-4 border border-blue-100">
                    <p className="text-sm text-surface-500 font-medium mb-1">Exchange notes:</p>
                    <p className="text-sm text-surface-700">{listing.exchangeNotes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Matches section */}
            {listing.openToExchange && matches.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-600" fill="currentColor" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-surface-900">
                      Cars You Can Exchange With
                    </h2>
                    <p className="text-sm text-green-600 font-medium">
                      {matches.length} mutual match{matches.length !== 1 ? 'es' : ''} found
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {matches.slice(0, 4).map((match) => (
                    <ListingCard
                      key={match.id}
                      listing={{ ...match, isMatch: true } as any}
                    />
                  ))}
                </div>

                {matches.length > 4 && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-surface-500">
                      +{matches.length - 4} more potential exchange matches
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Seller & Contact */}
          <div className="space-y-5">
            {/* Contact card */}
            <div className="card p-6 sticky top-20">
              {/* Seller */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-surface-100">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-lg flex-shrink-0">
                  {listing.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-surface-900">{listing.user.name}</p>
                  {listing.user.location && (
                    <p className="text-sm text-surface-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {listing.user.location}
                    </p>
                  )}
                  <p className="text-xs text-surface-400 mt-0.5">
                    Member since {new Date(listing.user.createdAt).getFullYear()} · {listing.user._count.listings} listings
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {listing.openToExchange && (
                  <a
                    href={`mailto:?subject=Exchange offer for: ${listing.title}`}
                    className="btn-exchange w-full py-3 text-sm justify-center"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    Propose Exchange
                  </a>
                )}

                {listing.user.phone && (
                  <a href={`tel:${listing.user.phone}`} className="btn-primary w-full py-3 text-sm justify-center">
                    Call Seller
                  </a>
                )}

                <button className="btn-secondary w-full py-3 text-sm justify-center">
                  <Share2 className="w-4 h-4" />
                  Share Listing
                </button>
              </div>

              {/* Quick specs */}
              <div className="mt-5 pt-5 border-t border-surface-100 grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-surface-50 rounded-xl">
                  <p className="text-xs text-surface-400 mb-1">Year</p>
                  <p className="font-bold text-surface-900">{listing.year}</p>
                </div>
                <div className="text-center p-3 bg-surface-50 rounded-xl">
                  <p className="text-xs text-surface-400 mb-1">Mileage</p>
                  <p className="font-bold text-surface-900">{(listing.mileage / 1000).toFixed(0)}k km</p>
                </div>
                <div className="text-center p-3 bg-surface-50 rounded-xl">
                  <p className="text-xs text-surface-400 mb-1">Fuel</p>
                  <p className="font-bold text-surface-900">{getFuelLabel(listing.fuelType)}</p>
                </div>
                <div className="text-center p-3 bg-surface-50 rounded-xl">
                  <p className="text-xs text-surface-400 mb-1">Gearbox</p>
                  <p className="font-bold text-surface-900">{listing.transmission === 'AUTOMATIC' ? 'Auto' : 'Manual'}</p>
                </div>
              </div>
            </div>

            {/* Safety tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-amber-800 mb-2">Safety Tips</p>
              <ul className="text-xs text-amber-700 space-y-1.5">
                <li>• Always meet in a safe, public location</li>
                <li>• Verify all documents before exchanging</li>
                <li>• Use a notary for legal protection</li>
                <li>• Never pay in advance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
