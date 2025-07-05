import { NextRequest, NextResponse } from 'next/server';
import { getBudgets, setBudget } from '@/lib/database';

export async function GET() {
  try {
    const budgets = await getBudgets();
    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error in GET /api/budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, amount, month } = body;

    if (!categoryId || amount === undefined || !month) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await setBudget(categoryId, parseFloat(amount), month);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/budgets:', error);
    return NextResponse.json({ error: 'Failed to set budget' }, { status: 500 });
  }
}