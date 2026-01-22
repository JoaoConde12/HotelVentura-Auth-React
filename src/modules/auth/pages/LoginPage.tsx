import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useState } from 'react';
import { Input } from '../../../shared/ui/components/Input';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const params = new URLSearchParams();
      params.append('username', data.username);
      params.append('password', data.password);

      const response = await axios.post(`${API_URL}/login`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token } = response.data;

      const isLocalhost = window.location.hostname.includes('localhost');

      Cookies.set('token', access_token, {
        expires: 7,
        domain: isLocalhost ? undefined : '.hotelventura.com.ec',
        secure: window.location.protocol === 'https:',
        sameSite: 'Lax',
      });

      const mainAppUrl = isLocalhost
        ? 'http://localhost:5173/admin'
        : 'https://hotelventura.com.ec/admin';

      window.location.href = mainAppUrl;
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401 || error.response?.status === 400) {
        setAuthError('Credenciales incorrectas. Verifica tu correo y contraseña.');
      } else {
        setAuthError('Ocurrió un error al iniciar sesión.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-dark px-4 py-12 font-sans">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img
            src="/imgs/navlogo.png"
            alt="Hotel Ventura Logo"
            className="w-auto mx-auto my-0 h-10 md:h-12 mb-10 object-contain"
          />
          <h2 className="font-serif text-3xl font-bold text-white">Bienvenido</h2>
          <p className="mt-2 text-sm text-slate-400">
            Ingresa tus credenciales para acceder al panel
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-surface-dark/60 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="admin@hotelventura.com"
              error={errors.username?.message}
              {...register('username', { required: 'El correo es obligatorio' })}
            />

            <div className="relative">
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password', { required: 'La contraseña es obligatoria' })}
              />
              <div className="mt-1 text-right">
                <a href="#" className="text-xs text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            {authError && (
              <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-center text-sm text-rose-400">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full transform rounded-lg bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wider text-background-dark transition-all hover:bg-primary-light hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-400">¿No tienes cuenta? </span>
            <Link
              to="/auth/register"
              className="font-semibold text-primary hover:text-primary-light hover:underline"
            >
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
