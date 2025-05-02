import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, QrCode } from 'lucide-react';
import { toast } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Student } from '../../types/User';
import { getStudents, addStudent, deleteStudent } from '../../services/studentService';

const AdminStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [showQRCode, setShowQRCode] = useState<string | null>(null);
  
  const classes = [
    { value: 'all', label: 'All Classes' },
    { value: 'Class 10A', label: 'Class 10A' },
    { value: 'Class 8B', label: 'Class 8B' },
    { value: 'Class 9C', label: 'Class 9C' },
    { value: 'Class 11A', label: 'Class 11A' },
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(studentId);
        setStudents(students.filter(student => student.id !== studentId));
        toast.success('Student deleted successfully');
      } catch (error) {
        console.error('Error deleting student:', error);
        toast.error('Failed to delete student');
      }
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Students Management</h1>
        <Button leftIcon={<Plus size={16} />}>
          Add New Student
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Search students..."
            leftIcon={<Search size={18} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-64"
          />
          <Select
            options={classes}
            value={selectedClass}
            onChange={setSelectedClass}
            className="md:w-48"
          />
        </div>

        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No students found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Class</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Balance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Attendance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-background-300 flex items-center justify-center mr-3">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{student.name}</p>
                          <p className="text-sm text-gray-400">ID: {student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-white">
                      {student.class}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`${
                        student.balance > 200 ? 'text-success-400' :
                        student.balance > 100 ? 'text-warning-400' :
                        'text-error-400'
                      }`}>
                        ${student.balance.toFixed(2)}
                      </span>
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
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setShowQRCode(student.qrCode)}
                          className="p-1 hover:bg-background-400 rounded"
                          title="View QR Code"
                        >
                          <QrCode size={16} className="text-primary-500" />
                        </button>
                        <button 
                          className="p-1 hover:bg-background-400 rounded"
                          title="Edit Student"
                        >
                          <Edit2 size={16} className="text-warning-500" />
                        </button>
                        <button 
                          onClick={() => handleDelete(student.id)}
                          className="p-1 hover:bg-background-400 rounded"
                          title="Delete Student"
                        >
                          <Trash2 size={16} className="text-error-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background-600 p-6 rounded-lg">
            <div className="bg-white p-4 rounded-lg mb-4">
              <QRCodeSVG 
                value={showQRCode}
                size={200}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="H"
                includeMargin={false}
              />
            </div>
            <Button 
              fullWidth
              onClick={() => setShowQRCode(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;