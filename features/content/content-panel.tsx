"use client";

import { useMemo, useState } from "react";
import { uploadContentDocument } from "@/api/content";
import type {
  ContentDocument,
  ContentDocumentType,
  ContentFilters,
  ContentUploadForm
} from "@/types/content";

type ContentPanelProps = {
  documents: ContentDocument[];
};

const typeOptions: Array<{ label: string; value: ContentDocumentType | "ALL" }> = [
  { label: "전체", value: "ALL" },
  { label: "매뉴얼", value: "MANUAL" },
  { label: "FAQ", value: "FAQ" }
];

const statusLabels: Record<ContentDocument["status"], string> = {
  ACTIVE: "활성",
  PROCESSING: "처리중",
  FAILED: "실패"
};

export function ContentPanel({ documents }: ContentPanelProps) {
  const [filters, setFilters] = useState<ContentFilters>({ keyword: "", type: "ALL" });
  const [localDocuments, setLocalDocuments] = useState(documents);
  const [selectedDocumentId, setSelectedDocumentId] = useState(documents[0]?.id ?? "");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState<ContentUploadForm>({
    fileName: "",
    path: "",
    type: "MANUAL"
  });

  const filteredDocuments = useMemo(() => {
    return localDocuments.filter((document) => {
      const keyword = filters.keyword.trim().toLowerCase();
      const keywordMatch =
        keyword.length < 2 ||
        document.name.toLowerCase().includes(keyword) ||
        document.path.toLowerCase().includes(keyword);
      const typeMatch = filters.type === "ALL" || document.type === filters.type;

      return keywordMatch && typeMatch;
    });
  }, [filters.keyword, filters.type, localDocuments]);

  const selectedDocument =
    filteredDocuments.find((document) => document.id === selectedDocumentId) ??
    filteredDocuments[0] ??
    null;

  const canUpload = uploadForm.fileName.trim().length > 0 && uploadForm.path.trim().length > 0;

  const handleUpload = async () => {
    if (!canUpload) {
      setErrorMessage("파일명과 저장 경로를 입력해 주세요.");
      return;
    }

    const created = await uploadContentDocument(uploadForm);
    setLocalDocuments((current) => [created, ...current]);
    setSelectedDocumentId(created.id);
    setUploadMessage("문서 업로드가 완료되었습니다. 현재 상태는 처리중입니다.");
    setErrorMessage(null);
    setIsUploadOpen(false);
    setUploadForm({ fileName: "", path: "", type: "MANUAL" });
  };

  const handleDelete = () => {
    if (!selectedDocument) return;
    setLocalDocuments((current) => {
      const nextDocuments = current.filter((document) => document.id !== selectedDocument.id);
      setSelectedDocumentId(nextDocuments[0]?.id ?? "");
      return nextDocuments;
    });
    setIsDeleteOpen(false);
    setUploadMessage("문서 삭제가 완료되었습니다.");
  };

  return (
    <div className="content-layout">
      <section className="panel panel--main">
        <div className="panel__header panel__header--compact">
          <div>
            <h2 className="panel__title">문서 목록</h2>
            <p className="panel__caption">등록된 RAG 문서를 검색하고 필터링할 수 있습니다.</p>
          </div>
          <button type="button" className="primary-button" onClick={() => setIsUploadOpen(true)}>
            문서 업로드
          </button>
        </div>

        <div className="content-toolbar">
          <label className="field">
            <span className="field__label">문서명 검색</span>
            <input
              className="field__input"
              type="search"
              value={filters.keyword}
              onChange={(event) =>
                setFilters((current) => ({ ...current, keyword: event.target.value }))
              }
              placeholder="2자 이상 입력"
            />
          </label>

          <label className="field">
            <span className="field__label">문서 유형</span>
            <select
              className="field__input"
              value={filters.type}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  type: event.target.value as ContentDocumentType | "ALL"
                }))
              }
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="content-grid">
          <section className="content-table-card">
            <div className="content-table-scroll">
            <table className="content-table">
              <thead>
                <tr>
                  <th>문서명</th>
                  <th>유형</th>
                  <th>등록자</th>
                  <th>등록일시</th>
                  <th>최종 수정일</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="content-empty">
                      조건에 맞는 문서가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((document) => (
                    <tr
                      key={document.id}
                      className={document.id === selectedDocument?.id ? "is-selected" : ""}
                      onClick={() => setSelectedDocumentId(document.id)}
                    >
                      <td>
                        <div className="content-table__title">{document.name}</div>
                        <div className="content-table__sub">{document.path}</div>
                      </td>
                      <td>{document.type === "MANUAL" ? "매뉴얼" : "FAQ"}</td>
                      <td>{document.author}</td>
                      <td>{document.createdAt}</td>
                      <td>{document.updatedAt}</td>
                      <td>
                        <span className={`status-badge status-badge--${document.status.toLowerCase()}`}>
                          {statusLabels[document.status]}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </section>

          <aside className="content-detail-card">
            {selectedDocument ? (
              <div className="content-detail-scroll">
                <div className="content-detail__header">
                  <div>
                    <h3 className="content-detail__title">{selectedDocument.name}</h3>
                    <p className="content-detail__caption">
                      {selectedDocument.type === "MANUAL" ? "매뉴얼" : "FAQ"} · {selectedDocument.fileName}
                    </p>
                  </div>
                  <span className={`status-badge status-badge--${selectedDocument.status.toLowerCase()}`}>
                    {statusLabels[selectedDocument.status]}
                  </span>
                </div>

                <dl className="content-detail__list">
                  <div>
                    <dt>저장 경로</dt>
                    <dd>{selectedDocument.path}</dd>
                  </div>
                  <div>
                    <dt>등록자</dt>
                    <dd>{selectedDocument.author}</dd>
                  </div>
                  <div>
                    <dt>등록일시</dt>
                    <dd>{selectedDocument.createdAt}</dd>
                  </div>
                  <div>
                    <dt>최종 수정일</dt>
                    <dd>{selectedDocument.updatedAt}</dd>
                  </div>
                  <div>
                    <dt>파일 크기</dt>
                    <dd>{selectedDocument.fileSize}</dd>
                  </div>
                </dl>

                <div className="content-detail-actions">
                  <button type="button" className="secondary-button">
                    원본 보기
                  </button>
                  <button type="button" className="secondary-button">
                    다운로드
                  </button>
                  <button type="button" className="danger-button" onClick={() => setIsDeleteOpen(true)}>
                    삭제
                  </button>
                </div>

                <section className="content-history">
                  <h4>변경 이력</h4>
                  <ul>
                    {selectedDocument.history.map((item) => (
                      <li key={item.id}>
                        <strong>{item.version}</strong>
                        <span>
                          {item.actor} · {item.action} · {item.occurredAt}
                        </span>
                        <p>{item.reason}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            ) : (
              <div className="content-empty content-empty--detail">선택된 문서가 없습니다.</div>
            )}
          </aside>
        </div>

        {uploadMessage ? <p className="content-message">{uploadMessage}</p> : null}
        {errorMessage ? <p className="content-error">{errorMessage}</p> : null}
      </section>

      {isUploadOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsUploadOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="문서 업로드"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal__header">
              <h3>문서 업로드</h3>
              <button type="button" className="icon-button" onClick={() => setIsUploadOpen(false)}>
                ×
              </button>
            </div>

            <div className="modal__body">
              <label className="field">
                <span className="field__label">파일명</span>
                <input
                  className="field__input"
                  value={uploadForm.fileName}
                  onChange={(event) =>
                    setUploadForm((current) => ({ ...current, fileName: event.target.value }))
                  }
                  placeholder="chatbot-guide.pdf"
                />
              </label>
              <label className="field">
                <span className="field__label">저장 경로</span>
                <input
                  className="field__input"
                  value={uploadForm.path}
                  onChange={(event) =>
                    setUploadForm((current) => ({ ...current, path: event.target.value }))
                  }
                  placeholder="/rag/manual/chatbot-guide"
                />
              </label>
              <label className="field">
                <span className="field__label">문서 유형</span>
                <select
                  className="field__input"
                  value={uploadForm.type}
                  onChange={(event) =>
                    setUploadForm((current) => ({
                      ...current,
                      type: event.target.value as ContentDocumentType
                    }))
                  }
                >
                  <option value="MANUAL">매뉴얼</option>
                  <option value="FAQ">FAQ</option>
                </select>
              </label>
            </div>

            <div className="modal__footer">
              <button type="button" className="secondary-button" onClick={() => setIsUploadOpen(false)}>
                취소
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={handleUpload}
                disabled={!canUpload}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isDeleteOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsDeleteOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="문서 삭제 확인"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal__header">
              <h3>문서 삭제 확인</h3>
              <button type="button" className="icon-button" onClick={() => setIsDeleteOpen(false)}>
                ×
              </button>
            </div>
            <div className="modal__body">
              <p className="content-confirm">
                문서를 삭제하면 목록에서 제거됩니다. 이 동작은 되돌릴 수 없습니다.
              </p>
            </div>
            <div className="modal__footer">
              <button type="button" className="secondary-button" onClick={() => setIsDeleteOpen(false)}>
                취소
              </button>
              <button type="button" className="danger-button" onClick={handleDelete}>
                삭제
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
