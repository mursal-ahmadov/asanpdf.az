"use client";

import { useState } from "react";
import FileDrop from "../components/FileDrop";
import ToolHeader from "../components/ToolHeader";
import ToolInfo from "../components/ToolInfo";
import { downloadBlob } from "../lib/download";

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onPick = (files: File[]) => {
    setFile(files[0]);
    setError(null);
  };

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setProgress(null);
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const data = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data }).promise;
      const baseName = file.name.replace(/\.pdf$/i, "");

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Səhifə ${i} / ${pdf.numPages}`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        const blob: Blob = await new Promise((resolve, reject) =>
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("canvas error"))), "image/jpeg", 0.92)
        );
        downloadBlob(blob, `${baseName}-sehife-${i}.jpg`);
        await new Promise((r) => setTimeout(r, 150));
      }
      setProgress(`${pdf.numPages} şəkil yükləndi.`);
    } catch (e) {
      console.error(e);
      setError("Çevirmə zamanı xəta baş verdi.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <ToolHeader
        title="PDF → Şəkil"
        description="PDF-in hər səhifəsini yüksək keyfiyyətli JPG şəklə çevir."
      />

      {!file ? (
        <FileDrop onFiles={onPick} multiple={false} label="PDF seç" hint="bir fayl" />
      ) : (
        <div className="p-4 border border-border rounded-xl bg-card flex justify-between items-center">
          <p className="font-medium truncate">{file.name}</p>
          <button onClick={() => setFile(null)} className="text-sm text-muted hover:text-red-600">
            Dəyişdir
          </button>
        </div>
      )}

      {progress && <p className="mt-4 text-center text-sm text-muted">{progress}</p>}
      {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}

      {file && (
        <div className="mt-8 text-center">
          <button
            onClick={convert}
            disabled={busy}
            className="px-8 py-3 bg-accent text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {busy ? "İşlənir..." : "Şəkillərə çevir və yüklə"}
          </button>
        </div>
      )}

      <ToolInfo
        what="PDF-in hər səhifəsini yüksək keyfiyyətli JPG şəklə çevirir. Hər səhifə üçün ayrı fayl yaradılır."
        whenToUse={[
          "PDF-dən bir səhifəni şəkil kimi sosial mediada paylaşmaq",
          "Sənədi prezentasiyaya şəkil kimi əlavə etmək",
          "Word və ya başqa redaktora şəkil olaraq daxil etmək",
          "PDF-i Instagram, WhatsApp kimi yerlərdə göstərmək",
        ]}
        howSteps={[
          "PDF faylı seç",
          "\"Şəkillərə çevir və yüklə\" düyməsinə bas",
          "Hər səhifə avtomatik JPG kimi yüklənir",
        ]}
      />
    </div>
  );
}
