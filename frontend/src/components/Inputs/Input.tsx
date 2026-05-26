import React from 'react'
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa'

const Input = ({value, onChange, label, type, placeholder}: {value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, label: string, type: string, placeholder: string}) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <>
      <label className="text-[13px] text-slate-800">{label}</label>
      <div className="input-box">
        <input
          type={type == 'password' ? 
           (showPassword ? 'text' : 'password' ): type}
          value={value}
          onChange={(e) => onChange(e)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
        />

        {type == 'password' && (
            <>
            {showPassword ? (
                <FaRegEye
                 size={20}
                  className="text-primary cursor-pointer"
                  onClick={toggleShowPassword}
                />
              ) : (
                <FaRegEyeSlash
                size={20}
                  className="text-slate-400 cursor-pointer"
                  onClick={toggleShowPassword}
                />
              )}    
            </>
        )}
      </div>
      </>
    )
}

export default Input