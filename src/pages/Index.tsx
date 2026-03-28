import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search } from "lucide-react";
import heroImage from "@/assets/hero-beach.jpg";
import { spots, lists } from "@/data/spots";
import SpotCard from "@/components/SpotCard";

const Index = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const featuredSpots = spots.filter((s) => s.featured).slice(0, 6);
  const popularSpots = spots.filter((s) => s.popular).slice(0, 4);
  const latestLists = lists.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] flex items-center justify-center">
        <img
          src={heroImage}
          alt="কক্সবাজার সমুদ্র সৈকত"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="relative z-10 text-center px-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            কক্সবাজারের অজানা জায়গা
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-8">
            অজানা সুন্দর স্পট সহজে খুঁজে নিন
          </p>
          <form onSubmit={handleSearch} className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="খুঁজুন (যেমন: ইনানী বিচ)"
              className="w-full pl-12 pr-4 py-3.5 rounded-full bg-background/90 backdrop-blur text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
            />
          </form>
        </div>
      </section>

      {/* Featured Spots */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">বিশেষ জায়গা</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSpots.map((spot) => (
            <SpotCard key={spot.slug} spot={spot} />
          ))}
        </div>
      </section>

      {/* Popular Spots */}
      <section className="bg-secondary/50">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-8">জনপ্রিয় স্পট</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularSpots.map((spot) => (
              <SpotCard key={spot.slug} spot={spot} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Lists */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">সাম্প্রতিক তালিকা</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestLists.map((list) => (
            <Link
              key={list.slug}
              to={`/list/${list.slug}`}
              className="block rounded-xl border bg-card p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-card-foreground">{list.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{list.description}</p>
              <span className="text-sm text-primary mt-3 inline-block">
                {list.spotSlugs.length}টি জায়গা →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
