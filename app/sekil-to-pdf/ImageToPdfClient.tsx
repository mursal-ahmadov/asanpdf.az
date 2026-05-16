"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileDrop from "../components/FileDrop";
import ToolHeader from "../components/ToolHeader";
import ToolInfo from "../components/ToolInfo";
import { downloadBlob, formatSize } from "../lib/download";

export default function ImageToPdfPage() {
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

  const convert = async () => {
    if (files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const doc = await PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        let img;
        if (f.type === "image/jpeg" || /\.jpe?g$/i.test(f.name)) {
          img = await doc.embedJpg(bytes);
        } else {
          img = await doc.embedPng(bytes);
        }
        // A4 = 595 x 842 pt
        const pageW = 595;
        const pageH = 842;
        const page = doc.addPage([pageW, pageH]);
        const ratio = Math.min(pageW / img.width, pageH / img.height) * 0.95;
        const w = img.width * ratio;
        const h = img.height * ratio;
        page.drawImage(img, {
          x: (pageW - w) / 2,
          y: (pageH - h) / 2,
          width: w,
          height: h,
        });
      }
      const out = await doc.save();
      const buf = new ArrayBuffer(out.byteLength);
      new Uint8Array(buf).set(out);
      downloadBlob(new Blob([buf], { type: "application/pdf" }), "sekillerden.pdf");
    } catch (e) {
      setError("Çevirmə zamanı xəta. Yalnız JPG və PNG dəstəklənir.");
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <ToolHeader
        title="Şəkil → PDF"
        description="JPG və PNG şəkilləri sıra ilə bir PDF sənədinə çevir."
      />

      <FileDrop
        onFiles={addFiles}
        accept={{ "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }}
        label="Şəkilləri sürüşdür və ya seç"
        hint="JPG, PNG (çoxlu seçə bilərsən)"
      />

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
              <button onClick={() => move(i, -1)} disabled={i === 0}
                className="px-2 py-1 text-sm rounded hover:bg-gray-100 disabled:opacity-30">↑</button>
              <button onClick={() => move(i, 1)} disabled={i === files.length - 1}
                className="px-2 py-1 text-sm rounded hover:bg-gray-100 disabled:opacity-30">↓</button>
              <button onClick={() => remove(i)}
                className="px-2 py-1 text-sm text-red-600 rounded hover:bg-red-50">✕</button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}

      {files.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={convert}
            disabled={busy}
            className="px-8 py-3 bg-accent text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {busy ? "Çevrilir..." : "PDF yarat və yüklə"}
          </button>
        </div>
      )}

      <ToolInfo
        what="JPG və PNG şəkillərdən bir PDF sənədi yaradır. Hər şəkil A4 ölçüsündə ayrı səhifə kimi qoyulur."
        whenToUse={[
          "Telefonla çəkilmiş sənəd şəkillərini bir PDF-də toplamaq",
          "Şəxsiyyət vəsiqəsi və ya pasportun şəklini rəsmi formada göndərmək",
          "Tələbə qaiməsi, qəbz, bilet skanlarını ərizəyə əlavə etmək",
          "Foto albomu və ya kolleksiyanı PDF kitabçası kimi saxlamaq",
        ]}
        howSteps={[
          "Şəkilləri sürüşdür və ya seç (bir neçə dənə olsa da olar)",
          "Yuxarı/aşağı düymələrlə şəkillərin sırasını dəyiş",
          "\"PDF yarat və yüklə\" düyməsinə bas",
        ]}
      />
    </div>
  );
}
