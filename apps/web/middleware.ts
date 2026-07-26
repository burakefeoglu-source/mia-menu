import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            response.cookies.set(name, value, options as any);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Giriş yapılmamışsa /giris'e yönlendir
  if (pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/giris', request.url));
  }

  // Slug bazlı yetki kontrolü — /admin/[slug]/... rotaları
  if (pathname.startsWith('/admin/') && user) {
    const parts = pathname.split('/');
    const slug = parts[2]; // /admin/SLUG/...

    if (slug && slug !== 'undefined') {
      // Super admin her şeye erişebilir
      const isSuperAdmin = user.email === 'burak.efeoglu@gmail.com';

      if (!isSuperAdmin) {
        // Kullanıcının bu tenant'a erişimi var mı?
        const { data: tenant } = await supabase
          .from('tenants')
          .select('id')
          .eq('slug', slug)
          .single();

        if (tenant) {
          const { data: staff } = await supabase
            .from('staff_users')
            .select('id')
            .eq('user_id', user.id)
            .eq('tenant_id', tenant.id)
            .maybeSingle();

          if (!staff) {
            // Yetkisiz erişim — kendi paneline yönlendir
            return NextResponse.redirect(new URL('/giris', request.url));
          }
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
