export default function Text1({ content }: { content: string }) {
  return (
    <div className="container-class h-full w-full">
      <div className="flex h-full w-full items-center justify-center rounded-md bg-red-300 @container">
        <div className="@9xs:text-sm @8xs:text-base @7xs:text-lg text-xs">
          {content}
        </div>
      </div>
    </div>
  );
}
