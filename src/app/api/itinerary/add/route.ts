import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  const body = await req.json();
  const { trip_id, name, type, date, location } = body;

  if (!trip_id || !name || !type || !date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data: currentItems, error: fetchError } = await supabase
    .from('itinerary_items')
    .select('position')
    .eq('trip_id', trip_id)
    .order('position', { ascending: false })
    .limit(1);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const nextPosition = currentItems?.[0]?.position ? currentItems[0].position + 1 : 1;

  const { data, error } = await supabase.from('itinerary_items').insert([
    {
      trip_id,
      name,
      type,
      date,
      position: nextPosition,
      location
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, item: data?.[0] }, { status: 200 });
}
