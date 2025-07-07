
import { Button } from '@/components/ui/button';
import { Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-lg gradient-secondary flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
          <span className="text-xl font-bold text-gradient">FAME</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <User className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user?.user_metadata?.name || user?.email || 'Utente'}
            </span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleSignOut}
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
