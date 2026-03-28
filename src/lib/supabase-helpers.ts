import { supabase } from "@/integrations/supabase/client";

export type DbSpot = {
  id: string;
  slug: string;
  title: string;
  short_desc: string;
  category: string;
  location: string;
  how_to_reach: string;
  what_to_see: string;
  tips: string;
  featured: boolean;
  popular: boolean;
  created_at: string;
  updated_at: string;
  images: { id: string; image_url: string; sort_order: number }[];
};

export type DbList = {
  id: string;
  slug: string;
  title: string;
  description: string;
  created_at: string;
  spots: DbSpot[];
};

export async function fetchSpots() {
  const { data: spots, error } = await supabase
    .from("spots")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;

  const { data: images } = await supabase
    .from("spot_images")
    .select("*")
    .order("sort_order");

  return (spots || []).map((s) => ({
    ...s,
    images: (images || []).filter((img) => img.spot_id === s.id),
  })) as DbSpot[];
}

export async function fetchSpotBySlug(slug: string) {
  const { data: spot, error } = await supabase
    .from("spots")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!spot) return null;

  const { data: images } = await supabase
    .from("spot_images")
    .select("*")
    .eq("spot_id", spot.id)
    .order("sort_order");

  return { ...spot, images: images || [] } as DbSpot;
}

export async function fetchLists() {
  const { data: lists, error } = await supabase
    .from("lists")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;

  const { data: listSpots } = await supabase
    .from("list_spots")
    .select("*, spots(*)")
    .order("sort_order");

  const { data: allImages } = await supabase
    .from("spot_images")
    .select("*")
    .order("sort_order");

  return (lists || []).map((l) => ({
    ...l,
    spots: (listSpots || [])
      .filter((ls) => ls.list_id === l.id)
      .map((ls) => ({
        ...(ls.spots as any),
        images: (allImages || []).filter((img) => img.spot_id === (ls.spots as any)?.id),
      })),
  })) as DbList[];
}

export async function fetchListBySlug(slug: string) {
  const { data: list, error } = await supabase
    .from("lists")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!list) return null;

  const { data: listSpots } = await supabase
    .from("list_spots")
    .select("*, spots(*)")
    .eq("list_id", list.id)
    .order("sort_order");

  const spotIds = (listSpots || []).map((ls) => (ls.spots as any)?.id).filter(Boolean);
  const { data: images } = await supabase
    .from("spot_images")
    .select("*")
    .in("spot_id", spotIds.length ? spotIds : ["none"])
    .order("sort_order");

  return {
    ...list,
    spots: (listSpots || []).map((ls) => ({
      ...(ls.spots as any),
      images: (images || []).filter((img) => img.spot_id === (ls.spots as any)?.id),
    })),
  } as DbList;
}

export async function searchSpotsDb(query: string) {
  const q = `%${query}%`;
  const { data, error } = await supabase
    .from("spots")
    .select("*")
    .or(`title.ilike.${q},short_desc.ilike.${q},category.ilike.${q},location.ilike.${q}`);
  if (error) throw error;

  const spotIds = (data || []).map((s) => s.id);
  const { data: images } = await supabase
    .from("spot_images")
    .select("*")
    .in("spot_id", spotIds.length ? spotIds : ["none"])
    .order("sort_order");

  return (data || []).map((s) => ({
    ...s,
    images: (images || []).filter((img) => img.spot_id === s.id),
  })) as DbSpot[];
}

export async function uploadSpotImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("spot-images").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("spot-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteSpotImage(imageUrl: string) {
  const parts = imageUrl.split("/spot-images/");
  if (parts.length < 2) return;
  const path = parts[1];
  await supabase.storage.from("spot-images").remove([path]);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    || `spot-${Date.now()}`;
}
