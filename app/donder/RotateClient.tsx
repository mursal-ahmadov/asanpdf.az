"use client";

import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import FileDrop from "../components/FileDrop";
import ToolHeader from "../components/ToolHeader";
import ToolInfo from "../components/ToolInfo";
import { downloadBlob } from "../lib/download";

type Rot = 0 | 90 | 180 | 270;

export default function RotatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotations, setRotations] = useState<Rot[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPick = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    setError(null);
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer());
      const count = doc.getPageCount();
      setPageCount(count);
      setRotations(Array(count).fill(0) as Rot[]);
    } catch {
      setError("PDF oxunmadı.");
      setFile(null);
    }
  };

  const rotateOne = (i: number) => {
    const next = [...rotations];
    next[i] = (((next[i] + 90) % 360) as Rot);
    setRotations(next);
  };

  const rotateAll = () => {
    setRotations(rotations.map((r) => (((r + 90) % 360) as Rot)));
  };

  const reset = () => setRotations(Array(pageCount).fill(0) as Rot[]);

  const apply = async () => {
    if (!file) return;
    const anyChanged = rotations.some((r) => r !== 0);
    if (!anyChanged) {
      setError("Heç bir səhifə döndərilməyib.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const pages = doc.getPages();
      for (let i = 0; i < pages.length; i++) {
        if (rotations[i] !== 0) {
          const current = pages[i].getRotation().angle;
          pages[i].setRotation(degrees((current + rotations[i]) % 360));
        }
      }
      const bytes = await doc.save();
      const buf = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(buf).set(bytes);
      const baseName = file.name.replace(/\.pdf$/i, "");
      downloadBlob(new Blob([buf], { type: "application/pdf" }), `${baseName}-donderilmis.pdf`);
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
        title="Səhifə Döndər"
        description="PDF səhifələrini 90°, 180° və ya 270° döndər. Hər səhifəni ayrı və ya hamısını birdən."
      />

      {!file ? (
        <FileDrop onFiles={onPick} multiple={false} label="PDF seç" hint="bir fayl" />
      ) : (
        <>
          <div className="p-4 border border-border rounded-xl bg-card flex justify-between items-center mb-6">
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted">{pageCount} səhifə</p>
            </div>
            <button
              onClick={() => { setFile(null); setPageCount(0); setRotations([]); }}
              className="text-sm text-muted hover:text-red-600"
            >
              Dəyişdir
            </button>
          </div>

          <div className="flex gap-2 mb-4 justify-center">
            <button
              onClick={rotateAll}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:border-accent hover:bg-gray-50"
            >
              ↻ Hamısını döndər
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:border-accent hover:bg-gray-50"
            >
              Sıfırla
            </button>
          </div>

          <p className="text-sm text-muted mb-3 text-center">Səhifəyə bas — 90° döndərmək üçün:</p>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
            {rotations.map((r, i) => (
              <button
                key={i}
                onClick={() => rotateOne(i)}
                className={`aspect-[3/4] rounded-lg border-2 text-sm font-medium transition flex flex-col items-center justify-center gap-1
                  ${r !== 0
                    ? "border-accent bg-blue-50 text-accent"
                    : "border-border hover:border-accent"
                  }`}
              >
                <span
                  className="text-lg transition-transform"
                  style={{ transform: `rotate(${r}deg)` }}
                >
                  📄
                </span>
                <span className="text-xs">{i + 1}{r !== 0 ? ` (${r}°)` : ""}</span>
              </button>
            ))}
          </div>

          {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}

          <div className="mt-8 text-center">
            <button
              onClick={apply}
              disabled={busy}
              className="px-8 py-3 bg-accent text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {busy ? "İşlənir..." : "Tətbiq et və yüklə"}
            </button>
          </div>
        </>
      )}

      <ToolInfo
        what="PDF səhifələrini düzgün istiqamətə döndərir. Hər səhifəni ayrı və ya hamısını birdən 90°, 180°, 270° fırlatmaq mümkündür."
        whenToUse={[
          "Yan çevrilmiş skan edilmiş səhifələri düzəltmək",
          "Telefonla çəkilib səhv istiqamətdə olan səhifələri çevirmək",
          "Albom (landscape) formatlı səhifələri portrait-ə çevirmək",
          "Çap üçün düzgün istiqamət vermək",
        ]}
        howSteps={[
          "PDF faylı seç",
          "Hər səhifəyə bas — hər kliklə 90° döndərir",
          "Və ya \"Hamısını döndər\" düyməsini istifadə et, sonra \"Tətbiq et\"",
        ]}
      />
    </div>
  );
}
