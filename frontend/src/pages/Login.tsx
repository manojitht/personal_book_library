import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const { data } = await axios.post('http://localhost:8000/auth/login', formData);
      localStorage.setItem('token', data.access_token);
      window.location.href = '/dashboard';
    } catch (err) {
      alert("Invalid credentials. Please try again."); // [cite: 9]
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in to Library</h2>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input 
            type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Username" onChange={(e) => setUsername(e.target.value)} 
          />
          <input 
            type="password" required className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Password" onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;