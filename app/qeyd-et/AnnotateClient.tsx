"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import FileDrop from "../components/FileDrop";
import ToolHeader from "../components/ToolHeader";
import ToolInfo from "../components/ToolInfo";
import { downloadBlob } from "../lib/download";

type Tool = "marker" | "circle" | "pen";

type ColorOption = { name: string; hex: string };

const COLORS: ColorOption[] = [
  { name: "Sarı",      hex: "#facc15" },
  { name: "Yaşıl",     hex: "#22c55e" },
  { name: "Çəhrayı",   hex: "#ec4899" },
  { name: "Mavi",      hex: "#3b82f6" },
  { name: "Qırmızı",   hex: "#ef4444" },
  { name: "Bənövşəyi", hex: "#a855f7" },
  { name: "Narıncı",   hex: "#f97316" },
  { name: "Qara",      hex: "#000000" },
];

type Point = { x: number; y: number };

type MarkerAnn  = { id: string; type: "marker"; pageIndex: number; color: string; points: Point[]; strokeWidth: number };
type CircleAnn  = { id: string; type: "circle"; pageIndex: number; color: string; cx: number; cy: number; rx: number; ry: number; strokeWidth: number };
type PenAnn     = { id: string; type: "pen";    pageIndex: number; color: string; points: Point[]; strokeWidth: number };

type Annotation = MarkerAnn | CircleAnn | PenAnn;

const MARKER_WIDTH = 16; // PDF points — thick highlighter stroke
const MARKER_OPACITY_HEX = "55"; // ~33% — translucent overlay

type PdfJsLib = typeof import("pdfjs-dist");
type PdfJsDoc = Awaited<ReturnType<PdfJsLib["getDocument"]>["promise"]>;

function hexToPdfRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return rgb(r, g, b);
}

export default function AnnotateClient() {
  const [file, setFile] = useState<File | null>(null);
  const [originalBytes, setOriginalBytes] = useState<ArrayBuffer | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PdfJsDoc | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);

  const [tool, setTool] = useState<Tool>("marker");
  const [color, setColor] = useState<string>(COLORS[0].hex);
  const [strokeWidth, setStrokeWidth] = useState<number>(3);

  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [redoStack, setRedoStack] = useState<Annotation[]>([]);
  const [drafting, setDrafting] = useState<Annotation | null>(null);
  const draftStartRef = useRef<Point | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);

  const scaleRef = useRef<number>(1);
  const pageWidthRef = useRef<number>(0);
  const pageHeightRef = useRef<number>(0);

  const onPick = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    setError(null);
    setAnnotations([]);
    setRedoStack([]);
    setPageIndex(0);
    try {
      const buf = await f.arrayBuffer();
      setOriginalBytes(buf);
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      // Clone buffer because pdfjs detaches it
      const cloneForPdfJs = buf.slice(0);
      const doc = await pdfjs.getDocument({ data: cloneForPdfJs }).promise;
      setPdfDoc(doc);
      setPageCount(doc.numPages);
    } catch (e) {
      console.error(e);
      setError("PDF oxunmadı.");
      setFile(null);
      setPdfDoc(null);
    }
  };

  const renderPage = useCallback(async () => {
    if (!pdfDoc) return;
    const container = containerRef.current;
    const pdfCanvas = pdfCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (!container || !pdfCanvas || !drawCanvas) return;

    const page = await pdfDoc.getPage(pageIndex + 1);
    const unscaled = page.getViewport({ scale: 1 });
    pageWidthRef.current = unscaled.width;
    pageHeightRef.current = unscaled.height;

    const containerWidth = Math.max(280, container.clientWidth - 4);
    const targetScale = Math.min(containerWidth / unscaled.width, 2.5);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderScale = targetScale * dpr;
    scaleRef.current = targetScale;
    const viewport = page.getViewport({ scale: renderScale });

    const cssWidth = unscaled.width * targetScale;
    const cssHeight = unscaled.height * targetScale;

    pdfCanvas.width = viewport.width;
    pdfCanvas.height = viewport.height;
    pdfCanvas.style.width = `${cssWidth}px`;
    pdfCanvas.style.height = `${cssHeight}px`;
    drawCanvas.width = viewport.width;
    drawCanvas.height = viewport.height;
    drawCanvas.style.width = `${cssWidth}px`;
    drawCanvas.style.height = `${cssHeight}px`;

    const ctx = pdfCanvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pdfCanvas.width, pdfCanvas.height);
    await page.render({ canvasContext: ctx, viewport, canvas: pdfCanvas }).promise;
  }, [pdfDoc, pageIndex]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  useEffect(() => {
    const onResize = () => renderPage();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [renderPage]);

  const redrawOverlay = useCallback(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = scaleRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const s = scale * dpr;
    const pageHeight = pageHeightRef.current;

    const list: Annotation[] = annotations.filter((a) => a.pageIndex === pageIndex);
    if (drafting && drafting.pageIndex === pageIndex) list.push(drafting);

    for (const a of list) {
      if (a.type === "marker") {
        if (a.points.length < 2) continue;
        ctx.strokeStyle = a.color + MARKER_OPACITY_HEX;
        ctx.lineWidth = a.strokeWidth * s;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        a.points.forEach((p, i) => {
          const cx = p.x * s;
          const cy = (pageHeight - p.y) * s;
          if (i === 0) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        });
        ctx.stroke();
      } else if (a.type === "circle") {
        ctx.strokeStyle = a.color;
        ctx.lineWidth = a.strokeWidth * s;
        ctx.beginPath();
        ctx.ellipse(a.cx * s, (pageHeight - a.cy) * s, a.rx * s, a.ry * s, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (a.type === "pen") {
        if (a.points.length < 2) continue;
        ctx.strokeStyle = a.color;
        ctx.lineWidth = a.strokeWidth * s;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        a.points.forEach((p, i) => {
          const cx = p.x * s;
          const cy = (pageHeight - p.y) * s;
          if (i === 0) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        });
        ctx.stroke();
      }
    }
  }, [annotations, pageIndex, drafting]);

  useEffect(() => {
    redrawOverlay();
  }, [redrawOverlay]);

  // Pointer → PDF coordinates
  const eventToPdfCoords = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const cssX = e.clientX - rect.left;
    const cssY = e.clientY - rect.top;
    const scale = scaleRef.current;
    const pageHeight = pageHeightRef.current;
    return { x: cssX / scale, y: pageHeight - cssY / scale };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!pdfDoc) return;
    e.preventDefault();
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    const p = eventToPdfCoords(e);
    draftStartRef.current = p;
    const id = crypto.randomUUID();
    if (tool === "marker") {
      setDrafting({ id, type: "marker", pageIndex, color, points: [p], strokeWidth: MARKER_WIDTH });
    } else if (tool === "circle") {
      setDrafting({ id, type: "circle", pageIndex, color, cx: p.x, cy: p.y, rx: 0, ry: 0, strokeWidth });
    } else {
      setDrafting({ id, type: "pen", pageIndex, color, points: [p], strokeWidth });
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drafting || !draftStartRef.current) return;
    e.preventDefault();
    const start = draftStartRef.current;
    const cur = eventToPdfCoords(e);
    if (drafting.type === "marker") {
      setDrafting({ ...drafting, points: [...drafting.points, cur] });
    } else if (drafting.type === "circle") {
      const cx = (start.x + cur.x) / 2;
      const cy = (start.y + cur.y) / 2;
      const rx = Math.abs(cur.x - start.x) / 2;
      const ry = Math.abs(cur.y - start.y) / 2;
      setDrafting({ ...drafting, cx, cy, rx, ry });
    } else {
      setDrafting({ ...drafting, points: [...drafting.points, cur] });
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drafting) return;
    e.preventDefault();
    // Filter out tiny accidental marks
    let keep = true;
    if (drafting.type === "marker") {
      if (drafting.points.length < 2) keep = false;
    } else if (drafting.type === "circle") {
      if (drafting.rx < 2 && drafting.ry < 2) keep = false;
    } else if (drafting.type === "pen") {
      if (drafting.points.length < 2) keep = false;
    }
    if (keep) {
      setAnnotations((prev) => [...prev, drafting]);
      setRedoStack([]);
    }
    setDrafting(null);
    draftStartRef.current = null;
  };

  const undo = () => {
    setAnnotations((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setRedoStack((r) => [...r, last]);
      return prev.slice(0, -1);
    });
  };

  const redo = () => {
    setRedoStack((stack) => {
      if (stack.length === 0) return stack;
      const last = stack[stack.length - 1];
      setAnnotations((a) => [...a, last]);
      return stack.slice(0, -1);
    });
  };

  const clearCurrentPage = () => {
    if (!confirm(`Bu səhifədəki bütün qeydləri silmək istəyirsən?`)) return;
    setAnnotations((prev) => prev.filter((a) => a.pageIndex !== pageIndex));
  };

  const applyAndDownload = async () => {
    if (!originalBytes || !file) return;
    setBusy(true);
    setError(null);
    try {
      const cloneForPdfLib = originalBytes.slice(0);
      const doc = await PDFDocument.load(cloneForPdfLib);
      const pages = doc.getPages();

      for (const a of annotations) {
        const page = pages[a.pageIndex];
        if (!page) continue;
        const color = hexToPdfRgb(a.color);
        if (a.type === "marker") {
          for (let i = 1; i < a.points.length; i++) {
            const start = a.points[i - 1];
            const end = a.points[i];
            page.drawLine({
              start: { x: start.x, y: start.y },
              end: { x: end.x, y: end.y },
              thickness: a.strokeWidth,
              color,
              opacity: 0.35,
              lineCap: 1,
            });
          }
        } else if (a.type === "circle") {
          page.drawEllipse({
            x: a.cx,
            y: a.cy,
            xScale: a.rx,
            yScale: a.ry,
            borderColor: color,
            borderWidth: a.strokeWidth,
            opacity: 0,
          });
        } else if (a.type === "pen") {
          for (let i = 1; i < a.points.length; i++) {
            const start = a.points[i - 1];
            const end = a.points[i];
            page.drawLine({
              start: { x: start.x, y: start.y },
              end: { x: end.x, y: end.y },
              thickness: a.strokeWidth,
              color,
              lineCap: 1, // Round cap for smoother freehand
            });
          }
        }
      }

      const bytes = await doc.save();
      const buf = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(buf).set(bytes);
      const baseName = file.name.replace(/\.pdf$/i, "");
      downloadBlob(new Blob([buf], { type: "application/pdf" }), `${baseName}-qeydler.pdf`);
    } catch (e) {
      console.error(e);
      setError("Yazma zamanı xəta baş verdi.");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPdfDoc(null);
    setOriginalBytes(null);
    setPageCount(0);
    setPageIndex(0);
    setAnnotations([]);
    setRedoStack([]);
    setDrafting(null);
  };

  if (!file || !pdfDoc) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ToolHeader
          title="PDF üzərində qeydlər"
          description="PDF-də markerlə vurğula, dairə içinə al, üzərində xətt çək. Hər şey brauzerdə işləyir, fayl heç yerə yüklənmir."
        />
        <FileDrop onFiles={onPick} multiple={false} label="PDF seç" hint="bir fayl" />
        {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}

        <ToolInfo
          what="PDF-i redaktə etmədən üstündə işarələr əlavə et: sarı/yaşıl marker, dairə, sərbəst xətt. Çoxlu rəng seçimi, hər səhifə üçün ayrı qeydlər."
          whenToUse={[
            "Müqavilədə vacib hissələri vurğulamaq",
            "Tələbə referatında diqqət çəkilən yerləri işarələmək",
            "Səhv olan hissələri qırmızı ilə dairə içinə almaq",
            "PDF üzərinə əl yazısı və ya imza qoymaq",
          ]}
          howSteps={[
            "PDF faylı seç",
            "Yuxarıdan alət seç (Marker, Dairə, və ya Qələm) və rəng seç",
            "PDF üstündə sürüşdür, sonra \"Tətbiq et və yüklə\"",
          ]}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8 pb-28 sm:pb-8">
      {/* Header info */}
      <div className="px-2 sm:px-0 mb-3 sm:mb-4 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium truncate text-sm sm:text-base">{file.name}</p>
          <p className="text-xs text-muted">{pageCount} səhifə · {annotations.length} qeyd</p>
        </div>
        <button
          onClick={reset}
          className="text-xs sm:text-sm text-muted hover:text-red-600 shrink-0"
        >
          Dəyişdir
        </button>
      </div>

      {/* Desktop toolbar */}
      <div className="hidden sm:flex flex-wrap items-center gap-3 p-3 bg-white border border-border rounded-xl mb-4 sticky top-20 z-30 shadow-sm">
        <div className="flex gap-1 border-r border-border pr-3">
          <ToolButton active={tool === "marker"} onClick={() => setTool("marker")} icon="🖍" label="Marker" />
          <ToolButton active={tool === "circle"} onClick={() => setTool("circle")} icon="⭕" label="Dairə" />
          <ToolButton active={tool === "pen"} onClick={() => setTool("pen")} icon="✏️" label="Qələm" />
        </div>

        <div className="flex gap-1.5 items-center border-r border-border pr-3">
          {COLORS.map((c) => (
            <ColorSwatch key={c.hex} color={c} active={color === c.hex} onClick={() => setColor(c.hex)} />
          ))}
        </div>

        {(tool === "circle" || tool === "pen") && (
          <div className="flex gap-1 items-center border-r border-border pr-3">
            <span className="text-xs text-muted mr-1">Qalınlıq:</span>
            {[2, 3, 5, 8].map((w) => (
              <button
                key={w}
                onClick={() => setStrokeWidth(w)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition
                  ${strokeWidth === w ? "bg-blue-100 ring-2 ring-accent" : "hover:bg-gray-100"}`}
              >
                <span className="rounded-full bg-gray-700 block" style={{ width: w + 2, height: w + 2 }} />
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-1 ml-auto">
          <IconButton onClick={undo} disabled={annotations.length === 0} title="Geri (Ctrl+Z)">↶</IconButton>
          <IconButton onClick={redo} disabled={redoStack.length === 0} title="İrəli (Ctrl+Shift+Z)">↷</IconButton>
          <IconButton onClick={clearCurrentPage} title="Bu səhifəni təmizlə">🗑</IconButton>
        </div>
      </div>

      {/* Page navigator */}
      <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
        <button
          onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
          disabled={pageIndex === 0}
          className="px-3 py-1.5 rounded-lg border border-border hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
          ← Əvvəlki
        </button>
        <span className="text-sm font-medium tabular-nums">
          {pageIndex + 1} / {pageCount}
        </span>
        <button
          onClick={() => setPageIndex((i) => Math.min(pageCount - 1, i + 1))}
          disabled={pageIndex === pageCount - 1}
          className="px-3 py-1.5 rounded-lg border border-border hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
          Növbəti →
        </button>
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        className="relative mx-auto bg-gray-50 rounded-xl overflow-hidden border border-border"
        style={{ touchAction: "none" }}
      >
        <div className="relative flex items-center justify-center p-2">
          <canvas
            ref={pdfCanvasRef}
            className="block max-w-full h-auto rounded shadow-sm"
          />
          <canvas
            ref={drawCanvasRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="absolute"
            style={{
              touchAction: "none",
              cursor:
                tool === "marker" ? "crosshair" :
                tool === "circle" ? "crosshair" :
                "crosshair",
            }}
          />
        </div>
      </div>

      {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}

      {/* Apply button — desktop */}
      <div className="hidden sm:block mt-6 text-center">
        <button
          onClick={applyAndDownload}
          disabled={busy || annotations.length === 0}
          className="px-8 py-3 bg-accent text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {busy ? "İşlənir..." : "Tətbiq et və yüklə"}
        </button>
      </div>

      {/* Mobile sticky toolbar */}
      <div className="sm:hidden fixed left-0 right-0 bottom-0 z-40 bg-white border-t border-border shadow-lg">
        <div className="flex items-center gap-1 px-2 py-2 overflow-x-auto">
          <ToolButton active={tool === "marker"} onClick={() => setTool("marker")} icon="🖍" label="Marker" compact />
          <ToolButton active={tool === "circle"} onClick={() => setTool("circle")} icon="⭕" label="Dairə" compact />
          <ToolButton active={tool === "pen"} onClick={() => setTool("pen")} icon="✏️" label="Qələm" compact />
          <div className="w-px h-8 bg-border mx-1" />
          {COLORS.map((c) => (
            <ColorSwatch key={c.hex} color={c} active={color === c.hex} onClick={() => setColor(c.hex)} />
          ))}
          <div className="w-px h-8 bg-border mx-1" />
          <IconButton onClick={undo} disabled={annotations.length === 0}>↶</IconButton>
          <IconButton onClick={redo} disabled={redoStack.length === 0}>↷</IconButton>
        </div>
        <div className="px-3 pb-3 pt-1">
          <button
            onClick={applyAndDownload}
            disabled={busy || annotations.length === 0}
            className="w-full px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {busy ? "İşlənir..." : `Tətbiq et və yüklə${annotations.length ? ` (${annotations.length})` : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function ToolButton({
  active,
  onClick,
  icon,
  label,
  compact = false,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition shrink-0
        ${active
          ? "bg-blue-50 text-accent ring-2 ring-accent"
          : "hover:bg-gray-100 text-gray-700"
        }`}
    >
      <span className="text-base">{icon}</span>
      {!compact && <span>{label}</span>}
    </button>
  );
}

function ColorSwatch({
  color,
  active,
  onClick,
}: {
  color: ColorOption;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={color.name}
      className={`w-8 h-8 rounded-full transition shrink-0 ring-offset-2
        ${active ? "ring-2 ring-accent scale-110" : "ring-1 ring-gray-300 hover:ring-gray-500"}`}
      style={{ backgroundColor: color.hex }}
      aria-label={`Rəng: ${color.name}`}
    />
  );
}

function IconButton({
  onClick,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="w-9 h-9 rounded-lg flex items-center justify-center text-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition shrink-0"
    >
      {children}
    </button>
  );
}
