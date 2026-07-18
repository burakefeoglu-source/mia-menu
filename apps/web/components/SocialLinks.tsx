import { SOCIAL_PLATFORMS } from './SocialIcons';

type Variant = 'on-dark' | 'on-light';

type Props = {
  socialLinks?: Record<string, string | null>;
  variant: Variant;
  workingHours?: string | null;
  accentBg?: string; // Tailwind class, örn: 'bg-rose-600'
};

export default function SocialLinks({ socialLinks, variant, workingHours, accentBg }: Props) {
  const links = SOCIAL_PLATFORMS.map(p => {
    const val = socialLinks?.[p.key];
    if (!val) return null;
    const href = p.key === 'whatsapp' ? `https://wa.me/${val}` : val;
    return { href, svg: p.svg, color: p.color, label: p.label };
  }).filter(Boolean) as { href: string; svg: React.ReactNode; color: string; label: string }[];

  if (!links.length && !workingHours) return null;

  return (
    <div className="flex items-center justify-between mt-2 gap-2">
      {/* Çalışma saati solda */}
      {workingHours ? (
        <span className={`text-xs font-medium ${variant === 'on-dark' ? 'text-white/80' : 'text-gray-500'}`}>
          {workingHours}
        </span>
      ) : <span />}

      {/* İkonlar sağda */}
      <div className="flex items-center gap-1.5">
        {links.map((item, i) => (
          <a
            key={i}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            title={item.label}
            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white transition-opacity hover:opacity-80 ${
              variant === 'on-light' && accentBg ? accentBg : ''
            }`}
            style={
              variant === 'on-dark'
                ? { background: 'rgba(255,255,255,0.2)' }
                : accentBg
                  ? undefined
                  : { background: item.color }
            }
          >
            {item.svg}
          </a>
        ))}
      </div>
    </div>
  );
}
