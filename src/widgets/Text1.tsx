import { Button } from "~/components/ui/button";
export default function Text1({
  content = "Default Text 1",
}: {
  content?: string;
}) {
  return (
    <div className="container-class h-full w-full">
      <div className="@container flex h-full w-full items-center justify-center rounded-md bg-red-300">
        <div className="@9xs:text-sm @8xs:text-base @7xs:text-lg text-xs">
          {content}
          <br />
          <Button onClick={() => console.log("hello world")}>test</Button>
        </div>
      </div>
    </div>
  );
}
