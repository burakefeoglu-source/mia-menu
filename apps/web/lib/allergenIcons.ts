const ICONS: Record<string, string> = {
  gluten: '🌾',
  crustacea: '🦐',
  egg: '🥚',
  fish: '🐟',
  peanuts: '🥜',
  soy: '🫛',
  milk: '🥛',
  tree_nuts: '🌰',
  celery: '🥬',
  mustard: '🫙',
  sesame: '🫘',
  sulphites: '🍷',
  lupin: '🌱',
  molluscs: '🐚',
};

export function allergenIcon(code: string | null): string {
  if (code && ICONS[code]) return ICONS[code];
  return '⚠️';
}
