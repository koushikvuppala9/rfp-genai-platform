"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.toLowerCase().endsWith("@eitacies.com")) {
      setMessage("");
      setError(
        "Password reset is available only for EITACIES INC email accounts."
      );
      return;
    }

    setError("");
    setMessage(
      "Password reset instructions have been queued for this EITACIES INC account."
    );
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
            Secure account recovery
          </h1>
          <p className="mt-5 text-sm leading-6 text-slate-300 max-w-md">
            Password reset requests are limited to authorized EITACIES INC users
            with company-issued email accounts.
          </p>
        </div>

        <div className="mt-24 text-xs text-slate-300">
          Authorized EITACIES INC users only
        </div>
      </section>

      <section className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white border border-[#e1e4e8] rounded-[4px] p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#1a2332]">
              Reset your password
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter your EITACIES INC email address to request reset
              instructions.
            </p>
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
                  setMessage("");
                  setError("");
                }}
                placeholder="you@eitacies.com"
                className="w-full h-10 rounded-[4px] border border-slate-300 px-3 text-sm outline-none focus:border-[#1a2332]"
              />
              <p className="mt-1 text-xs text-slate-500">
                Access restricted to @eitacies.com accounts.
              </p>
            </div>

            {error && (
              <div className="rounded-[4px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-[4px] border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="w-full h-10 rounded-[4px] bg-[#1a2332] text-white text-sm font-medium"
            >
              Send Reset Instructions
            </button>
          </form>

          <a
            href="/login"
            className="block mt-5 text-sm font-medium text-[#1a2332]"
          >
            Back to sign in
          </a>
        </div>
      </section>
    </main>
  );
}
