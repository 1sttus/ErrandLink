import React, { useState } from 'react';
import { useStore } from '../context/StateContext';
import { 
  Sparkles, Plus, Navigation, Clock, CheckCircle, Store, 
  MapPin, RefreshCw, Send, Trash2, LogOut, ArrowRight, DollarSign,
  AlertCircle, Briefcase, ShoppingBag, MessageSquare, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Errand, UserRole } from '../types';

export default function CustomerDashboard() {
  const {
    currentUser,
    errands,
    products,
    activeCustomerTab,
    selectedErrandId,
    setCustomerTab,
    createErrand,
    cancelErrand,
    setSelectedErrandId,
    orderProduct,
    sendMessage,
    simulateRunnerActivity,
    switchActiveRole,
    logoutUser,
    setView
  } = useStore();

  // New Errand Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'delivery' | 'shopping' | 'pet' | 'custom'>('shopping');
  const [payout, setPayout] = useState(15.00);
  const [location, setLocation] = useState('');
  const [itemsString, setItemsString] = useState('');

  // Local Chat Input
  const [chatMessage, setChatMessage] = useState('');

  // Shop purchase modal state
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [qty, setQty] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const customerErrands = errands.filter(e => e.customerId === currentUser?.id);
  const activeErrands = customerErrands.filter(e => e.status !== 'completed');
  const pastErrands = customerErrands.filter(e => e.status === 'completed');

  const selectedErrand = errands.find(e => e.id === selectedErrandId);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || payout <= 0) return;

    const items = itemsString
      ? itemsString.split('\n').filter(i => i.trim() !== '')
      : ['No specific item list described'];

    createErrand({
      title,
      description,
      category,
      payout: Number(payout.toFixed(2)),
      location,
      latitude: 51.52 + (Math.random() - 0.5) * 0.04,
      longitude: -0.12 + (Math.random() - 0.5) * 0.04,
      items
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setPayout(15.00);
    setLocation('');
    setItemsString('');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedErrandId) return;
    sendMessage(selectedErrandId, chatMessage, 'customer');
    setChatMessage('');
  };

  const handleProductBuy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !deliveryAddress.trim()) return;
    orderProduct(selectedProduct.id, qty, deliveryAddress);
    setSelectedProduct(null);
    setQty(1);
    setDeliveryAddress('');
  };

  return (
    <div className="w-full min-h-screen bg-surface flex flex-col pt-0 pb-16">
      {/* Upper header action bar */}
      <div className="w-full bg-surface-container-lowest border-b border-surface-container-high sticky top-0 z-20 shadow-sm px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 bg-primary/10 flex items-center justify-center">
            {currentUser?.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <span className="font-bold text-primary">{currentUser?.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-extrabold text-[#0b1c30]">{currentUser?.name}</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Customer
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="flex items-center gap-0.5 text-amber-600 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {currentUser?.rating}
              </span>
              <span>•</span>
              <span className="font-extrabold text-[#006c49]">Balance: £{currentUser?.balance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Global Action Switcher with active role switches & guest backlink */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="bg-surface-container px-3 py-1 flex items-center gap-2 rounded-xl border border-surface-container-high text-[11px] text-on-surface-variant font-bold">
            <span>Active Mode:</span>
            <button
              onClick={() => switchActiveRole('runner')}
              className="px-2 py-0.5 bg-orange-50 hover:bg-orange-100 text-orange-950 rounded border border-orange-200 cursor-pointer text-[10px]"
            >
              Runner
            </button>
            <button
              onClick={() => switchActiveRole('vendor')}
              className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-850 rounded border border-emerald-150 cursor-pointer text-[10px]"
            >
              Vendor
            </button>
          </div>

          <button
            onClick={() => setView('guest')}
            className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-bold text-[#0b1c30] border border-[#0d1c25]/15 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Store className="w-3.5 h-3.5" /> Browse as Guest
          </button>

          <button
            onClick={logoutUser}
            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 duration-200 rounded-xl cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-[1240px] mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Nav Buttons */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3 px-2">
              Customer Hub
            </h3>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setCustomerTab('need')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  activeCustomerTab === 'need'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <Plus className="w-4 h-4" /> Request Errand
              </button>
              <button
                onClick={() => setCustomerTab('active')}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  activeCustomerTab === 'active'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4" /> Track Active Jobs
                </div>
                {activeErrands.length > 0 && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    activeCustomerTab === 'active' ? 'bg-white text-primary' : 'bg-primary-container text-on-primary-container'
                  }`}>
                    {activeErrands.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCustomerTab('shop')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  activeCustomerTab === 'shop'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <ShoppingBag className="w-4 h-4" /> Local Organic Bazaar
              </button>
              <button
                onClick={() => setCustomerTab('history')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  activeCustomerTab === 'history'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <CheckCircle className="w-4 h-4" /> Past History
              </button>
            </div>
          </div>

          <div className="p-4 bg-primary-container/30 border border-primary-container/40 rounded-2xl">
            <h4 className="text-xs font-bold text-primary flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Sandbox Engine
            </h4>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              ErrandLink works as an end-to-end community simulation. Access the <strong>Runner</strong> screen in another tab or button shortcut to adopt, claim, and advance orders you list!
            </p>
          </div>
        </div>

        {/* Major Content Screen */}
        <div className="lg:col-span-9">
          {activeCustomerTab === 'need' && (
            <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-surface-container shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-black text-[#0b1c30] tracking-tight">Post a New Errand</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Hire a qualified local runner to assist you instantly
                </p>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-on-surface-variant uppercase tracking-wider mb-1.5">
                      Errand Title / Summary
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Bring Groceries home, Pick up desk assembly"
                      className="w-full h-11 px-4 bg-surface-container-low border border-surface-container-high rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white text-on-surface transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-on-surface-variant uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e: any) => setCategory(e.target.value)}
                      className="w-full h-11 px-4 bg-surface-container-low border border-surface-container-high rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white text-on-surface transition-colors"
                    >
                      <option value="shopping">🛒 Shopping & Grocery Fetching</option>
                      <option value="delivery">📦 Courier & Pharmacy Delivery</option>
                      <option value="pet">🐾 Dog Walking & Pet Sitting</option>
                      <option value="custom">✨ Custom Errand Assignment</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-on-surface-variant uppercase tracking-wider mb-1.5">
                      Payout Offer (£)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-on-surface-variant">£</span>
                      <input
                        type="number"
                        step="0.50"
                        min="5"
                        required
                        value={payout}
                        onChange={(e) => setPayout(Number(e.target.value))}
                        className="w-full h-11 pl-8 pr-4 bg-surface-container-low border border-surface-container-high rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white text-on-surface transition-colors font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#434655] uppercase tracking-wider mb-1.5">
                      Pickup/Destination Location
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. 14 High Street, Chelsea"
                        className="w-full h-11 pl-10 pr-4 bg-surface-container-low border border-surface-container-high rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white text-on-surface transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Detailed Instructions
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Provide specific details! e.g., 'Ring doorbell twice. Speak with receptionist. The order reference is #8410.'"
                    className="w-full p-4 bg-surface-container-low border border-surface-container-high rounded-2xl text-sm focus:outline-none focus:border-primary focus:bg-white text-on-surface transition-colors"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Item Checklist (Enter each item on a new line)
                  </label>
                  <textarea
                    value={itemsString}
                    onChange={(e) => setItemsString(e.target.value)}
                    rows={2}
                    placeholder="Organic Sourdough Bread&#10;Semi-Skimmed Milk 2L"
                    className="w-full p-4 bg-surface-container-low border border-surface-container-high rounded-2xl text-sm focus:outline-none focus:border-primary focus:bg-white text-on-surface transition-colors font-mono text-xs"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="h-12 px-8 bg-primary text-on-primary font-bold text-sm tracking-wide rounded-full hover:bg-primary-container shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    Confirm & Post Errand <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </form>
            </div>
          )}

          {activeCustomerTab === 'active' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Active list */}
              <div className="lg:col-span-5 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-on-surface-variant px-1">
                  Active Errands ({activeErrands.length})
                </h3>

                {activeErrands.length === 0 ? (
                  <div className="p-6 bg-surface-container-lowest border border-surface-container rounded-2xl text-center">
                    <AlertCircle className="w-8 h-8 text-outline mx-auto mb-2" />
                    <p className="text-xs font-bold text-on-surface">No active errands</p>
                    <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                      Post an errand request or order items in our marketplace Bazaar!
                    </p>
                    <button
                      onClick={() => setCustomerTab('need')}
                      className="mt-3.5 px-3 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-lg cursor-pointer hover:bg-primary-container"
                    >
                      Post One Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {activeErrands.map((e) => {
                      const isActiveIndex = selectedErrandId === e.id;
                      return (
                        <button
                          key={e.id}
                          onClick={() => setSelectedErrandId(e.id)}
                          className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                            isActiveIndex
                              ? 'border-primary bg-surface-container-low shadow-sm'
                              : 'border-surface-container bg-surface-container-lowest hover:border-primary/30'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-xs uppercase tracking-wider font-extrabold text-primary bg-primary-fixed/50 px-2 py-0.5 rounded-md">
                              {e.category}
                            </span>
                            <span className="text-xs font-black text-primary">
                              £{e.payout.toFixed(2)}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-on-surface mt-2 line-clamp-1">{e.title}</h4>
                          <span className="text-[11px] text-on-surface-variant block mt-1 line-clamp-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-outline flex-shrink-0" /> {e.location}
                          </span>
                          <div className="mt-2.5 flex items-center justify-between text-[11px]">
                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              e.status === 'posted' ? 'bg-orange-100 text-orange-700' :
                              e.status === 'assigned' ? 'bg-indigo-100 text-indigo-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              🟢 {e.status === 'posted' ? 'Waiting' : e.status === 'assigned' ? 'Assigned' : 'In Transit'}
                            </span>
                            <span className="text-on-surface-variant font-mono text-[10px]">
                              {e.runnerName ? 'Runner: active' : 'Seeking runner'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Errand Track Details */}
              <div className="lg:col-span-7">
                {selectedErrand ? (
                  <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 shadow-sm space-y-6">
                    {/* Status tracker */}
                    <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
                      <div>
                        <h3 className="font-extrabold text-sm text-[#0b1c30] line-clamp-1">
                          {selectedErrand.title}
                        </h3>
                        <p className="text-xs text-on-surface-variant font-medium mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-outline" /> {selectedErrand.location}
                        </p>
                      </div>

                      <button
                        onClick={() => cancelErrand(selectedErrand.id)}
                        className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Cancel Job
                      </button>
                    </div>

                    {/* Stepper Progress Nodes */}
                    <div className="px-2">
                      <div className="flex justify-between items-center relative">
                        {/* Connecting Line */}
                        <div className="absolute left-4 right-4 h-0.5 bg-surface-container-high top-1/2 -translate-y-1/2 z-0"></div>
                        <div className={`absolute left-4 h-0.5 bg-primary top-1/2 -translate-y-1/2 z-0 transition-all duration-500`} style={{
                          width: selectedErrand.status === 'posted' ? '0%' :
                                 selectedErrand.status === 'assigned' ? '33%' :
                                 selectedErrand.status === 'in_progress' ? '66%' : '100%'
                        }}></div>

                        {/* Nodes */}
                        {[
                          { key: 'posted', label: 'Requested' },
                          { key: 'assigned', label: 'Matched' },
                          { key: 'in_progress', label: 'In Transit' },
                          { key: 'completed', label: 'Arrived' }
                        ].map((node, idx) => {
                          const statesOrder = ['posted', 'assigned', 'in_progress', 'completed'];
                          const currentIdx = statesOrder.indexOf(selectedErrand.status);
                          const isDone = currentIdx >= idx;
                          const isCurrent = currentIdx === idx;

                          return (
                            <div key={node.key} className="flex flex-col items-center z-10 relative">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                                isDone 
                                  ? 'bg-primary text-white border-2 border-primary' 
                                  : 'bg-surface-container-lowest border-2 border-surface-container-high text-on-surface-variant'
                              }`}>
                                {isDone && !isCurrent ? '✓' : idx + 1}
                              </div>
                              <span className={`text-[10px] sm:text-xs tracking-tight font-extrabold mt-1.5 ${
                                isCurrent ? 'text-primary' : isDone ? 'text-on-surface' : 'text-on-surface-variant'
                              }`}>
                                {node.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Description Checklist */}
                    <div>
                      <h4 className="text-xs font-black uppercase text-[#434655] tracking-wider mb-2">
                        Errand Items Checklist
                      </h4>
                      <div className="bg-surface p-4 rounded-xl space-y-2">
                        {selectedErrand.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 text-xs">
                            <input
                              type="checkbox"
                              readOnly
                              checked={selectedErrand.status === 'completed'}
                              className="w-4 h-4 text-primary rounded border-surface-container-high"
                            />
                            <span className={selectedErrand.status === 'completed' ? 'line-through text-outline' : 'text-on-surface'}>
                              {it}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Simulator Action Panel inside track */}
                    {selectedErrand.status !== 'completed' && (
                      <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-black uppercase text-orange-800 tracking-wider">
                              Simulation Sandbox
                            </span>
                            <p className="text-xs text-on-surface-variant mt-0.5">
                              {selectedErrand.status === 'posted' ? 'No runner yet. Click to claim!' :
                               selectedErrand.status === 'assigned' ? 'Runner accepted. Click to launch!' :
                               'Runner driving. Click to finalize delivery!'}
                            </p>
                          </div>
                          <button
                            onClick={() => simulateRunnerActivity(selectedErrand.id)}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Simulate Step
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Live Courier Messaging Box */}
                    {selectedErrand.runnerId && (
                      <div className="border border-surface-container-high rounded-2xl overflow-hidden flex flex-col h-[280px]">
                        <div className="bg-surface px-4 py-2.5 border-b border-surface-container-high flex items-center gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs font-black text-on-surface">
                            Chat with {selectedErrand.runnerName}
                          </span>
                        </div>

                        {/* Message Stream */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-surface-container-low/10">
                          {selectedErrand.messages.length === 0 ? (
                            <p className="text-[11px] text-on-surface-variant text-center my-6">
                              No messages yet. Send a routing tip to your runner!
                            </p>
                          ) : (
                            selectedErrand.messages.map((m) => {
                              const isMe = m.senderRole === 'customer';
                              return (
                                <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                  <div className={`px-3 py-2 text-xs rounded-2xl max-w-[80%] ${
                                    isMe 
                                      ? 'bg-primary text-white rounded-br-none' 
                                      : 'bg-surface-container-high text-on-surface rounded-bl-none'
                                  }`}>
                                    {m.text}
                                  </div>
                                  <span className="text-[9px] text-on-surface-variant mt-1 px-1">
                                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Input Action Form */}
                        <form onSubmit={handleSendChat} className="p-2 border-t border-surface-container bg-surface-container-lowest flex gap-1.5">
                          <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-surface border border-surface-container-high rounded-xl text-xs px-3 focus:outline-none focus:border-primary text-on-surface"
                          />
                          <button
                            type="submit"
                            className="bg-primary text-on-primary p-2 h-9 w-9 rounded-xl flex items-center justify-center hover:bg-primary-container transition-colors cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-surface mb-6 p-8 border border-dashed border-surface-container rounded-3xl text-center">
                    <Navigation className="w-10 h-10 text-outline mx-auto mb-2 animate-bounce" />
                    <h3 className="text-sm font-bold text-on-surface">Track Errand Status</h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Choose any active task from the list on the left to see live progress, map location coordinates, and chat.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeCustomerTab === 'shop' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-[#0b1c30] tracking-tight">Local Organic Bazaar</h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Order items directly from accredited community stores! ErrandLink automatically matches physical delivery courier.
                  </p>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.length === 0 ? (
                  <div className="p-6 bg-surface-container-lowest border rounded-2xl text-center xl:col-span-2">
                    <p className="text-sm text-on-surface-variant">No items on sell currently.</p>
                  </div>
                ) : (
                  products.map((item) => (
                    <div key={item.id} className="bg-surface-container-lowest rounded-2xl border border-surface-container p-4 shadow-sm flex gap-4 group hover:shadow-md transition-all">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-container-low flex-shrink-0">
                        <img referrerPolicy="no-referrer" src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" loading="lazy" />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] uppercase tracking-widest bg-secondary-container/20 text-[#00714d] px-1.5 py-0.5 rounded-md font-bold">
                            {item.category}
                          </span>
                          <h4 className="text-sm font-bold text-on-surface mt-1.5">{item.name}</h4>
                          <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm font-black text-primary">£{item.price.toFixed(2)}</span>
                          <button
                            onClick={() => {
                              setSelectedProduct(item);
                            }}
                            className="bg-secondary text-on-secondary hover:bg-[#005236] transition-colors font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Order Direct
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeCustomerTab === 'history' && (
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container shadow-sm space-y-4">
              <div>
                <h2 className="text-lg font-black text-[#0b1c30]">Order History</h2>
                <p className="text-xs text-on-surface-variant">Completed and finalized tasks you requested</p>
              </div>

              {pastErrands.length === 0 ? (
                <p className="text-xs text-on-surface-variant text-center py-8">
                  No historical errands completed. Completed errands will appear securely here.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {pastErrands.map((e) => (
                    <div key={e.id} className="p-4 rounded-xl border border-surface-container bg-surface p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-[#006c49]/10 text-[#006c49] px-2 py-0.5 rounded-full">
                            Completed ✓
                          </span>
                          <span className="text-[10px] text-on-surface-variant font-mono">ID: {e.id}</span>
                        </div>
                        <h4 className="text-sm font-bold text-on-surface mt-1.5">{e.title}</h4>
                        <span className="text-[11px] text-on-surface-variant block mt-0.5 font-medium">{e.location}</span>
                      </div>

                      <div className="text-left sm:text-right flex flex-col gap-1 sm:items-end">
                        <span className="text-sm font-black text-[#006c49]">£{e.payout.toFixed(2)} Payout</span>
                        <span className="text-[11px] text-on-surface-variant">Runner: {e.runnerName || 'Autonomous'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Buying Dispatch Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-[#0b1c30]/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-container-lowest rounded-3xl p-6 max-w-md w-full border border-surface-container-high shadow-xl space-y-4"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-extrabold text-[#0b1c30] text-base">Confirm Organic Order</h3>
                <button onClick={() => setSelectedProduct(null)} className="text-on-surface-variant hover:text-black font-extrabold cursor-pointer">✕</button>
              </div>

              <div className="flex gap-4 p-3 bg-surface rounded-xl items-center">
                <img referrerPolicy="no-referrer" src={selectedProduct.imageUrl} className="w-14 h-14 rounded-lg object-cover" loading="lazy" />
                <div>
                  <h4 className="text-xs font-bold text-on-surface">{selectedProduct.name}</h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Price: £{selectedProduct.price.toFixed(2)} each</p>
                </div>
              </div>

              <form onSubmit={handleProductBuy} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      max={selectedProduct.stock}
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="w-full h-10 px-3 border border-surface-container rounded-lg text-sm focus:outline-none focus:border-primary text-on-surface font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">Total Price</label>
                    <div className="h-10 flex items-center pl-1 font-black text-sm text-primary">
                      £{(selectedProduct.price * qty).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
                    Delivery drop-off address
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. 52 Queen's Gate, South Kensington"
                    className="w-full h-10 px-3 border border-surface-container rounded-lg text-sm focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="px-4 py-2 border rounded-full text-xs font-bold text-on-surface-variant cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-secondary text-on-secondary hover:bg-[#005236] text-xs font-bold rounded-full shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    Confirm & Dispatch Runner
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
