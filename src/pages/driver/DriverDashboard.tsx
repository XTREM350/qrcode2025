import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Bus, MapPin, ClipboardList } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface BusRoute {
  id: string;
  name: string;
  stops: number;
  students: number;
  nextStop: string;
  nextTime: string;
}

interface RouteActivity {
  time: string;
  student: string;
  action: 'pickup' | 'dropoff';
  location: string;
}

const DriverDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [currentRoute, setCurrentRoute] = useState<BusRoute | null>(null);
  const [recentActivity, setRecentActivity] = useState<RouteActivity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setCurrentRoute({
          id: 'route-1',
          name: 'Route A - Morning',
          stops: 12,
          students: 28,
          nextStop: 'Oak Street Station',
          nextTime: '8:15 AM',
        });
        
        setRecentActivity([
          {
            time: '7:55 AM',
            student: 'John Doe',
            action: 'pickup',
            location: 'Maple Avenue'
          },
          {
            time: '7:50 AM',
            student: 'Jane Smith',
            action: 'pickup',
            location: 'Pine Street'
          },
          {
            time: '7:45 AM',
            student: 'Alex Johnson',
            action: 'pickup',
            location: 'Cedar Road'
          },
        ]);
      } catch (error) {
        console.error('Error fetching driver dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-white">Driver Dashboard</h1>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex flex-col items-center text-center p-6">
          <div className="p-4 rounded-full bg-primary-500/20 mb-4">
            <QrCode className="h-8 w-8 text-primary-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Scan Student Badge</h3>
          <p className="text-sm text-gray-400 mb-4">
            Record student pickup/dropoff
          </p>
          <Link to="/dashboard/scanner" className="mt-auto w-full">
            <Button fullWidth>
              Open Scanner
            </Button>
          </Link>
        </Card>
        
        <Card className="flex flex-col items-center text-center p-6">
          <div className="p-4 rounded-full bg-success-500/20 mb-4">
            <Bus className="h-8 w-8 text-success-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Current Route</h3>
          <p className="text-sm text-gray-400 mb-4">
            View route details and stops
          </p>
          {currentRoute && (
            <>
              <div className="text-xl font-bold text-white mb-2">{currentRoute.name}</div>
              <p className="text-sm text-gray-400">{currentRoute.stops} stops • {currentRoute.students} students</p>
            </>
          )}
        </Card>
        
        <Card className="flex flex-col items-center text-center p-6">
          <div className="p-4 rounded-full bg-warning-500/20 mb-4">
            <MapPin className="h-8 w-8 text-warning-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Next Stop</h3>
          <p className="text-sm text-gray-400 mb-4">
            Upcoming bus stop information
          </p>
          {currentRoute && (
            <>
              <div className="text-xl font-bold text-white mb-2">{currentRoute.nextStop}</div>
              <p className="text-sm text-gray-400">Expected at {currentRoute.nextTime}</p>
            </>
          )}
        </Card>
      </div>
      
      {/* Route Map */}
      <Card title="Route Map">
        <div className="bg-background-400 rounded-lg p-4 text-center">
          <p className="text-gray-400">Interactive map will be implemented here</p>
        </div>
      </Card>
      
      {/* Recent Activity */}
      <Card 
        title="Recent Activity" 
        subtitle="Today's pickup/dropoff records"
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
                  <div className={`p-2 rounded mr-3 ${
                    activity.action === 'pickup' 
                      ? 'bg-success-500/20' 
                      : 'bg-warning-500/20'
                  }`}>
                    <Bus size={16} className={
                      activity.action === 'pickup'
                        ? 'text-success-500'
                        : 'text-warning-500'
                    } />
                  </div>
                  <div>
                    <p className="text-white font-medium">{activity.student}</p>
                    <p className="text-sm text-gray-400">
                      {activity.action === 'pickup' ? 'Picked up at' : 'Dropped off at'} {activity.location}
                    </p>
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
      
      {/* Safety Checklist */}
      <Card title="Daily Safety Checklist">
        <div className="space-y-3">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="check1"
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-700 rounded bg-background-400"
            />
            <label htmlFor="check1" className="ml-2 text-white">
              Vehicle inspection completed
            </label>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="check2"
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-700 rounded bg-background-400"
            />
            <label htmlFor="check2" className="ml-2 text-white">
              First aid kit checked
            </label>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="check3"
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-700 rounded bg-background-400"
            />
            <label htmlFor="check3" className="ml-2 text-white">
              Emergency contact list updated
            </label>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="check4"
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-700 rounded bg-background-400"
            />
            <label htmlFor="check4" className="ml-2 text-white">
              Route map and schedule reviewed
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DriverDashboard;