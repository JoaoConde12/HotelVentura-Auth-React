import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { Input } from '../../../shared/ui/components/Input';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [reqError, setReqError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setReqError(null);

    try {
      const payload = {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        password: data.password,
        cedula: data.cedula,
        telefono: data.telefono,
        role: 'user',
      };

      await axios.post(`${API_URL}/users/`, payload);

      navigate('/auth/login');
    } catch (error: any) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        setReqError(error.response.data.detail || 'Error al registrarse');
      } else {
        setReqError('Ocurrió un error inesperado. Intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-dark px-4 py-12 font-sans">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30">
            <span className="material-symbols-outlined text-3xl text-primary">person_add</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-white">Crear una cuenta</h2>
          <p className="mt-2 text-sm text-slate-400">
            Únete a Hotel Ventura y gestiona tus reservas fácilmente
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-white/10 bg-surface-dark/60 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Fila 1: Nombre y Apellido */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="Nombre"
                placeholder="Ej. Joao"
                error={errors.nombre?.message as string}
                {...register('nombre', { required: 'El nombre es obligatorio' })}
              />
              <Input
                label="Apellido"
                placeholder="Ej. Conde"
                error={errors.apellido?.message as string}
                {...register('apellido', { required: 'El apellido es obligatorio' })}
              />
            </div>

            {/* Fila 2: Cédula y Teléfono (VALIDACIÓN NUMÉRICA Y MAX 10) */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="Cédula"
                placeholder="172..."
                type="text"
                maxLength={10}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                }}
                error={errors.cedula?.message as string}
                {...register('cedula', {
                  required: 'La cédula es obligatoria',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'La cédula debe tener 10 dígitos',
                  },
                })}
              />
              <Input
                label="Teléfono"
                placeholder="099..."
                type="tel"
                maxLength={10}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                }}
                error={errors.telefono?.message as string}
                {...register('telefono', {
                  required: 'El teléfono es obligatorio',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'El teléfono debe tener 10 dígitos',
                  },
                })}
              />
            </div>

            {/* Email */}
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="nombre@ejemplo.com"
              error={errors.email?.message as string}
              {...register('email', {
                required: 'El correo es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Correo inválido',
                },
              })}
            />

            {/* Contraseña */}
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message as string}
              {...register('password', {
                required: 'La contraseña es obligatoria',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              })}
            />

            {/* Errores del Backend */}
            {reqError && (
              <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-center text-sm text-rose-400">
                {reqError}
              </div>
            )}

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full transform rounded-lg bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wider text-background-dark transition-all hover:bg-primary-light hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Link al Login */}
          <div className="mt-6 text-center text-sm">
            <span className="text-slate-400">¿Ya tienes cuenta? </span>
            <Link
              to="/auth/login"
              className="font-semibold text-primary hover:text-primary-light hover:underline"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
