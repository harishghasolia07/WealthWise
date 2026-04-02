import { NextRequest, NextResponse } from 'next/server';
import { getTransactions, createTransaction } from '@/lib/database';
import { getRequestAuth } from '@/lib/auth';

export async function GET() {
  try {
    const { userId } = await getRequestAuth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const transactions = await getTransactions(userId);
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error in GET /api/transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, role } = await getRequestAuth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { amount, date, description, category, type } = body;

    // Validate required fields
    if (!amount || !date || !description || !category || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate amount is a positive number
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
    }

    // Validate type
    if (!['expense', 'income'].includes(type)) {
      return NextResponse.json({ error: 'Type must be either expense or income' }, { status: 400 });
    }

    const transaction = await createTransaction(userId, {
      amount: numAmount,
      date,
      description: description.trim(),
      category,
      type,
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/transactions:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}