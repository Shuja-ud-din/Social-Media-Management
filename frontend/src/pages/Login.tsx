import React, { useState } from 'react'
import { useLogin } from '~/hooks/auth'
import { Link, NavLink } from 'react-router-dom'
import Loading from '~/components/Loading'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Input from '~/components/Input/Input'
import Button from '~/components/Button/Button'

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }
  const { login, isSuccess, isLogginIn, isError, error: loginError } = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isLogginIn) return
      await login(formData)
    } catch (err: any) {}
  }

  // write a code to redirect page after login success to /user/dashboard page using navigate hook from react-router-dom

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login</h2>
        </div>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={async (values, { setErrors }) => {
            try {
              if (isLogginIn) return
              await login({ email: values.email, password: values.password })
            } catch (err: any) {}
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email('Invalid email').required('Email is Required'),
            password: Yup.string()
              .min(8, 'Password must be at least 8 characters')
              .matches(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain at least one letter and one number')
              .required('Password is required'),
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
                <div className="rounded-md shadow-sm flex flex-col gap-3">
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
                  {errors.password && touched.password && <div className="text-red-500 text-m ">{errors.password}</div>}
                </div>

                <div>
                  <Button isLoading={isLogginIn}>Login</Button>
                  <div className="flex justify-end mt-2">
                    <p className="mr-3">Don't have account?</p>
                    <NavLink to="/signup">
                      <p className="text-indigo-700"> Sign Up</p>
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

export default Login
