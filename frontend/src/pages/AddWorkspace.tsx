import { Formik } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { useCreateWorkspace, useGetWorkspace, useUploadImage } from '~/hooks/workspace'
import { WorkspaceInfo } from '~/types/workspace'

interface AddWorkspaceI {
  name: string
  description: string
  image: File[]
}

const AddWorkspace = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [shwoEdit, setShowEdit] = useState<Boolean>(false)

  const { workspaces } = useGetWorkspace()
  const { createWorkspace } = useCreateWorkspace()
  const { uploadImage } = useUploadImage()

  return (
    <div className="flex justify-center flex-col pt-5">
      <h2 className="text-2xl font-semibold mb-4 text-black">Add Workspace</h2>
      <Formik
        initialValues={{ name: '', description: '', image: '', status: 'active', scheduleTime: 0, slug: '' }}
        onSubmit={({ name, description, image, status, scheduleTime, slug }) => {
          try {
            createWorkspace({
              name: name,
              description: description,
              logo: image,
              status: status,
              scheduleTime: scheduleTime,
              slug: slug === '' ? undefined : slug,
            })
          } catch (e) {}
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .required('Required')
            .test('unique', 'Name already exists', (value) => {
              return !workspaces?.data?.find((workspace: WorkspaceInfo) => workspace.name.toLowerCase() === value)
            }),
          description: Yup.string().required('Required'),
          image: Yup.string().required('Image is required'),
          scheduleTime: Yup.number().min(30, 'Schedule Time should be greater than 30').required('Required'),
          slug: Yup.string()
            .test('unique', 'Slug already exists', (value) => {
              if (!value) return true

              return !workspaces?.data?.find((workspace: WorkspaceInfo) => workspace.slug === value)
            })
            .test('validate', 'Slug should be in lowercase and no space', (value) => {
              if (!value) return true
              return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
            }),
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
            setValues,
          } = props
          return (
            <form onSubmit={handleSubmit} className="w-full bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
              <input
                type="file"
                accept="image/*"
                id="file_upload"
                className="hidden"
                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                  const files = event.target.files
                  if (files && files.length > 0) {
                    const data = await uploadImage(files[0])

                    const url = data?.url

                    if (url) {
                      setValues({ ...values, image: data?.url })
                      setImagePreview(data?.url)
                    }
                  }
                }}
              />
              <div className="flex justify-center">
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
                  <img src={imagePreview || require('./../assets/upload_img.jpg')} alt="upload" className="w-full " />

                  {shwoEdit && (
                    <div className="flex justify-center items-center absolute h-full w-full bg-gray-800 bg-opacity-50 text-white p-2 rounded-lg bottom-0 w-full">
                      <MdOutlineModeEditOutline size={30} />
                    </div>
                  )}
                </label>
              </div>
              {errors.image && touched.image && <div className="text-red-500 text-m text-center">{errors.image}</div>}

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
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">
                  Slug
                </label>
                <input
                  value={values.slug}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.slug && touched.slug ? 'border-red-500' : ''
                  }`}
                  id="slug"
                  type="text"
                  placeholder="Slug "
                />
                {errors.slug && touched.slug && <div className="text-red-500 text-m">{errors.slug}</div>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scheduleTime">
                  Schedule Time
                </label>
                <input
                  value={values.scheduleTime || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.scheduleTime && touched.scheduleTime ? 'border-red-500' : ''
                  }`}
                  id="scheduleTime"
                  type="number"
                  placeholder="Schedule Time "
                />
                {errors.scheduleTime && touched.scheduleTime && (
                  <div className="text-red-500 text-m">{errors.scheduleTime}</div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.description && touched.description ? 'border-red-500' : ''
                  }`}
                  id="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Description"
                ></textarea>
                {errors.description && touched.description && (
                  <div className="text-red-500 text-m">{errors.description}</div>
                )}
              </div>

              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Submit
              </button>
            </form>
          )
        }}
      </Formik>
    </div>
  )
}

export default AddWorkspace
