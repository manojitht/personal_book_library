import { useState, useEffect } from 'react';
import { reviewsApi } from '../api/reviews';
import type { Review } from '../types';
import { Button, StarRating, Textarea, Skeleton } from './ui';
import toast from 'react-hot-toast';
import { MessageSquare } from 'lucide-react';

export function ReviewsPanel({ bookId, bookTitle }: { bookId: number; bookTitle: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await reviewsApi.list(bookId);
      setReviews(data.reviews);
      setAvgRating(data.average_rating);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [bookId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await reviewsApi.create(bookId, rating, comment.trim() || undefined);
      toast.success('Review added!');
      setComment('');
      setRating(5);
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? 'Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Average */}
      {avgRating !== null && (
        <div className="flex items-center gap-3 p-4 bg-[var(--cream)] rounded-xl">
          <span className="text-3xl font-bold text-[var(--amber)]" style={{ fontFamily: 'Playfair Display, serif' }}>
            {avgRating.toFixed(1)}
          </span>
          <div>
            <StarRating value={Math.round(avgRating)} readonly />
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} for "{bookTitle}"
            </p>
          </div>
        </div>
      )}

      {/* Add review form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border border-[var(--border)] rounded-xl bg-white">
        <p className="text-sm font-medium text-[var(--ink)]">Write a review</p>
        <StarRating value={rating} onChange={setRating} />
        <Textarea
          placeholder="Share your thoughts... (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
        <Button type="submit" loading={submitting} className="self-end">
          Submit Review
        </Button>
      </form>

      {/* Reviews list */}
      <div className="flex flex-col gap-3">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 p-4 border border-[var(--border)] rounded-xl">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-[var(--muted)]">
            <MessageSquare size={28} />
            <p className="text-sm">No reviews yet. Be the first!</p>
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="p-4 border border-[var(--border)] rounded-xl bg-white">
              <div className="flex items-center gap-2 mb-2">
                <StarRating value={r.rating} readonly />
                <span className="text-xs text-[var(--muted)]">User #{r.user_id}</span>
              </div>
              {r.comment && (
                <p className="text-sm text-[var(--ink)] leading-relaxed">{r.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
