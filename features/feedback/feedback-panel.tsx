"use client";

import { useMemo, useState } from "react";
import type { FeedbackDetail, FeedbackFilters, FeedbackReaction } from "@/types/feedback";

type FeedbackPanelProps = {
  feedbacks: FeedbackDetail[];
};

type DateRangeFilter = {
  startDate: string;
  endDate: string;
};

const reactionLabels: Record<FeedbackReaction, string> = {
  POSITIVE: "긍정",
  NEGATIVE: "부정"
};

const filterOptions: Array<{ label: string; value: FeedbackFilters["reaction"] }> = [
  { label: "전체", value: "ALL" },
  { label: "긍정", value: "POSITIVE" },
  { label: "부정", value: "NEGATIVE" }
];

const toDate = (value: string) => new Date(value.replace(" ", "T"));

const startOfDayIso = (value: string) => `${value}T00:00:00`;

const endOfDayIso = (value: string) => `${value}T23:59:59.999`;

const compareFeedbackDesc = (left: FeedbackDetail, right: FeedbackDetail) =>
  right.createdAt.localeCompare(left.createdAt);

const isWithinDateRange = (value: string, range: DateRangeFilter) => {
  if (!range.startDate && !range.endDate) {
    return true;
  }

  const dateValue = toDate(value).getTime();
  const startValue = range.startDate ? toDate(startOfDayIso(range.startDate)).getTime() : null;
  const endValue = range.endDate ? toDate(endOfDayIso(range.endDate)).getTime() : null;

  if (startValue !== null && endValue !== null && startValue > endValue) {
    return dateValue >= endValue && dateValue <= startValue;
  }

  if (startValue !== null && dateValue < startValue) {
    return false;
  }

  if (endValue !== null && dateValue > endValue) {
    return false;
  }

  return true;
};

export function FeedbackPanel({ feedbacks }: FeedbackPanelProps) {
  const [filters, setFilters] = useState<FeedbackFilters>({ reaction: "ALL" });
  const [dateRange, setDateRange] = useState<DateRangeFilter>({ startDate: "", endDate: "" });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return feedbacks
      .filter((feedback) => filters.reaction === "ALL" || feedback.reaction === filters.reaction)
      .filter((feedback) => isWithinDateRange(feedback.createdAt, dateRange))
      .slice()
      .sort(compareFeedbackDesc);
  }, [dateRange, feedbacks, filters.reaction]);

  const selected = filtered.find((feedback) => feedback.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div className="feedback-layout">
      <div className="feedback-grid">
        <section className="feedback-list-card">
          <div className="feedback-list-header">
            <h2 className="content-section-title">피드백 목록</h2>
            <div className="feedback-filter-row">
              <div className="feedback-filters__tabs">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`feedback-filter__button${
                      filters.reaction === option.value ? " is-active" : ""
                    }`}
                    onClick={() => setFilters({ reaction: option.value })}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="feedback-range-bar">
                <div className="feedback-range-actions">
                  <div className="feedback-range-field">
                    <label className="field__label" htmlFor="feedback-range-start">
                      시작일
                    </label>
                    <input
                      id="feedback-range-start"
                      type="date"
                      className="field__input feedback-range-input"
                      value={dateRange.startDate}
                      onChange={(event) =>
                        setDateRange((current) => ({ ...current, startDate: event.target.value }))
                      }
                    />
                  </div>

                  <span className="feedback-range-divider" aria-hidden="true">
                    ~
                  </span>

                  <div className="feedback-range-field">
                    <label className="field__label" htmlFor="feedback-range-end">
                      종료일
                    </label>
                    <input
                      id="feedback-range-end"
                      type="date"
                      className="field__input feedback-range-input"
                      value={dateRange.endDate}
                      onChange={(event) =>
                        setDateRange((current) => ({ ...current, endDate: event.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="feedback-list-scroll">
            <table className="content-table">
              <thead>
                <tr>
                  <th>작성일시</th>
                  <th>고객명</th>
                  <th>사용자</th>
                  <th>반응</th>
                  <th>부정사유</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="content-empty">
                      조건에 맞는 피드백이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.id}
                      className={item.id === selected?.id ? "is-selected" : ""}
                      onClick={() => setSelectedId(item.id)}
                    >
                      <td>{item.createdAt}</td>
                      <td>{item.complexName}</td>
                      <td>{item.userId}</td>
                      <td>
                        <span
                          className={`feedback-reaction-badge feedback-reaction-badge--${item.reaction.toLowerCase()}`}
                        >
                          {reactionLabels[item.reaction]}
                        </span>
                      </td>
                      <td>{item.hasNegativeReason ? "있음" : "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

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
                  <strong>부정사유</strong>
                  <p>{selected.negativeReason}</p>
                </div>
              )}

              <div className="feedback-conversation-section">
                <p className="feedback-conversation-label">대화 내용</p>
                <div className="feedback-conversation">
                  {selected.conversation.map((turn, index) => (
                    <div
                      key={index}
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
