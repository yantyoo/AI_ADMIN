import type {
  KnowledgeDataSource,
  KnowledgeDocument,
  KnowledgeQueryForm,
  KnowledgeResult,
  KnowledgeTestHistory,
} from "@/types/knowledge";

const dataSources: KnowledgeDataSource[] = [
  { id: "ds-001", name: "XpERP 매뉴얼 DB", type: "MANUAL" },
  { id: "ds-002", name: "업무 프로세스 DB", type: "MANUAL" },
  { id: "ds-003", name: "공통 FAQ DB", type: "FAQ" },
  { id: "ds-004", name: "수납 FAQ DB", type: "FAQ" },
];

const documents: KnowledgeDocument[] = [
  {
    id: "kdoc-001",
    name: "챗봇 운영 매뉴얼",
    type: "MANUAL",
    dataSourceId: "ds-001",
    path: "/rag/manual/chatbot-operations",
  },
  {
    id: "kdoc-002",
    name: "수납 안내서",
    type: "MANUAL",
    dataSourceId: "ds-002",
    path: "/rag/manual/payment-guide",
  },
  {
    id: "kdoc-003",
    name: "FAQ 응답 모음",
    type: "FAQ",
    dataSourceId: "ds-003",
    path: "/rag/faq/common-questions",
  },
  {
    id: "kdoc-004",
    name: "차량등록 FAQ",
    type: "FAQ",
    dataSourceId: "ds-004",
    path: "/rag/faq/vehicle-registration",
  },
];

const testHistories: KnowledgeTestHistory[] = [
  {
    id: "th-001",
    question: "수납 방법이 어떻게 되나요?",
    documentName: "수납 안내서",
    documentType: "MANUAL",
    executedAt: "2026-04-01 11:20",
    verdict: "PASS",
  },
  {
    id: "th-002",
    question: "차량 등록 절차를 알려주세요",
    documentName: "차량등록 FAQ",
    documentType: "FAQ",
    executedAt: "2026-04-01 13:45",
    verdict: "FAIL",
  },
  {
    id: "th-003",
    question: "챗봇 응답 설정은 어디서 하나요?",
    documentName: "챗봇 운영 매뉴얼",
    documentType: "MANUAL",
    executedAt: "2026-04-02 09:10",
    verdict: null,
  },
];

export async function getKnowledgeInitialData(): Promise<{
  dataSources: KnowledgeDataSource[];
  documents: KnowledgeDocument[];
  testHistories: KnowledgeTestHistory[];
}> {
  return { dataSources, documents, testHistories };
}

export async function executeKnowledgeQuery(
  form: KnowledgeQueryForm
): Promise<KnowledgeResult | null> {
  const doc = documents.find((d) => d.id === form.documentId);
  if (!doc) return null;

  return {
    answer: `"${form.question}"에 대한 응답입니다.\n\n선택하신 문서(${doc.name})를 기반으로 관련 내용을 검색한 결과, 해당 내용에 대한 응답이 생성되었습니다. 실제 API 연동 후 정확한 응답이 제공됩니다.`,
    generatedAt: "2026-04-02 10:30:00",
    referenceDocument: {
      name: doc.name,
      type: doc.type,
      path: doc.path,
    },
    referenceParagraph: "chunk-042",
  };
}
