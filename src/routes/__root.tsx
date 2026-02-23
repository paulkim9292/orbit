import { Outlet, createRootRoute, useRouterState } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { FooterNav } from "@/components/FooterNav";

const ROUTES_WITHOUT_FOOTER = ["/", "/onboarding"];

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const showFooter = !ROUTES_WITHOUT_FOOTER.includes(currentPath);

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
          <img
            src="/icons/home-fab.svg"
            alt="Create new event"
            style={{
              position: "absolute",
              bottom: "72px",
              right: "16px",
              width: "51px",
              height: "51px",
              zIndex: 10,
              cursor: "pointer",
            }}
          />
        )}
        {showFooter && <FooterNav />}
      </div>
      <TanStackDevtools
        config={{ position: "bottom-right" }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  );
}
