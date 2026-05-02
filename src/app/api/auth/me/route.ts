import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({ user });
}

export async function DELETE() {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.delete('auth-token');
  return response;
}
