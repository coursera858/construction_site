import Input from '../../components/ui/Input'
import { Link } from 'react-router-dom'

const LoginForm = ({ handleLogin, register, handleSubmit, errors }) => {

    return (
        <form onSubmit={handleSubmit(handleLogin)} className='auth-form'>
            <h2>Welcome back</h2>
            <p className="auth-subtitle">Sign in to your account</p>

            <Input
                type='text'
                name='username'
                placeholder='Enter user name'
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

            <button type="submit">Sign In</button>

            <p className="auth-link">
                Don't have an account? <Link to="/register">Create one</Link>
            </p>
        </form>
    )
}

export default LoginForm