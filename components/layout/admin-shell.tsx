"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/features/layout/sidebar";
import { TopHeader } from "@/features/layout/top-header";
import { pageMetaByPath } from "@/features/layout/config";

export function AdminShell({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const pageMeta = pageMetaByPath[pathname] ?? pageMetaByPath["/"];

  return (
    <div className="admin-shell">
      <Sidebar pathname={pathname} />
      <div className="admin-shell__main">
        <TopHeader title={pageMeta.title} description={pageMeta.description} />
        <main className="admin-shell__content">{children}</main>
      </div>
    </div>
  );
}
