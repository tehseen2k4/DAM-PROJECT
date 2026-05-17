'use client';

import { useState } from 'react';
import DeleteRoomConfirm from './DeleteRoomConfirm';
import EditRoomModal from './EditRoomModal';

export default function RoomCardActions({ room }: { room: any }) {
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
            onClick={() => setShowEdit(true)}
            className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
        </button>
        <button 
            onClick={() => setShowDelete(true)}
            className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 hover:text-rose-500 transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </button>
      </div>

      {showDelete && (
        <DeleteRoomConfirm 
            roomId={room.RoomID} 
            roomNumber={room.RoomNumber} 
            onClose={() => setShowDelete(false)} 
        />
      )}

      {showEdit && (
        <EditRoomModal 
            room={room} 
            onClose={() => setShowEdit(false)} 
        />
      )}
    </>
  );
}
