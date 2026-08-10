import { LucideIcon } from 'lucide-react'

interface DashboardStatsProps {
  title: string
  value: number | string
  icon: LucideIcon
  color: string
  change?: string
  changeType?: 'increase' | 'decrease'
}

export default function DashboardStats({ 
  title, 
  value, 
  icon: Icon, 
  color,
  change,
  changeType
}: DashboardStatsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
      {change && (
        <div className="mt-4">
          <span className={`text-xs font-medium ${
            changeType === 'increase' ? 'text-green-600' : 
            changeType === 'decrease' ? 'text-red-600' : 
            'text-gray-500'
          }`}>
            {change}
          </span>
          <span className="text-xs text-gray-500 ml-1">par rapport au mois dernier</span>
        </div>
      )}
    </div>
  )
}
