import { useParams, Link } from "react-router-dom";
import { getSpotBySlug, spots } from "@/data/spots";
import SpotCard from "@/components/SpotCard";

const SpotDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const spot = getSpotBySlug(slug || "");

  if (!spot) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">জায়গা পাওয়া যায়নি</h1>
        <Link to="/spots" className="text-primary mt-4 inline-block">সব জায়গা দেখুন →</Link>
      </div>
    );
  }

  const related = spots.filter((s) => s.category === spot.category && s.slug !== spot.slug).slice(0, 3);

  const sections = [
    { title: "কোথায়", content: spot.location },
    { title: "কিভাবে যাবেন", content: spot.howToReach },
    { title: "কি দেখবেন", content: spot.whatToSee },
    { title: "পরামর্শ", content: spot.tips },
  ];

  return (
    <div>
      <div className="relative h-[50vh] min-h-[320px]">
        <img src={spot.image} alt={spot.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/30" />
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm mb-3">
            {spot.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">{spot.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-lg text-muted-foreground mb-8">{spot.shortDesc}</p>

        <div className="space-y-6">
          {sections.map((s) => (
            <div key={s.title} className="border rounded-xl p-5">
              <h2 className="font-semibold text-lg mb-2">{s.title}</h2>
              <p className="text-muted-foreground">{s.content}</p>
            </div>
          ))}
        </div>

        {/* Gallery */}
        <h2 className="text-xl font-bold mt-12 mb-4">গ্যালারি</h2>
        <div className="grid grid-cols-3 gap-3">
          {spot.gallery.map((img, i) => (
            <img key={i} src={img} alt={`${spot.title} ${i + 1}`} loading="lazy" className="rounded-lg w-full aspect-[4/3] object-cover" />
          ))}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-secondary/50">
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-xl font-bold mb-6">একই ধরনের জায়গা</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((s) => (
                <SpotCard key={s.slug} spot={s} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SpotDetail;
