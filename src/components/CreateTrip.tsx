'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Props {
  onClose: () => void;
  onTripCreated: () => void;
}

export default function CreateTrip({ onClose, onTripCreated }: Props) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) return;

      const imageUrls: string[] = [];
      
      for (const imageFile of imageFiles) {
        const filePath = `${session.user.id}/${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase
          .storage
          .from('trip-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase
          .storage
          .from('trip-images')
          .getPublicUrl(filePath);

        imageUrls.push(data.publicUrl);
      }

      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          start_date: startDate,
          end_date: endDate,
          description,
          photo_url: imageUrls
        })
      });

      if (res.ok) {
        onTripCreated();
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
    >
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Create a New Trip</h2>
  
        <div
          className="mb-4 w-full border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer hover:border-gray-400 transition"
          onClick={() => document.getElementById('trip-image-input')?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files) handleFileSelect(files);
          }}
        >
          {imageFiles.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-700 font-medium">Selected Images ({imageFiles.length}):</p>
              {imageFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-600 truncate">{file.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm ml-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Drag & drop images here or click to select
            </p>
          )}
  
          <input
            id="trip-image-input"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              handleFileSelect(e.target.files);
              e.target.value = '';
            }}            
            className="hidden"
          />
        </div>
  
        <input
          type="text"
          placeholder="Trip Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2 w-full border p-2 rounded"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mb-2 w-full border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mb-2 w-full border p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-2 w-full border p-2 rounded"
        />
  
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-gray-500 px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
  
}

