
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const Navbar: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Error signing out',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Signed out successfully',
      });
      navigate('/');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-6 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-serif text-2xl font-semibold gold-text">
          Las Joyas de Mel
        </Link>
        <div className="flex space-x-6 items-center">
          <Link to="/" className="text-gray-800 hover:text-gold transition-colors">
            Home
          </Link>
          <Link to="/products" className="text-gray-800 hover:text-gold transition-colors">
            Products
          </Link>
          {user ? (
            <>
              <Link to="/admin" className="text-gray-800 hover:text-gold transition-colors">
                Admin
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray-800 hover:text-gold transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" className="text-gray-800 hover:text-gold transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
