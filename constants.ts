import { GameCard, Stats } from './types';
import { Brain, Zap, Smile, Target, Sun, Heart } from 'lucide-react';

export const INITIAL_STATS: Stats = {
  mental: 60,
  energy: 60,
  mood: 60,
  focus: 50,
};

export const MAX_DAYS = 7;
export const CARDS_PER_DAY = 5;

export const STAT_CONFIG = {
  mental: { label: 'Mental', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-100', barColor: 'from-purple-300 to-purple-400' },
  energy: { label: 'Energia', icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-100', barColor: 'from-yellow-300 to-yellow-500' },
  mood: { label: 'Humor', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-100', barColor: 'from-pink-300 to-pink-400' },
  focus: { label: 'Foco', icon: Target, color: 'text-blue-400', bg: 'bg-blue-100', barColor: 'from-blue-300 to-blue-400' },
};

// Cartas Positivas (Eventos de Alívio) - Obrigatórias
export const POSITIVE_EVENTS: GameCard[] = [
  {
    id: 'pos_nap',
    context: 'positive',
    scenario: 'Você tirou uma soneca rápida e recuperou parte da sua energia.',
    leftChoice: { text: 'Descansar', effect: { energy: 20 } },
    rightChoice: { text: 'Descansar', effect: { energy: 20 } }
  },
  {
    id: 'pos_active_leisure',
    context: 'positive',
    scenario: 'Você passou o dia se divertindo em atividades leves.',
    leftChoice: { text: 'Divertir-se', effect: { energy: 15, mood: 10 } },
    rightChoice: { text: 'Divertir-se', effect: { energy: 15, mood: 10 } }
  },
  {
    id: 'pos_sport',
    context: 'positive',
    scenario: 'Você praticou uma atividade física e se sentiu mais disposto.',
    leftChoice: { text: 'Exercitar-se', effect: { energy: 15, mood: 10 } },
    rightChoice: { text: 'Exercitar-se', effect: { energy: 15, mood: 10 } }
  },
  {
    id: 'pos_good_sleep',
    context: 'positive',
    scenario: 'Você conseguiu dormir bem e recuperar suas energias.',
    leftChoice: { text: 'Acordar bem', effect: { energy: 25, focus: 10 } },
    rightChoice: { text: 'Acordar bem', effect: { energy: 25, focus: 10 } }
  },
  {
    id: 'pos_healthy_food',
    context: 'positive',
    scenario: 'Você se alimentou de forma saudável e ganhou mais disposição.',
    leftChoice: { text: 'Nutrir-se', effect: { energy: 15, mental: 10 } },
    rightChoice: { text: 'Nutrir-se', effect: { energy: 15, mental: 10 } }
  },
  // Mantendo algumas cartas essenciais de remoção de condição e suporte geral
  {
    id: 'pos_friend_support',
    context: 'positive',
    scenario: 'Um amigo te apoiou em um momento difícil.',
    leftChoice: { text: 'Receber apoio', effect: { mental: 10, mood: 10 } },
    rightChoice: { text: 'Receber apoio', effect: { mental: 10, mood: 10 } }
  },
  {
    id: 'pos_trusted_talk',
    context: 'positive',
    scenario: 'Você conversou com alguém de confiança.',
    leftChoice: { text: 'Desabafar', effect: { removeConditions: ['loneliness'] } },
    rightChoice: { text: 'Desabafar', effect: { removeConditions: ['loneliness'] } }
  },
  {
    id: 'pos_relaxing',
    context: 'positive',
    scenario: 'Você fez uma atividade relaxante.',
    leftChoice: { text: 'Relaxar', effect: { removeConditions: ['anxiety'] } },
    rightChoice: { text: 'Relaxar', effect: { removeConditions: ['anxiety'] } }
  },
  {
    id: 'pos_therapy',
    context: 'positive',
    scenario: 'Você participou de uma sessão de terapia.',
    leftChoice: { text: 'Refletir', effect: { mental: 20, removeConditions: ['depression'] } },
    rightChoice: { text: 'Refletir', effect: { mental: 20, removeConditions: ['depression'] } }
  },
  {
    id: 'pos_family',
    context: 'positive',
    scenario: 'Você passou um tempo agradável com sua família.',
    leftChoice: { text: 'Aproveitar', effect: { mood: 20, mental: 10 } },
    rightChoice: { text: 'Aproveitar', effect: { mood: 20, mental: 10 } }
  }
];

// Cartas Especiais (Eventos de Condição)
export const SPECIAL_CARDS: Record<string, GameCard> = {
  DEPRESSION: {
    id: 'special_depression',
    context: 'special',
    scenario: 'Você está com depressão. Sua saúde mental está muito baixa.',
    leftChoice: { text: 'Continuar', effect: {} },
    rightChoice: { text: 'Continuar', effect: {} }
  },
  ANXIETY: {
    id: 'special_anxiety',
    context: 'special',
    scenario: 'Você está com ansiedade. Seu foco está comprometido e a mente não descansa.',
    leftChoice: { text: 'Continuar', effect: {} },
    rightChoice: { text: 'Continuar', effect: {} }
  },
  INSOMNIA: {
    id: 'special_insomnia',
    context: 'special',
    scenario: 'Você está com insônia. O cansaço físico é constante.',
    leftChoice: { text: 'Continuar', effect: {} },
    rightChoice: { text: 'Continuar', effect: {} }
  },
  LONELINESS: {
    id: 'special_loneliness',
    context: 'special',
    scenario: 'Você está se sentindo sozinho. O isolamento afeta seu humor.',
    leftChoice: { text: 'Continuar', effect: {} },
    rightChoice: { text: 'Continuar', effect: {} }
  },
  BURNOUT: {
    id: 'special_burnout',
    context: 'special',
    scenario: 'Você está em burnout. Esgotamento total.',
    leftChoice: { text: 'Continuar', effect: {} },
    rightChoice: { text: 'Continuar', effect: {} }
  }
};

// Cartas Narrativas - Início da manhã – Casa (06h às 07h)
export const MORNING_HOME_CARDS: GameCard[] = [
  {
    id: 'mh_1',
    context: 'home',
    scenario: 'O despertador tocou às 06h. Você se sente um pouco cansado.',
    leftChoice: { text: 'Levantar agora', effect: { energy: -10, focus: 10 } },
    rightChoice: { text: 'Soneca de 15min', effect: { energy: 5, focus: -10 } }
  },
  {
    id: 'mh_2',
    context: 'home',
    scenario: 'Hora do café da manhã. O que você vai fazer?',
    leftChoice: { text: 'Café completo', effect: { energy: 15, mental: 5 } },
    rightChoice: { text: 'Pular e sair', effect: { energy: -15, focus: -5 } }
  },
  {
    id: 'mh_3',
    context: 'home',
    scenario: 'Você tem 10 minutos antes do ônibus passar.',
    leftChoice: { text: 'Revisar matéria', effect: { focus: 10, mental: -5 } },
    rightChoice: { text: 'Ver redes sociais', effect: { mood: 5, focus: -10 } }
  },
  {
    id: 'mh_4',
    context: 'home',
    scenario: 'Você não sabe que roupa vestir e está ficando tarde.',
    leftChoice: { text: 'Escolher rápido', effect: { focus: 5, energy: -5 } },
    rightChoice: { text: 'Caprichar no look', effect: { mood: 10, energy: -10 } }
  },
  {
    id: 'mh_5',
    context: 'home',
    scenario: 'Sua mochila está uma bagunça total.',
    leftChoice: { text: 'Organizar tudo', effect: { focus: 10, mental: 5, energy: -5 } },
    rightChoice: { text: 'Deixar assim', effect: { focus: -10, mental: -5 } }
  },
  {
    id: 'mh_6',
    context: 'home',
    scenario: 'Você sente uma leve ansiedade ao acordar.',
    leftChoice: { text: 'Meditar 5min', effect: { mental: 15, focus: 5 } },
    rightChoice: { text: 'Ignorar e sair', effect: { mental: -10, energy: 5 } }
  },
  {
    id: 'mh_7',
    context: 'home',
    scenario: 'Você percebe que não bebeu água ainda.',
    leftChoice: { text: 'Beber água', effect: { energy: 10, focus: 5 } },
    rightChoice: { text: 'Beber energético', effect: { energy: 20, focus: 10, mental: -10 } }
  },
  {
    id: 'mh_8',
    context: 'home',
    scenario: 'Seu corpo está rígido após a noite de sono.',
    leftChoice: { text: 'Alongar-se', effect: { energy: 10, mood: 5 } },
    rightChoice: { text: 'Ficar no sofá', effect: { energy: -5, mood: -5 } }
  }
];

// Cartas Narrativas - Manhã – Escola (07h às 11h)
export const MORNING_SCHOOL_CARDS: GameCard[] = [
  {
    id: 'ms_1',
    context: 'school',
    scenario: 'O professor anunciou uma prova surpresa agora!',
    leftChoice: { text: 'Tentar focar', effect: { focus: 15, mental: -15, energy: -10 } },
    rightChoice: { text: 'Desistir', effect: { focus: -20, mental: 5 } }
  },
  {
    id: 'ms_2',
    context: 'school',
    scenario: 'Trabalho em grupo: seus colegas não estão colaborando.',
    leftChoice: { text: 'Fazer tudo só', effect: { energy: -20, focus: 10, mental: -15 } },
    rightChoice: { text: 'Cobrar o grupo', effect: { mood: -10, mental: -5, energy: -10 } }
  },
  {
    id: 'ms_3',
    context: 'school',
    scenario: 'Um colega fez uma piada ofensiva sobre você no corredor.',
    leftChoice: { text: 'Ignorar', effect: { mental: -15, mood: -5 } },
    rightChoice: { text: 'Confrontar', effect: { energy: -15, mental: -10, mood: -5 } }
  },
  {
    id: 'ms_4',
    context: 'school',
    scenario: 'Aula de Educação Física: o professor quer que todos participem.',
    leftChoice: { text: 'Participar', effect: { energy: -15, mood: 10, mental: 5 } },
    rightChoice: { text: 'Ficar no banco', effect: { mood: -10, energy: 5 } }
  },
  {
    id: 'ms_5',
    context: 'school',
    scenario: 'Você está com dúvida na matéria, mas a aula está acabando.',
    leftChoice: { text: 'Perguntar', effect: { focus: 15, mental: -5 } },
    rightChoice: { text: 'Guardar dúvida', effect: { focus: -15, mental: -5 } }
  },
  {
    id: 'ms_6',
    context: 'school',
    scenario: 'O intervalo começou. A biblioteca está silenciosa.',
    leftChoice: { text: 'Estudar lá', effect: { focus: 15, energy: -10 } },
    rightChoice: { text: 'Ir pro pátio', effect: { mood: 10, energy: 5 } }
  },
  {
    id: 'ms_7',
    context: 'school',
    scenario: 'Um amigo parece estar muito triste hoje.',
    leftChoice: { text: 'Oferecer ajuda', effect: { mood: 15, mental: 5, energy: -10 } },
    rightChoice: { text: 'Focar na aula', effect: { focus: 10, mood: -5 } }
  },
  {
    id: 'ms_8',
    context: 'school',
    scenario: 'A aula está extremamente entediante.',
    leftChoice: { text: 'Anotar tudo', effect: { focus: 10, energy: -15 } },
    rightChoice: { text: 'Viajar no tempo', effect: { energy: 10, focus: -20 } }
  },
  {
    id: 'ms_9',
    context: 'school',
    scenario: 'Você esqueceu de fazer um trabalho importante.',
    leftChoice: { text: 'Pedir prazo', effect: { mental: -10, focus: 5 } },
    rightChoice: { text: 'Fazer correndo', effect: { energy: -20, focus: -10, mental: -15 } }
  },
  {
    id: 'ms_10',
    context: 'school',
    scenario: 'Hora do almoço na escola. O refeitório está lotado.',
    leftChoice: { text: 'Socializar', effect: { mood: 15, energy: -15 } },
    rightChoice: { text: 'Comer sozinho', effect: { mental: 10, energy: 5 } }
  },
  {
    id: 'ms_11',
    context: 'school',
    scenario: 'Você foi convidado para um projeto extracurricular.',
    leftChoice: { text: 'Aceitar', effect: { focus: 15, mental: 10, energy: -20 } },
    rightChoice: { text: 'Recusar', effect: { energy: 10, mental: -5 } }
  },
  {
    id: 'ms_12',
    context: 'school',
    scenario: 'Um professor elogiou seu desempenho em voz alta.',
    leftChoice: { text: 'Ficar orgulhoso', effect: { mood: 20, mental: 10 } },
    rightChoice: { text: 'Ficar tímido', effect: { mood: -5, mental: -5 } }
  }
];

// Cartas Narrativas - Restante do dia – Casa (12h em diante)
export const REST_OF_DAY_CARDS: GameCard[] = [
  {
    id: 'rd_1',
    context: 'home',
    scenario: 'Chegou em casa exausto. Há muita lição para fazer.',
    leftChoice: { text: 'Começar agora', effect: { focus: 15, energy: -20, mental: -10 } },
    rightChoice: { text: 'Descansar 1h', effect: { energy: 15, focus: -10 } }
  },
  {
    id: 'rd_2',
    context: 'home',
    scenario: 'Seus pais pediram ajuda com as tarefas de casa.',
    leftChoice: { text: 'Ajudar', effect: { mood: 10, energy: -15, mental: 5 } },
    rightChoice: { text: 'Dizer que ocupado', effect: { mood: -10, mental: -5 } }
  },
  {
    id: 'rd_3',
    context: 'home',
    scenario: 'Seus amigos te chamaram para sair, mas você está sem energia.',
    leftChoice: { text: 'Ir mesmo assim', effect: { mood: 15, energy: -20, mental: 5 } },
    rightChoice: { text: 'Ficar em casa', effect: { energy: 15, mood: -10 } }
  },
  {
    id: 'rd_4',
    context: 'home',
    scenario: 'Noite de insônia: você está rolando na cama sem sono.',
    leftChoice: { text: 'Ler um livro', effect: { mental: 10, energy: 5 } },
    rightChoice: { text: 'Usar o celular', effect: { energy: -15, mental: -10, focus: -10 } }
  },
  {
    id: 'rd_5',
    context: 'home',
    scenario: 'Você sente que precisa se mexer um pouco hoje.',
    leftChoice: { text: 'Fazer exercício', effect: { energy: -15, mood: 15, mental: 10 } },
    rightChoice: { text: 'Continuar sentado', effect: { mood: -10, energy: 5 } }
  },
  {
    id: 'rd_6',
    context: 'home',
    scenario: 'Sua série favorita lançou uma temporada nova.',
    leftChoice: { text: 'Maratonar', effect: { mood: 20, focus: -15, energy: -10 } },
    rightChoice: { text: 'Ver um episódio', effect: { mood: 10, focus: 5 } }
  },
  {
    id: 'rd_7',
    context: 'home',
    scenario: 'A louça está acumulada na pia da cozinha.',
    leftChoice: { text: 'Lavar agora', effect: { mental: 10, energy: -10 } },
    rightChoice: { text: 'Deixar pra amanhã', effect: { mental: -10, mood: -5 } }
  },
  {
    id: 'rd_8',
    context: 'home',
    scenario: 'Um amigo ligou querendo conversar por horas.',
    leftChoice: { text: 'Atender', effect: { mood: 15, energy: -20, mental: 5 } },
    rightChoice: { text: 'Mandar mensagem', effect: { energy: 10, mood: -5 } }
  },
  {
    id: 'rd_9',
    context: 'home',
    scenario: 'Você está sentindo falta de um hobby criativo.',
    leftChoice: { text: 'Desenhar/Tocar', effect: { mental: 20, mood: 10, energy: -10 } },
    rightChoice: { text: 'Ver TV', effect: { energy: 5, mood: -5 } }
  },
  {
    id: 'rd_10',
    context: 'home',
    scenario: 'O clima está ótimo para uma caminhada noturna.',
    leftChoice: { text: 'Sair um pouco', effect: { mental: 15, mood: 10, energy: -5 } },
    rightChoice: { text: 'Ficar no quarto', effect: { mood: -10, energy: 5 } }
  },
  {
    id: 'rd_11',
    context: 'home',
    scenario: 'Você precisa planejar as metas da próxima semana.',
    leftChoice: { text: 'Planejar', effect: { focus: 20, mental: 10, energy: -10 } },
    rightChoice: { text: 'Deixar rolar', effect: { focus: -15, mental: -5 } }
  },
  {
    id: 'rd_12',
    context: 'home',
    scenario: 'Bateu aquela vontade de comer algo bem gorduroso.',
    leftChoice: { text: 'Pedir delivery', effect: { mood: 15, energy: -15, focus: -10 } },
    rightChoice: { text: 'Cozinhar algo', effect: { energy: 10, mental: 10 } }
  }
];

export const STATIC_DECK: GameCard[] = [
    ...MORNING_HOME_CARDS,
    ...MORNING_SCHOOL_CARDS,
    ...REST_OF_DAY_CARDS
];