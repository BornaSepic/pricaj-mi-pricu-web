import { FormEvent } from 'react'
import { useRouter } from 'next/router'
import { API_URL } from '../../core/constants'
import { LoginSuccessResponse } from '../../core/types/auth'

export default function LoginPage() {
  const router = useRouter()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    const accessToken = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(res => res.json())
      .then(rawData => {
        const { success, data, error } = LoginSuccessResponse.safeParse(rawData)

        if (!success) {
          throw new Error('Invalid credentials', { cause: error })
        }

        return data.access_token
      })

    localStorage.setItem('access_token', accessToken)
  }

  return (
    <form onSubmit={handleSubmit} autoComplete='off'>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  )
}