import Input from '../../components/ui/Input'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '../../schema/Auth.Form';
import { postRequest } from '../../api/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(RegisterSchema) })
    const navigate = useNavigate()

    const handleRegister = async (data) => {
        const response = await postRequest('/auth/register', data)
        if (response.success) {
            toast.success('Account created successfully')
            reset()
            navigate('/login')
        }
    }

    return (
        <form onSubmit={handleSubmit(handleRegister)} className='auth-form'>
            <h2>Create Account</h2>
            <p className="auth-subtitle">Get started with BuildOps</p>

            <Input
                type='text'
                name='username'
                placeholder='Enter user name'
                errors={errors}
                register={register}
                error={errors}
            />
            <Input
                type='email'
                name='email'
                placeholder='Enter your email'
                errors={errors}
                register={register}
                error={errors}
            />
            <Input
                type='password'
                name='password'
                placeholder='Enter your password'
                errors={errors}
                register={register}
                error={errors}
            />

            <button type="submit">Create Account</button>

            <p className="auth-link">
                Already have an account? <Link to="/login">Sign in</Link>
            </p>
        </form>
    )
}

export default RegisterForm