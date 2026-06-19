"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.toLowerCase().endsWith("@eitacies.com")) {
      setError("Access is restricted to EITACIES INC email accounts.");
      return;
    }

    setError("");
  }

  return (
    <main className="min-h-screen bg-[#f4f5f7] flex">
      <section className="hidden lg:flex w-[42%] bg-[#1a2332] text-white p-10 flex-col justify-center">
        <div className="mb-20">
          <div className="text-2xl font-semibold">EITACIES INC</div>
          <div className="mt-2 text-sm text-slate-300">RFP GenAI Platform</div>
        </div>

        <div>
          <h1 className="text-4xl font-semibold leading-tight">
            Procurement opportunity and proposal operations platform
          </h1>
          <p className="mt-5 text-sm leading-6 text-slate-300 max-w-md">
            Secure access for monitored opportunities, qualification workflow,
            proposal generation, compliance tracking, and governance reporting.
          </p>
        </div>

        <div className="mt-24 text-xs text-slate-300">
          Authorized EITACIES INC users only
        </div>
      </section>

      <section className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white border border-[#e1e4e8] rounded-[4px] p-8 shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1a2332]">
              Sign in to RFP GenAI
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Use your EITACIES INC account to continue.
            </p>
          </div>

          <button
            type="button"
            className="w-full h-11 rounded-[4px] bg-[#1a2332] text-white text-sm font-medium"
          >
            Continue with EITACIES SSO
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs uppercase tracking-wide text-slate-500">
              or
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-500 mb-1">
                Work Email
              </label>
              <input
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                placeholder="you@eitacies.com"
                className="w-full h-10 rounded-[4px] border border-slate-300 px-3 text-sm outline-none focus:border-[#1a2332]"
              />
              <p className="mt-1 text-xs text-slate-500">
                Access restricted to @eitacies.com accounts.
              </p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-500 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full h-10 rounded-[4px] border border-slate-300 px-3 text-sm outline-none focus:border-[#1a2332]"
              />
            </div>

            {error && (
              <div className="rounded-[4px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full h-10 rounded-[4px] border border-[#1a2332] text-[#1a2332] text-sm font-medium hover:bg-slate-50"
            >
              Sign In
            </button>
          </form>

          <div className="mt-5 text-sm">
            <a href="/forgot-password" className="text-[#1a2332] font-medium">
              Forgot password?
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
