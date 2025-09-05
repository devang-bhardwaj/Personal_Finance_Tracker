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

interface GoalCardProps {
  goal: Goal
  onUpdate: (goalId: string, updates: Partial<Goal>) => void
  onDelete: (goalId: string) => void
}

export default function GoalCard({ goal, onUpdate, onDelete }: GoalCardProps) {
  const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0
  const isCompleted = progress >= 100
  const daysRemaining = Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      savings: '💰',
      travel: '✈️',
      house: '🏠',
      car: '🚗',
      education: '🎓',
      health: '🏥',
      retirement: '🧓',
      debt: '💳',
      emergency: '🚨',
      other: '🎯'
    }
    return icons[category] || '🎯'
  }

  const getStatusColor = () => {
    if (isCompleted) return 'bg-green-500'
    if (progress >= 75) return 'bg-blue-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  const handleAddProgress = () => {
    const amount = prompt('Enter amount to add:')
    if (amount && !isNaN(parseFloat(amount))) {
      const newAmount = Math.min(goal.current_amount + parseFloat(amount), goal.target_amount)
      onUpdate(goal.id, { current_amount: newAmount })
    }
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the goal "${goal.title}"?`)) {
      onDelete(goal.id)
    }
  }

  return (
    <div className={`card hover:shadow-lg transition-shadow ${isCompleted ? 'ring-2 ring-green-500' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">
            {getCategoryIcon(goal.category)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{goal.title}</h3>
            <p className="text-sm text-gray-500">{goal.description}</p>
          </div>
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={handleAddProgress}
            className="text-green-500 hover:text-green-700 p-1"
            title="Add progress"
          >
            ➕
          </button>
          <button 
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 p-1"
            title="Delete goal"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className={`font-medium ${isCompleted ? 'text-green-600' : 'text-gray-900'}`}>
            {progress.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all ${getStatusColor()}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Amount Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Target:</span>
          <span className="font-semibold">${goal.target_amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Saved:</span>
          <span className="font-semibold text-green-600">${goal.current_amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-t pt-2">
          <span className="text-gray-600">Remaining:</span>
          <span className="font-semibold text-orange-600">
            ${Math.max(0, goal.target_amount - goal.current_amount).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="text-sm text-gray-500">
        <div className="flex justify-between">
          <span>Target Date:</span>
          <span>{new Date(goal.target_date).toLocaleDateString()}</span>
        </div>
        {daysRemaining > 0 ? (
          <div className="flex justify-between">
            <span>Days Remaining:</span>
            <span className={daysRemaining <= 30 ? 'text-orange-600 font-medium' : ''}>
              {daysRemaining} days
            </span>
          </div>
        ) : (
          <div className="text-center mt-2">
            <span className="text-red-600 font-medium">Goal date has passed</span>
          </div>
        )}
      </div>

      {/* Status Badge */}
      {isCompleted && (
        <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-lg text-center">
          <div className="flex items-center justify-center">
            <span className="mr-2">🎉</span>
            <span className="font-medium">Goal Completed!</span>
          </div>
        </div>
      )}

      {/* Warning for overdue */}
      {daysRemaining < 0 && !isCompleted && (
        <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-lg text-center">
          <div className="flex items-center justify-center">
            <span className="mr-2">⚠️</span>
            <span className="font-medium">Goal is overdue</span>
          </div>
        </div>
      )}
    </div>
  )
}
