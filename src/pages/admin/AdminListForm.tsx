import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { generateSlug } from "@/lib/supabase-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, GripVertical } from "lucide-react";
import { toast } from "sonner";

const AdminListForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSpotIds, setSelectedSpotIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Fetch all spots for selection
  const { data: allSpots = [] } = useQuery({
    queryKey: ["admin-all-spots-for-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spots")
        .select("id, title, category")
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  // Fetch existing list data
  const { data: list, isLoading } = useQuery({
    queryKey: ["admin-list", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("lists")
        .select("*, list_spots(spot_id, sort_order)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (list) {
      setTitle(list.title);
      setSlug(list.slug);
      setDescription(list.description);
      const sortedSpots = (list.list_spots as any[] || [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order);
      setSelectedSpotIds(sortedSpots.map((ls: any) => ls.spot_id));
    }
  }, [list]);

  useEffect(() => {
    if (!isEdit && title) {
      setSlug(generateSlug(title));
    }
  }, [title, isEdit]);

  const toggleSpot = (spotId: string) => {
    setSelectedSpotIds((prev) =>
      prev.includes(spotId) ? prev.filter((id) => id !== spotId) : [...prev, spotId]
    );
  };

  const moveSpot = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= selectedSpotIds.length) return;
    const newArr = [...selectedSpotIds];
    [newArr[index], newArr[newIndex]] = [newArr[newIndex], newArr[index]];
    setSelectedSpotIds(newArr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      toast.error("টাইটেল দিন");
      return;
    }

    setSaving(true);
    try {
      let listId = id;

      const listData = {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
      };

      if (isEdit && listId) {
        const { error } = await supabase.from("lists").update(listData).eq("id", listId);
        if (error) throw error;
        // Remove old spots
        await supabase.from("list_spots").delete().eq("list_id", listId);
      } else {
        const { data, error } = await supabase.from("lists").insert(listData).select("id").single();
        if (error) throw error;
        listId = data.id;
      }

      // Insert selected spots
      if (selectedSpotIds.length > 0) {
        const inserts = selectedSpotIds.map((spotId, i) => ({
          list_id: listId!,
          spot_id: spotId,
          sort_order: i,
        }));
        const { error } = await supabase.from("list_spots").insert(inserts);
        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ["admin-lists"] });
      toast.success(isEdit ? "তালিকা আপডেট হয়েছে" : "তালিকা যোগ হয়েছে");
      navigate("/admin/lists");
    } catch (err: any) {
      toast.error(err.message || "সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && isLoading) {
    return <p className="text-muted-foreground">লোড হচ্ছে...</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? "তালিকা এডিট করুন" : "নতুন তালিকা"}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">টাইটেল *</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1" />
        </div>

        <div>
          <label className="text-sm font-medium">স্লাগ</label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1" />
        </div>

        <div>
          <label className="text-sm font-medium">বিবরণ</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1" />
        </div>

        {/* Spot selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">স্পট সিলেক্ট করুন</label>
          <div className="border rounded-xl max-h-60 overflow-y-auto">
            {allSpots.map((spot) => (
              <label
                key={spot.id}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
              >
                <Checkbox
                  checked={selectedSpotIds.includes(spot.id)}
                  onCheckedChange={() => toggleSpot(spot.id)}
                />
                <span className="text-sm flex-1">{spot.title}</span>
                <span className="text-xs text-muted-foreground">{spot.category}</span>
              </label>
            ))}
            {allSpots.length === 0 && (
              <p className="text-sm text-muted-foreground p-4">আগে স্পট যোগ করুন</p>
            )}
          </div>
        </div>

        {/* Selected spots order */}
        {selectedSpotIds.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block">ক্রম পরিবর্তন করুন</label>
            <div className="border rounded-xl">
              {selectedSpotIds.map((spotId, i) => {
                const spot = allSpots.find((s) => s.id === spotId);
                return (
                  <div key={spotId} className="flex items-center gap-3 px-4 py-2.5 border-b last:border-b-0">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm flex-1">{spot?.title || spotId}</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveSpot(i, -1)}
                        disabled={i === 0}
                        className="text-xs px-2 py-1 rounded bg-muted disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSpot(i, 1)}
                        disabled={i === selectedSpotIds.length - 1}
                        className="text-xs px-2 py-1 rounded bg-muted disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> সেভ হচ্ছে...</>
            ) : isEdit ? "আপডেট করুন" : "যোগ করুন"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/lists")}>
            বাতিল
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminListForm;
