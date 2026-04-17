import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import UpdatePassword from './components/UpdatePassword';
import AdminDashboard from './pages/AdminDashboard';
import UserStores from './pages/UserStores';
import OwnerDashboard from './pages/OwnerDashboard';

function Protected({ children, role }){
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  if (!token) return <div>Please <Link to="/login">login</Link></div>;
  if (role && role !== userRole) return <div>Access denied</div>;
  return children;
}

export default function App(){
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [showUserProfile, setShowUserProfile] = useState(false);
  const navigate = useNavigate();
  useEffect(()=>{
    const r = localStorage.getItem('role');
    setRole(r);
  },[]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserProfile && e.target.closest('.user-profile-menu') === null) {
        setShowUserProfile(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserProfile]);
  const logout = ()=>{ localStorage.removeItem('token'); localStorage.removeItem('role'); localStorage.removeItem('name'); localStorage.removeItem('email'); setRole(null); navigate('/login'); };
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-blue-600 text-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-4">
            {role !== 'ADMIN' && role !== 'STORE_OWNER' && <Link to="/" className="text-white hover:text-blue-200 font-medium">Home</Link>}
            {role === 'ADMIN' && <Link to="/admin" className="text-white hover:text-blue-200 font-medium">Admin Dashboard</Link>}
            {role === 'STORE_OWNER' && <Link to="/owner" className="text-white hover:text-blue-200 font-medium">Owner Dashboard</Link>}
          </nav>
          <div className="flex items-center gap-4">
            {!role && <Link to="/login" className="text-white hover:text-blue-200 hover:underline">Login</Link>}
            {!role && <Link to="/signup" className="text-white hover:text-blue-200 hover:underline">Signup</Link>}
            {role && <Link to="/update-password" className="text-white hover:text-blue-200 hover:underline">Update Password</Link>}
            {role && (
              <div className="relative user-profile-menu">
                <button onClick={() => setShowUserProfile(!showUserProfile)} className="flex items-center justify-center bg-white text-blue-600 rounded-full w-10 h-10 hover:bg-gray-100">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </button>
                {showUserProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg text-gray-900 z-50">
                    <div className="p-4 border-b">
                      <div className="text-sm font-semibold">Name</div>
                      <div className="text-sm text-gray-700 break-words">{localStorage.getItem('name') || '-'}</div>
                    </div>
                    <div className="p-4 border-b">
                      <div className="text-sm font-semibold">Email</div>
                      <div className="text-sm text-gray-700 break-words">{localStorage.getItem('email') || '-'}</div>
                    </div>
                    <div className="p-4 border-b">
                      <div className="text-sm font-semibold">Role</div>
                      <div className="text-sm text-gray-700">{localStorage.getItem('role') || '-'}</div>
                    </div>
                    <div className="p-2">
                      <button onClick={logout} className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm">Logout</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6">
      <Routes>
        <Route path="/login" element={<Login onLogin={(r)=>{ localStorage.setItem('token', r.token); localStorage.setItem('role', r.role); localStorage.setItem('name', r.name); localStorage.setItem('email', r.email); setRole(r.role); navigate(r.role === 'ADMIN' ? '/admin' : r.role === 'STORE_OWNER' ? '/owner' : '/'); }} />} />
        <Route path="/signup" element={<Signup onSignup={(r)=>{ localStorage.setItem('token', r.token); localStorage.setItem('role', r.role); localStorage.setItem('name', r.name); localStorage.setItem('email', r.email); setRole(r.role); navigate(r.role === 'ADMIN' ? '/admin' : r.role === 'STORE_OWNER' ? '/owner' : '/'); }} />} />
        <Route path="/update-password" element={<Protected><UpdatePassword /></Protected>} />
        <Route path="/admin" element={<Protected role={'ADMIN'}><AdminDashboard /></Protected>} />
        <Route path="/owner" element={<Protected role={'STORE_OWNER'}><OwnerDashboard /></Protected>} />
        <Route path="/" element={<Protected><UserStores /></Protected>} />
      </Routes>
      </main>
    </div>
  );
}
