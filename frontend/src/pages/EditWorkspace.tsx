import { Formik } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import Table from '~/components/Table/Table'
import { AiOutlineDelete } from 'react-icons/ai'
import { useParams } from 'react-router-dom'
import { useGetWorkspace, useGetWorkspaceDetails, useUpdateWorkspace, useUploadImage } from '~/hooks/workspace'
import Loading from '~/components/Loading'
import { scheduler } from 'timers/promises'
import { WorkspaceInfo } from '~/types/workspace'

const EditWorkspace = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [shwoEdit, setShowEdit] = useState<Boolean>(false)

  const { slug } = useParams()

  const { workspaces } = useGetWorkspace()
  const { uploadImage } = useUploadImage()
  const { workspace, isLoading, refetch } = useGetWorkspaceDetails(slug)
  const { updateWorkspace } = useUpdateWorkspace()

  return (
    <div className="flex justify-center flex-col w-full">
      <h2 className="text-2xl font-semibold mb-4 text-black">Edit Workspace</h2>

      {isLoading ? (
        <Loading height="50px" width="50px" />
      ) : (
        <Formik
          initialValues={{
            name: workspace?.name,
            description: workspace?.description,
            image: workspace?.logo,
            status: workspace?.status,
            scheduleTime: workspace?.scheduleTime,
          }}
          onSubmit={async ({ name, description, image, status, scheduleTime }) => {
            await updateWorkspace({
              _id: workspace?._id,
              name: name || '',
              description: description || '',
              logo: image || '',
              status: status || '',
              scheduleTime: scheduleTime || 300,
            })

            refetch()
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .required('Required')
              .test('unique', 'Name already exists', (value) => {
                return !workspaces?.data
                  ?.filter((item: WorkspaceInfo) => workspace?.name !== item.name)
                  .find((workspace: WorkspaceInfo) => workspace.name === value)
              }),
            description: Yup.string().required('Required'),
            image: Yup.string().required('Image is required'),
            scheduleTime: Yup.number().min(30, 'Schedule Time should be greater than 30').required('Required'),
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
              <form onSubmit={handleSubmit} className=" bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                <input
                  type="file"
                  id="file_upload"
                  className="hidden"
                  onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                    const files = event.target.files
                    if (files && files.length > 0) {
                      const resposnse = await uploadImage(files[0])
                      const url = resposnse?.url

                      if (url) {
                        values.image = url
                        setImagePreview(url)
                      }
                    }
                  }}
                />
                <div className="flex justify-center">
                  <label
                    htmlFor="file_upload"
                    id="file_upload"
                    className="cursor-pointer flex justify-center items-center w-[20rem]  rounded-lg relative"
                    onMouseEnter={() => {
                      if (values.image) {
                        setShowEdit(true)
                      }
                    }}
                    onMouseLeave={() => {
                      if (values.image) {
                        setShowEdit(false)
                      }
                    }}
                  >
                    <img
                      src={values.image || require('./../assets/upload_img.jpg')}
                      alt="upload"
                      className="w-full rounded-lg "
                    />

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
                    id="scheduleTime"
                    type="text"
                    placeholder="Schedule Time"
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

                {/* <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Collaborators
                  </label>
                  <div className="flex justify-end my-3">
                    <Autocomplete
                      disablePortal
                      className="p-0 bg-[white]"
                      size="small"
                      id="combo-box-demo"
                      // onChange={(e, newValue) => setSelectedClient(newValue)}
                      options={[{ name: 'John Doe' }, { name: 'Jane Doe' }, { name: 'John Smith' }]}
                      sx={{ width: 300 }}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => <TextField {...params} label="Collaborator" />}
                    />
                    <button className="ml-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      Add
                    </button>
                  </div>
                  <Table
                    array={[{ id: '1', name: 'John Doe', email: 'john@example.com' }]}
                    label={['#', 'Name', 'Email', 'Actions']}
                    keysToDisplay={['id', 'name', 'email']}
                    extraColumns={[
                      () => {
                        return <AiOutlineDelete size={20} className="cursor-pointer" color="red" />
                      },
                    ]}
                  /> 
                </div>
                   */}

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Status
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="status"
                    value={values.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Submit
                </button>
              </form>
            )
          }}
        </Formik>
      )}
    </div>
  )
}

export default EditWorkspace
