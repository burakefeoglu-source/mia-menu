import {
  Bean,
  Egg,
  Fish,
  Leaf,
  LeafyGreen,
  Milk,
  Nut,
  Shell,
  Shrimp,
  Sprout,
  TriangleAlert,
  Wheat,
  Wine,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  gluten: Wheat,
  crustacea: Shrimp,
  egg: Egg,
  fish: Fish,
  peanuts: Bean,
  soy: Sprout,
  milk: Milk,
  tree_nuts: Nut,
  sesame: Leaf,
  celery: LeafyGreen,
  mustard: Leaf,
  sulphites: Wine,
  lupin: Bean,
  molluscs: Shell,
};

export function AllergenIcon({
  code,
  className,
}: {
  code: string | null;
  className?: string;
}) {
  const Icon = (code && ICONS[code]) || TriangleAlert;
  return <Icon className={className} />;
}
