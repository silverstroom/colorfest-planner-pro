import { NavLink } from "react-router-dom";
import { Home, TrendingDown, TrendingUp, BarChart3 } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/costi", icon: TrendingDown, label: "Costi" },
  { to: "/entrate", icon: TrendingUp, label: "Entrate" },
  { to: "/statistiche", icon: BarChart3, label: "Stats" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
