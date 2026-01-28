import LayoutProvider from "./layout-provider";
import "./globals.css";

export const viewport = {
  interactiveWidget: 'resizes-content' as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
