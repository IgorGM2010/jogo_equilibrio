import React from 'react';
import { Stats, StatType, ConditionType } from '../types';
import { STAT_CONFIG } from '../constants';
import { CloudRain, Moon, HeartCrack, Flame, Zap, Tornado, UserMinus } from 'lucide-react';

interface StatsDisplayProps {
  stats: Stats;
  activeConditions: ConditionType[];
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats, activeConditions }) => {
  
  const getBarColor = (value: number) => {
    if (value <= 20) return 'bg-red-400';
    if (value <= 50) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  const getConditionIcons = (statKey: StatType) => {
    const icons = [];
    
    // Mental: Depressão
    if (statKey === 'mental' && activeConditions.includes('depression')) {
        icons.push(<HeartCrack key="depression" size={12} className="text-purple-600 animate-pulse" />);
    }

    // Foco: Ansiedade e Burnout
    if (statKey === 'focus') {
        if (activeConditions.includes('anxiety')) {
             icons.push(<Tornado key="anxiety" size={12} className="text-blue-500 animate-spin-slow" />);
        }
        if (activeConditions.includes('burnout')) {
             icons.push(<Flame key="burnout" size={12} className="text-red-600 animate-pulse" />);
        }
    }

    // Energia: Insônia
    if (statKey === 'energy') {
      if (activeConditions.includes('insomnia')) {
        icons.push(<Moon key="insomnia" size={12} className="text-indigo-600 animate-bounce" />);
      }
    }

    // Humor: Solidão
    if (statKey === 'mood' && activeConditions.includes('loneliness')) {
      icons.push(<UserMinus key="loneliness" size={12} className="text-slate-500 animate-pulse" />);
    }

    return icons;
  };

  return (
    <div className="w-full max-w-md flex justify-between gap-4 px-6">
      {(Object.keys(STAT_CONFIG) as StatType[]).map((key) => {
        const config = STAT_CONFIG[key];
        const value = stats[key];
        const Icon = config.icon;
        const conditionIcons = getConditionIcons(key);

        return (
          <div key={key} className="flex flex-col items-center flex-1 relative">
            
            {/* Condition Alert Badge */}
            {conditionIcons.length > 0 && (
                 <div className="absolute -top-1 -right-1 flex gap-0.5 z-10 bg-white rounded-full p-0.5 border border-slate-100 shadow-sm">
                    {conditionIcons}
                 </div>
            )}

            <div className={`p-2 rounded-full mb-2 ${config.color}`}>
                <Icon size={20} />
            </div>
            
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${config.barColor}`} 
                    style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsDisplay;