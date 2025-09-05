'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import ExpenseChart from '@/components/charts/ExpenseChart'
import IncomeChart from '@/components/charts/IncomeChart'
import MonthlyTrend from '@/components/charts/MonthlyTrend'
import CategoryBreakdown from '@/components/charts/CategoryBreakdown'
import axios from 'axios'
import toast from 'react-hot-toast'

interface AnalyticsData {
  monthly_summary: {
    income: number
    expenses: number
    savings: number
    savings_rate: number
  }
  category_breakdown: Array<{
    name: string
    icon: string
    color: string
    amount: number
    percentage: number
  }>
  monthly_trends: Array<{
    month: string
    income: number
    expenses: number
    savings: number
  }>
  top_categories: Array<{
    name: string
    amount: number
    transactions_count: number
  }>
}

export default function AnalyticsPage() {
  const { user, isAuthenticated, refreshToken } = useAuthStore()
  const router = useRouter()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    refreshToken()
    fetchAnalyticsData()
  }, [isAuthenticated, router, refreshToken, selectedPeriod])

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`/analytics/dashboard?period=${selectedPeriod}`)
      setAnalyticsData(response.data)
    } catch (error: any) {
      toast.error('Failed to load analytics data')
      console.error('Analytics data error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
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

  if (!analyticsData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load analytics data</p>
          <button 
            onClick={fetchAnalyticsData}
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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Analytics</h1>
            <p className="text-gray-600">Deep insights into your spending patterns</p>
          </div>
          
          {/* Period Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Period:</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
            <h3 className="text-lg font-semibold opacity-90">Total Income</h3>
            <p className="text-3xl font-bold">${analyticsData.monthly_summary.income.toLocaleString()}</p>
          </div>
          <div className="card bg-gradient-to-r from-red-500 to-red-600 text-white">
            <h3 className="text-lg font-semibold opacity-90">Total Expenses</h3>
            <p className="text-3xl font-bold">${analyticsData.monthly_summary.expenses.toLocaleString()}</p>
          </div>
          <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <h3 className="text-lg font-semibold opacity-90">Net Savings</h3>
            <p className="text-3xl font-bold">${analyticsData.monthly_summary.savings.toLocaleString()}</p>
          </div>
          <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <h3 className="text-lg font-semibold opacity-90">Savings Rate</h3>
            <p className="text-3xl font-bold">{analyticsData.monthly_summary.savings_rate.toFixed(1)}%</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              📊 Expense Categories
            </h3>
            <CategoryBreakdown data={analyticsData.category_breakdown} />
          </div>

          {/* Monthly Trends */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              📈 Monthly Trends
            </h3>
            <MonthlyTrend data={analyticsData.monthly_trends} />
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Spending Categories */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">🔥 Top Categories</h3>
            <div className="space-y-3">
              {analyticsData.top_categories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-gray-500">{category.transactions_count} transactions</p>
                    </div>
                  </div>
                  <p className="font-bold text-red-600">${category.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Spending Insights */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">💡 Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800">Savings Goal</h4>
                <p className="text-sm text-blue-600">
                  {analyticsData.monthly_summary.savings_rate >= 20 
                    ? "Great job! You're meeting the 20% savings goal." 
                    : `Try to save ${(20 - analyticsData.monthly_summary.savings_rate).toFixed(1)}% more to reach the 20% target.`}
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800">Spending Pattern</h4>
                <p className="text-sm text-yellow-600">
                  Your highest spending category is {analyticsData.top_categories[0]?.name || 'Unknown'}.
                  Consider reviewing these expenses for potential savings.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800">Monthly Progress</h4>
                <p className="text-sm text-green-600">
                  {analyticsData.monthly_summary.savings > 0 
                    ? `You saved $${analyticsData.monthly_summary.savings.toLocaleString()} this period!`
                    : "Consider reducing expenses to improve your savings rate."}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">⚡ Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/transactions/add')}
                className="w-full btn-primary p-3 text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">➕</span>
                  <div>
                    <div className="font-semibold">Add Transaction</div>
                    <div className="text-sm opacity-75">Record new income or expense</div>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => router.push('/budgets')}
                className="w-full btn-secondary p-3 text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <div className="font-semibold">Create Budget</div>
                    <div className="text-sm opacity-75">Set spending limits</div>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => router.push('/transactions')}
                className="w-full btn-outline p-3 text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <div className="font-semibold">View All Transactions</div>
                    <div className="text-sm opacity-75">Detailed transaction history</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
