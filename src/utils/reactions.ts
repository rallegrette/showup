import { ReactionType } from '../api/types';

export const reactionEmojis: Record<ReactionType, string> = {
  fire: '\uD83D\uDD25',
  heart: '\u2764\uFE0F',
  guitar: '\uD83C\uDFB8',
  mindblown: '\uD83E\uDD2F',
  dancing: '\uD83D\uDD7A',
  clap: '\uD83D\uDC4F',
};

export const reactionLabels: Record<ReactionType, string> = {
  fire: 'Fire',
  heart: 'Love',
  guitar: 'Vibes',
  mindblown: 'Mind Blown',
  dancing: 'Dancing',
  clap: 'Applause',
};
