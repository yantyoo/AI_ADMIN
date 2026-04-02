import type { Metadata } from "next";
import { AdminShell } from "@/components/layout/admin-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "XpERP AI 챗봇 관리자",
  description: "XpERP 챗봇 어드민"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
