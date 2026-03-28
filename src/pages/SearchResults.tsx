import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchSpotsDb } from "@/lib/supabase-helpers";
import { searchSpots } from "@/data/spots";
import SpotCard from "@/components/SpotCard";

const SearchResults = () => {
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  const { data: dbResults } = useQuery({
    queryKey: ["search", q],
    queryFn: () => searchSpotsDb(q),
    enabled: q.length > 0,
  });

  // Fallback to static search
  const staticResults = searchSpots(q);
  const hasDb = dbResults && dbResults.length > 0;
  const results = hasDb ? dbResults : staticResults;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">
        "{q}" এর ফলাফল
      </h1>
      <p className="text-muted-foreground mb-8">{results.length}টি জায়গা পাওয়া গেছে</p>
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((spot: any) => (
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
      ) : (
        <p className="text-muted-foreground text-center py-12">কোনো ফলাফল পাওয়া যায়নি।</p>
      )}
    </div>
  );
};

export default SearchResults;
