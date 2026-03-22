import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { booksApi } from '../api/books';
import { useAuth } from '../context/AuthContext';
import type { DashboardData, Book } from '../types';
import { Skeleton, Card } from '../components/ui';
import { BookOpen, Plus, TrendingUp, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    booksApi.getDashboard()
      .then(setData)
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 fade-up">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[var(--muted)] text-sm mb-1">{greeting},</p>
        <h1 className="text-4xl font-bold text-[var(--ink)]">{user?.username}</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <StatCard
          loading={loading}
          icon={<BookOpen size={20} className="text-[var(--amber)]" />}
          label="Total Books"
          value={data?.total_books ?? 0}
          accent
        />
        <StatCard
          loading={loading}
          icon={<TrendingUp size={20} className="text-[var(--success)]" />}
          label="Recently Added"
          value={data?.recent_books.length ?? 0}
        />
        <Card className="flex flex-col justify-between p-5 bg-[var(--ink)] border-[var(--ink)]">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mb-4">
            <Plus size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white/50 text-xs mb-1">Quick action</p>
            <Link
              to="/books"
              className="text-white font-semibold text-sm hover:text-[var(--amber-light)] transition-colors"
            >
              Add a new book →
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent books */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-[var(--ink)] flex items-center gap-2">
            <Clock size={18} className="text-[var(--muted)]" />
            Recent Additions
          </h2>
          <Link to="/books" className="text-sm text-[var(--amber-dark)] hover:underline font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[var(--border)] p-4 flex gap-3">
                <Skeleton className="w-12 h-16 flex-shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.recent_books.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[var(--border)] rounded-2xl">
            <BookOpen size={36} className="mx-auto text-[var(--border)] mb-3" />
            <p className="text-[var(--muted)] text-sm">Your library is empty.</p>
            <Link to="/books" className="text-[var(--amber-dark)] text-sm font-medium hover:underline mt-1 inline-block">
              Add your first book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.recent_books.map((book) => (
              <RecentBookRow key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ loading, icon, label, value, accent }: {
  loading: boolean; icon: React.ReactNode; label: string; value: number; accent?: boolean;
}) {
  return (
    <Card className={`p-5 ${accent ? 'border-[var(--amber)]/30 bg-[var(--amber)]/5' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-9 h-9 rounded-xl bg-[var(--cream)] flex items-center justify-center">{icon}</div>
      </div>
      {loading ? (
        <Skeleton className="h-8 w-16 mb-1" />
      ) : (
        <p className="text-3xl font-bold text-[var(--ink)] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
          {value}
        </p>
      )}
      <p className="text-xs text-[var(--muted)]">{label}</p>
    </Card>
  );
}

function RecentBookRow({ book }: { book: Book }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] p-4 flex gap-3 hover:shadow-sm transition-shadow">
      <div className="w-12 h-16 rounded-lg bg-[var(--cream)] flex items-center justify-center flex-shrink-0 overflow-hidden">
        {book.cover_image_url ? (
          <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <BookOpen size={18} className="text-[var(--muted)]" />
        )}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-sm text-[var(--ink)] line-clamp-2 leading-snug">{book.title}</p>
        <p className="text-xs text-[var(--muted)] mt-1">{book.author}</p>
      </div>
    </div>
  );
}
