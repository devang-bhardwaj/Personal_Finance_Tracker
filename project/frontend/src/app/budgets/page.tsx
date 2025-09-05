'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import BudgetCard from '@/components/budgets/BudgetCard'
import CreateBudgetModal from '@/components/budgets/CreateBudgetModal'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Budget {
  id: string
  name: string
  amount: number
  spent: number
  period: string
  category_id: string | null
  user_id: string
  created_at: string
  updated_at: string
}

interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export default function BudgetsPage() {
  const { user, isAuthenticated, refreshToken } = useAuthStore()
  const router = useRouter()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    refreshToken()
    fetchData()
  }, [isAuthenticated, router, refreshToken])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [budgetsResponse, categoriesResponse] = await Promise.all([
        axios.get('/budgets'),
        axios.get('/categories')
      ])
      
      setBudgets(budgetsResponse.data)
      setCategories(categoriesResponse.data)
    } catch (error: any) {
      toast.error('Failed to load budget data')
      console.error('Budget data error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBudget = async (budgetData: any) => {
    try {
      const response = await axios.post('/budgets', budgetData)
      setBudgets([...budgets, response.data])
      setShowCreateModal(false)
      toast.success('Budget created successfully!')
    } catch (error: any) {
      toast.error('Failed to create budget')
      console.error('Create budget error:', error)
    }
  }

  const handleDeleteBudget = async (budgetId: string) => {
    try {
      await axios.delete(`/budgets/${budgetId}`)
      setBudgets(budgets.filter(b => b.id !== budgetId))
      toast.success('Budget deleted successfully!')
    } catch (error: any) {
      toast.error('Failed to delete budget')
      console.error('Delete budget error:', error)
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

  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const budgetUtilization = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
            <p className="text-gray-600">Track and manage your spending limits</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            ➕ Create Budget
          </button>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <h3 className="text-lg font-semibold opacity-90">Total Budgeted</h3>
            <p className="text-3xl font-bold">${totalBudgeted.toLocaleString()}</p>
          </div>
          <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
            <h3 className="text-lg font-semibold opacity-90">Total Spent</h3>
            <p className="text-3xl font-bold">${totalSpent.toLocaleString()}</p>
          </div>
          <div className={`card bg-gradient-to-r text-white ${
            budgetUtilization > 90 ? 'from-red-500 to-red-600' :
            budgetUtilization > 70 ? 'from-yellow-500 to-yellow-600' :
            'from-green-500 to-green-600'
          }`}>
            <h3 className="text-lg font-semibold opacity-90">Budget Usage</h3>
            <p className="text-3xl font-bold">{budgetUtilization.toFixed(1)}%</p>
          </div>
        </div>

        {/* Budgets Grid */}
        {budgets.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Budgets Created</h3>
            <p className="text-gray-600 mb-6">Create your first budget to start tracking your spending limits</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Your First Budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                categories={categories}
                onDelete={handleDeleteBudget}
              />
            ))}
          </div>
        )}

        {/* Create Budget Modal */}
        {showCreateModal && (
          <CreateBudgetModal
            categories={categories}
            onSubmit={handleCreateBudget}
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
