import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Users, ClipboardList, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { getStudents } from '../../services/studentService';
import { Student } from '../../types/User';

const EducatorDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const studentsData = await getStudents();
        // Filter only students in specific classes (for demo purposes)
        const filteredStudents = studentsData.filter(
          student => student.class === 'Class 10A' || student.class === 'Class 8B'
        );
        setStudents(filteredStudents);
      } catch (error) {
        console.error('Error fetching Educateur Dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Group students by class
  const studentsByClass: Record<string, Student[]> = {};

  students.forEach(student => {
    if (!studentsByClass[student.class]) {
      studentsByClass[student.class] = [];
    }
    studentsByClass[student.class].push(student);
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-white">Educateur Dashboard</h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex flex-col items-center text-center p-6">
          <div className="p-4 rounded-full bg-primary-500/20 mb-4">
            <QrCode className="h-8 w-8 text-primary-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Scan QR Code</h3>
          <p className="text-sm text-gray-400 mb-4">
            Scan student badges for attendance or activity
          </p>
          <Link to="/dashboard/scanner" className="mt-auto w-full">
            <Button fullWidth>
              Go to Scanner
            </Button>
          </Link>
        </Card>

        <Card className="flex flex-col items-center text-center p-6">
          <div className="p-4 rounded-full bg-success-500/20 mb-4">
            <Users className="h-8 w-8 text-success-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">My Classes</h3>
          <p className="text-sm text-gray-400 mb-4">
            View and manage your assigned classes
          </p>
          <Button fullWidth variant="secondary" className="mt-auto">
            View Classes
          </Button>
        </Card>

        <Card className="flex flex-col items-center text-center p-6">
          <div className="p-4 rounded-full bg-warning-500/20 mb-4">
            <ClipboardList className="h-8 w-8 text-warning-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Reports</h3>
          <p className="text-sm text-gray-400 mb-4">
            Generate attendance and activity reports
          </p>
          <Button fullWidth variant="secondary" className="mt-auto">
            View Reports
          </Button>
        </Card>
      </div>

      {/* Classes and Students */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">Your Classes</h2>

        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : Object.keys(studentsByClass).length === 0 ? (
          <Card>
            <div className="text-center py-6">
              <p className="text-gray-400">No classes assigned yet</p>
            </div>
          </Card>
        ) : (
          Object.entries(studentsByClass).map(([className, classStudents]) => (
            <Card
              key={className}
              title={className}
              subtitle={`${classStudents.length} students`}
              headerAction={
                <Button variant="outline" size="sm">
                  Manage Class
                </Button>
              }
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Attendance</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Balance</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {classStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-background-300 flex items-center justify-center mr-3">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-white">{student.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-24 bg-background-400 rounded-full h-2 mr-2">
                              <div
                                className={`h-2 rounded-full ${
                                  student.attendanceRate >= 90 ? 'bg-success-500' :
                                  student.attendanceRate >= 80 ? 'bg-warning-500' :
                                  'bg-error-500'
                                }`}
                                style={{ width: `${student.attendanceRate}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-400 text-sm">{student.attendanceRate}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className={`${
                            student.balance > 200 ? 'text-success-400' :
                            student.balance > 100 ? 'text-warning-400' :
                            'text-error-400'
                          }`}>
                            ${student.balance.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <button className="text-primary-500 hover:text-primary-400 flex items-center">
                            Details <ArrowRight size={16} className="ml-1" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity">
        <div className="divide-y divide-gray-700">
          <div className="py-3 flex items-start">
            <div className="bg-primary-500/20 p-2 rounded mr-3">
              <QrCode size={16} className="text-primary-500" />
            </div>
            <div>
              <p className="text-white">Marked attendance for Class 10A</p>
              <p className="text-xs text-gray-400">Today, 8:30 AM</p>
            </div>
          </div>
          <div className="py-3 flex items-start">
            <div className="bg-success-500/20 p-2 rounded mr-3">
              <ClipboardList size={16} className="text-success-500" />
            </div>
            <div>
              <p className="text-white">Created report for Science Field Trip</p>
              <p className="text-xs text-gray-400">Yesterday, 4:15 PM</p>
            </div>
          </div>
          <div className="py-3 flex items-start">
            <div className="bg-warning-500/20 p-2 rounded mr-3">
              <Users size={16} className="text-warning-500" />
            </div>
            <div>
              <p className="text-white">Updated Class 8B roster</p>
              <p className="text-xs text-gray-400">Apr 12, 2023</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EducatorDashboard;
