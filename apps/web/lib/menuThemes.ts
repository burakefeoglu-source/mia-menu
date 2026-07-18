export type MenuThemeKey =
  | 'rose' | 'blue' | 'emerald' | 'amber'
  | 'purple' | 'slate' | 'orange' | 'teal';

type ThemeDef = {
  label: string;
  headerBg: string;
  headerText: string;
  darkHeaderBg: string;
  darkHeaderText: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  swatch: string;
};

export const MENU_THEMES: Record<MenuThemeKey, ThemeDef> = {
  rose:    { label: 'Gül',      headerBg: 'bg-rose-50',    headerText: 'text-rose-800',    darkHeaderBg: 'bg-rose-900',    darkHeaderText: 'text-rose-100',    accentBg: 'bg-rose-600',    accentBorder: 'border-rose-600',    accentText: 'text-rose-700',    swatch: 'bg-rose-600' },
  blue:    { label: 'Mavi',     headerBg: 'bg-blue-50',    headerText: 'text-blue-800',    darkHeaderBg: 'bg-blue-900',    darkHeaderText: 'text-blue-100',    accentBg: 'bg-blue-600',    accentBorder: 'border-blue-600',    accentText: 'text-blue-700',    swatch: 'bg-blue-600' },
  emerald: { label: 'Zümrüt',   headerBg: 'bg-emerald-50', headerText: 'text-emerald-800', darkHeaderBg: 'bg-emerald-900', darkHeaderText: 'text-emerald-100', accentBg: 'bg-emerald-600', accentBorder: 'border-emerald-600', accentText: 'text-emerald-700', swatch: 'bg-emerald-600' },
  amber:   { label: 'Amber',    headerBg: 'bg-amber-50',   headerText: 'text-amber-900',   darkHeaderBg: 'bg-amber-900',   darkHeaderText: 'text-amber-100',   accentBg: 'bg-amber-600',   accentBorder: 'border-amber-600',   accentText: 'text-amber-700',   swatch: 'bg-amber-600' },
  purple:  { label: 'Mor',      headerBg: 'bg-purple-50',  headerText: 'text-purple-800',  darkHeaderBg: 'bg-purple-900',  darkHeaderText: 'text-purple-100',  accentBg: 'bg-purple-600',  accentBorder: 'border-purple-600',  accentText: 'text-purple-700',  swatch: 'bg-purple-600' },
  slate:   { label: 'Antrasit', headerBg: 'bg-slate-100',  headerText: 'text-slate-800',   darkHeaderBg: 'bg-slate-900',   darkHeaderText: 'text-slate-100',   accentBg: 'bg-slate-700',   accentBorder: 'border-slate-700',   accentText: 'text-slate-700',   swatch: 'bg-slate-700' },
  orange:  { label: 'Turuncu',  headerBg: 'bg-orange-50',  headerText: 'text-orange-800',  darkHeaderBg: 'bg-orange-900',  darkHeaderText: 'text-orange-100',  accentBg: 'bg-orange-600',  accentBorder: 'border-orange-600',  accentText: 'text-orange-700',  swatch: 'bg-orange-600' },
  teal:    { label: 'Teal',     headerBg: 'bg-teal-50',    headerText: 'text-teal-800',    darkHeaderBg: 'bg-teal-900',    darkHeaderText: 'text-teal-100',    accentBg: 'bg-teal-600',    accentBorder: 'border-teal-600',    accentText: 'text-teal-700',    swatch: 'bg-teal-600' },
};

export const DEFAULT_THEME: MenuThemeKey = 'rose';

export function getTheme(key: string | null | undefined): ThemeDef {
  return MENU_THEMES[(key as MenuThemeKey) ?? DEFAULT_THEME] ?? MENU_THEMES[DEFAULT_THEME];
}
