import { spots } from "@/data/spots";
import SpotCard from "@/components/SpotCard";

const Spots = () => (
  <div className="container mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold mb-8">সব জায়গা</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {spots.map((spot) => (
        <SpotCard key={spot.slug} spot={spot} />
      ))}
    </div>
  </div>
);

export default Spots;
