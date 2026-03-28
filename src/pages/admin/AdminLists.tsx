import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminLists = () => {
  const queryClient = useQueryClient();

  const { data: lists = [], isLoading } = useQuery({
    queryKey: ["admin-lists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lists")
        .select("*, list_spots(spot_id)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lists").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lists"] });
      toast.success("তালিকা ডিলিট হয়েছে");
    },
    onError: () => toast.error("ডিলিট করতে সমস্যা হয়েছে"),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">সব তালিকা</h1>
        <Link to="/admin/lists/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" /> নতুন
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">লোড হচ্ছে...</p>
      ) : lists.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">কোনো তালিকা নেই</p>
      ) : (
        <div className="space-y-3">
          {lists.map((list) => (
            <div key={list.id} className="flex items-center gap-4 border rounded-xl p-4 bg-card">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{list.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {(list.list_spots as any[])?.length || 0}টি স্পট
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/lists/${list.id}`}>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => {
                    if (confirm("এই তালিকাটি ডিলিট করবেন?")) {
                      deleteMutation.mutate(list.id);
                    }
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLists;
