// src/components/Dashboard.tsx

import React, { useEffect, useState } from 'react'
import ReelForm from '~/components/reel/ReelForm'
import ReelList from '~/components/reel/ReelList'
import ReactPaginate from 'react-paginate'
import { AiFillSetting } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { useDeleteReel, useGetReels } from '~/hooks/reel'
import WorkspaceCard from '~/components/workspace/WorkspaceCard'
import { useGetWorkspace } from '~/hooks/workspace'
import Loading from '~/components/Loading'
import { WorkspaceInfo } from '~/types/workspace'

const limit = 10 // Number of items per page

const WorkSpace: React.FC = () => {
  // const [reels, setReels] = useState<any>([])
  const [currentPage, setCurrentPage] = useState(0)

  const navigate = useNavigate()

  const navigateToSettings = () => {
    navigate('/user/settings')
  }

  const { data: { results: reels, totalPages } = { totalPages: 0 } } = useGetReels({
    page: `${currentPage + 1}`,
    limit: `${limit}`,
  })

  const { deleteReel } = useDeleteReel()

  const handleDelete = async (id: string) => {
    try {
      await deleteReel(id)
    } catch (error) {}
  }

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected)
  }
  const { workspaces } = useGetWorkspace()

  return (
    <div className=" mx-auto">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold mb-4 text-black">Workspaces</h1>
        <div className="text-gray-700  cursor-pointer">
          <button
            type="submit"
            onClick={() => navigate('/user/workspaces/addWorkspace')}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none"
          >
            Add Workspace
          </button>
        </div>
      </div>

      {!!reels?.length && (
        <>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <ReelList reels={reels} handleDelete={handleDelete} />
          </div>
          <div className="mt-4 flex items-start text-white">
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={limit}
              marginPagesDisplayed={2}
              onPageChange={handlePageChange}
              containerClassName="react-paginate flex items-start gap-4"
              activeClassName="active"
            />
          </div>
        </>
      )}

      {workspaces ? (
        <div className="grid grid-cols-12 flex gap-5">
          {workspaces.data.map((workspace: WorkspaceInfo) => {
            return <WorkspaceCard workspace={workspace} className="col-span-4" />
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <Loading big />
        </div>
      )}

      {!workspaces?.data?.length && (
        <div className="text-white  rounded text-center">
          <p className="text-gray-200 text-2xl py-2 font-bold mb-2 shadow-sm">No Data Found!</p>
        </div>
      )}
    </div>
  )
}

export default WorkSpace
