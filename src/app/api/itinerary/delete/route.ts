import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function DELETE(req: Request) {
  try {
    const body = await req.json() as { id: string };
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing itinerary item ID' }, { status: 400 });
    }

    const { error } = await supabase
      .from('itinerary_items')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
