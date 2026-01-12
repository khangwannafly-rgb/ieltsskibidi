import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/components/theme-provider";
import ClientLayout from "@/components/ClientLayout";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin", "vietnamese"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "IELTS SKIBIDI - Professional Platform",
  description: "Master IELTS with AI-powered feedback",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${jakartaSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900 transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <UserProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
