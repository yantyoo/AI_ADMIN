import type { DashboardPayload, TimeRange } from "@/types/dashboard";

export const dashboardMockByRange: Record<TimeRange, DashboardPayload> = {
  DAY: {
    selectedRange: "DAY",
    metrics: [
      {
        key: "visitors",
        label: "접속자 수",
        value: 184,
        policyText: "중복 사용자 제거, 단일 사용자 기준"
      },
      {
        key: "inquiries",
        label: "총 문의 수",
        value: 326,
        policyText: "사용자 질문 발생 건 기준 집계"
      },
      {
        key: "failures",
        label: "답변 실패 건",
        value: 4,
        policyText: "실패 응답 발생 건 기준 집계"
      }
    ],
    trend: [
      { label: "00", value: 12 },
      { label: "04", value: 18 },
      { label: "08", value: 56 },
      { label: "12", value: 73 },
      { label: "16", value: 92 },
      { label: "20", value: 75 },
      { label: "24", value: 41 }
    ],
    knowledgeResponse: {
      knowledge: 68,
      general: 32
    },
    topKeywords: [
      { rank: 1, label: "연말정산", count: 92 },
      { rank: 2, label: "수납", count: 61 },
      { rank: 3, label: "차량등록", count: 44 }
    ],
    feedbackRatio: {
      positive: 62,
      negative: 38
    }
  },
  WEEK: {
    selectedRange: "WEEK",
    metrics: [
      {
        key: "visitors",
        label: "접속자 수",
        value: 1051,
        policyText: "중복 사용자 제거, 단일 사용자 기준"
      },
      {
        key: "inquiries",
        label: "총 문의 수",
        value: 1820,
        policyText: "사용자 질문 발생 건 기준 집계"
      },
      {
        key: "failures",
        label: "답변 실패 건",
        value: 19,
        policyText: "실패 응답 발생 건 기준 집계"
      }
    ],
    trend: [
      { label: "03.24", value: 330 },
      { label: "03.25", value: 430 },
      { label: "03.26", value: 500 },
      { label: "03.27", value: 495 },
      { label: "03.28", value: 540 },
      { label: "03.29", value: 642 },
      { label: "03.30", value: 492 }
    ],
    knowledgeResponse: {
      knowledge: 55,
      general: 45
    },
    topKeywords: [
      { rank: 1, label: "기부금 연말정산", count: 1520 },
      { rank: 2, label: "수납", count: 985 },
      { rank: 3, label: "차량등록", count: 503 }
    ],
    feedbackRatio: {
      positive: 55,
      negative: 45
    }
  },
  MONTH: {
    selectedRange: "MONTH",
    metrics: [
      {
        key: "visitors",
        label: "접속자 수",
        value: 4216,
        policyText: "중복 사용자 제거, 단일 사용자 기준"
      },
      {
        key: "inquiries",
        label: "총 문의 수",
        value: 8014,
        policyText: "사용자 질문 발생 건 기준 집계"
      },
      {
        key: "failures",
        label: "답변 실패 건",
        value: 83,
        policyText: "실패 응답 발생 건 기준 집계"
      }
    ],
    trend: [
      { label: "1주", value: 1420 },
      { label: "2주", value: 1880 },
      { label: "3주", value: 2140 },
      { label: "4주", value: 2574 }
    ],
    knowledgeResponse: {
      knowledge: 61,
      general: 39
    },
    topKeywords: [
      { rank: 1, label: "복지 서비스", count: 3610 },
      { rank: 2, label: "검침", count: 1922 },
      { rank: 3, label: "회원 등록", count: 1316 }
    ],
    feedbackRatio: {
      positive: 58,
      negative: 42
    }
  }
};

export async function getDashboardData(
  range: TimeRange = "WEEK"
): Promise<DashboardPayload> {
  return dashboardMockByRange[range];
}
