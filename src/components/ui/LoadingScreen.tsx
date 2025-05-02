import { School } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-background-500 flex flex-col items-center justify-center z-50">
      <div className="relative">
        <div className="absolute inset-0 animate-ping">
          <School className="w-12 h-12 text-primary-500/50" />
        </div>
        <School className="w-12 h-12 text-primary-500" />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-white">Loading...</h2>
      <div className="mt-4 w-48 h-2 bg-background-400 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full animate-loading"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
