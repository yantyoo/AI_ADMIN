"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ModalPortal } from "@/components/ui/modal-portal";
import {
  AUTH_OTP_FAILURES_KEY,
  AUTH_OTP_LOCKED_KEY,
  AUTH_PROFILE_KEY,
  AUTH_STAGE_KEY,
  AUTH_USER_KEY,
  storeAuthProfile
} from "@/features/layout/session";

type AuthFormState = {
  userId: string;
  password: string;
  otp: string;
};

type NoticeModalState = {
  title: string;
  message: string;
} | null;

const OTP_CODE = "123456";
const OTP_MAX_FAILURES = 5;

const INVALID_CREDENTIALS_NOTICE = {
  title: "로그인 오류",
  message: "아이디 또는 비밀번호가 올바르지 않습니다.\n다시 확인해 주세요."
};

const UNAUTHORIZED_NOTICE = {
  title: "권한 없음",
  message: "권한이 없는 사용자입니다.\n관리자에게 권한을 요청해 주세요."
};

const OTP_LOCKED_NOTICE = {
  title: "OTP 잠금",
  message: "OTP 오류로 잠금된 아이디 입니다.\n관리자에게 문의하세요."
};

type MockAuthAccount = {
  password: string;
  profile: {
    userId: string;
    id: string;
    name: string;
    role: "MASTER" | "OPERATOR";
    department: string;
  };
  allowed: boolean;
};

const MOCK_AUTH_ACCOUNTS: Record<string, MockAuthAccount> = {
  test0000: {
    password: "1234",
    profile: {
      userId: "test0000",
      id: "chat1004",
      name: "박승준",
      role: "MASTER",
      department: "운영 관리자"
    },
    allowed: true
  },
  test1111: {
    password: "1234",
    profile: {
      userId: "test1111",
      id: "op2031",
      name: "권태영",
      role: "OPERATOR",
      department: "운영 담당"
    },
    allowed: true
  },
  blocked0000: {
    password: "1234",
    profile: {
      userId: "blocked0000",
      id: "op9001",
      name: "차단계정",
      role: "OPERATOR",
      department: "권한 미부여"
    },
    allowed: false
  }
};

const defaultState: AuthFormState = {
  userId: "",
  password: "",
  otp: ""
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const readNumber = (value: string | null) => {
  const parsed = Number(value ?? "0");
  return Number.isFinite(parsed) ? parsed : 0;
};

export function AuthScreen() {
  const router = useRouter();
  const [form, setForm] = useState<AuthFormState>(defaultState);
  const [helper, setHelper] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberId, setRememberId] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpFailures, setOtpFailures] = useState(0);
  const [otpLocked, setOtpLocked] = useState(false);
  const [noticeModal, setNoticeModal] = useState<NoticeModalState>(null);

  const otpMessage = useMemo(() => {
    if (otpLocked) {
      return "OTP 오류로 잠금된 아이디입니다. 관리자에게 문의하세요.";
    }

    if (otpFailures > 0) {
      return `OTP 인증에 실패했습니다. (${otpFailures}/${OTP_MAX_FAILURES})`;
    }

    return "OTP를 입력하면 로그인 절차를 완료합니다.";
  }, [otpFailures, otpLocked]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stage = window.sessionStorage.getItem(AUTH_STAGE_KEY);
    const userId = window.sessionStorage.getItem(AUTH_USER_KEY) ?? window.localStorage.getItem(AUTH_USER_KEY) ?? "";
    const locked = window.sessionStorage.getItem(AUTH_OTP_LOCKED_KEY) === "true";
    const failures = readNumber(window.sessionStorage.getItem(AUTH_OTP_FAILURES_KEY));

    if (stage === "authenticated") {
      router.replace("/dashboard");
      return;
    }

    setForm((current) => ({ ...current, userId }));
    setOtpLocked(locked);
    setOtpFailures(failures);
    setOtpOpen(stage === "otp_pending" && Boolean(userId));
  }, [router]);

  const updateField = (field: keyof AuthFormState) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const openNoticeModal = (notice: { title: string; message: string }) => {
    setNoticeModal(notice);
  };

  const closeNoticeModal = () => {
    setNoticeModal(null);
  };

  const openOtp = () => {
    setOtpOpen(true);
    setError("");
    setHelper("");
    setOtpFailures(0);
    setOtpLocked(false);
  };

  const closeOtp = () => {
    setOtpOpen(false);
    setForm((current) => ({ ...current, otp: "" }));
    setHelper("");
    setError("");
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!form.userId.trim() || !form.password.trim()) {
      setError("?꾩씠?붿? 鍮꾨?踰덊샇瑜??낅젰??二쇱꽭??");
      return;
    }

    const userId = form.userId.trim();
    const password = form.password.trim();
    const account = MOCK_AUTH_ACCOUNTS[userId];

    if (!account || account.password !== password) {
      openNoticeModal(INVALID_CREDENTIALS_NOTICE);
      return;
    }

    if (!account.allowed) {
      openNoticeModal(UNAUTHORIZED_NOTICE);
      return;
    }

    setLoading(true);
    setHelper("OTP ?낅젰 李쎌쓣 ?щ뒗 以묒엯?덈떎.");

    window.sessionStorage.setItem(AUTH_STAGE_KEY, "otp_pending");
    window.sessionStorage.setItem(AUTH_USER_KEY, userId);
    window.sessionStorage.setItem(AUTH_OTP_FAILURES_KEY, "0");
    window.sessionStorage.removeItem(AUTH_OTP_LOCKED_KEY);

    if (rememberId) {
      window.localStorage.setItem(AUTH_USER_KEY, userId);
    } else {
      window.localStorage.removeItem(AUTH_USER_KEY);
    }

    await sleep(250);
    setLoading(false);
    openOtp();
  };

  const handleOtpSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading || !otpOpen) {
      return;
    }

    if (otpLocked) {
      openNoticeModal(OTP_LOCKED_NOTICE);
      return;
    }

    if (form.otp.trim().length !== 6) {
      setError("6?먮━ OTP瑜??낅젰??二쇱꽭??");
      return;
    }

    setLoading(true);

    if (form.otp.trim() !== OTP_CODE) {
      const nextFailures = otpFailures + 1;
      const isLocked = nextFailures >= OTP_MAX_FAILURES;
      setOtpFailures(nextFailures);
      window.sessionStorage.setItem(AUTH_OTP_FAILURES_KEY, String(nextFailures));

      if (isLocked) {
        setOtpLocked(true);
        window.sessionStorage.setItem(AUTH_OTP_LOCKED_KEY, "true");
        openNoticeModal(OTP_LOCKED_NOTICE);
      } else {
        setError(`OTP ?몄쬆???ㅽ뙣?덉뒿?덈떎. (${nextFailures}/${OTP_MAX_FAILURES})`);
      }

      setLoading(false);
      return;
    }

    const account = MOCK_AUTH_ACCOUNTS[form.userId.trim()];
    const profile =
      account?.profile ?? {
        userId: form.userId.trim(),
        id: form.userId.trim(),
        name: form.userId.trim(),
        role: "MASTER",
        department: "?댁쁺 愿由ъ옄"
      };

    storeAuthProfile(profile, rememberId);
    window.sessionStorage.setItem(AUTH_STAGE_KEY, "authenticated");
    window.sessionStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(profile));
    window.sessionStorage.removeItem(AUTH_OTP_FAILURES_KEY);
    window.sessionStorage.removeItem(AUTH_OTP_LOCKED_KEY);

    setHelper("??쒕낫?쒕줈 ?대룞?⑸땲??");
    await sleep(250);
    router.replace("/dashboard");
  };

  const isLoginDisabled = loading || !form.userId.trim() || !form.password.trim();
  const isOtpDisabled = loading || otpLocked || form.otp.trim().length !== 6;

  return (
    <main className="auth-shell auth-shell--standalone">
      <section className="auth-card auth-standalone">
        <div className="auth-card__intro auth-standalone__intro">
          <span className="auth-card__badge">Xp도우미</span>
          <h1 className="auth-card__title">Xp도우미 관리자</h1>
          <p className="auth-card__eyebrow">관리자 전용 시스템</p>
          <p className="auth-card__description">
            본 시스템은 내부 관리자 전용입니다.
            <br />
            무단 접근 및 정보 열람 시 관련 법령에 따라 책임이 발생할 수 있습니다.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleLoginSubmit}>
          <div className="auth-form__header">
            <h2 className="auth-form__title">관리자 로그인</h2>
            <p className="auth-form__caption">승인된 계정만 접속 가능합니다.</p>
          </div>

          <div className="auth-form__fields">
            <label className="field auth-field">
              <span className="field__label">아이디</span>
              <input
                className="field__input auth-input"
                value={form.userId}
                onChange={(event) => updateField("userId")(event.target.value)}
                placeholder="예: admin01"
                autoComplete="username"
              />
            </label>

            <label className="field auth-field">
              <span className="field__label">비밀번호</span>
              <input
                type="password"
                className="field__input auth-input"
                value={form.password}
                onChange={(event) => updateField("password")(event.target.value)}
                placeholder="비밀번호 입력"
                autoComplete="current-password"
              />
            </label>

            <label className="auth-remember">
              <input
                type="checkbox"
                checked={rememberId}
                onChange={(event) => setRememberId(event.target.checked)}
              />
              <span>아이디 저장</span>
            </label>
          </div>

          <div className="auth-form__actions">
            <button type="submit" className="primary-button auth-submit" disabled={isLoginDisabled}>
              {loading ? "처리 중..." : "다음"}
            </button>
          </div>

          <div className="auth-form__feedback" aria-live="polite">
            {error ? <p className="auth-error">{error}</p> : null}
            {!error && helper ? <p className="auth-helper">{helper}</p> : null}
          </div>
        </form>
      </section>

      {otpOpen ? (
        <ModalPortal backdropClassName="auth-otp-backdrop" onBackdropClick={closeOtp}>
          <section
            className="modal auth-otp-modal"
            role="dialog"
            aria-modal="true"
            aria-label="OTP 인증"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal__header auth-otp-modal__header">
              <div>
                <h3>OTP 인증</h3>
                <p className="auth-otp-modal__caption">{otpMessage}</p>
              </div>
              <button type="button" className="icon-button" onClick={closeOtp}>
                ×
              </button>
            </div>

            <form className="auth-otp-modal__body" onSubmit={handleOtpSubmit}>
              <label className="field auth-otp-field">
                <span className="field__label">OTP</span>
                <input
                  className="field__input auth-input auth-input--otp"
                  value={form.otp}
                  onChange={(event) => updateField("otp")(event.target.value)}
                  placeholder="6자리 OTP 입력"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  disabled={otpLocked}
                />
              </label>

              <div className="auth-form__feedback" aria-live="polite">
                {error ? <p className="auth-error">{error}</p> : null}
                {!error && helper ? <p className="auth-helper">{helper}</p> : null}
              </div>

              <div className="auth-form__actions auth-otp-modal__actions">
                <button type="button" className="secondary-button auth-cancel" onClick={closeOtp}>
                  이전
                </button>
                <button type="submit" className="primary-button auth-submit" disabled={isOtpDisabled}>
                  {loading ? "처리 중..." : "인증 완료"}
                </button>
              </div>
            </form>
          </section>
        </ModalPortal>
      ) : null}

      {noticeModal ? (
        <ModalPortal backdropClassName="auth-notice-backdrop" onBackdropClick={closeNoticeModal}>
          <section
            className="modal modal--compact auth-notice-modal"
            role="dialog"
            aria-modal="true"
            aria-label={noticeModal.title}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal__header modal__header--tight auth-notice-modal__header">
              <h3>{noticeModal.title}</h3>
              <button type="button" className="icon-button" onClick={closeNoticeModal}>
                횞
              </button>
            </div>
            <div className="modal__body auth-notice-modal__body">
              <p className="auth-notice-modal__message">{noticeModal.message}</p>
            </div>
            <div className="modal__footer modal__footer--split">
              <button type="button" className="primary-button" onClick={closeNoticeModal}>
                ?뺤씤
              </button>
            </div>
          </section>
        </ModalPortal>
      ) : null}
    </main>
  );
}
