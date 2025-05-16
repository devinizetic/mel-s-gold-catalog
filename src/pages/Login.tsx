
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const from = location.state?.from || '/admin';

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsCheckingAuth(false);
        if (data.session) {
          // If on the login page and already logged in, navigate to admin
          navigate(from, { replace: true });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsCheckingAuth(false);
      }
    };

    checkUser();
  }, [navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive',
        });
      } else if (data.user) {
        toast({
          title: 'Welcome!',
          description: 'You have successfully logged in.',
        });
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
      toast({
        title: 'Login failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-6 py-16 flex flex-col items-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-serif font-medium text-center mb-8">Admin Login</h1>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gold hover:bg-gold-dark"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Esta área está restringida solo para administradores.</p>
            <p className="mt-2">
              Volver a la <a href="/" className="text-gold hover:text-gold-dark">página principal</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
