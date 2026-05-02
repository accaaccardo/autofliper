import Link from 'next/link';
import { ArrowLeftRight, Mail, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <ArrowLeftRight className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Auto<span className="text-brand-400">fliper</span>
              </span>
            </Link>
            <p className="text-sm text-surface-400 leading-relaxed">
              The exchange-first car marketplace. Find your perfect swap today.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-9 h-9 bg-surface-800 rounded-lg flex items-center justify-center hover:bg-surface-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-surface-800 rounded-lg flex items-center justify-center hover:bg-surface-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-surface-800 rounded-lg flex items-center justify-center hover:bg-surface-700 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Marketplace</h4>
            <ul className="space-y-3 text-sm text-surface-400">
              <li><Link href="/browse" className="hover:text-white transition-colors">Browse All Cars</Link></li>
              <li><Link href="/browse?onlyExchange=true" className="hover:text-white transition-colors">Exchange Cars</Link></li>
              <li><Link href="/post" className="hover:text-white transition-colors">List Your Car</Link></li>
              <li><Link href="/browse?fuelType=ELECTRIC" className="hover:text-white transition-colors">Electric Cars</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Account</h4>
            <ul className="space-y-3 text-sm text-surface-400">
              <li><Link href="/register" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">My Listings</Link></li>
              <li><Link href="/profile?tab=matches" className="hover:text-white transition-colors">My Matches</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-surface-400">
              <li><a href="#" className="hover:text-white transition-colors">About Autofliper</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety Tips</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-surface-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-surface-500">
            © {new Date().getFullYear()} Autofliper. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-surface-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
