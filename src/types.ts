export type UserRole = 'customer' | 'runner' | 'vendor';

export interface Message {
  id: string;
  senderRole: 'customer' | 'runner';
  text: string;
  timestamp: string;
}

export interface Errand {
  id: string;
  title: string;
  description: string;
  category: 'delivery' | 'shopping' | 'pet' | 'vendor_order' | 'custom';
  status: 'posted' | 'assigned' | 'in_progress' | 'completed';
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

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  balance: number;
  avatarUrl?: string;
  rating: number;
  jobsCompleted?: number;
}
