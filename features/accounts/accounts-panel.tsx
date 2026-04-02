"use client";

import { useState, useMemo } from "react";
import type { AccountDetail, AccountStatus, UserCandidate } from "@/types/accounts";
import { userCandidates as allCandidates } from "@/api/accounts";

const CURRENT_USER_ID = "chat1004";

type AccountsPanelProps = {
  accounts: AccountDetail[];
};

type ActionModalType = "ACTIVATE" | "DEACTIVATE" | "UNLOCK";

type ActionModal = {
  type: ActionModalType;
  accountId: string;
  reason: string;
} | null;

const statusLabels: Record<AccountDetail["status"], string> = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
  LOCKED: "잠금",
};

const roleLabels: Record<AccountDetail["role"], string> = {
  MASTER: "MASTER",
  OPERATOR: "OPERATOR",
};

const actionTitles: Record<ActionModalType, string> = {
  ACTIVATE: "운영 권한 부여",
  DEACTIVATE: "운영 권한 비활성화",
  UNLOCK: "잠금 해제",
};

export function AccountsPanel({ accounts: initialAccounts }: AccountsPanelProps) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<ActionModal>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addReason, setAddReason] = useState("");
  const [addSearch, setAddSearch] = useState("");
  const [addSelectedCandidate, setAddSelectedCandidate] = useState<UserCandidate | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const stats = useMemo(
    () => ({
      total: accounts.filter((a) => a.status === "ACTIVE").length,
      masters: accounts.filter((a) => a.role === "MASTER" && a.status === "ACTIVE").length,
      operators: accounts.filter((a) => a.role === "OPERATOR" && a.status === "ACTIVE").length,
      inactive: accounts.filter((a) => a.status !== "ACTIVE").length,
    }),
    [accounts]
  );

  const selected = accounts.find((a) => a.id === selectedId) ?? null;

  const filteredCandidates = useMemo(() => {
    const kw = addSearch.trim().toLowerCase();
    if (!kw) return allCandidates;
    return allCandidates.filter(
      (c) =>
        c.name.toLowerCase().includes(kw) ||
        c.id.toLowerCase().includes(kw) ||
        c.complexCode.toLowerCase().includes(kw)
    );
  }, [addSearch]);

  const showMessage = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const applyStatus = (accountId: string, status: AccountStatus) => {
    setAccounts((prev) => prev.map((a) => (a.id === accountId ? { ...a, status } : a)));
    setSelectedId(accountId);
  };

  const handleActionConfirm = () => {
    if (!actionModal) return;
    const { type, accountId } = actionModal;
    if (type === "ACTIVATE") {
      applyStatus(accountId, "ACTIVE");
      showMessage("운영 권한이 부여되었습니다.");
    } else if (type === "DEACTIVATE") {
      applyStatus(accountId, "INACTIVE");
      showMessage("운영 권한이 비활성화되었습니다.");
    } else if (type === "UNLOCK") {
      applyStatus(accountId, "ACTIVE");
      showMessage("계정 잠금이 해제되었습니다.");
    }
    setActionModal(null);
  };

  const handleAddConfirm = () => {
    if (!addSelectedCandidate) return;
    const newAccount: AccountDetail = {
      id: addSelectedCandidate.id,
      name: addSelectedCandidate.name,
      role: "OPERATOR",
      status: "ACTIVE",
      registeredAt: "2026-04-02",
      lastLoginAt: null,
      loginHistory: [],
      lockHistory: [],
    };
    setAccounts((prev) => [...prev, newAccount]);
    closeAddModal();
    showMessage("관리자가 추가되었습니다.");
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setAddReason("");
    setAddSearch("");
    setAddSelectedCandidate(null);
  };

  const isSelf = (id: string) => id === CURRENT_USER_ID;

  const statCards = [
    { label: "전체 운영자", value: stats.total },
    { label: "MASTER", value: stats.masters },
    { label: "OPERATOR", value: stats.operators },
    { label: "비활성/잠금", value: stats.inactive },
  ];

  return (
    <div className="accounts-layout">
      {successMessage && <p className="content-message">{successMessage}</p>}

      {/* 운영자 현황 - FS-095~098 */}
      <div className="accounts-stat-grid">
        {statCards.map((card) => (
          <div key={card.label} className="metric-card">
            <p className="metric-card__label">{card.label}</p>
            <p className="metric-card__value">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="accounts-grid">
        {/* 관리자 목록 - FS-099, FS-100 */}
        <section className="accounts-list-card">
          <div className="panel__header panel__header--compact">
            <h2 className="panel__title">관리자 목록</h2>
            <button
              type="button"
              className="primary-button"
              onClick={() => setAddModalOpen(true)}
            >
              관리자 추가
            </button>
          </div>

          <table className="content-table knowledge-history-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>아이디</th>
                <th>권한</th>
                <th>상태</th>
                <th>최근 로그인</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr
                  key={acc.id}
                  className={acc.id === selectedId ? "is-selected" : ""}
                  onClick={() => setSelectedId(acc.id)}
                >
                  <td>
                    <div className="content-table__title">{acc.name}</div>
                    {isSelf(acc.id) && <div className="content-table__sub">본인</div>}
                  </td>
                  <td>{acc.id}</td>
                  <td>
                    <span
                      className={`status-badge ${acc.role === "MASTER" ? "status-badge--active" : "status-badge--processing"}`}
                    >
                      {roleLabels[acc.role]}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-badge--${acc.status.toLowerCase()}`}>
                      {statusLabels[acc.status]}
                    </span>
                  </td>
                  <td>{acc.lastLoginAt ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 계정 상세 - FS-106~114 */}
        <aside className="accounts-detail-card">
          {selected === null ? (
            <div className="content-empty content-empty--detail">
              계정을 선택하면 상세 정보가 표시됩니다.
            </div>
          ) : (
            <>
              <div className="content-detail__header">
                <div>
                  <h3 className="content-detail__title">{selected.name}</h3>
                  <p className="content-detail__caption">
                    {selected.id} · {roleLabels[selected.role]}
                  </p>
                </div>
                <span className={`status-badge status-badge--${selected.status.toLowerCase()}`}>
                  {statusLabels[selected.status]}
                </span>
              </div>

              <dl className="content-detail__list">
                <div>
                  <dt>등록일</dt>
                  <dd>{selected.registeredAt}</dd>
                </div>
                <div>
                  <dt>최근 로그인</dt>
                  <dd>{selected.lastLoginAt ?? "-"}</dd>
                </div>
              </dl>

              {/* 액션 버튼 - FS-109~113 */}
              {!isSelf(selected.id) ? (
                <div className="accounts-action-row">
                  {selected.status === "INACTIVE" && (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() =>
                        setActionModal({ type: "ACTIVATE", accountId: selected.id, reason: "" })
                      }
                    >
                      권한 부여
                    </button>
                  )}
                  {selected.status === "ACTIVE" && selected.role === "OPERATOR" && (
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() =>
                        setActionModal({ type: "DEACTIVATE", accountId: selected.id, reason: "" })
                      }
                    >
                      권한 비활성화
                    </button>
                  )}
                  {selected.status === "LOCKED" && (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() =>
                        setActionModal({ type: "UNLOCK", accountId: selected.id, reason: "" })
                      }
                    >
                      잠금 해제
                    </button>
                  )}
                </div>
              ) : (
                <p className="accounts-self-notice">
                  본인 계정은 권한 변경 및 비활성화가 제한됩니다.
                </p>
              )}

              {/* 로그인 이력 - FS-107 */}
              <div className="accounts-history">
                <h4>로그인 이력</h4>
                {selected.loginHistory.length === 0 ? (
                  <p className="accounts-history-empty">이력이 없습니다.</p>
                ) : (
                  <ul className="accounts-history-list">
                    {selected.loginHistory.map((lh) => (
                      <li key={lh.id}>
                        <strong>{lh.occurredAt}</strong>
                        {lh.success ? (
                          <span className="accounts-login-success">성공</span>
                        ) : (
                          <span className="accounts-login-fail">실패</span>
                        )}
                        <span className="accounts-history-ip">{lh.ip}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 잠금/해제 이력 - FS-108 */}
              {selected.lockHistory.length > 0 && (
                <div className="accounts-history">
                  <h4>잠금/해제 이력</h4>
                  <ul className="accounts-history-list">
                    {selected.lockHistory.map((lkh) => (
                      <li key={lkh.id}>
                        <strong>{lkh.occurredAt}</strong>
                        <span
                          className={
                            lkh.type === "LOCKED"
                              ? "accounts-history-status--lock"
                              : "accounts-history-status--unlock"
                          }
                        >
                          {lkh.type === "LOCKED" ? "잠금" : "해제"}
                        </span>
                        <p className="accounts-history-sub">
                          {lkh.reason} · 수행자: {lkh.actor}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </aside>
      </div>

      {/* 액션 모달 - FS-112, FS-114 */}
      {actionModal && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setActionModal(null)}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={actionTitles[actionModal.type]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header">
              <h3>{actionTitles[actionModal.type]}</h3>
              <button type="button" className="icon-button" onClick={() => setActionModal(null)}>
                ×
              </button>
            </div>
            <div className="modal__body">
              <label className="field">
                <span className="field__label">사유 입력 *</span>
                <textarea
                  className="field__input knowledge-textarea"
                  rows={3}
                  value={actionModal.reason}
                  placeholder="사유를 입력하세요"
                  onChange={(e) => setActionModal({ ...actionModal, reason: e.target.value })}
                />
              </label>
            </div>
            <div className="modal__footer">
              <button type="button" className="secondary-button" onClick={() => setActionModal(null)}>
                취소
              </button>
              <button
                type="button"
                className={actionModal.type === "DEACTIVATE" ? "danger-button" : "primary-button"}
                disabled={!actionModal.reason.trim()}
                onClick={handleActionConfirm}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 관리자 추가 모달 - FS-100~105 */}
      {addModalOpen && (
        <div className="modal-backdrop" role="presentation" onClick={closeAddModal}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="관리자 추가"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header">
              <h3>관리자 추가</h3>
              <button type="button" className="icon-button" onClick={closeAddModal}>
                ×
              </button>
            </div>

            <div className="modal__body">
              <label className="field">
                <span className="field__label">사용자 검색 (이름, 아이디, 단지코드)</span>
                <input
                  className="field__input"
                  value={addSearch}
                  placeholder="검색어 입력"
                  onChange={(e) => setAddSearch(e.target.value)}
                />
              </label>

              <ul className="user-candidate-list">
                {filteredCandidates.length === 0 ? (
                  <li className="user-candidate-empty">검색 결과가 없습니다.</li>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <li key={candidate.id}>
                      <button
                        type="button"
                        className={`user-candidate-item${addSelectedCandidate?.id === candidate.id ? " is-selected" : ""}`}
                        onClick={() => setAddSelectedCandidate(candidate)}
                      >
                        <span>
                          {candidate.name} ({candidate.id})
                        </span>
                        <span className="user-candidate-code">{candidate.complexCode}</span>
                      </button>
                    </li>
                  ))
                )}
              </ul>

              <label className="field">
                <span className="field__label">추가 사유 * (최대 200자)</span>
                <textarea
                  className="field__input knowledge-textarea"
                  rows={2}
                  maxLength={200}
                  value={addReason}
                  placeholder="추가 사유를 입력하세요"
                  onChange={(e) => setAddReason(e.target.value)}
                />
              </label>
            </div>

            <div className="modal__footer">
              <button type="button" className="secondary-button" onClick={closeAddModal}>
                취소
              </button>
              <button
                type="button"
                className="primary-button"
                disabled={!addSelectedCandidate || !addReason.trim()}
                onClick={handleAddConfirm}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
