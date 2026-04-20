import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { sileo } from 'sileo'
import { useAuthActions, useAuthSession } from '../hooks/useAuth'
import type { AuthCredentials, AuthRegisterInput } from '../types/auth'

type Mode = 'login' | 'register'

export const Auth = () => {
  const [mode, setMode] = useState<Mode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const { login, register, clearError } = useAuthActions()
  const { loading, error } = useAuthSession()
  const navigate = useNavigate()

  const loginForm = useForm<AuthCredentials>({
    defaultValues: { email: 'scout@ldp.com', password: 'secret123' },
  })

  const registerForm = useForm<AuthRegisterInput>({
    defaultValues: { name: 'Scout Pro', email: 'scout@ldp.com', password: 'secret123' },
  })

  const loginSubmit = loginForm.handleSubmit(async (values) => {
    try {
      await login(values)
      sileo.success({
        title: 'Sesion iniciada',
        description: 'Bienvenido al panel',
      })
      navigate('/', { replace: true })
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : 'No se pudo iniciar sesion'
      sileo.error({
        title: 'Error al iniciar sesion',
        description: message,
      })
    }
  })

  const registerSubmit = registerForm.handleSubmit(async (values) => {
    try {
      await register(values)
      sileo.success({
        title: 'Cuenta creada',
        description: 'Tu registro fue exitoso',
      })
      navigate('/', { replace: true })
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : 'No se pudo crear la cuenta'
      sileo.error({
        title: 'Error al registrar cuenta',
        description: message,
      })
    }
  })

  return (
    <div className="grid min-h-screen place-items-center bg-[#0f0f0f] px-4 py-6 text-[#f2f2f2]">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.5)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative flex flex-col justify-between border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(0,224,148,0.18),transparent_34%),linear-gradient(180deg,#141414_0%,#0f0f0f_100%)] p-8 lg:border-b-0 lg:border-r lg:border-white/10 lg:p-10">
          <div>
            <h1 className="mt-5 max-w-lg text-4xl font-extrabold leading-tight md:text-5xl">
              Scout Panel
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/65 md:text-base">
              Ingresa para encontrar toda la información acerca de los jugadores, sus estadísticas y más.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#171717] p-5 md:p-6">
            <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-black/30 p-1">
              <button
                type="button"
                onClick={() => {
                  clearError()
                  setMode('login')
                }}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  mode === 'login' ? 'bg-[#00E094] text-black' : 'text-white/70 hover:bg-white/5'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  clearError()
                  setMode('register')
                }}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  mode === 'register' ? 'bg-[#00E094] text-black' : 'text-white/70 hover:bg-white/5'
                }`}
              >
                Registrarse
              </button>
            </div>

            {mode === 'login' ? (
              <form className="space-y-4" onSubmit={loginSubmit}>
                <div>
                  <label className="mb-2 block text-sm text-white/70" htmlFor="login-email">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm outline-none focus:border-[#00E094]/40"
                    autoComplete="email"
                    {...loginForm.register('email', { required: true })}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70" htmlFor="login-password">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 pr-12 text-sm outline-none focus:border-[#00E094]/40"
                      autoComplete="current-password"
                      {...loginForm.register('password', { required: true, minLength: 6 })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                      onClick={() => setShowPassword((current) => !current)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00E094] px-4 py-3 text-sm font-bold text-black transition hover:brightness-110"
                >
                  <UserRound size={16} />
                  {loading ? 'Ingresando...' : 'Entrar al panel'}
                </button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={registerSubmit}>
                <div>
                  <label className="mb-2 block text-sm text-white/70" htmlFor="register-name">
                    Nombre
                  </label>
                  <input
                    id="register-name"
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm outline-none focus:border-[#00E094]/40"
                    autoComplete="name"
                    {...registerForm.register('name', { required: true, minLength: 2 })}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70" htmlFor="register-email">
                    Correo
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm outline-none focus:border-[#00E094]/40"
                    autoComplete="email"
                    {...registerForm.register('email', { required: true })}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70" htmlFor="register-password">
                    Contraseña
                  </label>
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm outline-none focus:border-[#00E094]/40"
                    autoComplete="new-password"
                    {...registerForm.register('password', { required: true, minLength: 6 })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00E094] px-4 py-3 text-sm font-bold text-black transition hover:brightness-110"
                >
                  <UserRound size={16} />
                  {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
              </form>
            )}

            {error ? (
              <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            ) : null}

            <p className="mt-4 text-center text-xs text-white/45">
              Usa una cuenta valida registrada en el backend para iniciar sesion.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
