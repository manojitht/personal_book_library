import { useState, useEffect, useCallback } from 'react';
import { booksApi } from '../api/books';
import type { Book, BookCreate } from '../types';
import { BookCard } from '../components/BookCard';
import { BookForm } from '../components/BookForm';
import { ReviewsPanel } from '../components/ReviewsPanel';
import { Button, Modal, EmptyState, Skeleton } from '../components/ui';
import { Plus, Search, BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { reviewsApi } from '../api/reviews';

const PAGE_SIZE = 12;

export function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [avgRatings, setAvgRatings] = useState<Record<number, number | null>>({});

  // Modals
  const [addOpen, setAddOpen]         = useState(false);
  const [editBook, setEditBook]       = useState<Book | null>(null);
  const [deleteBook, setDeleteBook]   = useState<Book | null>(null);
  const [reviewBook, setReviewBook]   = useState<Book | null>(null);
  const [deleting, setDeleting]       = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * PAGE_SIZE;
      const data = await booksApi.list({ skip, limit: PAGE_SIZE + 1, search: debouncedSearch || undefined });
      setHasMore(data.length > PAGE_SIZE);
      setBooks(data.slice(0, PAGE_SIZE));
    } catch {
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { load(); }, [load]);

  // Load avg ratings for visible books
  useEffect(() => {
    books.forEach(async (b) => {
      if (avgRatings[b.id] === undefined) {
        try {
          const { average_rating } = await reviewsApi.list(b.id);
          setAvgRatings((p) => ({ ...p, [b.id]: average_rating }));
        } catch {
          setAvgRatings((p) => ({ ...p, [b.id]: null }));
        }
      }
    });
  }, [books]);

  const handleCreate = async (data: BookCreate) => {
    await booksApi.create(data);
    toast.success('Book added!');
    setAddOpen(false);
    load();
  };

  const handleUpdate = async (data: BookCreate) => {
    if (!editBook) return;
    await booksApi.update(editBook.id, data);
    toast.success('Book updated!');
    setEditBook(null);
    load();
  };

  const handleDelete = async () => {
    if (!deleteBook) return;
    setDeleting(true);
    try {
      await booksApi.delete(deleteBook.id);
      toast.success('Book removed');
      setDeleteBook(null);
      load();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--ink)]">My Library</h1>
          <p className="text-[var(--muted)] text-sm mt-1">
            {loading ? '…' : `${books.length > 0 ? `${(page - 1) * PAGE_SIZE + 1}–${(page - 1) * PAGE_SIZE + books.length}` : '0'} books`}
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="self-start sm:self-auto">
          <Plus size={16} /> Add Book
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        <input
          type="text"
          placeholder="Search by title or author…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-10 py-3 rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] text-sm
            placeholder:text-[var(--muted)] outline-none focus:border-[var(--amber)] focus:ring-2 focus:ring-[var(--amber)]/20 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)]"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-[var(--border)] overflow-hidden">
              <Skeleton className="h-44 rounded-none" />
              <div className="p-4 flex flex-col gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <EmptyState
          icon={<BookOpen />}
          title={debouncedSearch ? 'No books found' : 'Your library is empty'}
          description={debouncedSearch ? `No results for "${debouncedSearch}"` : 'Add your first book to get started'}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              avgRating={avgRatings[book.id]}
              onEdit={setEditBook}
              onDelete={setDeleteBook}
              onViewReviews={setReviewBook}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {(page > 1 || hasMore) && !loading && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <Button variant="secondary" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
            <ChevronLeft size={16} /> Previous
          </Button>
          <span className="text-sm text-[var(--muted)] px-3">Page {page}</span>
          <Button variant="secondary" onClick={() => setPage((p) => p + 1)} disabled={!hasMore}>
            Next <ChevronRight size={16} />
          </Button>
        </div>
      )}

      {/* Add Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Book">
        <BookForm onSubmit={handleCreate} onCancel={() => setAddOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editBook} onClose={() => setEditBook(null)} title="Edit Book">
        {editBook && (
          <BookForm initial={editBook} onSubmit={handleUpdate} onCancel={() => setEditBook(null)} />
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteBook} onClose={() => setDeleteBook(null)} title="Remove Book">
        <p className="text-sm text-[var(--muted)] mb-6">
          Are you sure you want to remove{' '}
          <span className="font-semibold text-[var(--ink)]">"{deleteBook?.title}"</span> from your library?
          This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="danger" loading={deleting} onClick={handleDelete} className="flex-1">
            Remove
          </Button>
          <Button variant="secondary" onClick={() => setDeleteBook(null)} className="flex-1">
            Cancel
          </Button>
        </div>
      </Modal>

      {/* Reviews Modal */}
      <Modal open={!!reviewBook} onClose={() => setReviewBook(null)} title={reviewBook?.title ?? ''}>
        {reviewBook && <ReviewsPanel bookId={reviewBook.id} bookTitle={reviewBook.title} />}
      </Modal>
    </div>
  );
}
