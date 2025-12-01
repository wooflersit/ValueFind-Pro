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
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Lock, Loader2, Send } from 'lucide-react';

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
    const response = await apiCall<{ otp: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }, false);
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
    if (value && index < 5) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpInputRefs.current[index - 1]?.focus();
  };

  const handleVerifyOTP = () => {
    if (otp.join('') !== generatedOtp) {
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
    const response = await apiCall('/auth/reset-password', { method: 'POST', body: JSON.stringify({ email, newPassword }) }, false);
    setLoading(false);
    if (response.success) {
      setStep('complete');
      showSuccess('Password reset successful!');
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
            <CardContent className="space-y-6">
              {step === 'email' && (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="email" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                    </div>
                  </div>
                  {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600" disabled={loading}>
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : <><Send className="mr-2 h-4 w-4" /> Send Reset Code</>}
                  </Button>
                </form>
              )}
              {step === 'otp' && (
                <div className="space-y-4">
                  <p className="text-center text-gray-600">We've sent a 6-digit code to {email}</p>
                  {showOtpOnScreen && (
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        <strong>Demo Mode:</strong> Your OTP is <span className="font-mono font-bold text-lg">{generatedOtp}</span>
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <Input key={index} ref={(el) => (otpInputRefs.current[index] = el)} type="text" maxLength={1} value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(index, e)} className="w-12 h-12 text-center text-xl" />
                    ))}
                  </div>
                  {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
                  <div className="flex gap-3">
                    <Button onClick={() => setStep('email')} variant="outline" className="flex-1"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                    <Button onClick={handleVerifyOTP} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600" disabled={otp.join('').length !== 6}>Verify OTP</Button>
                  </div>
                </div>
              )}
              {step === 'password' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="newPassword" type="password" placeholder="Minimum 8 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="confirmPassword" type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10" required />
                    </div>
                  </div>
                  {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
                  <div className="flex gap-3">
                    <Button type="button" onClick={() => setStep('otp')} variant="outline" className="flex-1"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                    <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</Button>
                  </div>
                </form>
              )}
              {step === 'complete' && (
                <div className="text-center space-y-4 py-8">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl">Password Reset Complete!</h3>
                  <p className="text-gray-600">Your password has been successfully reset.</p>
                  <Link to="/login">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Go to Login</Button>
                  </Link>
                </div>
              )}
              <div className="mt-6 text-center text-sm text-gray-600">
                Remember your password? <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign In</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
