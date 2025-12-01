export type UserRole = 
  | 'master_admin' 
  | 'network_operator' 
  | 'store_owner'
  | 'delivery_partner'
  | 'customer';

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'out_for_delivery'
  | 'delivered' 
  | 'cancelled';

export type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected';
export type KYCStatus = 'not_started' | 'pending' | 'under_review' | 'verified' | 'rejected';

export type BusinessType = 'manufacturer' | 'distributor' | 'trader' | 'retailer';
export type VehicleType = 'bike' | 'auto' | 'van' | 'truck';

export interface KYCDocuments {
  panCard?: {
    number: string;
    imageUrl: string;
    verified: boolean;
  };
  aadharCard?: {
    number: string;
    imageUrl: string;
    verified: boolean;
  };
  gst?: {
    number: string;
    certificateUrl: string;
    verified: boolean;
  };
  businessLicense?: {
    number: string;
    imageUrl: string;
    verified: boolean;
  };
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
    verified: boolean;
  };
  drivingLicense?: {
    number: string;
    imageUrl: string;
    expiryDate: string;
    verified: boolean;
  };
  vehicleRC?: {
    number: string;
    imageUrl: string;
    verified: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  kycStatus: KYCStatus;
  kycDocuments?: KYCDocuments;
  createdAt: string;
  updatedAt: string;
  metadata?: any;
}

export interface NetworkOperator {
  id: string;
  userId: string;
  assignedPincodes: string[];
  assignedArea: string;
  commissionRate: number;
  joiningDate: string;
  kycStatus: KYCStatus;
  kycDocuments: KYCDocuments;
  performance?: any;
  kpi?: any;
}

export interface StoreOwner {
  id: string;
  userId: string;
  businessType: BusinessType;
  businessName: string;
  businessRegistrationNumber?: string;
  gst?: string;
  pan?: string;
  address?: any;
  pincode: string;
  operatorId?: string;
  kycStatus: KYCStatus;
  kycDocuments: KYCDocuments;
  verificationStatus: VerificationStatus;
  rating: number;
  joinedAt: string;
}

export interface DeliveryPartner {
  id: string;
  userId: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  kycStatus: KYCStatus;
  kycDocuments: KYCDocuments;
  assignedPincodes: string[];
  operatorId?: string;
  availabilityStatus: 'available' | 'busy' | 'offline';
  rating: number;
  totalDeliveries: number;
  joinedAt: string;
}

export interface Product {
  id: string;
  storeOwnerId: string;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  brand: string;
  sku: string;
  images: string[];
  pricing: {
    mrp: number;
    sellingPrice: number;
    discount: number;
    gst: number;
  };
  inventory: {
    stock: number;
    minStock: number;
    unit: string;
  };
  specifications?: any;
  isActive: boolean;
  availablePincodes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  storeOwnerId: string;
  quantity: number;
  price: number;
  gst: number;
  productName?: string;
  productImage?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: any;
  pincode: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  deliveryPartnerId?: string;
  deliveryDetails?: any;
  trackingInfo?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Franchise {
  id: string;
  pincode: string;
  area: string;
  city: string;
  state: string;
  operatorId?: string;
  isActive: boolean;
  boundaries?: any;
  assignedDate?: string;
  performance?: any;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  icon: string;
  description: string;
  isActive: boolean;
  order: number;
}

export interface Template {
  id: string;
  name: string;
  code: string;
  content?: string;
  subject?: string;
  htmlContent?: string;
  textContent?: string;
  variables: string[];
  category: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Cart {
  id: string;
  customerId: string;
  items: CartItem[];
  totalAmount: number;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}
