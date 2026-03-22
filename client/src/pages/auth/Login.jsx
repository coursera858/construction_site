import { useForm } from 'react-hook-form'
import LoginForm from '../../forms/Auth/LoginForm'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '../../schema/Auth.Form'
import toast from 'react-hot-toast'
import { postRequest } from '../../api/api'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const { register, handleSubmit, formState: {
        errors
    }, reset } = useForm({ resolver: zodResolver(LoginSchema) })
    const navigate = useNavigate()
    const handleLogin = async (data) => {
        const response = await postRequest('/auth/login', data)
        console.log(response)
        if (response?.success) {
            toast.success(response.message, {
                style: {
                    background: '#44cc26',
                    color: 'white'
                }, iconTheme: {
                    primary: '#ffffff',
                    secondary: '#44cc26',
                }
            })
            navigate("/assets")
        } else {
            toast.error("something went wrong")
        }
        reset()

    }

    return (
        <div className="auth-form-holder">
            <LoginForm
                handleLogin={handleLogin}
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
            />
        </div>
    )
}

export default Login