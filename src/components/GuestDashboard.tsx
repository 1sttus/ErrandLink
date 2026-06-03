import React, { useState } from 'react';
import { useStore } from '../context/StateContext';
import { 
  Store, Shield, Briefcase, Plus, TrendingUp, Sparkles, LogIn, UserPlus,
  MapPin, Clock, Search, Coffee, ArrowUpRight, HelpCircle, Package, AlertCircle, Eye, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';

export default function GuestDashboard() {
  const { 
    errands, 
    products, 
    setView, 
    selectRoleForOnboarding 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'runners' | 'goods'>('runners');
  
  // Interactive account prompt state
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  const filteredErrands = errands.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const triggerActionPrompt = (message: string, initialRole: UserRole = 'customer') => {
    setPromptMessage(message);
    setSelectedRole(initialRole);
    setShowPrompt(true);
  };

  const handleRegisterRedirect = (role: UserRole) => {
    selectRoleForOnboarding(role);
    setView('signup');
  };

  const handleLoginRedirect = () => {
    setView('login');
  };

  return (
    <div className="w-full min-h-screen bg-transparent flex flex-col pt-0 pb-16">
      
      {/* Top Glass Navbar */}
      <div className="w-full bg-white/[0.02] backdrop-blur-md border-b border-white/10 sticky top-0 z-20 shadow-sm px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-600"></div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white block">ERRANDLINK</span>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">sandbox guest explorer</span>
          </div>
        </div>

        {/* Global CTAs */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={() => triggerActionPrompt('Create an account to post a custom errand or search active routes!')}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-cyan-500 hover:to-cyan-600 duration-200 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Plus className="w-3.5 h-3.5" /> Post an Errand
          </button>
          
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block"></div>

          <button
            onClick={handleLoginRedirect}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/10 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" /> Log In
          </button>

          <button
            onClick={() => triggerActionPrompt('Choose your preferred role and start trading assets immediately!')}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-90 duration-200 text-xs font-bold text-white rounded-xl flex items-center gap-1 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" /> Create Account
          </button>
        </div>
      </div>

      {/* Hero Header Space */}
      <div className="w-full max-w-[1240px] mx-auto px-4 md:px-8 mt-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-4"
        >
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-[11px] font-bold tracking-wider uppercase inline-block">
            ⚡ Decoupled Neighborhood Logistical Network
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Discover Local <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Running Services</span> & Food
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto leading-relaxed">
            Need supplies, vet prescriptions, or groceries delivered? Browse live available runner jobs, pick up food from local bakers, or hire a courier. Sign up to customize routes instantly.
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto pt-4 relative px-4">
            <div className="glass-panel px-4 py-3 flex items-center gap-3">
              <Search className="w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search active runs, bakeries, or green juices..."
                className="bg-transparent border-none text-xs outline-none w-full text-white placeholder-white/35"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Sandbox Workspace Tab System */}
      <div className="w-full max-w-[1240px] mx-auto px-4 md:px-8 mt-10">
        
        {/* Toggle tabs to switch view of discover */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab('runners')}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'runners'
                ? 'bg-gradient-to-r from-indigo-500/20 to-indigo-600/35 border border-indigo-500 text-indigo-300 shadow-md'
                : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Available Runner Services & Runs
          </button>
          
          <button
            onClick={() => setActiveTab('goods')}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'goods'
                ? 'bg-gradient-to-r from-[#00ffd5]/10 to-[#00adb5]/25 border border-cyan-400 text-cyan-300 shadow-md'
                : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" /> Food & Vendor Goods Catalogs
          </button>
        </div>

        {/* Tab content listings */}
        {activeTab === 'runners' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side feed of Running routes */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#8b91a7] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-400" /> Active Runner Routes & Job Board
                </h3>
                <span className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 text-gray-300 rounded font-mono font-bold">
                  {filteredErrands.length} items logged
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredErrands.map(e => (
                  <div 
                    key={e.id}
                    id={`errand-${e.id}`}
                    className="glass-panel p-5 relative overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all duration-300 group shadow-md"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/10"></div>
                    
                    <div>
                      {/* Badge representation */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] uppercase font-mono tracking-wider bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">
                          {e.category}
                        </span>
                        <span className="text-[10px] text-cyan-400 font-extrabold flex items-center gap-1">
                          £{e.payout.toFixed(2)}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white mb-2 line-clamp-1">{e.title}</h4>
                      <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed mb-4">{e.description}</p>
                    </div>

                    <div className="space-y-3.5 pt-4 border-t border-white/[0.05]">
                      <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                          <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{e.location}</span>
                        </div>
                        <span className="text-[10px] text-on-surface-variant italic">
                          By: {e.customerName}
                        </span>
                      </div>

                      {/* Request CTA Trigger */}
                      <button
                        onClick={() => triggerActionPrompt('Book this runner or create a custom errand pick up request!', 'customer')}
                        className="w-full py-2 bg-white/5 group-hover:bg-indigo-600 group-hover:text-white border border-white/10 group-hover:border-indigo-500 duration-250 rounded-xl text-[10px] font-black uppercase tracking-wider text-indigo-300 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Claim Transit Runner / Book Errand <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side live runners & community coordinators info */}
            <div className="lg:col-span-4 space-y-4">
              <div className="glass-panel p-5 space-y-4">
                <h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> Neighborhood Active Runners
                </h3>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  The following vetted community runners are active in London & Kensington districts right now, waiting to support food pick-ups or custom packages:
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#06b6d4] flex items-center justify-center font-bold text-white text-xs">MM</div>
                      <div>
                        <p className="text-[11px] font-bold text-white">Marcus Miller</p>
                        <p className="text-[9px] text-[#006c49] font-extrabold flex items-center gap-0.5">★ 4.8 Pro-Runner</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-[#006c49]/20 text-[#22c55e] px-1.5 py-0.5 rounded font-black uppercase">Active Now</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ec4899] to-[#8b5cf6] flex items-center justify-center font-bold text-white text-xs">RF</div>
                      <div>
                        <p className="text-[11px] font-bold text-white">Rory Fletcher</p>
                        <p className="text-[9px] text-[#006c49] font-extrabold flex items-center gap-0.5">★ 4.9 Expert-Runner</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-[#006c49]/20 text-[#22c55e] px-1.5 py-0.5 rounded font-black uppercase">Active Now</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f59e0b] to-[#ef4444] flex items-center justify-center font-bold text-white text-xs">SJ</div>
                      <div>
                        <p className="text-[11px] font-bold text-white">Sarah Jenkins</p>
                        <p className="text-[9px] text-[#006c49] font-extrabold flex items-center gap-0.5">★ 4.7 Eco-Runner</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-white/10 text-gray-400 px-1.5 py-0.5 rounded font-black uppercase">Offline</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => triggerActionPrompt('Create a Runner account to accept assignments and cash in payouts!', 'runner')}
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-500/10 to-indigo-500/15 text-indigo-300 font-extrabold text-xs rounded-xl border border-indigo-400/20 flex items-center justify-center gap-1 hover:bg-white/10 cursor-pointer"
                  >
                    Start Earning £ As Runner!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goods' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#8b91a7] flex items-center gap-1.5">
                <Store className="w-4 h-4 text-cyan-400" /> Merchant Products & Fresh Foods
              </h3>
              <span className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 text-gray-300 rounded font-mono font-bold">
                Direct Merchant Dispatch Catalogue
              </span>
            </div>

            {/* Grid display of foods and goods supporting active state toggles by vendors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(p => {
                const isUnavailable = p.isAvailable === false;
                return (
                  <div 
                    key={p.id}
                    className={`glass-panel p-4 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
                      isUnavailable ? 'opacity-65 grayscale hover:grayscale-0 focus-within:opacity-100 hover:opacity-100' : 'hover:border-[#00adb5]/40'
                    }`}
                  >
                    <div>
                      {/* Image block container */}
                      <div className="relative w-full h-32 rounded-xl overflow-hidden bg-white/5 mb-3.5">
                        <img 
                          src={p.imageUrl} 
                          alt={p.name} 
                          loading="lazy" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                        />
                        {isUnavailable && (
                          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center">
                            <span className="bg-red-500/20 text-red-400 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-red-500/30">
                              Not Available
                            </span>
                            <span className="text-[8px] text-gray-400 mt-1">Temporarily out of stock</span>
                          </div>
                        )}
                        
                        {!isUnavailable && (
                          <div className="absolute top-2 left-2">
                            <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[8px] font-black uppercase px-2 py-0.5 rounded">
                              In Stock
                            </span>
                          </div>
                        )}

                        <div className="absolute bottom-2 right-2">
                          <span className="bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {p.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-start mb-1.5">
                        <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">{p.name}</h4>
                        <span className="text-xs font-black text-[#00ffd5] shrink-0 ml-1.5">£{p.price.toFixed(2)}</span>
                      </div>

                      <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed mb-4">{p.description}</p>
                    </div>

                    <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono text-gray-400">
                        {isUnavailable ? '0 items left' : `${p.stock} in inventory`}
                      </span>

                      {/* Buy trigger CTA */}
                      <button
                        onClick={() => {
                          if (isUnavailable) {
                            triggerActionPrompt('This service/item is currently unavailable. Contact the merchant by joining!');
                          } else {
                            triggerActionPrompt(`Buy ${p.name} organic food & hire an ErrandLink runner to fetch it!`);
                          }
                        }}
                        disabled={isUnavailable}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                          isUnavailable 
                            ? 'bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed'
                            : 'bg-cyan-500 hover:bg-[#00ffd5] text-black hover:text-black shadow-md'
                        }`}
                      >
                        Buy & Courier
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Dynamic glossy authorization Prompt Dialog modal popup */}
      <AnimatePresence>
        {showPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md glass-panel p-6 shadow-2xl relative overflow-hidden text-left"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600"></div>

              {/* Close Button */}
              <button
                onClick={() => setShowPrompt(false)}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
              >
                &times;
              </button>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center text-white">
                  <Sparkles className="w-6 h-6 animate-spin-slow" />
                </div>

                <div>
                  <h4 className="text-lg font-black text-white tracking-tight">Create an Account to trade</h4>
                  <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                    {promptMessage || 'You need an active ErrandLink profile role (Customer, Runner, or Merchant) to dispatch deliveries, collect payouts, and buy goods.'}
                  </p>
                </div>

                {/* Simulated role card selector */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('customer')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedRole === 'customer'
                        ? 'bg-indigo-500/10 border-indigo-500 text-white'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs">Customer</div>
                    <p className="text-[8px] text-on-surface-variant mt-0.5">Post Runs</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('runner')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedRole === 'runner'
                        ? 'bg-[#00ffd5]/10 border-cyan-400 text-white'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs">Runner</div>
                    <p className="text-[8px] text-on-surface-variant mt-0.5">Earn Cash</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('vendor')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedRole === 'vendor'
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs">Vendor</div>
                    <p className="text-[8px] text-on-surface-variant mt-0.5">Sell Foods</p>
                  </button>
                </div>

                <div className="bg-indigo-500/10 rounded-xl p-3 text-[10px] text-indigo-300 leading-relaxed border border-indigo-400/20">
                  {selectedRole === 'customer' && "As a Customer, you can purchase bakery desserts, walk dogs, draft medicine runs, and pay Pro-Runners securely."}
                  {selectedRole === 'runner' && "As a Pro-Runner, you'll gain access to community log sheets, accept delivery routes, and withdraw payout rewards instantly!"}
                  {selectedRole === 'vendor' && "As an Artisan Vendor, you can upload bakery menus or listing services, mark items drafts, and analyze weekly financial revenue."}
                </div>

                {/* Modal triggers to routing views */}
                <div className="flex gap-2.5 pt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowPrompt(false)}
                    className="px-4 py-2 border border-white/10 hover:border-white/20 rounded-full text-xs font-bold text-gray-300 bg-transparent cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPrompt(false);
                      handleRegisterRedirect(selectedRole);
                    }}
                    className="px-5 py-2.5 bg-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-full hover:bg-indigo-600 transition-all cursor-pointer shadow-md"
                  >
                    Register as {selectedRole}
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPrompt(false);
                      handleLoginRedirect();
                    }}
                    className="text-[11px] text-cyan-400 hover:underline font-bold"
                  >
                    Already have a credential? Skip to Log In
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
