import { useEffect, useState } from 'react';
import { BarChart2, DollarSign, User, ClipboardCheck } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Card from '../../components/ui/Card';
import { getStudents, getTransactions } from '../../services/studentService';
import { Student, Transaction } from '../../types/User';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, transactionsData] = await Promise.all([
          getStudents(),
          getTransactions(),
        ]);
        
        setStudents(studentsData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calculate stats
  const totalStudents = students.length;
  const totalBalance = students.reduce((sum, student) => sum + student.balance, 0);
  const totalTransactions = transactions.length;
  const averageAttendance = students.reduce((sum, student) => sum + student.attendanceRate, 0) / (totalStudents || 1);

  // Prepare chart data for transactions by type
  const transactionsByType = {
    CANTINE: 0,
    SORTIE: 0,
    SCOLARITE: 0,
    RECHARGE: 0,
  };
  
  transactions.forEach(transaction => {
    transactionsByType[transaction.type] += transaction.amount;
  });

  const revenueData = {
    labels: ['CANTINE', 'SORTIE', 'SCOLARITE', 'RECHARGE'],
    datasets: [
      {
        label: 'Amount (USD)',
        data: [
          transactionsByType.CANTINE,
          transactionsByType.SORTIE,
          transactionsByType.SCOLARITE,
          transactionsByType.RECHARGE,
        ],
        backgroundColor: [
          'rgba(37, 211, 102, 0.7)',
          'rgba(37, 211, 102, 0.5)',
          'rgba(37, 211, 102, 0.3)',
          'rgba(37, 211, 102, 0.9)',
        ],
        borderColor: [
          'rgba(37, 211, 102, 1)',
          'rgba(37, 211, 102, 1)',
          'rgba(37, 211, 102, 1)',
          'rgba(37, 211, 102, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Mock data for monthly transactions
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Transactions',
        data: [650, 590, 800, 810, 960, 1100],
        borderColor: 'rgba(37, 211, 102, 1)',
        backgroundColor: 'rgba(37, 211, 102, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#FFFFFF',
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#FFFFFF',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#FFFFFF',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-primary-500/20">
            <User className="h-6 w-6 text-primary-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400">Total Students</h3>
            <p className="text-2xl font-semibold text-white">{totalStudents}</p>
          </div>
        </Card>
        
        <Card className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-success-500/20">
            <DollarSign className="h-6 w-6 text-success-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400">Total Balance</h3>
            <p className="text-2xl font-semibold text-white">${totalBalance.toFixed(2)}</p>
          </div>
        </Card>
        
        <Card className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-warning-500/20">
            <BarChart2 className="h-6 w-6 text-warning-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400">Transactions</h3>
            <p className="text-2xl font-semibold text-white">{totalTransactions}</p>
          </div>
        </Card>
        
        <Card className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-primary-500/20">
            <ClipboardCheck className="h-6 w-6 text-primary-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400">Avg. Attendance</h3>
            <p className="text-2xl font-semibold text-white">{averageAttendance.toFixed(1)}%</p>
          </div>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Monthly Transactions">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="h-64">
              <Line data={monthlyData} options={chartOptions} />
            </div>
          )}
        </Card>
        
        <Card title="Revenue by Type">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="h-64">
              <Bar data={revenueData} options={chartOptions} />
            </div>
          )}
        </Card>
      </div>
      
      {/* Recent Transactions */}
      <Card title="Recent Transactions">
        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
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
                      {new Date(transaction.date).toLocaleDateString()}
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

export default AdminDashboard;