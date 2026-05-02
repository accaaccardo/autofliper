'use client';

import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Plus, User, LogOut, Car, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      'sticky top-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.08)]'
        : 'bg-white'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-brand group-hover:scale-105 transition-transform">
              <ArrowLeftRight className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-xl text-surface-900">
              Auto<span className="text-brand-600">fliper</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/browse" className="px-4 py-2 text-sm font-medium text-surface-700 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors">
              Browse Cars
            </Link>
            <Link href="/browse?onlyExchange=true" className="px-4 py-2 text-sm font-medium text-surface-700 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors flex items-center gap-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
              Exchanges
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/post" className="btn-primary text-sm px-4 py-2">
              <Plus className="w-4 h-4" />
              Post Your Car
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-surface-800">{user.name.split(' ')[0]}</span>
                  <ChevronDown className={cn('w-4 h-4 text-surface-500 transition-transform', userMenuOpen && 'rotate-180')} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-surface-100 overflow-hidden py-1.5 animate-slide-in">
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 transition-colors">
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link href="/profile?tab=listings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 transition-colors">
                      <Car className="w-4 h-4" />
                      My Listings
                    </Link>
                    <Link href="/profile?tab=matches" className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 transition-colors">
                      <ArrowLeftRight className="w-4 h-4 text-green-600" />
                      My Matches
                    </Link>
                    <div className="h-px bg-surface-100 my-1" />
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-ghost text-sm px-4 py-2">
                  Sign In
                </Link>
                <Link href="/register" className="btn-secondary text-sm px-4 py-2">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-surface-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-surface-100 px-4 py-4 space-y-1">
          <Link href="/browse" className="block px-4 py-3 text-sm font-medium text-surface-700 hover:bg-surface-50 rounded-xl">
            Browse Cars
          </Link>
          <Link href="/browse?onlyExchange=true" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-surface-700 hover:bg-surface-50 rounded-xl">
            <ArrowLeftRight className="w-4 h-4 text-blue-600" />
            Exchange Cars
          </Link>
          <Link href="/post" className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-brand-600 hover:bg-brand-50 rounded-xl">
            <Plus className="w-4 h-4" />
            Post Your Car
          </Link>
          {user ? (
            <>
              <Link href="/profile" className="block px-4 py-3 text-sm font-medium text-surface-700 hover:bg-surface-50 rounded-xl">My Profile</Link>
              <button onClick={logout} className="block w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block px-4 py-3 text-sm font-medium text-surface-700 hover:bg-surface-50 rounded-xl">Sign In</Link>
              <Link href="/register" className="block px-4 py-3 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-xl">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
