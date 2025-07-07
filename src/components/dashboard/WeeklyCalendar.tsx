
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Meal {
  id: string;
  name: string;
  type: 'colazione' | 'pranzo' | 'merenda' | 'cena';
  calories: number;
  time: string;
}

interface DayMeals {
  date: string;
  meals: Meal[];
}

const WeeklyCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  
  // Mock data for the week
  const weekDays = [
    'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'
  ];
  
  const mockMeals: DayMeals[] = [
    {
      date: '2024-01-15',
      meals: [
        { id: '1', name: 'Avocado Toast', type: 'colazione', calories: 350, time: '08:00' },
        { id: '2', name: 'Insalata di Quinoa', type: 'pranzo', calories: 480, time: '13:00' },
        { id: '3', name: 'Frutta e Yogurt', type: 'merenda', calories: 180, time: '16:00' },
        { id: '4', name: 'Salmone ai Ferri', type: 'cena', calories: 520, time: '20:00' },
      ]
    },
    // Add more days with different meals
    ...Array.from({ length: 6 }, (_, i) => ({
      date: `2024-01-${16 + i}`,
      meals: [
        { id: `${i+2}1`, name: 'Cereali Integrali', type: 'colazione' as const, calories: 280, time: '08:00' },
        { id: `${i+2}2`, name: 'Pasta Integrale', type: 'pranzo' as const, calories: 450, time: '13:00' },
        { id: `${i+2}3`, name: 'Smoothie Verde', type: 'merenda' as const, calories: 150, time: '16:00' },
        { id: `${i+2}4`, name: 'Pollo alle Verdure', type: 'cena' as const, calories: 480, time: '20:00' },
      ]
    }))
  ];

  const getMealTypeColor = (type: string) => {
    switch (type) {
      case 'colazione': return 'bg-yellow-100 text-yellow-800';
      case 'pranzo': return 'bg-green-100 text-green-800';
      case 'merenda': return 'bg-blue-100 text-blue-800';
      case 'cena': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalCalories = (meals: Meal[]) => {
    return meals.reduce((total, meal) => total + meal.calories, 0);
  };

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gradient">Piano Settimanale</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(currentWeek - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-3">
            Settimana {currentWeek + 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(currentWeek + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 gap-4">
        {weekDays.map((day, index) => {
          const dayMeals = mockMeals[index] || { date: '', meals: [] };
          const totalCalories = getTotalCalories(dayMeals.meals);
          
          return (
            <Card key={day} className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{day}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {totalCalories} kcal
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dayMeals.meals.map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <Badge className={getMealTypeColor(meal.type)}>
                          {meal.type}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{meal.name}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{meal.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {meal.calories} kcal
                      </div>
                    </div>
                  ))}
                  
                  {dayMeals.meals.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">Nessun pasto pianificato</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Aggiungi pasti
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
