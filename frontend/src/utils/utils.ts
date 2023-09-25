import { useEffect, useState } from "react";

/**
 * Keeps state in sync with value in Local Storage.
 * @param key key to identify value in Local Storage
 * @param defaultValue default value, as you migh guess
 * @returns [value, setValue] tuple
 */
export function useStickyState(key: string, defaultValue: any) {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") {
      /**
       * Return default value during SSR.
       */
      return defaultValue;
    }

    const stickyValue = localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

/**
 * Get `isSoundEnabled` option value from local storage.
 *
 * Since we have only one global option for now, I don't want to introduce
 * full-blown global state management into the app.
 */
export const getIsSoundEnabled = (defaultValue: boolean = true): boolean => {
  const storedValue = localStorage.getItem("isSoundEnabled");
  return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
};
