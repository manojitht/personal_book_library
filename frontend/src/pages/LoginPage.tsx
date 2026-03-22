import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/ui';
import { Library, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<typeof form>({ username: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = { username: '', password: '' };
    if (!form.username.trim()) errs.username = 'Username is required';
    if (!form.password)        errs.password = 'Password is required';
    if (errs.username || errs.password) { setErrors(errs); return; }

    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel – decorative */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] bg-[var(--ink)] p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, var(--amber) 0, var(--amber) 1px, transparent 0, transparent 50%)`,
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--amber)] flex items-center justify-center">
            <Library size={20} className="text-white" />
          </div>
          <span className="text-white text-xl font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
            Biblios
          </span>
        </div>
        <div className="relative">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Your personal library, beautifully organised.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            Track every book you've read, add reviews, and keep your reading life in one place.
          </p>
        </div>
        <div className="relative flex items-center gap-3">
          <BookOpen size={16} className="text-white/30" />
          <span className="text-white/30 text-xs">Personal Book Library</span>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm fade-up">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-[var(--amber)] flex items-center justify-center">
              <Library size={16} className="text-white" />
            </div>
            <span className="font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>Biblios</span>
          </div>

          <h1 className="text-3xl font-bold text-[var(--ink)] mb-2">Welcome back</h1>
          <p className="text-[var(--muted)] text-sm mb-8">Sign in to your library</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Username"
              placeholder="your_username"
              value={form.username}
              onChange={(e) => { setForm((p) => ({ ...p, username: e.target.value })); setErrors((p) => ({ ...p, username: '' })); }}
              error={errors.username}
              autoFocus
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => { setForm((p) => ({ ...p, password: e.target.value })); setErrors((p) => ({ ...p, password: '' })); }}
              error={errors.password}
            />
            <Button type="submit" loading={loading} className="w-full mt-2">
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--muted)] mt-6">
            No account?{' '}
            <Link to="/signup" className="text-[var(--amber-dark)] font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
