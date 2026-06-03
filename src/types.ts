export type UserRole = 'customer' | 'runner' | 'vendor' | 'admin';

export interface Message {
  id: string;
  senderRole: 'customer' | 'runner';
  text: string;
  timestamp: string;
}

export type ErrandStatus = 
  | 'pending'
  | 'accepted'
  | 'runner_en_route'
  | 'item_picked_up'
  | 'in_transit'
  | 'delivered'
  | 'awaiting_otp'
  | 'completed'
  | 'disputed'
  | 'resolved';

export interface Errand {
  id: string;
  title: string;
  description: string;
  category: 'delivery' | 'shopping' | 'pet' | 'vendor_order' | 'custom' | 'package' | 'buy_deliver' | 'food' | 'documents';
  status: ErrandStatus;
  payout: number;
  location: string;
  latitude: number;
  longitude: number;
  customerId: string;
  customerName: string;
  runnerId: string | null;
  runnerName: string | null;
  vendorId?: string | null;
  vendorName?: string | null;
  createdAt: string;
  items: string[];
  messages: Message[];
  imageUrl?: string;

  // Escrow & OTP system variables
  deliveryPin: string; // 4-digit PIN e.g., '2748'
  escrowStatus: 'held' | 'released' | 'frozen' | 'none';
  isFunded: boolean;
  platformFee: number;
  runnerFee: number;
  totalEscrowAmount: number;
  pickupLocation: string;
  deliveryLocation: string;
  
  // Proof of delivery
  deliveryPhoto?: string;
  recipientPhoto?: string;
  deliveryNotes?: string;

  // Disputes
  disputeReason?: 'wrong_item' | 'damaged' | 'not_received' | 'other' | string;
  disputeNotes?: string;
}

export interface VendorProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  stock: number;
  isAvailable?: boolean;
  type?: 'good' | 'service';
}

export interface RunnerVerification {
  phoneVerified: boolean;
  idVerified: boolean;
  selfieVerified: boolean;
  bankVerified: boolean;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  balance: number;
  avatarUrl?: string;
  rating: number;
  jobsCompleted?: number;
  
  // Wallet metrics for Runners
  todayEarnings?: number;
  pendingEscrowEarnings?: number;
  bankName?: string;
  bankSortCode?: string;
  bankAccountNumber?: string;

  // Verification
  verification?: RunnerVerification;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  title: string;
  category: 'escrow_hold' | 'escrow_release' | 'wallet_fund' | 'runner_payout' | 'withdrawal' | 'refund' | 'platform_commission';
  timestamp: string;
  errandId?: string;
}

export interface StoreVisitor {
  id: string;
  name: string;
  visitedAt: string;
  action: string;
  role: 'guest' | 'customer' | 'runner';
  thanked: boolean;
  thankedMessage?: string | null;
}


