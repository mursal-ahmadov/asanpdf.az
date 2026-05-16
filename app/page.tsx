import Link from "next/link";

const tools = [
  {
    href: "/birlesdir", title: "Birləşdir", desc: "PDF-ləri bir sənədə birləşdir",
    icon: "📎", anim: "anim-merge",
    color: "from-blue-500 to-indigo-600", glow: "hover:shadow-blue-500/25", iconBg: "bg-blue-50", ring: "group-hover:ring-blue-200",
  },
  {
    href: "/ayir", title: "Ayır", desc: "PDF-i səhifələrə böl",
    icon: "✂️", anim: "anim-cut",
    color: "from-violet-500 to-purple-600", glow: "hover:shadow-violet-500/25", iconBg: "bg-violet-50", ring: "group-hover:ring-violet-200",
  },
  {
    href: "/sehife-sil", title: "Səhifə Sil", desc: "Lazımsız səhifələri çıxar",
    icon: "🗑️", anim: "anim-shake",
    color: "from-rose-500 to-red-600", glow: "hover:shadow-rose-500/25", iconBg: "bg-rose-50", ring: "group-hover:ring-rose-200",
  },
  {
    href: "/cixar", title: "Səhifə Çıxar", desc: "Seçdiyini ayrı PDF kimi yüklə",
    icon: "📄", anim: "anim-extract",
    color: "from-amber-500 to-orange-600", glow: "hover:shadow-amber-500/25", iconBg: "bg-amber-50", ring: "group-hover:ring-amber-200",
  },
  {
    href: "/donder", title: "Səhifə Döndər", desc: "90°, 180° döndər",
    icon: "🔄", anim: "anim-rotate",
    color: "from-cyan-500 to-teal-600", glow: "hover:shadow-cyan-500/25", iconBg: "bg-cyan-50", ring: "group-hover:ring-cyan-200",
  },
  {
    href: "/sekil-to-pdf", title: "Şəkil → PDF", desc: "JPG/PNG-dən PDF yarat",
    icon: "🖼️", anim: "anim-flip",
    color: "from-emerald-500 to-green-600", glow: "hover:shadow-emerald-500/25", iconBg: "bg-emerald-50", ring: "group-hover:ring-emerald-200",
  },
  {
    href: "/pdf-to-sekil", title: "PDF → Şəkil", desc: "PDF səhifələrini JPG-yə çevir",
    icon: "📷", anim: "anim-flash",
    color: "from-pink-500 to-fuchsia-600", glow: "hover:shadow-pink-500/25", iconBg: "bg-pink-50", ring: "group-hover:ring-pink-200",
  },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      <section className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2">
          PDF alətləri —{" "}
          <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            pulsuz və asan
          </span>
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-xl mx-auto">
          Hər şey brauzerinizdə işləyir. Faylınız heç bir serverə yüklənmir.
        </p>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`tool-card group relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-white border border-gray-200/80
              shadow-sm hover:shadow-xl ${tool.glow}
              hover:-translate-y-1 transition-all duration-300 ease-out`}
          >
            {/* gradient halo on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 pointer-events-none`}
            />
            {/* top gradient bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            <div
              className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${tool.iconBg} flex items-center justify-center mb-3 ring-1 ring-gray-100 ${tool.ring} transition`}
            >
              <span className={`text-2xl ${tool.anim} inline-block`}>{tool.icon}</span>
            </div>

            <h2
              className={`relative font-semibold text-sm sm:text-base mb-1 text-gray-900 group-hover:bg-gradient-to-r ${tool.color} group-hover:bg-clip-text group-hover:text-transparent transition`}
            >
              {tool.title}
            </h2>
            <p className="relative text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">
              {tool.desc}
            </p>

            {/* arrow that appears on hover */}
            <div
              className={`absolute bottom-3 right-3 w-7 h-7 rounded-full bg-gradient-to-br ${tool.color} text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300`}
            >
              →
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-muted">
        <span className="flex items-center gap-1"><span>🔒</span> Tam məxfilik</span>
        <span className="flex items-center gap-1"><span>⚡</span> Sürətli</span>
        <span className="flex items-center gap-1"><span>💯</span> Pulsuz</span>
        <span className="flex items-center gap-1"><span>📱</span> Bütün cihazlarda</span>
      </section>
    </div>
  );
}
