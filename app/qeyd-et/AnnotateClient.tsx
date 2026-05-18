"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PDFDocument, rgb } from "pdf-lib";
import FileDrop from "../components/FileDrop";
import ToolHeader from "../components/ToolHeader";
import ToolInfo from "../components/ToolInfo";
import { downloadBlob } from "../lib/download";

type Tool = "marker" | "circle" | "pen";

type ColorOption = { name: string; hex: string };

const COLORS: ColorOption[] = [
  { name: "Sarı",         hex: "#FFEB3B" },
  { name: "Kəhraba",      hex: "#FFC107" },
  { name: "Narıncı",      hex: "#FF9800" },
  { name: "Qırmızı",      hex: "#F44336" },
  { name: "Çəhrayı",      hex: "#E91E63" },
  { name: "Bənövşəyi",    hex: "#9C27B0" },
  { name: "İndigo",       hex: "#3F51B5" },
  { name: "Mavi",         hex: "#2196F3" },
  { name: "Mavi-yaşıl",   hex: "#00BCD4" },
  { name: "Yaşıl",        hex: "#4CAF50" },
  { name: "Açıq yaşıl",   hex: "#8BC34A" },
  { name: "Qəhvəyi",      hex: "#795548" },
  { name: "Boz",          hex: "#607D8B" },
  { name: "Qara",         hex: "#000000" },
];

const MARKER_WIDTHS = [10, 16, 24, 32];
const STROKE_WIDTHS = [2, 4, 7, 11, 16];

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

type Point = { x: number; y: number };

type MarkerAnn  = { id: string; type: "marker"; pageIndex: number; color: string; points: Point[]; strokeWidth: number };
type CircleAnn  = { id: string; type: "circle"; pageIndex: number; color: string; cx: number; cy: number; rx: number; ry: number; strokeWidth: number };
type PenAnn     = { id: string; type: "pen";    pageIndex: number; color: string; points: Point[]; strokeWidth: number };

type Annotation = MarkerAnn | CircleAnn | PenAnn;

type PdfJsLib = typeof import("pdfjs-dist");
type PdfJsDoc = Awaited<ReturnType<PdfJsLib["getDocument"]>["promise"]>;

const MARKER_OPACITY_HEX = "55";
const MARKER_OPACITY_PDF = 0.35;

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

  const [markerWidth, setMarkerWidth] = useState(16);
  const [penWidth, setPenWidth] = useState(4);
  const [circleWidth, setCircleWidth] = useState(4);

  const currentWidth = tool === "marker" ? markerWidth : tool === "circle" ? circleWidth : penWidth;
  const setCurrentWidth = (w: number) => {
    if (tool === "marker") setMarkerWidth(w);
    else if (tool === "circle") setCircleWidth(w);
    else setPenWidth(w);
  };
  const widthOptions = tool === "marker" ? MARKER_WIDTHS : STROKE_WIDTHS;

  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [redoStack, setRedoStack] = useState<Annotation[]>([]);
  const [drafting, setDrafting] = useState<Annotation | null>(null);
  const draftStartRef = useRef<Point | null>(null);

  // Pinch zoom / pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  zoomRef.current = zoom;
  const panRef = useRef<Point>({ x: 0, y: 0 });
  panRef.current = pan;

  const activePointersRef = useRef<Map<number, Point>>(new Map());
  const pinchStartRef = useRef<{
    dist: number;
    midClient: Point;
    midLocal: Point;
    startZoom: number;
    startPan: Point;
  } | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<HTMLDivElement>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);

  const scaleRef = useRef<number>(1);
  const pageHeightRef = useRef<number>(0);

  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const onPick = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    setError(null);
    setAnnotations([]);
    setRedoStack([]);
    setPageIndex(0);
    resetZoom();
    try {
      const buf = await f.arrayBuffer();
      setOriginalBytes(buf);
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
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

  useEffect(() => { renderPage(); }, [renderPage]);

  // Reset zoom when changing pages
  useEffect(() => { resetZoom(); }, [pageIndex]);

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

  useEffect(() => { redrawOverlay(); }, [redrawOverlay]);

  // Convert pointer screen coordinates to PDF coordinates, accounting for zoom/pan
  const eventToPdfCoords = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    // rect already reflects CSS transform (scale + translate),
    // so divide by zoom to get position in natural CSS pixel space
    const cssX = (e.clientX - rect.left) / zoomRef.current;
    const cssY = (e.clientY - rect.top) / zoomRef.current;
    const scale = scaleRef.current;
    const pageHeight = pageHeightRef.current;
    return { x: cssX / scale, y: pageHeight - cssY / scale };
  };

  const startPinch = () => {
    const pts = [...activePointersRef.current.values()];
    if (pts.length < 2) return;
    const container = transformRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const midClientX = (pts[0].x + pts[1].x) / 2;
    const midClientY = (pts[0].y + pts[1].y) / 2;
    const startZoom = zoomRef.current;
    const startPan = { ...panRef.current };
    // Convert midpoint to wrapper-local coordinates BEFORE the current transform
    const midLocalX = (midClientX - rect.left - startPan.x) / startZoom;
    const midLocalY = (midClientY - rect.top - startPan.y) / startZoom;
    pinchStartRef.current = {
      dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y),
      midClient: { x: midClientX, y: midClientY },
      midLocal: { x: midLocalX, y: midLocalY },
      startZoom,
      startPan,
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!pdfDoc) return;
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);

    if (activePointersRef.current.size >= 2) {
      // Second finger arrived — cancel in-progress drawing and start pinch
      if (drafting) {
        setDrafting(null);
        draftStartRef.current = null;
      }
      startPinch();
      e.preventDefault();
      return;
    }

    // Single pointer — drawing
    if (pinchStartRef.current) return; // safety
    e.preventDefault();
    const p = eventToPdfCoords(e);
    draftStartRef.current = p;
    const id = crypto.randomUUID();
    if (tool === "marker") {
      setDrafting({ id, type: "marker", pageIndex, color, points: [p], strokeWidth: markerWidth });
    } else if (tool === "circle") {
      setDrafting({ id, type: "circle", pageIndex, color, cx: p.x, cy: p.y, rx: 0, ry: 0, strokeWidth: circleWidth });
    } else {
      setDrafting({ id, type: "pen", pageIndex, color, points: [p], strokeWidth: penWidth });
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activePointersRef.current.has(e.pointerId)) {
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    // Pinch zoom in progress
    if (pinchStartRef.current && activePointersRef.current.size >= 2) {
      e.preventDefault();
      const pts = [...activePointersRef.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const midX = (pts[0].x + pts[1].x) / 2;
      const midY = (pts[0].y + pts[1].y) / 2;
      const { dist: startDist, midLocal, startZoom } = pinchStartRef.current;
      const ratio = dist / startDist;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, startZoom * ratio));

      // Anchor zoom around finger midpoint
      const container = transformRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const newPanX = midX - rect.left - newZoom * midLocal.x;
      const newPanY = midY - rect.top - newZoom * midLocal.y;
      setZoom(newZoom);
      setPan({ x: newPanX, y: newPanY });
      return;
    }

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
    activePointersRef.current.delete(e.pointerId);

    // Still pinching with remaining finger? Reset pinch state when count drops below 2
    if (activePointersRef.current.size < 2) {
      pinchStartRef.current = null;
    }

    if (!drafting) return;
    e.preventDefault();
    let keep = true;
    if (drafting.type === "circle") {
      if (drafting.rx < 2 && drafting.ry < 2) keep = false;
    } else {
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
              opacity: MARKER_OPACITY_PDF,
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
              lineCap: 1,
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
    resetZoom();
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
          what="PDF-i redaktə etmədən üstündə işarələr əlavə et: marker, dairə, sərbəst xətt. 14 hazır rəng + xüsusi rəng seçimi, hər səhifə üçün ayrı qeydlər. Mobildə 2 barmaqla zoom edirsən."
          whenToUse={[
            "Müqavilədə vacib hissələri vurğulamaq",
            "Tələbə referatında diqqət çəkilən yerləri işarələmək",
            "Səhv olan hissələri qırmızı ilə dairə içinə almaq",
            "PDF üzərinə əl yazısı və ya imza qoymaq",
          ]}
          howSteps={[
            "PDF faylı seç",
            "Alət, rəng və qalınlıq seç",
            "PDF üstündə sürüşdür, sonra \"Tətbiq et və yüklə\"",
          ]}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8 pb-32 sm:pb-8">
      {/* File info */}
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

        <ColorPicker value={color} onChange={setColor} />
        <WidthPicker value={currentWidth} onChange={setCurrentWidth} options={widthOptions} />

        <div className="flex gap-1 ml-auto">
          <IconButton onClick={undo} disabled={annotations.length === 0} title="Geri">↶</IconButton>
          <IconButton onClick={redo} disabled={redoStack.length === 0} title="İrəli">↷</IconButton>
          <IconButton onClick={clearCurrentPage} title="Bu səhifəni təmizlə">🗑</IconButton>
        </div>
      </div>

      {/* Page navigator + zoom info */}
      <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4 flex-wrap">
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
        {zoom > 1.01 && (
          <button
            onClick={resetZoom}
            className="px-3 py-1.5 rounded-lg bg-blue-50 border border-accent text-accent hover:bg-blue-100 text-sm font-medium"
          >
            🔍 {(zoom).toFixed(1)}x — sıfırla
          </button>
        )}
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        className="relative mx-auto bg-gray-50 rounded-xl overflow-hidden border border-border"
      >
        <div className="relative flex items-center justify-center p-2 overflow-hidden">
          <div
            ref={transformRef}
            className="relative"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
            }}
          >
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
              className="absolute left-0 top-0"
              style={{ touchAction: "none", cursor: "crosshair" }}
            />
          </div>
        </div>
      </div>

      <p className="sm:hidden text-center text-xs text-muted mt-2">
        💡 2 barmaqla — yaxınlaşdır və ya uzaqlaşdır
      </p>

      {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}

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
        <div className="flex items-center gap-1.5 px-2 py-2 overflow-x-auto">
          <ToolButton active={tool === "marker"} onClick={() => setTool("marker")} icon="🖍" label="Marker" compact />
          <ToolButton active={tool === "circle"} onClick={() => setTool("circle")} icon="⭕" label="Dairə" compact />
          <ToolButton active={tool === "pen"} onClick={() => setTool("pen")} icon="✏️" label="Qələm" compact />
          <div className="w-px h-8 bg-border mx-0.5 shrink-0" />
          <ColorPicker value={color} onChange={setColor} compact />
          <WidthPicker value={currentWidth} onChange={setCurrentWidth} options={widthOptions} compact />
          <div className="w-px h-8 bg-border mx-0.5 shrink-0" />
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

type PopupAnchor = { left: number; bottom: number; top: number };

function usePopup() {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<PopupAnchor | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const openAt = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setAnchor({ left: r.left, bottom: window.innerHeight - r.top, top: r.bottom });
    setOpen(true);
  };

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: Event) => {
      const t = e.target as Node;
      if (buttonRef.current?.contains(t)) return;
      if (popupRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onScroll = () => setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    window.addEventListener("resize", onScroll);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  return { open, anchor, buttonRef, popupRef, openAt, close };
}

function ColorPicker({
  value,
  onChange,
  compact = false,
}: {
  value: string;
  onChange: (color: string) => void;
  compact?: boolean;
}) {
  const { open, anchor, buttonRef, popupRef, openAt, close } = usePopup();

  return (
    <div className="shrink-0">
      <button
        ref={buttonRef}
        onClick={() => (open ? close() : openAt())}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition border border-border"
        aria-label="Rəng seç"
      >
        <span
          className="w-5 h-5 rounded-full ring-1 ring-gray-300 inline-block"
          style={{ backgroundColor: value }}
        />
        {!compact && <span className="text-sm font-medium">Rəng</span>}
        <span className="text-xs text-muted">▾</span>
      </button>

      {open && anchor && typeof window !== "undefined" && createPortal(
        <div
          ref={popupRef}
          style={
            compact
              ? { position: "fixed", left: Math.max(8, Math.min(window.innerWidth - 264, anchor.left)), bottom: anchor.bottom + 8, zIndex: 100 }
              : { position: "fixed", left: Math.max(8, Math.min(window.innerWidth - 264, anchor.left)), top: anchor.top + 8, zIndex: 100 }
          }
          className="p-3 bg-white border border-border rounded-xl shadow-2xl w-64"
        >
          <p className="text-xs text-muted mb-2">Hazır rənglər</p>
          <div className="grid grid-cols-7 gap-1.5 mb-3">
            {COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => { onChange(c.hex); close(); }}
                title={c.name}
                className={`w-7 h-7 rounded-full transition
                  ${value === c.hex ? "ring-2 ring-accent ring-offset-2 scale-110" : "ring-1 ring-gray-300 hover:scale-110"}`}
                style={{ backgroundColor: c.hex }}
                aria-label={c.name}
              />
            ))}
          </div>
          <label className="flex items-center justify-between gap-2 pt-3 border-t border-border">
            <span className="text-xs text-muted">Xüsusi rəng:</span>
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-12 h-8 rounded cursor-pointer border border-border"
              aria-label="Xüsusi rəng seç"
            />
          </label>
        </div>,
        document.body
      )}
    </div>
  );
}

function WidthPicker({
  value,
  onChange,
  options,
  compact = false,
}: {
  value: number;
  onChange: (w: number) => void;
  options: number[];
  compact?: boolean;
}) {
  const { open, anchor, buttonRef, popupRef, openAt, close } = usePopup();

  const previewSize = (w: number) => Math.min(Math.max(w + 2, 4), 22);

  return (
    <div className="shrink-0">
      <button
        ref={buttonRef}
        onClick={() => (open ? close() : openAt())}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition border border-border"
        aria-label="Qalınlıq seç"
      >
        <span
          className="block rounded-full bg-gray-900"
          style={{ width: previewSize(value), height: previewSize(value) }}
        />
        {!compact && <span className="text-sm font-medium">Qalınlıq</span>}
        <span className="text-xs text-muted">▾</span>
      </button>

      {open && anchor && typeof window !== "undefined" && createPortal(
        <div
          ref={popupRef}
          style={
            compact
              ? { position: "fixed", left: Math.max(8, anchor.left), bottom: anchor.bottom + 8, zIndex: 100 }
              : { position: "fixed", left: Math.max(8, anchor.left), top: anchor.top + 8, zIndex: 100 }
          }
          className="p-3 bg-white border border-border rounded-xl shadow-2xl"
        >
          <p className="text-xs text-muted mb-2">Qalınlıq</p>
          <div className="flex items-center gap-1.5">
            {options.map((w) => (
              <button
                key={w}
                onClick={() => { onChange(w); close(); }}
                title={`${w} pt`}
                className={`w-11 h-11 rounded-lg flex items-center justify-center transition
                  ${value === w ? "bg-blue-100 ring-2 ring-accent" : "hover:bg-gray-100"}`}
              >
                <span
                  className="block rounded-full bg-gray-900"
                  style={{ width: previewSize(w), height: previewSize(w) }}
                />
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
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
