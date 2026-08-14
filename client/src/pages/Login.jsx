import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import React from 'react';
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, ArrowRightIcon, SpinnerIcon, CheckCircleIcon } from '../components/Icons';

const highlights = [
  'Practice with questions built from your actual resume',
  'Get scored feedback across five evaluation criteria',
  'Track readiness and progress over every attempt',
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await login(email.trim(), password);
      toast.success(`Welcome back, ${data.name || 'User'}!`);
      navigate(from, { replace: true });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-card border border-line shadow-card overflow-hidden bg-white">
        <div className="hidden lg:flex flex-col justify-center bg-primary-50 px-10 py-12 border-r border-line">
          <span className="font-mono text-[11px] font-semibold tracking-wide uppercase text-primary-700">
            Interview Coach
          </span>
          <h2 className="font-display text-3xl font-semibold text-ink mt-3 leading-tight">
            Prepare with clarity, not guesswork.
          </h2>
          <p className="text-sm text-ink-soft mt-3 max-w-sm">
            A structured way to rehearse technical interviews and see exactly where you stand.
          </p>
          <ul className="mt-8 space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
                <CheckCircleIcon className="w-[18px] h-[18px] text-primary-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 py-10 sm:px-10 sm:py-12">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-semibold text-ink">Welcome back</h1>
            <p className="text-sm text-ink-soft mt-1.5">Sign in to continue your interview prep</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-faint">
                  <MailIcon className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-faint">
                  <LockIcon className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-11"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink-faint hover:text-ink-soft transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? (
                <>
                  <SpinnerIcon className="w-5 h-5" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-line text-center">
            <p className="text-sm text-ink-soft">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-primary-700 hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
