import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      alert("Signup failed. Check your details.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Username" className="w-full p-2 border rounded" 
            onChange={e => setFormData({...formData, username: e.target.value})} required />
          <input type="email" placeholder="Email" className="w-full p-2 border rounded" 
            onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Password" className="w-full p-2 border rounded" 
            onChange={e => setFormData({...formData, password: e.target.value})} required />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Sign Up</button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;