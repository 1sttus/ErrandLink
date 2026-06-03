import React, { useState } from 'react';
import { useStore } from '../context/StateContext';
import {
  Shield, Scale, Users, Gavel, DollarSign, Activity, AlertTriangle, 
  CheckCircle2, RefreshCw, LogOut, ArrowRight, Wallet, History, ToggleLeft, Award
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    currentUser,
    errands,
    transactions,
    resolveDispute,
    switchActiveRole,
    logoutUser,
    setView,
    currency,
    setCurrency,
    formatPrice
  } = useStore();

  const [activeTab, setActiveTab] = useState<'court' | 'ledger' | 'metrics'>('court');
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);

  // Filter disputes
  const disputedErrands = errands.filter(e => e.status === 'disputed');
  const currentDispute = errands.find(e => e.id === selectedDisputeId);

  // Metrics calculations
  const totalEscrowVolumeInGbp = errands.reduce((acc, curr) => acc + curr.totalEscrowAmount, 0);
  const activeEscrowHoldingGbp = errands
    .filter(e => e.escrowStatus === 'held' || e.escrowStatus === 'frozen')
    .reduce((acc, curr) => acc + curr.totalEscrowAmount, 0);

  const platformEarningsGbp = transactions
    .filter(t => t.category === 'platform_commission')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const customerRefundVolumeGbp = transactions
    .filter(t => t.category === 'refund')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="w-full min-h-screen bg-[#070e17] text-slate-100 flex flex-col pt-0 pb-16">
      {/* Admin header bar */}
      <div className="w-full bg-[#0a1420] border-b border-blue-900/40 sticky top-0 z-20 shadow-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-500/30 bg-cyan-950/50 flex items-center justify-center text-cyan-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black text-white">{currentUser?.name || 'ErrandLink Super Admin'}</h2>
              <span className="text-[9px] uppercase font-bold tracking-widest bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full">
                OPS OFFICER
              </span>
            </div>
            <p className="text-xs text-slate-400">ErrandLink Operational Command Core (Lagos, NG)</p>
          </div>
        </div>

        {/* Global Action Switcher */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="bg-[#111f30] px-3 py-1 flex items-center gap-2 rounded-xl border border-blue-900/20 text-[11px] text-slate-350">
            <span className="font-bold">Access Role:</span>
            <button
              onClick={() => switchActiveRole('customer')}
              className="px-2 py-0.5 bg-blue-900/30 text-blue-300 rounded border border-blue-800 cursor-pointer text-[10px]"
            >
              Shopper view
            </button>
            <button
              onClick={() => switchActiveRole('runner')}
              className="px-2 py-0.5 bg-orange-950 text-orange-400 rounded border border-orange-900 cursor-pointer text-[10px]"
            >
              Rider view
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-[#111f30] px-2.5 py-1 rounded-xl border border-blue-900/20">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Currency:</span>
            <button
              onClick={() => setCurrency(currency === 'NGN' ? 'GBP' : 'NGN')}
              className="px-2 py-0.5 rounded text-[10px] uppercase font-black cursor-pointer bg-[#182d44] text-cyan-400 border border-cyan-700/30 hover:bg-[#1a3452]"
            >
              {currency === 'NGN' ? '🇳🇬 NGN (₦)' : '🇬🇧 GBP (£)'}
            </button>
          </div>

          <button
            onClick={logoutUser}
            className="p-2 bg-red-950/40 hover:bg-red-900/30 text-red-400 duration-200 border border-red-900/30 rounded-xl cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-[1240px] mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#0a1420] p-4 rounded-3xl border border-blue-950 shadow-sm space-y-1.5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-2">
              Platform Controls
            </h3>
            
            <button
              onClick={() => setActiveTab('court')}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'court'
                  ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-800/40'
                  : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Scale className="w-4 h-4" /> Resolution Court
              </div>
              {disputedErrands.length > 0 && (
                <span className="text-[10px] bg-red-950 border border-red-800 text-red-400 font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                  {disputedErrands.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('ledger')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'ledger'
                  ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-800/40'
                  : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <History className="w-4 h-4" /> System Ledger
            </button>

            <button
              onClick={() => setActiveTab('metrics')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'metrics'
                  ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-800/40'
                  : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <Activity className="w-4 h-4" /> Operations Audit
            </button>
          </div>

          {/* Core Escrow Health badge */}
          <div className="p-4 bg-[#0a1420] border border-emerald-950 rounded-3xl text-left">
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-1">
              ✓ PROTECTED ESCROW CAPITAL
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              Platform operates on a full pre-funded asset protocol. Runners are guaranteed payouts as disputes undergo rigorous manual clearance checks.
            </p>
          </div>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-9 space-y-6 text-left">
          {/* Quick Metrics Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0a1420] p-4.5 rounded-2xl border border-blue-950 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Currently Locked Escrow</span>
              <span className="text-xl font-bold font-mono text-cyan-400 block mt-1">{formatPrice(activeEscrowHoldingGbp)}</span>
              <span className="text-[9px] text-slate-400 block mt-1">Held securely in trust</span>
            </div>
            <div className="bg-[#0a1420] p-4.5 rounded-2xl border border-blue-950 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Service Commissions</span>
              <span className="text-xl font-bold font-mono text-emerald-400 block mt-1">{formatPrice(platformEarningsGbp)}</span>
              <span className="text-[9px] text-emerald-400 block mt-1">All-time revenue streams</span>
            </div>
            <div className="bg-[#0a1420] p-4.5 rounded-2xl border border-blue-950 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Total Refund Volume</span>
              <span className="text-xl font-bold font-mono text-indigo-400 block mt-1">{formatPrice(customerRefundVolumeGbp)}</span>
              <span className="text-[9px] text-indigo-400 block mt-1">Disputes processed</span>
            </div>
          </div>

          {/* ACTIVE TAB - RESOLUTION COURT */}
          {activeTab === 'court' && (
            <div className="bg-[#0a1420] p-6 rounded-3xl border border-blue-950 space-y-6">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-red-400" /> Administrative Dispute Resolution Court
                </h3>
                <p className="text-xs text-slate-400 mt-1">Analyse statements, images, and track logistics trails to deliver immediate verdicts.</p>
              </div>

              {disputedErrands.length === 0 ? (
                <div className="py-12 border-2 border-dashed border-[#132338] rounded-2xl text-center">
                  <p className="text-sm text-slate-400 font-bold">🕊️ Excellent status: No unresolved dispute locks exist!</p>
                  <p className="text-xs text-slate-400 mt-1">Your courier dispatch operations are flowing smoothly.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* Left Column: List of disputes */}
                  <div className="md:col-span-2 space-y-2 border-r border-[#132338] pr-0 md:pr-4">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block mb-2 px-1">Awaiting Verdict</span>
                    {disputedErrands.map(e => (
                      <button
                        key={e.id}
                        onClick={() => setSelectedDisputeId(e.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                          selectedDisputeId === e.id
                            ? 'bg-blue-950/50 border-cyan-500 text-white'
                            : 'bg-[#0d1624] border-transparent hover:bg-slate-900/60 text-slate-300'
                        }`}
                      >
                        <span className="text-xs font-bold block truncate">{e.title}</span>
                        <div className="flex items-center justify-between text-[10px] mt-2 text-slate-400">
                          <span className="font-semibold text-red-400">🚨 {e.disputeReason}</span>
                          <span className="font-black">{formatPrice(e.runnerFee)}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Right Column: Detailed Dispute Profile */}
                  <div className="md:col-span-3 space-y-4">
                    {currentDispute ? (
                      <div className="bg-[#0e1b2c] p-5 rounded-2xl border border-blue-950 space-y-4">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-[9px] tracking-widest font-black uppercase text-cyan-400 block">CASE RECORD FILE</span>
                            <h4 className="text-sm font-black text-white mt-1">{currentDispute.title}</h4>
                          </div>
                          <span className="text-xs font-bold font-mono bg-red-950 border border-red-900 text-red-400 px-3 py-1 rounded-lg">
                            {formatPrice(currentDispute.totalEscrowAmount)}
                          </span>
                        </div>

                        <div className="text-xs space-y-2 bg-[#09111c] p-3 rounded-xl border border-blue-950">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Shopper / Customer:</span>
                            <span className="font-bold text-white">{currentDispute.customerName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Rider / Runner:</span>
                            <span className="font-bold text-white">{currentDispute.runnerName || 'None assigned'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Vendor Partner:</span>
                            <span className="font-bold text-white">{currentDispute.vendorName || 'Not a Vendor Order'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Created date:</span>
                            <span className="font-medium text-slate-300">{new Date(currentDispute.createdAt).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Statement and notes */}
                        <div className="space-y-1.5 align-left">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Dispute Reason / Statement:</span>
                          <div className="p-3 bg-red-955/30 border border-red-950/50 rounded-xl text-xs text-red-200">
                            <strong>Reason:</strong> {currentDispute.disputeReason}
                            <p className="mt-1.5 italic text-slate-300">"{currentDispute.disputeNotes || 'No notes added'}"</p>
                          </div>
                        </div>

                        {/* Dropoff notes or Courier comment proof if available */}
                        {currentDispute.deliveryNotes && (
                          <div className="space-y-1.5 align-left">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Rider Proof & Delivery Comments:</span>
                            <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-xs text-emerald-250">
                              "{currentDispute.deliveryNotes}"
                            </div>
                          </div>
                        )}

                        {/* Interactive Judge controls */}
                        <div className="pt-2 border-t border-[#132338] space-y-2">
                          <span className="text-[10px] font-black tracking-widest text-[#d8f8ed] block">⚖️ ADJUDICATE COURT VERDICT</span>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                resolveDispute(currentDispute.id, 'refund_customer');
                                setSelectedDisputeId(null);
                                alert('⚖️ COURT RULING DIRECTIVE: Escrow fully reversed and credited back to Shopper.');
                              }}
                              className="py-2.5 bg-red-800 hover:bg-red-700 text-white font-extrabold text-xs cursor-pointer rounded-xl transition duration-200"
                            >
                              Reverse & Refund Customer
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                resolveDispute(currentDispute.id, 'pay_runner');
                                setSelectedDisputeId(null);
                                alert('⚖️ COURT RULING DIRECTIVE: Escrow released and runner funded successfully.');
                              }}
                              className="py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs cursor-pointer rounded-xl transition duration-200"
                            >
                              Approve & Release to Runner
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 border-2 border-dashed border-[#132338] rounded-2xl text-center text-slate-400">
                        <p className="text-xs font-bold">Please click on a dispute trace from the sidebar list to inspect case details.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE TAB - SYSTEM LEDGER */}
          {activeTab === 'ledger' && (
            <div className="bg-[#0a1420] p-6 rounded-3xl border border-blue-950 space-y-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-400" /> Decentralised Escrow Ledger (Audit Trail)
                </h3>
                <p className="text-xs text-slate-400 mt-1">Platform ledger logs all real-time wallet funding, escrows holds, releases, or reversals.</p>
              </div>

              {transactions.length === 0 ? (
                <p className="text-xs text-slate-405 text-center py-6">No recorded transaction traces.</p>
              ) : (
                <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2">
                  {transactions.map(t => {
                    const isDeb = t.type === 'debit';
                    return (
                      <div key={t.id} className="p-3.5 bg-[#09111c] border border-blue-950/80 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs shrink-0 ${
                            t.category === 'escrow_hold' ? 'bg-amber-950 text-amber-400 border border-amber-900/50' :
                            t.category === 'refund' ? 'bg-red-950 text-red-400 border border-red-900/50' :
                            t.category === 'withdrawal' ? 'bg-indigo-950 text-indigo-400 border border-indigo-900/50' :
                            'bg-emerald-950 text-emerald-400 border border-emerald-900/50'
                          }`}>
                            {t.category === 'escrow_hold' ? '🔑' : t.category === 'refund' ? '⚖️' : t.category === 'withdrawal' ? '📤' : '📥'}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">{t.title}</span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 leading-none">
                              <span className="font-mono">ID: {t.id}</span>
                              <span>•</span>
                              <span>{new Date(t.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <span className={`text-xs font-bold font-mono tracking-wide ${isDeb ? 'text-red-400' : 'text-emerald-400'}`}>
                          {isDeb ? '-' : '+'} {formatPrice(t.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ACTIVE TAB - METRICS */}
          {activeTab === 'metrics' && (
            <div className="bg-[#0a1420] p-6 rounded-3xl border border-blue-950 space-y-6">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" /> Administrative Operations Audit Overview
                </h3>
                <p className="text-xs text-slate-400 mt-1">Platform operational health stats and structural parameters for Nigeria (Lagos branch).</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nigeria Metrics card */}
                <div className="p-5 bg-[#0e1b2c] rounded-2xl border border-blue-950 space-y-3">
                  <h4 className="text-xs font-black uppercase text-cyan-400">🇳🇬 Nigeria MVP Status Summary</h4>
                  <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                    We have successfully calibrated the NGN-GBP exchange model to <strong>₦2,000 / £1</strong>. Runners withdraw earnings instantly into Moniepoint, OPay, and traditional bank cards.
                  </p>
                  <div className="p-3 bg-[#09111c] rounded-xl border border-blue-950 flex justify-between text-xs">
                    <span className="text-slate-400">NIP Bank Settlement:</span>
                    <span className="font-bold text-emerald-400">ACTIVE (Instant)</span>
                  </div>
                  <div className="p-3 bg-[#09111c] rounded-xl border border-blue-950 flex justify-between text-xs">
                    <span className="text-slate-400">Mock Paystack API Gate:</span>
                    <span className="font-bold text-emerald-400">CALIBRATED</span>
                  </div>
                </div>

                {/* Operations checklist */}
                <div className="p-5 bg-[#0e1b2c] rounded-2xl border border-blue-950 space-y-3.5">
                  <h4 className="text-xs font-black uppercase text-emerald-400">🛡️ Platform Operations Checklist</h4>
                  <div className="space-y-2">
                    {[
                      { l: 'Guarantor Verification Standard', active: true },
                      { l: 'Lagos Road - Traffic Index multipliers', active: true },
                      { l: 'Courier NIN and BVN checks', active: true },
                      { l: 'Smart Contract / Handshake PIN Escrow', active: true }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-slate-300 font-medium">{item.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
