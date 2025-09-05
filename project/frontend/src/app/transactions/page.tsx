'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Transaction {
  id: string
  amount: number
  description: string
  type: 'income' | 'expense'
  category_id: string
  date: string
  created_at: string
  updated_at: string
}

interface Category {
  id: string
  name: string
  type: string
  icon?: string
  color?: string
}

export default function TransactionsPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    loadData()
  }, [isAuthenticated, router])

  const loadData = async () => {
    setLoading(true)
    try {
      const [transactionsRes, categoriesRes] = await Promise.all([
        axios.get('/api/transactions/'),
        axios.get('/api/categories/')
      ])
      
      setTransactions(transactionsRes.data || [])
      setCategories(categoriesRes.data || [])
    } catch (error) {
      console.error('Failed to load data:', error)
      // Use mock data if API fails
      setTransactions([
        {
          id: '1',
          amount: 50,
          description: 'Grocery Shopping',
          type: 'expense',
          category_id: 'food',
          date: '2025-01-13',
          created_at: '2025-01-13T10:00:00Z',
          updated_at: '2025-01-13T10:00:00Z'
        },
        {
          id: '2',
          amount: 2500,
          description: 'Monthly Salary',
          type: 'income',
          category_id: 'salary',
          date: '2025-01-12',
          created_at: '2025-01-12T09:00:00Z',
          updated_at: '2025-01-12T09:00:00Z'
        },
        {
          id: '3',
          amount: 25,
          description: 'Coffee Shop',
          type: 'expense',
          category_id: 'food',
          date: '2025-01-12',
          created_at: '2025-01-12T14:30:00Z',
          updated_at: '2025-01-12T14:30:00Z'
        },
        {
          id: '4',
          amount: 120,
          description: 'Gas Station',
          type: 'expense',
          category_id: 'transport',
          date: '2025-01-11',
          created_at: '2025-01-11T16:20:00Z',
          updated_at: '2025-01-11T16:20:00Z'
        },
        {
          id: '5',
          amount: 500,
          description: 'Freelance Project',
          type: 'income',
          category_id: 'freelance',
          date: '2025-01-10',
          created_at: '2025-01-10T11:15:00Z',
          updated_at: '2025-01-10T11:15:00Z'
        }
      ])
      setCategories([
        { id: 'food', name: 'Food & Dining', type: 'expense', icon: '🍽️', color: '#ef4444' },
        { id: 'transport', name: 'Transportation', type: 'expense', icon: '🚗', color: '#3b82f6' },
        { id: 'salary', name: 'Salary', type: 'income', icon: '💰', color: '#10b981' },
        { id: 'freelance', name: 'Freelance', type: 'income', icon: '💼', color: '#06b6d4' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return
    }

    try {
      await axios.delete(`/api/transactions/${id}`)
      setTransactions(transactions.filter(t => t.id !== id))
      toast.success('Transaction deleted successfully')
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      toast.error('Failed to delete transaction')
    }
  }

  const getCategoryInfo = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category || { name: 'Unknown', icon: '❓', color: '#6b7280' }
  }

  const filteredAndSortedTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || transaction.type === filterType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      let comparison = 0
      
      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Transactions...</h2>
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
                onClick={() => router.push('/dashboard')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">All Transactions</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/transactions/add')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Income</dt>
                    <dd className="text-lg font-medium text-green-600">+${totalIncome.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ArrowTrendingDownIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
                    <dd className="text-lg font-medium text-red-600">-${totalExpenses.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">$</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Net Balance</dt>
                    <dd className={`text-lg font-medium ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${(totalIncome - totalExpenses).toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                  <option value="all">All Types</option>
                  <option value="income">Income Only</option>
                  <option value="expense">Expenses Only</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-')
                    setSortBy(field as 'date' | 'amount')
                    setSortOrder(order as 'asc' | 'desc')
                  }}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="amount-desc">Highest Amount</option>
                  <option value="amount-asc">Lowest Amount</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Transactions ({filteredAndSortedTransactions.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredAndSortedTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No transactions found</p>
                <p className="text-gray-400 mt-2">
                  {searchTerm || filterType !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Start by adding your first transaction'
                  }
                </p>
                <button
                  onClick={() => router.push('/transactions/add')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Transaction
                </button>
              </div>
            ) : (
              filteredAndSortedTransactions.map((transaction) => {
                const category = getCategoryInfo(transaction.category_id)
                return (
                  <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Category Icon */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <span className="text-lg">{category.icon}</span>
                        </div>
                        
                        {/* Transaction Details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {transaction.description}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <span>{category.name}</span>
                            <span>•</span>
                            <span>{new Date(transaction.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Amount and Actions */}
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className={`text-lg font-medium ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(transaction.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/transactions/edit/${transaction.id}`)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit transaction"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete transaction"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
