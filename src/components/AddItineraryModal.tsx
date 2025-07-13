'use client';

import { useState } from 'react';

export default function AddItineraryModal({ tripId, onClose, onSuccess }: {
  tripId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [newItem, setNewItem] = useState({ name: '', type: '', date: '', location: '' });

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
        console.error('Erro ao criar itinerary');
        return;
      }

      onSuccess();
      onClose();  
    } catch (err) {
      console.error('Erro na requisição:', err);
    }
  };

  return (
    <div className="modal d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content p-4 bg-white rounded shadow">
          <h2 className="text-lg font-bold mb-4">Add New Itinerary</h2>

          <div className="space-y-3">
            <input className="form-control" placeholder="Name" value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
            <input className="form-control" placeholder="Type" value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })} />
            <input type="date" className="form-control" value={newItem.date}
              onChange={(e) => setNewItem({ ...newItem, date: e.target.value })} />
            <input className="form-control" placeholder="Location (URL)" value={newItem.location}
              onChange={(e) => setNewItem({ ...newItem, location: e.target.value })} />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button className="btn btn-light" onClick={onClose}>Cancel</button>
            <button className="btn btn-dark" onClick={handleCreate}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
