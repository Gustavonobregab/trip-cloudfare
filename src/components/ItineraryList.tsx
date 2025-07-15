
import { useEffect, useState } from 'react';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from 'next/navigation';
import { IconArrowLeft, IconCategory, IconGripVertical, IconTrash } from '@tabler/icons-react';
import { supabase } from '@/lib/supabaseClient';
import { Modal } from '@tabler/core';
import ConfirmModal from './ConfirmModal';

function SortableItem({ item, onDelete }: { item: any; onDelete: (id: string) => void }) {
  const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: item.id });
    const [showConfirm, setShowConfirm] = useState(false);

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    

    const router = useRouter();

    const handleClick = () => {
      if (item.location) {
        window.open(item.location, '_blank', 'noopener,noreferrer');
      }
    };


    const confirmDelete = async () => {
      const res = await fetch('/api/itinerary/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      });

      if (res.ok) {
        onDelete(item.id);
        setShowConfirm(false);
      }
    };
  
    return (
      <>
      <div
        ref={setNodeRef}
        style={style}
        onClick={handleClick}
        {...attributes}
        {...listeners}
        className="w-full h-20 bg-white rounded-lg shadow px-4 border flex items-center justify-between"
      >
         <div
        className="flex items-center gap-2 text-black text-base font-medium truncate"
      >
        <span
          onClick={(e) => e.stopPropagation()} 
          {...attributes}
          {...listeners}
          className="text-gray-400 cursor-move"
        >
          <IconGripVertical size={18} />
        </span>
        {item.name}
      </div>
      <div className="flex items-center gap-4 text-neutral-700 text-sm">
        <div className="flex flex-col items-end text-right">
          <span>{item.date}</span>
          <span>{item.type}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowConfirm(true);
          }}
          className="text-red-500 hover:text-red-700"
          title="Delete item"
        >
          <IconTrash size={18} />
        </button>
      </div>
      </div>
      {showConfirm && (
      <ConfirmModal
        title="Delete itinerary item"
        message="Are you sure you want to delete this item?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    )}
    </>
    );
}

export function ItineraryList({ trip, onAddItinerary, }: { trip: any; onAddItinerary: () => void; }) {
  const sortedItems = [...(trip.itinerary_items || [])].sort((a, b) => Number(a.position) - Number(b.position));
  const [items, setItems] = useState(sortedItems);

    useEffect(() => {
      const newSortedItems = [...trip.itinerary_items].sort((a, b) => Number(a.position) - Number(b.position));
      setItems(newSortedItems);
    }, [trip.itinerary_items]);
  
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 5,
        },
      })
    );
    const handleDragEnd = async (event: any) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
    
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
    
      const newItems = arrayMove(items, oldIndex, newIndex);
      const targetItem = newItems[newIndex];
    
      const before = newItems[newIndex - 1]?.position ?? 0;
      const after = newItems[newIndex + 1]?.position ?? before + 1000;
      const newPosition = (before + after) / 2;
    
      const updatedItem = { ...targetItem, position: newPosition };
    
      const updatedList = [...newItems];
      updatedList[newIndex] = updatedItem;
      setItems(updatedList);
    
      await fetch('/api/itinerary/update-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ id: updatedItem.id, position: newPosition }]),
      });
    };
  
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-black mb-4">Itinerary</h2>
        <button onClick={onAddItinerary} className="btn btn-dark mb-4">
        + Add Itinerary
      </button>
        {items.length ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              {items.map((item) => (
                <SortableItem 
                  key={item.id} 
                  item={item} 
                  onDelete={(id) => setItems(prev => prev.filter(i => i.id !== id))}
                />             
                 ))}
            </SortableContext>
          </DndContext>
        ) : (
          <p className="text-sm text-black">No itinerary items found.</p>
        )}
      </div>

      
      
    );
  }