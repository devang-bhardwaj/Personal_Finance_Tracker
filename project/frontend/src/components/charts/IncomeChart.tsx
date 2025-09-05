interface IncomeData {
  source: string
  amount: number
  color: string
}

interface IncomeChartProps {
  data: IncomeData[]
}

export default function IncomeChart({ data }: IncomeChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">💰</div>
          <p>No income data available</p>
        </div>
      </div>
    )
  }

  const total = data.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h4 className="text-lg font-semibold">Total Income</h4>
        <p className="text-2xl font-bold text-green-600">${total.toLocaleString()}</p>
      </div>
      
      <div className="space-y-3">
        {data.map((item) => {
          const percentage = total > 0 ? (item.amount / total) * 100 : 0
          return (
            <div key={item.source} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.source}</span>
                <span>${item.amount.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: item.color,
                    width: `${percentage}%`
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 text-right">
                {percentage.toFixed(1)}%
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
