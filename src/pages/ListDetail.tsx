import { useParams, Link } from "react-router-dom";
import { getListBySlug, getSpotBySlug } from "@/data/spots";
import SpotCard from "@/components/SpotCard";

const ListDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const list = getListBySlug(slug || "");

  if (!list) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">তালিকা পাওয়া যায়নি</h1>
        <Link to="/lists" className="text-primary mt-4 inline-block">সব তালিকা দেখুন →</Link>
      </div>
    );
  }

  const listSpots = list.spotSlugs.map(getSpotBySlug).filter(Boolean) as NonNullable<ReturnType<typeof getSpotBySlug>>[];

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
