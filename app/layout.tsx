import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopAdmin - E-commerce Dashboard",
  description: "Admin dashboard for managing your e-commerce store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: "#1e293b", color: "#f1f5f9", border: "1px solid #334155" },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}