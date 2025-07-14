'use client';

import TripsPage from './main-trips/page';
import '@tabler/core/dist/css/tabler.min.css';
import '@/app/globals.css';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import TablerInitializer from '@/components/TablerInitializer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
    <Navbar />
    <Hero />
    <TablerInitializer />
    <main className="flex-grow">
      <TripsPage />
    </main>
    <Footer />
  </div>
);
}