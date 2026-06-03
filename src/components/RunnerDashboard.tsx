import React, { useState } from 'react';
import { useStore } from '../context/StateContext';
import { 
  MapPin, CheckSquare, DollarSign, Calendar, TrendingUp, Sparkles, 
  Send, Compass, Star, LogOut, ArrowRight, User, CircleCheck, ClipboardList,
  ChevronRight, Car, MessageCircle, AlertCircle, ShoppingBag, Store, Briefcase
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { Errand, UserRole } from '../types';

export default function RunnerDashboard() {
  const {
    currentUser,
    errands,
    activeRunnerTab,
    selectedErrandId,
    setRunnerTab,
    acceptErrand,
    advanceErrandStatus,
    setSelectedErrandId,
    sendMessage,
    switchActiveRole,
    logoutUser,
    setView
  } = useStore();

  const [chatMessage, setChatMessage] = useState('');

  // Available jobs (posted, no runner assigned yet)
  const availableErrands = errands.filter(e => e.status === 'posted');
  
  // Claimed/active jobs assigned to this runner
  const activeErrands = errands.filter(e => e.runnerId === currentUser?.id && e.status !== 'completed');
  
  // Historical jobs finalized by this runner
  const completedErrandsByRunner = errands.filter(e => e.runnerId === currentUser?.id && e.status === 'completed');

  const selectedErrand = errands.find(e => e.id === selectedErrandId);

  // Mock earnings data for the Recharts Bar chart
  const weeklyEarningsData = [
    { name: 'Mon', jobs: 2, amount: 28.50 },
    { name: 'Tue', jobs: 3, amount: 44.00 },
    { name: 'Wed', jobs: 4, amount: 62.00 },
    { name: 'Thu', jobs: 1, amount: 14.50 },
    { name: 'Fri', jobs: 3, amount: 48.00 },
    { name: 'Sat', jobs: 5, amount: 84.00 },
    { name: 'Sun', jobs: 1, amount: 22.00 },
  ];

  const handleClaimJob = (errandId: string) => {
    if (!currentUser) return;
    acceptErrand(errandId, currentUser.id, `${currentUser.name} (You)`);
    setRunnerTab('active');
    setSelectedErrandId(errandId);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedErrandId) return;
    sendMessage(selectedErrandId, chatMessage, 'runner');
    setChatMessage('');
  };

  return (
    <div className="w-full min-h-screen bg-surface flex flex-col pt-0 pb-16">
      {/* Profile/Status Top Header */}
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
              <span className="text-[10px] uppercase font-bold tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                Runner / Courier
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="flex items-center gap-0.5 text-amber-600 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {currentUser?.rating || 5.0}
              </span>
              <span>•</span>
              <span className="font-extrabold text-[#006c49]">Simulated Wallet: £{currentUser?.balance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Global Action Switcher with active role switches & guest backlink */}
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
        {/* Left Sidebar Menu */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#434655] mb-3 px-2">
              Runner Hub
            </h3>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setRunnerTab('jobs')}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  activeRunnerTab === 'jobs'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Compass className="w-4 h-4" /> Available Jobs
                </div>
                {availableErrands.length > 0 && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    activeRunnerTab === 'jobs' ? 'bg-white text-primary' : 'bg-primary-container text-on-primary-container'
                  }`}>
                    {availableErrands.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setRunnerTab('active')}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  activeRunnerTab === 'active'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-4 h-4" /> Actively Claimed
                </div>
                {activeErrands.length > 0 && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    activeRunnerTab === 'active' ? 'bg-white text-primary' : 'bg-orange-600 text-white'
                  }`}>
                    {activeErrands.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setRunnerTab('earnings')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  activeRunnerTab === 'earnings'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <TrendingUp className="w-4 h-4" /> Income Analytics
              </button>
            </div>
          </div>

          <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
            <h4 className="text-xs font-bold text-orange-900 flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Active Job Transit
            </h4>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              When you claim a job, you can complete the shipping steps here which increments your mock wallet balance by the reward amount!
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="lg:col-span-9">
          {activeRunnerTab === 'jobs' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <div>
                  <h2 className="text-xl font-black text-[#0b1c30] tracking-tight">Available Errands Board</h2>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                    Select & claim on-demand courier jobs posted by nearby residents
                  </p>
                </div>
              </div>

              {availableErrands.length === 0 ? (
                <div className="p-12 text-center bg-surface-container-lowest border border-surface-container rounded-3xl">
                  <AlertCircle className="w-10 h-10 text-outline mx-auto mb-2 animate-bounce" />
                  <p className="text-sm font-bold text-on-surface">Jobs Board is currently clean</p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    No active pending errands nearby. Switch to the <strong>Customer Panel</strong> to post a custom job, then claim it immediately!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableErrands.map((job) => (
                    <div key={job.id} className="bg-surface-container-lowest border border-surface-container rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold bg-[#e5eeff] text-primary px-2 py-0.5 rounded-md">
                            {job.category}
                          </span>
                          <span className="text-sm font-black text-[#006c49]">£{job.payout.toFixed(2)}</span>
                        </div>

                        <h3 className="text-base font-bold text-on-surface leading-snug line-clamp-1">{job.title}</h3>
                        <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed line-clamp-2">
                          {job.description}
                        </p>

                        <div className="space-y-1.5 mt-4">
                          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                            <MapPin className="w-3.5 h-3.5 text-outline flex-shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                            <User className="w-3.5 h-3.5 text-outline flex-shrink-0" />
                            <span>Client: {job.customerName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-surface-container pt-4 flex items-center justify-between">
                        <span className="text-[10px] text-on-surface-variant font-medium">Auto-dispatch available</span>
                        <button
                          onClick={() => handleClaimJob(job.id)}
                          className="bg-primary text-on-primary hover:bg-primary-container transition-colors py-2 px-4 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer shadow-sm"
                        >
                          Accept Errand <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeRunnerTab === 'active' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Claimed job selection column */}
              <div className="lg:col-span-5 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#434655] px-1">
                  Claimed Duties ({activeErrands.length})
                </h3>

                {activeErrands.length === 0 ? (
                  <div className="p-8 bg-surface-container-lowest border rounded-2xl text-center">
                    <ClipBoardCheckIcon className="w-10 h-10 text-outline mx-auto mb-2" />
                    <p className="text-xs font-bold text-on-surface">No active assignments</p>
                    <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                      Accept available chores inside the available jobs board first.
                    </p>
                    <button
                      onClick={() => setRunnerTab('jobs')}
                      className="mt-3.5 px-3 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-lg cursor-pointer hover:bg-primary-container"
                    >
                      Browse Jobs
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeErrands.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => setSelectedErrandId(e.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                          selectedErrandId === e.id
                            ? 'border-primary bg-surface-container-low shadow-sm'
                            : 'border-surface-container bg-surface-container-lowest hover:border-primary/20'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {e.category}
                          </span>
                          <span className="text-xs font-black text-[#006c49]">£{e.payout.toFixed(2)}</span>
                        </div>
                        <h4 className="text-sm font-bold text-on-surface mt-2 line-clamp-1">{e.title}</h4>
                        <span className="text-[11px] text-on-surface-variant block mt-1 truncate">
                          📍 {e.location}
                        </span>

                        <div className="mt-3 flex items-center justify-between text-[11px]">
                          <span className="text-on-surface-variant">Client: {e.customerName}</span>
                          <span className="font-bold text-primary">
                            {e.status === 'assigned' ? 'Claimed' : 'Driving'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Transit tracking process manager list */}
              <div className="lg:col-span-7">
                {selectedErrand ? (
                  <div className="bg-surface-container-lowest rounded-3xl border border-surface-container p-6 shadow-sm space-y-6">
                    <div>
                      <h3 className="font-extrabold text-sm text-[#0b1c30]">Fulfillment Details</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-outline" /> {selectedErrand.location}
                      </p>
                    </div>

                    {/* Step description lists */}
                    <div className="bg-surface p-4 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black text-on-surface-variant uppercase tracking-wider border-b border-surface-container-high pb-2">
                        Delivery Steps Checklist
                      </h4>

                      {[
                        { step: 1, title: 'Arrive at pickup location', desc: selectedErrand.location },
                        { step: 2, title: 'Procure/Check inventory', desc: `${selectedErrand.items.join(', ')}` },
                        { step: 3, title: 'Fulfill drop-off securely', desc: 'Arrive at client doorstep and complete transaction' }
                      ].map((item, idx) => {
                        const isDone = selectedErrand.status === 'completed' || 
                                     (item.step === 1 && selectedErrand.status !== 'assigned') ||
                                     (item.step === 2 && selectedErrand.status === 'completed');

                        return (
                          <div key={item.step} className="flex gap-3 items-start">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] mt-0.5 ${
                              isDone ? 'bg-secondary text-white' : 'bg-surface-container-high text-on-surface-variant'
                            }`}>
                              ✓
                            </div>
                            <div>
                              <h5 className={`text-xs font-bold ${isDone ? 'text-on-surface line-through opacity-60' : 'text-on-surface'}`}>
                                {item.title}
                              </h5>
                              <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Actions button to advance transit state */}
                    <div className="pt-2">
                      {selectedErrand.status === 'assigned' && (
                        <button
                          onClick={() => advanceErrandStatus(selectedErrand.id)}
                          className="w-full h-11 bg-primary text-on-primary hover:bg-primary-container transition-colors font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Car className="w-4 h-4" /> Start Drive / Transit
                        </button>
                      )}

                      {selectedErrand.status === 'in_progress' && (
                        <button
                          onClick={() => advanceErrandStatus(selectedErrand.id)}
                          className="w-full h-11 bg-secondary text-on-secondary hover:bg-[#005236] transition-colors font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm animate-pulse"
                        >
                          <CircleCheck className="w-4 h-4" /> Package Delivered securely!
                        </button>
                      )}

                      {selectedErrand.status === 'completed' && (
                        <div className="p-4 bg-secondary-container/10 border border-secondary-container/30 rounded-2xl text-center">
                          <p className="text-xs font-bold text-[#005236]">✓ Errand completed and payout added to wallet!</p>
                        </div>
                      )}
                    </div>

                    {/* Integrated Chat tool */}
                    <div className="border border-surface-container-high rounded-2xl overflow-hidden flex flex-col h-[280px]">
                      <div className="bg-surface px-4 py-2.5 border-b border-surface-container-high flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs font-black text-on-surface">
                            Direct message: {selectedErrand.customerName}
                          </span>
                        </div>
                        <span className="text-[9px] uppercase tracking-wider text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">
                          Connected
                        </span>
                      </div>

                      {/* Chat stream */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-surface-container-low/10">
                        {selectedErrand.messages.map((m) => {
                          const isMe = m.senderRole === 'runner';
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
                        })}
                      </div>

                      {/* Input fields */}
                      <form onSubmit={handleSendChat} className="p-2 border-t border-surface-container bg-surface-container-lowest flex gap-1.5">
                        <input
                          type="text"
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          placeholder="Fulfill update or dispatch query..."
                          className="flex-1 bg-surface border border-surface-container-high rounded-xl text-xs px-3 focus:outline-none focus:border-outline text-on-surface"
                        />
                        <button
                          type="submit"
                          className="bg-primary text-on-primary p-2 h-9 w-9 rounded-xl flex items-center justify-center hover:bg-primary-container transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="bg-surface border border-dashed border-surface-container rounded-3xl p-8 text-center">
                    <ClipboardList className="w-10 h-10 text-outline mx-auto mb-2" />
                    <h3 className="text-sm font-bold text-on-surface">Selected Errand Tracker</h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Pick any claimed task from the list on the left to see progress nodes, address details, customer delivery checklists, and chat routing logs.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeRunnerTab === 'earnings' && (
            <div className="space-y-6">
              {/* Stats overview banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-surface-container-lowest border rounded-2xl shadow-sm text-left">
                  <span className="text-xs font-bold text-on-surface-variant block uppercase tracking-wider">
                    Total balance
                  </span>
                  <div className="text-2xl font-black text-primary mt-1.5">
                    £{currentUser?.balance.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-on-surface-variant block mt-1 font-medium">Available for simulated transfer</span>
                </div>

                <div className="p-5 bg-surface-container-lowest border rounded-2xl shadow-sm text-left">
                  <span className="text-xs font-bold text-on-surface-variant block uppercase tracking-wider">
                    Jobs Completed
                  </span>
                  <div className="text-2xl font-black text-[#006c49] mt-1.5">
                    {currentUser?.jobsCompleted || completedErrandsByRunner.length} Chores
                  </div>
                  <span className="text-[10px] text-on-surface-variant block mt-1 font-medium">All-time marketplace services</span>
                </div>

                <div className="p-5 bg-surface-container-lowest border rounded-2xl shadow-sm text-left">
                  <span className="text-xs font-bold text-on-surface-variant block uppercase tracking-wider">
                    Claim Success rate
                  </span>
                  <div className="text-2xl font-black text-amber-600 mt-1.5">
                    99.2% Rating
                  </div>
                  <span className="text-[10px] text-on-surface-variant block mt-1 font-medium">Based on 5-Star delivery reports</span>
                </div>
              </div>

              {/* Weekly earnings income graphics representation */}
              <div className="bg-surface-container-lowest border rounded-3xl p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-sm font-black text-[#0b1c30]">Weekly Income Distribution (£)</h3>
                  <p className="text-xs text-on-surface-variant">Telemetry log of earnings from active transit jobs claimed</p>
                </div>

                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyEarningsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFF4FF" />
                      <XAxis dataKey="name" fontSize={11} stroke="#737686" />
                      <YAxis fontSize={11} stroke="#737686" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e5eeff' }}
                        itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="amount" fill="#004ac6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Past Runner Completed list */}
              <div className="bg-surface-container-lowest border rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-black text-[#0b1c30] mb-3">Claim logs</h3>
                {completedErrandsByRunner.length === 0 ? (
                  <p className="text-xs text-on-surface-variant text-center py-4">No completed tasks yet. Go accept jobs on the board and drive!</p>
                ) : (
                  <div className="space-y-2.5">
                    {completedErrandsByRunner.map((job) => (
                      <div key={job.id} className="p-3 bg-surface rounded-xl border flex justify-between items-center">
                        <div>
                          <h4 className="text-xs font-bold text-on-surface">{job.title}</h4>
                          <span className="text-[10px] text-on-surface-variant block mt-0.5">Finished on: {new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className="text-xs font-bold text-[#006c49] bg-emerald-50 px-2 py-1 rounded-md">
                          +£{job.payout.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline Icon to keep modular and prevent types failure
function ClipBoardCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 0A48.536 48.536 0 0 1 12 3m0 0c2.917 0 5.747.294 8.5.862m-21 10.398c0-1.135.845-2.098 1.976-2.192 1.285-.107 2.574-.188 3.864-.241m0 0A49.613 49.613 0 0 1 8 10.5c3.098-.318 6.23-.482 9.402-.482m-12.402 0c3.098-.318 6.23-.482 9.402-.482"
      />
    </svg>
  );
}
