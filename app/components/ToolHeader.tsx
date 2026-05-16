type Props = {
  title: string;
  description: string;
};

export default function ToolHeader({ title, description }: Props) {
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">{title}</h1>
      <p className="text-muted max-w-xl mx-auto">{description}</p>
    </div>
  );
}
