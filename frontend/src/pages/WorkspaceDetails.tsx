import { Modal as AntdModal, Progress } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useDeleteWorkspace,
  useGenerateTitleDescription,
  useGetInstagramOAuth,
  useGetTwitterOAuth,
  useGetWorkspaceDetails,
  useGetYoutubeAuthURL,
  useRefreshTwitterToken,
  useRefreshYoutubeToken,
  useUploadVideoToTwitter,
  useUploadVideoToYouTube,
} from '~/hooks/workspace'
import { ExclamationCircleFilled } from '@ant-design/icons'
import youtube_icon from '../assets/youtube.png'
import twitter_icon from '../assets/twitter.png'
import instagram_icon from '../assets/instagram.png'
import Button from '../components/Button/Button'
import Modal from '~/components/Modal/Modal'
import Input from '~/components/Input/Input'
import { Formik } from 'formik'
import * as Yup from 'yup'
import upload_video_img from '../assets/upload_video.png'
import Loading from '~/components/Loading'
import { IoArrowBackSharp } from 'react-icons/io5'
import { RefreshTokenResponse } from '~/types/workspace'
import { socket } from '~/utils/socket'
import { toast } from 'react-toastify'
import SocialMediProgress from '~/components/Progress/SocialMediProgress'
import DotsLoader from '~/components/Loaders/DotsLoader/DotsLoader'
import env from '../config/env'
import SocailMediBar from '~/components/SocialMedia/SocailMediBar'

const { confirm } = AntdModal

const WorkspaceDetails = () => {
  const navigate = useNavigate()

  const [videoUploadProgress, setVideoUploadProgress] = useState<number>(0)
  const [video, setVideo] = useState<File | null>(null)
  const [uploadYTModal, setUploadYTModal] = useState<Boolean>(false)
  const [availableSocialMedia, setAvailableSocialMedia] = useState<string[]>([])
  const [selectedSocialMedias, setSelectedSocialMedias] = useState<string[]>([])
  const [uploadStarted, setUploadStarted] = useState<boolean>(false)
  const [uploadCompleted, setUploadCompleted] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState({
    firstPage: true,
    secondPage: false,
  })
  const [videoDetails, setVideoDetails] = useState({
    title: '',
    description: '',
  })

  const goToNextPage = () => {
    setCurrentPage({
      firstPage: false,
      secondPage: true,
    })
  }

  socket.on('uploadProgress', (data: any) => {
    setVideoUploadProgress(data.progress)
  })

  const gotToPreviousPage = () => {
    setCurrentPage({
      firstPage: true,
      secondPage: false,
    })
  }

  const { slug } = useParams()

  const { generateTitleDescription, isLoading, data } = useGenerateTitleDescription()
  const { deleteWorkspace } = useDeleteWorkspace()
  const { workspace, isLoading: isFetchingDetails } = useGetWorkspaceDetails(slug)
  const { generateYoutubeURL } = useGetYoutubeAuthURL()
  // const { getTwitterOAuth } = useGetTwitterOAuth()
  const { getInstagramOAuth } = useGetInstagramOAuth()
  const { uploadVideoToYouTube, isLoading: isUploading } = useUploadVideoToYouTube()
  const { uploadVideoToTwitter, isSuccess: twitterSuccess } = useUploadVideoToTwitter()
  const { refreshYoutubeToken, isLoading: refreshingYTToken } = useRefreshYoutubeToken()
  const { refreshTwitterToken, isLoading: refeshingTwitterToken } = useRefreshTwitterToken()

  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure delete this Workspace?',
      icon: <ExclamationCircleFilled />,
      // content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        if (workspace) deleteWorkspace(workspace._id as string).then(() => navigate('/user/workspaces'))
      },
      onCancel() {},
    })
  }

  useEffect(() => {
    if (data) {
      setVideoDetails({
        title: data.title,
        description: data.description,
      })
    }
  }, [data])

  const refreshTokens = async () => {
    if ((workspace?.Youtube?.expiryDate as number) < Date.now()) {
      refreshYoutubeToken(workspace?._id as string)
    }
    if ((workspace?.twitter?.expiryDate as number) < Date.now()) {
      refreshTwitterToken(workspace?._id as string)
    }
  }

  const getAvailableSocialMedia = () => {
    const medias = []
    if (workspace?.Youtube?.loggedIn) medias.push('Youtube')
    if (workspace?.twitter?.loggedIn) medias.push('Twitter')

    setAvailableSocialMedia(medias)
  }

  const toggleSelectSocialMedia = (media: string) => {
    if (selectedSocialMedias.includes(media)) {
      setSelectedSocialMedias(selectedSocialMedias.filter((item) => item !== media))
    } else {
      setSelectedSocialMedias([...selectedSocialMedias, media])
    }
  }

  const uploadVideoToSocailMedias = async () => {
    setUploadStarted(true)
    const uploadPromises = []

    if (selectedSocialMedias.includes('Youtube')) {
      const youtubePromise = uploadVideoToYouTube({
        video: video as File,
        workspaceId: workspace?._id as string,
        title: videoDetails.title,
        description: videoDetails.description,
      })
      uploadPromises.push(youtubePromise)
    }
    if (selectedSocialMedias.includes('Twitter')) {
      const twitterPromise = uploadVideoToTwitter({
        video: video as File,
        workspaceId: workspace?._id as string,
        tweetPost: videoDetails.title,
      })
      uploadPromises.push(twitterPromise)
    }

    try {
      await Promise.all(uploadPromises)
      setUploadStarted(false)
      setUploadCompleted(true)
    } catch (error) {
      console.error('Error uploading videos:', error)
      setUploadStarted(false)
      setUploadCompleted(true)
    }
  }

  useEffect(() => {
    if (workspace?._id) {
      refreshTokens()
      getAvailableSocialMedia()
    }
  }, [workspace?._id])

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4 text-black">Workspace Details</h1>
      {isFetchingDetails ? (
        <Loading height="50px" width="50px" big />
      ) : (
        <div className="p-6 w-full mx-auto bg-[white] rounded-lg ">
          <div className="flex justify-between"></div>
          <div>
            <div className="flex justify-between r items-center mb-4">
              <div className="flex">
                <MdDeleteOutline className="mr-2 cursor-pointer" size={20} onClick={showDeleteConfirm} />
                <FaRegEdit
                  onClick={() => navigate(`/user/workspaces/edit/${workspace?.slug}`)}
                  className="cursor-pointer"
                  size={20}
                />
              </div>
              <div className="flex items-center">
                <div
                  className={` ${
                    workspace?.status === 'active' ? 'bg-[green]' : 'bg-[red]'
                  }  h-[10px] w-[10px] rounded-full mx-2  `}
                ></div>
                <p className="capitalize">{workspace?.status}</p>
              </div>
            </div>
            <div className="flex w-full justify-center">
              <img src={workspace?.logo} alt="" />
            </div>
          </div>
          <div className="flex flex-col my-3 mb-6">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Workspace Name</p>
              <p className="text-lg ">{workspace?.name}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Description</p>
              <p className="text-lg ">{workspace?.description}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Schedule Time</p>
              <p className="text-lg ">{workspace?.scheduleTime}</p>
            </div>
            {/* <div className="flex justify-between flex-col">
              <p className="text-lg font-semibold">Collaborators</p>
              <div className="px-5">
                <div className="">
                  <p className="text-lg ">User 1</p>
                  <p className="text-lg ">User 1</p>
                  <p className="text-lg ">User 1</p>
                </div>
              </div>
            </div> */}
          </div>

          <div className="flex justify-between">
            <h1 className="text-lg font-semibold">Social Media Accounts</h1>
            <Button onClick={() => setUploadYTModal(true)}>Upload Video</Button>
          </div>

          <SocailMediBar
            name="Google"
            icon={youtube_icon}
            isAuthenticated={(workspace?.Youtube?.loggedIn && workspace?.Youtube?.expiryDate > Date.now()) as boolean}
            isRefreshingToken={refreshingYTToken}
            onClick={() => {
              generateYoutubeURL(workspace?._id as string)
            }}
          />

          <SocailMediBar
            name="Twitter"
            icon={twitter_icon}
            isAuthenticated={(workspace?.twitter?.loggedIn && workspace?.twitter?.expiryDate > Date.now()) as boolean}
            isRefreshingToken={refeshingTwitterToken}
            onClick={() => {
              window.location.href = `${env.REACT_APP_API_URL}/workspace/twitter/auth/${workspace?._id}`
            }}
          />

          <SocailMediBar
            name="Facebook"
            icon={instagram_icon}
            isAuthenticated={
              (workspace?.instagram?.loggedIn && workspace?.instagram?.expiryDate > Date.now()) as boolean
            }
            isRefreshingToken={false}
            onClick={() => {
              getInstagramOAuth(workspace?._id as string)
            }}
          />
        </div>
      )}

      {uploadYTModal && (
        <Modal toggleModal={() => setUploadYTModal(false)} size="lg">
          <>
            {currentPage.firstPage ? (
              <>
                {/* <div className="flex items-center justify-between">
                  <Button
                    outlined
                    onClick={gotToPreviousPage}
                    className="rounded-full flex p-0 items-center justify-center w-[40px] h-[40px]"
                  >
                    <IoArrowBackSharp size={22} />
                  </Button>
                </div> */}
                <p className="mb-3">Enter Prompt to Generate Title and Description for your Video</p>
                <Formik
                  initialValues={{ prompt: '' }}
                  onSubmit={(values) => {
                    generateTitleDescription(values.prompt)
                  }}
                  validationSchema={Yup.object().shape({
                    prompt: Yup.string().required('Prompt is required'),
                  })}
                >
                  {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
                    <form onSubmit={handleSubmit} className="mb-7  ">
                      <div className="w-full flex items-end">
                        <Input
                          type="text"
                          value={values.prompt}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="prompt"
                          label="Prompt"
                          isError={!!errors.prompt && touched.prompt}
                          placeholder="Enter you Prompt here..."
                          id="prompt"
                        />
                        <Button isLoading={isLoading} className="ml-3 w-[100px]" type="submit">
                          Generate
                        </Button>
                      </div>
                      {errors.prompt && touched.prompt && <p className="text-red-500">{errors.prompt}</p>}
                    </form>
                  )}
                </Formik>

                {data && (
                  <>
                    <Formik
                      initialValues={data}
                      onSubmit={(values) => {
                        setVideoDetails(values)
                        goToNextPage()
                      }}
                      validationSchema={Yup.object().shape({
                        title: Yup.string().required('Title is required'),
                        description: Yup.string().required('Description is required'),
                      })}
                    >
                      {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
                        <form onSubmit={handleSubmit} className="flex flex-col mb-7  items-end">
                          <Input
                            type="text"
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="title"
                            label="Title"
                            isError={!!errors.title && touched.title}
                            error={errors.title as string}
                            placeholder="Enter you Title here..."
                            id="title"
                          />
                          <Input
                            type="textarea"
                            value={values.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="description"
                            label="Description"
                            isError={!!errors.description && touched.description}
                            error={errors.description as string}
                            placeholder="Enter you Description here..."
                            id="description"
                          />

                          <Button type="submit" outlined>
                            Next
                          </Button>
                        </form>
                      )}
                    </Formik>
                  </>
                )}
              </>
            ) : (
              <>
                <h2 className="text-[30px] font-[600] mb-5 ">Video</h2>
                <Formik
                  initialValues={{ video: video?.name || '' }}
                  onSubmit={(values) => {
                    // uploadVideoToYouTube({
                    //   video: video as File,
                    //   workspaceId: workspace?._id as string,
                    //   title: videoDetails.title,
                    //   description: videoDetails.description,
                    // }).then(() => {
                    //   setCurrentPage({
                    //     firstPage: true,
                    //     secondPage: false,
                    //   })
                    //   setUploadYTModal(false)
                    // })
                    uploadVideoToSocailMedias().then(() => {
                      toast.success('Video Uploaded Successfully')
                      setCurrentPage({
                        firstPage: true,
                        secondPage: false,
                      })
                      setUploadYTModal(false)
                    })
                    // toast.success('You will be Notified when Video is Uploaded')
                    // setCurrentPage({
                    //   firstPage: true,
                    //   secondPage: false,
                    // })
                    // setUploadYTModal(false)
                  }}
                  validationSchema={Yup.object().shape({
                    video: Yup.string().required('Video is required'),
                  })}
                >
                  {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
                    <form onSubmit={handleSubmit} className="w-full flex flex-col mb-7  justify-center">
                      <div className="w-full flex justify-center items-center  ">
                        <input
                          type="file"
                          id="video_upload"
                          className="opacity-0 absolute w-0 h-0"
                          accept="video/*"
                          onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                            const files = event.target.files
                            if (files && files.length > 0) {
                              values.video = URL.createObjectURL(files[0])
                              setVideo(files[0])
                            }
                          }}
                        />
                        {values.video ? (
                          <>
                            <div className="flex w-full flex-col justify-center items-center">
                              <div className="w-[60%] mb-5">
                                <video className="w-full" src={values.video} controls />
                              </div>
                              <div className="w-full grid grid-cols-12 gap-5">
                                {uploadStarted &&
                                  selectedSocialMedias.map((media) => {
                                    return (
                                      <div className="col-span-6">
                                        <SocialMediProgress
                                          name={media}
                                          progressValue={media === 'Youtube' ? videoUploadProgress : undefined}
                                          isCompleted={media === 'Twitter' ? twitterSuccess : false}
                                        />
                                      </div>
                                    )
                                  })}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col w-full">
                            <label
                              className=" w-full flex items-center cursor-pointer justify-center"
                              htmlFor="video_upload"
                              id="video_upload"
                            >
                              <img className="w-[30%]" src={upload_video_img} alt="" />
                            </label>
                          </div>
                        )}
                      </div>
                      {errors.video && touched.video && <p className="text-red-500">{errors.video}</p>}
                      {!uploadStarted && (
                        <div className="flex flex-col w-full">
                          <h2 className="text-[20px] font-[500] mb-5 ">Select Social Media</h2>
                          <div className="flex  items-center w-full">
                            {availableSocialMedia.map((media) => (
                              <div
                                key={media}
                                onClick={() => toggleSelectSocialMedia(media)}
                                className={`flex items-center shadow-lg justify-center p-1 mr-2 rounded-full px-3 border-indigo-700 text-indigo-700 border-2 ${
                                  selectedSocialMedias.includes(media) ? 'bg-indigo-700 text-white' : ''
                                } cursor-pointer`}
                              >
                                {media}
                              </div>
                            ))}
                          </div>
                          {selectedSocialMedias.length === 0 && (
                            <p className="text-red-500">Please Select at least 1 Social Media Site</p>
                          )}
                        </div>
                      )}
                      <div className="flex justify-end">
                        <Button className="ml-3 w-[100px]" type="submit" isLoading={isUploading}>
                          Upload
                        </Button>
                      </div>
                    </form>
                  )}
                </Formik>
              </>
            )}
          </>
        </Modal>
      )}
    </>
  )
}

export default WorkspaceDetails
