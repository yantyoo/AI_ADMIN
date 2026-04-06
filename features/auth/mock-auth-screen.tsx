"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

type MockAuthMode = "login" | "otp";

type AuthFormState = {
  userId: string;
  password: string;
  otp: string;
};

const AUTH_STAGE_KEY = "xperp-mock-auth-stage";
const AUTH_USER_KEY = "xperp-mock-auth-user";

const defaultState: AuthFormState = {
  userId: "",
  password: "",
  otp: ""
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

export function MockAuthScreen({ mode }: { mode: MockAuthMode }) {
  const router = useRouter();
  const [form, setForm] = useState<AuthFormState>(defaultState);
  const [helper, setHelper] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stage = window.sessionStorage.getItem(AUTH_STAGE_KEY);
    const userId = window.sessionStorage.getItem(AUTH_USER_KEY) ?? "";

    if (mode === "login") {
      if (stage === "authenticated") {
        router.replace("/dashboard");
        return;
      }

      setForm((current) => ({ ...current, userId }));
      return;
    }

    if (!userId) {
      router.replace("/login");
      return;
    }

    setForm((current) => ({ ...current, userId }));
  }, [mode, router]);

  const updateField = (field: keyof AuthFormState) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (mode === "login") {
      if (!form.userId.trim() || !form.password.trim()) {
        setError("아이디와 비밀번호를 입력해 주세요.");
        return;
      }

      setLoading(true);
      setHelper("OTP 화면으로 이동 중입니다.");
      window.sessionStorage.setItem(AUTH_STAGE_KEY, "otp_pending");
      window.sessionStorage.setItem(AUTH_USER_KEY, form.userId.trim());
      await sleep(450);
      router.replace("/otp");
      return;
    }

    if (!form.otp.trim()) {
      setError("OTP를 입력해 주세요.");
      return;
    }

    setLoading(true);
    setHelper("대시보드로 이동 중입니다.");
    window.sessionStorage.setItem(AUTH_STAGE_KEY, "authenticated");
    window.sessionStorage.setItem(AUTH_USER_KEY, form.userId.trim());
    await sleep(450);
    router.replace("/dashboard");
  };

  const isSubmitDisabled =
    loading ||
    (mode === "login" ? !form.userId.trim() || !form.password.trim() : !form.otp.trim());

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-card__intro">
          <span className="auth-card__badge">Mock Auth</span>
          <h1 className="auth-card__title">{mode === "login" ? "로그인 화면" : "OTP 인증"}</h1>
          <p className="auth-card__description">
            {mode === "login"
              ? "임의의 아이디와 비밀번호로 다음 단계로 이동하는 목업 흐름입니다."
              : "임의의 OTP를 입력하면 대시보드로 이동합니다."}
          </p>

          <ul className="auth-card__guide">
            <li>실제 인증 연동은 하지 않습니다.</li>
            <li>화면 확인과 플로우 테스트 용도입니다.</li>
            <li>입력값은 세션에만 임시 저장합니다.</li>
          </ul>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__header">
            <h2 className="auth-form__title">{mode === "login" ? "관리자 로그인" : "OTP 확인"}</h2>
            <p className="auth-form__caption">
              {mode === "login"
                ? "아이디와 비밀번호를 입력하면 OTP 단계로 이동합니다."
                : "OTP를 입력하면 대시보드 진입으로 처리합니다."}
            </p>
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

            {mode === "login" ? (
              <label className="field auth-field">
                <span className="field__label">비밀번호</span>
                <input
                  type="password"
                  className="field__input auth-input"
                  value={form.password}
                  onChange={(event) => updateField("password")(event.target.value)}
                  placeholder="임의의 비밀번호 입력"
                  autoComplete="current-password"
                />
              </label>
            ) : (
              <label className="field auth-field">
                <span className="field__label">OTP</span>
                <input
                  className="field__input auth-input auth-input--otp"
                  value={form.otp}
                  onChange={(event) => updateField("otp")(event.target.value)}
                  placeholder="OTP 입력"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              </label>
            )}
          </div>

          <div className="auth-form__actions">
            <button type="submit" className="primary-button auth-submit" disabled={isSubmitDisabled}>
              {loading ? "처리 중..." : mode === "login" ? "다음" : "대시보드 진입"}
            </button>
            <button
              type="button"
              className="secondary-button auth-cancel"
              onClick={() => {
                if (mode === "login") {
                  setForm(defaultState);
                  setError("");
                  setHelper("");
                  return;
                }

                window.sessionStorage.removeItem(AUTH_STAGE_KEY);
                window.sessionStorage.removeItem(AUTH_USER_KEY);
                router.replace("/login");
              }}
            >
              {mode === "login" ? "초기화" : "로그인으로"}
            </button>
          </div>

          <div className="auth-form__feedback" aria-live="polite">
            {error ? <p className="auth-error">{error}</p> : null}
            {!error && helper ? <p className="auth-helper">{helper}</p> : null}
          </div>
        </form>
      </section>
    </main>
  );
}
