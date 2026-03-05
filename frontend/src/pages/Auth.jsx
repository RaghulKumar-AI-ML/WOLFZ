import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Auth() {
  const navigate = useNavigate()
  const { registerAndLogin, login, loading, error } = useAuthStore()

  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: '', username: '', password: '' })

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const submit = async (event) => {
    event.preventDefault()
    const ok = mode === 'register' ? await registerAndLogin(form) : await login({ username: form.username, password: form.password })
    if (ok) navigate('/account')
  }

  return (
    <section className="panel auth-card stack-sm">
      <h1>{mode === 'register' ? 'Create Account' : 'Login'}</h1>
      <p>Access your pack profile and checkout.</p>

      <form className="stack-sm" onSubmit={submit}>
        {mode === 'register' ? <input className="input-field" type="email" placeholder="Email" required value={form.email} onChange={(e) => setField('email', e.target.value)} /> : null}
        <input className="input-field" placeholder="Username or Email" required value={form.username} onChange={(e) => setField('username', e.target.value)} />
        <input className="input-field" type="password" placeholder="Password" required value={form.password} onChange={(e) => setField('password', e.target.value)} />
        <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Please wait...' : mode === 'register' ? 'Register' : 'Login'}</button>
      </form>

      {error ? <p className="status-line error">{error}</p> : null}
      <button className="btn-ghost" type="button" onClick={() => setMode((m) => (m === 'login' ? 'register' : 'login'))}>
        {mode === 'register' ? 'Have account? Login' : 'Need account? Register'}
      </button>
    </section>
  )
}
