import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Profile = () => {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({
    name: profile?.name || '',
    gender: profile?.gender || '',
    age: profile?.age || '',
    weight: profile?.weight || '',
    height: profile?.height || '',
    activity: profile?.activity || '',
    activity_frequency: profile?.activity_frequency || '',
    allergies: (profile?.allergies || []).join(', '),
    pregnancy: profile?.pregnancy || false,
    family_members: profile?.family_members || '',
    objective: profile?.objective || '',
    meals: (profile?.meals || []).join(', '),
    hydration_frequency: profile?.hydration_frequency || '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSuccess(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: form.name,
          gender: form.gender,
          age: form.age,
          weight: form.weight,
          height: form.height,
          activity: form.activity,
          activity_frequency: form.activity_frequency,
          allergies: form.allergies.split(',').map((a: string) => a.trim()).filter(Boolean),
          pregnancy: form.pregnancy,
          family_members: form.family_members,
          objective: form.objective,
          meals: form.meals.split(',').map((m: string) => m.trim()).filter(Boolean),
          hydration_frequency: form.hydration_frequency
        })
        .eq('id', user.id);
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Errore nel salvataggio del profilo');
    } finally {
      setSaving(false);
    }
  };

  if (!user || !profile) {
    return <div className="p-8 text-center">Effettua il login per vedere il profilo.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 p-4 pb-24 flex justify-center">
      <div className="w-full max-w-lg bg-white/80 rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-gradient">Profilo Utente</h1>
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Nome</label>
            <Input value={form.name} onChange={e => handleChange('name', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Sesso</label>
              <Input value={form.gender} onChange={e => handleChange('gender', e.target.value)} />
            </div>
            <div>
              <label className="block font-medium mb-1">Età</label>
              <Input value={form.age} onChange={e => handleChange('age', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Peso (kg)</label>
              <Input value={form.weight} onChange={e => handleChange('weight', e.target.value)} />
            </div>
            <div>
              <label className="block font-medium mb-1">Altezza (cm)</label>
              <Input value={form.height} onChange={e => handleChange('height', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Attività Sportiva</label>
            <Input value={form.activity} onChange={e => handleChange('activity', e.target.value)} />
          </div>
          <div>
            <label className="block font-medium mb-1">Frequenza Attività</label>
            <Input value={form.activity_frequency} onChange={e => handleChange('activity_frequency', e.target.value)} />
          </div>
          <div>
            <label className="block font-medium mb-1">Allergie (separate da virgola)</label>
            <Input value={form.allergies} onChange={e => handleChange('allergies', e.target.value)} />
          </div>
          <div>
            <label className="block font-medium mb-1">In gravidanza</label>
            <input type="checkbox" checked={form.pregnancy} onChange={e => handleChange('pregnancy', e.target.checked)} className="ml-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Numero membri famiglia</label>
            <Input value={form.family_members} onChange={e => handleChange('family_members', e.target.value)} />
          </div>
          <div>
            <label className="block font-medium mb-1">Obiettivo</label>
            <Input value={form.objective} onChange={e => handleChange('objective', e.target.value)} />
          </div>
          <div>
            <label className="block font-medium mb-1">Pasti da includere (separati da virgola)</label>
            <Input value={form.meals} onChange={e => handleChange('meals', e.target.value)} />
          </div>
          <div>
            <label className="block font-medium mb-1">Frequenza promemoria idratazione</label>
            <Input value={form.hydration_frequency} onChange={e => handleChange('hydration_frequency', e.target.value)} />
          </div>
        </div>
        <Button onClick={handleSave} className="w-full gradient-primary mt-6" disabled={saving}>
          {saving ? 'Salvataggio...' : 'Salva Modifiche'}
        </Button>
        {success && <div className="text-green-600 mt-2">Profilo aggiornato con successo!</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default Profile; 