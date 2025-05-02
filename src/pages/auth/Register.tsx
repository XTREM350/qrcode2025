
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Phone, Image as ImageIcon, Building2 } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';

// Validation des formats
const PHONE_REGEX = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// Types pour les rôles
export type UserRole = 'ADMIN' | 'admin' | 'parent' | 'student' | 'educator' | 'driver' | 'cook';

// Schéma de validation amélioré
const registerSchema = z.object({
  name: z.string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(50, 'Le nom ne doit pas dépasser 50 caractères'),
  email: z.string()
    .email('Veuillez entrer un email valide')
    .toLowerCase(),
  phone: z.string()
    .regex(PHONE_REGEX, 'Numéro de téléphone invalide')
    .min(10, 'Le numéro doit contenir au moins 10 chiffres'),
  role: z.enum(['ADMIN', 'admin', 'parent', 'student', 'educator', 'driver', 'cook'] as const),
  organization: z.string()
    .min(2, "Le nom de l'organisation est requis")
    .max(100, "Le nom de l'organisation est trop long"),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(PASSWORD_REGEX, 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),
  confirmPassword: z.string(),
  avatar: z.instanceof(FileList).optional()
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface UploadAvatarResult {
  url: string;
  path: string;
}

const Register = () => {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'parent',
      organization: '',
      password: '',
      confirmPassword: '',
    }
  });

  const avatarFile = watch('avatar');

  interface SelectOption {
    value: UserRole;
    label: string;
  }

  const roleOptions: SelectOption[] = [
    { value: 'ADMIN', label: 'Administrateur' },
    { value: 'parent', label: 'Parent' },
    { value: 'student', label: 'Étudiant' },
    { value: 'educator', label: 'Éducateur' },
    { value: 'driver', label: 'Chauffeur' },
    { value: 'cook', label: 'Cuisinier' }
  ];

  const uploadAvatar = async (userId: string, file: File): Promise<UploadAvatarResult> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Vérification de la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('La taille du fichier ne doit pas dépasser 5MB');
      }

      // Vérification du type de fichier
      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image');
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return { url: publicUrl, path: filePath };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw new Error('Erreur lors du téléchargement de l\'avatar');
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setRegisterError(null);

    try {
      // 1. Upload avatar
      let avatarUrl = null;
      if (data.avatar && data.avatar.length > 0) {
        const file = data.avatar[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${data.email}-${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(`user-avatars/${fileName}`, file);

        if (uploadError) throw uploadError;

        avatarUrl = supabase.storage
          .from('avatars')
          .getPublicUrl(uploadData.path).data.publicUrl;
      }

      // 2. Register user
      const success = await authRegister(data.email, data.password, {
        name: data.name,
        phone: data.phone,
        role: data.role,
        organization: data.organization,
        avatar_url: avatarUrl
      });

      if (success) {
        toast.success('Inscription réussie !');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);

      let errorMessage = 'Échec de l\'inscription';
      if (error instanceof Error) {
        if (error.message.includes('already registered')) {
          errorMessage = 'Email déjà utilisé';
          setError('email', { message: errorMessage });
        } else if (error.message.includes('avatar_url')) {
          errorMessage = 'Problème de configuration serveur';
        }
      }

      toast.error(errorMessage);
      setRegisterError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Créer un compte</h2>
        <p className="text-gray-400 mt-2">Inscrivez-vous pour accéder à votre compte</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Champ Avatar */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Photo de profil</label>
          <div className="flex items-center gap-4">
            {avatarFile && avatarFile.length > 0 ? (
              <img
                src={URL.createObjectURL(avatarFile[0])}
                alt="Preview"
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <input
              type="file"
              id="avatar"
              accept="image/*"
              className="hidden"
              {...register('avatar')}
            />
            <label
              htmlFor="avatar"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition"
            >
              Choisir une image
            </label>
          </div>
        </div>

        {/* Champs du formulaire */}
        <Input
          label="Nom complet"
          placeholder="Votre nom complet"
          leftIcon={<User size={18} />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="votre@email.com"
          leftIcon={<Mail size={18} />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Téléphone"
          type="tel"
          placeholder="+33 6 XX XX XX XX"
          leftIcon={<Phone size={18} />}
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Select
          label="Rôle"
          options={roleOptions}
          error={errors.role?.message}
          {...register('role')}
        />

        <Input
          label="Organisation"
          placeholder="Nom de votre organisation"
          leftIcon={<Building2 size={18} />}
          error={errors.organization?.message}
          {...register('organization')}
        />

        <Input
          label="Mot de passe"
          type="password"
          placeholder="********"
          leftIcon={<Lock size={18} />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirmer le mot de passe"
          type="password"
          placeholder="********"
          leftIcon={<Lock size={18} />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {registerError && (
          <div className="text-red-500 text-sm mt-2">{registerError}</div>
        )}

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Vous avez déjà un compte?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-400">
              Se connecter
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
