import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, DollarSign, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { Student } from '../../types/User';
import { getStudentsByParentId, addTransaction } from '../../services/studentService';

const paymentMethods = [
  { value: 'mtn', label: 'MTN Mobile Money' },
  { value: 'orange', label: 'Orange Money' },
  { value: 'card', label: 'Credit/Debit Card' },
];

const PaymentPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Form state
  const [selectedStudent, setSelectedStudent] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user) return;
      
      try {
        const studentsData = await getStudentsByParentId(user.id);
        setStudents(studentsData);
        
        if (studentsData.length > 0) {
          setSelectedStudent(studentsData[0].id);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to load students data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudents();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !amount || !paymentMethod || !phoneNumber) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setIsPaying(true);
    
    try {
      // Get student info for the transaction
      const student = students.find(s => s.id === selectedStudent);
      
      if (!student) {
        throw new Error('Student not found');
      }
      
      // Create recharge transaction
      await addTransaction({
        studentId: student.id,
        studentName: student.name,
        amount: Number(amount),
        type: 'RECHARGE',
        details: `Recharged via ${paymentMethod}`,
      });
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentSuccess(true);
      toast.success('Payment successful!');
      
      // Reset form after success
      setTimeout(() => {
        setPaymentSuccess(false);
        setAmount('');
        setPhoneNumber('');
      }, 3000);
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <h1 className="text-2xl font-bold text-white mb-6">Add Funds</h1>
      
      <Card>
        {paymentSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-success-500 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Payment Successful!</h2>
            <p className="text-gray-400 mb-6">Funds have been added to the student's account</p>
            <div className="flex space-x-4">
              <Button 
                variant="outline"
                onClick={() => {
                  setPaymentSuccess(false);
                  setAmount('');
                  setPhoneNumber('');
                }}
              >
                Make Another Payment
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Select
                label="Select Student"
                options={students.map(student => ({
                  value: student.id,
                  label: `${student.name} (${student.class})`,
                }))}
                value={selectedStudent}
                onChange={setSelectedStudent}
                disabled={students.length === 0}
              />
              
              <Input
                type="number"
                label="Amount ($)"
                placeholder="Enter amount"
                leftIcon={<DollarSign size={18} />}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
                required
              />
              
              <Select
                label="Payment Method"
                options={paymentMethods}
                value={paymentMethod}
                onChange={setPaymentMethod}
              />
              
              <Input
                type="tel"
                label="Mobile Number"
                placeholder="Enter your mobile number"
                leftIcon={<CreditCard size={18} />}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            
            <div className="pt-4">
              <Button
                type="submit"
                fullWidth
                isLoading={isPaying}
                disabled={isPaying || students.length === 0}
              >
                {isPaying ? 'Processing...' : 'Pay Now'}
              </Button>
              
              {students.length === 0 && (
                <p className="mt-4 text-center text-error-400">
                  No students available. Please contact the school administrator.
                </p>
              )}
            </div>
          </form>
        )}
      </Card>
      
      {/* Payment Methods Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center p-4">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
              <span className="text-primary-500 font-bold text-xl">MTN</span>
            </div>
          </div>
          <h3 className="font-medium text-white">MTN Mobile Money</h3>
          <p className="text-sm text-gray-400 mt-2">Instant transfers using your MTN account</p>
        </Card>
        
        <Card className="text-center p-4">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-warning-500/20 rounded-full flex items-center justify-center">
              <span className="text-warning-500 font-bold text-xl">OM</span>
            </div>
          </div>
          <h3 className="font-medium text-white">Orange Money</h3>
          <p className="text-sm text-gray-400 mt-2">Secure payments with your Orange Money account</p>
        </Card>
        
        <Card className="text-center p-4">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-gray-500/20 rounded-full flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-gray-400" />
            </div>
          </div>
          <h3 className="font-medium text-white">Card Payment</h3>
          <p className="text-sm text-gray-400 mt-2">Pay securely with credit or debit card</p>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;