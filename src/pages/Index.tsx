
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/auth');
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // Fallback UI (shouldn't normally be seen due to redirects)
  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-primary">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-secondary flex items-center justify-center">
            <span className="text-2xl font-bold text-white">F</span>
          </div>
          <CardTitle className="text-2xl text-black font-bold">Benvenuto in FAME</CardTitle>
          <CardDescription className="text-black">
            Il tuo assistente AI per la pianificazione alimentare
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <Button 
            onClick={() => navigate('/auth')} 
            className="w-full gradient-primary"
          >
            Inizia
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
