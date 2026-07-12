import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies: { name: string; value: string; options?: object }[]) =>
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
          ),
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  if (path.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/giris', request.url));
  }

  if ((path === '/giris' || path === '/kayit') && user) {
    const { data: staff } = await supabase
      .from('staff_users')
      .select('tenants(slug)')
      .eq('user_id', user.id)
      .maybeSingle();
    const slug = (staff?.tenants as { slug: string } | null)?.slug;
    if (slug) return NextResponse.redirect(new URL(`/admin/${slug}`, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/giris', '/kayit'],
};
