import { getKnowledgeInitialData } from "@/api/knowledge";
import { KnowledgePanel } from "@/features/knowledge/knowledge-panel";

export async function KnowledgePage() {
  const { dataSources, documents, testHistories } = await getKnowledgeInitialData();

  return (
    <KnowledgePanel
      dataSources={dataSources}
      documents={documents}
      testHistories={testHistories}
    />
  );
}
