import type { AdminUser, NavItem, PageMeta } from "@/types/layout";

export const currentUser: AdminUser = {
  id: "chat1004",
  name: "박은영",
  role: "MASTER",
  department: "운영 관리자"
};

export const navItems: NavItem[] = [
  {
    key: "dashboard",
    label: "대시보드",
    href: "/",
    roles: ["MASTER", "OPERATOR"]
  },
  {
    key: "content",
    label: "콘텐츠 관리",
    href: "/content",
    roles: ["MASTER"]
  },
  {
    key: "knowledge",
    label: "지식 기반 조회",
    href: "/knowledge",
    roles: ["MASTER"]
  },
  {
    key: "feedback",
    label: "피드백 관리",
    href: "/feedback",
    roles: ["MASTER", "OPERATOR"]
  },
  {
    key: "accounts",
    label: "계정/권한 관리",
    href: "/accounts",
    roles: ["MASTER"]
  }
];

export const pageMetaByPath: Record<string, PageMeta> = {
  "/": {
    title: "대시보드",
    description: "접속자 수와 질문 추이를 확인할 수 있어요"
  },
  "/content": {
    title: "콘텐츠 관리",
    description: "상세 기능정의가 필요한 화면입니다"
  },
  "/knowledge": {
    title: "지식 기반 조회",
    description: "상세 기능정의가 필요한 화면입니다"
  },
  "/feedback": {
    title: "피드백 관리",
    description: "상세 기능정의가 필요한 화면입니다"
  },
  "/accounts": {
    title: "계정/권한 관리",
    description: "상세 기능정의가 필요한 화면입니다"
  }
};
