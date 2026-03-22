import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, User, LogOut, Library } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/books',     label: 'My Library', icon: <BookOpen size={16} /> },
    { to: '/profile',   label: 'Profile',    icon: <User size={16} /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--amber)] flex items-center justify-center">
            <Library size={16} className="text-white" />
          </div>
          <span className="font-semibold text-[var(--ink)] tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Biblios
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                ${location.pathname === to
                  ? 'bg-[var(--amber)]/10 text-[var(--amber-dark)]'
                  : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--cream)]'
                }`}
            >
              {icon}{label}
            </Link>
          ))}
        </nav>

        {/* User + logout */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-[var(--muted)]">
            {user?.username}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--muted)] hover:text-[var(--danger)] hover:bg-red-50 transition-all duration-150"
          >
            <LogOut size={15} />
            <span className="hidden sm:block">Sign out</span>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex border-t border-[var(--border)] bg-white">
        {links.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors
              ${location.pathname === to ? 'text-[var(--amber-dark)]' : 'text-[var(--muted)]'}`}
          >
            {icon}{label}
          </Link>
        ))}
      </div>
    </header>
  );
}
