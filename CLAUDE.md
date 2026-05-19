# AsanPDF.com — Layihə Sənədləri (AI üçün)

Bu sənəd növbəti AI sessiyaları üçündür. Layihə tarixçəsi, qərarlar, texniki detallar və iş axını burada toplanıb.

---

## 1. Layihə nədir?

**AsanPDF.com** — Azərbaycan dilində pulsuz onlayn PDF alətləri saytı. Hədəf: iLovePDF / SmallPDF / PDF24 kimi qlobal saytların **azərbaycandilli alternativi**.

**Sayt:** https://asanpdf.com (əsas) · https://asanpdf-az.vercel.app (yedek)
**Repo:** https://github.com/mursal-ahmadov/asanpdf.az (public)
**Sahibi:** mursal.ahmadov@gmail.com

## 2. Niyyət və prinsiplər (DƏYİŞMƏZ!)

Bu prinsiplər layihənin əsasıdır — istənilən qərar bunlardan keçməlidir:

1. **Faylların məxfiliyi** — PDF əməliyyatları **yalnız brauzerdə** baş verir. Heç bir fayl heç bir serverə yüklənmir. Bu həm marketinq mesajıdır, həm də texniki həqiqətdir (`pdf-lib`, `pdfjs-dist` brauzerdə işləyir).
2. **Pulsuzdur** — qeydiyyat yox, limit yox, gizli ödəniş yox. Vəd olaraq verilmişdir.
3. **Reklamsız** — Sahibi pul qazanmağı yox, insanlara fayda verməyi prioritetləşdirir. Reklam yox (ən azı ilk illərdə).
4. **Yalnız Azərbaycan dilində** — bütün UI mətnləri azərbaycanca. Multi-dil indi yoxdur, gələcəkdə də prioritet deyil.
5. **Modern və minimal dizayn** — ağ fon, mavi vurğu (`#2563eb`/`#3b82f6`), incə kölgə, yumşaq keçidlər.
6. **Sürətli və yüngül** — hər səhifə Vercel-də serverless, brauzerdə işləyir → 0 server xərci.

## 3. Sahibinin profili (əhəmiyyətlidir!)

- **Texniki bilik:** Programmer deyil. AI ilə kod yazır. Texniki detalları izah etmək lazımdır, sadə dildə.
- **Dil:** İstifadəçi ilə **azərbaycanca** danış. Kod sintaksisi, dəyişən adları ingiliscə olur (standartdır).
- **Yanaşma:** Çoxlu layihə yarımçıq buraxıb, bu səfər **bitirmək** istəyir. Pul motivasiyası ikincidir — əsas məqsəd **insanlara fayda vermək**.
- **Geri əlaqə stili:** Vizual yoxlayır, dərhal feedback verir ("kiçikdir", "böyütməyə dəyər"). Qısa cümlələrlə yazır.
- **Şəxsi məlumat istəmir:** Saytda öz adı, email, sosial şəbəkə **göstərilməsin** (Haqqımızda səhifəsində belə).

## 4. Texniki yığın

| Layer | Texnologiya | Versiya |
|-------|-------------|---------|
| Framework | Next.js (App Router) | 16.2.6 |
| Dil | TypeScript | 5+ |
| Stil | TailwindCSS v4 (CSS-first config) | 4+ |
| PDF kitabxanaları | `pdf-lib`, `pdfjs-dist` | latest |
| Faylsız upload | `react-dropzone` | latest |
| Analytics | `@vercel/analytics` | latest |
| Build | Turbopack (dev), Next.js (prod) | — |
| Node | 22.18.0 | — |
| Package manager | npm | 10.9.3 |

**Hosting:** Vercel (Free plan, hobby) — avtomatik deploy GitHub `main` branch-dən.
**DNS:** Cloudflare (Free plan) — domen təsdiqi gözlənilir.
**Domen:** `asanpdf.com` (Cloudflare Registrar-dan, ~$10/il). Cloudflare-də idarə olunur.

## 5. Qovluq strukturu

```
AsanPDF.az/
├── app/
│   ├── layout.tsx              # Root layout, header, footer, MobileNav, Analytics
│   ├── page.tsx                # Ana səhifə (7 alət kartı + üstünlüklər)
│   ├── globals.css             # Tailwind import, CSS variables, hover animasiyaları, nav-link
│   ├── icon.png                # Favicon (Next.js avtomatik xidmət edir)
│   ├── robots.ts               # Dinamik robots.txt
│   ├── sitemap.ts              # Dinamik sitemap.xml (Vercel URL env-dən)
│   │
│   ├── components/
│   │   ├── FileDrop.tsx        # Drag&drop fayl seçici (react-dropzone)
│   │   ├── ToolHeader.tsx      # Hər alət səhifəsinin başlığı
│   │   ├── ToolInfo.tsx        # 3 sütun: nə üçün, hansı hallarda, necə
│   │   └── MobileNav.tsx       # Hamburger + dropdown menyu
│   │
│   ├── lib/
│   │   └── download.ts         # downloadBlob() və formatSize() köməkçiləri
│   │
│   ├── birlesdir/page.tsx      # Merge PDF
│   ├── ayir/page.tsx           # Split PDF
│   ├── sehife-sil/page.tsx     # Delete pages
│   ├── cixar/page.tsx          # Extract pages
│   ├── donder/page.tsx         # Rotate pages
│   ├── sekil-to-pdf/page.tsx   # JPG/PNG → PDF
│   ├── pdf-to-sekil/page.tsx   # PDF → JPG
│   └── haqqimizda/page.tsx     # About page
│
├── public/
│   └── logo.png                # Header logosu (Image komponenti ilə)
│
├── next.config.ts              # Təhlükəsizlik başlıqları (CSP, HSTS, və s.)
├── package.json
├── tsconfig.json
├── postcss.config.mjs
└── CLAUDE.md                   # Bu sənəd
```

## 6. 9 PDF aləti (hamısı brauzerdə işləyir)

| URL | Funksiya | Texnologiya | Status |
|-----|----------|-------------|--------|
| `/birlesdir` | PDF birləşdir (Merge) | pdf-lib | ✅ |
| `/ayir` | PDF ayır (Split) | pdf-lib | ✅ |
| `/sehife-sil` | Səhifə sil | pdf-lib | ✅ |
| `/cixar` | Səhifə çıxar | pdf-lib | ✅ |
| `/donder` | Səhifə döndər | pdf-lib | ✅ |
| `/sekil-to-pdf` | Şəkil → PDF (EXIF düzəlişi ilə) | pdf-lib + exifr + canvas | ✅ |
| `/pdf-to-sekil` | PDF → JPG | pdfjs-dist (canvas) | ✅ |
| `/sixisdir` | PDF Sıxışdır (Compress) | pdfjs-dist + pdf-lib (rasterize → JPEG → embed) | ✅ |
| `/qeyd-et` | PDF üzərində qeyd et (marker, dairə, qələm) | pdfjs-dist (canvas overlay) + pdf-lib (drawEllipse / drawLine) | ✅ |

**Annotation qeydi (`/qeyd-et`)** — ən mürəkkəb UI-dir, son təkmilləşmələrlə:

- PDF səhifəsi pdfjs-dist ilə canvas-a render olunur, üst-üstə şəffaf overlay canvas qoyulur
- Annotation-lar PDF koordinatlarında saxlanır (Y oxu canvas top-down ↔ PDF bottom-up çevrilir)
- 3 alət: **marker** (sərbəst, geniş, translucent), **dairə** (drag bounding-box → ellipse), **qələm** (sərbəst, dəqiq)
- **Marker** indi qələm kimi sərbəst çəkilir — `drawLine` ilə `opacity: 0.35` istifadə olunur (köhnə drawRectangle yanaşması deyil). `MARKER_OPACITY_HEX = "55"` canvas-da, `MARKER_OPACITY_PDF = 0.35` PDF-də. Sabit MARKER_WIDTHS = [10, 16, 24, 32]
- **Dairə və qələm** üçün STROKE_WIDTHS = [2, 4, 7, 11, 16]; pdf-lib `drawEllipse({opacity: 0, borderOnly})` və ardıcıl `drawLine` seqmentləri
- Hər alət üçün strokeWidth ayrı state-də saxlanır (markerWidth/penWidth/circleWidth) — alət dəyişəndə seçimi unutmur
- **Pinch-to-zoom + pan** (1x – 4x): 2 barmaqla zoom, midpoint-də anchor; 2 barmaq sürüşdürəndə pan; çəkim zamanı 2-ci barmaq düşsə cızıq atılır. CSS `transform: translate(panX, panY) scale(zoom)` wrapper div-də. `eventToPdfCoords` zoom-a görə düzəlir
- **Color picker + Width picker** — düymə + dropdown panel. Hər ikisi `react-dom` `createPortal` ilə `document.body` səviyyəsində render olunur ki, mobil toolbar-ın `overflow-x-auto`-su onları kəsməsin. `getBoundingClientRect()` ilə dəqiq mövqe; outside-click / scroll / resize-da bağlanır; viewport-dan çıxmasın deyə left clamp olunur
- 14 hazır rəng (`#FFEB3B` əsl marker sarısı və s.) + native `<input type="color">` xüsusi rəng üçün
- Qalınlıq nümunə nöqtələri həmişə qara (`bg-gray-900`), rəngdən asılı deyil — vahid neytral göstərici
- Undo / redo stack, "səhifəni təmizlə" düyməsi, səhifələr arası naviqasiya, "zoom sıfırla" düyməsi (zoom > 1 olanda)
- Mobil üçün sticky bottom toolbar; desktop üçün sticky top toolbar

**pdfjs worker faylı:** `public/pdf.worker.min.mjs` — `node_modules/pdfjs-dist/build/`-dən kopyalandı. `?url` import sintaksisi production-da işləmir (Turbopack/Webpack uyğunsuzluğu). `pdfjs-dist` paketi yenilənəndə bu faylı **manual olaraq yenidən kopyala**:
```bash
cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdf.worker.min.mjs
```
Hər iki client (`sixisdir/CompressClient.tsx`, `pdf-to-sekil/PdfToImageClient.tsx`) belə qoşur:
```ts
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
```

**Sıxışdırma haqqında qeyd:** Hər səhifə pdfjs-dist ilə canvas-a render olunur, JPEG kimi seçilmiş keyfiyyətdə yenidən kompressiya edilir, sonra pdf-lib ilə yeni PDF qurulur. Bu o deməkdir ki, **mətn artıq seçilə bilməz** (şəkil olur). Bu trade-off istifadəçiyə açıqdır deyilmir, amma keyfiyyət presetləri belə dizayn olunub:
- `high` (144 DPI, JPEG 0.85): mətn aydın oxunur
- `medium` (110 DPI, JPEG 0.70): default, ən yaxşı balans
- `low` (80 DPI, JPEG 0.55): maksimum sıxma, mətn bir az bulanıq

**Hər alət səhifəsinin ortaq strukturu:**
1. `ToolHeader` — başlıq və qısa təsvir
2. `FileDrop` — drag&drop fayl seçici
3. Fayl(lar) seçildikdən sonra UI (səhifə seçimi, sıralama, və s.)
4. Hərəkət düyməsi (mavi `bg-accent`, hover-də `bg-blue-700`)
5. `ToolInfo` — alt bölmə: "Bu nə üçündür?", "Hansı hallarda lazımdır?", "Necə istifadə edilir?"

**Pdf-lib qeydi:** `Uint8Array` `BlobPart` deyil. Həmişə `ArrayBuffer`-ə kopyala:
```ts
const bytes = await doc.save();
const buf = new ArrayBuffer(bytes.byteLength);
new Uint8Array(buf).set(bytes);
downloadBlob(new Blob([buf], { type: "application/pdf" }), "fayl.pdf");
```

## 7. Dizayn sistemi

**Rənglər** (`globals.css`-də CSS variables):
- `--background: #ffffff`
- `--foreground: #0a0a0a`
- `--muted: #6b7280`
- `--border: #e5e7eb`
- `--accent: #2563eb` (əsas mavi, vurğular)

**Brend qradient:** `linear-gradient(to right, #3b82f6, #8b5cf6)` (mavi → bənövşəyi). Hero başlıqda, logo təfsilatlarında, hover-də.

**Alət kartlarının (ana səhifə) rəng identifikasiyası:** Hər alət üçün öz rəngi:
- Birləşdir → blue
- Ayır → violet
- Səhifə sil → rose
- Səhifə çıxar → amber
- Döndər → cyan
- Şəkil → PDF → emerald
- PDF → Şəkil → pink

**Hover animasiyaları** (`globals.css`-də keyframes):
- `anim-merge` — yapışdırma yelləncəyi
- `anim-cut` — qayçı kəsmə
- `anim-shake` — zibil titrəmə
- `anim-extract` — yuxarı qalxma
- `anim-rotate` — tam dövrə
- `anim-flip` — flip
- `anim-flash` — kamera flaş
Yalnız hover-də (`.tool-card:hover .anim-X`), mobildə işləmir (bu yaxşıdır).

**Naviqasiya linkləri** (`.nav-link` class): qradient alt xətt animasiyası, hover-də yumşaq mavi fon. `.nav-link-outline` (Haqqımızda) — incə çərçivəli düymə.

**Header:** 80px hündürlük (`h-20`), sticky, blur fon. Mobil hamburger menyu **80px top offset** ilə dropdown.

## 8. Təhlükəsizlik (next.config.ts)

Bütün cavablar bu başlıqlarla gəlir:
- **CSP** — yalnız öz domenimizdən resurs (style/script-də `'unsafe-inline'` Tailwind üçün lazımdır)
- **HSTS** — `max-age=63072000; includeSubDomains; preload`
- **X-Frame-Options: DENY** — clickjacking qoruması
- **X-Content-Type-Options: nosniff**
- **Permissions-Policy** — 20+ brauzer xüsusiyyəti bağlı (camera, geolocation, və s.)
- **Cross-Origin-Opener-Policy: same-origin**
- **Cross-Origin-Resource-Policy: same-origin**
- **Referrer-Policy: strict-origin-when-cross-origin**
- **poweredByHeader: false** (Next.js versiyası gizli)
- **reactStrictMode: true**

`'unsafe-eval'` yalnız dev mode-da əlavə olunur, production-da yoxdur.

## 9. Deploy axını (ÇOX VACİB!)

**Hər dəyişiklik üçün ardıcıllıq:**
1. Dəyişikliklər lokalda et
2. `git add -A`
3. `git commit -m "Aydın mesaj"` (ingiliscə, imperative)
4. `git push`
5. Vercel **avtomatik** 2-3 dəqiqəyə canlıya çıxarır
6. İstifadəçiyə bildir: "Push edildi, 2-3 dəqiqəyə canlıdır"

**İstifadəçidən başqa şey istəmə** — `npm run build` lokalda lazım deyil, Vercel özü edir. Test üçün dev server (`npm run dev`) yetər.

**Lokal dev server:** `npm run dev` → http://localhost:3000. Bəzən köhnə proses qalır, port 3000 dolur → `taskkill //PID <pid> //F` ilə bağla.

## 10. SEO və Analytics

- **Vercel Analytics** — `@vercel/analytics` quraşdırılıb, layout-da `<Analytics />` var. Şəxsi məlumat toplamır.
- **Sitemap** — `app/sitemap.ts`, `NEXT_PUBLIC_SITE_URL` (Vercel env-də `https://asanpdf.com`) əsasında URL qurur.
- **Robots** — `app/robots.ts`, sitemap-i göstərir.
- **Google Search Console:** həm `asanpdf.com` (HTML file metodu — `public/googlec4cf6d7c66c5a6c9.html`), həm köhnə `asanpdf-az.vercel.app` təsdiqlənib. Sitemap göndərilib — "Успешно".
- **Meta tags:** hər səhifədə öz `metadata` exports (title, description, keywords, canonical, OpenGraph). Multilingual hələ yox.

### Structured Data (JSON-LD)

**Site səviyyəsi** (`app/components/JsonLd.tsx`, layout-a daxildir):
- `WebSite` schema — sayt brand-i, dil, URL
- `Organization` schema — naşir kimi
- `SoftwareApplication` schema — alət növü, kateqoriya, **`price: "0"`** (Google "Pulsuz" badge göstərə bilər), featureList ilə 9 alət

**Hər alət səhifəsi** (`app/components/HowToJsonLd.tsx`, hər `page.tsx`-də istifadə olunur):
- `HowTo` schema — adım-adım təlimat
- Hər step üçün `name` + `text` + position
- `totalTime: "PT1M"` default (sıxışdır üçün PT2M)
- Google bəzən axtarış nəticələrində birbaşa addımları göstərir ("Rich Snippet")

### Open Graph şəkili

`app/opengraph-image.tsx` — **dinamik** PNG-image, hər deploy-da yenidən render olunur:
- Next.js `ImageResponse` + Edge runtime
- 1200×630 piksel
- Qradient fon (blue → indigo → violet), grid pattern, beyaz PDF document ikonu, brand mətn + tagline + üç feature badge
- Facebook/Telegram/WhatsApp/LinkedIn-də avtomatik aşkar edilir
- Hər səhifə üçün `openGraph` metadata bunu istifadə edir (avtomatik)

## 11. Domen vəziyyəti

**Əsas domen:** `asanpdf.com` ✅ (canlıdır, Cloudflare Registrar-dan ~$10/il)
- Cloudflare-də qeydiyyatlı (`mursal.ebay@gmail.com` hesabı)
- WHOIS Privacy aktiv (Cloudflare pulsuz)
- DNS Cloudflare-də idarə olunur (`paislee.ns.cloudflare.com`, `yadiel.ns.cloudflare.com`)
- Vercel-ə qoşulub (CNAME `@` və `www` → `e7c0285d7d5efb79.vercel-dns-017.com`)
- Cloudflare Proxy **DNS only** (boz bulud — Vercel ilə konflikt olmasın deyə)
- HTTPS Vercel tərəfindən avtomatik
- `NEXT_PUBLIC_SITE_URL=https://asanpdf.com` Vercel env var-da

**Yedek:** `asanpdf-az.vercel.app` hələ də işləyir (Vercel default subdomain).

**SSL almaq lazım deyil** — Vercel avtomatik verir, pulsuz.

## 12. Logo və Favicon

- `public/logo.png` — header logosu (637×577 piksel, sahib özü hazırladı)
- `app/icon.png` — favicon (Next.js avtomatik xidmət edir)
- Header-də `next/image` ilə `width={637} height={577} className="h-14 sm:h-16 w-auto"` — bu **dəqiq ölçülər vacibdir**, layout shift olmasın deyə.

**Əgər logo dəyişdirilərsə:** yeni faylın ölçülərini `node -e "..."` ilə oxu və `width`/`height` props yenilə.

## 13. PWA — telefona quraşdırma

Sayt **Progressive Web App** kimi telefon ana ekranına quraşdırıla bilir:

- `app/manifest.ts` — Next.js `MetadataRoute.Manifest` API ilə `/manifest.webmanifest` çıxış edir (`display: standalone`, `theme_color: #2563eb`, icons 192/512, `lang: az`)
- `app/icon.png` — favicon və PWA ikonu (Next.js avtomatik)
- `app/apple-icon.png` — iOS bookmark/home screen ikonu (eyni şəkilin kopyası)
- `app/layout.tsx` — `applicationName`, `appleWebApp` metadata + `viewport` export (themeColor)
- **`app/components/InstallPrompt.tsx`** — sağ aşağıda görünən banner:
  - **Android/Chrome**: `beforeinstallprompt` hadisəsini tutur → "Qur" düyməsi native install dialoq açır
  - **iOS Safari**: 3 saniyə gecikmə ilə "Paylaş → Ana ekrana əlavə et" təlimatı göstərir
  - localStorage ilə **14 gün cooldown** ("Sonra" basılsa)
  - `display-mode: standalone` yoxlayır — artıq qurulubsa görünmür
  - `window.navigator.standalone` iOS Safari-yə xüsusi yoxlama

## 14. Header və grid layout

- **Header:** 80px hündürlük (`h-20`), sticky, blur, color-coded pill düymələr
- 10 düymə (9 alət + Haqqımızda) — **`xl:` breakpoint (1280px)**-dən başlayır; daha kiçik ekranlarda hamburger menyu
- Hər düymənin **öz rəng identifikasiyası**: blue / violet / rose / amber / cyan / emerald / pink / indigo / yellow / gray (Haqqımızda) — ana səhifə kartları ilə tam uyğun
- Naviqasiya class-ları manual (Tailwind purge-safe), gap-1.5, text-[13px], whitespace-nowrap
- **Cards grid:** `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5` — 9 kart desktop-da 5+4 (2 sıra) düzülür
- Hər kart üçün hover animasiyası `globals.css`-də keyframe-lərlə (`anim-merge`, `anim-cut`, `anim-shake`, `anim-extract`, `anim-rotate`, `anim-flip`, `anim-flash`, `anim-compress`, `anim-mark`)

## 15. Bilinən məhdudiyyətlər və TODO

- ⏳ Google Search Console — 10 əsas URL "Request Indexing" göndərildi, indeksləmə nəticəsi gözlənir (24-48 saat)
- ⏳ "Email göndər" / geri əlaqə formu yoxdur (sahib hələ istəmir)
- ⏳ Sosial media linki yoxdur
- ⏳ Blog/məqalə bölməsi yoxdur (gələcəkdə SEO üçün) — yeni çatda başlanacaq
- ⏳ PDF → Word (Gemini Flash 2.5 API ilə) müzakirə olundu, hələ icra olunmayıb — yeni çatda davam ediləcək
- ⏳ Multi-dil dəstəyi yoxdur (gələcəkdə `/en/`, `/ru/`, `/tr/` ilə qlobal trafik üçün)
- ⏳ Real istifadəçi feedback toplama mexanizmi yoxdur — Vercel Analytics izləyir, amma "təklif/şikayət" formu yoxdur

## 16. Tez-tez tələb olunan iş tipləri

### Yeni alət əlavə etmək
1. `app/<alet-adi>/page.tsx` yarat
2. `"use client"` ilə başla
3. State + `pdf-lib` məntiq
4. `FileDrop`, `ToolHeader`, `ToolInfo` istifadə et
5. `app/page.tsx`-də `tools` arrayinə əlavə et (icon, rəng, animasiya class)
6. `app/layout.tsx`-də desktop nav-a Link əlavə et
7. `app/components/MobileNav.tsx`-də `links` arrayinə əlavə et
8. `app/sitemap.ts`-də `paths` arrayinə əlavə et
9. `globals.css`-də (lazım olarsa) yeni hover animasiyası əlavə et
10. Commit + push

### UI dəyişikliyi tələbi
- Dəyişikliyi et
- Push et (avtomatik deploy)
- "2-3 dəqiqəyə canlıdır" de
- Yenidən feedback gözlə

### "Bunu sənə kömək edim" vəziyyəti
İstifadəçi texniki bilməz. Əgər lazımdırsa:
- DNS dəyişiklik → addım-addım göstər, ekran şəkli iste
- Google/Vercel UI-da bir şey → konkret düymə adları yaz
- Şəkil yükləmə → tam fayl yolu və ad ver

## 17. Üslub bələdçisi (yazı və davranış)

**İstifadəçi ilə:**
- Azərbaycanca, qısa cümlələrlə
- "Sən" formasında müraciət (formal "siz" yox)
- Markdown başlıqlar, list-lər, cədvəllər istifadə et (vizual oxunaqlı)
- Kod blokları üçün ```backtick``` istifadə et
- Linklər markdown formatında: `[mətn](url)`
- Səhifə ünvanları aydın göstər

**Kodda:**
- Azərbaycanca kommentariya yoxdur — ingilis
- Değişken/funksiya adları ingilis camelCase
- UI mətnləri **azərbaycanca**, fayl adları ASCII-safe (məs: `donder` not `döndər`)
- Comment yazma, kod özü ifadə etsin
- React 19, Server/Client Components fərqlərini gözlə (`"use client"`)

**Git commit:**
- İngilis dilində
- İmperativ formada ("Add", "Fix", "Replace")
- Birinci sətr qısa (50 simvol), boş sətr, sonra detallar

## 18. Gələcək plan (sahibin vizionu)

1. **İndi:** Cloudflare gözlə → domen qoş → real istifadəçi feedback yığ
2. **1-3 ay:** Reddit/Telegram qruplarında paylaş, ilk 100 istifadəçini tap
3. **3-6 ay:** SEO-dan trafik gəlməyə başlasın (gündə 200+ ziyarət)
4. **6-12 ay:** Daha çox alət (sıxma, şifrə, OCR, imza)
5. **Sonra:** Bloq, daha geniş tanıtım, könüllü donate (pul prioritet deyil)

**Çox erkən etməməli:**
- Reklam (AdSense) — istifadəçi təcrübəsini pozur
- Premium plan — pulsuz qalmalıdır
- Email toplama — sahib istəmir
- Mobil app — sayt zatən responsivdir

---

## Tez-istinad

- **Repo:** https://github.com/mursal-ahmadov/asanpdf.az
- **Vercel:** asanpdf-az.vercel.app (proyekt adı: `asanpdf-az`)
- **GitHub user:** mursal-ahmadov
- **Email:** mursal.ahmadov@gmail.com
- **Lokal yol:** `C:\Users\Mursal\Desktop\AsanPDF.az`
- **OS:** Windows 11 (PowerShell + Git Bash hər ikisi mövcuddur)
