// Button.jsx
import React from 'react'

const ListButton = ({ text, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 w-120 ${className}`}
    >
      {text}
    </button>
  )
}

export default ListButton
