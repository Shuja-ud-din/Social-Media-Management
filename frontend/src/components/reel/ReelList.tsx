import React, { useState } from 'react'
import { IReelCreated } from '~/types/reel'
import { useProcessReel } from '~/hooks/reel'

interface ReelListProps {
  reels: IReelCreated[]
  handleDelete: (id: string) => void
}

const ReelList: React.FC<ReelListProps> = ({ reels, handleDelete }) => {
  const [reelId, setReelId] = useState<string>('')

  const {
    data,
    isError: isReelProcessError,
    isSuccess: reelProcessSuccess,
    isLoading: reelProcessLoading,
    error: reelProcessError,
  } = useProcessReel(reelId)

  const handleViewData = (reel: IReelCreated) => {}

  return (
    <div>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border border-gray-400 p-1">URL</th>
            <th className="border border-gray-400 p-1">Status</th>
            <th className="border border-gray-400 p-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reels.map((reel, index) => (
            <tr key={reel.id}>
              <td className="border border-gray-400 p-1">{reel.url}</td>
              <td className="border border-gray-400 p-1 text-center">{reel.status}</td>
              <td className="border border-gray-400 p-1 text-center relative">
                <div className="group inline-block relative">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Actions</button>
                  <ul className="absolute hidden text-gray-700 group-hover:block bg-white border border-gray-300 rounded-md shadow-lg z-50">
                    <li className="hover:bg-blue-100 px-4 py-2 cursor-pointer text-red-500">
                      <button onClick={() => handleDelete(reel.id)}>Delete</button>
                    </li>
                    <li className="hover:bg-blue-100 px-4 py-2 cursor-pointer">
                      <button onClick={() => setReelId(reel.id)}>Download</button>
                    </li>
                    <li className="hover:bg-blue-100 px-4 py-2 cursor-pointer">
                      <button onClick={() => handleViewData(reel)}>View Data</button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ReelList
