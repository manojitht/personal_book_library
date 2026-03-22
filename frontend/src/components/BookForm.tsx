import { useState, useEffect } from 'react';
import type { Book, BookCreate } from '../types';
import { Button, Input } from './ui';

interface BookFormProps {
  initial?: Book;
  onSubmit: (data: BookCreate) => Promise<void>;
  onCancel: () => void;
}

export function BookForm({ initial, onSubmit, onCancel }: BookFormProps) {
  const [form, setForm] = useState<BookCreate>({
    title: '',
    author: '',
    publication_date: '',
    isbn: '',
    cover_image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<BookCreate>>({});

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        author: initial.author,
        publication_date: initial.publication_date ?? '',
        isbn: initial.isbn ?? '',
        cover_image_url: initial.cover_image_url ?? '',
      });
    }
  }, [initial]);

  const validate = () => {
    const e: Partial<BookCreate> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.author.trim()) e.author = 'Author is required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      // Strip empty strings to keep payload clean
      const payload: BookCreate = {
        title: form.title.trim(),
        author: form.author.trim(),
        ...(form.publication_date ? { publication_date: form.publication_date } : {}),
        ...(form.isbn?.trim() ? { isbn: form.isbn.trim() } : {}),
        ...(form.cover_image_url?.trim() ? { cover_image_url: form.cover_image_url.trim() } : {}),
      };
      await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  };

  const set = (field: keyof BookCreate) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Title *"
        placeholder="e.g. The Great Gatsby"
        value={form.title}
        onChange={set('title')}
        error={errors.title}
      />
      <Input
        label="Author *"
        placeholder="e.g. F. Scott Fitzgerald"
        value={form.author}
        onChange={set('author')}
        error={errors.author}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Publication Date"
          type="date"
          value={form.publication_date}
          onChange={set('publication_date')}
        />
        <Input
          label="ISBN"
          placeholder="978-3-16-148410-0"
          value={form.isbn}
          onChange={set('isbn')}
        />
      </div>
      <Input
        label="Cover Image URL"
        placeholder="https://..."
        value={form.cover_image_url}
        onChange={set('cover_image_url')}
      />
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading} className="flex-1">
          {initial ? 'Save Changes' : 'Add Book'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
