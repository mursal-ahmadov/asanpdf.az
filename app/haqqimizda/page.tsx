import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Haqqımızda — AsanPDF.com",
  description:
    "AsanPDF.com nə üçün qurulub və kimə xidmət edir. Pulsuz, reklamsız, məxfi PDF alətləri.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-center">
        Haqqımızda
      </h1>
      <p className="text-center text-muted mb-10">
        Niyə bu sayt var və kimə kömək etmək istəyirik
      </p>

      <article className="space-y-6 text-[15px] sm:text-base leading-relaxed text-gray-700">
        <p>
          <strong className="text-gray-900">AsanPDF.com</strong> Azərbaycan
          dilində, pulsuz və sadə PDF alətləri toplusudur. Məqsədimiz birdir —
          gündəlik işində PDF ilə qarşılaşan hər kəsə bu işi rahat və sürətli
          görməyə kömək etmək.
        </p>

        <p>
          PDF faylını birləşdirmək, bölmək, səhifə silmək kimi sadə işlər üçün
          insanlar saatlarla yad dildə saytlarda dolanır, reklamlardan keçir,
          bəzən pul ödəməli olur. Halbuki bu əməliyyatlar{" "}
          <strong className="text-gray-900">dərhal və pulsuz</strong>{" "}
          olmalıdır. Biz bu boşluğu doldurmaq istədik.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 pt-4">
          Saytımızın 3 əsas prinsipi
        </h2>

        <div className="space-y-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-card">
            <h3 className="font-semibold mb-1">🔒 Məxfilik birinci yerdədir</h3>
            <p className="text-sm text-muted">
              Sənin faylların <strong className="text-gray-900">heç bir serverə yüklənmir</strong>. Bütün
              əməliyyatlar birbaşa sənin brauzerində — kompüterində və ya
              telefonunda — yerinə yetirilir. Biz heç vaxt sənin sənədlərini
              görmürük, saxlamırıq və başqasına vermirik.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card">
            <h3 className="font-semibold mb-1">💯 Tamamilə pulsuz</h3>
            <p className="text-sm text-muted">
              Qeydiyyat yoxdur. Limit yoxdur. Gizli ödəniş yoxdur. İstədiyin
              qədər fayl, istədiyin qədər səhifə ilə işləyə bilərsən.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card">
            <h3 className="font-semibold mb-1">⚡ Sadə və sürətli</h3>
            <p className="text-sm text-muted">
              Mürəkkəb menyular yoxdur. Reklamlar yoxdur. Bir-iki kliklə işini
              görüb saytı bağlaya bilərsən. Çünki vaxtın sənindir.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 pt-4">
          Kimə xidmət edirik?
        </h2>

        <p>
          Bu sayt bütün azərbaycandilli istifadəçilər üçündür — tələbə,
          müəllim, ofis işçisi, mühasib, hüquqşünas, sahibkar və sadəcə evdə
          bir sənəd hazırlayan insan. PDF ilə işləmək hamımızın həyatının bir
          parçasıdır və biz onu <strong className="text-gray-900">bir az daha asan</strong> etmək istəyirik.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 pt-4">
          Niyə Azərbaycan dilində?
        </h2>

        <p>
          İnternetdə yüzlərlə PDF aləti var, amma demək olar ki, hamısı
          ingilis, rus və ya başqa dillərdədir. Azərbaycan dilində keyfiyyətli,
          peşəkar, yerli istifadəçi üçün düşünülmüş alət demək olar ki,
          yoxdur. Biz inanırıq ki, hər kəs öz ana dilində rahat işləməyə
          haqqı çatır.
        </p>

        <p className="pt-2">
          AsanPDF.com-i istifadə etdiyin üçün təşəkkür edirik. Ümid edirik ki,
          sənə kömək edə bildik.
        </p>
      </article>

      <div className="mt-12 text-center">
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-blue-700 transition"
        >
          Alətlərə qayıt
        </Link>
      </div>
    </div>
  );
}
