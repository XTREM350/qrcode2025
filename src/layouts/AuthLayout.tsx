import { Outlet } from 'react-router-dom';
import { School } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background-500">
      {/* Left side (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-600 to-primary-400 items-center justify-center p-8">
        <div className="text-white max-w-md animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <School size={48} />
            <h1 className="text-4xl font-bold">Gogo-Soft.2025</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Système de gestion scolaire</h2>
          <p className="mb-6 text-lg">
            Système de badges QR code sécurisé pour votre école avec paiements mobiles intégrés.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 rounded-full p-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Badges QR code</h3>
                <p className="text-white/80">Accès et paiements sécurisés grâce aux QR codes personnels</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 rounded-full p-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Paiements mobiles</h3>
                <p className="text-white/80">Suppression des manipulations d'espèces grâce à l'intégration des paiements mobiles</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 rounded-full p-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Tableau de bord en temps réel</h3>
                <p className="text-white/80">Suivi des activités et des transactions en temps réel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side (Login Form) */}
      <div className="flex flex-col flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo shown only on small screens */}
          <div className="md:hidden flex items-center justify-center mb-10">
            <div className="flex items-center gap-3">
              <School size={40} className="text-primary-500" />
              <h1 className="text-3xl font-bold text-white">Gogo-Soft.2025</h1>
            </div>
          </div>
          
          {/* Outlet for Login/ForgotPassword */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;