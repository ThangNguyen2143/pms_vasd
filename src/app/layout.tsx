/* eslint-disable @next/next/no-sync-scripts */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { siteConfig } from "~/config/site";
import { UserProvider } from "~/providers/user-context";
import "~/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteConfig.title}`,
    default: siteConfig.title,
  },
  keywords: ["PMS", "PMS VASD", "VASD", "Quản lý dự án"],
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>{children}</UserProvider>
        <Toaster position="top-right" richColors />
        <script src="https://cdn.jsdelivr.net/npm/frappe-gantt/dist/frappe-gantt.umd.js"></script>
        <script src="/scripts/theme-loader.js" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/frappe-gantt/dist/frappe-gantt.css"
        />
        <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
      </body>
    </html>
  );
}
