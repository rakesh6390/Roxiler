import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function AdminDashboard(){
  const [stats,setStats] = useState(null);
  const [stores,setStores] = useState([]);
  const [users,setUsers] = useState([]);
  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '', sortBy: 'name', order: 'ASC' });
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '', sortBy: 'name', order: 'ASC' });
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateStore, setShowCreateStore] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({ name: '', email: '', address: '', password: '', role: 'USER' });
  const [storeOwners, setStoreOwners] = useState([]);
  const [createStoreForm, setCreateStoreForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  useEffect(()=>{ load(); },[]);
  async function load(){
    setStats(await api.admin.dashboard());
    await loadStores();
    await loadUsers();
    setStoreOwners(await api.admin.listStoreOwners());
  }
  async function loadStores(){
    const params = new URLSearchParams();
    Object.entries(storeFilters).forEach(([k,v]) => { if(v) params.append(k,v); });
    setStores(await api.admin.listStores(params.toString()));
  }
  async function loadUsers(){
    const params = new URLSearchParams();
    Object.entries(userFilters).forEach(([k,v]) => { if(v) params.append(k,v); });
    setUsers(await api.admin.listUsers(params.toString()));
  }
  async function createUser(){
    try{
      await api.admin.createUser(createUserForm);
      alert('User created');
      setCreateUserForm({ name: '', email: '', address: '', password: '', role: 'USER' });
      setShowCreateUser(false);
      load();
    }catch(e){ alert(e.message); }
  }
  async function createStore(){
    if (!createStoreForm.owner_id) {
      alert('Please select a store owner');
      return;
    }
    try{
      await api.admin.createStore(createStoreForm);
      alert('Store created');
      setCreateStoreForm({ name: '', email: '', address: '', owner_id: '' });
      setShowCreateStore(false);
      load();
    }catch(e){ alert(e.message); }
  }
  return (<>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Admin Dashboard</h3>
      </div>
      {stats && <div className="bg-white p-4 rounded shadow">Total Users: <span className="font-semibold">{stats.totalUsers}</span> | Total Stores: <span className="font-semibold">{stats.totalStores}</span> | Total Ratings: <span className="font-semibold">{stats.totalRatings}</span></div>}
      <div className="flex gap-4">
        <button onClick={()=>setShowCreateUser(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Create User</button>
        <button onClick={()=>setShowCreateStore(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Create Store</button>
      </div>
      {showCreateUser && (
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-lg font-medium mb-4">Create User</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Name (20-60 characters)" value={createUserForm.name} onChange={e=>setCreateUserForm({...createUserForm,name:e.target.value})} minLength="20" maxLength="60" className="border px-3 py-2 rounded" />
            <input type="email" placeholder="Email (valid email format e.g. example@gmail.com)" value={createUserForm.email} onChange={e=>setCreateUserForm({...createUserForm,email:e.target.value})} className="border px-3 py-2 rounded" />
            <input placeholder="Address (max 400 characters)" value={createUserForm.address} onChange={e=>setCreateUserForm({...createUserForm,address:e.target.value})} maxLength="400" className="border px-3 py-2 rounded" />
            <input type="password" placeholder="Password (8-16 chars: atleast 1 uppercase + 1 special char)" value={createUserForm.password} onChange={e=>setCreateUserForm({...createUserForm,password:e.target.value})} pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$" className="border px-3 py-2 rounded" />
            <select value={createUserForm.role} onChange={e=>setCreateUserForm({...createUserForm,role:e.target.value})} className="border px-3 py-2 rounded">
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={createUser} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Create</button>
            <button onClick={()=>setShowCreateUser(false)} className="bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}
      {showCreateStore && (
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-lg font-medium mb-4">Create Store</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Name (20-60 characters)" value={createStoreForm.name} onChange={e=>setCreateStoreForm({...createStoreForm,name:e.target.value})} minLength="20" maxLength="60" required className="border px-3 py-2 rounded" />
            <input type="email" placeholder="Email (valid email format e.g. example@gmail.com)" value={createStoreForm.email} onChange={e=>setCreateStoreForm({...createStoreForm,email:e.target.value})} className="border px-3 py-2 rounded" />
            <input placeholder="Address (max 400 characters)" value={createStoreForm.address} onChange={e=>setCreateStoreForm({...createStoreForm,address:e.target.value})} maxLength="400" className="border px-3 py-2 rounded" />
            <select value={createStoreForm.owner_id} onChange={e=>setCreateStoreForm({...createStoreForm,owner_id:e.target.value})} required className="border px-3 py-2 rounded">
              <option value="">-- Select Store Owner --</option>
              {storeOwners.map(owner => (
                <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={createStore} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Create</button>
            <button onClick={()=>setShowCreateStore(false)} className="bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}
      <div>
        <h4 className="text-lg font-medium mb-2">Stores</h4>
        <div className="bg-white p-4 rounded shadow mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input placeholder="Filter by name" value={storeFilters.name} onChange={e=>setStoreFilters({...storeFilters,name:e.target.value})} className="border px-3 py-2 rounded" />
            <input placeholder="Filter by email" value={storeFilters.email} onChange={e=>setStoreFilters({...storeFilters,email:e.target.value})} className="border px-3 py-2 rounded" />
            <input placeholder="Filter by address" value={storeFilters.address} onChange={e=>setStoreFilters({...storeFilters,address:e.target.value})} className="border px-3 py-2 rounded" />
            <div className="flex gap-2">
              <select value={storeFilters.sortBy} onChange={e=>setStoreFilters({...storeFilters,sortBy:e.target.value})} className="border px-3 py-2 rounded">
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
                <option value="address">Sort by Address</option>
              </select>
              <select value={storeFilters.order} onChange={e=>setStoreFilters({...storeFilters,order:e.target.value})} className="border px-3 py-2 rounded">
                <option value="ASC">Ascending</option>
                <option value="DESC">Descending</option>
              </select>
              <button onClick={loadStores} className="bg-blue-600 text-white px-3 py-2 rounded">Filter</button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50"><tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Address</th>
              <th className="px-4 py-2 text-left text-sm font-medium">AvgRating</th>
            </tr></thead>
            <tbody className="divide-y">
              {stores.map(s=> (
                <tr key={s.id} className="bg-white">
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.email}</td>
                  <td className="px-4 py-2">{s.address}</td>
                  <td className="px-4 py-2">{s.overallRating ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h4 className="text-lg font-medium mb-2">Users</h4>
        <div className="bg-white p-4 rounded shadow mb-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <input placeholder="Filter by name" value={userFilters.name} onChange={e=>setUserFilters({...userFilters,name:e.target.value})} className="border px-3 py-2 rounded" />
            <input placeholder="Filter by email" value={userFilters.email} onChange={e=>setUserFilters({...userFilters,email:e.target.value})} className="border px-3 py-2 rounded" />
            <input placeholder="Filter by address" value={userFilters.address} onChange={e=>setUserFilters({...userFilters,address:e.target.value})} className="border px-3 py-2 rounded" />
            <select value={userFilters.role} onChange={e=>setUserFilters({...userFilters,role:e.target.value})} className="border px-3 py-2 rounded">
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
            <div className="flex gap-2">
              <select value={userFilters.sortBy} onChange={e=>setUserFilters({...userFilters,sortBy:e.target.value})} className="border px-3 py-2 rounded">
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
                <option value="address">Sort by Address</option>
                <option value="role">Sort by Role</option>
              </select>
              <select value={userFilters.order} onChange={e=>setUserFilters({...userFilters,order:e.target.value})} className="border px-3 py-2 rounded">
                <option value="ASC">Ascending</option>
                <option value="DESC">Descending</option>
              </select>
              <button onClick={loadUsers} className="bg-blue-600 text-white px-3 py-2 rounded">Filter</button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50"><tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Address</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Role</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
            </tr></thead>
            <tbody className="divide-y">
              {users.map(u=> (
                <tr key={u.id} className="bg-white">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.address}</td>
                  <td className="px-4 py-2">{u.role}</td>
                  <td className="px-4 py-2"><button onClick={async () => { const details = await api.admin.userDetails(u.id); alert(JSON.stringify(details, null, 2)); }} className="bg-blue-600 text-white px-2 py-1 rounded text-sm">Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </>);
}
