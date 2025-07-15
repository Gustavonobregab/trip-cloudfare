import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

interface OrderItem {
  id: string;
  position: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as OrderItem[];
    console.log(body.length);
    
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid body format' }, { status: 400 });
    }

    const updates = body
    .filter((item) => item.id && typeof item.position === 'number')
    .map((item) =>
      supabase
        .from('itinerary_items')
        .update({ position: item.position })
        .eq('id', item.id)
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
