import React, { useState } from 'react';
import { useStore } from '../context/StateContext';
import { User, Mail, Sparkles, ChevronLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole } from '../types';

export default function Signup() {
  const { signupUser, setView, selectedRoleForOnboarding, selectRoleForOnboarding } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(selectedRoleForOnboarding || 'customer');

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    signupUser(role, name, email);
    selectRoleForOnboarding(role);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-3xl p-8 border border-surface-container shadow-[0px_10px_30px_rgba(0,0,0,0.03)] relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl pointer-events-none"></div>

        {/* Back navigation */}
        <button
          onClick={() => setView('onboarding')}
          className="absolute top-6 left-6 text-on-surface-variant hover:text-primary transition-colors flex items-center text-sm gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="mb-8 text-center pt-6">
          <h1 className="font-sans text-xl font-black text-primary tracking-tight pointer-events-none select-none">
            ErrandLink
          </h1>
          <h2 className="text-2xl font-extrabold text-[#0b1c30] tracking-tight mt-2">Create Account</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Join ErrandLink to unlock local neighborhood efficiency
          </p>
        </div>

        {/* Signup form */}
        <form onSubmit={handleSignupSubmit} className="space-y-4">
          {/* Role selector buttons */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
              Pick Your Primary Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['customer', 'runner', 'vendor'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
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

          {/* Full Name Input */}
          <div className="relative">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Full Name / Business Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full h-[46px] pl-10 pr-4 bg-surface-container-low border border-surface-container-high rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors text-on-surface"
              />
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
                placeholder="jane@example.com"
                className="w-full h-[46px] pl-10 pr-4 bg-surface-container-low border border-surface-container-high rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors text-on-surface"
              />
            </div>
          </div>

          {/* Wallet credit promotion */}
          <div className="p-3 bg-secondary-container/10 border border-secondary-container/20 rounded-2xl flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-secondary text-shrink-0" />
            <p className="text-[11px] text-[#005236] leading-snug">
              {role === 'customer'
                ? "🎁 Signup Bonus: Choose customer to receive £100.00 in free simulated delivery credits!"
                : role === 'runner'
                ? "🚀 Earn Instantly: Gain cash instantly completing simple neighborhood tasks."
                : "📈 Vendor Power: Market your products to nearby customers & hire on-demand runners."}
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full h-12 bg-primary text-on-primary font-bold text-sm tracking-wide rounded-full transition-all duration-300 hover:bg-primary-container shadow-md flex items-center justify-center gap-1 cursor-pointer"
          >
            Create My Account & Start <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>

        {/* Existing account footer */}
        <p className="mt-8 text-center text-xs text-on-surface-variant">
          Already have an account?{' '}
          <button
            onClick={() => setView('login')}
            className="text-primary font-bold hover:underline bg-transparent border-none cursor-pointer"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
