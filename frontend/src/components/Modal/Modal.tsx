import React from 'react'
import './Modal.css'

interface IModalProps {
  children: React.ReactNode
  toggleModal: () => void
  size?: 'sm' | 'md' | 'lg'
}

const Modal = ({ children, toggleModal, size = 'md' }: IModalProps) => {
  const sizes = {
    sm: 'w-sm',
    md: 'w-md',
    lg: 'w-[70%]',
  }

  return (
    <>
      <div className="fixed inset-0 bg-opacity-50 bg-[grey] " onClick={toggleModal}></div>
      <div
        /* @ts-ignore */
        className={`fixed top-1/2 bg-[white] rounded-[9px] border border-[#c4c4c4] shadow-lg left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 ${sizes[size]}`}
      >
        <div className="bg-white shadow-md rounded-lg p-6  max-h-[90vh] overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </>
  )
}

export default Modal
