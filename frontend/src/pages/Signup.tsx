import { Formik } from 'formik'
import React, { useState } from 'react'
import { useSignup } from '~/hooks/auth'
import * as Yup from 'yup'
import Button from '~/components/Button/Button'
import { NavLink, useNavigate } from 'react-router-dom'
import Input from '~/components/Input/Input'

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const { signup, isLoading } = useSignup()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // await mutateAsync(formData)
      await signup(formData)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Signup </h2>
        </div>
        <Formik
          initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }}
          onSubmit={async (values, { setErrors }) => {
            try {
              // await mutateAsync(formData)
              await signup({
                email: values.email,
                password: values.password,
                name: `${values.firstName} ${values.lastName}`,
              })
            } catch (error) {
              console.error(error)
            }
          }}
          validationSchema={Yup.object().shape({
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required'),
            email: Yup.string().email('Invalid email').required('Email is Required'),
            password: Yup.string()
              .min(8, 'Password must be at least 8 characters')
              .matches(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain at least one letter and one number')
              .required('Password is required'),
            confirmPassword: Yup.string()
              // @ts-ignore
              .oneOf([Yup.ref('password'), null], 'Passwords must match')
              .required('Confirm Password is required'),
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
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-md  flex flex-col gap-3">
                  <Input
                    id="name"
                    name="firstName" // Name field
                    type="text"
                    placeholder="First Name"
                    value={values.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && touched.firstName && (
                    <div className="text-red-500 text-m m-0 ">{errors.firstName}</div>
                  )}

                  <Input
                    id="name"
                    name="lastName" // Name field
                    type="text"
                    placeholder="Last Name"
                    value={values.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && touched.lastName && (
                    <div className="text-red-500 text-m m-0 ">{errors.lastName}</div>
                  )}

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email address"
                    value={values.email}
                    onChange={handleChange}
                  />
                  {errors.email && touched.email && <div className="text-red-500 text-m m-0 ">{errors.email}</div>}

                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                  />
                  {errors.password && touched.password && (
                    <div className="text-red-500 text-m m-0 ">{errors.password}</div>
                  )}

                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="text-red-500 text-m m-0 ">{errors.confirmPassword}</div>
                  )}
                </div>

                <div>
                  <Button className="mb-3" isLoading={isLoading}>
                    Signup
                  </Button>

                  <div className="flex justify-end">
                    <p className="mr-3">Already have an account?</p>
                    <NavLink to="/login">
                      <p className="text-indigo-700"> Login</p>
                    </NavLink>
                  </div>
                </div>
              </form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}

export default Signup
