import 'bootstrap/dist/css/bootstrap.min.css';

// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/MainLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TaskFlow Pro - Management System",
  description: "Professional Task Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}