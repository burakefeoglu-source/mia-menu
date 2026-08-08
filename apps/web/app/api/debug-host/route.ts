import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    host_header: req.headers.get('host'),
    nexturl_hostname: req.nextUrl.hostname,
    url: req.url,
  });
}
