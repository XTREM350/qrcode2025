import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';

const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  role: z.enum(['parent', 'student', 'educator', 'driver', 'cook']),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'parent',
      password: '',
      confirmPassword: '',
    }
  });

  const roleOptions = [
    { value: 'parent', label: 'Parent' },
    { value: 'student', label: 'Student' },
    { value: 'educator', label: 'Educator' },
    { value: 'driver', label: 'Driver' },
    { value: 'cook', label: 'Cook' }
  ];

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setRegisterError(null);

    try {
      const success = await authRegister(data.email, data.password, {
        name: data.name,
        role: data.role,
      });

      if (success) {
        navigate('/login');
      } else {
        setRegisterError('Registration failed. Please try again.');
      }
    } catch (error) {
      setRegisterError('An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Create Account</h2>
        <p className="text-gray-400 mt-2">Sign up to get started</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Your full name"
          leftIcon={<User size={18} />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          type="email"
          label="Email"
          placeholder="your@email.com"
          leftIcon={<Mail size={18} />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Select
          label="Role"
          options={roleOptions}
          error={errors.role?.message}
          {...register('role')}
        />

        <Input
          type="password"
          label="Password"
          placeholder="********"
          leftIcon={<Lock size={18} />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          type="password"
          label="Confirm Password"
          placeholder="********"
          leftIcon={<Lock size={18} />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {registerError && (
          <div className="p-3 bg-error-500/10 border border-error-500/50 rounded text-error-400 text-sm">
            {registerError}
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
        >
          Create Account
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-400">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
