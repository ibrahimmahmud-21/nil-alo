import { Link } from "react-router-dom";
import type { Spot } from "@/data/spots";

const SpotCard = ({ spot }: { spot: Spot }) => {
  return (
    <Link
      to={`/spot/${spot.slug}`}
      className="group block rounded-xl overflow-hidden bg-card border shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={spot.image}
          alt={spot.title}
          loading="lazy"
          width={800}
          height={600}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-primary">{spot.category}</span>
        <h3 className="text-lg font-semibold mt-1 text-card-foreground">{spot.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{spot.shortDesc}</p>
      </div>
    </Link>
  );
};

export default SpotCard;
