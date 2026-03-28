import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, List, Plus } from "lucide-react";

const AdminDashboard = () => {
  const { data: spotCount = 0 } = useQuery({
    queryKey: ["admin-spot-count"],
    queryFn: async () => {
      const { count } = await supabase.from("spots").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: listCount = 0 } = useQuery({
    queryKey: ["admin-list-count"],
    queryFn: async () => {
      const { count } = await supabase.from("lists").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ড্যাশবোর্ড</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">মোট স্পট</span>
          </div>
          <p className="text-3xl font-bold">{spotCount}</p>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <List className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">মোট তালিকা</span>
          </div>
          <p className="text-3xl font-bold">{listCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/admin/spots/new"
          className="flex items-center gap-3 border rounded-xl p-5 hover:bg-muted/50 transition"
        >
          <Plus className="w-5 h-5 text-primary" />
          <span className="font-medium">নতুন স্পট যোগ করুন</span>
        </Link>
        <Link
          to="/admin/lists/new"
          className="flex items-center gap-3 border rounded-xl p-5 hover:bg-muted/50 transition"
        >
          <Plus className="w-5 h-5 text-primary" />
          <span className="font-medium">নতুন তালিকা যোগ করুন</span>
        </Link>
        <Link
          to="/admin/spots"
          className="flex items-center gap-3 border rounded-xl p-5 hover:bg-muted/50 transition"
        >
          <MapPin className="w-5 h-5 text-primary" />
          <span className="font-medium">সব স্পট দেখুন</span>
        </Link>
        <Link
          to="/admin/lists"
          className="flex items-center gap-3 border rounded-xl p-5 hover:bg-muted/50 transition"
        >
          <List className="w-5 h-5 text-primary" />
          <span className="font-medium">সব তালিকা দেখুন</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
