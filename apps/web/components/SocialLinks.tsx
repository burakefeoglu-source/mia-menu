import { SOCIAL_PLATFORMS } from './SocialIcons';

type Variant = 'on-dark' | 'on-light';

type Props = {
  socialLinks?: Record<string, string | null>;
  variant: Variant;
  workingHours?: string | null;
};

export default function SocialLinks({ socialLinks, variant, workingHours }: Props) {
  const links = SOCIAL_PLATFORMS.map(p => {
    const val = socialLinks?.[p.key];
    if (!val) return null;
    const href = p.key === 'whatsapp' ? `https://wa.me/${val}` : val;
    return { href, svg: p.svg, color: p.color, label: p.label };
  }).filter(Boolean) as { href: string; svg: React.ReactNode; color: string; label: string }[];

  if (!links.length && !workingHours) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {workingHours && (
        <span className={`text-xs font-medium ${variant === 'on-dark' ? 'text-white/80' : 'text-gray-500'}`}>
          {workingHours}
        </span>
      )}
      {links.map((item, i) => (
        <a key={i} href={item.href} target="_blank" rel="noreferrer" title={item.label}
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white transition-opacity hover:opacity-80"
          style={variant === 'on-light' ? { background: item.color } : { background: 'rgba(0,0,0,0.2)' }}>
          {item.svg}
        </a>
      ))}
    </div>
  );
}
