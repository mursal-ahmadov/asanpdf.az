"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileDrop from "../components/FileDrop";
import ToolHeader from "../components/ToolHeader";
import ToolInfo from "../components/ToolInfo";
import { downloadBlob } from "../lib/download";

export default function DeletePagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
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

  const apply = async () => {
    if (!file || selected.size === 0) {
      setError("Silmək üçün ən azı bir səhifə seç.");
      return;
    }
    if (selected.size === pageCount) {
      setError("Bütün səhifələri sil bilməzsən.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const keep = [];
      for (let i = 0; i < pageCount; i++) {
        if (!selected.has(i)) keep.push(i);
      }
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, keep);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      const buf = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(buf).set(bytes);
      const baseName = file.name.replace(/\.pdf$/i, "");
      downloadBlob(new Blob([buf], { type: "application/pdf" }), `${baseName}-duzeldilmis.pdf`);
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
        title="Səhifə Sil"
        description="PDF-dən silmək istədiyin səhifələri seç."
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

          <p className="text-sm text-muted mb-3">Silmək istədiyin səhifələri seç:</p>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                onClick={() => toggle(i)}
                className={`aspect-[3/4] rounded-lg border-2 text-sm font-medium transition
                  ${selected.has(i)
                    ? "border-red-500 bg-red-50 text-red-700 line-through"
                    : "border-border hover:border-accent"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}

          <div className="mt-8 text-center">
            <button
              onClick={apply}
              disabled={busy || selected.size === 0}
              className="px-8 py-3 bg-accent text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {busy ? "İşlənir..." : `${selected.size} səhifəni sil və yüklə`}
            </button>
          </div>
        </>
      )}

      <ToolInfo
        what="PDF-dən lazımsız səhifələri silib təmiz bir sənəd yaradır. Orijinal fayla toxunulmur — yeni nüsxə yaradılır."
        whenToUse={[
          "Skan edilmiş sənəddən boş və ya pis çəkilmiş səhifələri silmək",
          "Hesabatdan şəxsi məlumat olan səhifələri çıxarmaq",
          "Reklam və ya kapak səhifəsini silmək",
          "Sənədi qısaltmaq və daha yığcam göndərmək",
        ]}
        howSteps={[
          "PDF faylı seç",
          "Silmək istədiyin səhifələrin nömrələrinə bas (qırmızı işarələnir)",
          "\"Sil və yüklə\" düyməsini bas, yeni fayl avtomatik yüklənir",
        ]}
      />
    </div>
  );
}
