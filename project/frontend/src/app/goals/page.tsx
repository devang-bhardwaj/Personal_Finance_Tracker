'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import GoalCard from '@/components/goals/GoalCard'
import CreateGoalModal from '@/components/goals/CreateGoalModal'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Goal {
  id: string
  title: string
  description: string
  target_amount: number
  current_amount: number
  target_date: string
  category: string
  status: 'active' | 'completed' | 'paused'
  created_at: string
}

export default function GoalsPage() {
  const { user, isAuthenticated, refreshToken } = useAuthStore()
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    refreshToken()
    fetchGoals()
  }, [isAuthenticated, router, refreshToken])

  const fetchGoals = async () => {
    try {
      setIsLoading(true)
      // Mock data for now since we don't have goals API yet
      const mockGoals: Goal[] = [
        {
          id: '1',
          title: 'Emergency Fund',
          description: 'Build 6 months of expenses',
          target_amount: 15000,
          current_amount: 8500,
          target_date: '2025-12-31',
          category: 'savings',
          status: 'active',
          created_at: '2025-01-01'
        },
        {
          id: '2',
          title: 'Vacation Fund',
          description: 'Europe trip savings',
          target_amount: 5000,
          current_amount: 2300,
          target_date: '2025-07-15',
          category: 'travel',
          status: 'active',
          created_at: '2025-01-01'
        }
      ]
      setGoals(mockGoals)
    } catch (error: any) {
      toast.error('Failed to load goals')
      console.error('Goals error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateGoal = async (goalData: any) => {
    try {
      // Mock implementation
      const newGoal: Goal = {
        id: Date.now().toString(),
        ...goalData,
        current_amount: 0,
        status: 'active' as const,
        created_at: new Date().toISOString()
      }
      setGoals([...goals, newGoal])
      setShowCreateModal(false)
      toast.success('Goal created successfully!')
    } catch (error: any) {
      toast.error('Failed to create goal')
      console.error('Create goal error:', error)
    }
  }

  const handleUpdateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, ...updates } : goal
    ))
  }

  const handleDeleteGoal = async (goalId: string) => {
    try {
      setGoals(goals.filter(g => g.id !== goalId))
      toast.success('Goal deleted successfully!')
    } catch (error: any) {
      toast.error('Failed to delete goal')
      console.error('Delete goal error:', error)
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

  const activeGoals = goals.filter(g => g.status === 'active')
  const completedGoals = goals.filter(g => g.status === 'completed')
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0)
  const totalSaved = goals.reduce((sum, goal) => sum + goal.current_amount, 0)
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Goals</h1>
            <p className="text-gray-600">Track and achieve your financial objectives</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            🎯 Create Goal
          </button>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <h3 className="text-lg font-semibold opacity-90">Total Target</h3>
            <p className="text-3xl font-bold">${totalTarget.toLocaleString()}</p>
          </div>
          <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <h3 className="text-lg font-semibold opacity-90">Total Saved</h3>
            <p className="text-3xl font-bold">${totalSaved.toLocaleString()}</p>
          </div>
          <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
            <h3 className="text-lg font-semibold opacity-90">Overall Progress</h3>
            <p className="text-3xl font-bold">{overallProgress.toFixed(1)}%</p>
          </div>
        </div>

        {/* Active Goals */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Active Goals</h2>
          {activeGoals.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Goals</h3>
              <p className="text-gray-600 mb-6">Create your first financial goal to start tracking your progress</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onUpdate={handleUpdateGoal}
                  onDelete={handleDeleteGoal}
                />
              ))}
            </div>
          )}
        </div>

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Completed Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onUpdate={handleUpdateGoal}
                  onDelete={handleDeleteGoal}
                />
              ))}
            </div>
          </div>
        )}

        {/* Financial Tips */}
        <div className="card bg-gradient-to-r from-indigo-50 to-blue-50">
          <h3 className="text-lg font-semibold text-indigo-900 mb-4">💡 Goal Setting Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800">
            <div>
              <h4 className="font-semibold mb-2">Make Goals SMART:</h4>
              <ul className="space-y-1">
                <li>• <strong>Specific:</strong> Clear target amount</li>
                <li>• <strong>Measurable:</strong> Track your progress</li>
                <li>• <strong>Achievable:</strong> Realistic targets</li>
                <li>• <strong>Relevant:</strong> Important to you</li>
                <li>• <strong>Time-bound:</strong> Set deadlines</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Popular Goal Categories:</h4>
              <ul className="space-y-1">
                <li>• Emergency Fund (6 months expenses)</li>
                <li>• Down Payment for Home</li>
                <li>• Vacation Fund</li>
                <li>• Retirement Savings</li>
                <li>• Debt Payoff</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Create Goal Modal */}
        {showCreateModal && (
          <CreateGoalModal
            onSubmit={handleCreateGoal}
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
