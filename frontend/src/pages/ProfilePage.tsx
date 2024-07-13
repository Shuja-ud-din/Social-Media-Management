import { Formik } from 'formik'
import React, { useState } from 'react'
import { useGetMe } from '~/hooks/user'
import * as Yup from 'yup'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import Button from '~/components/Button/Button'
import user_profile from '../assets/user_profile.png'
import Loading from '~/components/Loading'

const ProfilePage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [shwoEdit, setShowEdit] = useState<Boolean>(false)

  const { user, isLoading, isError, isSuccess } = useGetMe()

  return (
    <div className="flex justify-center flex-col pt-5">
      <h2 className="text-2xl font-semibold mb-4 text-black">Profile</h2>

      {!isSuccess ? (
        <div className="bg-[white] p-10 bg-white shadow-md rounded-lg  mb-4">
          <Formik
            initialValues={{
              name: user?.name,
              scheduleTime: user?.scheduleTime,
              image: '',
              email: '',
              status: 'active',
            }}
            onSubmit={() => {}}
            validationSchema={Yup.object().shape({
              name: Yup.string().required('Required'),
              scheduleTime: Yup.string().required('Required'),
              image: Yup.string().required('Image is required'),
              email: Yup.string().email('Invalid Email Address').required('Image is required'),
            })}
          >
            {(props) => {
              const {
                values,
                touched,
                errors,
                dirty,
                isSubmitting,
                handleChange,
                handleBlur,
                handleSubmit,
                handleReset,
              } = props
              return (
                <form onSubmit={handleSubmit} className="w-full ">
                  <input
                    type="file"
                    id="file_upload"
                    className="hidden"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const files = event.target.files
                      if (files && files.length > 0) {
                        setSelectedFile(files[0])
                        const imageUrl = URL.createObjectURL(files[0])
                        setImagePreview(imageUrl)
                        values.image = files[0].name
                      }
                    }}
                  />
                  <div className="grid grid-cols-12">
                    <div className="col-span-3 ">
                      <label
                        htmlFor="file_upload"
                        id="file_upload"
                        className="cursor-pointer flex justify-center items-center w-40  rounded-lg relative"
                        onMouseOver={() => {
                          if (imagePreview) {
                            setShowEdit(true)
                          }
                        }}
                        onMouseLeave={() => {
                          if (imagePreview) {
                            setShowEdit(false)
                          }
                        }}
                      >
                        <img src={imagePreview || user_profile} alt="upload" className="w-full " />

                        {shwoEdit && (
                          <div className="flex justify-center items-center absolute h-full w-full bg-gray-800 bg-opacity-50 text-white p-2 rounded-full bottom-0 w-full">
                            <MdOutlineModeEditOutline size={30} />
                          </div>
                        )}
                      </label>
                      {errors.image && touched.image && <div className="text-red-500  text-m ">{errors.image}</div>}
                    </div>
                    <div className="col-span-9 mb-5">
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                          Name
                        </label>
                        <input
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            errors.name && touched.name ? 'border-red-500' : ''
                          }`}
                          id="name"
                          type="text"
                          placeholder="Name "
                        />
                        {errors.name && touched.name && <div className="text-red-500 text-m">{errors.name}</div>}
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                          Email
                        </label>
                        <input
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            errors.email && touched.email ? 'border-red-500' : ''
                          }`}
                          id="name"
                          type="text"
                          placeholder="Name "
                        />
                        {errors.email && touched.email && <div className="text-red-500 text-m">{errors.email}</div>}
                      </div>

                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                          Schedule Time
                        </label>
                        <input
                          value={values.scheduleTime}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            errors.scheduleTime && touched.scheduleTime ? 'border-red-500' : ''
                          }`}
                          id="name"
                          type="text"
                          placeholder="Name "
                        />
                        {errors.scheduleTime && touched.scheduleTime && (
                          <div className="text-red-500 text-m">{errors.scheduleTime}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button className="w-[100px]">Submit</Button>
                </form>
              )
            }}
          </Formik>
        </div>
      ) : (
        <div className="flex justify-center">
          <Loading big />
        </div>
      )}
    </div>
  )
}

export default ProfilePage
