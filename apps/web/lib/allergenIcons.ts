const ICONS: Record<string, string> = {
  gluten: '🌾',
  milk: '🥛',
  egg: '🥚',
  nuts: '🥜',
  sesame: '🫘',
  soy: '🫛',
  fish: '🐟',
  shellfish: '🦐',
};

export function allergenIcon(code: string | null): string {
  if (code && ICONS[code]) return ICONS[code];
  return '⚠️';
}
