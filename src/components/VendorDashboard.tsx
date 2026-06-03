import React, { useState } from 'react';
import { useStore } from '../context/StateContext';
import { 
  Store, ClipboardCheck, Package, ShoppingBag, Plus, Sparkles, LogOut,
  MapPin, Clock, DollarSign, TrendingUp, User, Trash2, ArrowUpRight, CheckCircle2,
  AlertCircle, ChevronRight, Briefcase, Eye, MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { VendorProduct, UserRole } from '../types';

export default function VendorDashboard() {
  const {
    currentUser,
    errands,
    products,
    activeVendorTab,
    setVendorTab,
    createProduct,
    deleteProduct,
    toggleProductAvailability,
    switchActiveRole,
    logoutUser,
    setView,
    visitors,
    sendThankYouToVisitor
  } = useStore();

  // New Product Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState(5.99);
  const [category, setCategory] = useState('Groceries');
  const [stock, setStock] = useState(15);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [type, setType] = useState<'good' | 'service'>('good');
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  // Unsent bespoke templates typed by the vendor
  const [customMessages, setCustomMessages] = useState<Record<string, string>>({});
  const [sentAlert, setSentAlert] = useState<string | null>(null);

  // Active deliveries listed as vendor order errands
  const activeVendorErrands = errands.filter(
    e => e.category === 'vendor_order'
  );

  // Completed vendor orders
  const completedVendorErrands = activeVendorErrands.filter(e => e.status === 'completed');

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Use a clean fallback image if empty
    const img = imageUrl.trim() || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200';

    createProduct({
      name,
      price: Number(price),
      category,
      stock: Number(stock),
      description,
      imageUrl: img,
      type,
      isAvailable
    });

    // Reset Form
    setName('');
    setPrice(5.99);
    setStock(15);
    setDescription('');
    setImageUrl('');
    setType('good');
    setIsAvailable(true);
    setVendorTab('products');
  };

  // Mock sales analytics
  const salesHistoryData = [
    { day: 'Mon', sales: 12, revenue: 84.00 },
    { day: 'Tue', sales: 18, revenue: 126.50 },
    { day: 'Wed', sales: 15, revenue: 98.20 },
    { day: 'Thu', sales: 24, revenue: 185.00 },
    { day: 'Fri', sales: 29, revenue: 212.44 },
    { day: 'Sat', sales: 42, revenue: 340.50 },
    { day: 'Sun', sales: 20, revenue: 142.00 },
  ];

  return (
    <div className="w-full min-h-screen bg-surface flex flex-col pt-0 pb-16">
      {/* Top Header */}
      <div className="w-full bg-surface-container-lowest border-b border-surface-container-high sticky top-0 z-20 shadow-sm px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-secondary/20 bg-secondary/10 flex items-center justify-center">
            {currentUser?.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <span className="font-bold text-secondary">{currentUser?.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-extrabold text-[#0b1c30]">{currentUser?.name}</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-secondary-container/30 text-[#005236] px-2 py-0.5 rounded-full">
                Vendor
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="flex items-center gap-0.5 text-[#006c49] font-medium">
                Store Rating: 4.8 ★
              </span>
              <span>•</span>
              <span className="font-extrabold text-primary">Funds: £{currentUser?.balance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Portals Switches with Active Role toggles & Guest backlink */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="bg-surface-container px-3 py-1 flex items-center gap-2 rounded-xl border border-surface-container-high text-[11px] text-on-surface-variant font-bold">
            <span>Active Mode:</span>
            <button
              onClick={() => switchActiveRole('customer')}
              className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-850 rounded border border-indigo-150 cursor-pointer text-[10px]"
            >
              Customer
            </button>
            <button
              onClick={() => switchActiveRole('runner')}
              className="px-2 py-0.5 bg-orange-50 hover:bg-orange-100 text-orange-950 rounded border border-orange-200 cursor-pointer text-[10px]"
            >
              Runner
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
        {/* Navigation panel */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#434655] mb-3 px-2">
              Merchant Hub
            </h3>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setVendorTab('orders')}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  activeVendorTab === 'orders'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="w-4 h-4" /> Transit Dispatch
                </div>
                {activeVendorErrands.length > 0 && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    activeVendorTab === 'orders' ? 'bg-white text-primary' : 'bg-secondary text-white'
                  }`}>
                    {activeVendorErrands.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setVendorTab('products')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  activeVendorTab === 'products'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <Package className="w-4 h-4" /> Manage Inventory
              </button>
              <button
                onClick={() => setVendorTab('analytics')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  activeVendorTab === 'analytics'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <TrendingUp className="w-4 h-4" /> Bakery Revenue
              </button>
              
              <button
                onClick={() => setVendorTab('visitors')}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  activeVendorTab === 'visitors'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-4 h-4" /> Store Visitors
                </div>
                {visitors.length > 0 && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    activeVendorTab === 'visitors' ? 'bg-[#00ffe0] text-[#0b1c30]' : 'bg-[#e5f5f0] text-[#006c49]'
                  }`}>
                    {visitors.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="p-4 bg-secondary-container/10 border border-secondary-container/20 rounded-2xl">
            <h4 className="text-xs font-bold text-secondary flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Market Logistics
            </h4>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              When Customers buy items from your catalogue in their <strong>Organic Bazaar</strong> tab, and type their address, ErrandLink automatically spawns a delivery courier job on the community board!
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="lg:col-span-9">
          {activeVendorTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-[#0b1c30] tracking-tight">Active Dispatch Deliveries</h2>
              <p className="text-xs text-on-surface-variant">
                Observe delivery transit status of customer orders dispatched from your retail store
              </p>

              {activeVendorErrands.length === 0 ? (
                <div className="p-10 border border-dashed border-surface-container bg-surface-container-lowest text-center rounded-2xl">
                  <AlertCircle className="w-9 h-9 text-outline mx-auto mb-2" />
                  <p className="text-xs font-bold text-on-surface">No active dispatches</p>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Once a Customer places an order, it will appear here instantly.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeVendorErrands.map((e) => (
                    <div key={e.id} className="bg-surface-container-lowest border border-surface-container p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10px] bg-secondary-container/20 text-[#00714d] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            Order Dispatched
                          </span>
                          <span className="text-[10px] text-on-surface-variant font-mono">Job ID: {e.id}</span>
                        </div>
                        <h3 className="text-sm font-bold text-on-surface mt-2">{e.title}</h3>
                        <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-outline" /> Deliver to: {e.location}
                        </p>
                        <span className="text-[11px] text-primary font-bold block mt-1.5">
                          Client: {e.customerName}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 items-start md:items-end">
                        <span className="text-xs font-black text-on-surface">
                          Courier Reward: £{e.payout.toFixed(2)}
                        </span>
                        
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`w-2 h-2 rounded-full ${
                            e.status === 'completed' ? 'bg-[#006c49]' :
                            e.status === 'posted' ? 'bg-orange-500' : 'bg-primary'
                          }`}></span>
                          <span className="text-xs uppercase tracking-wider font-extrabold">
                            {e.status === 'posted' ? 'Seeking Courier' :
                             e.status === 'assigned' ? 'Runner Assigned' :
                             e.status === 'in_progress' ? 'In Transit' : 'Succeeded'}
                          </span>
                        </div>
                        
                        <span className="text-[10px] text-outline">
                          {e.runnerName ? `Assigned to: ${e.runnerName}` : 'Waiting on board'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeVendorTab === 'products' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Product list catalog */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-xs font-black uppercase text-on-surface-variant tracking-wider">
                    Current Catalogue ({products.length})
                  </h3>
                  <span className="text-[10px] text-on-surface-variant italic">
                    Tap status pills to toggle listing availability
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {products.map((item) => {
                    const isUnavailable = item.isAvailable === false;
                    return (
                      <div 
                        key={item.id} 
                        className={`bg-surface-container-lowest border rounded-xl p-4 shadow-sm flex gap-4 transition-all duration-205 ${
                          isUnavailable ? 'border-red-500/20 bg-red-500/[0.01]' : ''
                        }`}
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface flex-shrink-0 relative">
                          <img referrerPolicy="no-referrer" src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                          {isUnavailable && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-[7.5px] font-bold text-red-400 bg-red-950/80 px-1 py-0.5 rounded border border-red-500/30 uppercase">Draft</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <h4 className="text-xs font-bold text-on-surface truncate">{item.name}</h4>
                                <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded font-extrabold shrink-0 ${
                                  item.type === 'service' 
                                    ? 'bg-blue-100 text-blue-700 border border-blue-200/50' 
                                    : 'bg-amber-100 text-[#714d00]'
                                }`}>
                                  {item.type || 'good'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => toggleProductAvailability(item.id)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase cursor-pointer transition-colors ${
                                    !isUnavailable
                                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-400/20 hover:bg-emerald-500/20'
                                      : 'bg-red-505/10 text-red-500 border border-red-400/20 hover:bg-red-500/20'
                                  }`}
                                  title="Click to toggle availability"
                                >
                                  {!isUnavailable ? '● Active' : '○ Draft'}
                                </button>

                                <button 
                                  onClick={() => deleteProduct(item.id)}
                                  className="text-red-500 hover:text-red-700 p-1 cursor-pointer transition-colors"
                                  title="Delete Item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            
                            <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">{item.description}</p>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1.5">
                            <span className="font-extrabold text-[#006c49]">Price: £{item.price.toFixed(2)}</span>
                            <span className="font-mono text-[10px] bg-surface-container px-2 py-0.5 rounded-md font-medium">
                              Stock: {item.stock} left
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add product form */}
              <div className="lg:col-span-5">
                <div className="bg-surface-container-lowest border rounded-2xl p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-[#0b1c30]">Add New Item</h3>
                  
                  <form onSubmit={handleCreateProductSubmit} className="space-y-3.5 text-left">
                    {/* Good vs Service Classification Radio */}
                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1.5">Item Classification</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setType('good')}
                          className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center ${
                            type === 'good'
                              ? 'bg-secondary/15 border-secondary text-secondary-950'
                              : 'bg-surface border-surface-container text-gray-500 hover:text-gray-800'
                          }`}
                        >
                          Food / Good
                        </button>
                        <button
                          type="button"
                          onClick={() => setType('service')}
                          className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center ${
                            type === 'service'
                              ? 'bg-blue-50 border-blue-500 text-blue-800'
                              : 'bg-surface border-surface-container text-gray-500 hover:text-gray-800'
                          }`}
                        >
                          Service / Offer
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Product Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sourdough Pretzel"
                        className="w-full h-10 px-3 bg-surface border border-surface-container rounded-lg text-xs focus:outline-none focus:border-primary text-on-surface"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Unit Price (£)</label>
                        <input
                          type="number"
                          step="0.10"
                          min="0.5"
                          required
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                          className="w-full h-10 px-3 bg-surface border border-surface-container rounded-lg text-xs focus:outline-none focus:border-primary text-on-surface font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Init Stock</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={stock}
                          onChange={(e) => setStock(Number(e.target.value))}
                          className="w-full h-10 px-3 bg-[#fbfbfb] border border-surface-container rounded-lg text-xs focus:outline-none focus:border-primary text-on-surface"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Category</label>
                        <input
                          type="text"
                          required
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          placeholder="Bakery, Produce, Dairy..."
                          className="w-full h-10 px-3 bg-surface border border-surface-container rounded-lg text-xs focus:outline-none focus:border-primary text-on-surface"
                        />
                      </div>

                      {/* Starting availability checkbox toggle */}
                      <div>
                        <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Set Available</label>
                        <button
                          type="button"
                          onClick={() => setIsAvailable(!isAvailable)}
                          className={`w-full h-10 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer text-center flex items-center justify-center ${
                            isAvailable
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                              : 'bg-red-50 border-red-300 text-red-800'
                          }`}
                        >
                          {isAvailable ? 'Available Now' : 'Not at the moment'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Product Photo URL</label>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full h-10 px-3 bg-surface border border-surface-container rounded-lg text-xs focus:outline-none focus:border-primary text-on-surface"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Brief Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        placeholder="Tell shoppers why they will love this fresh item..."
                        className="w-full p-3 bg-surface border border-surface-container rounded-lg text-xs focus:outline-none focus:border-primary text-on-surface"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full h-10 bg-secondary text-on-secondary hover:bg-[#005236] transition-colors font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> List Item For Sale
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeVendorTab === 'analytics' && (
            <div className="space-y-6">
              {/* Top Row overview cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-surface-container-lowest border rounded-2xl shadow-sm text-left">
                  <span className="text-xs font-bold text-on-surface-variant block uppercase tracking-wider">
                    Store Revenue
                  </span>
                  <div className="text-2xl font-black text-[#006c49] mt-1.5">
                    £{currentUser?.balance.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-[#00714d] block mt-1 font-extrabold">▲ +12.4% weekly profit</span>
                </div>

                <div className="p-5 bg-surface-container-lowest border rounded-2xl shadow-sm text-left">
                  <span className="text-xs font-bold text-on-surface-variant block uppercase tracking-wider">
                    Completed Deliveries
                  </span>
                  <div className="text-2xl font-black text-primary mt-1.5">
                    {completedVendorErrands.length} Orders
                  </div>
                  <span className="text-[10px] text-on-surface-variant block mt-1 font-medium">All-time dispatch count</span>
                </div>

                <div className="p-5 bg-surface-container-lowest border rounded-2xl shadow-sm text-left">
                  <span className="text-xs font-bold text-on-surface-variant block uppercase tracking-wider">
                    Customer Satisfaction
                  </span>
                  <div className="text-2xl font-black text-amber-600 mt-1.5">
                    4.9 / 5.0
                  </div>
                  <span className="text-[10px] text-on-surface-variant block mt-1 font-medium">Verified by ErrandLink feedback</span>
                </div>
              </div>

              {/* Weekly incoming revenue area chart graphic */}
              <div className="bg-surface-container-lowest border rounded-3xl p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-sm font-black text-[#0b1c30]">Weekly Sales & Revenue (£)</h3>
                  <p className="text-xs text-on-surface-variant">Merchant receipts from direct customer marketplace purchases</p>
                </div>

                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#006c49" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#006c49" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFF4FF" />
                      <XAxis dataKey="day" fontSize={11} stroke="#737686" />
                      <YAxis fontSize={11} stroke="#737686" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e5eeff' }}
                        itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#006c49" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeVendorTab === 'visitors' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-[#0b1c30] tracking-tight flex items-center gap-2">
                    <Eye className="w-5 h-5 text-secondary" /> 
                    <span>Live Visitor Logs & Guest Activity Tracker</span>
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Monitor people browsing your shop, searching catalog runs, or preparing errand jobs in real time. Thank them with a customized template!
                  </p>
                </div>

                {/* Total Stats indicators */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-3 py-1 font-mono font-bold rounded-lg uppercase">
                    Total Tracked Sessions: {visitors.length}
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 px-3 py-1 font-mono font-bold rounded-lg uppercase">
                    Thanked: {visitors.filter(v => v.thanked).length}
                  </span>
                </div>
              </div>

              {sentAlert && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                  <span className="font-medium">✓ {sentAlert}</span>
                  <button onClick={() => setSentAlert(null)} className="text-emerald-900 font-extrabold ml-2">✕</button>
                </div>
              )}

              {/* Visitors Cards mapping render */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visitors.length === 0 ? (
                  <div className="p-12 border border-dashed text-center rounded-2xl md:col-span-2 bg-surface-container-lowest">
                    <User className="w-10 h-10 text-outline mx-auto mb-2" />
                    <p className="text-xs font-bold text-on-surface">No visitors logged yet</p>
                    <p className="text-[11px] text-on-surface-variant mt-1">
                      As guest users or clients browse and check items, they will instantly turn up in this feed!
                    </p>
                  </div>
                ) : (
                  [...visitors].reverse().map((v) => {
                    const messageVal = customMessages[v.id] ?? '';
                    return (
                      <div 
                        key={v.id} 
                        className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                          v.thanked 
                            ? 'bg-emerald-50/[0.15] border-emerald-500/20 shadow-xs' 
                            : 'bg-surface-container-lowest border-surface-container hover:shadow-md'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1.5 mb-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-xs font-black text-[#0b1c30] truncate">{v.name}</span>
                              <span className={`text-[8px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded ${
                                v.role === 'customer' ? 'bg-indigo-150 text-indigo-700' :
                                v.role === 'runner' ? 'bg-orange-50 text-orange-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {v.role}
                              </span>
                            </div>

                            <span className="text-[10px] text-on-surface-variant shrink-0 font-mono">
                              {new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                          </div>

                          <div className="p-3 bg-surface rounded-xl border border-surface-container mt-2">
                            <span className="text-[9px] text-outline font-black block uppercase tracking-wider mb-0.5">LATEST SHOP ACTIVITY:</span>
                            <p className="text-xs text-[#0b1c30] font-medium leading-relaxed">
                              {v.action}
                            </p>
                          </div>
                        </div>

                        {/* Interactive Message Sender Block */}
                        <div className="pt-4 border-t border-surface-container mt-4">
                          {v.thanked ? (
                            <div className="flex items-center gap-2 bg-[#d1fae5] border border-[#a7f3d0] px-3.5 py-2.5 rounded-xl">
                              <CheckCircle2 className="w-4 h-4 text-[#047857]" />
                              <div>
                                <span className="text-[10px] font-black text-[#047857] block uppercase tracking-wider">GREETINGS SENT SUCCESSFULLY</span>
                                <span className="text-[10px] text-[#065f46] block font-mono mt-0.5">
                                  Message: "{v.customMessage || 'Thanks for visiting are ErrandLink store and checking are inventory!'}"
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2.5">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Type bespoke message (or leave empty for default)..."
                                  value={messageVal}
                                  onChange={(e) => {
                                    setCustomMessages(prev => ({
                                      ...prev,
                                      [v.id]: e.target.value
                                    }));
                                  }}
                                  className="flex-1 h-9 px-3 text-xs bg-surface border border-surface-container rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-on-surface"
                                />
                                <button
                                  onClick={() => {
                                    sendThankYouToVisitor(v.id, messageVal.trim() || undefined);
                                    setSentAlert(`Gratitude greeting dispatched to ${v.name}!`);
                                    setTimeout(() => setSentAlert(null), 4000);
                                  }}
                                  className="h-9 px-3.5 bg-secondary hover:bg-[#005236] text-on-secondary hover:text-white duration-150 text-[10px] font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" /> Send Thank-You
                                </button>
                              </div>
                              <span className="text-[9px] text-[#555] block italic ml-1">
                                Default dispatch: "Thanks for visiting are ErrandLink store and checking are inventory!"
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
