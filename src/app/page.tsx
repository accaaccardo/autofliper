import Link from 'next/link';
import { ArrowLeftRight, Plus, ChevronRight, Zap, Shield, TrendingUp } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ListingCard from '@/components/listings/ListingCard';

async function getHomeListings() {
  const [latest, exchanges] = await Promise.all([
    prisma.listing.findMany({
      where: { status: 'ACTIVE' },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        user: { select: { id: true, name: true, location: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.listing.findMany({
      where: { status: 'ACTIVE', openToExchange: true },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        user: { select: { id: true, name: true, location: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
  ]);
  return { latest, exchanges };
}

async function getStats() {
  const [listings, exchanges, users] = await Promise.all([
    prisma.listing.count({ where: { status: 'ACTIVE' } }),
    prisma.listing.count({ where: { status: 'ACTIVE', openToExchange: true } }),
    prisma.user.count(),
  ]);
  return { listings, exchanges, users };
}

export default async function HomePage() {
  const { latest, exchanges } = await getHomeListings();
  const stats = await getStats();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface-900 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #f97316 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, #ea6500 0%, transparent 40%)`,
          }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-500/30 text-brand-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-fade-up">
              <ArrowLeftRight className="w-4 h-4" />
              The Exchange-First Car Marketplace
            </div>

            <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-up animate-stagger-1">
              Find your{' '}
              <span className="text-brand-400">perfect</span>{' '}
              car exchange
            </h1>

            <p className="text-xl text-surface-300 mb-10 max-w-xl leading-relaxed animate-fade-up animate-stagger-2">
              List your car, discover mutual matches, and exchange with confidence.
              No middlemen, no hidden fees — just smart swaps.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animate-stagger-3">
              <Link href="/post" className="btn-primary text-base px-8 py-4">
                <Plus className="w-5 h-5" />
                Post Your Car
              </Link>
              <Link href="/browse" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 transition-all duration-150 text-base">
                Browse Cars
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-14 pt-10 border-t border-white/10 animate-fade-up animate-stagger-4">
              <div>
                <p className="font-display text-3xl font-bold text-white">{stats.listings.toLocaleString()}+</p>
                <p className="text-sm text-surface-400 mt-1">Active Listings</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-brand-400">{stats.exchanges.toLocaleString()}+</p>
                <p className="text-sm text-surface-400 mt-1">Exchange Offers</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-white">{stats.users.toLocaleString()}+</p>
                <p className="text-sm text-surface-400 mt-1">Members</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-surface-900 mb-3">How Autofliper Works</h2>
            <p className="text-surface-500 text-lg">Three steps to your perfect exchange</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Plus,
                color: 'brand',
                step: '01',
                title: 'List Your Car',
                desc: 'Add photos, specs, and tell us what you\'re looking for in exchange. Takes under 5 minutes.',
              },
              {
                icon: Zap,
                color: 'green',
                step: '02',
                title: 'Get Matched',
                desc: 'Our algorithm finds users who have what you want AND want what you have. Mutual exchange magic.',
              },
              {
                icon: ArrowLeftRight,
                color: 'blue',
                step: '03',
                title: 'Exchange',
                desc: 'Connect with your match, arrange viewing, and complete the exchange. Simple and transparent.',
              },
            ].map(({ icon: Icon, color, step, title, desc }) => (
              <div key={step} className="relative group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5
                  ${color === 'brand' ? 'bg-brand-100' : color === 'green' ? 'bg-green-100' : 'bg-blue-100'}`}>
                  <Icon className={`w-7 h-7 ${color === 'brand' ? 'text-brand-600' : color === 'green' ? 'text-green-600' : 'text-blue-600'}`} />
                </div>
                <div className="absolute top-4 right-0 font-display text-7xl font-bold text-surface-100 select-none">
                  {step}
                </div>
                <h3 className="font-display text-xl font-bold text-surface-900 mb-2">{title}</h3>
                <p className="text-surface-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exchange listings */}
      {exchanges.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Open to Exchange</span>
                </div>
                <h2 className="font-display text-3xl font-bold text-surface-900">Exchange Cars</h2>
                <p className="text-surface-500 mt-1">Cars with owners ready to swap</p>
              </div>
              <Link href="/browse?onlyExchange=true" className="hidden sm:flex btn-secondary text-sm gap-2">
                View All Exchanges
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {exchanges.map((listing, i) => (
                <div key={listing.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <ListingCard listing={listing as any} />
                </div>
              ))}
            </div>

            <div className="mt-6 sm:hidden">
              <Link href="/browse?onlyExchange=true" className="btn-secondary w-full justify-center">
                View All Exchange Cars
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest listings */}
      {latest.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-brand-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-brand-600" />
                  </div>
                  <span className="text-sm font-semibold text-brand-600 uppercase tracking-wide">Just Listed</span>
                </div>
                <h2 className="font-display text-3xl font-bold text-surface-900">Latest Cars</h2>
                <p className="text-surface-500 mt-1">Freshly added to the marketplace</p>
              </div>
              <Link href="/browse" className="hidden sm:flex btn-secondary text-sm gap-2">
                Browse All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latest.map((listing, i) => (
                <div key={listing.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <ListingCard listing={listing as any} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Ready to find your perfect exchange?
          </h2>
          <p className="text-brand-100 text-lg mb-8">
            Join thousands of car enthusiasts swapping vehicles every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-colors text-base shadow-lg">
              <Plus className="w-5 h-5" />
              Start For Free
            </Link>
            <Link href="/browse" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-700 text-white font-semibold rounded-xl hover:bg-brand-800 transition-colors text-base">
              Browse Listings
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
