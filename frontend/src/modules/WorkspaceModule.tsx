import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AddWorkspace from '~/pages/AddWorkspace'
import EditWorkspace from '~/pages/EditWorkspace'
import WorkspaceDetails from '~/pages/WorkspaceDetails'
import WrorkSpace from '~/pages/WorkSpace'

const WorkspaceModule = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<WrorkSpace />} />
        <Route path="/addWorkspace" element={<AddWorkspace />} />
        <Route path="/:slug" element={<WorkspaceDetails />} />
        <Route path="/edit/:slug" element={<EditWorkspace />} />
      </Routes>
    </>
  )
}

export default WorkspaceModule
