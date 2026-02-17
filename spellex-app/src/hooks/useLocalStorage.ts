"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            if (typeof window !== "undefined") {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : initialValue;
            }
        } catch (error) {
            console.error("Error reading from localStorage", error);
        }
        return initialValue;
    });

    // Update LocalStorage whenever state or key changes
    useEffect(() => {
        try {
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(storedValue));
            }
        } catch (error) {
            console.error("Error writing to localStorage", error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue] as const;
}
