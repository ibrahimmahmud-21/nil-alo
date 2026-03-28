import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AdminSpots = () => {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: spots = [], isLoading } = useQuery({
    queryKey: ["admin-spots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spots")
        .select("*, spot_images(image_url, sort_order)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("spots").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-spots"] });
      toast.success("স্পট ডিলিট হয়েছে");
    },
    onError: () => toast.error("ডিলিট করতে সমস্যা হয়েছে"),
  });

  const filtered = spots.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">সব স্পট</h1>
        <Link to="/admin/spots/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" /> নতুন
          </Button>
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="স্পট খুঁজুন..."
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">লোড হচ্ছে...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">কোনো স্পট পাওয়া যায়নি</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((spot) => {
            const firstImage = spot.spot_images?.sort(
              (a: any, b: any) => a.sort_order - b.sort_order
            )[0];
            return (
              <div
                key={spot.id}
                className="flex items-center gap-4 border rounded-xl p-3 bg-card"
              >
                {firstImage ? (
                  <img
                    src={firstImage.image_url}
                    alt={spot.title}
                    className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-12 rounded-lg bg-muted flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{spot.title}</h3>
                  <p className="text-xs text-muted-foreground">{spot.category}</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/admin/spots/${spot.id}`}>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => {
                      if (confirm("এই স্পটটি ডিলিট করবেন?")) {
                        deleteMutation.mutate(spot.id);
                      }
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminSpots;
