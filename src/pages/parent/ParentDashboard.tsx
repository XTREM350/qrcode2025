import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, DollarSign, ClipboardList, ArrowUpRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentsByParentId, getTransactions } from '../../services/studentService';
import { Student, Transaction } from '../../types/User';

const ParentDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // Assume parentId is the same as userId for demo
        const [studentsData, transactionsData] = await Promise.all([
          getStudentsByParentId(user.id),
          getTransactions(),
        ]);
        
        setStudents(studentsData);
        setSelectedStudent(studentsData[0] || null);
        
        // Filter transactions for parent's students
        const studentIds = studentsData.map(student => student.id);
        const filteredTransactions = transactionsData.filter(
          transaction => studentIds.includes(transaction.studentId)
        );
        
        setTransactions(filteredTransactions);
      } catch (error) {
        console.error('Error fetching parent dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Calculate total balance of all children
  const totalBalance = students.reduce((sum, student) => sum + student.balance, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-white">Parent Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-primary-500/20">
            <CreditCard className="h-6 w-6 text-primary-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400">Total Balance</h3>
            <p className="text-2xl font-semibold text-white">${totalBalance.toFixed(2)}</p>
          </div>
        </Card>
        
        <Card className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-success-500/20">
            <DollarSign className="h-6 w-6 text-success-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400">Children</h3>
            <p className="text-2xl font-semibold text-white">{students.length}</p>
          </div>
        </Card>
        
        <Card className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-warning-500/20">
            <ClipboardList className="h-6 w-6 text-warning-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400">Transactions</h3>
            <p className="text-2xl font-semibold text-white">{transactions.length}</p>
          </div>
        </Card>
      </div>
      
      {/* Student Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Child Selector */}
        <div className="lg:col-span-1">
          <Card title="Your Children">
            {isLoading ? (
              <div className="h-40 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400">No children registered</p>
              </div>
            ) : (
              <div className="space-y-2">
                {students.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`w-full px-4 py-3 flex justify-between items-center rounded-lg transition-colors duration-200 ${
                      selectedStudent?.id === student.id 
                        ? 'bg-primary-500 text-white'
                        : 'bg-background-400 text-white hover:bg-background-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-background-300 flex items-center justify-center mr-3">
                        {student.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs opacity-80">{student.class}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${student.balance.toFixed(2)}</p>
                      <p className="text-xs opacity-80">Balance</p>
                    </div>
                  </button>
                ))}
                <div className="pt-3">
                  <Link to="/dashboard/payment">
                    <Button variant="primary" fullWidth>
                      Top Up Balance
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </div>
        
        {/* Selected Student Details & QR Code */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <Card title={`${selectedStudent.name}'s Details`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Class</p>
                      <p className="text-lg font-medium text-white">{selectedStudent.class}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Balance</p>
                      <p className="text-lg font-medium text-white">${selectedStudent.balance.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Attendance Rate</p>
                      <div className="flex items-center">
                        <div className="w-full bg-background-400 rounded-full h-2.5 mr-2">
                          <div 
                            className="bg-primary-500 h-2.5 rounded-full"
                            style={{ width: `${selectedStudent.attendanceRate}%` }}
                          ></div>
                        </div>
                        <span className="text-white">{selectedStudent.attendanceRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-white p-3 rounded-lg">
                    <QRCodeSVG 
                      value={selectedStudent.qrCode}
                      size={150}
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-400">Student's QR Code Badge</p>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="h-40 flex items-center justify-center">
                <p className="text-gray-400">No student selected</p>
              </div>
            </Card>
          )}
        </div>
      </div>
      
      {/* Recent Transactions */}
      <Card 
        title="Recent Transactions" 
        headerAction={
          <Link to="/dashboard/transactions" className="text-primary-500 text-sm flex items-center">
            View all <ArrowUpRight size={16} className="ml-1" />
          </Link>
        }
      >
        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-400">No transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {transactions.slice(0, 5).map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{transaction.studentName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${transaction.type === 'RECHARGE' ? 'bg-success-500/20 text-success-400' : 
                          transaction.type === 'CANTINE' ? 'bg-warning-500/20 text-warning-400' :
                          transaction.type === 'SORTIE' ? 'bg-primary-500/20 text-primary-400' :
                          'bg-gray-500/20 text-gray-400'}
                      `}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm ${
                      transaction.type === 'RECHARGE' ? 'text-success-400' : 'text-error-400'
                    }`}>
                      {transaction.type === 'RECHARGE' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ParentDashboard;