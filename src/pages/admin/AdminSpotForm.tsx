import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadSpotImage, generateSlug } from "@/lib/supabase-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

const categories = ["সৈকত", "দ্বীপ", "প্রকৃতি", "ঐতিহ্য", "পাহাড়", "মন্দির"];

const AdminSpotForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("সৈকত");
  const [shortDesc, setShortDesc] = useState("");
  const [location, setLocation] = useState("");
  const [howToReach, setHowToReach] = useState("");
  const [whatToSee, setWhatToSee] = useState("");
  const [tips, setTips] = useState("");
  const [featured, setFeatured] = useState(false);
  const [popular, setPopular] = useState(false);
  const [existingImages, setExistingImages] = useState<{ id: string; image_url: string; sort_order: number }[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: spot, isLoading } = useQuery({
    queryKey: ["admin-spot", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("spots")
        .select("*, spot_images(*)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (spot) {
      setTitle(spot.title);
      setSlug(spot.slug);
      setCategory(spot.category);
      setShortDesc(spot.short_desc);
      setLocation(spot.location);
      setHowToReach(spot.how_to_reach);
      setWhatToSee(spot.what_to_see);
      setTips(spot.tips);
      setFeatured(spot.featured);
      setPopular(spot.popular);
      setExistingImages(
        (spot.spot_images || []).sort((a: any, b: any) => a.sort_order - b.sort_order)
      );
    }
  }, [spot]);

  useEffect(() => {
    if (!isEdit && title) {
      setSlug(generateSlug(title));
    }
  }, [title, isEdit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeExisting = async (imgId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imgId));
    await supabase.from("spot_images").delete().eq("id", imgId);
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      toast.error("টাইটেল দিন");
      return;
    }

    setSaving(true);
    try {
      let spotId = id;

      const spotData = {
        title: title.trim(),
        slug: slug.trim(),
        category,
        short_desc: shortDesc.trim(),
        location: location.trim(),
        how_to_reach: howToReach.trim(),
        what_to_see: whatToSee.trim(),
        tips: tips.trim(),
        featured,
        popular,
      };

      if (isEdit && spotId) {
        const { error } = await supabase.from("spots").update(spotData).eq("id", spotId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("spots").insert(spotData).select("id").single();
        if (error) throw error;
        spotId = data.id;
      }

      // Upload new images
      if (newFiles.length > 0) {
        setUploading(true);
        const startOrder = existingImages.length;
        for (let i = 0; i < newFiles.length; i++) {
          const url = await uploadSpotImage(newFiles[i]);
          await supabase.from("spot_images").insert({
            spot_id: spotId!,
            image_url: url,
            sort_order: startOrder + i,
          });
        }
        setUploading(false);
      }

      queryClient.invalidateQueries({ queryKey: ["admin-spots"] });
      queryClient.invalidateQueries({ queryKey: ["admin-spot", id] });
      toast.success(isEdit ? "স্পট আপডেট হয়েছে" : "স্পট যোগ হয়েছে");
      navigate("/admin/spots");
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
      <h1 className="text-2xl font-bold mb-6">{isEdit ? "স্পট এডিট করুন" : "নতুন স্পট"}</h1>

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
          <label className="text-sm font-medium">ক্যাটাগরি</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">সংক্ষেপ</label>
          <Textarea value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} rows={2} className="mt-1" />
        </div>

        <div>
          <label className="text-sm font-medium">লোকেশন</label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1" />
        </div>

        <div>
          <label className="text-sm font-medium">কিভাবে যাবেন</label>
          <Textarea value={howToReach} onChange={(e) => setHowToReach(e.target.value)} rows={2} className="mt-1" />
        </div>

        <div>
          <label className="text-sm font-medium">কি দেখবেন</label>
          <Textarea value={whatToSee} onChange={(e) => setWhatToSee(e.target.value)} rows={2} className="mt-1" />
        </div>

        <div>
          <label className="text-sm font-medium">পরামর্শ</label>
          <Textarea value={tips} onChange={(e) => setTips(e.target.value)} rows={2} className="mt-1" />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <Checkbox checked={featured} onCheckedChange={(c) => setFeatured(!!c)} />
            <span className="text-sm">Featured</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox checked={popular} onCheckedChange={(c) => setPopular(!!c)} />
            <span className="text-sm">Popular</span>
          </label>
        </div>

        {/* Images */}
        <div>
          <label className="text-sm font-medium">ছবি</label>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {existingImages.map((img) => (
              <div key={img.id} className="relative group">
                <img src={img.image_url} alt="" className="w-full aspect-square object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeExisting(img.id)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {newFiles.map((file, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeNewFile(i)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <label className="mt-3 flex items-center gap-2 border border-dashed rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition">
            <Upload className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">ছবি আপলোড করুন</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {uploading ? "আপলোড হচ্ছে..." : "সেভ হচ্ছে..."}
              </>
            ) : isEdit ? "আপডেট করুন" : "যোগ করুন"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/spots")}>
            বাতিল
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSpotForm;
