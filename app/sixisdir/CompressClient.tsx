"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileDrop from "../components/FileDrop";
import ToolHeader from "../components/ToolHeader";
import ToolInfo from "../components/ToolInfo";
import { downloadBlob, formatSize } from "../lib/download";

type Quality = "high" | "medium" | "low";

const PRESETS: Record<Quality, { dpi: number; jpeg: number; label: string; hint: string }> = {
  high:   { dpi: 144, jpeg: 0.85, label: "Yüksək keyfiyyət", hint: "Mətn aydın, fayl orta ölçüdə" },
  medium: { dpi: 110, jpeg: 0.70, label: "Tövsiyə olunan",   hint: "Yaxşı balans — ən çox seçilir" },
  low:    { dpi: 80,  jpeg: 0.55, label: "Maksimum sıxma",   hint: "Ən kiçik fayl, keyfiyyət bir az azalır" },
};

export default function CompressClient() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<Quality>("medium");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [result, setResult] = useState<{ originalSize: number; newSize: number; saved: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onPick = (files: File[]) => {
    setFile(files[0]);
    setError(null);
    setResult(null);
  };

  const compress = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setProgress("Hazırlanır...");

    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const data = await file.arrayBuffer();
      const sourcePdf = await pdfjs.getDocument({ data }).promise;
      const totalPages = sourcePdf.numPages;
      const { dpi, jpeg } = PRESETS[quality];
      const scale = dpi / 72; // PDF default DPI is 72

      const outDoc = await PDFDocument.create();

      for (let i = 1; i <= totalPages; i++) {
        setProgress(`Səhifə ${i} / ${totalPages} işlənir...`);

        const page = await sourcePdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        const jpegBlob: Blob = await new Promise((resolve, reject) =>
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("canvas error"))),
            "image/jpeg",
            jpeg
          )
        );
        const jpegBytes = new Uint8Array(await jpegBlob.arrayBuffer());
        const img = await outDoc.embedJpg(jpegBytes);

        // Page size in points (PDF default unit), keeping original page dimensions
        const originalViewport = page.getViewport({ scale: 1 });
        const pageW = originalViewport.width;
        const pageH = originalViewport.height;
        const newPage = outDoc.addPage([pageW, pageH]);
        newPage.drawImage(img, { x: 0, y: 0, width: pageW, height: pageH });

        // Yield to the browser between pages so UI updates
        await new Promise((r) => setTimeout(r, 10));
      }

      setProgress("Yekun fayl hazırlanır...");
      const out = await outDoc.save({ useObjectStreams: true });
      const buf = new ArrayBuffer(out.byteLength);
      new Uint8Array(buf).set(out);

      const originalSize = file.size;
      const newSize = out.byteLength;
      const saved = Math.max(0, Math.round((1 - newSize / originalSize) * 100));

      const baseName = file.name.replace(/\.pdf$/i, "");
      downloadBlob(new Blob([buf], { type: "application/pdf" }), `${baseName}-sixilmis.pdf`);

      setResult({ originalSize, newSize, saved });
      setProgress(null);
    } catch (e) {
      console.error(e);
      setError("Sıxışdırma zamanı xəta baş verdi. Fayl çox böyükdürsə (50+ MB) brauzer çatışmaya bilər.");
      setProgress(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <ToolHeader
        title="PDF Sıxışdır"
        description="PDF faylının ölçüsünü 50-90% azalt. Email-lə göndərmək və ya yükləmək üçün daha rahat olar."
      />

      {!file ? (
        <FileDrop onFiles={onPick} multiple={false} label="PDF seç" hint="bir fayl" />
      ) : (
        <>
          <div className="p-4 border border-border rounded-xl bg-card flex justify-between items-center mb-6">
            <div className="min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-muted">Hazırkı ölçü: {formatSize(file.size)}</p>
            </div>
            <button
              onClick={() => { setFile(null); setResult(null); }}
              className="text-sm text-muted hover:text-red-600 shrink-0 ml-3"
            >
              Dəyişdir
            </button>
          </div>

          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm">
            <p className="font-semibold text-amber-900 mb-1">⚠️ Bilməli olduğun
            </p>
            <p className="text-amber-800 leading-relaxed">
              Yüksək sıxma əldə etmək üçün hər səhifə yenidən şəkil kimi paketlənir.
              Bu o deməkdir ki, sıxışdırılmış PDF-də{" "}
              <strong>mətn artıq seçilə bilməz</strong>. Sənəd görünüş baxımından eyni qalır,
              amma yalnız oxumaq üçündür.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium text-gray-900">Keyfiyyət səviyyəsi:</p>
            {(Object.keys(PRESETS) as Quality[]).map((key) => {
              const preset = PRESETS[key];
              const isActive = quality === key;
              return (
                <label
                  key={key}
                  className={`flex items-start gap-3 cursor-pointer p-4 border-2 rounded-xl transition
                    ${isActive ? "border-accent bg-blue-50" : "border-border hover:border-accent"}`}
                >
                  <input
                    type="radio"
                    name="quality"
                    checked={isActive}
                    onChange={() => setQuality(key)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{preset.label}</p>
                    <p className="text-sm text-muted">{preset.hint}</p>
                  </div>
                  {key === "medium" && (
                    <span className="text-xs px-2 py-1 rounded-full bg-accent text-white shrink-0">
                      Tövsiyə
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          {progress && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-center text-sm text-accent">
              {progress}
            </div>
          )}

          {error && <p className="mb-4 text-red-600 text-sm text-center">{error}</p>}

          {result && (
            <div className="mb-6 p-5 border-2 border-green-300 bg-green-50 rounded-xl">
              <p className="font-semibold text-green-900 mb-3 text-center">✓ Sıxışdırıldı və yükləndi</p>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div>
                  <p className="text-muted">Əvvəl</p>
                  <p className="font-semibold">{formatSize(result.originalSize)}</p>
                </div>
                <div>
                  <p className="text-muted">İndi</p>
                  <p className="font-semibold">{formatSize(result.newSize)}</p>
                </div>
                <div>
                  <p className="text-muted">Qənaət</p>
                  <p className="font-semibold text-green-700">{result.saved}%</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={compress}
              disabled={busy}
              className="px-8 py-3 bg-accent text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {busy ? "İşlənir..." : "Sıxışdır və yüklə"}
            </button>
          </div>
        </>
      )}

      <ToolInfo
        what="PDF sənədinin hər səhifəsini yenidən paketləyərək fayl ölçüsünü əhəmiyyətli dərəcədə azaldır. Şəkilli sənədlərdə 50-90% qənaət mümkündür."
        whenToUse={[
          "Email-lə göndərmək üçün böyük PDF-i kiçiltmək (Gmail limiti 25 MB-dır)",
          "WhatsApp/Telegram ilə paylaşmaq üçün ölçü azaltmaq",
          "Skan edilmiş çox səhifəli sənədləri saxlamaq üçün yer qənaət etmək",
          "Saytlara yükləmə üçün limit-altına salmaq",
        ]}
        howSteps={[
          "PDF faylı seç",
          "Keyfiyyət səviyyəsini seç (Tövsiyə olunan ən yaxşı balansdır)",
          "\"Sıxışdır və yüklə\" düyməsinə bas",
        ]}
      />
    </div>
  );
}
