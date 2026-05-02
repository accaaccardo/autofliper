import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null | undefined): string {
  if (!price) return 'Price on request';
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatMileage(mileage: number): string {
  return new Intl.NumberFormat('de-DE').format(mileage) + ' km';
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) return formatDate(date);
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return 'Just now';
}

export function getFuelLabel(fuel: string): string {
  const map: Record<string, string> = {
    PETROL: 'Petrol',
    DIESEL: 'Diesel',
    ELECTRIC: 'Electric',
    HYBRID: 'Hybrid',
    PLUG_IN_HYBRID: 'Plug-in Hybrid',
    LPG: 'LPG',
    CNG: 'CNG',
    HYDROGEN: 'Hydrogen',
  };
  return map[fuel] || fuel;
}

export function getTransmissionLabel(trans: string): string {
  const map: Record<string, string> = {
    MANUAL: 'Manual',
    AUTOMATIC: 'Automatic',
    SEMI_AUTOMATIC: 'Semi-Auto',
    CVT: 'CVT',
  };
  return map[trans] || trans;
}

export function getBodyTypeLabel(body: string | null): string {
  if (!body) return '';
  const map: Record<string, string> = {
    SEDAN: 'Sedan',
    HATCHBACK: 'Hatchback',
    SUV: 'SUV',
    COUPE: 'Coupé',
    CONVERTIBLE: 'Convertible',
    WAGON: 'Wagon',
    VAN: 'Van',
    PICKUP: 'Pickup',
    MINIVAN: 'Minivan',
    CROSSOVER: 'Crossover',
  };
  return map[body] || body;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
