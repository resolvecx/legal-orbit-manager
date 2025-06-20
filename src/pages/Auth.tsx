
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentView, setCurrentView] = useState<'signin' | 'signup' | 'reset'>('signin');
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      console.log('User authenticated, redirecting to home');
      navigate('/');
    }
  }, [user, navigate]);

  // Pre-fill super admin credentials for demo
  const fillSuperAdminCredentials = () => {
    setEmail('shahzaib.codecones@gmail.com');
    setPassword('admin123456');
    toast.info('Super admin credentials filled');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Attempting sign in with:', email);

    const { error } = await signIn(email, password);
    
    if (error) {
      console.error('Sign in failed:', error);
      if (error.message?.includes('Email not confirmed')) {
        setError('Please check your email and click the confirmation link before signing in.');
        toast.error('Please confirm your email address first');
      } else {
        setError(error.message || 'Failed to sign in');
        toast.error(`Sign in failed: ${error.message}`);
      }
    } else {
      toast.success('Successfully signed in!');
      navigate('/');
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    console.log('Attempting sign up with:', email);

    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      console.error('Sign up failed:', error);
      if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
        setError('An account with this email already exists. Please sign in instead.');
        toast.error('Account already exists. Please sign in instead.');
      } else {
        setError(error.message || 'Failed to create account');
        toast.error(`Sign up failed: ${error.message}`);
      }
    } else {
      toast.success('Account created successfully! You can now sign in.');
      // Clear form and switch to sign in tab
      setEmail('');
      setPassword('');
      setFullName('');
      setConfirmPassword('');
      setCurrentView('signin');
    }
    
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await resetPassword(resetEmail);
    
    if (error) {
      console.error('Password reset failed:', error);
      setError(error.message || 'Failed to send reset email');
      toast.error(`Password reset failed: ${error.message}`);
    } else {
      toast.success('Password reset email sent! Please check your inbox.');
      setResetEmail('');
      setCurrentView('signin');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/lovable-uploads/841b868b-d8ab-4468-a404-6f15ec26422a.png)'
        }}
      ></div>
      
      {/* Resolve CX Logo */}
      <div className="absolute top-8 left-8 z-10">
        <img 
          src="/lovable-uploads/2e008ad1-54b3-4fdf-bab6-847f0547aae2.png" 
          alt="Resolve CX" 
          className="h-8"
        />
      </div>

      {/* Success notification */}
      {currentView === 'reset' && (
        <div className="absolute top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2 z-10">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
          <div>
            <p className="text-green-800 font-medium text-sm">Success</p>
            <p className="text-green-600 text-xs">Password Recovery Email has been sent Successfully</p>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md p-4">
        <Card className="bg-white shadow-xl border-0">
          <CardContent className="p-8">
            {/* Sign In View */}
            {currentView === 'signin' && (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
                  <p className="text-gray-600">To access your Resolve CX account.</p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="johndoe@codecones.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Log In'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setCurrentView('reset')}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <span className="text-gray-600">Don't have an account? </span>
                  <button
                    onClick={() => setCurrentView('signup')}
                    className="text-gray-900 font-medium hover:text-gray-700"
                  >
                    Signup
                  </button>
                </div>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-gray-200 hover:bg-gray-50"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue With Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-gray-200 hover:bg-gray-50"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#00BCF2" d="M0 0h11.377v11.372H0z"/>
                        <path fill="#00BCF2" d="M11.377 0H24v11.372H11.377z"/>
                        <path fill="#00BCF2" d="M0 11.372h11.377V24H0z"/>
                        <path fill="#FFB900" d="M11.377 11.372H24V24H11.377z"/>
                      </svg>
                      Continue With Microsoft
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Sign Up View */}
            {currentView === 'signup' && (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign up</h1>
                  <p className="text-gray-600">Sign up now to explore all the features.</p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workEmail" className="text-gray-700 font-medium">Work Email</Label>
                    <Input
                      id="workEmail"
                      type="email"
                      placeholder="johndoe@codecones.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="createPassword" className="text-gray-700 font-medium">Create Password</Label>
                    <div className="relative">
                      <Input
                        id="createPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* reCAPTCHA placeholder */}
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="w-6 h-6 border-2 border-gray-300 rounded bg-white"></div>
                    <span className="text-gray-700">I'm not a robot</span>
                    <div className="ml-auto">
                      <div className="text-xs text-gray-500">
                        <div>reCAPTCHA</div>
                        <div className="flex space-x-1">
                          <span>Privacy</span>
                          <span>-</span>
                          <span>Terms</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg"
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Sign Up'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <span className="text-gray-600">Already have an account? </span>
                  <button
                    onClick={() => setCurrentView('signin')}
                    className="text-gray-900 font-medium hover:text-gray-700"
                  >
                    Login
                  </button>
                </div>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-gray-200 hover:bg-gray-50"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue With Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-gray-200 hover:bg-gray-50"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#00BCF2" d="M0 0h11.377v11.372H0z"/>
                        <path fill="#00BCF2" d="M11.377 0H24v11.372H11.377z"/>
                        <path fill="#00BCF2" d="M0 11.372h11.377V24H0z"/>
                        <path fill="#FFB900" d="M11.377 11.372H24V24H11.377z"/>
                      </svg>
                      Continue With Microsoft
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Reset Password View */}
            {currentView === 'reset' && (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Recover your password</h1>
                  <p className="text-gray-600">to continue to your ResolveCX account.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail" className="text-gray-700 font-medium">Email</Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      placeholder="johndoe@codecones.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Continue'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <span className="text-gray-600">Or </span>
                  <button
                    onClick={() => setCurrentView('signin')}
                    className="text-gray-900 font-medium hover:text-gray-700"
                  >
                    Login
                  </button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Super Admin Credentials Helper - only show on signin */}
        {currentView === 'signin' && (
          <Card className="mt-4 border-dashed bg-white/90">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">For demo purposes</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fillSuperAdminCredentials}
                  className="w-full"
                >
                  Fill Super Admin Credentials
                </Button>
                <p className="text-xs text-muted-foreground">
                  Email: shahzaib.codecones@gmail.com | Password: admin123456
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Auth;
