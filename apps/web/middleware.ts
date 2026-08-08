import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const { pathname, hostname } = request.nextUrl;

  // ── Subdomain routing ──────────────────────────────────────────
  // bistro.miamenu.online → /menu/bistro
  // bistro.miamenu.online/admin → /admin/bistro
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'miamenu.online';
  const isSubdomain =
    hostname !== rootDomain &&
    hostname !== `www.${rootDomain}` &&
    hostname.endsWith(`.${rootDomain}`);

  if (isSubdomain) {
    const slug = hostname.replace(`.${rootDomain}`, '');

    // /admin/* → admin paneli
    if (pathname.startsWith('/admin') || pathname === '/giris') {
      return NextResponse.rewrite(new URL(pathname, request.url));
    }

    // /kart/* → sadakat kartı
    if (pathname.startsWith('/kart')) {
      return NextResponse.rewrite(new URL(pathname, request.url));
    }

    // Her şey → menü sayfası
    const menuPath = pathname === '/' ? `/menu/${slug}` : `/menu/${slug}${pathname}`;
    return NextResponse.rewrite(new URL(menuPath, request.url));
  }

  // ── Auth koruması (admin sayfaları) ───────────────────────────
  if (!pathname.startsWith('/admin')) return response;

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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
