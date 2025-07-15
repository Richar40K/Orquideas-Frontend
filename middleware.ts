import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const adminOnlyRoutes = ['/dashboard'];
const clientOnlyRoutes = ['/cliente/encomiendas', '/cliente/viajes', '/autenticacion/roles'];
const publicRoutes = ['/', '/autenticacion/login', '/autenticacion/registro', '/no-autorizado'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ⛔ Excluir archivos estáticos
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/assets') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // ✅ Permitir rutas públicas
  if (publicRoutes.some(route => pathname === route)) {
    const token = request.cookies.get('token')?.value;

    // Si ya está autenticado y visita /login o /registro → redirigir según rol
    if (token && pathname.startsWith('/autenticacion')) {
      try {
        const decoded: any = jwt.decode(token);
        const roles: string[] = decoded?.roles || [];

        if (roles.includes('ROLE_ADMIN') && roles.includes('ROLE_USER')) {
          return NextResponse.redirect(new URL('/autenticacion/roles', request.url));
        } else if (roles.includes('ROLE_USER')) {
          return NextResponse.redirect(new URL('/cliente/viajes', request.url));
        }
      } catch (err) {
        // Si falla el decode, continuar normalmente
      }
    }

    return NextResponse.next();
  }

  // 🔒 Verificar token obligatorio para rutas privadas
  const token = request.cookies.get('token')?.value;

  if (!token) {
    const loginUrl = new URL('/autenticacion/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  let decoded: any = null;
  try {
    decoded = jwt.decode(token);
  } catch (err) {
    return NextResponse.redirect(new URL('/autenticacion/login', request.url));
  }

  const roles: string[] = decoded?.roles || [];

  // 🔐 Validación de rutas admin
  if (adminOnlyRoutes.some(route => pathname.startsWith(route)) && !roles.includes('ROLE_ADMIN')) {
    return NextResponse.redirect(new URL('/no-autorizado', request.url));
  }

  // 🔐 Validación de rutas cliente
  if (clientOnlyRoutes.some(route => pathname.startsWith(route)) && !roles.includes('ROLE_USER')) {
    return NextResponse.redirect(new URL('/no-autorizado', request.url));
  }

  return NextResponse.next();
}