import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingData {
  personalInfo: {
    gender: string;
    age: string;
    weight: string;
    height: string;
  };
  lifestyle: {
    activity: string;
    frequency: string;
  };
  health: {
    allergies: string[];
    pregnancy: boolean;
  };
  family: {
    members: string;
  };
  goals: {
    objective: string;
    meals: string[];
  };
  notifications: {
    hydrationFrequency: string;
  };
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    personalInfo: { gender: '', age: '', weight: '', height: '' },
    lifestyle: { activity: '', frequency: '' },
    health: { allergies: [], pregnancy: false },
    family: { members: '' },
    goals: { objective: '', meals: [] },
    notifications: { hydrationFrequency: '' },
  });
  const { user, profile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    'Informazioni Personali',
    'Stile di Vita',
    'Salute & Allergie',
    'Famiglia',
    'Obiettivi',
    'Notifiche',
  ];

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Salva i dati di onboarding su Supabase
      if (!user) return;
      setSaving(true);
      setError(null);
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            gender: data.personalInfo.gender,
            age: data.personalInfo.age,
            weight: data.personalInfo.weight,
            height: data.personalInfo.height,
            activity: data.lifestyle.activity,
            activity_frequency: data.lifestyle.frequency,
            allergies: data.health.allergies,
            pregnancy: data.health.pregnancy,
            family_members: data.family.members,
            objective: data.goals.objective,
            meals: data.goals.meals,
            hydration_frequency: data.notifications.hydrationFrequency
          })
          .eq('id', user.id);
        if (error) throw error;
        onComplete(data);
      } catch (err: any) {
        setError(err.message || 'Errore nel salvataggio del profilo');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (section: keyof OnboardingData, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Sesso</Label>
              <RadioGroup
                value={data.personalInfo.gender}
                onValueChange={(value) => updateData('personalInfo', 'gender', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Maschio</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Femmina</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Età</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={data.personalInfo.age}
                  onChange={(e) => updateData('personalInfo', 'age', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={data.personalInfo.weight}
                  onChange={(e) => updateData('personalInfo', 'weight', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Altezza (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="175"
                value={data.personalInfo.height}
                onChange={(e) => updateData('personalInfo', 'height', e.target.value)}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Attività Sportiva</Label>
              <RadioGroup
                value={data.lifestyle.activity}
                onValueChange={(value) => updateData('lifestyle', 'activity', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sedentary" id="sedentary" />
                  <Label htmlFor="sedentary">Sedentario</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Attività Leggera</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate">Attività Moderata</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intense" id="intense" />
                  <Label htmlFor="intense">Attività Intensa</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>Frequenza Settimanale</Label>
              <RadioGroup
                value={data.lifestyle.frequency}
                onValueChange={(value) => updateData('lifestyle', 'frequency', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1-2" id="freq1" />
                  <Label htmlFor="freq1">1-2 volte</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3-4" id="freq2" />
                  <Label htmlFor="freq2">3-4 volte</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5+" id="freq3" />
                  <Label htmlFor="freq3">5+ volte</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Allergie e Intolleranze</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Glutine', 'Lattosio', 'Noci', 'Pesce', 'Uova', 'Soia'].map((allergy) => (
                  <div key={allergy} className="flex items-center space-x-2">
                    <Checkbox
                      id={allergy}
                      checked={data.health.allergies.includes(allergy)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateData('health', 'allergies', [...data.health.allergies, allergy]);
                        } else {
                          updateData('health', 'allergies', 
                            data.health.allergies.filter(a => a !== allergy)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={allergy}>{allergy}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pregnancy"
                checked={data.health.pregnancy}
                onCheckedChange={(checked) => updateData('health', 'pregnancy', checked)}
              />
              <Label htmlFor="pregnancy">In gravidanza</Label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="members">Numero membri famiglia</Label>
              <Input
                id="members"
                type="number"
                placeholder="2"
                value={data.family.members}
                onChange={(e) => updateData('family', 'members', e.target.value)}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Obiettivo</Label>
              <RadioGroup
                value={data.goals.objective}
                onValueChange={(value) => updateData('goals', 'objective', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lose" id="lose" />
                  <Label htmlFor="lose">Dimagrire</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gain" id="gain" />
                  <Label htmlFor="gain">Mettere massa</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maintain" id="maintain" />
                  <Label htmlFor="maintain">Mantenimento</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>Pasti da includere</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Colazione', 'Pranzo', 'Merenda', 'Cena'].map((meal) => (
                  <div key={meal} className="flex items-center space-x-2">
                    <Checkbox
                      id={meal}
                      checked={data.goals.meals.includes(meal)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateData('goals', 'meals', [...data.goals.meals, meal]);
                        } else {
                          updateData('goals', 'meals', 
                            data.goals.meals.filter(m => m !== meal)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={meal}>{meal}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Frequenza promemoria idratazione</Label>
              <RadioGroup
                value={data.notifications.hydrationFrequency}
                onValueChange={(value) => updateData('notifications', 'hydrationFrequency', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="hour1" />
                  <Label htmlFor="hour1">Ogni ora</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="hour2" />
                  <Label htmlFor="hour2">Ogni 2 ore</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="hour3" />
                  <Label htmlFor="hour3">Ogni 3 ore</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4" id="hour4" />
                  <Label htmlFor="hour4">Ogni 4 ore</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen gradient-primary p-4 flex items-center justify-center">
      <Card className="w-full max-w-md glass-card">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-xl text-gradient">Setup Profilo</CardTitle>
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} di {steps.length}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {steps[currentStep]}
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {renderStep()}
            
            <div className="flex space-x-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  Indietro
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="flex-1 gradient-primary"
                disabled={saving}
              >
                {currentStep === steps.length - 1 ? (saving ? 'Salvataggio...' : 'Completa') : 'Avanti'}
              </Button>
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
