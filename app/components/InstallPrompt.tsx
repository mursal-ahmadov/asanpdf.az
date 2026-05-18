"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "asanpdf:install-dismissed-at";
const DISMISS_DAYS = 14;

function wasRecentlyDismissed(): boolean {
  if (typeof window === "undefined") return false;
  const ts = localStorage.getItem(DISMISS_KEY);
  if (!ts) return false;
  const ms = Date.now() - parseInt(ts, 10);
  return ms < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // @ts-expect-error iOS Safari
    window.navigator.standalone === true
  );
}

function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [iosMode, setIosMode] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone() || wasRecentlyDismissed()) return;

    // Android / Chrome path
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // iOS Safari path — show manual instructions
    if (isIOS()) {
      setIosMode(true);
      // Slight delay so we don't pop up immediately on page load
      const t = setTimeout(() => setShow(true), 3000);
      return () => {
        clearTimeout(t);
        window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") {
      setShow(false);
    }
    setDeferred(null);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed left-3 right-3 bottom-3 sm:left-auto sm:right-4 sm:bottom-4 sm:max-w-sm z-50
        bg-white border border-border rounded-2xl shadow-xl p-4 animate-fade-in"
      role="dialog"
      aria-label="Tətbiqi quraşdır"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xl shrink-0">
          📱
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm mb-1">Tətbiqi telefona qur</p>
          {iosMode ? (
            <p className="text-xs text-muted leading-relaxed">
              Aşağıda{" "}
              <span className="inline-block px-1.5 py-0.5 rounded bg-gray-100 font-medium">
                Paylaş
              </span>{" "}
              <span aria-hidden>⬆️</span> düyməsinə bas → siyahıdan{" "}
              <span className="inline-block px-1.5 py-0.5 rounded bg-gray-100 font-medium">
                Ana ekrana əlavə et
              </span>{" "}
              seç.
            </p>
          ) : (
            <p className="text-xs text-muted leading-relaxed">
              AsanPDF-i bir kliklə ana ekranına əlavə et — sanki adi tətbiq kimi
              istifadə et.
            </p>
          )}
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Bağla"
          className="text-muted hover:text-gray-700 shrink-0 -mt-1 -mr-1 p-1"
        >
          ✕
        </button>
      </div>

      {!iosMode && (
        <div className="mt-3 flex gap-2 justify-end">
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 text-xs text-muted hover:text-gray-700"
          >
            Sonra
          </button>
          <button
            onClick={handleInstall}
            className="px-4 py-1.5 text-xs font-medium bg-accent text-white rounded-lg hover:bg-blue-700 transition"
          >
            Qur
          </button>
        </div>
      )}
    </div>
  );
}
