import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '~/utils/axios'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { useGetMe, useUserscheduleTime } from '~/hooks/user'
import Loading from '~/components/Loading'
import { useGetGoogleUrl, useGetTiktokUrl, useGetTwitterUrl } from '~/hooks/social'
import { topCenterToast } from '~/Toast/toast'

const Settings: React.FC = () => {
  const [schedulerTime, setSchedulerTime] = useState<string>('')
  const [fetch, setFetch] = useState<boolean>(false)
  const navigate = useNavigate()

  const tiktokLogin = async () => {
    try {
      const response = await axiosInstance.get('/tiktok')
      // console.log(response.data)
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        // If the API returned an error message, set it in the state
        // console.log(error.response.data.message)
      } else {
        // Handle other errors or network issues
        // console.log('Tiktok registration failed. Please try again later.')
      }
    }
  }

  const { user, isFetching } = useGetMe()

  const { url: googleUrl, isFetching: isGooleFetching } = useGetGoogleUrl()
  const { url: twitterUrl, isSuccess: isTwitterSuccess } = useGetTwitterUrl(fetch)
  const { url: tiktokUrl, isSuccess: isTiktokSuccess } = useGetTiktokUrl()
  const { updateUserScheduleTime, isLoading: isLoadingeSchedule } = useUserscheduleTime()
  if (isTwitterSuccess) {
    // console.log('twitter :' + twitterUrl)
  }
  const UserscheduleTime = async () => {
    if (+schedulerTime <= 30) {
      topCenterToast('error', 'Scheduler time must be greater than 30 minutes')
      return
    }
    try {
      await updateUserScheduleTime(schedulerTime)
    } catch (error: any) {}
  }

  if (isTiktokSuccess) {
    // console.log('tiktok :' + tiktokUrl)
  }

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4 text-black">Settings</h1>
      <div className=" mx-auto bg-[white] rounded-lg p-6 ">
        <div className="flex justify-between items-center">
          {/* <AiOutlineArrowLeft
            className="text-black font-bold text-3xl cursor-pointer"
            size={24}
            onClick={() => navigate('/user/dashboard')}
          /> */}
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Profile Details</h2>
          {isFetching && <Loading big />}
          {user && (
            <div className="text-xl">
              <div className="flex justify-between space-y-2 mb-2">
                <p>
                  <span className="font-semibold">Name:</span> {user?.name}
                </p>
              </div>
              <div className="flex justify-between space-y-2 mb-2">
                <p>
                  <span className="font-semibold">Email:</span> {user?.email}
                </p>
                <p>
                  <span className="font-semibold">ID:</span> {user?.id}
                </p>
              </div>
              <div className="flex justify-between space-y-2 mb-2">
                <p>
                  <span className="font-semibold">Role:</span> {user?.role}
                </p>
                <p>
                  <span className="font-semibold">Is Email Verified:</span> {user?.isEmailVerified ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Scheduler Time</h2>
          <p className={+schedulerTime !== 0 ? (+schedulerTime < 30 ? 'text-red-500' : '') : ''}>
            Minimum 30 minutes:{' '}
            {schedulerTime
              ? schedulerTime < '30'
                ? `${schedulerTime} minutes Not Valid Time`
                : `${schedulerTime} minutes`
              : ``}{' '}
          </p>
          <div>
            <input
              type={'number'}
              className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:border-blue-500 mt-4"
              placeholder="Enter schedule time"
              onChange={(e) => {
                setSchedulerTime(e.target.value)
              }}
            />
          </div>
          <button
            onClick={UserscheduleTime}
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-4 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            {isLoadingeSchedule ? <Loading height="20px" width="20px" /> : 'Set Schedule Time'}
          </button>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Integrations With:</h2>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setFetch(true)}
          >
            Twitter Login
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
            onClick={() => (window.location.href = googleUrl || '/')}
          >
            {isGooleFetching ? <Loading height="20px" width="20px" /> : 'Youtube Login'}
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
            onClick={tiktokLogin}
          >
            Tiktok Login
          </button>
        </div>
      </div>
    </>
  )
}

export default Settings
