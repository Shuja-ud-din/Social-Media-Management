import React, { FocusEventHandler, useState } from 'react'
import { FiEyeOff } from 'react-icons/fi'
import { FiEye } from 'react-icons/fi'
import './Input.css'
import { boolean } from 'yup'

interface InputProps {
  type: string
  placeholder: string
  onChange?: (value: any) => void
  name: string
  value?: any
  className?: string
  id: string
  label?: string
  isError?: boolean
  error?: string
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

const Input = ({
  type,
  placeholder,
  name,
  onChange,
  value,
  className,
  id,
  label,
  isError = false,
  error = '',
  onBlur,
}: InputProps) => {
  const [passwordVisible1, setPasswordVisible1] = useState(false)

  return (
    <>
      <div className="flex flex-col w-full justify-start">
        {label && (
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id || ''}>
            {label}
          </label>
        )}
        <div
          className={`appearance-none bg-[white] rounded-lg flex items-center  relative block w-full px-3 py-2 border text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${className} custom_input ${isError ? 'border-red-500' : ''}`}
        >
          {type === 'password' && (
            <>
              <input
                type={passwordVisible1 ? 'text' : 'password'}
                name={name}
                id={id || 'password'}
                placeholder={placeholder || 'Password'}
                className="w-[95%] bg-[transparent]"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
              <span className="cursor-pointer" onClick={() => setPasswordVisible1(!passwordVisible1)}>
                {passwordVisible1 ? <FiEye /> : <FiEyeOff />}
              </span>
            </>
          )}
          {(type === 'text' || type === 'email') && (
            <>
              <input
                type={type}
                name={name}
                id={id || 'email'}
                onBlur={onBlur}
                placeholder={placeholder || ''}
                className="w-[100%] bg-[transparent]"
                onChange={onChange}
                value={value}
              />
            </>
          )}
          {type === 'number' && (
            <>
              <input
                type={type}
                name={name}
                onBlur={onBlur}
                id={label || 'number'}
                placeholder={placeholder || ''}
                className="w-[100%] bg-[transparent]"
                onChange={onChange}
                value={value}
              />
            </>
          )}
          {type === 'textarea' && (
            <>
              <textarea
                rows={5}
                name={name}
                value={value}
                id={label || 'number'}
                placeholder={placeholder || ''}
                className="w-[100%] bg-[transparent] outline-none"
                onChange={onChange}
              ></textarea>
            </>
          )}
        </div>
        <div className="text-red-500 text-m ">{error || ' '}</div>
      </div>
    </>
  )
}

export default Input
