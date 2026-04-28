import { Admin, DashboardMetrics } from '../types';

interface MockResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const DEMO_ADMIN: Admin = {
  id: 'admin-1',
  email: 'admin@strayhelp.local',
  role: 'admin',
};

class ApiClient {
  async login(email: string, password: string): Promise<MockResponse<{ accessToken: string; refreshToken: string; admin: Admin }>> {
    await wait();

    if (email !== 'admin@strayhelp.local' || password.length === 0) {
      throw { message: 'Invalid credentials. Use admin@strayhelp.local and any non-empty password.' };
    }

    return {
      success: true,
      message: 'Login successful',
      data: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        admin: DEMO_ADMIN,
      },
    };
  }

  async logout(): Promise<MockResponse<null>> {
    await wait(100);
    return { success: true, message: 'Logged out', data: null };
  }

  async getCurrentAdmin(): Promise<MockResponse<Admin>> {
    await wait(120);
    return { success: true, data: DEMO_ADMIN };
  }

  async getDashboardMetrics(): Promise<MockResponse<DashboardMetrics>> {
    await wait();
    return {
      success: true,
      data: {
        totalUsers: 1542,
        totalReports: 426,
        pendingReports: 18,
        totalDonations: 387420,
        activeCampaigns: 12,
        organizations: 33,
      },
    };
  }

  async getDonationsOverTime(): Promise<MockResponse<Array<{ month: string; amount: number }>>> {
    await wait();
    return {
      success: true,
      data: [
        { month: 'Jan', amount: 42000 },
        { month: 'Feb', amount: 51000 },
        { month: 'Mar', amount: 47000 },
        { month: 'Apr', amount: 61000 },
        { month: 'May', amount: 58000 },
        { month: 'Jun', amount: 70000 },
      ],
    };
  }

  async getReportsByMonth(): Promise<MockResponse<Array<{ month: string; count: number }>>> {
    await wait();
    return {
      success: true,
      data: [
        { month: 'Jan', count: 32 },
        { month: 'Feb', count: 28 },
        { month: 'Mar', count: 36 },
        { month: 'Apr', count: 41 },
        { month: 'May', count: 38 },
        { month: 'Jun', count: 44 },
      ],
    };
  }

  async getUserGrowth(): Promise<MockResponse<Array<{ week: string; users: number }>>> {
    await wait();
    return {
      success: true,
      data: [
        { week: 'W1', users: 1180 },
        { week: 'W2', users: 1245 },
        { week: 'W3', users: 1320 },
        { week: 'W4', users: 1410 },
      ],
    };
  }
}

export default new ApiClient();
