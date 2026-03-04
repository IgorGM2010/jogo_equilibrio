export type StatType = 'mental' | 'energy' | 'mood' | 'focus';

export interface Stats {
  mental: number;
  energy: number;
  mood: number;
  focus: number;
}

export type ConditionType = 'depression' | 'anxiety' | 'insomnia' | 'loneliness' | 'burnout';

export interface StatEffect {
  mental?: number;
  energy?: number;
  mood?: number;
  focus?: number;
  removeConditions?: ConditionType[];
}

export interface Choice {
  text: string;
  effect: StatEffect;
}

export interface GameCard {
  id: string;
  scenario: string;
  context: 'school' | 'home' | 'social' | 'special' | 'positive';
  leftChoice: Choice;
  rightChoice: Choice;
}

export enum GameStatus {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER_LOSS = 'GAME_OVER_LOSS',
  GAME_OVER_WIN = 'GAME_OVER_WIN',
  ABOUT = 'ABOUT',
}

export interface Condition {
  type: ConditionType;
  isActive: boolean;
}