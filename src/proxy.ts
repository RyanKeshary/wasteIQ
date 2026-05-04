import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
export default createMiddleware(routing);
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|hi|mr|gu|ta|bn|ur|pa|te|ml|kn|or)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
