
import React, { useState } from 'react';
import CreateWorkspaceForm from '~/components/user-dashboard/CreateWorspaceForm'
import { useGetMe } from '~/hooks/user'
import { removeToken } from '~/utils/token'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query';
import Loading from '~/components/Loading';

const UserDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate()

  const { user, isLoading, isFetching } = useGetMe();
  const client = useQueryClient();



  const handleLogout = () => {
    client.setQueryData(["getMe"], null)
    client.clear()
    navigate("/login")
    removeToken();
  };

  const handleCreateWorkspace = () => {
    setShowForm(true);
  };

  const hnadleHideFormpage = () => {
    setShowForm(false);
  };

  if(isLoading || isFetching) return <Loading width='100px' height='100px'/>

  return (
    <div className="relative mt-[100px] p-4 w-full flex flex-col justify-center text-center">
      <h1 className="text-xl">Welcome, {user?.name}</h1>
      <p className="mb-4">Role: {user?.role || "Admin"}</p>
      <div className=" flex gap-[50px] w-full justify-center  ">

      <button className="mr-4 py-2 px-4 bg-blue-500 text-white " onClick={handleLogout}>Logout</button>
      <button className="py-2 px-4 bg-blue-500 text-white" onClick={handleCreateWorkspace}>Create Workspace</button>
      </div>
      {showForm && (
        <div className="absolute top-0 left-0 flex justify-center items-center h-screen w-full">
        <div className=" relative bg-white shadow-lg rounded-lg p-6">
          <CreateWorkspaceForm handleButtonClick={hnadleHideFormpage} />
        </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;