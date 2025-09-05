interface MonthlyData {
  month: string
  income: number
  expenses: number
  savings: number
}

interface MonthlyTrendProps {
  data: MonthlyData[]
}

export default function MonthlyTrend({ data }: MonthlyTrendProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📈</div>
          <p>No trend data available</p>
        </div>
      </div>
    )
  }

  const maxValue = Math.max(...data.flatMap(item => [item.income, item.expenses]))

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Income</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Expenses</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Savings</span>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.month} className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>{item.month}</span>
              <span className="text-gray-500">
                Net: ${item.savings.toLocaleString()}
              </span>
            </div>
            
            {/* Income Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-green-600">Income</span>
                <span>${item.income.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.income / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Expenses Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-red-600">Expenses</span>
                <span>${item.expenses.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.expenses / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
