import type React from "react"
import type { ReactNode } from "react"
import { ArrowUp, ArrowDown } from "lucide-react" // Import Lucide icons

/**
 * Props interface for the CardDataStats component.
 */
interface CardDataStatsProps {
  title: string
  total: string
  rate: string
  levelUp?: boolean
  levelDown?: boolean
  children: ReactNode
}

/**
 * CardDataStats Component
 *
 * This component displays a card containing statistical data such as a total value,
 * a rate of change, and a graphical indicator for increasing or decreasing trends.
 * It also accepts an icon or element as a child to visually represent the data.
 */
const CardDataStats: React.FC<CardDataStatsProps> = ({ title, total, rate, levelUp, levelDown, children }) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 -z-10 opacity-10 dark:opacity-20">
        <div className="h-full w-full bg-gradient-to-br from-purple-500 to-blue-500 dark:from-purple-800 dark:to-blue-800 blur-3xl"></div>
      </div>

      {/* Icon Container */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 shadow-md">
        {children}
      </div>

      {/* Data and Rate Section */}
      <div className="mt-5 flex items-end justify-between">
        {/* Total and Title */}
        <div>
          <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white">{total}</h4>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</span>
        </div>

        {/* Rate and Trend Indicator */}
        <span
          className={`flex items-center gap-1 text-sm font-semibold ${
            levelUp ? "text-green-500" : ""
          } ${levelDown ? "text-red-500" : ""}`}
        >
          {rate}
          {/* Upward Trend Icon */}
          {levelUp && <ArrowUp className="h-4 w-4" />}
          {/* Downward Trend Icon */}
          {levelDown && <ArrowDown className="h-4 w-4" />}
        </span>
      </div>
    </div>
  )
}

export default CardDataStats
