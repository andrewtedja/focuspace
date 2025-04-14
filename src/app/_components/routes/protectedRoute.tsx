"use client";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
  }, [status, router]);

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
