'use client'
import { ThemeProvider } from 'next-themes'
import { type ThemeProviderProps } from "next-themes/dist/types";

// export const ThemeModeLocalStorageKey = "theme-mode";

export default function Providers({ children, ...props }: ThemeProviderProps) {
    return <ThemeProvider {...props}>{children}</ThemeProvider>
}