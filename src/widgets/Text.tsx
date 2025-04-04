export default function Text({
  content = "Default Text",
}: {
  content?: string;
}) {
  return <div className="h-full w-full bg-green-200">{content}</div>;
}
