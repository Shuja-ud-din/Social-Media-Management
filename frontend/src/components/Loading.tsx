import React from 'react'
import './Loading.css'

interface loadingProps {
  height?: string
  width?: string
  big?: boolean
}

const Loading: React.FC<loadingProps> = ({ height, width, big }) => {
  return (
    <>
      {big ? (
        <div className="flex justify-center items-center">
          <div className="lds-ripple" style={{ height, width }}>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <div
            className="animate-spin rounded-full border-t-2 border-b-2 border-purple-500 m-auto"
            style={{
              height,
              width,
            }}
          ></div>
        </div>
      )}
    </>
  )
}

export default Loading
