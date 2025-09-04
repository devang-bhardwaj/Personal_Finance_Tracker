'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import StatCard from '@/components/dashboard/StatCard'
import TransactionList from '@/components/transactions/TransactionList'
import CategoryChart from '@/components/charts/CategoryChart'
import TrendChart from '@/components/charts/TrendChart'
import axios from 'axios'
import toast from 'react-hot-toast'

interface DashboardData {
  monthly_summary: {
    income: number
    expenses: number
    savings: number
    savings_rate: number
  }
  total_summary: {
    income: number
    expenses: number
    net_worth: number
  }
  recent_transactions: Array<{
    id: string
    amount: number
    description: string
    type: string
    date: string
  }>
  category_breakdown: Array<{
    name: string
    icon: string
    color: string
    amount: number
  }>
}

export default function DashboardPage() {
  const { user, isAuthenticated, refreshToken } = useAuthStore()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    refreshToken()
    fetchDashboardData()
  }, [isAuthenticated, router, refreshToken])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/analytics/dashboard')
      setDashboardData(response.data)
    } catch (error: any) {
      toast.error('Failed to load dashboard data')
      console.error('Dashboard error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!dashboardData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load dashboard data</p>
          <button 
            onClick={fetchDashboardData}
            className="btn-primary mt-4"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-primary-100">Here's your financial overview for this month</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Monthly Income"
            value={dashboardData.monthly_summary.income}
            type="currency"
            trend="up"
            icon="💰"
            color="success"
          />
          <StatCard
            title="Monthly Expenses"
            value={dashboardData.monthly_summary.expenses}
            type="currency"
            trend="down"
            icon="💸"
            color="danger"
          />
          <StatCard
            title="Monthly Savings"
            value={dashboardData.monthly_summary.savings}
            type="currency"
            trend={dashboardData.monthly_summary.savings > 0 ? "up" : "down"}
            icon="🏦"
            color={dashboardData.monthly_summary.savings > 0 ? "success" : "warning"}
          />
          <StatCard
            title="Savings Rate"
            value={dashboardData.monthly_summary.savings_rate}
            type="percentage"
            trend={dashboardData.monthly_summary.savings_rate > 20 ? "up" : "down"}
            icon="📈"
            color="primary"
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Expense Categories</h3>
            <CategoryChart data={dashboardData.category_breakdown} />
          </div>

          {/* Recent Transactions */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            <TransactionList 
              transactions={dashboardData.recent_transactions}
              showAll={false}
            />
          </div>
        </div>

        {/* Spending Trends */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">6-Month Spending Trends</h3>
          <TrendChart />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => router.push('/transactions/add')}
            className="btn-primary p-4 text-left"
          >
            <div className="text-2xl mb-2">➕</div>
            <div className="font-semibold">Add Transaction</div>
            <div className="text-sm opacity-75">Record a new income or expense</div>
          </button>
          <button 
            onClick={() => router.push('/budgets')}
            className="btn-secondary p-4 text-left"
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-semibold">Manage Budgets</div>
            <div className="text-sm opacity-75">Set and track spending limits</div>
          </button>
          <button 
            onClick={() => router.push('/analytics')}
            className="btn-secondary p-4 text-left"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold">View Analytics</div>
            <div className="text-sm opacity-75">Deep dive into your finances</div>
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
