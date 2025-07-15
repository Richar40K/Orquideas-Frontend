import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export function getUserFromToken(): string | null {
  try {
    const token = Cookies.get('token');
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    return decoded.sub || null; // "sub" contiene el username del back
  } catch (err) {
    console.error('Error al decodificar el token:', err);
    return null;
  }
}
