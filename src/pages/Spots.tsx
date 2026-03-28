import { useQuery } from "@tanstack/react-query";
import { fetchSpots } from "@/lib/supabase-helpers";
import { spots as staticSpots } from "@/data/spots";
import SpotCard from "@/components/SpotCard";

const Spots = () => {
  const { data: dbSpots } = useQuery({
    queryKey: ["public-spots"],
    queryFn: fetchSpots,
  });

  const hasDb = dbSpots && dbSpots.length > 0;
  const spots = hasDb ? dbSpots : staticSpots;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">সব জায়গা</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {spots.map((spot: any) => (
          <SpotCard
            key={spot.slug}
            spot={{
              slug: spot.slug,
              title: spot.title,
              shortDesc: spot.short_desc || spot.shortDesc || "",
              image: spot.images?.[0]?.image_url || spot.image || "",
              category: spot.category,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Spots;
