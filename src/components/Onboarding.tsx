import React from 'react';
import { useStore } from '../context/StateContext';
import { User, Package, Store, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole } from '../types';

export default function Onboarding() {
  const {
    selectedRoleForOnboarding,
    selectRoleForOnboarding,
    setView
  } = useStore();

  const roles: { id: UserRole; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      id: 'customer',
      title: 'Customer',
      subtitle: 'I need errands done',
      icon: <User className="w-7 h-7" />,
    },
    {
      id: 'runner',
      title: 'Runner',
      subtitle: 'I want to run errands',
      icon: <Package className="w-7 h-7" />,
    },
    {
      id: 'vendor',
      title: 'Vendor',
      subtitle: 'I want to sell my products',
      icon: <Store className="w-7 h-7" />,
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header section with brand identity */}
      <header className="flex justify-center items-center w-full px-4 h-20 z-10">
        <h1 className="font-sans text-2xl font-black text-primary tracking-tight">ErrandLink</h1>
      </header>

      <main className="flex-1 w-full max-w-[500px] px-6 flex flex-col pt-4 pb-12">
        {/* Header Section */}
        <div id="onboarding-headers" className="mb-10 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0b1c30] tracking-tight mb-2">
            Join as a...
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
            Select the role that best matches your goals within our community ecosystem.
          </p>
        </div>

        {/* Role Selection Grid */}
        <div id="roles-container" className="grid grid-cols-1 gap-4 w-full">
          {roles.map((item) => {
            const isActive = selectedRoleForOnboarding === item.id;
            return (
              <button
                key={item.id}
                id={`role-card-${item.id}`}
                className={`group relative flex items-center p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                  isActive
                    ? 'border-primary bg-surface-container-low shadow-[0px_10px_4px_rgba(0,123,219,0.06)] scale-[1.01]'
                    : 'border-transparent bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md'
                }`}
                onClick={() => selectRoleForOnboarding(item.id)}
              >
                {/* Icon Wrapper */}
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isActive
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-high text-primary group-hover:bg-primary group-hover:text-on-primary'
                  }`}
                >
                  {item.icon}
                </div>

                {/* Role Titles */}
                <div className="ml-5 text-left">
                  <h3 className="text-base font-bold text-on-surface transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-on-surface-variant">
                    {item.subtitle}
                  </p>
                </div>

                {/* Chevron/Arrow Indicator */}
                <div
                  className={`absolute right-5 transition-all duration-300 ${
                    isActive ? 'opacity-100 translate-x-0 text-primary' : 'opacity-0 -translate-x-2 text-on-surface'
                  }`}
                >
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Illustration Banner */}
        <div className="mt-8 relative h-40 overflow-hidden rounded-2xl bg-surface-container-low hidden md:block border border-surface-container-high">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
          <img
            alt="Community and Collaboration"
            className="w-full h-full object-cover mix-blend-multiply filter grayscale opacity-45"
            referrerPolicy="no-referrer"
            loading="lazy"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoUVJ2iJoHg3PDIJjHxeJCgf2RRNsj9l88CCIb1H3CJ_0HGVMA820_0NWn8tpeBOU6T-JeC9fg2Rcw5hYVWflrQvL-2OqI6Tr5fWMFqv9YmjCjCHAd7XJj5iVTHTZysVWK2-TZzzJNW4eIRIoaB6x1rff7o-kQw9C1txrU12mAFYBfgWNwrjo-du5szX2YnzKu8th-gXTY8BNua0JZ74KRfafDQHg0uqnaHA7nlaw7EiPgs2lOEE52qPM0BZgMd_XSIEcFoy8SK4Br"
          />
        </div>

        {/* Push action block to bottom */}
        <div className="flex-grow min-h-[32px]"></div>

        {/* Action Buttons Section */}
        <div className="mt-8 flex flex-col items-center">
          <motion.button
            whileTap={{ scale: 0.96 }}
            disabled={!selectedRoleForOnboarding}
            onClick={() => setView('signup')}
            id="continue-btn"
            className={`w-full h-[54px] flex items-center justify-center font-bold text-sm tracking-wide rounded-full transition-all duration-300 shadow-sm cursor-pointer ${
              selectedRoleForOnboarding
                ? 'bg-primary text-on-primary hover:bg-primary-container hover:shadow-lg scale-100 disabled:opacity-50'
                : 'bg-outline text-on-secondary opacity-40 cursor-not-allowed'
            }`}
          >
            Continue
          </motion.button>

          <p className="mt-5 text-sm text-on-surface-variant text-center">
            Already have an account?{' '}
            <button
              onClick={() => {
                setView('login');
              }}
              className="text-primary font-extrabold hover:underline select-none bg-transparent border-none cursor-pointer"
            >
              Log in
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
