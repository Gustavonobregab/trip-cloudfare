'use client';

import TripList from '@/components/TripList';

export default function TripsPage() {
  return (
    <section className="px-4 py-10 lg:py-5">
      <div className="max-w-screen-xl mx-auto">
           <TripList />
      </div>
    </section>
  );
}
