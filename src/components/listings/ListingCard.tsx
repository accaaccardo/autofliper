'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftRight, Eye, Gauge, Fuel, Settings, MapPin, Zap } from 'lucide-react';
import { cn, formatPrice, formatMileage, formatTimeAgo, getFuelLabel } from '@/lib/utils';

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    make: string;
    model: string;
    year: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    price?: number | null;
    openToExchange: boolean;
    lookingForMakes: string[];
    views: number;
    createdAt: string;
    images: Array<{ url: string; isPrimary: boolean }>;
    user: { name: string; location?: string | null };
    matchScore?: number;
    isMatch?: boolean;
  };
  className?: string;
}

export default function ListingCard({ listing, className }: ListingCardProps) {
  const primaryImage = listing.images?.[0]?.url;
  const isElectric = listing.fuelType === 'ELECTRIC';

  return (
    <Link href={`/listing/${listing.id}`}>
      <article className={cn(
        'card-hover group',
        listing.isMatch && 'ring-2 ring-green-400 ring-offset-2 match-pulse',
        className
      )}>
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-100">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 13l2-5h14l2 5M3 13v5a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-5M3 13h18" />
              </svg>
            </div>
          )}

          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {listing.isMatch && (
              <span className="badge-match text-xs font-bold">
                <Zap className="w-3 h-3" />
                MATCH
              </span>
            )}
            {listing.openToExchange && (
              <span className="exchange-flag">
                <ArrowLeftRight className="w-3 h-3" />
                EXCHANGE
              </span>
            )}
          </div>

          {/* Year badge */}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {listing.year}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-surface-900 text-[15px] leading-snug line-clamp-1 group-hover:text-brand-600 transition-colors">
                {listing.title}
              </h3>
              <p className="text-sm text-surface-500 mt-0.5">
                {listing.make} · {listing.model}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              {listing.price ? (
                <span className="font-display font-bold text-lg text-surface-900">
                  {formatPrice(listing.price)}
                </span>
              ) : (
                <span className="text-sm text-surface-400 italic">On request</span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-surface-600">
              <Gauge className="w-3.5 h-3.5 text-surface-400 flex-shrink-0" />
              <span>{formatMileage(listing.mileage)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-surface-600">
              {isElectric ? (
                <Zap className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              ) : (
                <Fuel className="w-3.5 h-3.5 text-surface-400 flex-shrink-0" />
              )}
              <span>{getFuelLabel(listing.fuelType)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-surface-600">
              <Settings className="w-3.5 h-3.5 text-surface-400 flex-shrink-0" />
              <span>{listing.transmission === 'AUTOMATIC' ? 'Auto' : listing.transmission === 'MANUAL' ? 'Manual' : listing.transmission}</span>
            </div>
          </div>

          {/* Exchange looking for */}
          {listing.openToExchange && listing.lookingForMakes.length > 0 && (
            <div className="bg-blue-50 rounded-lg px-3 py-2 mb-3">
              <p className="text-xs text-blue-700">
                <span className="font-semibold">Looking for: </span>
                {listing.lookingForMakes.slice(0, 3).join(', ')}
                {listing.lookingForMakes.length > 3 && ` +${listing.lookingForMakes.length - 3} more`}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-surface-100">
            <div className="flex items-center gap-1.5 text-xs text-surface-400">
              {listing.user.location && (
                <>
                  <MapPin className="w-3 h-3" />
                  <span>{listing.user.location}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-surface-400">
              <Eye className="w-3 h-3" />
              <span>{listing.views}</span>
              <span>·</span>
              <span>{formatTimeAgo(listing.createdAt)}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
