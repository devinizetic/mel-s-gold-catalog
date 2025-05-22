
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const Navbar: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin');

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
      <div className="container mx-auto flex justify-center items-center">
        <Link to="/" className="font-serif text-2xl font-semibold text-gold">
          Las Joyas de Mel
        </Link>
        
        {/* Only show these links on admin pages */}
        {user && isAdminPage && (
          <div className="absolute right-6 flex space-x-6 items-center">
            <Link to="/admin" className="text-gray-800 hover:text-gold transition-colors">
              Admin
            </Link>
            <button
              onClick={handleSignOut}
              className="text-gray-800 hover:text-gold transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
