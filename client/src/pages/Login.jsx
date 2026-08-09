import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import React from 'react';
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, SparklesIcon, RobotIcon, ArrowRightIcon, SpinnerIcon, ShieldCheckIcon } from '../components/Icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

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
      toast.success(`Welcome back, ${data.name || 'User'}! 🎉`);
      navigate(from, { replace: true });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Quick fill for testing
  const handleFillDemo = () => {
    setEmail('test@example.com');
    setPassword('password123');
    toast('Filled demo credentials!', { icon: '✨' });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 relative overflow-hidden">
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />

      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 lg:p-12 gap-8 z-10">
        
        {/* Left Side: Brand Showcase (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-1 flex-col justify-center max-w-lg space-y-8 pr-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-400/20 text-primary-300 text-sm font-medium w-fit shadow-inner">
            <SparklesIcon className="w-4 h-4 text-primary-400" />
            <span>AI-Powered Tech Interview Coach</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ace your next interview with <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-indigo-300 to-purple-400">Intelligent AI</span>
            </h1>
            <p className="text-slate-300 text-base leading-relaxed">
              Upload your resume, set your dream job profile, and practice personalized mock interviews tailored to your exact experience and weaknesses.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-1 gap-3.5 pt-2">
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-primary-500/20 text-primary-400">
                <RobotIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Dynamic 10-Question Simulations</p>
                <p className="text-xs text-slate-400">Adaptive questions extracted from your real resume</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Real-Time Scoring & Breakdown</p>
                <p className="text-xs text-slate-400">Instant metrics for technical depth & communication</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Gemini AI Engine Active & Ready</span>
          </div>
        </div>

        {/* Right Side: Login Form Card */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 border border-slate-100 text-slate-800">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/30 mb-4">
                <RobotIcon className="w-7 h-7" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
              <p className="text-sm text-slate-500 mt-1.5">Sign in to continue your interview prep</p>
            </div>

            {/* Quick Demo Pill */}
            <div className="mb-6 flex justify-center">
              <button
                type="button"
                onClick={handleFillDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 transition-colors"
                title="Fill test credentials"
              >
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>Auto-fill Demo Credentials</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MailIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm transition-all"
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <LockIcon className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm transition-all"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 py-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-md shadow-primary-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
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

            {/* Footer / Switch to Signup */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-600">
                Don&apos;t have an account?{' '}
                <Link
                  to="/signup"
                  className="font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
