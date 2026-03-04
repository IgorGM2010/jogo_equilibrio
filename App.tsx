import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameCard, GameStatus, Stats, ConditionType, StatType } from './types';
import { 
  INITIAL_STATS, 
  SPECIAL_CARDS, 
  POSITIVE_EVENTS, 
  MAX_DAYS, 
  CARDS_PER_DAY,
  MORNING_HOME_CARDS,
  MORNING_SCHOOL_CARDS,
  REST_OF_DAY_CARDS
} from './constants';
import StatsDisplay from './components/StatsDisplay';
import Card from './components/Card';
import { RefreshCw, Play, Brain, Heart, Sun, Leaf, Cloud, Info, ArrowLeft, MoveHorizontal, CheckCircle2, X, Target } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.START);
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const [day, setDay] = useState(1);
  const [cardsPlayedToday, setCardsPlayedToday] = useState(0);
  const [currentCard, setCurrentCard] = useState<GameCard | null>(null);
  const [deck, setDeck] = useState<GameCard[]>([]);
  const [deckIndex, setDeckIndex] = useState(0); 
  const [activeConditions, setActiveConditions] = useState<Set<ConditionType>>(new Set());
  const [cardsSinceLastPositive, setCardsSinceLastPositive] = useState(0);
  const [recoveryCounters, setRecoveryCounters] = useState<Record<ConditionType, number>>({
    depression: 0,
    anxiety: 0,
    insomnia: 0,
    loneliness: 0,
    burnout: 0
  });

  const generateDailyDeck = useCallback(() => {
    const morningHome = [...MORNING_HOME_CARDS].sort(() => Math.random() - 0.5)[0];
    const morningSchool = [...MORNING_SCHOOL_CARDS].sort(() => Math.random() - 0.5).slice(0, 2);
    const restOfDay = [...REST_OF_DAY_CARDS].sort(() => Math.random() - 0.5).slice(0, 2);
    
    return [morningHome, ...morningSchool, ...restOfDay];
  }, []);

  const startGame = useCallback(() => {
    setStats({ ...INITIAL_STATS });
    setDay(1);
    setCardsPlayedToday(0);
    setActiveConditions(new Set());
    setCardsSinceLastPositive(0);
    setRecoveryCounters({ depression: 0, anxiety: 0, insomnia: 0, loneliness: 0, burnout: 0 });
    
    const initialDeck = generateDailyDeck();
    setDeck(initialDeck);
    setDeckIndex(0);
    setCurrentCard(initialDeck[0]);
    setStatus(GameStatus.PLAYING);
  }, [generateDailyDeck]);

  const nextCard = () => {
    let newCardsPlayed = cardsPlayedToday + 1;
    let newDay = day;
    let newDeck = [...deck];
    let newDeckIndex = deckIndex + 1;

    if (newCardsPlayed >= CARDS_PER_DAY) {
      newDay += 1;
      newCardsPlayed = 0;
      
      if (newDay <= MAX_DAYS) {
        newDeck = generateDailyDeck();
        newDeckIndex = 0;
      }
    }

    if (newDay > MAX_DAYS) {
        finishGame(true);
        return;
    }

    setDay(newDay);
    setCardsPlayedToday(newCardsPlayed);
    setDeck(newDeck);
    setDeckIndex(newDeckIndex);
    setCurrentCard(newDeck[newDeckIndex]);
  };

  const finishGame = (win: boolean) => {
      setStatus(win ? GameStatus.GAME_OVER_WIN : GameStatus.GAME_OVER_LOSS);
  };

  const applyPassiveDebuffs = (currentStats: Stats, conditions: Set<ConditionType>): Stats => {
      const statsAfterDebuff = { ...currentStats };
      if (conditions.has('depression')) { statsAfterDebuff.mood -= 3; statsAfterDebuff.energy -= 2; }
      if (conditions.has('anxiety')) { statsAfterDebuff.focus -= 3; statsAfterDebuff.mental -= 2; }
      if (conditions.has('insomnia')) { statsAfterDebuff.energy -= 3; statsAfterDebuff.focus -= 2; }
      if (conditions.has('loneliness')) { statsAfterDebuff.mood -= 3; statsAfterDebuff.mental -= 2; }
      if (conditions.has('burnout')) { statsAfterDebuff.focus -= 3; statsAfterDebuff.energy -= 3; statsAfterDebuff.mental -= 2; }

      (Object.keys(statsAfterDebuff) as StatType[]).forEach(key => {
        statsAfterDebuff[key] = Math.max(0, Math.min(100, statsAfterDebuff[key]));
      });
      return statsAfterDebuff;
  };

  const checkRemovalConditions = (currentStats: Stats, conditions: Set<ConditionType>, counters: Record<ConditionType, number>) => {
      const newConditions = new Set<ConditionType>(conditions);
      const newCounters = { ...counters };

      const check = (cond: ConditionType, stat: number, threshold: number) => {
        if (newConditions.has(cond)) {
          if (stat >= threshold) newCounters[cond]++;
          else newCounters[cond] = 0;
          if (newCounters[cond] >= 3) {
            newConditions.delete(cond);
            newCounters[cond] = 0;
          }
        } else newCounters[cond] = 0;
      };

      check('depression', currentStats.mental, 50);
      check('anxiety', currentStats.focus, 50);
      check('insomnia', currentStats.energy, 45);
      check('loneliness', currentStats.mood, 45);
      if (newConditions.has('burnout')) {
          if (currentStats.focus >= 40 && currentStats.energy >= 40) newCounters.burnout++;
          else newCounters.burnout = 0;
          if (newCounters.burnout >= 3) {
              newConditions.delete('burnout');
              newCounters.burnout = 0;
          }
      } else newCounters.burnout = 0;

      return { newConditions, newCounters };
  };

  const updateStats = (effect: any) => {
    let tempStats = { ...stats };
    let currentConditions = new Set<ConditionType>(activeConditions);
    
    if (effect.removeConditions && Array.isArray(effect.removeConditions)) {
        effect.removeConditions.forEach((cond: ConditionType) => {
            currentConditions.delete(cond);
            setRecoveryCounters(prev => ({ ...prev, [cond]: 0 }));
        });
    }

    (Object.keys(tempStats) as StatType[]).forEach(key => {
      if (effect[key]) {
        tempStats[key] += effect[key];
        tempStats[key] = Math.max(0, Math.min(100, tempStats[key]));
      }
    });

    tempStats = applyPassiveDebuffs(tempStats, currentConditions);
    const removalResult = checkRemovalConditions(tempStats, currentConditions, recoveryCounters);
    currentConditions = removalResult.newConditions;
    setRecoveryCounters(removalResult.newCounters);

    let triggeredSpecialCard: GameCard | null = null;
    let triggeredPositiveCard: GameCard | null = null;
    
    if (tempStats.focus <= 20 && tempStats.energy <= 20 && !currentConditions.has('burnout')) {
        currentConditions.add('burnout'); triggeredSpecialCard = SPECIAL_CARDS.BURNOUT;
    } else if (tempStats.mental <= 30 && !currentConditions.has('depression')) {
        currentConditions.add('depression'); triggeredSpecialCard = SPECIAL_CARDS.DEPRESSION;
    } else if (tempStats.focus <= 30 && !currentConditions.has('anxiety')) {
        currentConditions.add('anxiety'); triggeredSpecialCard = SPECIAL_CARDS.ANXIETY;
    } else if (tempStats.energy <= 25 && !currentConditions.has('insomnia')) {
        currentConditions.add('insomnia'); triggeredSpecialCard = SPECIAL_CARDS.INSOMNIA;
    } else if (tempStats.mood <= 25 && !currentConditions.has('loneliness')) {
        currentConditions.add('loneliness'); triggeredSpecialCard = SPECIAL_CARDS.LONELINESS;
    }

    if (!triggeredSpecialCard) {
        const hasActiveProblems = currentConditions.size > 0;
        const probability = hasActiveProblems ? 0.4 : 0.25; 
        
        // Only allow positive cards after at least 2 choice cards
        if (cardsSinceLastPositive >= 2 && Math.random() < probability) {
            const randomIndex = Math.floor(Math.random() * POSITIVE_EVENTS.length);
            triggeredPositiveCard = POSITIVE_EVENTS[randomIndex];
            setCardsSinceLastPositive(0);
        } else {
            setCardsSinceLastPositive(prev => prev + 1);
        }
    } else {
        // Special cards also count as "not choice" in terms of breather rhythm
        setCardsSinceLastPositive(0);
    }

    setStats(tempStats);
    setActiveConditions(currentConditions);

    const isDead = Object.values(tempStats).some((val) => (val as number) <= 0);
    if (isDead) {
        finishGame(false);
        return;
    }

    if (triggeredSpecialCard) setCurrentCard(triggeredSpecialCard);
    else if (triggeredPositiveCard) setCurrentCard(triggeredPositiveCard);
    else nextCard();
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentCard) return;
    const choice = direction === 'left' ? currentCard.leftChoice : currentCard.rightChoice;
    updateStats(choice.effect);
  };

  // --- About Screen ---
  if (status === GameStatus.ABOUT) {
      return (
        <div className="min-h-[100dvh] relative overflow-hidden bg-teal-light flex flex-col items-center justify-center p-4 md:p-8 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="w-full max-w-2xl bg-white rounded-[2rem] shadow-sm border border-gold/30 flex flex-col h-full max-h-[85vh] overflow-hidden"
            >
                <div className="p-8 border-b border-slate-50 flex items-center justify-center shrink-0">
                    <h2 className="text-xl font-bold text-teal">
                        Sobre o Jogo
                    </h2>
                </div>
                
                <div className="overflow-y-auto p-8 space-y-8 text-softGray leading-relaxed custom-scrollbar">
                    <section>
                        <p className="text-lg font-semibold text-teal">
                            Equilíbrio: A Saúde Mental na Vida de um Estudante
                        </p>
                        <p className="mt-4">
                            Este é um jogo educativo que convida você a refletir sobre saúde mental de forma leve e interativa. Ao longo da jornada, você vivencia os desafios cotidianos de um estudante e aprende, por meio de escolhas, como suas decisões influenciam o bem-estar emocional, físico e cognitivo.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-sm uppercase tracking-widest font-bold text-slate-300 mb-4">
                            Objetivo
                        </h3>
                        <p>
                            Promover a conscientização sobre hábitos saudáveis, autocuidado e rotina equilibrada. A proposta é lúdica, acessível e alinhada à educação socioemocional, estimulando a reflexão sobre como pequenas atitudes podem impactar positivamente a vida diária.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-sm uppercase tracking-widest font-bold text-slate-300 mb-4">
                            Como Jogar
                        </h3>
                        <div className="space-y-4">
                             <div className="flex items-start gap-4">
                                <div className="w-2 h-2 rounded-full bg-teal mt-2 shrink-0" />
                                <span><strong>Duração:</strong> A experiência acontece ao longo de 7 dias fictícios.</span>
                             </div>
                             <div className="flex items-start gap-4">
                                <div className="w-2 h-2 rounded-full bg-pink mt-2 shrink-0" />
                                <div>
                                    <strong>Indicadores:</strong> Você deve acompanhar quatro aspectos principais:
                                    <ul className="mt-2 grid grid-cols-2 gap-2 text-sm font-medium">
                                        <li className="flex items-center gap-2 text-purple-400"><Brain size={16} /> Mental</li>
                                        <li className="flex items-center gap-2 text-yellow-500"><Sun size={16} /> Energia</li>
                                        <li className="flex items-center gap-2 text-pink-400"><Heart size={16} /> Humor</li>
                                        <li className="flex items-center gap-2 text-blue-400"><Target size={16} /> Foco</li>
                                    </ul>
                                </div>
                             </div>
                             <div className="flex items-start gap-4">
                                <div className="w-2 h-2 rounded-full bg-yellow mt-2 shrink-0" />
                                <div>
                                    <strong>Decisões:</strong> Cada situação é apresentada em formato de carta.
                                    <ul className="mt-1 list-disc list-inside text-sm opacity-80">
                                        <li>Arraste para a esquerda ou direita para escolher sua ação.</li>
                                        <li>Suas escolhas afetam diretamente os indicadores.</li>
                                    </ul>
                                </div>
                             </div>
                             <div className="flex items-start gap-4">
                                <div className="w-2 h-2 rounded-full bg-teal mt-2 shrink-0" />
                                <span><strong>Final:</strong> O jogo termina ao completar os 7 dias ou quando algum indicador chega a zero.</span>
                             </div>
                        </div>
                    </section>
                </div>
                
                <div className="p-8 border-t border-slate-50 shrink-0 bg-slate-50/30">
                    <button 
                        onClick={() => setStatus(GameStatus.START)}
                        className="w-full bg-teal text-white py-4 rounded-full font-bold hover:bg-teal/90 transition-all shadow-sm active:scale-[0.98]"
                    >
                        Entendi, voltar ao início
                    </button>
                </div>
            </motion.div>
        </div>
      );
  }

  // --- Start Screen ---
  if (status === GameStatus.START) {
    return (
      <div className="min-h-[100dvh] relative overflow-hidden bg-teal-light flex flex-col items-center justify-center p-4 md:p-8 text-center font-sans touch-none">
        
        {/* Main Content Box */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full bg-white p-12 rounded-[2.5rem] border border-teal/20 shadow-sm"
        >
            <div className="space-y-4">
                <h1 className="text-5xl font-bold text-teal tracking-tight">
                    Equilíbrio
                </h1>
                <h2 className="text-lg font-medium text-softGray leading-relaxed max-w-xs mx-auto">
                    A Saúde Mental na Vida de um Estudante
                </h2>
            </div>
            
            <div className="flex flex-col gap-4 w-full">
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startGame}
                    className="bg-pink text-white px-10 py-4 rounded-full font-bold text-lg shadow-sm flex items-center justify-center gap-3 w-full"
                >
                    <Play size={20} fill="white" /> 
                    Iniciar Jornada
                </motion.button>

                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStatus(GameStatus.ABOUT)}
                    className="bg-yellow text-teal px-10 py-4 rounded-full font-bold text-lg shadow-sm flex items-center justify-center gap-3 w-full"
                >
                    <Info size={20} /> 
                    Como Jogar
                </motion.button>
            </div>
        </motion.div>
      </div>
    );
  }

  // --- Game Over ---
  if (status === GameStatus.GAME_OVER_LOSS || status === GameStatus.GAME_OVER_WIN) {
    const won = status === GameStatus.GAME_OVER_WIN;
    return (
      <div className="min-h-[100dvh] bg-teal-light flex flex-col items-center justify-center p-4 md:p-6 text-center font-sans touch-none">
         <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-sm border border-gold/20"
         >
            <h1 className="text-3xl font-bold mb-4 text-teal">
                Fim da Jornada
            </h1>
            
            <p className="text-softGray mb-8 text-lg leading-relaxed font-medium">
                {won 
                    ? "Parabéns! Você concluiu os 7 dias mantendo o equilíbrio." 
                    : "Sua jornada chegou ao fim. Nem sempre conseguimos manter o equilíbrio."}
            </p>
            
            <div className="mb-10">
                 <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-6">Estado Final</p>
                 <StatsDisplay stats={stats} activeConditions={Array.from(activeConditions)} />
            </div>

            <button 
                onClick={startGame}
                className="w-full bg-teal text-white py-4 px-8 rounded-full font-bold text-lg hover:bg-teal/90 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
                <RefreshCw size={20} /> Reiniciar
            </button>
        </motion.div>
      </div>
    );
  }

  // --- Playing ---
  return (
    <div className="fixed inset-0 min-h-[100dvh] bg-teal-light flex flex-col items-center font-sans touch-none">
      
      {/* Exit Button */}
      <button 
        onClick={() => setStatus(GameStatus.START)}
        className="absolute top-6 right-6 z-50 p-2 text-slate-300 hover:text-teal transition-all"
        aria-label="Sair para o início"
      >
        <X size={24} />
      </button>

      {/* Top Indicators Section */}
      <div className="w-full max-w-md z-20 pt-12 pb-6 flex flex-col items-center">
         {/* Day Indicator */}
         <div className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">
            Dia {day}
         </div>

         <StatsDisplay stats={stats} activeConditions={Array.from(activeConditions)} />
      </div>

      {/* Card Area */}
      <div className="flex-1 w-full grid place-items-center relative z-10 p-4 pb-12">
        <AnimatePresence mode="wait">
        {currentCard && (
            <Card 
                key={currentCard.id} 
                data={currentCard} 
                onSwipe={handleSwipe} 
            />
        )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default App;