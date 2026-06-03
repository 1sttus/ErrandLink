import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle, AlertCircle, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SupportFeedback() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  
  // Validation States
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Custom CSS colors & gradients for active/hover states
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    // Email validation
    if (!email.trim()) {
      setEmailError('Email address is required.');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    } else {
      setEmailError('');
    }

    // Message validation
    if (!message.trim()) {
      setMessageError('Please enter details about your request.');
      hasError = true;
    } else {
      setMessageError('');
    }

    if (hasError) return;

    // Simulate successful form dispatch
    console.log('Support Ticket Created:', { name, email, message, isUrgent, timestamp: new Date() });
    setIsSubmitted(true);

    // Auto-close success message after 3 seconds and reset
    setTimeout(() => {
      setIsSubmitted(false);
      setIsOpen(false);
      setEmail('');
      setName('');
      setMessage('');
      setIsUrgent(false);
    }, 4000);
  };

  return (
    <>
      {/* Floating Action Help Trigger */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
        <motion.button
          id="support-fab"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-full shadow-xl cursor-pointer border backdrop-blur-md transition-all duration-300 ${
            isHovered 
              ? 'bg-gradient-to-r from-indigo-500/80 to-cyan-500/80 text-white border-cyan-400' 
              : 'bg-white/10 hover:bg-white/15 text-primary border-primary/20'
          }`}
        >
          <MessageSquare className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-bold tracking-see">Help & feedback</span>
        </motion.button>
      </div>

      {/* Mobile support footer trigger block */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-[#050508]/90 border-t border-surface-container-high flex justify-center">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full max-w-sm flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold bg-white/10 border border-primary/20 text-indigo-300"
        >
          <MessageSquare className="w-4 h-4" /> Got questions? Open Support Center
        </button>
      </div>

      {/* Support Center Overlay & Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md glass-panel p-6 shadow-2xl relative overflow-hidden flex flex-col gap-4 text-left"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-indigo-500 to-cyan-400"></div>

              {/* Title Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-400" />
                    ErrandLink Support
                  </h3>
                  <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                    We usually respond in under 15 minutes.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsSubmitted(false);
                  }}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-on-surface-variant hover:text-white"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form container / success display */}
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Support Ticket Created Successfully</h4>
                    <p className="text-xs text-on-surface-variant mt-2 max-w-[280px] mx-auto leading-relaxed">
                      We have routed this issue to a Sandbox coordinator. We will reply to <strong>{email}</strong> shortly.
                    </p>
                  </div>
                  <div className="w-24 h-1 bg-emerald-500/35 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3.5, ease: "linear" }}
                      className="h-full bg-emerald-400"
                    />
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label className="block text-[10px] sm:text-xs font-black uppercase text-on-surface-variant tracking-wider mb-1.5">
                      Your Full Name <span className="text-[10px] text-on-surface-variant lowercase">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Julian Draxler"
                      className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-indigo-400 text-white placeholder-white/35 transition-colors"
                    />
                  </div>

                  {/* Email address with validation warnings */}
                  <div>
                    <label className="block text-[10px] sm:text-xs font-black uppercase text-on-surface-variant tracking-wider mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (e.target.value.trim() !== '') setEmailError('');
                        }}
                        placeholder="you@domain.com"
                        className={`w-full h-10 px-3 bg-white/5 border rounded-xl text-xs focus:outline-none text-white placeholder-white/35 transition-colors ${
                          emailError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-indigo-400'
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p className="text-[10px] text-red-500 font-extrabold flex items-center gap-1 mt-1.5">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" /> {emailError}
                      </p>
                    )}
                  </div>

                  {/* Urgent selector checkbox */}
                  <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <ShieldAlert className="w-4 h-4 text-orange-400" />
                      <div>
                        <span className="text-xs font-bold text-white block">Mark as Urgent</span>
                        <span className="text-[10px] text-on-surface-variant block">For active transit deliveries only</span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isUrgent}
                        onChange={(e) => setIsUrgent(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  {/* Message Detail Box */}
                  <div>
                    <label className="block text-[10px] sm:text-xs font-black uppercase text-on-surface-variant tracking-wider mb-1.5">
                      How can we help you? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (e.target.value.trim() !== '') setMessageError('');
                      }}
                      placeholder="Please trace your Order ID or describe delivery transit feedback..."
                      className={`w-full p-3 bg-white/5 border rounded-xl text-xs focus:outline-none text-white placeholder-white/35 transition-colors ${
                        messageError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-indigo-400'
                      }`}
                    />
                    {messageError && (
                      <p className="text-[10px] text-red-500 font-extrabold flex items-center gap-1 mt-1.5">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" /> {messageError}
                      </p>
                    )}
                  </div>

                  {/* Submit Button with interactive state */}
                  <div className="pt-2 flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 border border-white/10 hover:border-white/20 rounded-full text-xs font-bold text-on-surface-variant transition-colors cursor-pointer text-gray-300 bg-transparent"
                    >
                      Dismiss
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-cyan-500 hover:to-cyan-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit Request
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
