"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileDrop from "../components/FileDrop";
import ToolHeader from "../components/ToolHeader";
import ToolInfo from "../components/ToolInfo";
import { downloadBlob, formatSize } from "../lib/download";

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = (newOnes: File[]) => {
    setFiles((prev) => [...prev, ...newOnes]);
    setError(null);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= files.length) return;
    const copy = [...files];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setFiles(copy);
  };

  const remove = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const merge = async () => {
    if (files.length < 2) {
      setError("Ən azı 2 PDF lazımdır.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const out = await PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const src = await PDFDocument.load(bytes);
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const merged = await out.save();
      const arrayBuffer = new ArrayBuffer(merged.byteLength);
      new Uint8Array(arrayBuffer).set(merged);
      downloadBlob(new Blob([arrayBuffer], { type: "application/pdf" }), "birlesdirilmis.pdf");
    } catch (e) {
      setError("PDF birləşdirilərkən xəta baş verdi. Faylların düzgün PDF olduğundan əmin olun.");
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <ToolHeader
        title="PDF Birləşdir"
        description="Bir neçə PDF faylını sıraya düz və bir sənədə birləşdir."
      />

      <FileDrop onFiles={addFiles} label="PDF faylları sürüşdür və ya seç" hint="PDF (çoxlu seçə bilərsən)" />

      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border border-border rounded-xl bg-card"
            >
              <span className="text-muted text-sm w-6 text-center">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{f.name}</p>
                <p className="text-xs text-muted">{formatSize(f.size)}</p>
              </div>
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="px-2 py-1 text-sm rounded hover:bg-gray-100 disabled:opacity-30"
                aria-label="Yuxarı"
              >
                ↑
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === files.length - 1}
                className="px-2 py-1 text-sm rounded hover:bg-gray-100 disabled:opacity-30"
                aria-label="Aşağı"
              >
                ↓
              </button>
              <button
                onClick={() => remove(i)}
                className="px-2 py-1 text-sm text-red-600 rounded hover:bg-red-50"
                aria-label="Sil"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}

      {files.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={merge}
            disabled={busy || files.length < 2}
            className="px-8 py-3 bg-accent text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {busy ? "Birləşdirilir..." : "Birləşdir və yüklə"}
          </button>
        </div>
      )}

      <ToolInfo
        what="Bir neçə ayrı PDF faylını sıra ilə bir sənədə birləşdirir. Səhifələrin sırası tam sənin nəzarətindədir."
        whenToUse={[
          "Bir neçə skan edilmiş sənədi tək fayla salmaq",
          "Müxtəlif mənbələrdən gələn hesabatları birləşdirmək",
          "Diplom, referat və ya layihə bölmələrini bir sənədə yığmaq",
          "Müqavilə əlavələrini əsas sənədə qoşmaq",
        ]}
        howSteps={[
          "Birləşdirmək istədiyin PDF faylları seç və ya bura sürüşdür",
          "Yuxarı/aşağı düymələrlə sıranı dəyiş",
          "\"Birləşdir və yüklə\" düyməsinə bas, fayl avtomatik yüklənir",
        ]}
      />
    </div>
  );
}
