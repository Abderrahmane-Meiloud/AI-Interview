import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  RobotIcon,
  LogoutIcon,
  DashboardIcon,
  FileTextIcon,
  TargetIcon,
  ClipboardListIcon,
  TrendingUpIcon,
  MenuIcon,
} from '../components/Icons';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { to: '/resume', label: 'Resume', icon: FileTextIcon },
  { to: '/job-profile', label: 'Job Profile', icon: TargetIcon },
  { to: '/history', label: 'History', icon: ClipboardListIcon },
  { to: '/progress', label: 'Progress', icon: TrendingUpIcon },
];

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="min-h-screen flex bg-app">
      {/* Sidebar for Desktop */}
      <aside className="w-64 bg-white border-r border-line fixed h-full hidden md:flex flex-col z-20">
        <div className="h-[72px] px-5 border-b border-line flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white flex-shrink-0">
            <RobotIcon className="w-[18px] h-[18px]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-ink leading-tight truncate">Interview Coach</h1>
            <p className="text-[11px] font-medium text-primary-600 leading-tight">AI Powered Prep</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10.5px] font-semibold uppercase tracking-wider text-ink-faint">
            Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-ink-soft font-medium hover:bg-app hover:text-ink'
                  }`
                }
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.75} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-line">
          <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-semibold text-[11px] flex-shrink-0">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink truncate leading-tight">{user?.name || 'Candidate'}</p>
              <p className="text-xs text-ink-faint truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-ink-soft hover:bg-app hover:text-danger-600 rounded-lg transition-colors"
          >
            <LogoutIcon className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-line px-4 h-14 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2.5 min-w-0">
            <div ref={menuRef} className="relative flex-shrink-0">
              <button
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Open navigation menu"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="w-8 h-8 -ml-1 rounded-lg flex items-center justify-center text-ink-soft hover:bg-app hover:text-ink transition-colors"
              >
                <MenuIcon className="w-5 h-5" />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-[calc(100%+0.5rem)] w-56 max-w-[calc(100vw-2rem)] bg-white rounded-card shadow-card border border-line py-1.5 z-30"
                >
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            isActive
                              ? 'bg-primary-50 text-primary-700 font-semibold'
                              : 'text-ink-soft font-medium hover:bg-app hover:text-ink'
                          }`
                        }
                      >
                        <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.75} />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white flex-shrink-0">
              <RobotIcon className="w-4 h-4" />
            </div>
            <span className="font-semibold text-ink text-sm truncate">Interview Coach</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-ink-soft px-2.5 py-1.5 rounded-lg hover:bg-app transition-colors flex items-center gap-1.5 flex-shrink-0"
          >
            <LogoutIcon className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </header>

        {/* Main Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
