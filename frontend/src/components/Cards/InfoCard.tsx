import type { IconType } from 'react-icons'

interface InfoCardProps {
  icon?: IconType
  label: string
  values: string | number
  color: string
}

const InfoCard = ({ label, values, color }: InfoCardProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-3 md:h-5 ${color} rounded-full`} />

      <p className="text-xs md:text-[14px] text-gray-500">
        <span className="text-sm md:text-[15px] text-black font-semibold">
          {values}
        </span>
        {label}
      </p>
    </div>
  )
}

export default InfoCard
