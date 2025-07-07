import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import FloatingActionButton from '@/components/layout/FloatingActionButton';
import QuickStats from '@/components/dashboard/QuickStats';
import WeeklyCalendar from '@/components/dashboard/WeeklyCalendar';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { profile } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gradient">
            Ciao, {profile?.name || 'Utente'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ecco il tuo piano alimentare personalizzato
          </p>
        </div>
        
        <QuickStats />
        <WeeklyCalendar />
      </main>
      
      <FloatingActionButton />
      <BottomNav />
    </div>
  );
};

export default Dashboard;
