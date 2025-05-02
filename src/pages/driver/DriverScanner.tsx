import { useState } from 'react';
import { ArrowLeft, QrCode, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { Student } from '../../types/User';
import { getStudentById } from '../../services/studentService';

enum ScanStatus {
  READY = 'ready',
  SCANNING = 'scanning',
  SUCCESS = 'success',
  ERROR = 'error',
}

const DriverScanner = () => {
  const [scanStatus, setScanStatus] = useState<ScanStatus>(ScanStatus.READY);
  const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [activityType, setActivityType] = useState('pickup');
  
  const activityOptions = [
    { value: 'pickup', label: 'Student Pickup' },
    { value: 'dropoff', label: 'Student Dropoff' },
  ];

  const handleScan = async () => {
    setScanStatus(ScanStatus.SCANNING);
    setScanError(null);
    
    try {
      // Simulate camera scanning a QR code
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, let's assume we scanned a valid QR code for student-1
      const studentId = 'student-1';
      const student = await getStudentById(studentId);
      
      if (student) {
        setScannedStudent(student);
        setScanStatus(ScanStatus.SUCCESS);
        toast.success(`Successfully scanned ${student.name}'s badge`);
      } else {
        throw new Error('Invalid badge');
      }
    } catch (error) {
      setScanStatus(ScanStatus.ERROR);
      setScanError('Invalid or unrecognized badge. Please try again.');
      toast.error('Scan failed. Invalid badge.');
    }
  };

  const handleConfirm = async () => {
    try {
      // Simulate confirming the activity
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`${scannedStudent?.name} marked for ${
        activityOptions.find(opt => opt.value === activityType)?.label || activityType
      }`);
      
      // Reset scan state
      setScanStatus(ScanStatus.READY);
      setScannedStudent(null);
    } catch (error) {
      toast.error('Failed to record activity');
    }
  };

  const handleCancel = () => {
    setScanStatus(ScanStatus.READY);
    setScannedStudent(null);
    setScanError(null);
  };

  return (
    <div className="max-w-xl mx-auto animate-fadeIn">
      <div className="flex items-center mb-6">
        <Link to="/dashboard" className="mr-4">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={16} />}>
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-white">QR Scanner</h1>
      </div>
      
      <Card>
        <div className="space-y-6">
          {/* Activity Selection */}
          <div className="mb-6">
            <Select
              label="Activity Type"
              options={activityOptions}
              value={activityType}
              onChange={setActivityType}
              disabled={scanStatus === ScanStatus.SCANNING || scanStatus === ScanStatus.SUCCESS}
            />
          </div>
          
          {/* Scanner Area */}
          <div className={`
            border-2 rounded-lg p-8 flex flex-col items-center justify-center transition-all
            ${scanStatus === ScanStatus.SCANNING ? 'border-primary-500 bg-primary-500/10 animate-pulse' : 
              scanStatus === ScanStatus.SUCCESS ? 'border-success-500 bg-success-500/10' :
              scanStatus === ScanStatus.ERROR ? 'border-error-500 bg-error-500/10' :
              'border-gray-700 bg-background-400'}
          `}>
            {scanStatus === ScanStatus.READY && (
              <div className="text-center py-8">
                <QrCode size={80} className="mx-auto mb-4 text-gray-400" />
                <p className="text-white font-medium mb-2">Ready to Scan</p>
                <p className="text-sm text-gray-400 mb-6">
                  Point the camera at a student's QR code badge
                </p>
                <Button 
                  onClick={handleScan}
                  leftIcon={<QrCode size={16} />}
                >
                  Start Scanning
                </Button>
              </div>
            )}
            
            {scanStatus === ScanStatus.SCANNING && (
              <div className="text-center py-8">
                <div className="relative mx-auto mb-4">
                  <div className="w-16 h-16 border-4 border-primary-500 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 border-t-4 border-primary-500 rounded-full animate-spin"></div>
                  </div>
                </div>
                <p className="text-white font-medium">Scanning...</p>
                <p className="text-sm text-gray-400 mt-1">
                  Hold steady while we process the QR code
                </p>
              </div>
            )}
            
            {scanStatus === ScanStatus.SUCCESS && scannedStudent && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-success-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">{scannedStudent.name}</h3>
                <p className="text-gray-400 mb-2">{scannedStudent.class}</p>
                <div className="flex justify-center mb-4">
                  <div className="bg-background-300 px-3 py-1 rounded-full text-xs font-medium">
                    ID: {scannedStudent.id}
                  </div>
                </div>
                <div className="flex space-x-3 mt-4">
                  <Button 
                    onClick={handleCancel}
                    variant="outline"
                    leftIcon={<X size={16} />}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleConfirm}
                    leftIcon={<Check size={16} />}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            )}
            
            {scanStatus === ScanStatus.ERROR && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-error-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-white" />
                </div>
                <p className="text-error-400 font-medium mb-2">Scan Error</p>
                <p className="text-sm text-gray-400 mb-6">
                  {scanError || 'Failed to scan QR code. Please try again.'}
                </p>
                <Button 
                  onClick={handleScan}
                  variant="secondary"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
          
          {/* Instructions */}
          <div className="border border-gray-700 rounded-lg p-4 bg-background-600 mt-6">
            <h3 className="font-medium text-white mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside text-sm text-gray-400 space-y-1">
              <li>Select pickup or dropoff from the dropdown</li>
              <li>Click "Start Scanning" and point camera at student's badge</li>
              <li>Verify student details and confirm</li>
              <li>The system will automatically record the activity</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DriverScanner;