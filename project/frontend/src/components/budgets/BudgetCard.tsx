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

interface BudgetCardProps {
  budget: Budget
  categories: Category[]
  onDelete: (budgetId: string) => void
}

export default function BudgetCard({ budget, categories, onDelete }: BudgetCardProps) {
  const category = categories.find(c => c.id === budget.category_id)
  const percentageUsed = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0
  const remaining = budget.amount - budget.spent
  
  const getStatusColor = () => {
    if (percentageUsed >= 100) return 'text-red-600 bg-red-50'
    if (percentageUsed >= 80) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  const getProgressColor = () => {
    if (percentageUsed >= 100) return 'bg-red-500'
    if (percentageUsed >= 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the budget "${budget.name}"?`)) {
      onDelete(budget.id)
    }
  }

  return (
    <div className="card hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
            style={{ backgroundColor: category?.color || '#6B7280' }}
          >
            {category?.icon || '💰'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{budget.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{budget.period}</p>
            {category && (
              <p className="text-xs text-gray-400">{category.name}</p>
            )}
          </div>
        </div>
        <button 
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 p-1"
          title="Delete budget"
        >
          🗑️
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {percentageUsed.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all ${getProgressColor()}`}
            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Amount Details */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Budget:</span>
          <span className="font-semibold">${budget.amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Spent:</span>
          <span className="font-semibold text-red-600">${budget.spent.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-t pt-2">
          <span className="text-gray-600">Remaining:</span>
          <span className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(remaining).toLocaleString()}
            {remaining < 0 && ' over'}
          </span>
        </div>
      </div>

      {/* Status Alert */}
      {percentageUsed >= 90 && (
        <div className={`mt-4 p-3 rounded-lg ${
          percentageUsed >= 100 ? 'bg-red-50 text-red-800' : 'bg-yellow-50 text-yellow-800'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">
              {percentageUsed >= 100 ? '⚠️' : '⚡'}
            </span>
            <span className="text-sm font-medium">
              {percentageUsed >= 100 
                ? 'Budget exceeded!' 
                : 'Approaching budget limit'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
