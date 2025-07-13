'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import TripDetailsPage from "@/app/trip-details/[id]/page";
import { useRouter } from 'next/navigation';
import CreateTrip from "./CreateTrip";

interface Trip {
    id: string;
    name: string;
    photo_url: string[];
    description: string;
  }
  

export default function TripList() {
    const router = useRouter(); 
    const { user, isLoading } = useAuth();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [page, setPage] = useState(1);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const limit = 12;

    
    const fetchTrips = async (currentPage: number) => {  
        setLoading(true);
        setError(null);
        
        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            const headers: HeadersInit = {
              'Content-Type': 'application/json',
            };
        
            if (session?.access_token) {
              headers['Authorization'] = `Bearer ${session.access_token}`;
            }
 
            const res = await fetch(`/api/trips?page=${currentPage}&limit=${limit}`, {
              headers,
            });
                  
            const result = await res.json();
    
            if (res.ok) {
                setTrips((prev) => {
                    const existingIds = new Set(prev.map((t) => t.id));
                    const uniqueNewTrips = (result.data as Trip[]).filter((t) => !existingIds.has(t.id));
                    return [...prev, ...uniqueNewTrips];
                });
                setHasMore(result.data.length === limit);
            }

        } catch (error) {
            console.error("Failed to fetch trips:", error);
            setError("Failed to fetch trips. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        if (!isLoading) {
            fetchTrips(page);
        } 
    }, [page, user, isLoading]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="spinner-border" role="status"></div>
            </div>
        );
    }

    return (
        <div className="w-full px-2 sm:px-6  pb-20 box-border">
            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                    <button 
                        onClick={() => fetchTrips(1)}
                        className="ml-4 text-red-700 underline hover:no-underline"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {!loading && !error && (
                  <div className="mb-4 text-center text-gray-700">
                    {user
                      ? ""
                      : "Explore some public trips:"}
                  </div>
                )}

            {user && (
            <div className="mt-0 mb-6 flex justify-center">
                <button
                onClick={() => setShowCreateModal(true)}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                >
                 Create Trip
                </button>
            </div>
            )}

        
            <div
                className="grid gap-6"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                }}
            >
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

            {trips.length === 0 && !loading && !error && (
                <div className="flex flex-col items-center justify-center py-20">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">No Trips Yet</h2>
                    <p className="text-gray-600 mb-6">Start planning your next adventure!</p>
                </div>
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