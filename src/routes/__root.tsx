import { Outlet, createRootRoute, useRouterState, useNavigate } from "@tanstack/react-router";
import { FooterNav } from "@/components/FooterNav";
import { Plus } from "lucide-react";

const ROUTES_WITHOUT_FOOTER = ["/", "/onboarding", "/create-event"];
const ROUTE_PREFIXES_WITHOUT_FOOTER = ["/event/", "/chat/", "/review/"];

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const routerState = useRouterState();
  const navigate = useNavigate();
  const currentPath = routerState.location.pathname;
  const showFooter =
    !ROUTES_WITHOUT_FOOTER.includes(currentPath) &&
    !ROUTE_PREFIXES_WITHOUT_FOOTER.some((p) => currentPath.startsWith(p));

  return (
    <>
      <div
        className="relative flex flex-col"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          maxWidth: "393px",
          margin: "0 auto",
          height: "100dvh",
        }}
      >
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <Outlet />
        </div>
        {currentPath === "/home" && (
          <button
            onClick={() => navigate({ to: "/create-event" })}
            className="cursor-pointer"
            style={{
              position: "absolute",
              bottom: "72px",
              right: "16px",
              width: "54px",
              height: "54px",
              zIndex: 10,
              border: "1px solid rgba(174, 177, 231, 0.2)",
              borderRadius: "50%",
              padding: 0,
              background:
                "radial-gradient(circle at 40% 35%, #3b3f7a 0%, #1e2060 50%, #121440 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
              animation:
                "fabEnter 500ms cubic-bezier(0.16, 1, 0.3, 1) backwards 350ms",
              transition: "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onPointerDown={(e) => {
              e.currentTarget.style.transform = "scale(0.88)";
            }}
            onPointerUp={(e) => {
              e.currentTarget.style.transform = "scale(1.04)";
              setTimeout(() => {
                if (e.currentTarget) e.currentTarget.style.transform = "";
              }, 150);
            }}
            onPointerLeave={(e) => {
              e.currentTarget.style.transform = "";
            }}
            aria-label="Create new event"
          >
            <Plus
              size={24}
              strokeWidth={2.5}
              color="#aeb1e7"
            />
          </button>
        )}
        {showFooter && <FooterNav />}
      </div>
    </>
  );
}
