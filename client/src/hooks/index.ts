import { useState, useEffect, SetStateAction, useContext } from "react";
import { AppContext } from "@/contexts/AppContextProvider";
import { SearchContext } from "@/contexts/SearchContextProvider";

type ReturnType<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): ReturnType<T> => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) return JSON.parse(storedValue);
    if (typeof initialValue === "function") {
      return initialValue as React.Dispatch<SetStateAction<T>>;
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as [typeof value, typeof setValue];
};

export function useAppContext() {
  const context = useContext(AppContext);
  return context;
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  return context;
}
