'use client'
import { useState } from 'react'

interface Category {
  id: string
  name: string
  icon: string
  color: string
}

interface BudgetFormData {
  name: string
  amount: number
  period: 'weekly' | 'monthly' | 'yearly'
  category_id?: string
}

interface CreateBudgetModalProps {
  categories: Category[]
  onSubmit: (data: BudgetFormData) => void
  onClose: () => void
}

export default function CreateBudgetModal({ categories, onSubmit, onClose }: CreateBudgetModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<BudgetFormData>({
    name: '',
    amount: 0,
    period: 'monthly',
    category_id: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const selectedCategory = categories.find(c => c.id === formData.category_id)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Budget name is required'
    }
    
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be positive'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    try {
      const submitData = {
        ...formData,
        category_id: formData.category_id || undefined
      }
      await onSubmit(submitData)
      setFormData({ name: '', amount: 0, period: 'monthly', category_id: '' })
      setErrors({})
    } catch (error) {
      console.error('Budget creation error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof BudgetFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Create New Budget</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Budget Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Budget Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g., Groceries, Entertainment"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Budget Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Budget Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Budget Period */}
          <div>
            <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
              Budget Period
            </label>
            <select
              id="period"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.period}
              onChange={(e) => handleInputChange('period', e.target.value as 'weekly' | 'monthly' | 'yearly')}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            {errors.period && (
              <p className="text-red-500 text-sm mt-1">{errors.period}</p>
            )}
          </div>

          {/* Category Selection */}
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
              Category (Optional)
            </label>
            <select
              id="category_id"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.category_id}
              onChange={(e) => handleInputChange('category_id', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Category Preview */}
          {selectedCategory && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ backgroundColor: selectedCategory.color }}
              >
                {selectedCategory.icon}
              </div>
              <span className="text-sm text-gray-700">
                Budget will track spending in <strong>{selectedCategory.name}</strong>
              </span>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Budget'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
