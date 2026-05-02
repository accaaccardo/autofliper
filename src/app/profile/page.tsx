'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ListingCard from '@/components/listings/ListingCard';
import { User, Car, ArrowLeftRight, Plus, MapPin, Mail } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get('tab') || 'listings';

  const [listings, setListings] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoadingData(true);
      try {
        if (tab === 'listings') {
          const res = await fetch(`/api/listings?userId=${user.id}`);
          const data = await res.json();
          setListings(data.listings || []);
        } else {
          const res = await fetch('/api/matches');
          const data = await res.json();
          setMatches(data.matches || []);
        }
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user, tab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Profile header */}
      <div className="bg-white border-b border-surface-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-700 font-display font-bold text-3xl flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold text-surface-900">{user.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-surface-500">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </span>
                {user.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {user.location}
                  </span>
                )}
              </div>
            </div>
            <Link href="/post" className="btn-primary text-sm hidden sm:flex">
              <Plus className="w-4 h-4" />
              New Listing
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {[
              { id: 'listings', label: 'My Listings', icon: Car },
              { id: 'matches', label: 'My Matches', icon: ArrowLeftRight },
            ].map(({ id, label, icon: Icon }) => (
              <Link
                key={id}
                href={`/profile?tab=${id}`}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
                  tab === id
                    ? 'bg-brand-600 text-white shadow-brand'
                    : 'text-surface-600 hover:bg-surface-100'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingData ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card h-64 animate-pulse bg-surface-100" />
            ))}
          </div>
        ) : tab === 'listings' ? (
          <>
            {listings.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-surface-300" />
                </div>
                <h3 className="font-display text-xl font-bold text-surface-900 mb-2">No listings yet</h3>
                <p className="text-surface-500 mb-6">Post your first car and start exchanging!</p>
                <Link href="/post" className="btn-primary">Post Your First Car</Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {listings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {matches.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowLeftRight className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-display text-xl font-bold text-surface-900 mb-2">No matches yet</h3>
                <p className="text-surface-500 mb-6">List your car and set what you're looking for to get matched!</p>
                <Link href="/post" className="btn-primary">Post a Car</Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {matches.map(match => (
                  <ListingCard key={match.id} listing={{ ...match, isMatch: true }} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
