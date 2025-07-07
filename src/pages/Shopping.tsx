import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Database } from '@/integrations/supabase/types';

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  department?: string;
}

interface AggregatedIngredient extends Ingredient {
  checked: boolean;
}

const Shopping = () => {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<AggregatedIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funzione per aggregare ingredienti da tutti i pasti
  const aggregateIngredients = (meals: any[]): AggregatedIngredient[] => {
    const map = new Map<string, AggregatedIngredient>();
    meals.forEach(meal => {
      meal.ingredients?.forEach((ing: Ingredient) => {
        const key = `${ing.name}-${ing.unit}-${ing.department || ''}`;
        if (map.has(key)) {
          map.get(key)!.quantity += ing.quantity;
        } else {
          map.set(key, { ...ing, checked: false });
        }
      });
    });
    return Array.from(map.values());
  };

  useEffect(() => {
    const fetchMealplan = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        // Recupera il mealplan settimanale per l'utente loggato
        const { data, error } = await supabase
          .from('mealplans')
          .select('meals_json')
          .eq('user_id', user.id)
          .order('week_start', { ascending: false })
          .limit(1)
          .maybeSingle<Database['public']['Tables']['mealplans']['Row']>();
        if (error) throw error;
        const meals = data?.meals_json?.meals || [];
        setIngredients(aggregateIngredients(meals));
      } catch (err: any) {
        setError(err.message || 'Errore nel recupero del mealplan');
      } finally {
        setLoading(false);
      }
    };
    fetchMealplan();
  }, [user]);

  const toggleChecked = (idx: number) => {
    setIngredients(prev => prev.map((ing, i) => i === idx ? { ...ing, checked: !ing.checked } : ing));
  };

  const handleExport = () => {
    // Stub: qui andrà la logica per esportare PDF/CSV
    alert('Funzione export in arrivo!');
  };

  if (!user) {
    return <div className="p-8 text-center">Effettua il login per vedere la lista della spesa.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 p-4 pb-24">
      <h1 className="text-2xl font-bold mb-4 text-gradient">Lista della Spesa</h1>
      {loading && <div>Caricamento...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="bg-white/80 rounded-xl shadow p-4 mb-4">
        <ul className="divide-y divide-gray-200">
          {ingredients.map((ing, idx) => (
            <li key={idx} className="flex items-center py-2">
              <input
                type="checkbox"
                checked={ing.checked}
                onChange={() => toggleChecked(idx)}
                className="mr-3 h-5 w-5 accent-purple-500"
              />
              <span className="flex-1">
                <span className="font-medium">{ing.name}</span>
                {ing.department && (
                  <span className="ml-2 text-xs text-gray-500">({ing.department})</span>
                )}
              </span>
              <span className="ml-2 text-sm text-gray-700">
                {ing.quantity} {ing.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Button onClick={handleExport} className="w-full gradient-primary mt-2">
        Esporta PDF/CSV
      </Button>
    </div>
  );
};

export default Shopping; 