import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { DashboardMetrics } from '../types';
import apiClient from '../services/apiClient';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [donationData, setDonationData] = useState<any[]>([]);
  const [reportData, setReportData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [metricsRes, donationRes, reportRes] = await Promise.all([
          apiClient.getDashboardMetrics(),
          apiClient.getDonationsOverTime(),
          apiClient.getReportsByMonth(),
        ]);

        setMetrics(metricsRes.data);
        setDonationData(donationRes.data || []);
        setReportData(reportRes.data || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Users"
          value={metrics?.totalUsers ?? 0}
          icon="👥"
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />
        <MetricCard
          title="Pending Reports"
          value={metrics?.pendingReports ?? 0}
          icon="📝"
          bgColor="bg-yellow-50"
          textColor="text-yellow-600"
        />
        <MetricCard
          title="Total Donations"
          value={`₱${metrics?.totalDonations ?? 0}`}
          icon="💝"
          bgColor="bg-green-50"
          textColor="text-green-600"
        />
        <MetricCard
          title="Total Reports"
          value={metrics?.totalReports ?? 0}
          icon="📊"
          bgColor="bg-purple-50"
          textColor="text-purple-600"
        />
        <MetricCard
          title="Active Campaigns"
          value={metrics?.activeCampaigns ?? 0}
          icon="🎯"
          bgColor="bg-red-50"
          textColor="text-red-600"
        />
        <MetricCard
          title="Organizations"
          value={metrics?.organizations ?? 0}
          icon="🏢"
          bgColor="bg-indigo-50"
          textColor="text-indigo-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Donations Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={donationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#FF6B6B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Reports by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4ECDC4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton icon="📝" label="Review Reports" link="/reports" />
          <QuickActionButton icon="👥" label="Manage Users" link="/users" />
          <QuickActionButton icon="💝" label="View Donations" link="/donations" />
          <QuickActionButton icon="🏢" label="Organizations" link="/organizations" />
        </div>
      </div>
    </Layout>
  );
};

/* ------------------- Metric Card ------------------- */

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  bgColor: string;
  textColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  textColor,
}) => (
  <div className={`${bgColor} rounded-lg p-6`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</p>
      </div>
      <span className="text-4xl">{icon}</span>
    </div>
  </div>
);

/* ------------------- Quick Action ------------------- */

interface QuickActionProps {
  icon: string;
  label: string;
  link: string;
}

const QuickActionButton: React.FC<QuickActionProps> = ({
  icon,
  label,
  link,
}) => (
  <Link
    to={link}
    className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition border border-gray-200"
  >
    <span className="text-2xl">{icon}</span>
    <span className="font-medium text-gray-700">{label}</span>
  </Link>
);