import React, { createContext, useContext, useState, useEffect } from 'react';
import { Errand, VendorProduct, UserProfile, UserRole, Message } from '../types';

interface StateContextType {
  currentView: 'onboarding' | 'login' | 'signup' | 'customer' | 'runner' | 'vendor' | 'guest';
  selectedRoleForOnboarding: UserRole | null;
  currentUser: UserProfile | null;
  errands: Errand[];
  products: VendorProduct[];
  activeCustomerTab: 'need' | 'active' | 'history' | 'shop';
  activeRunnerTab: 'jobs' | 'active' | 'earnings';
  activeVendorTab: 'orders' | 'products' | 'analytics';
  selectedErrandId: string | null;
  
  // Actions
  setView: (view: 'onboarding' | 'login' | 'signup' | 'customer' | 'runner' | 'vendor' | 'guest') => void;
  selectRoleForOnboarding: (role: UserRole | null) => void;
  loginUser: (role: UserRole, email?: string) => void;
  signupUser: (role: UserRole, name: string, email: string) => void;
  logoutUser: () => void;
  createErrand: (errand: Omit<Errand, 'id' | 'status' | 'customerId' | 'customerName' | 'runnerId' | 'runnerName' | 'createdAt' | 'messages'>) => void;
  acceptErrand: (errandId: string, runnerId: string, runnerName: string) => void;
  advanceErrandStatus: (errandId: string) => void;
  cancelErrand: (errandId: string) => void;
  sendMessage: (errandId: string, text: string, senderRole: 'customer' | 'runner') => void;
  
  // Vendor actions
  createProduct: (product: Omit<VendorProduct, 'id'>) => void;
  orderProduct: (productId: string, quantity: number, address: string) => void;
  deleteProduct: (productId: string) => void;
  toggleProductAvailability: (productId: string) => void;
  switchActiveRole: (role: UserRole) => void;
  
  // Selection
  setSelectedErrandId: (id: string | null) => void;
  setCustomerTab: (tab: 'need' | 'active' | 'history' | 'shop') => void;
  setRunnerTab: (tab: 'jobs' | 'active' | 'earnings') => void;
  setVendorTab: (tab: 'orders' | 'products' | 'analytics') => void;

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
    status: 'posted',
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
    messages: []
  },
  {
    id: 'err-2',
    title: 'Urgent Vet Prescription Collect',
    description: 'Pick up allergy medication for my golden retriever from VetExpress Clinic and bring it to my address. No payment needed at counter, veterinarian has prescription details.',
    category: 'delivery',
    status: 'assigned',
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
    ]
  },
  {
    id: 'err-3',
    title: 'Walk Max the Golden Retriever',
    description: 'Need an experienced pet lover to walk our energetic dog Max for 45 minutes around Holland Park. He has a harness and leash waiting inside the porch gates.',
    category: 'pet',
    status: 'posted',
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
    messages: []
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
    ]
  }
];

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setView] = useState<'onboarding' | 'login' | 'signup' | 'customer' | 'runner' | 'vendor' | 'guest'>('guest');
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

  // UI Tabs State
  const [activeCustomerTab, setCustomerTab] = useState<'need' | 'active' | 'history' | 'shop'>('need');
  const [activeRunnerTab, setRunnerTab] = useState<'jobs' | 'active' | 'earnings'>('jobs');
  const [activeVendorTab, setVendorTab] = useState<'orders' | 'products' | 'analytics'>('orders');
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
      },
      vendor: {
        id: 'vendor-1',
        role: 'vendor',
        name: 'London Artisan Bakery',
        email: email || 'bakes@artisanbakery.co.uk',
        balance: 1420.50,
        avatarUrl: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&q=80&w=150',
        rating: 4.7,
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
      ...(role === 'runner' ? { jobsCompleted: 0 } : {})
    };
    setCurrentUser(user);
    setView(role);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    selectRoleForOnboarding(null);
    setView('onboarding');
  };

  const createErrand = (errandData: Omit<Errand, 'id' | 'status' | 'customerId' | 'customerName' | 'runnerId' | 'runnerName' | 'createdAt' | 'messages'>) => {
    if (!currentUser) return;
    
    // Deduct cost and payout from customer's balance
    const cost = errandData.payout;
    if (currentUser.balance < cost) {
      alert("Insufficient funds! Please top up your simulated budget.");
      return;
    }

    const newErrand: Errand = {
      ...errandData,
      id: `err-${Math.random().toString(36).substr(2, 9)}`,
      status: 'posted',
      customerId: currentUser.id,
      customerName: currentUser.name,
      runnerId: null,
      runnerName: null,
      createdAt: new Date().toISOString(),
      messages: []
    };

    setErrands(prev => [newErrand, ...prev]);
    setCurrentUser(prev => prev ? { ...prev, balance: Number((prev.balance - cost).toFixed(2)) } : null);
    setCustomerTab('active');
    setSelectedErrandId(newErrand.id);
  };

  const acceptErrand = (errandId: string, runnerId: string, runnerName: string) => {
    setErrands(prev => prev.map(errand => {
      if (errand.id === errandId) {
        return {
          ...errand,
          status: 'assigned',
          runnerId,
          runnerName
        };
      }
      return errand;
    }));
  };

  const advanceErrandStatus = (errandId: string) => {
    setErrands(prev => prev.map(errand => {
      if (errand.id === errandId) {
        let nextStatus: Errand['status'] = errand.status;
        let pResult = { ...errand };
        
        if (errand.status === 'assigned') {
          nextStatus = 'in_progress';
          pResult.messages.push({
            id: `msg-auto-${Date.now()}`,
            senderRole: 'runner',
            text: 'I have successfully collected the items and I am heading over to your delivery address now!',
            timestamp: new Date().toISOString()
          });
        } else if (errand.status === 'in_progress') {
          nextStatus = 'completed';
          pResult.messages.push({
            id: `msg-auto-${Date.now()}`,
            senderRole: 'runner',
            text: 'Items delivered securely! I have clicked complete. Have a wonderful day!',
            timestamp: new Date().toISOString()
          });

          // Payout to Runner (done outside this map for safety, or inside if we update runner profiles)
          triggerRunnerPayout(errand.payout, errand.runnerId);
        }
        
        pResult.status = nextStatus;
        return pResult;
      }
      return errand;
    }));
  };

  const triggerRunnerPayout = (payout: number, runnerId: string | null) => {
    if (!runnerId) return;
    
    // Update active user state if the runner is the logged-in user
    setCurrentUser(prev => {
      if (prev && prev.id === runnerId) {
        return {
          ...prev,
          balance: Number((prev.balance + payout).toFixed(2)),
          jobsCompleted: (prev.jobsCompleted || 0) + 1
        };
      }
      return prev;
    });
  };

  const cancelErrand = (errandId: string) => {
    const errand = errands.find(e => e.id === errandId);
    if (!errand) return;
    
    // Refund customer
    if (currentUser && currentUser.id === errand.customerId) {
      setCurrentUser(prev => prev ? {
        ...prev,
        balance: Number((prev.balance + errand.payout).toFixed(2))
      } : null);
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

  const orderProduct = (productId: string, quantity: number, deliverAddress: string) => {
    const item = products.find(p => p.id === productId);
    if (!item || !currentUser) return;

    const totalCost = Number((item.price * quantity).toFixed(2));
    if (currentUser.balance < totalCost) {
      alert("Insufficient funds in current customer profile!");
      return;
    }

    // Deduct funds
    setCurrentUser(prev => prev ? {
      ...prev,
      balance: Number((prev.balance - totalCost).toFixed(2))
    } : null);

    // Reduce stock
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: Math.max(0, p.stock - quantity) } : p));

    // Spawn an Errand of type vendor_order automatically!
    // Payout for the runner is computed as a baseline £8 + £1.50 per unit item
    const deliveryPayout = 5.00 + (quantity * 1.50);

    const newErrand: Errand = {
      id: `err-${Math.random().toString(36).substr(2, 9)}`,
      title: `Deliver ${item.name} x${quantity}`,
      description: `Delivery request from ${item.category} Vendor: ${item.name} order needs swift transit to customer's home. Store has prepared dispatch packet, runner only needs pickup.`,
      category: 'vendor_order',
      status: 'posted',
      payout: deliveryPayout,
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
      messages: []
    };

    setErrands(prev => [newErrand, ...prev]);
    setCustomerTab('active');
    setSelectedErrandId(newErrand.id);
  };

  // Background Simulator Helper
  const simulateRunnerActivity = (errandId: string) => {
    const target = errands.find(e => e.id === errandId);
    if (!target) return;

    if (target.status === 'posted') {
      // Step 1: Simulated Runner Assigns
      setErrands(prev => prev.map(e => {
        if (e.id === errandId) {
          return {
            ...e,
            status: 'assigned',
            runnerId: 'run-simulated',
            runnerName: 'Rory Fletcher (Pro-Runner)',
            messages: [
              ...e.messages,
              {
                id: `msg-sim-${Date.now()}`,
                senderRole: 'runner',
                text: "Hi! I have accepted your ErrandLink. I'm near the pickup node and starting the transit task.",
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return e;
      }));
    } else if (target.status === 'assigned') {
      // Step 2: Simulated Runner Starts Work
      setErrands(prev => prev.map(e => {
        if (e.id === errandId) {
          return {
            ...e,
            status: 'in_progress',
            messages: [
              ...e.messages,
              {
                id: `msg-sim-${Date.now()}`,
                senderRole: 'runner',
                text: "Collected files and inventory packets. I am currently in transit to your drop-off site! 📍🚲",
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return e;
      }));
    } else if (target.status === 'in_progress') {
      // Step 3: Simulated Runner Completes Job
      setErrands(prev => prev.map(e => {
        if (e.id === errandId) {
          return {
            ...e,
            status: 'completed',
            messages: [
              ...e.messages,
              {
                id: `msg-sim-${Date.now()}`,
                senderRole: 'runner',
                text: "Task finalized! Package hand-delivered securely to recipient. Cheers! 🥳🙌",
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return e;
      }));
      // If it's a simulated runner, they get the payout locally, no need to adapt logged-in runner's wallet unless it is the user.
    }
  };

  return (
    <StateContext.Provider value={{
      currentView,
      selectedRoleForOnboarding,
      currentUser,
      errands,
      products,
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
      acceptErrand,
      advanceErrandStatus,
      cancelErrand,
      sendMessage,
      
      createProduct,
      orderProduct,
      deleteProduct,
      toggleProductAvailability,
      switchActiveRole,
      
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
