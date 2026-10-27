import React from 'react'
import { LuChevronDown } from 'react-icons/lu'

interface Option {
    label: string
    value: string
}

const SelectDropdown = ({ options, value, onChange, placeholder }: { options: Option[], value: string, onChange: (value: string) => void, placeholder: string }) => {
    const [isOpen, setIsOpen] = React.useState(false)

    const handleSelect = (option: string) => {
        onChange(option)
        setIsOpen(false)
    }

    return (
        <div className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-sm text-black outline-none bg-white border border-slate-100 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center cursor-pointer"
            >
                {value ? options.find((opt) => opt.value === value)?.label : placeholder}
                <span className="ml-2">
                    <LuChevronDown className={isOpen ? 'rotate-180' : ''} />
                </span>
            </button>

            {isOpen && (
                <div className="absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SelectDropdown
