import { prisma } from './prisma';

export interface MatchScore {
  listingId: string;
  score: number;
  reasons: string[];
}

/**
 * Core matching algorithm for Autofliper
 * 
 * Logic: Two listings match when:
 * 1. Listing A's make is in Listing B's lookingForMakes (B wants what A has)
 * 2. Listing B's make is in Listing A's lookingForMakes (A wants what B has)
 * 3. Both must be open to exchange
 */
export async function findMatches(listingId: string) {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { user: true },
  });

  if (!listing || !listing.openToExchange) return [];

  // Find all active listings that:
  // - Are NOT by the same user
  // - Are open to exchange
  // - Have a make that our listing is looking for
  // - Are looking for our listing's make
  const potentialMatches = await prisma.listing.findMany({
    where: {
      id: { not: listingId },
      userId: { not: listing.userId },
      status: 'ACTIVE',
      openToExchange: true,
      // The other listing must be looking for our make
      lookingForMakes: {
        has: listing.make,
      },
      // Our listing must be looking for the other listing's make
      make: {
        in: listing.lookingForMakes,
      },
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      user: {
        select: { id: true, name: true, avatar: true, location: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Score matches for better ranking
  return potentialMatches.map((match) => ({
    ...match,
    matchScore: calculateMatchScore(listing, match),
  })).sort((a, b) => b.matchScore - a.matchScore);
}

function calculateMatchScore(listing: any, candidate: any): number {
  let score = 10; // Base score for mutual make match

  // Model match bonus
  if (
    listing.lookingForModels.length > 0 &&
    listing.lookingForModels.some((m: string) =>
      candidate.model.toLowerCase().includes(m.toLowerCase())
    )
  ) {
    score += 5;
  }

  if (
    candidate.lookingForModels.length > 0 &&
    candidate.lookingForModels.some((m: string) =>
      listing.model.toLowerCase().includes(m.toLowerCase())
    )
  ) {
    score += 5;
  }

  // Similar year (within 3 years)
  if (Math.abs(listing.year - candidate.year) <= 3) {
    score += 3;
  }

  // Similar price (within 20%)
  if (listing.price && candidate.price) {
    const priceDiff = Math.abs(listing.price - candidate.price);
    const avgPrice = (listing.price + candidate.price) / 2;
    if (priceDiff / avgPrice <= 0.2) {
      score += 4;
    } else if (priceDiff / avgPrice <= 0.4) {
      score += 2;
    }
  }

  // Same fuel type
  if (listing.fuelType === candidate.fuelType) {
    score += 1;
  }

  // Cash adjustment flexibility
  if (listing.cashAdjustment && candidate.cashAdjustment) {
    score += 2;
  }

  return score;
}

/**
 * Get all matches for a user across all their listings
 */
export async function getUserMatches(userId: string) {
  const userListings = await prisma.listing.findMany({
    where: { userId, openToExchange: true, status: 'ACTIVE' },
    select: { id: true, make: true, model: true, lookingForMakes: true },
  });

  const matchedListingIds = new Set<string>();
  const allMatches: any[] = [];

  for (const listing of userListings) {
    const matches = await findMatches(listing.id);
    for (const match of matches) {
      if (!matchedListingIds.has(match.id)) {
        matchedListingIds.add(match.id);
        allMatches.push({ ...match, forListingId: listing.id });
      }
    }
  }

  return allMatches;
}

/**
 * Check if two specific listings are a match
 */
export async function checkMatch(listing1Id: string, listing2Id: string): Promise<boolean> {
  const [l1, l2] = await Promise.all([
    prisma.listing.findUnique({ where: { id: listing1Id } }),
    prisma.listing.findUnique({ where: { id: listing2Id } }),
  ]);

  if (!l1 || !l2 || !l1.openToExchange || !l2.openToExchange) return false;

  const l1WantsL2Make = l1.lookingForMakes.includes(l2.make);
  const l2WantsL1Make = l2.lookingForMakes.includes(l1.make);

  return l1WantsL2Make && l2WantsL1Make;
}
