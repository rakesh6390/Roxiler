import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function OwnerDashboard(){
  const [data, setData] = useState([]);
  useEffect(()=>{ api.owner.dashboard().then(setData).catch(e=>alert(JSON.stringify(e))); },[]);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Owner Dashboard</h3>
      </div>
      {data.map(s => (
        <div key={s.storeId} className="bg-white p-4 rounded shadow">
          <h4 className="text-lg font-medium">{s.name} — AvgRating: {s.averageRating ?? '-'}</h4>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">{s.ratingsByUsers.map(u=>(<li key={u.userId}>{u.name} ({u.email}) — {u.rating}</li>))}</ul>
        </div>
      ))}
    </div>
  );
}
