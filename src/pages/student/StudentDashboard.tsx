import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';
import { CreditCard, Calendar, ClipboardList } from 'lucide-react';
import Card from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { getTransactionsByStudentId, getBadgeByStudentId } from '../../services/studentService';
import { Transaction, Badge } from '../../types/User';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [badge, setBadge] = useState<Badge | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // For demo, assume student's ID matches their user ID
        const studentId = 'student-1';
        
        const [transactionsData, badgeData] = await Promise.all([
          getTransactionsByStudentId(studentId),
          getBadgeByStudentId(studentId),
        ]);
        
        setTransactions(transactionsData);
        setBadge(badgeData);
      } catch (error) {
        console.error('Error fetching student dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const calculateBalance = () => {
    return transactions.reduce((balance, transaction) => {
      if (transaction.type === 'RECHARGE') {
        return balance + transaction.amount;
      } else {
        return balance - transaction.amount;
      }
    }, 0);
  };

  // Get transactions for current month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const totalSpentThisMonth = currentMonthTransactions
    .filter(t => t.type !== 'RECHARGE')
    .reduce((sum, t) => sum + t.amount, 0);

  const cantineVisits = currentMonthTransactions
    .filter(t => t.type === 'CANTINE')
    .length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
      
      {isLoading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {/* Student Badge & QR Code */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card 
              title="Your Badge"
              subtitle="Use this QR code for all school transactions"
            >
              <div className="flex flex-col items-center py-4">
                {badge ? (
                  <>
                    <div className="bg-white p-5 rounded-lg">
                      <QRCodeSVG 
                        value={badge.qrCode}
                        size={200}
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    <p className="mt-3 text-sm text-gray-400">
                      Badge ID: {badge.id.substring(0, 8)}
                    </p>
                    <div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                      badge.isActive 
                      ? 'bg-success-500/20 text-success-400'
                      : 'bg-error-500/20 text-error-400'
                    }`}>
                      {badge.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400">No badge assigned</p>
                )}
              </div>
            </Card>
            
            {/* Stats Cards */}
            <div className="space-y-6">
              <Card className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-primary-500/20">
                  <CreditCard className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Current Balance</h3>
                  <p className="text-2xl font-semibold text-white">${calculateBalance().toFixed(2)}</p>
                </div>
              </Card>
              
              <Card className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-warning-500/20">
                  <Calendar className="h-6 w-6 text-warning-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Spent this Month</h3>
                  <p className="text-2xl font-semibold text-white">${totalSpentThisMonth.toFixed(2)}</p>
                </div>
              </Card>
              
              <Card className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-success-500/20">
                  <ClipboardList className="h-6 w-6 text-success-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Cantine Visits</h3>
                  <p className="text-2xl font-semibold text-white">{cantineVisits} this month</p>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Recent Transactions */}
          <Card title="Recent Transactions">
            {transactions.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400">No transactions yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {transactions.slice(0, 5).map((transaction) => (
                      <tr key={transaction.id}>
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
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                          {transaction.details || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
          
          {/* Activity Schedule (can be expanded) */}
          <Card title="Upcoming Activities">
            <div className="divide-y divide-gray-700">
              <div className="py-3 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-medium">Math Exam</h3>
                  <p className="text-sm text-gray-400">Room 104</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-primary-400">Tomorrow</p>
                  <p className="text-xs text-gray-400">9:00 AM</p>
                </div>
              </div>
              <div className="py-3 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-medium">Science Field Trip</h3>
                  <p className="text-sm text-gray-400">Museum of Natural History</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-primary-400">Next Week</p>
                  <p className="text-xs text-gray-400">Friday, 8:30 AM</p>
                </div>
              </div>
              <div className="py-3 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-medium">Parent-Teacher Meeting</h3>
                  <p className="text-sm text-gray-400">Main Hall</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-primary-400">In 2 Weeks</p>
                  <p className="text-xs text-gray-400">Tuesday, 4:00 PM</p>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;