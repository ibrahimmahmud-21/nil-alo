import { Link } from "react-router-dom";
import { lists, spots } from "@/data/spots";

const Lists = () => (
  <div className="container mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold mb-8">সব তালিকা</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {lists.map((list) => {
        const firstSpot = spots.find((s) => s.slug === list.spotSlugs[0]);
        return (
          <Link
            key={list.slug}
            to={`/list/${list.slug}`}
            className="group block rounded-xl overflow-hidden border bg-card hover:shadow-md transition-shadow"
          >
            {firstSpot && (
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={firstSpot.image}
                  alt={list.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-card-foreground">{list.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{list.description}</p>
              <span className="text-sm text-primary mt-2 inline-block">{list.spotSlugs.length}টি জায়গা →</span>
            </div>
          </Link>
        );
      })}
    </div>
  </div>
);

export default Lists;
