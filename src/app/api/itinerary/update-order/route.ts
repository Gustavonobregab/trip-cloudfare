import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

interface OrderItem {
  id: string;
  position: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as OrderItem[];

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
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
