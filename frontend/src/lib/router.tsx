import { createContext, useContext, useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from "react";

const Ctx = createContext<{ path: string; navigate: (to: string) => void }>({ path: "/", navigate: () => {} });

export function Router({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const on = () => setPath(window.location.pathname);
    window.addEventListener("popstate", on);
    return () => window.removeEventListener("popstate", on);
  }, []);
  const navigate = (to: string) => {
    if (to !== window.location.pathname) window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo(0, 0);
  };
  return <Ctx.Provider value={{ path, navigate }}>{children}</Ctx.Provider>;
}

export const useRouter = () => useContext(Ctx);

export function Link({ to, children, ...rest }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { path, navigate } = useRouter();
  return (
    <a
      href={to}
      aria-current={path === to ? "page" : undefined}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
        rest.onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
