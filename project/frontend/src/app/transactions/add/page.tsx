'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
  type: string
  icon?: string
  color?: string
}

interface TransactionForm {
  amount: string
  description: string
  type: 'income' | 'expense'
  category_id: string
  date: string
}

export default function AddTransactionPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  
  const [form, setForm] = useState<TransactionForm>({
    amount: '',
    description: '',
    type: 'expense',
    category_id: '',
    date: new Date().toISOString().split('T')[0] // Today's date
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    // Check URL parameters for pre-selected type
    const urlParams = new URLSearchParams(window.location.search)
    const typeParam = urlParams.get('type')
    if (typeParam === 'income' || typeParam === 'expense') {
      setForm(prev => ({ ...prev, type: typeParam }))
    }
    
    loadCategories()
  }, [isAuthenticated, router])

  const loadCategories = async () => {
    try {
      const response = await axios.get('/api/categories/')
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to load categories:', error)
      // Create default categories if none exist
      setCategories([
        { id: 'food', name: 'Food & Dining', type: 'expense', icon: '🍽️', color: '#ef4444' },
        { id: 'transport', name: 'Transportation', type: 'expense', icon: '🚗', color: '#3b82f6' },
        { id: 'entertainment', name: 'Entertainment', type: 'expense', icon: '🎬', color: '#8b5cf6' },
        { id: 'shopping', name: 'Shopping', type: 'expense', icon: '🛒', color: '#f59e0b' },
        { id: 'bills', name: 'Bills & Utilities', type: 'expense', icon: '💡', color: '#10b981' },
        { id: 'health', name: 'Healthcare', type: 'expense', icon: '🏥', color: '#ef4444' },
        { id: 'salary', name: 'Salary', type: 'income', icon: '💰', color: '#10b981' },
        { id: 'freelance', name: 'Freelance', type: 'income', icon: '💼', color: '#06b6d4' },
        { id: 'investment', name: 'Investment', type: 'income', icon: '📈', color: '#8b5cf6' },
      ])
    } finally {
      setCategoriesLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.amount || !form.description || !form.category_id) {
      toast.error('Please fill in all required fields')
      return
    }

    if (isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setLoading(true)

    try {
      const transactionData = {
        amount: parseFloat(form.amount),
        description: form.description,
        type: form.type,
        category_id: form.category_id,
        date: new Date(form.date).toISOString()
      }

      await axios.post('/api/transactions/', transactionData)
      
      toast.success(`${form.type === 'income' ? 'Income' : 'Expense'} added successfully!`)
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Failed to create transaction:', error)
      toast.error(error.response?.data?.detail || 'Failed to add transaction')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const filteredCategories = categories.filter(cat => cat.type === form.type)

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Add Transaction</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.full_name || user?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, type: 'expense', category_id: '' }))}
                    className={`p-4 rounded-lg border-2 text-center transition-colors ${
                      form.type === 'expense'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">💸</div>
                    <div className="font-medium">Expense</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, type: 'income', category_id: '' }))}
                    className={`p-4 rounded-lg border-2 text-center transition-colors ${
                      form.type === 'income'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">💰</div>
                    <div className="font-medium">Income</div>
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    step="0.01"
                    min="0"
                    value={form.amount}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="What was this transaction for?"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category_id"
                  id="category_id"
                  value={form.category_id}
                  onChange={handleInputChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select a category</option>
                  {filteredCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={form.date}
                  onChange={handleInputChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 px-4 rounded-md font-medium text-white transition-colors ${
                    form.type === 'income'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Add {form.type === 'income' ? 'Income' : 'Expense'}
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
