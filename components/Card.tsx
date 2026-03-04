import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { GameCard } from '../types';
import { Home, School, Users, AlertOctagon, Sun } from 'lucide-react';

interface CardProps {
  data: GameCard;
  onSwipe: (direction: 'left' | 'right') => void;
}

const Card: React.FC<CardProps> = ({ data, onSwipe }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  // Opacity for overlays
  const leftOpacity = useTransform(x, [0, 100], [0, 1]); 
  const rightOpacity = useTransform(x, [0, -100], [0, 1]);

  const [dragStart, setDragStart] = useState(false);

  const handleDragEnd = (event: any, info: PanInfo) => {
    setDragStart(false);
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  const getIcon = () => {
    const iconClass = "w-6 h-6 opacity-60";
    switch(data.context) {
      case 'home': return <Home className={`text-teal ${iconClass}`} />;
      case 'school': return <School className={`text-blue-400 ${iconClass}`} />;
      case 'social': return <Users className={`text-pink ${iconClass}`} />;
      case 'special': return <AlertOctagon className={`text-red-400 ${iconClass}`} />;
      case 'positive': return <Sun className={`text-yellow ${iconClass}`} />;
      default: return <Home className={iconClass} />;
    }
  };

  const getContextLabel = (context: string) => {
    switch(context) {
        case 'school': return 'Escola';
        case 'home': return 'Casa';
        case 'social': return 'Social';
        case 'special': return 'Condição';
        case 'positive': return 'Momento Bom';
        default: return 'Evento';
    }
  };

  const isSpecial = data.context === 'special';
  const isPositive = data.context === 'positive';
  const isEvent = isSpecial || isPositive;

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={() => setDragStart(true)}
      onDragEnd={handleDragEnd}
      className={`col-start-1 row-start-1 relative w-[90vw] max-w-[340px] h-[50vh] min-h-[360px] max-h-[480px] bg-white rounded-3xl shadow-lg border border-gold/20 flex flex-col items-center justify-center p-8 cursor-grab active:cursor-grabbing select-none`}
    >
        {/* Choice Overlays */}
        {!isEvent && (
            <>
                <motion.div 
                    style={{ opacity: leftOpacity }} 
                    className="absolute top-10 left-6 border border-teal text-teal font-medium text-sm px-3 py-1 rounded-full z-20 bg-white shadow-sm"
                >
                    {data.rightChoice.text}
                </motion.div>
                
                <motion.div 
                    style={{ opacity: rightOpacity }} 
                    className="absolute top-10 right-6 border border-pink text-pink font-medium text-sm px-3 py-1 rounded-full z-20 bg-white shadow-sm"
                >
                    {data.leftChoice.text}
                </motion.div>
            </>
        )}

        {/* Thematic Icon Top-Left */}
        <div className="absolute top-6 left-6">
            {getIcon()}
        </div>

      {/* Card Visual Content */}
      <div className="flex-1 w-full flex flex-col items-center justify-center">
        <div className="text-center">
            <h3 className="text-xs uppercase tracking-widest text-slate-300 font-bold mb-4">
                {getContextLabel(data.context)}
            </h3>
            <p className="text-softGray font-medium text-lg md:text-xl leading-relaxed px-2">
                {data.scenario}
            </p>
        </div>
      </div>

      {/* Footer Indicator */}
      <div className="absolute bottom-8 text-slate-200">
        {isEvent ? (
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Deslize para continuar</span>
        ) : (
             <div className="w-8 h-1 bg-slate-100 rounded-full" />
        )}
      </div>

    </motion.div>
  );
};

export default Card;