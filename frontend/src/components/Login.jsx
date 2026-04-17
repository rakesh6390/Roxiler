import React, { useState } from 'react';
import api from '../api';

export default function Login({ onLogin }){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const submit = async e => {
    e.preventDefault(); setErr(null);
    try{
      const res = await api.auth.login({ email, password });
      onLogin(res);
    }catch(e){ setErr(e.body?.message || JSON.stringify(e.body) || 'Login failed'); }
  };
  return (
    <div className="max-w-md mx-auto bg-white shadow rounded p-6">
      <h3 className="text-xl font-semibold mb-4">Login</h3>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="example@domain.com" required className="w-full border px-3 py-2 rounded" />
          <p className="text-xs text-gray-500 mt-1">Must follow standard email format</p>
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="8-16 chars: 1 uppercase, 1 special char (@!#$%^&*)" required className="w-full border px-3 py-2 rounded" />
          <p className="text-xs text-gray-500 mt-1">8-16 characters, at least 1 uppercase letter & 1 special character</p>
        </div>
        <div className="flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Login</button>
        </div>
      </form>
    </div>
  );
}
