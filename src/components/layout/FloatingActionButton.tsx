
import { useState } from 'react';
import { Plus, FileText, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: FileText,
      label: 'Carica dieta',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => console.log('Upload diet'),
    },
    {
      icon: Calendar,
      label: 'Prenota consulto',
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => console.log('Book consultation'),
    },
    {
      icon: Sparkles,
      label: 'Genera piano',
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => console.log('Generate plan'),
    },
  ];

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Action Buttons */}
      <div className={`flex flex-col space-y-3 mb-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <div key={index} className="flex items-center space-x-3">
              <span className="glass-card px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
                {action.label}
              </span>
              <Button
                onClick={action.onClick}
                className={`w-12 h-12 rounded-full shadow-lg ${action.color}`}
              >
                <Icon className="h-5 w-5" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Main FAB */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-xl gradient-primary transition-transform duration-200 ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default FloatingActionButton;
