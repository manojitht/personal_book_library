import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth';
import { Button, Input, Card } from '../components/ui';
import { User, Mail, Shield, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ username: user?.username ?? '', email: user?.email ?? '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.username.trim() || form.username.length < 3) e.username = 'At least 3 characters';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    // Only send changed fields
    const payload: { username?: string; email?: string } = {};
    if (form.username !== user?.username) payload.username = form.username;
    if (form.email !== user?.email) payload.email = form.email;
    if (!Object.keys(payload).length) { toast('No changes to save'); return; }

    setLoading(true);
    try {
      await authApi.updateMe(payload);
      await refreshUser();
      setSaved(true);
      toast.success('Profile updated!');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
    setSaved(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 fade-up">
      <h1 className="text-3xl font-bold text-[var(--ink)] mb-2">Profile</h1>
      <p className="text-[var(--muted)] text-sm mb-10">Manage your account information</p>

      {/* Avatar / identity */}
      <Card className="p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-[var(--amber)] flex items-center justify-center text-white text-2xl font-bold"
          style={{ fontFamily: 'Playfair Display, serif' }}>
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-[var(--ink)] text-lg">{user?.username}</p>
          <p className="text-sm text-[var(--muted)]">{user?.email}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className={`w-2 h-2 rounded-full ${user?.is_active ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'}`} />
            <span className="text-xs text-[var(--muted)]">{user?.is_active ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
      </Card>

      {/* Edit form */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-5">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Input
              label="Username"
              value={form.username}
              onChange={set('username')}
              error={errors.username}
            />
            <User size={14} className="absolute right-3 top-9 text-[var(--muted)]" />
          </div>
          <div className="relative">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={set('email')}
              error={errors.email}
            />
            <Mail size={14} className="absolute right-3 top-9 text-[var(--muted)]" />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={loading}>
              {saved ? (
                <span className="flex items-center gap-2">
                  <CheckCircle size={14} /> Saved
                </span>
              ) : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setForm({ username: user?.username ?? '', email: user?.email ?? '' })}
            >
              Reset
            </Button>
          </div>
        </form>
      </Card>

      {/* Account info */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-4">Account Info</h2>
        <div className="flex flex-col gap-3">
          <InfoRow icon={<User size={14} />} label="User ID" value={`#${user?.id}`} />
          <InfoRow icon={<Shield size={14} />} label="Account Status" value={user?.is_active ? 'Active' : 'Inactive'} />
          <InfoRow icon={<Mail size={14} />} label="Email" value={user?.email ?? ''} />
        </div>
        <div className="mt-5 p-3 bg-[var(--cream)] rounded-lg border border-[var(--border)]">
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            <strong className="text-[var(--ink)]">Note:</strong> To change your password, please contact support or use the password reset flow.
          </p>
        </div>
      </Card>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[var(--cream)] last:border-0">
      <div className="flex items-center gap-2 text-[var(--muted)]">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-medium text-[var(--ink)]">{value}</span>
    </div>
  );
}
