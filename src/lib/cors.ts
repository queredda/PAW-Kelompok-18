import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = [
  'http://localhost:3000',
  'https://boxsystem.site',
  'https://www.boxsystem.site',
  'boxsystem.site',
  'www.boxsystem.site'
];

export function cors(req: NextRequest) {
  const origin = req.headers.get('origin');
  
  if (origin && allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  return new NextResponse(null, {
    status: 403,
    statusText: 'Not allowed by CORS',
  });
} 