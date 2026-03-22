import { useState } from 'react';
import { Edit2, Trash2, BookOpen, Star } from 'lucide-react';
import type { Book } from '../types';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onViewReviews: (book: Book) => void;
  avgRating?: number | null;
}

export function BookCard({ book, onEdit, onDelete, onViewReviews, avgRating }: BookCardProps) {
  const [imgError, setImgError] = useState(false);

  const coverColors = ['#e8d5b7', '#d4c5e2', '#b7d5e8', '#d5e8b7', '#e8b7c5'];
  const colorIndex = book.id % coverColors.length;
  const fallbackColor = coverColors[colorIndex];

  return (
    <div className="group bg-white rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 fade-up flex flex-col">
      {/* Cover */}
      <div className="relative h-44 overflow-hidden">
        {book.cover_image_url && !imgError ? (
          <img
            src={book.cover_image_url}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: fallbackColor }}
          >
            <BookOpen size={32} className="text-white/70" />
            <span className="text-xs text-white/60 font-medium px-4 text-center line-clamp-2">
              {book.title}
            </span>
          </div>
        )}

        {/* Actions overlay */}
        <div className="absolute inset-0 bg-[var(--ink)]/0 group-hover:bg-[var(--ink)]/20 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onEdit(book)}
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[var(--ink)] hover:bg-[var(--amber)] hover:text-white transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(book)}
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[var(--ink)] hover:bg-[var(--danger)] hover:text-white transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-[var(--ink)] text-sm line-clamp-2 leading-snug mb-1">
          {book.title}
        </h3>
        <p className="text-xs text-[var(--muted)] mb-2">{book.author}</p>

        {book.publication_date && (
          <p className="text-xs text-[var(--muted)] mb-2">
            {new Date(book.publication_date).getFullYear()}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-[var(--cream)] flex items-center justify-between">
          <button
            onClick={() => onViewReviews(book)}
            className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--amber-dark)] transition-colors"
          >
            <Star size={12} className={avgRating ? 'fill-[var(--amber)] text-[var(--amber)]' : ''} />
            {avgRating ? avgRating.toFixed(1) : 'Reviews'}
          </button>
          {book.isbn && (
            <span className="text-xs text-[var(--muted)] font-mono bg-[var(--cream)] px-2 py-0.5 rounded">
              {book.isbn}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
