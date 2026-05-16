"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileDrop from "../components/FileDrop";
import ToolHeader from "../components/ToolHeader";
import ToolInfo from "../components/ToolInfo";
import { downloadBlob } from "../lib/download";

export default function ExtractPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [mode, setMode] = useState<"single" | "separate">("single");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPick = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    setSelected(new Set());
    setError(null);
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer());
      setPageCount(doc.getPageCount());
    } catch {
      setError("PDF oxunmadı.");
      setFile(null);
    }
  };

  const toggle = (i: number) => {
    const next = new Set(selected);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setSelected(next);
  };

  const selectAll = () => {
    setSelected(new Set(Array.from({ length: pageCount }, (_, i) => i)));
  };

  const clearAll = () => setSelected(new Set());

  const apply = async () => {
    if (!file || selected.size === 0) {
      setError("Çıxarmaq üçün ən azı bir səhifə seç.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const indices = Array.from(selected).sort((a, b) => a - b);
      const baseName = file.name.replace(/\.pdf$/i, "");

      if (mode === "single") {
        const out = await PDFDocument.create();
        const pages = await out.copyPages(src, indices);
        pages.forEach((p) => out.addPage(p));
        const bytes = await out.save();
        const buf = new ArrayBuffer(bytes.byteLength);
        new Uint8Array(buf).set(bytes);
        downloadBlob(new Blob([buf], { type: "application/pdf" }), `${baseName}-cixarilmis.pdf`);
      } else {
        for (const idx of indices) {
          const out = await PDFDocument.create();
          const [page] = await out.copyPages(src, [idx]);
          out.addPage(page);
          const bytes = await out.save();
          const buf = new ArrayBuffer(bytes.byteLength);
          new Uint8Array(buf).set(bytes);
          downloadBlob(new Blob([buf], { type: "application/pdf" }), `${baseName}-sehife-${idx + 1}.pdf`);
          await new Promise((r) => setTimeout(r, 150));
        }
      }
    } catch (e) {
      setError("Xəta baş verdi.");
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <ToolHeader
        title="Səhifə Çıxar"
        description="PDF-dən istədiyin səhifələri seç və ayrı sənəd kimi yüklə."
      />

      {!file ? (
        <FileDrop onFiles={onPick} multiple={false} label="PDF seç" hint="bir fayl" />
      ) : (
        <>
          <div className="p-4 border border-border rounded-xl bg-card flex justify-between items-center mb-6">
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted">
                {pageCount} səhifə · {selected.size} seçilib
              </p>
            </div>
            <button
              onClick={() => { setFile(null); setPageCount(0); setSelected(new Set()); }}
              className="text-sm text-muted hover:text-red-600"
            >
              Dəyişdir
            </button>
          </div>

          <div className="flex gap-2 mb-4 justify-center">
            <button
              onClick={selectAll}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:border-accent hover:bg-gray-50"
            >
              Hamısını seç
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:border-accent hover:bg-gray-50"
            >
              Seçimi təmizlə
            </button>
          </div>

          <p className="text-sm text-muted mb-3 text-center">Çıxarmaq istədiyin səhifələri seç:</p>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                onClick={() => toggle(i)}
                className={`aspect-[3/4] rounded-lg border-2 text-sm font-medium transition
                  ${selected.has(i)
                    ? "border-accent bg-blue-50 text-accent"
                    : "border-border hover:border-accent"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-border rounded-xl hover:border-accent">
              <input
                type="radio"
                name="mode"
                checked={mode === "single"}
                onChange={() => setMode("single")}
              />
              <div>
                <p className="font-medium">Bir PDF kimi</p>
                <p className="text-sm text-muted">Seçilmiş səhifələr bir sənəddə</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 border border-border rounded-xl hover:border-accent">
              <input
                type="radio"
                name="mode"
                checked={mode === "separate"}
                onChange={() => setMode("separate")}
              />
              <div>
                <p className="font-medium">Hər səhifə ayrı PDF</p>
                <p className="text-sm text-muted">Hər səhifə üçün ayrı fayl yüklənir</p>
              </div>
            </label>
          </div>

          {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}

          <div className="mt-8 text-center">
            <button
              onClick={apply}
              disabled={busy || selected.size === 0}
              className="px-8 py-3 bg-accent text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {busy ? "İşlənir..." : `${selected.size} səhifəni çıxar və yüklə`}
            </button>
          </div>
        </>
      )}

      <ToolInfo
        what="PDF-dən yalnız sənə lazım olan səhifələri seçib ayrı sənəd kimi yükləyirsən. Qalan səhifələr toxunulmaz."
        whenToUse={[
          "Böyük kitabdan yalnız bir fəsli paylaşmaq",
          "Müqavilədən yalnız müəyyən maddəni göndərmək",
          "Hesabatdan diaqram və ya cədvəl səhifəsini ayırmaq",
          "Tələbə üçün referatdan yalnız bir hissəni vermək",
        ]}
        howSteps={[
          "PDF faylı seç",
          "Çıxarmaq istədiyin səhifələrin nömrələrinə bas",
          "\"Bir PDF kimi\" və ya \"Hər səhifə ayrı PDF\" rejimini seç və yüklə",
        ]}
      />
    </div>
  );
}
