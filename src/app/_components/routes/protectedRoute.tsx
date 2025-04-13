"use client";
import { useEffect, PropsWithChildren } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSessionStore } from "~/stores/useSessionStore";
import Loading from "../Loading";

const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { status } = useSessionStore();

  useEffect(() => {
    if (status === "loading" || status === "authenticated") {
      return;
    }
    router.push("/auth/login");
  }, [status]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div>
        <Loading />
      </div>
    );
  }
  return <div>{children}</div>;
};

export default ProtectedRoute;
