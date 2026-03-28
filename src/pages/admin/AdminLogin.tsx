import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError("ইমেইল বা পাসওয়ার্ড ভুল");
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm bg-card border rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">অ্যাডমিন লগইন</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">ইমেইল</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">পাসওয়ার্ড</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "লগইন হচ্ছে..." : "লগইন"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
