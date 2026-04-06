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
      setHelper("OTP 입력 화면으로 이동합니다.");
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
    setHelper("대시보드로 이동합니다.");
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
              ? "테스트 계정으로 로그인하면 OTP 화면으로 이동합니다."
              : "테스트 OTP를 입력하면 대시보드로 이동합니다."}
          </p>

          <ul className="auth-card__guide">
            <li>실제 인증 연동은 되어 있지 않습니다.</li>
            <li>문구와 화면 흐름을 확인하기 위한 목업입니다.</li>
          </ul>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__grid">
            <label className="field auth-form__field">
              <span className="field__label">아이디</span>
              <input
                className="field__input"
                value={form.userId}
                onChange={(event) => updateField("userId")(event.target.value)}
                placeholder="test0000"
                autoComplete="username"
                disabled={mode === "otp"}
              />
            </label>

            <label className="field auth-form__field">
              <span className="field__label">비밀번호</span>
              <input
                className="field__input"
                type="password"
                value={form.password}
                onChange={(event) => updateField("password")(event.target.value)}
                placeholder="a123456789"
                autoComplete="current-password"
                disabled={mode === "otp"}
              />
            </label>

            {mode === "otp" ? (
              <label className="field auth-form__field auth-form__field--otp">
                <span className="field__label">OTP</span>
                <input
                  className="field__input"
                  inputMode="numeric"
                  value={form.otp}
                  onChange={(event) => updateField("otp")(event.target.value)}
                  placeholder="6자리 숫자 입력"
                  autoComplete="one-time-code"
                />
              </label>
            ) : null}
          </div>

          {error ? <p className="auth-form__feedback auth-form__feedback--error">{error}</p> : null}
          {helper ? <p className="auth-form__feedback auth-form__feedback--helper">{helper}</p> : null}

          <div className="auth-form__actions">
            <button className="primary-button" type="submit" disabled={isSubmitDisabled}>
              {loading ? "진행 중" : mode === "login" ? "로그인" : "확인"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
