import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

const ListingSchema = z.object({
  title: z.string().min(5).max(200),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  mileage: z.number().int().min(0),
  fuelType: z.enum(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'PLUG_IN_HYBRID', 'LPG', 'CNG', 'HYDROGEN']),
  transmission: z.enum(['MANUAL', 'AUTOMATIC', 'SEMI_AUTOMATIC', 'CVT']),
  bodyType: z.enum(['SEDAN', 'HATCHBACK', 'SUV', 'COUPE', 'CONVERTIBLE', 'WAGON', 'VAN', 'PICKUP', 'MINIVAN', 'CROSSOVER']).optional(),
  color: z.string().optional(),
  doors: z.number().int().min(2).max(7).optional(),
  power: z.number().int().min(1).optional(),
  engineSize: z.number().min(0.5).max(10).optional(),
  price: z.number().min(0).optional().nullable(),
  priceNegotiable: z.boolean().default(false),
  description: z.string().max(5000).optional(),
  features: z.array(z.string()).default([]),
  openToExchange: z.boolean().default(false),
  lookingForMakes: z.array(z.string()).default([]),
  lookingForModels: z.array(z.string()).default([]),
  cashAdjustment: z.boolean().default(false),
  exchangeNotes: z.string().max(1000).optional(),
  images: z.array(z.object({
    url: z.string().url(),
    order: z.number().int(),
    isPrimary: z.boolean().optional(),
  })).default([]),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');
    const fuelType = searchParams.get('fuelType');
    const transmission = searchParams.get('transmission');
    const onlyExchange = searchParams.get('onlyExchange') === 'true';
    const search = searchParams.get('search');
    const userId = searchParams.get('userId');
    const sortBy = searchParams.get('sortBy') || 'newest';

    const where: any = {
      status: 'ACTIVE',
    };

    if (make) where.make = { equals: make, mode: 'insensitive' };
    if (model) where.model = { contains: model, mode: 'insensitive' };
    if (fuelType) where.fuelType = fuelType;
    if (transmission) where.transmission = transmission;
    if (onlyExchange) where.openToExchange = true;
    if (userId) where.userId = userId;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (minYear || maxYear) {
      where.year = {};
      if (minYear) where.year.gte = parseInt(minYear);
      if (maxYear) where.year.lte = parseInt(maxYear);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = sortBy === 'price_asc'
      ? { price: 'asc' }
      : sortBy === 'price_desc'
      ? { price: 'desc' }
      : sortBy === 'year_desc'
      ? { year: 'desc' }
      : sortBy === 'mileage_asc'
      ? { mileage: 'asc' }
      : { createdAt: 'desc' };

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          user: {
            select: { id: true, name: true, avatar: true, location: true },
          },
          _count: {
            select: { matchesAs1: true, matchesAs2: true },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Listings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = ListingSchema.parse(body);

    const { images, ...listingData } = data;

    const listing = await prisma.listing.create({
      data: {
        ...listingData,
        userId: user.id,
        images: images.length > 0 ? {
          create: images.map((img, index) => ({
            url: img.url,
            order: img.order,
            isPrimary: index === 0 || img.isPrimary === true,
          })),
        } : undefined,
      },
      include: {
        images: true,
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Listing POST error:', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
