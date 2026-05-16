type Props = {
  what: string;
  whenToUse: string[];
  howSteps: string[];
};

export default function ToolInfo({ what, whenToUse, howSteps }: Props) {
  return (
    <section className="mt-12 pt-8 border-t border-border grid sm:grid-cols-3 gap-6 text-sm">
      <div>
        <h3 className="font-semibold mb-2 text-gray-900">Bu alət nə üçündür?</h3>
        <p className="text-muted leading-relaxed">{what}</p>
      </div>

      <div>
        <h3 className="font-semibold mb-2 text-gray-900">Hansı hallarda lazımdır?</h3>
        <ul className="text-muted space-y-1.5">
          {whenToUse.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-accent">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-2 text-gray-900">Necə istifadə edilir?</h3>
        <ol className="text-muted space-y-1.5">
          {howSteps.map((step, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-accent font-semibold">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
