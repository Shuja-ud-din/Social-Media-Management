import { Modal } from 'antd'
import React from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { useDeleteWorkspace } from '~/hooks/workspace'
import { WorkspaceInfo } from '~/types/workspace'
import { ExclamationCircleFilled } from '@ant-design/icons'

interface WorkspaceProps {
  className?: string
  workspace: WorkspaceInfo
  onClick?: () => void
}

const { confirm } = Modal

const WorkspaceCard = ({ className, onClick, workspace }: WorkspaceProps) => {
  const navigate = useNavigate()

  const { deleteWorkspace } = useDeleteWorkspace()

  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure delete this Workspace?',
      icon: <ExclamationCircleFilled />,
      // content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteWorkspace(workspace._id as string)
      },
      onCancel() {},
    })
  }

  return (
    <div
      className={`border bg-[white] border-grey p-5 rounded-lg hover:shadow-lg cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex">
          <MdDeleteOutline
            onClick={() => {
              showDeleteConfirm()
            }}
            className="mr-2 cursor-pointer"
            size={20}
          />
          <FaRegEdit
            onClick={() => navigate(`/user/workspaces/edit/${workspace.slug}`)}
            className="cursor-pointer"
            size={20}
          />
        </div>
        <div className="flex items-center">
          <div
            className={` ${
              workspace.status === 'active' ? 'bg-[green]' : 'bg-[red]'
            } h-[10px] w-[10px] rounded-full mx-2 `}
          ></div>
          <p className="capitalize">{workspace.status}</p>
        </div>
      </div>
      <div onClick={() => navigate(`/user/workspaces/${workspace.slug}`)}>
        <div className="flex w-full justify-center">
          <img className=" h-[200px]" src={workspace.logo} alt="" />
        </div>
        <div className="flex flex-col my-2">
          <h1 className="font-semibold text-[18px] ">Name:</h1>
          <p>{workspace.name}</p>
        </div>
        <div className="flex  flex-col justify-between my-2">
          <h1 className="font-semibold text-[18px] ">Schedule Time :</h1>
          <p className="">{workspace.scheduleTime}</p>
        </div>
        <div className="flex flex-col my-2">
          <h1 className="font-semibold text-[18px] ">Description:</h1>
          <p>{workspace.description}</p>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceCard
