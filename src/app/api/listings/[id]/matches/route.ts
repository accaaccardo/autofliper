import { NextRequest, NextResponse } from 'next/server';
import { findMatches } from '@/lib/matching';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const matches = await findMatches(params.id);

    return NextResponse.json({
      matches,
      count: matches.length,
    });
  } catch (error) {
    console.error('Matches GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}
