
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Droplets, Target, TrendingUp, Calendar } from 'lucide-react';

const QuickStats = () => {
  const stats = [
    {
      title: 'Calorie Giornaliere',
      value: '1,850',
      target: '2,000',
      progress: 92.5,
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Idratazione',
      value: '6',
      target: '8 bicchieri',
      progress: 75,
      icon: Droplets,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Obiettivo Peso',
      value: '72kg',
      target: '70kg',
      progress: 60,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Piani Completati',
      value: '12',
      target: '15 questo mese',
      progress: 80,
      icon: Calendar,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gradient">I Tuoi Progressi</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <Card key={index} className="glass-card">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-end space-x-1">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <span className="text-xs text-muted-foreground">/ {stat.target}</span>
                  </div>
                  <Progress value={stat.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuickStats;
