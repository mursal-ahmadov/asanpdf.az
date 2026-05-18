import exifr from "exifr";

export type NormalizedImage = {
  bytes: Uint8Array;
  type: "jpeg" | "png";
  width: number;
  height: number;
};

/**
 * Loads an image file, reads its EXIF orientation, applies the rotation/mirror
 * via canvas, and returns clean pixel bytes ready to embed in a PDF.
 *
 * Solves the iPhone Safari bug where photos taken in portrait mode appear
 * sideways in the generated PDF because pdf-lib does not read EXIF.
 *
 * JPEG → JPEG (re-encoded at quality 0.95, EXIF stripped)
 * PNG → PNG (PNG has no EXIF orientation, just passes through canvas)
 */
export async function loadImageNormalized(file: File): Promise<NormalizedImage> {
  const isPng = file.type === "image/png" || /\.png$/i.test(file.name);

  let orientation = 1;
  if (!isPng) {
    try {
      const exif = await exifr.parse(file, { pick: ["Orientation"] });
      if (exif && typeof exif.Orientation === "number") {
        orientation = exif.Orientation;
      }
    } catch {
      // No EXIF → assume normal orientation
    }
  }

  const img = await loadHTMLImage(file);
  const canvas = drawWithOrientation(img, orientation);

  const outType = isPng ? "image/png" : "image/jpeg";
  const quality = isPng ? undefined : 0.95;
  const blob = await canvasToBlob(canvas, outType, quality);
  const bytes = new Uint8Array(await blob.arrayBuffer());

  return {
    bytes,
    type: isPng ? "png" : "jpeg",
    width: canvas.width,
    height: canvas.height,
  };
}

function loadHTMLImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image failed to load"));
    };
    img.src = url;
  });
}

function drawWithOrientation(img: HTMLImageElement, orientation: number): HTMLCanvasElement {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const canvas = document.createElement("canvas");
  const swapped = orientation >= 5 && orientation <= 8;
  canvas.width = swapped ? h : w;
  canvas.height = swapped ? w : h;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  switch (orientation) {
    case 2: // Mirror horizontal
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      break;
    case 3: // 180°
      ctx.translate(w, h);
      ctx.rotate(Math.PI);
      break;
    case 4: // Mirror vertical
      ctx.translate(0, h);
      ctx.scale(1, -1);
      break;
    case 5: // Transpose (mirror horizontal + 270° CW)
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      break;
    case 6: // 90° CW
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -h);
      break;
    case 7: // Transverse (mirror horizontal + 90° CW)
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(w, -h);
      ctx.scale(-1, 1);
      break;
    case 8: // 270° CW
      ctx.rotate(-0.5 * Math.PI);
      ctx.translate(-w, 0);
      break;
    // case 1 and default: no transformation
  }

  ctx.drawImage(img, 0, 0);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("canvas.toBlob returned null"));
      },
      type,
      quality
    );
  });
}
