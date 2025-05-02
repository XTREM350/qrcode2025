import { Link } from 'react-router-dom';
import { School, Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background-500 flex flex-col items-center justify-center p-4">
      <div className="text-primary-500 mb-6">
        <School size={64} />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">404</h1>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
      <p className="text-gray-400 text-center max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button leftIcon={<Home size={18} />}>
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;