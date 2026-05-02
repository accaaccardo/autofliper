import { NextRequest, NextResponse } from 'next/server';
import { getUserMatches } from '@/lib/matching';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const matches = await getUserMatches(user.id);

    return NextResponse.json({
      matches,
      count: matches.length,
    });
  } catch (error) {
    console.error('User matches error:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}
