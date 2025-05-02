import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

const forgotPasswordSchema = z.object({
  email: z.string().email('Veuillez entrer un email valide'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await forgotPassword(data.email);
      if (result) {
        setSuccess(true);
      } else {
        setError('Échec de l\'envoi du lien. Veuillez réessayer.');
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Réinitialiser le mot de passe</h2>
        <p className="text-gray-400 mt-2">
          Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe
        </p>
      </div>

      {success ? (
        <div className="space-y-4">
          <div className="p-4 bg-success-500/10 border border-success-500/50 rounded text-success-400 text-sm">
            Vérifiez votre email pour le lien de réinitialisation. S'il n'apparaît pas dans quelques minutes, vérifiez votre dossier spam.
          </div>
          <Link to="/login">
            <Button fullWidth variant="secondary">
              Retour à la connexion
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Adresse email"
              label="Email"
              leftIcon={<Mail size={18} />}
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          {error && (
            <div className="p-3 bg-error-500/10 border border-error-500/50 rounded text-error-400 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            Envoyer le lien
          </Button>

          <div className="text-center">
            <Link to="/login" className="text-primary-500 text-sm hover:text-primary-400">
              Retour à la connexion
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
