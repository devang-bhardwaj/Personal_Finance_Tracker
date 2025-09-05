'use client'
import { useState } from 'react'

interface GoalFormData {
  title: string
  description: string
  target_amount: number
  target_date: string
  category: string
}

interface CreateGoalModalProps {
  onSubmit: (data: GoalFormData) => void
  onClose: () => void
}

export default function CreateGoalModal({ onSubmit, onClose }: CreateGoalModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    description: '',
    target_amount: 0,
    target_date: '',
    category: 'savings'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = [
    { value: 'savings', label: '💰 Emergency Fund', icon: '💰' },
    { value: 'travel', label: '✈️ Travel', icon: '✈️' },
    { value: 'house', label: '🏠 House Down Payment', icon: '🏠' },
    { value: 'car', label: '🚗 Car Purchase', icon: '🚗' },
    { value: 'education', label: '🎓 Education', icon: '🎓' },
    { value: 'health', label: '🏥 Health/Medical', icon: '🏥' },
    { value: 'retirement', label: '🧓 Retirement', icon: '🧓' },
    { value: 'debt', label: '💳 Debt Payoff', icon: '💳' },
    { value: 'emergency', label: '🚨 Emergency Fund', icon: '🚨' },
    { value: 'other', label: '🎯 Other', icon: '🎯' }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Goal title is required'
    }
    
    if (formData.target_amount <= 0) {
      newErrors.target_amount = 'Target amount must be positive'
    }
    
    if (!formData.target_date) {
      newErrors.target_date = 'Target date is required'
    } else if (new Date(formData.target_date) <= new Date()) {
      newErrors.target_date = 'Target date must be in the future'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setFormData({ title: '', description: '', target_amount: 0, target_date: '', category: 'savings' })
      setErrors({})
    } catch (error) {
      console.error('Goal creation error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof GoalFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const selectedCategory = categories.find(c => c.value === formData.category)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Create New Goal</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Goal Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Goal Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Emergency Fund, Vacation Savings"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              placeholder="Describe your goal..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          {/* Target Amount */}
          <div>
            <label htmlFor="target_amount" className="block text-sm font-medium text-gray-700 mb-1">
              Target Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                id="target_amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.target_amount}
                onChange={(e) => handleInputChange('target_amount', parseFloat(e.target.value) || 0)}
              />
            </div>
            {errors.target_amount && (
              <p className="text-red-500 text-sm mt-1">{errors.target_amount}</p>
            )}
          </div>

          {/* Target Date */}
          <div>
            <label htmlFor="target_date" className="block text-sm font-medium text-gray-700 mb-1">
              Target Date
            </label>
            <input
              id="target_date"
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.target_date}
              onChange={(e) => handleInputChange('target_date', e.target.value)}
            />
            {errors.target_date && (
              <p className="text-red-500 text-sm mt-1">{errors.target_date}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Preview */}
          {selectedCategory && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
              <div className="text-2xl">
                {selectedCategory.icon}
              </div>
              <span className="text-sm text-gray-700">
                Selected category: <strong>{selectedCategory.label}</strong>
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
              {isSubmitting ? 'Creating...' : 'Create Goal'}
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
