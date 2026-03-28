import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchLists } from "@/lib/supabase-helpers";
import { lists as staticLists, spots as staticSpots } from "@/data/spots";

const Lists = () => {
  const { data: dbLists } = useQuery({
    queryKey: ["public-lists"],
    queryFn: fetchLists,
  });

  const hasDb = dbLists && dbLists.length > 0;
  const lists = hasDb ? dbLists : staticLists;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">সব তালিকা</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lists.map((list: any) => {
          const firstSpotImage = hasDb
            ? list.spots?.[0]?.images?.[0]?.image_url
            : staticSpots.find((s) => s.slug === list.spotSlugs?.[0])?.image;

          return (
            <Link
              key={list.slug}
              to={`/list/${list.slug}`}
              className="group block rounded-xl overflow-hidden border bg-card hover:shadow-md transition-shadow"
            >
              {firstSpotImage && (
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={firstSpotImage}
                    alt={list.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-card-foreground">{list.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{list.description}</p>
                <span className="text-sm text-primary mt-2 inline-block">
                  {list.spots?.length || list.spotSlugs?.length || 0}টি জায়গা →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Lists;
