import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid body format' }, { status: 400 });
  }

  for (const item of body) {
    if (!item.id || typeof item.position !== 'number') continue;

    await supabase
      .from('itinerary_items')
      .update({ position: item.position })
      .eq('id', item.id);
  }

  return NextResponse.json({ success: true });
}
