import { useState, useEffect } from 'react';
import { Download, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { getTransactions } from '../../services/studentService';
import { Transaction } from '../../types/User';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  
  const transactionTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'CANTINE', label: 'Cantine' },
    { value: 'SORTIE', label: 'Field Trip' },
    { value: 'SCOLARITE', label: 'Tuition' },
    { value: 'RECHARGE', label: 'Recharge' },
  ];

  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.details?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    
    const transactionDate = new Date(transaction.date);
    const now = new Date();
    let matchesDate = true;
    
    switch (dateRange) {
      case 'today':
        matchesDate = transactionDate.toDateString() === now.toDateString();
        break;
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        matchesDate = transactionDate >= weekAgo;
        break;
      case 'month':
        matchesDate = 
          transactionDate.getMonth() === now.getMonth() &&
          transactionDate.getFullYear() === now.getFullYear();
        break;
      case 'year':
        matchesDate = transactionDate.getFullYear() === now.getFullYear();
        break;
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  const totalAmount = filteredTransactions.reduce((sum, transaction) => {
    if (transaction.type === 'RECHARGE') {
      return sum + transaction.amount;
    } else {
      return sum - transaction.amount;
    }
  }, 0);

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Transaction Report', 20, 20);
    
    // Add filters info
    doc.setFontSize(12);
    doc.text(`Type: ${selectedType}`, 20, 30);
    doc.text(`Date Range: ${dateRange}`, 20, 40);
    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 20, 50);
    
    // Add table headers
    const headers = ['Date', 'Student', 'Type', 'Amount'];
    let y = 70;
    
    doc.setFontSize(10);
    headers.forEach((header, i) => {
      doc.text(header, 20 + (i * 45), y);
    });
    
    // Add table content
    y += 10;
    filteredTransactions.forEach((transaction) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      doc.text(format(new Date(transaction.date), 'MM/dd/yyyy'), 20, y);
      doc.text(transaction.studentName.substring(0, 20), 65, y);
      doc.text(transaction.type, 110, y);
      doc.text(
        `${transaction.type === 'RECHARGE' ? '+' : '-'}$${transaction.amount.toFixed(2)}`,
        155,
        y
      );
      
      y += 10;
    });
    
    doc.save('transactions.pdf');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Transactions</h1>
        <Button 
          onClick={exportToPDF}
          leftIcon={<Download size={16} />}
        >
          Export Report
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Search transactions..."
            leftIcon={<Search size={18} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-64"
          />
          <Select
            options={transactionTypes}
            value={selectedType}
            onChange={setSelectedType}
            className="md:w-48"
          />
          <Select
            options={dateRanges}
            value={dateRange}
            onChange={setDateRange}
            className="md:w-48"
          />
        </div>

        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No transactions found</p>
          </div>
        ) : (
          <>
            <div className="mb-4 p-4 bg-background-400 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">Total Amount</p>
                  <p className={`text-2xl font-semibold ${
                    totalAmount >= 0 ? 'text-success-400' : 'text-error-400'
                  }`}>
                    ${totalAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Transactions</p>
                  <p className="text-2xl font-semibold text-white">
                    {filteredTransactions.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {transaction.studentName}
                      </td>
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
                        {transaction.details || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default AdminTransactions;