import React from 'react'
import Loading from '../Loading'
import { Link } from 'react-router-dom'

interface ButtonInterface {
  isLoading?: boolean
  onClick?: () => void
  className?: string
  children: any
  type?: 'submit'
  to?: string
  onBlur?: () => any
  outlined?: boolean
}

const Button = ({ isLoading, onClick, className, children, type, to, outlined, onBlur }: ButtonInterface) => {
  return (
    <div>
      {!to ? (
        <button
          type={type}
          disabled={!!isLoading}
          onClick={onClick}
          onBlur={onBlur}
          className={`${outlined ? 'btn-outlined' : 'btn-primary'} ${className}`}
        >
          {!!isLoading ? <Loading height="20px" width="20px" /> : children}
        </button>
      ) : (
        <Link to={to} className={`${outlined ? 'btn-outlined' : 'btn-primary'} ${className}`}>
          {children}
        </Link>
      )}
    </div>
  )
}

export default Button
