import type { DashboardPayload, TimeRange } from "@/types/dashboard";

export const dashboardMockByRange: Record<TimeRange, DashboardPayload> = {
  DAY: {
    selectedRange: "DAY",
    metrics: [
      {
        key: "visitors",
        label: "접속자 수",
        value: 184,
        policyText: "중복 사용자를 제외한 단일 사용자 기준",
        compareLabel: "전일 대비",
        compareRate: 4.8,
        compareDirection: "UP"
      },
      {
        key: "inquiries",
        label: "총 문의 수",
        value: 326,
        policyText: "사용자 질문 발생 건 기준 집계",
        compareLabel: "전일 대비",
        compareRate: 2.1,
        compareDirection: "UP"
      },
      {
        key: "failures",
        label: "답변 실패 건",
        value: 4,
        policyText: "실패 응답 발생 건 기준 집계",
        compareLabel: "전일 대비",
        compareRate: 1.2,
        compareDirection: "DOWN"
      }
    ],
    trend: [
      { label: "00", visitors: 12, inquiries: 8 },
      { label: "04", visitors: 18, inquiries: 12 },
      { label: "08", visitors: 56, inquiries: 40 },
      { label: "12", visitors: 73, inquiries: 55 },
      { label: "16", visitors: 92, inquiries: 69 },
      { label: "20", visitors: 75, inquiries: 60 },
      { label: "24", visitors: 41, inquiries: 28 }
    ],
    fixedKeywords: [
      { rank: 1, label: "연말정산", count: 92 },
      { rank: 2, label: "수납", count: 61 },
      { rank: 3, label: "차량등록", count: 44 }
    ],
    fixedFeedbackRatio: {
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
        policyText: "중복 사용자를 제외한 단일 사용자 기준",
        compareLabel: "전주 대비",
        compareRate: 5,
        compareDirection: "UP"
      },
      {
        key: "inquiries",
        label: "총 문의 수",
        value: 1820,
        policyText: "사용자 질문 발생 건 기준 집계",
        compareLabel: "전주 대비",
        compareRate: 3.4,
        compareDirection: "UP"
      },
      {
        key: "failures",
        label: "답변 실패 건",
        value: 19,
        policyText: "실패 응답 발생 건 기준 집계",
        compareLabel: "전주 대비",
        compareRate: 0.8,
        compareDirection: "DOWN"
      }
    ],
    trend: [
      { label: "03.24", visitors: 330, inquiries: 250 },
      { label: "03.25", visitors: 430, inquiries: 320 },
      { label: "03.26", visitors: 500, inquiries: 360 },
      { label: "03.27", visitors: 495, inquiries: 350 },
      { label: "03.28", visitors: 540, inquiries: 410 },
      { label: "03.29", visitors: 642, inquiries: 506 },
      { label: "03.30", visitors: 492, inquiries: 370 }
    ],
    fixedKeywords: [
      { rank: 1, label: "기본급 연말정산", count: 1520 },
      { rank: 2, label: "수납", count: 985 },
      { rank: 3, label: "차량등록", count: 503 }
    ],
    fixedFeedbackRatio: {
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
        policyText: "중복 사용자를 제외한 단일 사용자 기준",
        compareLabel: "전월 대비",
        compareRate: 7.2,
        compareDirection: "UP"
      },
      {
        key: "inquiries",
        label: "총 문의 수",
        value: 8014,
        policyText: "사용자 질문 발생 건 기준 집계",
        compareLabel: "전월 대비",
        compareRate: 4.6,
        compareDirection: "UP"
      },
      {
        key: "failures",
        label: "답변 실패 건",
        value: 83,
        policyText: "실패 응답 발생 건 기준 집계",
        compareLabel: "전월 대비",
        compareRate: 2.4,
        compareDirection: "DOWN"
      }
    ],
    trend: [
      { label: "1주", visitors: 1420, inquiries: 1110 },
      { label: "2주", visitors: 1880, inquiries: 1425 },
      { label: "3주", visitors: 2140, inquiries: 1632 },
      { label: "4주", visitors: 2574, inquiries: 1847 }
    ],
    fixedKeywords: [
      { rank: 1, label: "보안 서비스", count: 3610 },
      { rank: 2, label: "검침", count: 1922 },
      { rank: 3, label: "회원 등록", count: 1316 }
    ],
    fixedFeedbackRatio: {
      positive: 58,
      negative: 42
    }
  }
};

export async function getDashboardData(range: TimeRange = "WEEK"): Promise<DashboardPayload> {
  return dashboardMockByRange[range];
}
