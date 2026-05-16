"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileDrop from "../components/FileDrop";
import ToolHeader from "../components/ToolHeader";
import ToolInfo from "../components/ToolInfo";
import { downloadBlob } from "../lib/download";

function parseRanges(input: string, total: number): number[][] | null {
  // "1-3, 5, 7-8" → [[0,1,2],[4],[6,7]]
  const groups: number[][] = [];
  const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
  for (const p of parts) {
    const m = p.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) return null;
    const a = parseInt(m[1], 10);
    const b = m[2] ? parseInt(m[2], 10) : a;
    if (a < 1 || b < 1 || a > total || b > total || a > b) return null;
    const arr: number[] = [];
    for (let i = a; i <= b; i++) arr.push(i - 1);
    groups.push(arr);
  }
  return groups.length ? groups : null;
}

export default function SplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [mode, setMode] = useState<"each" | "ranges">("each");
  const [ranges, setRanges] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPick = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    setError(null);
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer());
      setPageCount(doc.getPageCount());
    } catch {
      setError("PDF oxunmadı.");
      setFile(null);
    }
  };

  const split = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const total = src.getPageCount();
      let groups: number[][];
      if (mode === "each") {
        groups = Array.from({ length: total }, (_, i) => [i]);
      } else {
        const parsed = parseRanges(ranges, total);
        if (!parsed) {
          setError(`Yanlış aralıq formatı. Nümunə: 1-3, 5, 7-8 (cəmi ${total} səhifə var)`);
          setBusy(false);
          return;
        }
        groups = parsed;
      }

      const baseName = file.name.replace(/\.pdf$/i, "");

      if (groups.length === 1) {
        const out = await PDFDocument.create();
        const pages = await out.copyPages(src, groups[0]);
        pages.forEach((p) => out.addPage(p));
        const bytes = await out.save();
        const buf = new ArrayBuffer(bytes.byteLength);
        new Uint8Array(buf).set(bytes);
        downloadBlob(new Blob([buf], { type: "application/pdf" }), `${baseName}-secilen.pdf`);
      } else {
        for (let g = 0; g < groups.length; g++) {
          const out = await PDFDocument.create();
          const pages = await out.copyPages(src, groups[g]);
          pages.forEach((p) => out.addPage(p));
          const bytes = await out.save();
          const buf = new ArrayBuffer(bytes.byteLength);
          new Uint8Array(buf).set(bytes);
          const label = groups[g].length === 1
            ? `sehife-${groups[g][0] + 1}`
            : `sehifeler-${groups[g][0] + 1}-${groups[g][groups[g].length - 1] + 1}`;
          downloadBlob(new Blob([buf], { type: "application/pdf" }), `${baseName}-${label}.pdf`);
          await new Promise((r) => setTimeout(r, 150));
        }
      }
    } catch (e) {
      setError("Ayırma zamanı xəta baş verdi.");
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <ToolHeader
        title="PDF Ayır"
        description="PDF-i hər səhifə üçün ayrı fayla böl və ya istədiyin aralıqları çıxar."
      />

      {!file ? (
        <FileDrop onFiles={onPick} multiple={false} label="PDF seç" hint="bir fayl" />
      ) : (
        <>
          <div className="p-4 border border-border rounded-xl bg-card flex justify-between items-center">
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted">{pageCount} səhifə</p>
            </div>
            <button
              onClick={() => { setFile(null); setPageCount(0); setRanges(""); }}
              className="text-sm text-muted hover:text-red-600"
            >
              Dəyişdir
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-border rounded-xl hover:border-accent">
              <input
                type="radio"
                name="mode"
                checked={mode === "each"}
                onChange={() => setMode("each")}
              />
              <div>
                <p className="font-medium">Hər səhifəni ayrı PDF kimi</p>
                <p className="text-sm text-muted">{pageCount} fayl yaranacaq</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-3 border border-border rounded-xl hover:border-accent">
              <input
                type="radio"
                name="mode"
                checked={mode === "ranges"}
                onChange={() => setMode("ranges")}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium">Aralıqlar seç</p>
                <p className="text-sm text-muted mb-2">Nümunə: 1-3, 5, 7-9</p>
                <input
                  type="text"
                  value={ranges}
                  onChange={(e) => setRanges(e.target.value)}
                  onFocus={() => setMode("ranges")}
                  placeholder="1-3, 5, 7-9"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
            </label>
          </div>

          {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}

          <div className="mt-8 text-center">
            <button
              onClick={split}
              disabled={busy}
              className="px-8 py-3 bg-accent text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {busy ? "Ayrılır..." : "Ayır və yüklə"}
            </button>
          </div>
        </>
      )}

      <ToolInfo
        what="Böyük bir PDF faylını ayrı-ayrı kiçik fayllara bölür. Hər səhifəni ayrı və ya istədiyin aralıqları seçə bilərsən."
        whenToUse={[
          "Çoxsəhifəli PDF-dən yalnız bir hissəni paylaşmaq",
          "Email-ə əlavə üçün böyük faylı kiçik parçalara bölmək",
          "Bir kitabın fəsillərini ayrı fayllara salmaq",
          "Skan edilmiş sənədlərdən tək səhifələri çıxarmaq",
        ]}
        howSteps={[
          "PDF faylı seç və ya bura sürüşdür",
          "\"Hər səhifə ayrı\" və ya \"Aralıqlar seç\" rejimini seç",
          "Aralıq nümunəsi: 1-3, 5, 7-9 — vergüllə ayır",
        ]}
      />
    </div>
  );
}
