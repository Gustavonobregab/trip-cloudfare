import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    let userId: string | null = null;

    if (token) {
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 12);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const baseQuery = supabase
      .from('trips')
      .select('*', { count: 'exact' })
      .range(from, to);

    const query = userId ? baseQuery.eq('user_id', userId) : baseQuery;

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, total: count });
  } catch (error) {
    console.error('Error in trips API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

