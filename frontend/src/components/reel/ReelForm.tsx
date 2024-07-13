import React, { useState } from 'react'
import { IReel } from '~/types/reel'
import { useCreateReel } from '~/hooks/reel'

const ReelForm: React.FC = () => {
  const [url, setUrl] = useState('')

  const { createReels } = useCreateReel()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const reelData = { url, status: 'pending' }
    try {
      await createReels(reelData as IReel)
      setUrl('')
    } catch (error) {}
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex">
        <input
          type="text"
          placeholder="Reel URL"
          value={url}
          onChange={(e) => setUrl(e.target.value.trim())}
          className="w-full p-2 border rounded-l focus:outline-none focus:border-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none"
        >
          Submit
        </button>
      </div>
    </form>
  )
}

export default ReelForm
