import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchListBySlug } from "@/lib/supabase-helpers";
import { getListBySlug, getSpotBySlug } from "@/data/spots";
import SpotCard from "@/components/SpotCard";

const ListDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: dbList, isLoading } = useQuery({
    queryKey: ["public-list", slug],
    queryFn: () => fetchListBySlug(slug || ""),
    enabled: !!slug,
  });

  // Fallback to static
  const staticList = getListBySlug(slug || "");

  const list = dbList || staticList;

  if (isLoading) {
    return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">লোড হচ্ছে...</div>;
  }

  if (!list) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">তালিকা পাওয়া যায়নি</h1>
        <Link to="/lists" className="text-primary mt-4 inline-block">সব তালিকা দেখুন →</Link>
      </div>
    );
  }

  // Get spots from DB list or static
  const listSpots = dbList
    ? dbList.spots.map((s) => ({
        slug: s.slug,
        title: s.title,
        shortDesc: s.short_desc || "",
        image: s.images?.[0]?.image_url || "",
        category: s.category,
      }))
    : (staticList?.spotSlugs || [])
        .map(getSpotBySlug)
        .filter(Boolean)
        .map((s) => ({
          slug: s!.slug,
          title: s!.title,
          shortDesc: s!.shortDesc,
          image: s!.image,
          category: s!.category,
        }));

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">{list.title}</h1>
      <p className="text-muted-foreground mb-8">{list.description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {listSpots.map((spot) => (
          <SpotCard key={spot.slug} spot={spot} />
        ))}
      </div>
    </div>
  );
};

export default ListDetail;
