'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftRight, Zap, MapPin } from 'lucide-react';
import { formatPrice, formatMileage } from '@/lib/utils';

interface MatchCardProps {
  myListing: {
    id: string;
    make: string;
    model: string;
    year: number;
    images: Array<{ url: string }>;
  };
  theirListing: {
    id: string;
    title: string;
    make: string;
    model: string;
    year: number;
    mileage: number;
    price?: number | null;
    images: Array<{ url: string }>;
    user: { name: string; location?: string | null };
    matchScore: number;
  };
}

export default function MatchCard({ myListing, theirListing }: MatchCardProps) {
  return (
    <div className="card overflow-hidden border-2 border-green-200 bg-gradient-to-br from-white to-green-50">
      {/* Match header */}
      <div className="bg-green-600 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Zap className="w-4 h-4" fill="currentColor" />
          <span className="text-sm font-bold tracking-wide">MUTUAL EXCHANGE MATCH</span>
        </div>
        <div className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          Score: {theirListing.matchScore}
        </div>
      </div>

      {/* Cars comparison */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* My car */}
          <Link href={`/listing/${myListing.id}`} className="flex-1 min-w-0 group">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-100 mb-2">
              {myListing.images[0] ? (
                <Image
                  src={myListing.images[0].url}
                  alt={`${myListing.make} ${myListing.model}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="150px"
                />
              ) : (
                <div className="absolute inset-0 bg-surface-100" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-bold truncate">{myListing.make} {myListing.model}</p>
                <p className="text-white/80 text-xs">{myListing.year}</p>
              </div>
            </div>
            <p className="text-xs text-surface-500 text-center font-medium">Your car</p>
          </Link>

          {/* Exchange icon */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-green-600" strokeWidth={2.5} />
            </div>
          </div>

          {/* Their car */}
          <Link href={`/listing/${theirListing.id}`} className="flex-1 min-w-0 group">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-100 mb-2">
              {theirListing.images[0] ? (
                <Image
                  src={theirListing.images[0].url}
                  alt={theirListing.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="150px"
                />
              ) : (
                <div className="absolute inset-0 bg-surface-100" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-bold truncate">{theirListing.make} {theirListing.model}</p>
                <p className="text-white/80 text-xs">{theirListing.year}</p>
              </div>
            </div>
            <p className="text-xs text-surface-500 text-center font-medium">Their car</p>
          </Link>
        </div>

        {/* Match details */}
        <div className="mt-3 pt-3 border-t border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-surface-900 text-sm line-clamp-1">{theirListing.title}</h4>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-surface-500">
                {theirListing.user.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {theirListing.user.location}
                  </span>
                )}
                <span>{formatMileage(theirListing.mileage)}</span>
              </div>
            </div>
            {theirListing.price && (
              <div className="text-right">
                <p className="font-bold text-surface-900">{formatPrice(theirListing.price)}</p>
              </div>
            )}
          </div>

          <Link
            href={`/listing/${theirListing.id}`}
            className="mt-3 w-full btn-exchange text-sm py-2 flex items-center justify-center gap-2"
          >
            <ArrowLeftRight className="w-4 h-4" />
            View Exchange Offer
          </Link>
        </div>
      </div>
    </div>
  );
}
