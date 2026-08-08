import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'miamenu.online';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;

  // ── Subdomain routing ──────────────────────────────────────────
  const isSubdomain =
    hostname.endsWith(`.${ROOT_DOMAIN}`) &&
    hostname !== `www.${ROOT_DOMAIN}` &&
    !hostname.includes('vercel.app') &&
    !hostname.includes('localhost');

  if (isSubdomain) {
    const subdomainSlug = hostname.replace(`.${ROOT_DOMAIN}`, '');

    // custom_subdomain → gerçek slug'ı bul
    let slug = subdomainSlug;
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const db = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await db
        .from('tenants')
        .select('slug')
        .eq('custom_subdomain', subdomainSlug)
        .maybeSingle();
      if (data?.slug) slug = data.slug;
    } catch { /* DB erişilemezse slug kullan */ }

    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' ? `/menu/${slug}` : `/menu/${slug}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // ── Admin auth koruması ───────────────────────────────────────
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            response.cookies.set(name, value, options as any);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/giris', request.url));

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
