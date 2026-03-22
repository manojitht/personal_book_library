import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { Button, Input } from '../components/ui';
import { Library } from 'lucide-react';
import toast from 'react-hot-toast';

export function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.username.trim() || form.username.length < 3) e.username = 'At least 3 characters';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.password.length < 8) e.password = 'At least 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await authApi.signup(form.username, form.email, form.password);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] bg-[var(--amber)] p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, var(--ink) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Library size={20} className="text-white" />
          </div>
          <span className="text-white text-xl font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>Biblios</span>
        </div>
        <div className="relative">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Start building your collection today.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Join readers who use Biblios to track, review, and organise their personal libraries.
          </p>
        </div>
        <div className="relative flex gap-6">
          {['Track Books', 'Write Reviews', 'Search & Filter'].map((f) => (
            <div key={f} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <span className="text-white/60 text-xs">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm fade-up">
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-[var(--amber)] flex items-center justify-center">
              <Library size={16} className="text-white" />
            </div>
            <span className="font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>Biblios</span>
          </div>

          <h1 className="text-3xl font-bold text-[var(--ink)] mb-2">Create account</h1>
          <p className="text-[var(--muted)] text-sm mb-8">Start your personal library</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Username" placeholder="john_doe" value={form.username} onChange={set('username')} error={errors.username} autoFocus />
            <Input label="Email" type="email" placeholder="john@example.com" value={form.email} onChange={set('email')} error={errors.email} />
            <Input label="Password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={set('password')} error={errors.password} />
            <Input label="Confirm Password" type="password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />
            <Button type="submit" loading={loading} className="w-full mt-2">
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--muted)] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--amber-dark)] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
