import React, { useContext, useState } from 'react'
import axios from 'axios'
import AuthLayout from '../../components/layouts/AuthLayout'
import { validateEmail } from '../../utils/helper'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import Input from '../../components/Inputs/Input'
import { Link, useNavigate } from 'react-router-dom'
import { API_PATHS } from '../../utils/apiPaths'
import { axiosInstance } from '../../utils/axiosInstance'
import { UserContext } from '../../context/UserContext'
import uploadImage from '../../utils/uploadImage'

const SignUp = () => {
  const [profilePic, setProfilePic] = useState<File | null>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminInviteToken, setAdminInviteToken] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { updateUser } = useContext(UserContext)!
  const navigate = useNavigate()

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()


    let profileImageUrl = ''

    if (!fullName) {
      setError('Please enter full name')
      return
    }


    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!password) {
      setError('Please enter a password')
      return
    }

    setError("")

    //* SignUp API Call here
    try {
      // Upload image to server
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic)
        profileImageUrl = imgUploadRes.imageUrl || ""
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken
      })
      const { token, role } = response.data
      if (token) {
        localStorage.setItem('token', token)
        updateUser(response.data)


        if (role === 'admin') {
          navigate('/admin/dashboard')
        } else {
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
      <div className="lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an account</h3>
        <p className=" text-xs text-slate-700 mt-1.25 mb-6">
          Join us today by entering your details below
        </p>

        <form onSubmit={handleSignUp} >
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid gid-col-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full name"
              placeholder="John Doe"
              type="text"
            />
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

            <Input
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label="Admin Invite Token"
              type="text"
              placeholder="6 Digit Code"
            />
            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
            <button type="submit" className="btn-primary">
              Sign Up
            </button>
            <p className="text-[13px] text-slate-800 mt-3">
              Already have an account? {" "}
              <Link className="font-medium text-primary underline" to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp