import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const profileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password must be at least 6 characters'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const Profile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  const { 
    register: registerProfile, 
    handleSubmit: handleProfileSubmit, 
    formState: { errors: profileErrors } 
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });

  const { 
    register: registerPassword, 
    handleSubmit: handlePasswordSubmit, 
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsPasswordLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully');
      resetPassword();
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=25D366&color=fff`} 
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-primary-500"
                />
                <button 
                  className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition"
                  onClick={() => toast.info('Avatar upload functionality would be implemented here')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-white">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
              <div className="mt-2 px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
              <p className="mt-4 text-gray-400 text-sm">
                Joined on {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Card>
        </div>
        
        {/* Profile Edit Form */}
        <div className="md:col-span-2 space-y-6">
          <Card title="Profile Information">
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Your full name"
                leftIcon={<User size={18} />}
                error={profileErrors.name?.message}
                {...registerProfile('name')}
              />
              
              <Input
                label="Email Address"
                placeholder="Your email address"
                leftIcon={<Mail size={18} />}
                error={profileErrors.email?.message}
                {...registerProfile('email')}
              />
              
              <div className="pt-4">
                <Button
                  type="submit"
                  isLoading={isLoading}
                >
                  Update Profile
                </Button>
              </div>
            </form>
          </Card>
          
          <Card title="Change Password">
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              <Input
                type="password"
                label="Current Password"
                placeholder="Your current password"
                leftIcon={<Lock size={18} />}
                error={passwordErrors.currentPassword?.message}
                {...registerPassword('currentPassword')}
              />
              
              <Input
                type="password"
                label="New Password"
                placeholder="Your new password"
                leftIcon={<Lock size={18} />}
                error={passwordErrors.newPassword?.message}
                {...registerPassword('newPassword')}
              />
              
              <Input
                type="password"
                label="Confirm New Password"
                placeholder="Confirm your new password"
                leftIcon={<Lock size={18} />}
                error={passwordErrors.confirmPassword?.message}
                {...registerPassword('confirmPassword')}
              />
              
              <div className="pt-4">
                <Button
                  type="submit"
                  isLoading={isPasswordLoading}
                >
                  Change Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;