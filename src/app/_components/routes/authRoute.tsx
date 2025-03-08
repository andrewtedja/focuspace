import { useEffect, PropsWithChildren } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSessionStore } from "~/stores/useSessionStore";

const AuthRoute: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, setSession } = useSessionStore();
  const { data: session } = useSession();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/room");
      return;
    }
    if (!session) {
      return;
    }
    toast.success("Login successful!");
    setSession(session.expires, session.user);
    router.push("/room");
  }, [session]);

  if (session === undefined || session) {
    return <div>Loading...</div>;
  }
  return <div>{children}</div>;
};

export default AuthRoute;
