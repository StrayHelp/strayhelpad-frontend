export interface Admin {
  id: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
}

export interface Report {
  id: string;
  title: string;
  animalType: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected' | 'resolved';
  reportedBy: string;
  createdAt: string;
}

export interface Donation {
  id: string;
  donor: string;
  amount: number;
  campaign: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Campaign {
  id: string;
  name: string;
  goal: number;
  raised: number;
  donors: number;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Organization {
  id: string;
  name: string;
  location: string;
  animals: number;
  status: 'active' | 'inactive';
}

export interface DashboardMetrics {
  totalUsers: number;
  totalReports: number;
  pendingReports: number;
  totalDonations: number;
  activeCampaigns: number;
  organizations: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
