import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="কক্সবাজার" className="h-10" />
        </Link>

        <div className="flex items-center gap-8">
          <Link
            to="/"
            className={`text-base font-medium transition-colors ${
              isActive("/") ? "text-primary" : "text-foreground hover:text-primary"
            }`}
          >
            নীড়
          </Link>
          <Link
            to="/spots"
            className={`text-base font-medium transition-colors ${
              isActive("/spots") ? "text-primary" : "text-foreground hover:text-primary"
            }`}
          >
            স্পট
          </Link>
          <Link
            to="/lists"
            className={`text-base font-medium transition-colors ${
              isActive("/lists") ? "text-primary" : "text-foreground hover:text-primary"
            }`}
          >
            তালিকা
          </Link>
        </div>

        <div className="flex items-center">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="খুঁজুন..."
                autoFocus
                className="border rounded-full px-4 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary w-48"
              />
              <button type="button" onClick={() => { setSearchOpen(false); setQuery(""); }}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
