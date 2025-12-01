import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PublicHeader } from '../shared/PublicHeader';
import { apiCall } from '../../utils/api';
import { useNotification } from '../../contexts/NotificationContext';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Mail, ArrowLeft, CheckCircle, AlertCircle, 
  Lock, Loader2, Send 
} from 'lucide-react';

type ResetStep = 'email' | 'otp' | 'password' | 'complete';

export const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtpOnScreen, setShowOtpOnScreen] = useState(false);
  const { showSuccess, showError } = useNotification();

  const otpInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    const response = await apiCall<{ otp: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }, false);

    setLoading(false);

    if (response.success && response.data) {
      setGeneratedOtp(response.data.otp);
      setShowOtpOnScreen(true);
      setStep('otp');
      showSuccess('OTP sent to your email');
    } else {
      setError(response.error || 'Failed to send OTP');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = () => {
    const enteredOtp = otp.join('');
    
    if (enteredOtp !== generatedOtp) {
      setError('Invalid OTP. Please try again.');
      return;
    }

    setError('');
    setStep('password');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const response = await apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword }),
    }, false);

    setLoading(false);

    if (response.success) {
      setStep('complete');
    } else {
      setError(response.error || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <PublicHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {step === 'email' && 'Reset Your Password'}
                {step === 'otp' && 'Verify OTP'}
                {step === 'password' && 'Set New Password'}
                {step === 'complete' && 'Password Reset Successful'}
              </CardTitle>
              <CardDescription className="text-center">
                {step === 'email' && 'Enter your email to receive a reset code'}
                {step === 'otp' && 'Enter the 6-digit code sent to your email'}
                {step === 'password' && 'Create a new strong password'}
                {step === 'complete' && 'You can now login with your new password'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step implementations would continue here */}
              
              <div className="mt-6 text-center text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
