import inaniBeach from "@/assets/spots/inani-beach.jpg";
import himchari from "@/assets/spots/himchari.jpg";
import maheshkhali from "@/assets/spots/maheshkhali.jpg";
import saintMartin from "@/assets/spots/saint-martin.jpg";
import teknaf from "@/assets/spots/teknaf.jpg";
import sonadia from "@/assets/spots/sonadia.jpg";
import ramu from "@/assets/spots/ramu.jpg";
import laboni from "@/assets/spots/laboni.jpg";

export interface Spot {
  slug: string;
  title: string;
  shortDesc: string;
  image: string;
  location: string;
  howToReach: string;
  whatToSee: string;
  tips: string;
  gallery: string[];
  category: string;
  featured: boolean;
  popular: boolean;
}

export const spots: Spot[] = [
  {
    slug: "inani-beach",
    title: "ইনানী বিচ",
    shortDesc: "পাথর আর সমুদ্রের অসাধারণ মিলনস্থল",
    image: inaniBeach,
    location: "কক্সবাজার শহর থেকে ২৫ কিলোমিটার দক্ষিণে",
    howToReach: "কক্সবাজার থেকে অটো বা CNG তে করে যেতে পারবেন। ভাড়া ৩০০-৫০০ টাকা।",
    whatToSee: "প্রবাল পাথরের সৈকত, স্বচ্ছ নীল পানি, সূর্যাস্তের দৃশ্য",
    tips: "ভাটার সময় গেলে পাথরগুলো ভালো দেখা যায়। সাথে পানি ও খাবার নিয়ে যান।",
    gallery: [inaniBeach, inaniBeach, inaniBeach],
    category: "সৈকত",
    featured: true,
    popular: true,
  },
  {
    slug: "himchari",
    title: "হিমছড়ি জাতীয় উদ্যান",
    shortDesc: "ঝর্না আর পাহাড়ের প্রাকৃতিক সৌন্দর্য",
    image: himchari,
    location: "কক্সবাজার শহর থেকে ১২ কিলোমিটার দক্ষিণে",
    howToReach: "কক্সবাজার থেকে জিপ বা CNG তে যাওয়া যায়। ভাড়া ২০০-৩০০ টাকা।",
    whatToSee: "হিমছড়ি ঝর্না, পাহাড়ি ট্রেইল, সমুদ্রের দৃশ্য",
    tips: "বর্ষাকালে ঝর্না পূর্ণ থাকে। ট্রেকিং জুতা পরে যান।",
    gallery: [himchari, himchari, himchari],
    category: "প্রকৃতি",
    featured: true,
    popular: true,
  },
  {
    slug: "maheshkhali",
    title: "মহেশখালী দ্বীপ",
    shortDesc: "বাংলাদেশের একমাত্র পাহাড়ি দ্বীপ",
    image: maheshkhali,
    location: "কক্সবাজার থেকে স্পিডবোটে ৪৫ মিনিট",
    howToReach: "কক্সবাজার কস্তুরাঘাট থেকে স্পিডবোট বা ট্রলার পাওয়া যায়।",
    whatToSee: "আদিনাথ মন্দির, শুঁটকি মহাল, পান বরজ",
    tips: "সকালে রওনা দিন, বিকেলে ফিরে আসুন। সাথে পর্যাপ্ত পানি রাখুন।",
    gallery: [maheshkhali, maheshkhali, maheshkhali],
    category: "দ্বীপ",
    featured: true,
    popular: false,
  },
  {
    slug: "saint-martin",
    title: "সেন্ট মার্টিন দ্বীপ",
    shortDesc: "বাংলাদেশের একমাত্র প্রবাল দ্বীপ",
    image: saintMartin,
    location: "টেকনাফ থেকে জাহাজে ২-৩ ঘন্টা",
    howToReach: "টেকনাফ থেকে জাহাজে যেতে হয়। নভেম্বর-মার্চ সিজন।",
    whatToSee: "প্রবাল, ছেঁড়া দ্বীপ, নারিকেল বাগান, স্বচ্ছ পানি",
    tips: "অফ সিজনে জাহাজ চলে না। আগে থেকে হোটেল বুক করুন।",
    gallery: [saintMartin, saintMartin, saintMartin],
    category: "দ্বীপ",
    featured: true,
    popular: true,
  },
  {
    slug: "teknaf",
    title: "টেকনাফ সমুদ্র সৈকত",
    shortDesc: "নির্জন ও শান্ত সমুদ্র সৈকত",
    image: teknaf,
    location: "কক্সবাজার থেকে ৮০ কিলোমিটার দক্ষিণে",
    howToReach: "কক্সবাজার থেকে বাসে ২ ঘন্টা লাগে। ভাড়া ১৫০-২০০ টাকা।",
    whatToSee: "নির্জন সৈকত, জেলে নৌকা, সূর্যাস্ত",
    tips: "সেন্ট মার্টিন যাওয়ার পথে ঘুরে দেখতে পারেন।",
    gallery: [teknaf, teknaf, teknaf],
    category: "সৈকত",
    featured: true,
    popular: false,
  },
  {
    slug: "sonadia",
    title: "সোনাদিয়া দ্বীপ",
    shortDesc: "ম্যানগ্রোভ বন ও পাখির অভয়ারণ্য",
    image: sonadia,
    location: "মহেশখালী দ্বীপের কাছে",
    howToReach: "মহেশখালী থেকে নৌকায় যেতে হয়।",
    whatToSee: "ম্যানগ্রোভ বন, বিভিন্ন প্রজাতির পাখি, লাল কাঁকড়া",
    tips: "শীতকালে পরিযায়ী পাখি দেখা যায়। ক্যামেরা সাথে রাখুন।",
    gallery: [sonadia, sonadia, sonadia],
    category: "প্রকৃতি",
    featured: true,
    popular: false,
  },
  {
    slug: "ramu",
    title: "রামু বৌদ্ধ বিহার",
    shortDesc: "ঐতিহ্যবাহী বৌদ্ধ মন্দির ও স্থাপত্য",
    image: ramu,
    location: "কক্সবাজার শহর থেকে ১৫ কিলোমিটার উত্তরে",
    howToReach: "কক্সবাজার থেকে অটো বা বাসে যাওয়া যায়। ভাড়া ৫০-১০০ টাকা।",
    whatToSee: "রামকোট বৌদ্ধ বিহার, ব্রোঞ্জ বুদ্ধ মূর্তি, প্রাচীন মন্দির",
    tips: "সকালে গেলে ভিড় কম থাকে। শালীন পোশাক পরুন।",
    gallery: [ramu, ramu, ramu],
    category: "ঐতিহ্য",
    featured: false,
    popular: true,
  },
  {
    slug: "laboni-beach",
    title: "লাবণী পয়েন্ট",
    shortDesc: "কক্সবাজারের সবচেয়ে জনপ্রিয় সৈকত",
    image: laboni,
    location: "কক্সবাজার শহরের কেন্দ্রে",
    howToReach: "শহরের যেকোনো জায়গা থেকে রিকশায় যাওয়া যায়।",
    whatToSee: "সূর্যোদয়, সূর্যাস্ত, ঘোড়ায় চড়া, বিচ বাইক",
    tips: "সন্ধ্যায় ভিড় বেশি থাকে। সকালে গেলে ভালো।",
    gallery: [laboni, laboni, laboni],
    category: "সৈকত",
    featured: false,
    popular: true,
  },
];

export interface SpotList {
  slug: string;
  title: string;
  description: string;
  spotSlugs: string[];
}

export const lists: SpotList[] = [
  {
    slug: "best-beaches",
    title: "সেরা ৫ সমুদ্র সৈকত",
    description: "কক্সবাজারের সবচেয়ে সুন্দর সমুদ্র সৈকতগুলো",
    spotSlugs: ["inani-beach", "laboni-beach", "teknaf", "himchari", "saint-martin"],
  },
  {
    slug: "island-hopping",
    title: "দ্বীপ ভ্রমণ গাইড",
    description: "কক্সবাজারের কাছের সেরা দ্বীপগুলো ঘুরে দেখুন",
    spotSlugs: ["saint-martin", "maheshkhali", "sonadia"],
  },
  {
    slug: "nature-lovers",
    title: "প্রকৃতিপ্রেমীদের জন্য",
    description: "প্রকৃতির কাছাকাছি যেতে চাইলে এই জায়গাগুলো ঘুরুন",
    spotSlugs: ["himchari", "sonadia", "maheshkhali", "inani-beach", "teknaf"],
  },
  {
    slug: "historical-places",
    title: "ঐতিহাসিক স্থান",
    description: "কক্সবাজারের ইতিহাস ও ঐতিহ্য জানতে ঘুরে আসুন",
    spotSlugs: ["ramu", "maheshkhali"],
  },
  {
    slug: "weekend-trip",
    title: "উইকেন্ড ট্রিপ প্ল্যান",
    description: "২ দিনে কক্সবাজারের সেরা জায়গাগুলো ঘুরে দেখুন",
    spotSlugs: ["laboni-beach", "inani-beach", "himchari", "ramu"],
  },
];

export function getSpotBySlug(slug: string): Spot | undefined {
  return spots.find((s) => s.slug === slug);
}

export function getListBySlug(slug: string): SpotList | undefined {
  return lists.find((l) => l.slug === slug);
}

export function searchSpots(query: string): Spot[] {
  const q = query.toLowerCase();
  return spots.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.shortDesc.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q)
  );
}
