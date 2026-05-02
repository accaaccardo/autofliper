# 🚗 Autofliper — Car Exchange Marketplace

Exchange-first car marketplace built with Next.js 14, PostgreSQL, and Prisma.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, React Hook Form
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT (cookie-based)

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment
```bash
cp .env.example .env
```

Edit `.env` and fill in:
- `DATABASE_URL` — your PostgreSQL connection string
- `JWT_SECRET` — any random string
- `NEXTAUTH_SECRET` — any random string

### 3. Setup database
```bash
npm run db:push      # Create tables
npm run db:seed      # Add sample data
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials (after seeding)

- **Email**: marko@example.com
- **Password**: password123

## Deploy to Vercel + Neon (Free)

1. Push to GitHub
2. Create free PostgreSQL at [neon.tech](https://neon.tech)
3. Import repo on [vercel.com](https://vercel.com)
4. Add environment variables in Vercel dashboard
5. Deploy!

After deploy, run in Neon SQL Editor:
```sql
-- Tables are created automatically via Prisma
```

## Features

- ✅ User auth (register/login)
- ✅ Create car listings with 25 photos
- ✅ Exchange matching algorithm
- ✅ Browse with filters (make, price, fuel, exchange-only)
- ✅ Listing detail with gallery
- ✅ "Cars you can exchange with" section
- ✅ User profile with listings & matches
- ✅ Mobile-first design

## Folder Structure

```
src/
├── app/
│   ├── api/          # API routes
│   ├── browse/       # Browse page
│   ├── listing/      # Listing detail
│   ├── post/         # Create listing
│   ├── profile/      # User profile
│   ├── login/        # Auth pages
│   └── register/
├── components/
│   ├── layout/       # Navbar, Footer
│   ├── listings/     # ListingCard, Filters, Gallery
│   ├── matching/     # MatchCard
│   └── providers/    # AuthProvider
└── lib/
    ├── prisma.ts     # DB client
    ├── auth.ts       # JWT helpers
    ├── matching.ts   # Matching algorithm
    ├── constants.ts  # Car makes/models
    └── utils.ts      # Helpers
```
