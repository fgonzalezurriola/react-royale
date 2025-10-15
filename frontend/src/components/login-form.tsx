import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AiTwotoneCrown } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { useLogin } from '@/hooks/useLogin'
import { useField } from '@/hooks/useField'
import { toast } from 'react-toastify'

interface Login2Props {
  heading?: string
  title?: string
  buttonText?: string
  googleText?: string
  signupText?: string
  signupUrl?: string
}

const Login2 = ({
  heading = 'Login',
  title = 'React Royale',
  buttonText = 'Login',
  signupText = 'Need an account?',
}: Login2Props) => {
  const { login } = useLogin()
  const username = useField('text')
  const password = useField('password')
  // const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault()
      await login({ username: username.value, password: password.value })
      username.reset()
      password.reset()
      // navigate('/')
      window.location.href = '/'
      toast.success('Login successful!')
    } catch (error: any) {
      console.error('Login failed:', error)
      const errorMessage = error?.response?.data?.error || 'Invalid username or password'
      toast.error(errorMessage)
    }
  }

  return (
    <section className="bg-white-100 h-screen pb-36">
      <form className="flex h-full items-center justify-center" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-6 lg:justify-start">
          <div className="flex items-center gap-4 text-3xl font-bold">
            <AiTwotoneCrown size={48} className="text-yellow-400" /> {title}
          </div>
          <div className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
            {heading && <h1 className="text-xl font-semibold">{heading}</h1>}
            <div className="flex w-full flex-col gap-2">
              <Label>Username</Label>
              <Input
                type={username.type}
                value={username.value}
                onChange={username.onChange}
                placeholder="Username"
                className="text-sm"
                required
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Label>Password</Label>
              <Input
                type={password.type}
                value={password.value}
                onChange={password.onChange}
                placeholder="Password"
                className="text-sm"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {buttonText}
            </Button>
          </div>
          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>{signupText}</p>
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </section>
  )
}

export { Login2 }
