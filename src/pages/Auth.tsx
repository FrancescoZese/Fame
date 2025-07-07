
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (type: 'login' | 'register') => {
    if (type === 'register' && formData.password !== formData.confirmPassword) {
      return;
    }

    setIsLoading(true);
    
    try {
      if (type === 'login') {
        const { error } = await signIn(formData.email, formData.password);
        if (!error) {
          navigate('/dashboard');
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.name);
        // Don't navigate on signup - user needs to verify email first
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Accedi</TabsTrigger>
              <TabsTrigger value="register">Registrati</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@esempio.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-black font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </div>
              <Button 
                onClick={() => handleSubmit('login')} 
                className="w-full gradient-primary"
                disabled={isLoading || !formData.email || !formData.password}
              >
                {isLoading ? 'Accesso in corso...' : 'Accedi'}
              </Button>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black font-medium">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Il tuo nome"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-register" className="text-black font-medium">Email</Label>
                <Input
                  id="email-register"
                  type="email"
                  placeholder="nome@esempio.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-register" className="text-black font-medium">Password</Label>
                <Input
                  id="password-register"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-black font-medium">Conferma Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                />
              </div>
              <Button 
                onClick={() => handleSubmit('register')} 
                className="w-full gradient-primary"
                disabled={isLoading || !formData.email || !formData.password || !formData.name || formData.password !== formData.confirmPassword}
              >
                {isLoading ? 'Registrazione in corso...' : 'Registrati'}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
