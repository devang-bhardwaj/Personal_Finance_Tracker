interface CategoryData {
  name: string
  icon: string
  color: string
  amount: number
  percentage: number
}

interface CategoryBreakdownProps {
  data: CategoryData[]
}

export default function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p>No category data available</p>
        </div>
      </div>
    )
  }

  const maxAmount = Math.max(...data.map(item => item.amount))

  return (
    <div className="space-y-4">
      {data.map((category) => (
        <div key={category.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                style={{ backgroundColor: category.color }}
              >
                {category.icon}
              </div>
              <span className="font-medium">{category.name}</span>
            </div>
            <div className="text-right">
              <div className="font-bold">${category.amount.toLocaleString()}</div>
              <div className="text-sm text-gray-500">{category.percentage.toFixed(1)}%</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                backgroundColor: category.color,
                width: `${(category.amount / maxAmount) * 100}%`
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}
