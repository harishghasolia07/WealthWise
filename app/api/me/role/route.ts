import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { normalizeRole } from '@/lib/roles';

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    const role = normalizeRole(user?.publicMetadata?.role);

    return NextResponse.json({ role });
  } catch (error) {
    console.error('Error in GET /api/me/role:', error);
    return NextResponse.json({ error: 'Failed to fetch role' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const role = body?.role;

    if (role !== 'admin' && role !== 'viewer') {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });

    return NextResponse.json({ role });
  } catch (error) {
    console.error('Error in PATCH /api/me/role:', error);
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}
