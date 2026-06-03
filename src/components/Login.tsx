import React, { useState } from 'react';
import { useStore } from '../context/StateContext';
import { Mail, Lock, Sparkles, UserCheck, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole } from '../types';

export default function Login() {
  const { loginUser, setView, selectedRoleForOnboarding, selectRoleForOnboarding } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(selectedRoleForOnboarding || 'customer');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(role, email || undefined);
  };

  const quickLogins: { role: UserRole; name: string; email: string; desc: string }[] = [
    {
      role: 'customer',
      name: 'Alex Thorne',
      email: 'alex.thorne@errandlink.com',
      desc: 'Simulate Customer (Post jobs, place local orders)'
    },
    {
      role: 'runner',
      name: 'Marcus Miller',
      email: 'marcus.runner@errandlink.com',
      desc: 'Simulate Runner (Claim jobs, view earnings)'
    },
    {
      role: 'vendor',
      name: 'London Artisan Bakery',
      email: 'bakes@artisanbakery.co.uk',
      desc: 'Simulate Vendor (Manage stock, dispatch couriers)'
    }
  ];

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-3xl p-8 border border-surface-container shadow-[0px_10px_30px_rgba(0,0,0,0.03)] relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl pointer-events-none"></div>

        {/* Back navigation */}
        <button
          onClick={() => setView('onboarding')}
          className="absolute top-6 left-6 text-on-surface-variant hover:text-primary transition-colors flex items-center text-sm gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {/* Logo and title */}
        <div className="mb-8 text-center pt-6">
          <h1 className="font-sans text-xl font-black text-primary tracking-tight pointer-events-none select-none">
            ErrandLink
          </h1>
          <h2 className="text-2xl font-extrabold text-[#0b1c30] tracking-tight mt-2">Welcome Back</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Access your local neighborhood delivery ecosystem
          </p>
        </div>

        {/* Traditional Credentials Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Role selector inside form */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
              Select Login Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['customer', 'runner', 'vendor'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    selectRoleForOnboarding(r);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    role === r
                      ? 'border-primary bg-surface-container text-primary shadow-sm'
                      : 'border-surface-container hover:bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Email input */}
          <div className="relative">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-[46px] pl-10 pr-4 bg-surface-container-low border border-surface-container-high rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors text-on-surface"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="relative">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-[46px] pl-10 pr-4 bg-surface-container-low border border-surface-container-high rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors text-on-surface"
              />
            </div>
          </div>

          {/* Log In Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full h-12 bg-primary text-on-primary font-bold text-sm tracking-wide rounded-full transition-all duration-300 hover:bg-primary-container shadow-md cursor-pointer"
          >
            Log In
          </motion.button>
        </form>

        {/* Separator */}
        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-container-high"></div>
          </div>
          <span className="relative px-3 bg-surface-container-lowest text-xs text-on-surface-variant uppercase tracking-widest font-semibold">
            Or Sandbox Shortcut
          </span>
        </div>

        {/* Quick Sandboxed logins */}
        <div className="space-y-2.5">
          {quickLogins.map((item) => (
            <button
              key={item.role}
              onClick={() => {
                selectRoleForOnboarding(item.role);
                loginUser(item.role, item.email);
              }}
              className="w-full flex items-center p-3 text-left rounded-2xl border border-surface-container hover:border-primary/40 bg-surface-container-low/50 hover:bg-surface-container-low transition-all duration-200 cursor-pointer active:scale-[0.99] group"
            >
              <div className="w-9 h-9 flex-shrink-0 bg-surface-container-high rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="ml-3.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface truncate">
                    {item.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-primary font-semibold bg-primary-fixed/40 px-1.5 py-0.5 rounded-md">
                    {item.role}
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant truncate">
                  {item.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Sign up links */}
        <p className="mt-8 text-center text-xs text-on-surface-variant">
          Don't have an account yet?{' '}
          <button
            onClick={() => setView('signup')}
            className="text-primary font-bold hover:underline bg-transparent border-none cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
