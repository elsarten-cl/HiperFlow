import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normaliza un número de teléfono a un formato E.164 simplificado.
 * Quita todos los caracteres que no sean dígitos y, si empieza con '9' (común en Chile),
 * le antepone el código de país '+56'.
 * @param phone El número de teléfono a normalizar.
 * @returns El número normalizado o null si la entrada está vacía.
 */
export function normalizePhoneNumber(phone: string | undefined | null): string | null {
  if (!phone) return null;

  let digits = phone.replace(/\D/g, '');

  if (digits.length === 0) return null;

  // Asumir código de país si falta, por ejemplo +56 para Chile
  if (digits.length === 9 && digits.startsWith('9')) {
    return `+56${digits}`;
  }
  
  if (digits.length > 9 && !digits.startsWith('+')) {
     return `+${digits}`;
  }

  if (digits.startsWith('+')) {
    return digits;
  }

  // Si no se puede normalizar con certeza, se devuelve null para que el original se guarde.
  return null;
}
