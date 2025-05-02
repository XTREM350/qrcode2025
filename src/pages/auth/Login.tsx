import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Veuillez entrer un email valide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const success = await login(data.email, data.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setLoginError('Email ou mot de passe invalide');
      }
    } catch (error) {
      setLoginError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Bienvenue</h2>
        <p className="text-gray-400 mt-2">Connectez-vous à votre compte</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="email"
          placeholder="Adresse email"
          label="Email"
          leftIcon={<Mail size={18} />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          type="password"
          placeholder="Mot de passe"
          label="Mot de passe"
          leftIcon={<Lock size={18} />}
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-700 rounded bg-background-400"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
              Se souvenir de moi
            </label>
          </div>

          <Link to="/forgot-password" className="text-primary-500 text-sm hover:text-primary-400">
            Mot de passe oublié ?
          </Link>
        </div>

        {loginError && (
          <div className="p-3 bg-error-500/10 border border-error-500/50 rounded text-error-400 text-sm">
            {loginError}
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
        >
          Se connecter
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Vous n'avez pas de compte ?{' '}
            <Link to="/register" className="text-primary-500 hover:text-primary-400">
              S'inscrire
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
