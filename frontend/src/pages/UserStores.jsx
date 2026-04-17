import React, { useEffect, useState } from 'react';
import api from '../api';

export default function UserStores(){
  const [stores, setStores] = useState([]);
  const [storeFilters, setStoreFilters] = useState({ name: '', address: '' });
  const [rating, setRating] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [errors, setErrors] = useState({});
  
  const load = async () => {
    let queryString = '';
    if (storeFilters.name) queryString += `name=${encodeURIComponent(storeFilters.name)}`;
    if (storeFilters.address) {
      if (queryString) queryString += '&';
      queryString += `address=${encodeURIComponent(storeFilters.address)}`;
    }
    const res = await api.stores.list(queryString);
    setStores(res);
    // initialize rating with existing user ratings
    const initialRating = {};
    const initialSubmitted = {};
    res.forEach(s => {
      if (s.userRating) {
        initialRating[s.id] = s.userRating;
        initialSubmitted[s.id] = true;
      }
    });
    setRating(initialRating);
    setSubmitted(initialSubmitted);
    // Clear the filter fields after search
    setStoreFilters({ name: '', address: '' });
  };
  useEffect(()=>{ load(); }, []);
  const validateRating = (val) => {
    const num = Number(val);
    if (!val || isNaN(num) || num < 1 || num > 5) return 'Rating must be a number between 1 and 5';
    return null;
  };
  const handleRatingChange = (id, val) => {
    setRating({...rating, [id]: val});
    const err = validateRating(val);
    setErrors({...errors, [id]: err});
  };
  const submit = async (id) => {
    const err = validateRating(rating[id]);
    if (err) {
      setErrors({...errors, [id]: err});
      return;
    }
    try{
      await api.stores.submitRating(id, { rating: Number(rating[id]) });
      setSubmitted({...submitted, [id]: true});
      load(); // reload to update overall rating
    }catch(e){ alert(e.message || JSON.stringify(e)); }
  };
  const update = async (id) => {
    const err = validateRating(rating[id]);
    if (err) {
      setErrors({...errors, [id]: err});
      return;
    }
    try{
      await api.stores.updateRating(id, { rating: Number(rating[id]) });
      load(); // reload to update overall rating
    }catch(e){ alert(e.message || JSON.stringify(e)); }
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold">Stores</h3>
        <div className="flex items-center gap-2">
          <input placeholder="Search name" value={storeFilters.name} onChange={e=>setStoreFilters({...storeFilters,name:e.target.value})} className="border px-3 py-2 rounded" />
          <input placeholder="Search address" value={storeFilters.address} onChange={e=>setStoreFilters({...storeFilters,address:e.target.value})} className="border px-3 py-2 rounded" />
          <button onClick={()=>load()} className="bg-blue-600 text-white px-3 py-2 rounded">Search</button>
        </div>
      </div>

      <div className="grid gap-4">
        {stores.map(s => (
          <div key={s.id} className="bg-white p-4 rounded shadow flex items-center justify-between">
            <div>
              <div className="text-lg font-medium">{s.name}</div>
              <div className="text-sm text-gray-600">{s.address}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm">
                Overall: <span className="font-semibold">{s.overallRating ?? '-'}</span><br/>
                Your Rating: <span className="font-semibold">{s.userRating ?? '-'}</span>
              </div>
              <div className="flex flex-col gap-2">
                <input value={rating[s.id]||''} onChange={e=>handleRatingChange(s.id, e.target.value)} placeholder="1-5" className="w-20 border px-2 py-1 rounded" />
                {errors[s.id] && <div className="text-red-500 text-xs">{errors[s.id]}</div>}
                <div className="flex gap-1">
                  <button onClick={()=>submit(s.id)} disabled={submitted[s.id] || !!errors[s.id] || !rating[s.id]} className="bg-green-600 text-white px-2 py-1 rounded text-sm disabled:opacity-50">
                    {submitted[s.id] ? 'Rating Submitted' : 'Submit'}
                  </button>
                  <button onClick={()=>update(s.id)} disabled={!!errors[s.id] || !rating[s.id]} className="bg-yellow-500 text-white px-2 py-1 rounded text-sm disabled:opacity-50">Update</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
