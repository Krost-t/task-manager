import React, { useContext, useState } from 'react'
import axios from 'axios'
import AuthLayout from '../../components/layouts/AuthLayout'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../../components/Inputs/Input'
import { validateEmail } from '../../utils/helper'
import { axiosInstance } from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/UserContext'


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)


  const { updateUser } = useContext(UserContext)!
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!password) {
      setError('Please enter a password')
      return
    }

    setError("")

    //* Login API Call here
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      })
      const {token, role} = response.data

      if(token){
        localStorage.setItem('token', token)
        updateUser(response.data)

        if(role === 'admin'){
          navigate('/admin/dashboard')
        }else{
          navigate('/user/dashboard')
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('An error occurred. Please try again.')
      }
    }

  }

  return (
  <AuthLayout>
    <div className="lg:w-[70%] h-3/4 md:h-full flex  flex-col justify-center">
      <h3 className="text-xl font-semibold text-black">Welcome back!</h3>
      <p className=" text-xs text-slate-700 mt-1.25 mb-6">
        Please login to your account
      </p>

      <form className="w-full" onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email address"
          type="email"
          placeholder="john@example.com"
        />

        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          type="password"
          placeholder="Min 8 Characters"
        />
        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
        <button
          type="submit"
          className="btn-primary">
          Login
        </button>

        <p className="text-[13px] text-slate-800 mt-3">
          Don't have an account? {" "}
          <Link className="font-medium text-primary underline" to="/signup">Sign Up</Link>

        </p>
      </form>
    </div>
  </AuthLayout>
  )
}

export default Login