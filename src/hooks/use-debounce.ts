'use client';

import { useState, useEffect } from 'react';

/**
 * Hook para "retrasar" el cambio de un valor, útil para no saturar
 * peticiones en campos de búsqueda.
 * @param value El valor a "retrasar".
 * @param delay El tiempo en milisegundos para el retraso.
 * @returns El valor después del retraso.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura un temporizador para actualizar el valor "retrasado"
    // después de que el 'delay' haya pasado desde el último cambio de 'value'.
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Función de limpieza: se ejecuta si 'value' o 'delay' cambian
    // antes de que el temporizador termine. Esto cancela el temporizador
    // anterior y evita que se actualice el valor.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo se vuelve a ejecutar si 'value' o 'delay' cambian.

  return debouncedValue;
}
