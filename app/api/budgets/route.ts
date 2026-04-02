import { NextRequest, NextResponse } from 'next/server';
import { getBudgets, setBudget } from '@/lib/database';
import { getRequestAuth } from '@/lib/auth';

export async function GET() {
  try {
    const { userId } = await getRequestAuth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const budgets = await getBudgets(userId);
    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error in GET /api/budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
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
    const { categoryId, amount, month } = body;

    if (!categoryId || amount === undefined || !month) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await setBudget(userId, categoryId, parseFloat(amount), month);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/budgets:', error);
    return NextResponse.json({ error: 'Failed to set budget' }, { status: 500 });
  }
}