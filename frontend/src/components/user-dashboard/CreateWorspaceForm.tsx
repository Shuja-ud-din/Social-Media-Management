import React, { useState } from 'react'

interface CreateWorkspaceFormProps {
  handleButtonClick: () => void
}
const CreateWorkspaceForm = ({ handleButtonClick }: CreateWorkspaceFormProps) => {
  const [workspaceName, setWorkspaceName] = useState('')
  const [description, setDescription] = useState('')
  const [industry, setIndustry] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (!workspaceName.trim() || !description.trim()) {
      setError('Please fill out all required fields.')
      return
    }
    // Process form submission here
    // Reset form fields
    setWorkspaceName('')
    setDescription('')
    setIndustry('')
    setLocation('')
    setError('')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={handleButtonClick}
        className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        X
      </button>
      <h2 className="text-2xl font-bold mb-4">Create Workspace</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="workspaceName">
            Workspace Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="workspaceName"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="description">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="industry">
            Industry
          </label>
          <input
            type="text"
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="location">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Create Workspace
        </button>
      </form>
    </div>
  )
}

export default CreateWorkspaceForm
