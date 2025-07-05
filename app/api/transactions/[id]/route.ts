import { NextRequest, NextResponse } from 'next/server';
import { updateTransaction, deleteTransaction } from '@/lib/database';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    await updateTransaction(id, body);
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
    const { id } = params;
    await deleteTransaction(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/transactions/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}