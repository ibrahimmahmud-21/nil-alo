import { useSearchParams } from "react-router-dom";
import { searchSpots } from "@/data/spots";
import SpotCard from "@/components/SpotCard";

const SearchResults = () => {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const results = searchSpots(q);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">
        "{q}" এর ফলাফল
      </h1>
      <p className="text-muted-foreground mb-8">{results.length}টি জায়গা পাওয়া গেছে</p>
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((spot) => (
            <SpotCard key={spot.slug} spot={spot} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-12">কোনো ফলাফল পাওয়া যায়নি।</p>
      )}
    </div>
  );
};

export default SearchResults;
