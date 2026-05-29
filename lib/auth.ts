import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  role: string;
  sub: string;
  email: string;
  exp: number;
  departmentId?: string;
};

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
}

export function setTokens(accessToken: string, refreshToken?: string): void {
  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  document.cookie = `accessToken=${encodeURIComponent(accessToken)}; path=/; samesite=strict`;
}

export function clearTokens(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  sessionStorage.clear();
  document.cookie = "accessToken=; path=/; max-age=0";
  window.dispatchEvent(new Event("auth-logout"));
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1")}=([^;]*)`,
    ),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
}

export function getUserRole(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  return decodeToken(token)?.role ?? null;
}

export function getUserEmail(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  return decodeToken(token)?.email ?? null;
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  return decoded.exp * 1000 < Date.now();
}

export function isAuthenticated(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  return !isTokenExpired(token);
}
