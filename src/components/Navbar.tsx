'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { IconLogout } from '@tabler/icons-react';

export default function Navbar() {
  const { user } = useAuth();
  //const user = null;
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <header className="w-full py-4 px-6 flex justify-end items-center">
    {user ? (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-800">
          {user.email}
        </span>
        <button
            onClick={handleLogout}
            className="btn btn-dark flex items-center gap-1"
          >
            <IconLogout size={18} />
            Quit
          </button>
      </div>
    ) : (
      <Link
        href="/login"
        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
      >
        Login
      </Link>
    )}
  </header>
);
}