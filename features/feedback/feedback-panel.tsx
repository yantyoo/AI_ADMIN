"use client";

import { useState, useMemo } from "react";
import type { FeedbackDetail, FeedbackFilters, FeedbackReaction } from "@/types/feedback";

type FeedbackPanelProps = {
  feedbacks: FeedbackDetail[];
};

const reactionLabels: Record<FeedbackReaction, string> = {
  POSITIVE: "좋아요",
  NEGATIVE: "아쉬워요",
};

const filterOptions: Array<{ label: string; value: FeedbackFilters["reaction"] }> = [
  { label: "전체", value: "ALL" },
  { label: "좋아요", value: "POSITIVE" },
  { label: "아쉬워요", value: "NEGATIVE" },
];

export function FeedbackPanel({ feedbacks }: FeedbackPanelProps) {
  const [filters, setFilters] = useState<FeedbackFilters>({ reaction: "ALL" });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filters.reaction === "ALL") return feedbacks;
    return feedbacks.filter((f) => f.reaction === filters.reaction);
  }, [feedbacks, filters.reaction]);

  const selected = feedbacks.find((f) => f.id === selectedId) ?? null;

  return (
    <div className="feedback-layout">
      {/* 전체 피드백 수 - FS-086 */}
      <div className="feedback-stat-bar">
        <div className="metric-card feedback-stat-card">
          <p className="metric-card__label">전체 피드백</p>
          <p className="metric-card__value">{feedbacks.length}</p>
        </div>
      </div>

      <div className="feedback-grid">
        {/* 피드백 목록 */}
        <section className="feedback-list-card">
          {/* 필터 - FS-087 */}
          <div className="feedback-filters">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`feedback-filter__button${filters.reaction === opt.value ? " is-active" : ""}`}
                onClick={() => setFilters({ reaction: opt.value })}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* 목록 테이블 - FS-088 */}
          <div className="feedback-list-scroll">
          <table className="content-table">
            <thead>
              <tr>
                <th>등록일시</th>
                <th>단지명</th>
                <th>사용자</th>
                <th>반응</th>
                <th>부정 사유</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="content-empty">
                    조건에 맞는 피드백이 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((fb) => (
                  <tr
                    key={fb.id}
                    className={fb.id === selectedId ? "is-selected" : ""}
                    onClick={() => setSelectedId(fb.id)}
                  >
                    <td>{fb.createdAt}</td>
                    <td>{fb.complexName}</td>
                    <td>{fb.userId}</td>
                    <td>
                      <span
                        className={`feedback-reaction-badge feedback-reaction-badge--${fb.reaction.toLowerCase()}`}
                      >
                        {reactionLabels[fb.reaction]}
                      </span>
                    </td>
                    <td>{fb.hasNegativeReason ? "있음" : "-"}</td>
                    <td>
                      <button
                        type="button"
                        className="secondary-button table-btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(fb.id);
                        }}
                      >
                        상세
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </section>

        {/* 피드백 상세 - FS-092, FS-093, FS-094 */}
        <aside className="feedback-detail-card">
          {selected === null ? (
            <div className="content-empty content-empty--detail">
              피드백을 선택하면 상세 정보가 표시됩니다.
            </div>
          ) : (
            <div className="feedback-detail-scroll">
              <div className="content-detail__header">
                <div>
                  <h3 className="content-detail__title">{selected.complexName}</h3>
                  <p className="content-detail__caption">
                    {selected.userId} · {selected.createdAt}
                  </p>
                </div>
                <span
                  className={`feedback-reaction-badge feedback-reaction-badge--${selected.reaction.toLowerCase()}`}
                >
                  {reactionLabels[selected.reaction]}
                </span>
              </div>

              {selected.reaction === "NEGATIVE" && selected.negativeReason && (
                <div className="feedback-negative-reason">
                  <strong>부정 사유</strong>
                  <p>{selected.negativeReason}</p>
                </div>
              )}

              <div className="feedback-conversation-section">
                <p className="feedback-conversation-label">관련 대화</p>
                <div className="feedback-conversation">
                  {selected.conversation.map((turn, i) => (
                    <div
                      key={i}
                      className={`feedback-conversation__turn feedback-conversation__turn--${turn.speaker.toLowerCase()}`}
                    >
                      <p className="feedback-conversation__speaker">
                        {turn.speaker === "USER" ? "사용자" : "챗봇"} · {turn.sentAt}
                      </p>
                      <p className="feedback-conversation__message">{turn.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
