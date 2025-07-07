import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  department?: string;
}

interface Meal {
  id: string;
  title: string;
  description?: string;
  ingredients: Ingredient[];
  instructions?: string;
  youtube_link?: string;
  nutrition?: any;
  photo_url?: string;
  day?: string;
  meal_type?: string;
}

const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
const mealTypes = ['Colazione', 'Pranzo', 'Merenda', 'Cena'];

const Planner = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchMealplan = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('mealplans')
          .select('meals_json')
          .eq('user_id', user.id)
          .order('week_start', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (error) throw error;
        const mealsArr = data?.meals_json?.meals || [];
        setMeals(mealsArr);
      } catch (err: any) {
        setError(err.message || 'Errore nel recupero del mealplan');
      } finally {
        setLoading(false);
      }
    };
    fetchMealplan();
  }, [user, generating]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      if (!user) throw new Error('Utente non loggato');
      const weekStart = new Date().toISOString().slice(0, 10);
      // Prompt per LLM
      const prompt = `Genera un piano alimentare settimanale in formato JSON con 7 giorni (Lunedì-Domenica), per ogni giorno 4 pasti (Colazione, Pranzo, Merenda, Cena). Ogni pasto deve avere: id, title, day, meal_type, ingredients (array di oggetti con name, quantity, unit), description, instructions, nutrition (calorie, carboidrati, proteine, grassi). Rispondi solo con il JSON, senza testo aggiuntivo.`;
      // Chiamata a Hugging Face Inference API (Llama-2)
      const HF_TOKEN = '<INSERISCI_IL_TUO_TOKEN>'; // Inserisci qui il tuo token Hugging Face
      const response = await fetch(
        'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HF_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inputs: prompt })
        }
      );
      const data = await response.json();
      // Parsing risposta: estrai solo il JSON
      let mealplanJson = null;
      try {
        // Alcuni modelli restituiscono la risposta come testo, altri come oggetto
        const text = data?.[0]?.generated_text || data?.generated_text || data;
        const match = text.match(/\{[\s\S]*\}/);
        mealplanJson = match ? JSON.parse(match[0]) : JSON.parse(text);
      } catch (e) {
        throw new Error('Errore nel parsing della risposta AI');
      }
      // Sovrascrivi o inserisci il mealplan
      const { data: existing, error: fetchError } = await supabase
        .from('mealplans')
        .select('id')
        .eq('user_id', user.id)
        .eq('week_start', weekStart)
        .maybeSingle();
      if (fetchError) throw fetchError;
      if (existing && existing.id) {
        const { error } = await supabase
          .from('mealplans')
          .update({ meals_json: mealplanJson })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('mealplans')
          .insert({
            user_id: user.id,
            week_start: weekStart,
            meals_json: mealplanJson
          });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Errore nella generazione del piano');
    } finally {
      setGenerating(false);
    }
  };

  const handleMealClick = (meal: Meal) => {
    setSelectedMeal(meal);
  };

  const closeModal = () => setSelectedMeal(null);

  if (!user) {
    return <div className="p-8 text-center">Effettua il login per vedere il planner.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 p-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gradient">Pianifica la tua settimana</h1>
        <Button onClick={handleGenerate} disabled={generating} className="gradient-primary">
          {generating ? 'Generazione...' : 'Genera piano AI'}
        </Button>
      </div>
      {loading && <div>Caricamento...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/80 rounded-xl shadow">
          <thead>
            <tr>
              <th className="p-2 border-b"></th>
              {days.map(day => (
                <th key={day} className="p-2 border-b text-center">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mealTypes.map(mealType => (
              <tr key={mealType}>
                <td className="p-2 font-semibold border-b text-right">{mealType}</td>
                {days.map(day => {
                  const meal = meals.find(m =>
                    m.day?.trim().toLowerCase() === day.trim().toLowerCase() &&
                    m.meal_type?.trim().toLowerCase() === mealType.trim().toLowerCase()
                  );
                  return (
                    <td key={day} className="p-2 border-b text-center">
                      {meal ? (
                        <button
                          className="underline text-purple-700 hover:text-purple-900"
                          onClick={() => handleMealClick(meal)}
                        >
                          {meal.title}
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal dettaglio pasto */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-black">&times;</button>
            <h2 className="text-xl font-bold mb-2">{selectedMeal.title}</h2>
            <p className="mb-2 text-gray-700">{selectedMeal.description}</p>
            <div className="mb-2">
              <strong>Ingredienti:</strong>
              <ul className="list-disc ml-5">
                {selectedMeal.ingredients?.map((ing, idx) => (
                  <li key={idx}>{ing.name} - {ing.quantity} {ing.unit}</li>
                ))}
              </ul>
            </div>
            {selectedMeal.instructions && (
              <div className="mb-2">
                <strong>Istruzioni:</strong>
                <p>{selectedMeal.instructions}</p>
              </div>
            )}
            {selectedMeal.youtube_link && (
              <div className="mb-2">
                <a href={selectedMeal.youtube_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Guarda la video ricetta</a>
              </div>
            )}
            {selectedMeal.nutrition && (
              <div className="mb-2">
                <strong>Valori nutrizionali:</strong>
                <pre className="bg-gray-100 rounded p-2 text-xs mt-1">{JSON.stringify(selectedMeal.nutrition, null, 2)}</pre>
              </div>
            )}
            {selectedMeal.photo_url && (
              <img src={selectedMeal.photo_url} alt={selectedMeal.title} className="rounded mt-2 max-h-40 mx-auto" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner; 