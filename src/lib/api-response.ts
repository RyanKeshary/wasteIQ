/**
 * API Response Helpers
 * Consistent response shapes for all API routes.
 */
import { NextResponse } from 'next/server';

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export function apiMessage(message: string, status = 200) {
  return NextResponse.json({ success: true, message }, { status });
}
