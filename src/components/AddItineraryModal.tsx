'use client';

import { useState, useEffect } from 'react';


export default function AddItineraryModal({
  tripId,
  onClose,
  onSuccess,
}: {
  tripId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [newItem, setNewItem] = useState({
    name: '',
    type: '',
    date: '',
    location: '',
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/itinerary/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newItem, trip_id: tripId }),
      });

      if (!res.ok) {
        console.error('Error on handleCreate');
        return;
      }

      onSuccess();
      onClose();  
    } catch (err) {
      console.error('Erro na requisição:', err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
    >
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-900 !text-gray-900">Add New Itinerary</h2>
  
        <input
          type="text"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="mb-2 w-full border border-gray-300 p-2 rounded text-gray-900 bg-white !text-gray-900 !bg-white !border-gray-300"
          />
  
        <div className="relative mb-2 w-full">
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="w-full border border-gray-300 p-2 rounded text-left text-gray-900 bg-white"
          >
            {newItem.type || 'Select type'}
          </button>
          {showDropdown && (
            <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow z-10">
              {['Flight', 'Hotel', 'Tour', 'Meeting', 'Transport'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setNewItem({ ...newItem, type: item });
                    setShowDropdown(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-gray-900 hover:bg-gray-100 bg-white"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
  
        <input
          type="date"
          value={newItem.date}
          onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
          className="mb-2 w-full border border-gray-300 p-2 rounded text-gray-900 bg-white"
        />
  
        <input
          type="text"
          placeholder="Location (URL)"
          value={newItem.location}
          onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
          className="mb-2 w-full border border-gray-300 p-2 rounded text-gray-900 bg-white"
        />
  
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
  
}
