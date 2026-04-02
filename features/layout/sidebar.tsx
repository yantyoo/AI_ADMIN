"use client";

import Link from "next/link";
import { currentUser, navItems } from "@/features/layout/config";

type SidebarProps = {
  pathname: string;
};

export function Sidebar({ pathname }: SidebarProps) {
  const visibleItems = navItems.filter((item) => item.roles.includes(currentUser.role));

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">XpERP</div>
        <div className="sidebar__badge">AI 챗봇 관리자</div>
      </div>

      <nav className="sidebar__nav" aria-label="주 메뉴">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`sidebar__nav-item${isActive ? " is-active" : ""}`}
            >
              <span className="sidebar__nav-icon" aria-hidden="true">
                {item.key.slice(0, 1).toUpperCase()}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar__user">
        <div className="sidebar__user-name">
          {currentUser.name} ({currentUser.id})
        </div>
        <div className="sidebar__user-role">{currentUser.department}</div>
      </div>
    </aside>
  );
}
