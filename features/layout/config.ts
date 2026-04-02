import type { AdminUser, NavItem, PageMeta } from "@/types/layout";

export const currentUser: AdminUser = {
  id: "chat1004",
  name: "박운영",
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
    description: ""
  },
  "/content": {
    title: "콘텐츠 관리",
    description: "RAG 문서를 등록하고 수정, 삭제, 이력을 관리하는 화면입니다"
  },
  "/knowledge": {
    title: "지식 기반 조회",
    description: "등록된 문서를 기준으로 응답 테스트를 수행하는 화면입니다"
  },
  "/feedback": {
    title: "피드백 관리",
    description: "피드백 목록과 상세 정보를 확인하는 화면입니다"
  },
  "/accounts": {
    title: "계정/권한 관리",
    description: "운영자 계정과 권한 상태를 확인하는 화면입니다"
  }
};
