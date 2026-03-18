import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
}

const Dashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '' });
  const token = localStorage.getItem('token');

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/books/?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search]);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/books/', newBook, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewBook({ title: '', author: '', isbn: '' });
      fetchBooks(); // Refresh list without page reload
    } catch (err) {
      alert("Error adding book. Ensure ISBN is unique.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBooks();
    } catch (err) {
      alert("Could not delete book.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Personal Library</h1>

        {/* Library Summary Section  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-600 text-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg opacity-80">Total Books</h3>
            <p className="text-4xl font-bold">{books.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg text-gray-500">Latest Addition</h3>
            <p className="text-xl font-semibold">{books[0]?.title || "No books yet"}</p>
          </div>
        </div>

        {/* Add Book Form [cite: 11] */}
        <form onSubmit={handleAddBook} className="bg-white p-6 rounded-xl shadow-sm mb-8 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700">Title*</label>
            <input type="text" value={newBook.title} required className="w-full p-2 border rounded mt-1"
              onChange={e => setNewBook({...newBook, title: e.target.value})} />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700">Author*</label>
            <input type="text" value={newBook.author} required className="w-full p-2 border rounded mt-1"
              onChange={e => setNewBook({...newBook, author: e.target.value})} />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700">ISBN (Optional)</label>
            <input type="text" value={newBook.isbn} className="w-full p-2 border rounded mt-1"
              onChange={e => setNewBook({...newBook, isbn: e.target.value})} />
          </div>
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
            Add Book
          </button>
        </form>

        {/* Search Functionality  */}
        <div className="mb-4">
          <input type="text" placeholder="Search by title or author..." 
            className="w-full md:w-1/3 p-2 border rounded-lg"
            onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Book List  */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 border-b">Title</th>
                <th className="p-4 border-b">Author</th>
                <th className="p-4 border-b">ISBN</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="p-4 border-b font-medium">{book.title}</td>
                  <td className="p-4 border-b text-gray-600">{book.author}</td>
                  <td className="p-4 border-b text-gray-500">{book.isbn || '-'}</td>
                  <td className="p-4 border-b">
                    <button onClick={() => handleDelete(book.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;