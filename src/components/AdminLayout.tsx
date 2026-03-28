import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, MapPin, List, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { to: "/admin", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
    { to: "/admin/spots", label: "স্পট", icon: MapPin },
    { to: "/admin/lists", label: "তালিকা", icon: List },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin top bar */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/admin" className="font-bold text-lg">অ্যাডমিন</Link>
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  isActive(item.to)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">সাইট দেখুন</Link>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
