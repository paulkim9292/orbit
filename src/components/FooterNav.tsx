import { Link, useRouterState } from "@tanstack/react-router";

interface NavItem {
  name: string;
  to?: string;
  width: number;
  height: number;
}

const navItems: NavItem[] = [
  { name: "notification", to: "/notifications", width: 23, height: 25 },
  { name: "personal", to: "/report", width: 30, height: 30 },
  { name: "home", to: "/home", width: 21, height: 25 },
  { name: "community", to: "/my", width: 30, height: 25 },
  { name: "settings", to: "/settings", width: 25, height: 25 },
];

export function FooterNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav
      className="flex items-center justify-center"
      style={{ gap: "40px", padding: "16px 0" }}
    >
      {navItems.map((item) => {
        const isActive = item.to ? currentPath === item.to : false;
        const variant = isActive ? "activated" : "deactivated";
        const src = `/icons/footer-${item.name}-${variant}.svg`;
        const img = (
          <img
            src={src}
            alt={item.name}
            style={{
              width: `${item.width}px`,
              height: `${item.height}px`,
              transition: "opacity 250ms cubic-bezier(0.16, 1, 0.3, 1), transform 250ms cubic-bezier(0.16, 1, 0.3, 1)",
              transform: isActive ? "scale(1)" : "scale(0.92)",
              opacity: isActive ? 1 : 0.7,
            }}
          />
        );

        if (item.to) {
          return (
            <Link
              key={item.name}
              to={item.to}
              aria-label={item.name}
              className="flex items-center justify-center"
            >
              {img}
            </Link>
          );
        }

        return (
          <button
            key={item.name}
            className="cursor-pointer bg-transparent border-none p-0"
            aria-label={item.name}
          >
            {img}
          </button>
        );
      })}
    </nav>
  );
}
