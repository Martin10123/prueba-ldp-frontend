import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, ShieldCheck, UserRound } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import type { AuthCredentials, AuthRegisterInput } from '../types/auth'

type Mode = 'login' | 'register'

export const Auth = () => {
  const [mode, setMode] = useState<Mode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const login = useAuthStore((state) => state.login)
  const register = useAuthStore((state) => state.register)

  const loginForm = useForm<AuthCredentials>({
    defaultValues: { email: 'scout@ldp.com', password: 'secret123' },
  })

  const registerForm = useForm<AuthRegisterInput>({
    defaultValues: { name: 'Scout Pro', email: 'scout@ldp.com', password: 'secret123' },
  })

  const loginSubmit = loginForm.handleSubmit((values) => {
    login(values)
  })

  const registerSubmit = registerForm.handleSubmit((values) => {
    register(values)
  })

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-4 py-6 text-[#f2f2f2]">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.5)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative flex flex-col justify-between border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(0,224,148,0.18),transparent_34%),linear-gradient(180deg,#141414_0%,#0f0f0f_100%)] p-8 lg:border-b-0 lg:border-r lg:border-white/10 lg:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00E094]/20 bg-[#00E094]/10 px-3 py-1 text-xs font-semibold text-[#00E094]">
              <ShieldCheck size={14} />
              Autenticación básica JWT
            </div>
            <h1 className="mt-5 max-w-lg text-4xl font-extrabold leading-tight md:text-5xl">
              Scout Panel con autenticación básica y sesión persistida.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/65 md:text-base">
              Un acceso simple con inicio de sesión / registro, token JWT demo guardado en localStorage y salida.
              Ideal para probar el flujo sin complicar la prueba técnica.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              ['JWT', 'Token persistido'],
              ['Seguro', 'Sesión básica'],
              ['Rápido', 'Sin backend real'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-[#00E094]">{title}</p>
                <p className="mt-1 text-sm text-white/65">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#171717] p-5 md:p-6">
            <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-black/30 p-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  mode === 'login' ? 'bg-[#00E094] text-black' : 'text-white/70 hover:bg-white/5'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
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
                      {...loginForm.register('password', { required: true })}
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
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00E094] px-4 py-3 text-sm font-bold text-black transition hover:brightness-110"
                >
                  <UserRound size={16} />
                  Entrar al panel
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
                    {...registerForm.register('name', { required: true })}
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
                    {...registerForm.register('password', { required: true })}
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00E094] px-4 py-3 text-sm font-bold text-black transition hover:brightness-110"
                >
                  <UserRound size={16} />
                  Crear cuenta
                </button>
              </form>
            )}

            <p className="mt-4 text-center text-xs text-white/45">
              Demostración de autenticación JWT. Puedes entrar con cualquier correo y contraseña.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
