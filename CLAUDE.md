# AsanPDF.az — Layihə Sənədləri (AI üçün)

Bu sənəd növbəti AI sessiyaları üçündür. Layihə tarixçəsi, qərarlar, texniki detallar və iş axını burada toplanıb.

---

## 1. Layihə nədir?

**AsanPDF.az** — Azərbaycan dilində pulsuz onlayn PDF alətləri saytı. Hədəf: iLovePDF / SmallPDF / PDF24 kimi qlobal saytların **azərbaycandilli alternativi**.

**Sayt:** https://asanpdf-az.vercel.app (gələcəkdə `https://asanpdf.az`)
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
**Domen:** `asanpdf.az` (hostarex.az-dən alındı, 50 AZN/il). Cloudflare-ə yönləndirilib.

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

## 6. 8 PDF aləti (hamısı brauzerdə işləyir)

| URL | Funksiya | Texnologiya | Status |
|-----|----------|-------------|--------|
| `/birlesdir` | PDF birləşdir (Merge) | pdf-lib | ✅ |
| `/ayir` | PDF ayır (Split) | pdf-lib | ✅ |
| `/sehife-sil` | Səhifə sil | pdf-lib | ✅ |
| `/cixar` | Səhifə çıxar | pdf-lib | ✅ |
| `/donder` | Səhifə döndər | pdf-lib | ✅ |
| `/sekil-to-pdf` | Şəkil → PDF | pdf-lib (embedJpg/Png) | ✅ |
| `/pdf-to-sekil` | PDF → JPG | pdfjs-dist (canvas) | ✅ |
| `/sixisdir` | PDF Sıxışdır (Compress) | pdfjs-dist + pdf-lib (rasterize → JPEG → embed) | ✅ |

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
- **Sitemap** — `app/sitemap.ts`, Vercel env (`VERCEL_PROJECT_PRODUCTION_URL`) əsasında URL qurur. `NEXT_PUBLIC_SITE_URL` ilə override edilə bilər (domen aktiv olanda).
- **Robots** — `app/robots.ts`, sitemap-i göstərir.
- **Google Search Console:** sayt təsdiqlənib (HTML file metodu — `public/googlec4cf6d7c66c5a6c9.html`). Sitemap göndərilib amma **status hələ uğursuz** — sayt yenidir, Google yenidən cəhd edəcək.
- **Meta tags:** hər səhifədə öz `metadata` exports (title, description). Multilingual hələ yox.

## 11. Domen vəziyyəti (DƏYİŞƏN STATUS!)

- Domen alındı (hostarex.az), 50 AZN/il
- Nameserver-lər Cloudflare-ə yönləndirilib (`paislee.ns.cloudflare.com`, `yadiel.ns.cloudflare.com`)
- **Cloudflare təsdiqi gözlənilir** (1-24 saat, sənəd tarixinə görə hələ bitməyib)
- Aktiv olduqda:
  1. Vercel → Settings → Domains → `asanpdf.az` əlavə et
  2. Vercel A/CNAME göstərəcək → Cloudflare DNS-də əlavə et
  3. 30-90 saniyəyə canlı, HTTPS avtomatik
  4. Vercel-də env var əlavə et: `NEXT_PUBLIC_SITE_URL=https://asanpdf.az`
  5. Sitemap avtomatik yeni domenə keçər

**SSL almaq lazım deyil** — Vercel və Cloudflare avtomatik verir, pulsuz.

## 12. Logo və Favicon

- `public/logo.png` — header logosu (637×577 piksel, sahib özü hazırladı)
- `app/icon.png` — favicon (Next.js avtomatik xidmət edir)
- Header-də `next/image` ilə `width={637} height={577} className="h-14 sm:h-16 w-auto"` — bu **dəqiq ölçülər vacibdir**, layout shift olmasın deyə.

**Əgər logo dəyişdirilərsə:** yeni faylın ölçülərini `node -e "..."` ilə oxu və `width`/`height` props yenilə.

## 13. Bilinən məhdudiyyətlər və TODO

- ❌ Favicon hələ ki yaxşı görünmür kiçik ölçüdə (icon.png horizontal logodur, kvadrat olmalıdır)
- ❌ Google Sitemap status hələ uğursuzdur (yenidir, gözlə)
- ❌ `asanpdf.az` domeni hələ aktiv deyil (Cloudflare gözləyir)
- ⏳ Open Graph şəkil yoxdur (sosial mediada paylaşılanda gözəl görünmür)
- ⏳ "Email göndər" formu yoxdur (sahib hələ istəmir)
- ⏳ Sosial media linki yoxdur (yoxdur)
- ⏳ Blog/məqalə bölməsi yoxdur (gələcəkdə SEO üçün lazım olacaq)

## 14. Tez-tez tələb olunan iş tipləri

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

## 15. Üslub bələdçisi (yazı və davranış)

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

## 16. Gələcək plan (sahibin vizionu)

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
