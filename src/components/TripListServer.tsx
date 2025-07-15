'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import CreateTrip from './CreateTrip';

interface Trip {
  id: string;
  name: string;
  photo_url: string[];
  description: string;
}

interface TripListProps {
  initialTrips: Trip[];
  total: number;
}

export default function TripList({ initialTrips, total }: TripListProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [totalPages, setTotalPages] = useState(Math.ceil(total / 8));
  const [isFading, setIsFading] = useState(false);
  const [hasMore, setHasMore] = useState(initialTrips.length === 8);

  const handlePageChange = async (newPage: number) => {
    setIsFading(true);
    setTimeout(async () => {
      setPage(newPage);
      const res = await fetch(`/api/trips?page=${newPage}&limit=8`);
      const result = await res.json();
      setTrips(result.data);
      setHasMore(result.data.length === 8);
      setIsFading(false);
    }, 50);
  };

  return (
    <div className="w-full px-2 sm:px-6  pb-20 box-border">
    
        {user && (
        <div className="mt-0 mb-6 flex justify-center">
           <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-dark rounded-md px-4 flex items-center gap-1"
            >
            Create Trip
            </button>
        </div>
        )}

        <div
        className={`grid gap-6 transition-opacity duration-300 ${
            isFading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
        >

        {loading && trips.length === 0 && (
        <div className="flex justify-center items-center min-h-[30rem] w-full col-span-full">
            <div className="spinner-grow" role="status"></div>
        </div>
        )} 

            {trips.map((trip) => (
                <div
                    key={trip.id}
                    className="relative h-[30rem] rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => {
                        if (user) {
                          router.push(`/trip-details/${trip.id}`);
                        } else {
                          router.push('/login');
                        }
                      }}                    >
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundImage: `url(${Array.isArray(trip.photo_url) ? trip.photo_url[0] : trip.photo_url || ''})` }}
                        />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                        <h3 className="text-white text-2xl font-bold">{trip.name}</h3>
                        <p className="mt-2 text-white text-sm">
                            {trip.description.length > 15
                                ? `${trip.description.slice(0, 45)}...`
                                : trip.description}
                        </p>
                    </div>
                </div>

            ))}
        </div>
        {!loading && trips.length > 0 && (
            <ul className="pagination flex justify-center mt-6">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                <button
                    className="page-link flex items-center justify-center"
                    onClick={() => handlePageChange(Math.max(page - 1, 1))}
                    disabled={page === 1}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6l6 6" /></svg>
                </button>
                </li>

                {[...Array(totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                return (
                    <li key={pageNumber} className={`page-item ${pageNumber === page ? 'active' : ''}`}>
                    <button
                        className={`page-link border-black text-black ${
                        pageNumber === page ? 'bg-black text-white ring-2 ring-black' : ''
                        }`}
                        onClick={() => handlePageChange(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                    </li>
                );
                })}

                <li className={`page-item ${!hasMore ? 'disabled' : ''}`}>
                <button
                    className="page-link flex items-center justify-center"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!hasMore}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6l-6 6" /></svg>
                </button>
                </li>
            </ul>
            )}

        {showCreateModal && (
        <CreateTrip 
            onClose={() => setShowCreateModal(false)} 
            onTripCreated={() => {
            setTrips([]);
            setPage(1);
            fetchTrips(1); 
            }} 
        />
        )}
    </div>
);
}