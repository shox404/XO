"use client";

import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export default function LayoutProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
            {children}
            <Toaster richColors />
            <Analytics />
        </ThemeProvider>
    );
}
