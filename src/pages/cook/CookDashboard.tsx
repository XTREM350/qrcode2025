import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Utensils, ClipboardList, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { getStudents } from '../../services/studentService';
import { Student } from '../../types/User';

const CookDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [todayServed, setTodayServed] = useState(0);
  const [weeklyServed, setWeeklyServed] = useState(0);
  const [recentActivity, setRecentActivity] = useState<{ time: string; student: string; meal: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call for statistics
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        setTodayServed(45);
        setWeeklyServed(234);
        setRecentActivity([
          { time: '10:30 AM', student: 'John Doe', meal: 'Lunch' },
          { time: '10:28 AM', student: 'Jane Smith', meal: 'Lunch' },
          { time: '10:25 AM', student: 'Alex Johnson', meal: 'Lunch' },
          { time: '10:20 AM', student: 'Sarah Williams', meal: 'Lunch' },
        ]);
      } catch (error) {
        console.error('Error fetching cook dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-white">Cook Dashboard</h1>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex flex-col items-center text-center p-6">
          <div className="p-4 rounded-full bg-primary-500/20 mb-4">
            <QrCode className="h-8 w-8 text-primary-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Scan Student Badge</h3>
          <p className="text-sm text-gray-400 mb-4">
            Scan QR code to record meal service
          </p>
          <Link to="/dashboard/scanner" className="mt-auto w-full">
            <Button fullWidth>
              Open Scanner
            </Button>
          </Link>
        </Card>
        
        <Card className="flex flex-col items-center text-center p-6">
          <div className="p-4 rounded-full bg-success-500/20 mb-4">
            <Utensils className="h-8 w-8 text-success-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Today's Meals</h3>
          <p className="text-sm text-gray-400 mb-4">
            Track daily meal service count
          </p>
          <div className="text-3xl font-bold text-white mb-2">{todayServed}</div>
          <p className="text-sm text-gray-400">meals served today</p>
        </Card>
        
        <Card className="flex flex-col items-center text-center p-6">
          <div className="p-4 rounded-full bg-warning-500/20 mb-4">
            <ClipboardList className="h-8 w-8 text-warning-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Weekly Summary</h3>
          <p className="text-sm text-gray-400 mb-4">
            View weekly meal service stats
          </p>
          <div className="text-3xl font-bold text-white mb-2">{weeklyServed}</div>
          <p className="text-sm text-gray-400">meals this week</p>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card 
        title="Recent Activity" 
        subtitle="Today's meal service records"
      >
        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {recentActivity.map((activity, index) => (
              <div key={index} className="py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-success-500/20 p-2 rounded mr-3">
                    <Utensils size={16} className="text-success-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{activity.student}</p>
                    <p className="text-sm text-gray-400">{activity.meal}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      
      {/* Meal Schedule */}
      <Card title="Today's Menu">
        <div className="divide-y divide-gray-700">
          <div className="py-3">
            <h3 className="text-white font-medium mb-2">Breakfast (7:00 AM - 8:30 AM)</h3>
            <p className="text-gray-400">Eggs, Toast, Fruit, Cereal</p>
          </div>
          <div className="py-3">
            <h3 className="text-white font-medium mb-2">Lunch (11:30 AM - 1:30 PM)</h3>
            <p className="text-gray-400">Chicken, Rice, Vegetables, Dessert</p>
          </div>
          <div className="py-3">
            <h3 className="text-white font-medium mb-2">Snack (3:30 PM - 4:00 PM)</h3>
            <p className="text-gray-400">Fruits, Yogurt, Granola</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CookDashboard;