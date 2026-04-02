import { NextRequest, NextResponse } from 'next/server';
import { updateTransaction, deleteTransaction } from '@/lib/database';
import { getRequestAuth } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, role } = await getRequestAuth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { id } = params;

    await updateTransaction(userId, id, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/transactions/[id]:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, role } = await getRequestAuth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;
    await deleteTransaction(userId, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/transactions/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}