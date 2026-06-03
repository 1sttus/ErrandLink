import React, { createContext, useContext, useState, useEffect } from 'react';
import { Errand, VendorProduct, UserProfile, UserRole, Message, StoreVisitor, ErrandStatus, RunnerVerification, WalletTransaction } from '../types';

interface StateContextType {
  currentView: 'onboarding' | 'login' | 'signup' | 'customer' | 'runner' | 'vendor' | 'guest' | 'admin';
  selectedRoleForOnboarding: UserRole | null;
  currentUser: UserProfile | null;
  errands: Errand[];
  products: VendorProduct[];
  visitors: StoreVisitor[];
  transactions: WalletTransaction[];
  activeCustomerTab: 'need' | 'active' | 'history' | 'shop' | 'wallet';
  activeRunnerTab: 'jobs' | 'active' | 'earnings' | 'verification';
  activeVendorTab: 'orders' | 'products' | 'analytics' | 'visitors';
  selectedErrandId: string | null;
  
  // Actions
  setView: (view: 'onboarding' | 'login' | 'signup' | 'customer' | 'runner' | 'vendor' | 'guest' | 'admin') => void;
  selectRoleForOnboarding: (role: UserRole | null) => void;
  loginUser: (role: UserRole, email?: string) => void;
  signupUser: (role: UserRole, name: string, email: string) => void;
  logoutUser: () => void;
  
  // Escrow & OTP & Dispute methods
  createErrand: (errand: Omit<Errand, 'id' | 'status' | 'customerId' | 'customerName' | 'runnerId' | 'runnerName' | 'createdAt' | 'messages' | 'deliveryPin' | 'escrowStatus' | 'isFunded' | 'platformFee' | 'runnerFee' | 'totalEscrowAmount' | 'pickupLocation' | 'deliveryLocation'>) => void;
  fundAndPublishErrand: (errandId: string, paymentMethod: 'wallet' | 'card' | 'bank') => { success: boolean; error?: string };
  acceptErrand: (errandId: string, runnerId: string, runnerName: string) => void;
  submitDeliveryProof: (errandId: string, deliveryPhoto: string, notes: string) => void;
  verifyDeliveryOTP: (errandId: string, otp: string) => { success: boolean; error?: string };
  raiseDispute: (errandId: string, reason: string, notes: string) => void;
  resolveDispute: (errandId: string, resolution: 'refund_customer' | 'pay_runner') => void;
  
  // Wallets & Verification methods
  fundCustomerWallet: (amount: number) => void;
  withdrawRunnerEarnings: (amount: number, bankName: string, bankSortCode: string, bankAccountNumber: string) => { success: boolean; error?: string };
  updateRunnerVerification: (field: keyof RunnerVerification, value: boolean) => void;
  
  advanceErrandStatus: (errandId: string) => void;
  cancelErrand: (errandId: string) => void;
  sendMessage: (errandId: string, text: string, senderRole: 'customer' | 'runner') => void;
  
  // Vendor actions
  createProduct: (product: Omit<VendorProduct, 'id'>) => void;
  orderProduct: (productId: string, quantity: number, address: string) => void;
  deleteProduct: (productId: string) => void;
  toggleProductAvailability: (productId: string) => void;
  switchActiveRole: (role: UserRole) => void;
  logVisitorActivity: (name: string, action: string, role: 'guest' | 'customer' | 'runner') => void;
  sendThankYouToVisitor: (visitorId: string, customMessage: string) => void;
  
  // Selection
  setSelectedErrandId: (id: string | null) => void;
  setCustomerTab: (tab: 'need' | 'active' | 'history' | 'shop' | 'wallet') => void;
  setRunnerTab: (tab: 'jobs' | 'active' | 'earnings' | 'verification') => void;
  setVendorTab: (tab: 'orders' | 'products' | 'analytics' | 'visitors') => void;

  // Simulator helper
  simulateRunnerActivity: (errandId: string) => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

const INITIAL_PRODUCTS: VendorProduct[] = [
  {
    id: 'prod-1',
    name: 'Fresh Organic Strawberries',
    price: 6.99,
    description: 'Freshly harvested sweet organic strawberries from the valley organic farm.',
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=200',
    category: 'Groceries',
    stock: 25,
  },
  {
    id: 'prod-2',
    name: 'Artisanal Sourdough Bread',
    price: 5.50,
    description: 'Baked fresh daily using a 10-year old sourdough starter and organic flour.',
    imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=200',
    category: 'Bakery',
    stock: 12,
  },
  {
    id: 'prod-3',
    name: 'Cold-Pressed Green Juice',
    price: 7.25,
    description: 'Packed with organic kale, spinach, green apple, cucumber, lemon, and ginger.',
    imageUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587caa90?auto=format&fit=crop&q=80&w=200',
    category: 'Beverages',
    stock: 15,
  },
  {
    id: 'prod-4',
    name: 'Farm-Raised Brown Eggs (Dozen)',
    price: 4.80,
    description: 'Free-range organic chicken eggs with gorgeous deep golden yolks.',
    imageUrl: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=200',
    category: 'Dairy & Eggs',
    stock: 20,
  }
];

const INITIAL_ERRANDS: Errand[] = [
  {
    id: 'err-1',
    title: 'Grocery Pickup at Whole Foods',
    description: 'Need someone to pick up standard groceries. I have already ordered and paid for it on the app—just need a Runner with a car to collect it from the curbside spot and leave on my porch.',
    category: 'shopping',
    status: 'pending',
    payout: 18.50,
    location: '240 High St, Kensington',
    latitude: 51.5014,
    longitude: -0.1910,
    customerId: 'cust-2',
    customerName: 'Eleanor Vance',
    runnerId: null,
    runnerName: null,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    items: ['Whole Foods Pickup - Order #WF-9942A'],
    messages: [],
    deliveryPin: '2748',
    escrowStatus: 'held',
    isFunded: true,
    platformFee: 1.50,
    runnerFee: 18.50,
    totalEscrowAmount: 20.00,
    pickupLocation: 'Whole Foods Market, High St Kensington',
    deliveryLocation: '240 High St, Kensington'
  },
  {
    id: 'err-2',
    title: 'Urgent Vet Prescription Collect',
    description: 'Pick up allergy medication for my golden retriever from VetExpress Clinic and bring it to my address. No payment needed at counter, veterinarian has prescription details.',
    category: 'delivery',
    status: 'accepted',
    payout: 14.00,
    location: 'VetExpress & Pharmacy, Bloomsbury',
    latitude: 51.5200,
    longitude: -0.1240,
    customerId: 'cust-3',
    customerName: 'Dr. Aaron Patel',
    runnerId: 'run-1',
    runnerName: 'Marcus Miller (You)',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
    items: ['Apoquel Prescription (30x 16mg)', 'Flea & Tick Chewables'],
    messages: [
      {
        id: 'msg-1',
        senderRole: 'customer',
        text: 'Hello Marcus, thanks for accepting. The clinic closes at 7 PM, so please arrive before then!',
        timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString()
      },
      {
        id: 'msg-2',
        senderRole: 'runner',
        text: 'No problem! I am heading out now and will arrive at the clinic in 15 minutes.',
        timestamp: new Date(Date.now() - 3600000 * 3.4).toISOString()
      }
    ],
    deliveryPin: '3941',
    escrowStatus: 'held',
    isFunded: true,
    platformFee: 1.50,
    runnerFee: 14.00,
    totalEscrowAmount: 15.50,
    pickupLocation: 'VetExpress Clinic Bloomsbury, WC1H',
    deliveryLocation: 'Bloomsbury Terrace Apartment 3'
  },
  {
    id: 'err-3',
    title: 'Walk Max the Golden Retriever',
    description: 'Need an experienced pet lover to walk our energetic dog Max for 45 minutes around Holland Park. He has a harness and leash waiting inside the porch gates.',
    category: 'pet',
    status: 'pending',
    payout: 22.00,
    location: 'Melbury Road, Kensington',
    latitude: 51.4988,
    longitude: -0.2012,
    customerId: 'cust-4',
    customerName: 'Sarah Jenkins',
    runnerId: null,
    runnerName: null,
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
    items: ['45-minute active outdoor dog walk', 'Refill water bowl in kitchen entrance'],
    messages: [],
    deliveryPin: '8023',
    escrowStatus: 'held',
    isFunded: true,
    platformFee: 1.50,
    runnerFee: 22.00,
    totalEscrowAmount: 23.50,
    pickupLocation: 'Holland Park Pet Lodge',
    deliveryLocation: 'Melbury Road, Kensington'
  },
  {
    id: 'err-4',
    title: 'Urgent organic sourdough courier',
    description: 'Sourdough order pick-up from Artisanal Bakery corner to Deliver in Chelsea.',
    category: 'vendor_order',
    status: 'completed',
    payout: 11.50,
    location: 'London Artisan Bakery -> Chelsea SW3',
    latitude: 51.4875,
    longitude: -0.1685,
    customerId: 'cust-1',
    customerName: 'Alex Thorne (You)',
    runnerId: 'run-1',
    runnerName: 'Marcus Miller (You)',
    vendorId: 'vendor-1',
    vendorName: 'London Artisan Bakery',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(), // 8 hours ago
    items: ['Artisanal Sourdough Bread x2'],
    messages: [
      {
        id: 'msg-3',
        senderRole: 'runner',
        text: 'Delivered at your front door, thank you!',
        timestamp: new Date(Date.now() - 3600000 * 7.5).toISOString()
      }
    ],
    deliveryPin: '5812',
    escrowStatus: 'released',
    isFunded: true,
    platformFee: 1.50,
    runnerFee: 11.50,
    totalEscrowAmount: 13.00,
    pickupLocation: 'London Artisan Bakery, SW3 3AH',
    deliveryLocation: 'Chelsea Residential Suites'
  }
];

const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-1',
    userId: 'cust-1',
    amount: 100.00,
    type: 'credit',
    title: 'Wallet Top-up (Fast Debit)',
    category: 'wallet_fund',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'tx-2',
    userId: 'run-1',
    amount: 75.24,
    type: 'credit',
    title: 'Delivery Earnings (Bakery Order #5812)',
    category: 'runner_payout',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    errandId: 'err-4'
  }
];

const INITIAL_VISITORS: StoreVisitor[] = [
  {
    id: 'vis-1',
    name: 'Melissa G. (Chelsea)',
    visitedAt: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
    action: 'Browsed Cold-Pressed Green Juice',
    role: 'guest',
    thanked: false,
  },
  {
    id: 'vis-2',
    name: 'Arthur Dent (Kensington)',
    visitedAt: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
    action: 'Searched "sourdough bread" menu',
    role: 'customer',
    thanked: true,
    thankedMessage: 'Thanks for looking around! We baked our sourdough fresh this morning. Grab one now!'
  },
  {
    id: 'vis-3',
    name: 'Rory Fletcher (Eco-Runner)',
    visitedAt: new Date(Date.now() - 7920000).toISOString(), // 2.2 hours ago
    action: 'Viewed merchant courier dispatch schedules',
    role: 'runner',
    thanked: false,
  },
  {
    id: 'vis-4',
    name: 'Eleanor Vance (High St)',
    visitedAt: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    action: 'Browsed Fresh Organic Strawberries',
    role: 'customer',
    thanked: false,
  }
];

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setView] = useState<'onboarding' | 'login' | 'signup' | 'customer' | 'runner' | 'vendor' | 'guest' | 'admin'>('guest');
  const [selectedRoleForOnboarding, selectRoleForOnboarding] = useState<UserRole | null>(null);
  
  // Persistent items using localStorage
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('errandlink_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [errands, setErrands] = useState<Errand[]>(() => {
    const saved = localStorage.getItem('errandlink_errands');
    return saved ? JSON.parse(saved) : INITIAL_ERRANDS;
  });

  const [products, setProducts] = useState<VendorProduct[]>(() => {
    const saved = localStorage.getItem('errandlink_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [visitors, setVisitors] = useState<StoreVisitor[]>(() => {
    const saved = localStorage.getItem('errandlink_visitors');
    return saved ? JSON.parse(saved) : INITIAL_VISITORS;
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('errandlink_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // UI Tabs State
  const [activeCustomerTab, setCustomerTab] = useState<'need' | 'active' | 'history' | 'shop' | 'wallet'>('need');
  const [activeRunnerTab, setRunnerTab] = useState<'jobs' | 'active' | 'earnings' | 'verification'>('jobs');
  const [activeVendorTab, setVendorTab] = useState<'orders' | 'products' | 'analytics' | 'visitors'>('orders');
  const [selectedErrandId, setSelectedErrandId] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('errandlink_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('errandlink_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('errandlink_errands', JSON.stringify(errands));
  }, [errands]);

  useEffect(() => {
    localStorage.setItem('errandlink_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('errandlink_visitors', JSON.stringify(visitors));
  }, [visitors]);

  useEffect(() => {
    localStorage.setItem('errandlink_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Load active view state based on user role if logged in on start
  useEffect(() => {
    if (currentUser) {
      setView(currentUser.role);
    } else {
      setView('guest');
    }
  }, [currentUser]);

  const loginUser = (role: UserRole, email: string = '') => {
    // Generate mock profile based on role
    const defaultProfiles: Record<UserRole, UserProfile> = {
      customer: {
        id: 'cust-1',
        role: 'customer',
        name: 'Alex Thorne',
        email: email || 'alex.thorne@errandlink.com',
        balance: 150.00,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        rating: 4.9,
      },
      runner: {
        id: 'run-1',
        role: 'runner',
        name: 'Marcus Miller',
        email: email || 'marcus.runner@errandlink.com',
        balance: 75.24,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        rating: 4.8,
        jobsCompleted: 34,
        todayEarnings: 75.24,
        pendingEscrowEarnings: 15.50,
        bankName: 'Monzo Bank',
        bankSortCode: '04-00-04',
        bankAccountNumber: '94821034',
        verification: {
          phoneVerified: true,
          idVerified: true,
          selfieVerified: true,
          bankVerified: true
        }
      },
      vendor: {
        id: 'vendor-1',
        role: 'vendor',
        name: 'London Artisan Bakery',
        email: email || 'bakes@artisanbakery.co.uk',
        balance: 1420.50,
        avatarUrl: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&q=80&w=150',
        rating: 4.7,
      },
      admin: {
        id: 'admin-1',
        role: 'admin',
        name: 'Devin ErrandLink Admin',
        email: email || 'admin@errandlink.com',
        balance: 150000.00,
        avatarUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=150',
        rating: 5.0
      }
    };

    const user = defaultProfiles[role];
    setCurrentUser(user);
    setView(role);
  };

  const signupUser = (role: UserRole, name: string, email: string) => {
    const user: UserProfile = {
      id: `${role}-${Math.random().toString(36).substr(2, 9)}`,
      role,
      name,
      email,
      balance: role === 'runner' ? 0.00 : 100.00, // free startup credit for shoppers
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      rating: 5.0,
      ...(role === 'runner' ? { 
        jobsCompleted: 0,
        todayEarnings: 0,
        pendingEscrowEarnings: 0,
        bankName: '',
        bankSortCode: '',
        bankAccountNumber: '',
        verification: {
          phoneVerified: false,
          idVerified: false,
          selfieVerified: false,
          bankVerified: false
        }
      } : {})
    };
    setCurrentUser(user);
    setView(role);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    selectRoleForOnboarding(null);
    setView('onboarding');
  };

  const createErrand = (errandData: Omit<Errand, 'id' | 'status' | 'customerId' | 'customerName' | 'runnerId' | 'runnerName' | 'createdAt' | 'messages' | 'deliveryPin' | 'escrowStatus' | 'isFunded' | 'platformFee' | 'runnerFee' | 'totalEscrowAmount' | 'pickupLocation' | 'deliveryLocation'>) => {
    if (!currentUser) return;
    
    const payout = errandData.payout;
    const platformFee = 1.50;
    const totalCost = Number((payout + platformFee).toFixed(2));

    const newErrand: Errand = {
      ...errandData,
      id: `err-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      customerId: currentUser.id,
      customerName: currentUser.name,
      runnerId: null,
      runnerName: null,
      createdAt: new Date().toISOString(),
      messages: [],
      deliveryPin: Math.floor(1000 + Math.random() * 9000).toString(),
      escrowStatus: 'none',
      isFunded: false,
      platformFee,
      runnerFee: payout,
      totalEscrowAmount: totalCost,
      pickupLocation: errandData.category === 'vendor_order' ? 'London Artisan Bakery' : 'Specified Pickup Location',
      deliveryLocation: errandData.location
    };

    setErrands(prev => [newErrand, ...prev]);
    setCustomerTab('active');
    setSelectedErrandId(newErrand.id);
  };

  const fundAndPublishErrand = (errandId: string, paymentMethod: 'wallet' | 'card' | 'bank') => {
    const errand = errands.find(e => e.id === errandId);
    if (!errand) return { success: false, error: 'Errand not found' };
    
    const cost = errand.totalEscrowAmount;
    
    if (paymentMethod === 'wallet') {
      if (!currentUser) return { success: false, error: 'Must be logged in to pay' };
      if (currentUser.balance < cost) {
        return { success: false, error: `Insufficient wallet balance. You need £${cost.toFixed(2)} but only have £${currentUser.balance.toFixed(2)}.` };
      }
      
      // Deduct from customer wallet
      setCurrentUser(prev => prev ? { ...prev, balance: Number((prev.balance - cost).toFixed(2)) } : null);
    }
    
    // Register Transaction
    const newTx: WalletTransaction = {
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      userId: errand.customerId,
      amount: cost,
      type: 'debit',
      title: `Escrow Secured (${paymentMethod.toUpperCase()})`,
      category: 'escrow_hold',
      timestamp: new Date().toISOString(),
      errandId: errand.id
    };
    
    setTransactions(prev => [newTx, ...prev]);
    
    // Set Errand properties
    setErrands(prev => prev.map(e => {
      if (e.id === errandId) {
        return {
          ...e,
          isFunded: true,
          escrowStatus: 'held',
          status: 'pending' as ErrandStatus
        };
      }
      return e;
    }));
    
    return { success: true };
  };

  const acceptErrand = (errandId: string, runnerId: string, runnerName: string) => {
    setErrands(prev => prev.map(errand => {
      if (errand.id === errandId) {
        return {
          ...errand,
          status: 'accepted' as ErrandStatus,
          runnerId,
          runnerName,
          messages: [
            ...errand.messages,
            {
              id: `msg-acc-${Date.now()}`,
              senderRole: 'runner',
              text: `Hello! I have accepted your Errand request and I am en route now.`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return errand;
    }));
  };

  const submitDeliveryProof = (errandId: string, deliveryPhoto: string, notes: string) => {
    setErrands(prev => prev.map(e => {
      if (e.id === errandId) {
        return {
          ...e,
          status: 'awaiting_otp' as ErrandStatus,
          deliveryPhoto,
          deliveryNotes: notes,
          messages: [
            ...e.messages,
            {
              id: `msg-pod-${Date.now()}`,
              senderRole: 'runner',
              text: `📍 Proof of delivery uploaded! Delivery Notes: "${notes || 'None'}". Awaiting OTP confirmationPIN from customer to finalize release.`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return e;
    }));
  };

  const verifyDeliveryOTP = (errandId: string, otp: string) => {
    const errand = errands.find(e => e.id === errandId);
    if (!errand) return { success: false, error: 'Errand not found' };
    if (errand.deliveryPin !== otp.trim()) {
      return { success: false, error: 'Incorrect 4-digit Delivery PIN. Please ask the customer for their active code.' };
    }

    setErrands(prev => prev.map(e => {
      if (e.id === errandId) {
        return {
          ...e,
          status: 'completed' as ErrandStatus,
          escrowStatus: 'released',
          messages: [
            ...e.messages,
            {
              id: `msg-otp-${Date.now()}`,
              senderRole: 'runner',
              text: `✓ Handshake Verified! OTP PIN correct. Escrow Released: £${e.runnerFee.toFixed(2)} credited to runner.`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return e;
    }));

    if (errand.runnerId) {
      // Payout to active logged-in runner
      setCurrentUser(prev => {
        if (prev && prev.id === errand.runnerId) {
          const newBal = Number((prev.balance + errand.runnerFee).toFixed(2));
          const newToday = Number(((prev.todayEarnings || 0) + errand.runnerFee).toFixed(2));
          const newJobs = (prev.jobsCompleted || 0) + 1;
          const newPending = Math.max(0, Number(((prev.pendingEscrowEarnings || 0) - errand.runnerFee).toFixed(2)));
          return {
            ...prev,
            balance: newBal,
            todayEarnings: newToday,
            jobsCompleted: newJobs,
            pendingEscrowEarnings: newPending
          };
        }
        return prev;
      });

      // Payout run transaction trace
      const txRunner: WalletTransaction = {
        id: `tx-payout-${Math.random().toString(36).substr(2, 9)}`,
        userId: errand.runnerId,
        amount: errand.runnerFee,
        type: 'credit',
        title: `Runner Payout (Errand #${errand.id.substring(0, 5)})`,
        category: 'runner_payout',
        timestamp: new Date().toISOString(),
        errandId: errand.id
      };

      const txAdmin: WalletTransaction = {
        id: `tx-comm-${Math.random().toString(36).substr(2, 9)}`,
        userId: 'admin-1',
        amount: errand.platformFee,
        type: 'credit',
        title: `Platform Service Fee (Errand #${errand.id.substring(0, 5)})`,
        category: 'platform_commission',
        timestamp: new Date().toISOString(),
        errandId: errand.id
      };

      setTransactions(prev => [txRunner, txAdmin, ...prev]);
    }

    return { success: true };
  };

  const raiseDispute = (errandId: string, reason: string, notes: string) => {
    setErrands(prev => prev.map(e => {
      if (e.id === errandId) {
        return {
          ...e,
          status: 'disputed' as ErrandStatus,
          escrowStatus: 'frozen',
          disputeReason: reason,
          disputeNotes: notes,
          messages: [
            ...e.messages,
            {
              id: `msg-dispute-${Date.now()}`,
              senderRole: 'customer',
              text: `⚠️ Raised Dispute: [${reason.toUpperCase()}] - "${notes}". Escrow payment has been frozen.`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return e;
    }));
  };

  const resolveDispute = (errandId: string, resolution: 'refund_customer' | 'pay_runner') => {
    const errand = errands.find(e => e.id === errandId);
    if (!errand) return;

    setErrands(prev => prev.map(e => {
      if (e.id === errandId) {
        return {
          ...e,
          status: 'resolved' as ErrandStatus,
          escrowStatus: 'released',
          messages: [
            ...e.messages,
            {
              id: `msg-resolv-${Date.now()}`,
              senderRole: 'customer',
              text: `🏛️ Dispute Resolved by Platform Specialist. Verdict: ${resolution === 'refund_customer' ? 'Refunded customer in full' : 'Released funds to runner'}.`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return e;
    }));

    if (resolution === 'refund_customer') {
      setCurrentUser(prev => {
        if (prev && prev.id === errand.customerId) {
          return {
            ...prev,
            balance: Number((prev.balance + errand.totalEscrowAmount).toFixed(2))
          };
        }
        return prev;
      });

      const refundTx: WalletTransaction = {
        id: `tx-dispute-ref-${Math.random().toString(36).substr(2, 9)}`,
        userId: errand.customerId,
        amount: errand.totalEscrowAmount,
        type: 'credit',
        title: `Court Refund (Dispute Errand #${errand.id.substring(0, 5)})`,
        category: 'refund',
        timestamp: new Date().toISOString(),
        errandId: errand.id
      };
      setTransactions(prev => [refundTx, ...prev]);
    } else if (resolution === 'pay_runner' && errand.runnerId) {
      setCurrentUser(prev => {
        if (prev && prev.id === errand.runnerId) {
          return {
            ...prev,
            balance: Number((prev.balance + errand.runnerFee).toFixed(2)),
            todayEarnings: Number(((prev.todayEarnings || 0) + errand.runnerFee).toFixed(2))
          };
        }
        return prev;
      });

      const payoutTx: WalletTransaction = {
        id: `tx-dispute-pay-${Math.random().toString(36).substr(2, 9)}`,
        userId: errand.runnerId,
        amount: errand.runnerFee,
        type: 'credit',
        title: `Specialist Released Earnings (Errand #${errand.id.substring(0, 5)})`,
        category: 'runner_payout',
        timestamp: new Date().toISOString(),
        errandId: errand.id
      };
      setTransactions(prev => [payoutTx, ...prev]);
    }
  };

  const fundCustomerWallet = (amount: number) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? {
      ...prev,
      balance: Number((prev.balance + amount).toFixed(2))
    } : null);

    const checkTx: WalletTransaction = {
      id: `tx-fund-${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUser.id,
      amount,
      type: 'credit',
      title: 'Simulated Wallet Funding Link',
      category: 'wallet_fund',
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => [checkTx, ...prev]);
  };

  const withdrawRunnerEarnings = (amount: number, bankName: string, bankSortCode: string, bankAccountNumber: string) => {
    if (!currentUser) return { success: false, error: 'User session not active' };
    if (currentUser.balance < amount) {
      return { success: false, error: 'Insufficient wallet earnings balance' };
    }
    
    setCurrentUser(prev => prev ? {
      ...prev,
      balance: Number((prev.balance - amount).toFixed(2)),
      bankName,
      bankSortCode,
      bankAccountNumber
    } : null);

    const listTx: WalletTransaction = {
      id: `tx-withdraw-${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUser.id,
      amount,
      type: 'debit',
      title: `Withdrew Earnings to ${bankName}`,
      category: 'withdrawal',
      timestamp: new Date().toISOString()
    };

    setTransactions(prev => [listTx, ...prev]);
    return { success: true };
  };

  const updateRunnerVerification = (field: keyof RunnerVerification, value: boolean) => {
    setCurrentUser(prev => {
      if (prev && prev.role === 'runner') {
        const prevVerif = prev.verification || { phoneVerified: false, idVerified: false, selfieVerified: false, bankVerified: false };
        return {
          ...prev,
          verification: {
            ...prevVerif,
            [field]: value
          }
        };
      }
      return prev;
    });
  };

  const advanceErrandStatus = (errandId: string) => {
    setErrands(prev => prev.map(errand => {
      if (errand.id === errandId) {
        let nextStatus: ErrandStatus = errand.status;
        const msgList = [...errand.messages];

        if (errand.status === 'accepted') {
          nextStatus = 'runner_en_route';
          msgList.push({
            id: `msg-auto-${Date.now()}`,
            senderRole: 'runner',
            text: 'I am en route to collect the errand item now!',
            timestamp: new Date().toISOString()
          });
        } else if (errand.status === 'runner_en_route') {
          nextStatus = 'item_picked_up';
          msgList.push({
            id: `msg-auto-${Date.now()}`,
            senderRole: 'runner',
            text: 'We have picked up the items. Securing package in courier parcel container.',
            timestamp: new Date().toISOString()
          });
        } else if (errand.status === 'item_picked_up') {
          nextStatus = 'in_transit';
          msgList.push({
            id: `msg-auto-${Date.now()}`,
            senderRole: 'runner',
            text: 'Package in active transit. Turning on GPS tracker link.',
            timestamp: new Date().toISOString()
          });
        } else if (errand.status === 'in_transit') {
          nextStatus = 'delivered';
          msgList.push({
            id: `msg-auto-${Date.now()}`,
            senderRole: 'runner',
            text: 'Arrived at dropsite address node! Submitting Proof of Delivery proof cards.',
            timestamp: new Date().toISOString()
          });
        } else if (errand.status === 'delivered') {
          nextStatus = 'awaiting_otp';
        }

        return {
          ...errand,
          status: nextStatus,
          messages: msgList
        };
      }
      return errand;
    }));
  };

  const cancelErrand = (errandId: string) => {
    const errand = errands.find(e => e.id === errandId);
    if (!errand) return;
    
    // Refund customer
    if (errand.isFunded && currentUser && currentUser.id === errand.customerId) {
      setCurrentUser(prev => prev ? {
        ...prev,
        balance: Number((prev.balance + errand.totalEscrowAmount).toFixed(2))
      } : null);

      const refundTx: WalletTransaction = {
        id: `tx-cancel-refund-${Math.random().toString(36).substr(2, 9)}`,
        userId: errand.customerId,
        amount: errand.totalEscrowAmount,
        type: 'credit',
        title: `Refund (Cancelled Errand)`,
        category: 'refund',
        timestamp: new Date().toISOString(),
        errandId: errand.id
      };
      setTransactions(prev => [refundTx, ...prev]);
    }
    
    setErrands(prev => prev.filter(e => e.id !== errandId));
    setSelectedErrandId(null);
  };

  const sendMessage = (errandId: string, text: string, senderRole: 'customer' | 'runner') => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderRole,
      text,
      timestamp: new Date().toISOString()
    };

    setErrands(prev => prev.map(errand => {
      if (errand.id === errandId) {
        return {
          ...errand,
          messages: [...errand.messages, newMessage]
        };
      }
      return errand;
    }));
  };

  // Vendor actions
  const createProduct = (productData: Omit<VendorProduct, 'id'>) => {
    const newProduct: VendorProduct = {
      ...productData,
      isAvailable: productData.isAvailable !== false, // Default to true
      id: `prod-${Math.random().toString(36).substr(2, 9)}`
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const toggleProductAvailability = (productId: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isAvailable: p.isAvailable === false ? true : false } : p));
  };

  const switchActiveRole = (role: UserRole) => {
    if (currentUser) {
      const updatedProfile = { ...currentUser, role };
      setCurrentUser(updatedProfile);
      setView(role);
    }
  };

  const logVisitorActivity = (name: string, action: string, role: 'guest' | 'customer' | 'runner') => {
    const newVisitor: StoreVisitor = {
      id: `vis-${Math.random().toString(36).substr(2, 9)}`,
      name,
      visitedAt: new Date().toISOString(),
      action,
      role,
      thanked: false
    };
    setVisitors(prev => [newVisitor, ...prev.slice(0, 49)]);
  };

  const sendThankYouToVisitor = (visitorId: string, customMessage: string) => {
    setVisitors(prev => prev.map(v => {
      if (v.id === visitorId) {
        return {
          ...v,
          thanked: true,
          thankedMessage: customMessage
        };
      }
      return v;
    }));
  };

  const orderProduct = (productId: string, quantity: number, deliverAddress: string) => {
    const item = products.find(p => p.id === productId);
    if (!item || !currentUser) return;

    const payout = 5.00 + (quantity * 1.50);
    const platformFee = 1.50;
    const totalCost = Number((item.price * quantity + payout + platformFee).toFixed(2));
    
    if (currentUser.balance < totalCost) {
      alert("Insufficient funds in current customer profile to secure item cost + logistics escrow fee!");
      return;
    }

    // Deduct funds
    setCurrentUser(prev => prev ? {
      ...prev,
      balance: Number((prev.balance - totalCost).toFixed(2))
    } : null);

    // Reduce stock
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: Math.max(0, p.stock - quantity) } : p));

    const newErrand: Errand = {
      id: `err-${Math.random().toString(36).substr(2, 9)}`,
      title: `Deliver ${item.name} x${quantity}`,
      description: `Delivery request from ${item.category} Vendor: ${item.name} order needs swift transit to customer's home. Store has prepared dispatch packet, runner only needs pickup.`,
      category: 'vendor_order',
      status: 'pending',
      payout,
      location: `Artisanal Shop to ${deliverAddress}`,
      latitude: 51.52 + (Math.random() - 0.5) * 0.05,
      longitude: -0.12 + (Math.random() - 0.5) * 0.05,
      customerId: currentUser.id,
      customerName: currentUser.name,
      runnerId: null,
      runnerName: null,
      vendorId: 'vendor-1',
      vendorName: 'London Artisan Bakery',
      createdAt: new Date().toISOString(),
      items: [`${item.name} (Qty: ${quantity})`],
      messages: [],
      deliveryPin: Math.floor(1000 + Math.random() * 9000).toString(),
      escrowStatus: 'held',
      isFunded: true,
      platformFee,
      runnerFee: payout,
      totalEscrowAmount: Number((payout + platformFee).toFixed(2)),
      pickupLocation: 'London Artisan Bakery, SW3 3AH',
      deliveryLocation: deliverAddress
    };

    setErrands(prev => [newErrand, ...prev]);

    // Record hold transaction
    const newTx: WalletTransaction = {
      id: `tx-order-${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUser.id,
      amount: totalCost,
      type: 'debit',
      title: `Order & Delivery Escrow Secured: ${item.name}`,
      category: 'escrow_hold',
      timestamp: new Date().toISOString(),
      errandId: newErrand.id
    };
    setTransactions(prev => [newTx, ...prev]);

    setCustomerTab('active');
    setSelectedErrandId(newErrand.id);
  };

  // Background Simulator Helper supporting multi-step logistics progress
  const simulateRunnerActivity = (errandId: string) => {
    const target = errands.find(e => e.id === errandId);
    if (!target) return;

    if (target.status === 'pending') {
      setErrands(prev => prev.map(e => {
        if (e.id === errandId) {
          return {
            ...e,
            status: 'accepted' as ErrandStatus,
            runnerId: 'run-simulated',
            runnerName: 'Rory Fletcher (Pro-Runner)',
            messages: [
              ...e.messages,
              {
                id: `msg-sim-${Date.now()}`,
                senderRole: 'runner',
                text: "Hi! I have accepted your Errand request. I am nearby and preparing dispatch transit.",
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return e;
      }));
    } else if (target.status === 'accepted') {
      setErrands(prev => prev.map(e => {
        if (e.id === errandId) {
          return {
            ...e,
            status: 'runner_en_route' as ErrandStatus,
            messages: [
              ...e.messages,
              {
                id: `msg-sim-${Date.now()}`,
                senderRole: 'runner',
                text: "I am en route to collect the errand packet. Keeping pace active!",
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return e;
      }));
    } else if (target.status === 'runner_en_route') {
      setErrands(prev => prev.map(e => {
        if (e.id === errandId) {
          return {
            ...e,
            status: 'item_picked_up' as ErrandStatus,
            messages: [
              ...e.messages,
              {
                id: `msg-sim-${Date.now()}`,
                senderRole: 'runner',
                text: "I have securely collected the item package! Beginning outward transport.",
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return e;
      }));
    } else if (target.status === 'item_picked_up') {
      setErrands(prev => prev.map(e => {
        if (e.id === errandId) {
          return {
            ...e,
            status: 'in_transit' as ErrandStatus,
            messages: [
              ...e.messages,
              {
                id: `msg-sim-${Date.now()}`,
                senderRole: 'runner',
                text: "Traveling currently. Estimated ETA on dropsite node is 8 mins. Underway! 🚲",
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return e;
      }));
    } else if (target.status === 'in_transit') {
      setErrands(prev => prev.map(e => {
        if (e.id === errandId) {
          return {
            ...e,
            status: 'delivered' as ErrandStatus,
            messages: [
              ...e.messages,
              {
                id: `msg-sim-${Date.now()}`,
                senderRole: 'runner',
                text: "I have arrived at the recipient doorstep. Ready to handover package packet.",
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return e;
      }));
    } else if (target.status === 'delivered') {
      setErrands(prev => prev.map(e => {
        if (e.id === errandId) {
          return {
            ...e,
            status: 'awaiting_otp' as ErrandStatus,
            deliveryPhoto: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=200',
            deliveryNotes: 'Mock Photo Proof uploaded. Handed over package safely to porch desk. Please provide Delivery 4-digit PIN code.',
            messages: [
              ...e.messages,
              {
                id: `msg-sim-${Date.now()}`,
                senderRole: 'runner',
                text: "Proof of Delivery complete! 📸 Please enter my OTP Verification code to release escrow hold balance.",
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return e;
      }));
    }
  };

  return (
    <StateContext.Provider value={{
      currentView,
      selectedRoleForOnboarding,
      currentUser,
      errands,
      products,
      visitors,
      transactions,
      activeCustomerTab,
      activeRunnerTab,
      activeVendorTab,
      selectedErrandId,
      
      setView,
      selectRoleForOnboarding,
      loginUser,
      signupUser,
      logoutUser,
      createErrand,
      fundAndPublishErrand,
      acceptErrand,
      submitDeliveryProof,
      verifyDeliveryOTP,
      raiseDispute,
      resolveDispute,
      fundCustomerWallet,
      withdrawRunnerEarnings,
      updateRunnerVerification,
      advanceErrandStatus,
      cancelErrand,
      sendMessage,
      
      createProduct,
      orderProduct,
      deleteProduct,
      toggleProductAvailability,
      switchActiveRole,
      logVisitorActivity,
      sendThankYouToVisitor,
      
      setSelectedErrandId,
      setCustomerTab,
      setRunnerTab,
      setVendorTab,
      simulateRunnerActivity
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StateProvider');
  }
  return context;
};
