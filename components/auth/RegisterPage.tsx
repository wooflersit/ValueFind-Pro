import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PublicHeader } from '../shared/PublicHeader';
import { apiCall } from '../../utils/api';
import { useNotification } from '../../contexts/NotificationContext';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, XCircle, AlertCircle, Loader2, Phone, Mail, User, Lock, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

type RegistrationStep = 'details' | 'address' | 'otp' | 'complete';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [step, setStep] = useState<RegistrationStep>('details');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  });

  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [phoneAvailable, setPhoneAvailable] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSentTo, setOtpSentTo] = useState<'email' | 'phone'>('phone');
  const [showOtpOnScreen, setShowOtpOnScreen] = useState(false);

  const otpInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const checkEmailAvailability = async (email: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailAvailable(null);
      return;
    }
    setCheckingEmail(true);
    const response = await apiCall<{ available: boolean }>('/auth/check-email', { method: 'POST', body: JSON.stringify({ email }) }, false);
    setCheckingEmail(false);
    if (response.success && response.data) setEmailAvailable(response.data.available);
  };

  const checkPhoneAvailability = async (phone: string) => {
    if (!phone || phone.length < 10) {
      setPhoneAvailable(null);
      return;
    }
    setCheckingPhone(true);
    const response = await apiCall<{ available: boolean }>('/auth/check-phone', { method: 'POST', body: JSON.stringify({ phone }) }, false);
    setCheckingPhone(false);
    if (response.success && response.data) setPhoneAvailable(response.data.available);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => { if (formData.email) checkEmailAvailability(formData.email); }, 500);
    return () => clearTimeout(timer);
  }, [formData.email]);

  React.useEffect(() => {
    const timer = setTimeout(() => { if (formData.phone) checkPhoneAvailability(formData.phone); }, 500);
    return () => clearTimeout(timer);
  }, [formData.phone]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (emailAvailable === false) newErrors.email = 'Email already registered';
    if (phoneAvailable === false) newErrors.phone = 'Phone number already registered';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.addressLine1) newErrors.addressLine1 = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    if (formData.pincode.length !== 6) newErrors.pincode = 'Pincode must be 6 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOTP = async () => {
    setLoading(true);
    const response = await apiCall<{ otp: string, sentTo: 'email' | 'phone' }>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email: formData.email, phone: formData.phone, preferredMethod: 'phone' }),
    }, false);
    setLoading(false);
    if (response.success && response.data) {
      setGeneratedOtp(response.data.otp);
      setOtpSentTo(response.data.sentTo);
      setShowOtpOnScreen(true);
      setStep('otp');
    }
  };

  const handleNextStep = async () => {
    if (step === 'details' && validateStep1()) setStep('address');
    else if (step === 'address' && validateStep2()) await sendOTP();
  };

  const handlePreviousStep = () => {
    if (step === 'address') setStep('details');
    if (step === 'otp') setStep('address');
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

  const handleVerifyOTP = async () => {
    if (otp.join('') !== generatedOtp) {
      setErrors({ otp: 'Invalid OTP. Please try again.' });
      return;
    }
    setLoading(true);
    const response = await apiCall<{ success: boolean }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'customer',
        address: { line1: formData.addressLine1, line2: formData.addressLine2, city: formData.city, state: formData.state, pincode: formData.pincode, landmark: formData.landmark },
      }),
    }, false);
    setLoading(false);
    if (response.success) {
      setStep('complete');
      showSuccess('Registration successful!');
    } else {
      setErrors({ otp: response.error || 'Registration failed. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <PublicHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Create Your Account</CardTitle>
              <CardDescription className="text-center">
                {step === 'details' && 'Enter your personal details'}
                {step === 'address' && 'Add your delivery address'}
                {step === 'otp' && 'Verify your phone number'}
                {step === 'complete' && 'Registration successful!'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 'details' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="name" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="pl-10" />
                    </div>
                    {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="email" type="email" placeholder="email@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="pl-10 pr-10" />
                      <div className="absolute right-3 top-3">
                        {checkingEmail && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                        {!checkingEmail && emailAvailable === true && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {!checkingEmail && emailAvailable === false && <XCircle className="h-4 w-4 text-red-500" />}
                      </div>
                    </div>
                    {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="phone" placeholder="+91 9876543210" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="pl-10 pr-10" />
                      <div className="absolute right-3 top-3">
                        {checkingPhone && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                        {!checkingPhone && phoneAvailable === true && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {!checkingPhone && phoneAvailable === false && <XCircle className="h-4 w-4 text-red-500" />}
                      </div>
                    </div>
                    {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="password" type="password" placeholder="Minimum 8 characters" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="pl-10" />
                    </div>
                    {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="confirmPassword" type="password" placeholder="Re-enter password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="pl-10" />
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
                  </div>
                  <Button onClick={handleNextStep} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
              {step === 'address' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input id="addressLine1" placeholder="123 Main Street" value={formData.addressLine1} onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })} />
                    {errors.addressLine1 && <p className="text-xs text-red-600">{errors.addressLine1}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input id="addressLine2" placeholder="Apartment, suite, etc. (optional)" value={formData.addressLine2} onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" placeholder="Bangalore" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                      {errors.city && <p className="text-xs text-red-600">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input id="state" placeholder="Karnataka" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                      {errors.state && <p className="text-xs text-red-600">{errors.state}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input id="pincode" placeholder="560001" maxLength={6} value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} />
                      {errors.pincode && <p className="text-xs text-red-600">{errors.pincode}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landmark">Landmark</Label>
                      <Input id="landmark" placeholder="Near Park" value={formData.landmark} onChange={(e) => setFormData({ ...formData, landmark: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handlePreviousStep} variant="outline" className="flex-1"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                    <Button onClick={handleNextStep} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600" disabled={loading}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </div>
                </div>
              )}
              {step === 'otp' && (
                <div className="space-y-4">
                  <p className="text-center text-gray-600">We've sent a 6-digit code to your {otpSentTo === 'phone' ? 'phone number' : 'email'}</p>
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
                  {errors.otp && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{errors.otp}</AlertDescription></Alert>}
                  <div className="flex gap-3">
                    <Button onClick={handlePreviousStep} variant="outline" className="flex-1"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                    <Button onClick={handleVerifyOTP} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600" disabled={loading || otp.join('').length !== 6}>{loading ? 'Verifying...' : 'Verify & Register'}</Button>
                  </div>
                </div>
              )}
              {step === 'complete' && (
                <div className="text-center space-y-4 py-8">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl">Registration Successful!</h3>
                  <p className="text-gray-600">Your account has been created. You can now log in.</p>
                  <Button onClick={() => navigate('/login')} className="bg-gradient-to-r from-blue-600 to-purple-600">Go to Login</Button>
                </div>
              )}
              <div className="text-center text-sm text-gray-600 mt-6">
                Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign In</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
