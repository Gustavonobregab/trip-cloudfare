'use client';

import TripDetails from '@/components/TripDetails';
import { useParams } from 'next/navigation';

export default function TripDetailsPage() {
  const { id } = useParams() as { id: string };

  if (!id || typeof id !== 'string') {
    return <div className="p-4 text-center text-red-600">Trip ID is invalid.</div>;
  }

  return (
    <section className="px-4 py-10 lg:py-5">
      <div className="max-w-screen-xl mx-auto">
        <TripDetails id={id} />
      </div>
    </section>
  );
}
