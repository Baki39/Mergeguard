import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    stripeKeyExists: !!process.env.STRIPE_SECRET_KEY,
    stripeKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10) || 'none',
    appUrl: process.env.APP_URL,
  });
}
