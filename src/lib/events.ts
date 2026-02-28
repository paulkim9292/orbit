import { supabase } from "./supabase";
import type { Activity } from "@/routes/home";

/* ─── Social wellbeing points per subcategory section ─── */

const SECTION_POINTS: Record<string, number> = {
  "Volunteering & Social Contribution": 1000,
  "Social Networking": 800,
  "Team Sports": 700,
  "Learning & Discussion": 650,
  "Endurance/Adventure Sports": 600,
  "Arts & Cultural Discovery": 550,
  "Racket-based & Individual Sports": 500,
  "Technology & Development": 500,
  "Creative Arts & DIY": 450,
  "Light/Recovery Activities": 400,
  "e-Sports & Gaming": 350,
};

/** Maps each subcategory item to its parent section */
const SUBCATEGORY_TO_SECTION: Record<string, string> = {
  // Light/Recovery Activities
  "Walking/\nCasual Walk Groups": "Light/Recovery Activities",
  "Yoga/Pilates/\nStretching": "Light/Recovery Activities",
  "Light Cycling/\nMobility Sessions": "Light/Recovery Activities",
  "Meditation/\nMindful Movements": "Light/Recovery Activities",
  // Team Sports
  "Soccer/Futsal": "Team Sports",
  "Basketball/Volleyball": "Team Sports",
  "Baseball/Softball": "Team Sports",
  "Recreational Team Games": "Team Sports",
  // Racket-based & Individual Sports
  "Tennis/Badminton": "Racket-based & Individual Sports",
  "Table Tennis/Squash": "Racket-based & Individual Sports",
  "Jogging & Short-Distance Running Crew": "Racket-based & Individual Sports",
  "Indoor Climbing/\nBouldering": "Racket-based & Individual Sports",
  // Endurance/Adventure Sports
  "Hiking/Long-distance Trekking": "Endurance/Adventure Sports",
  "Surfing & Water Sports": "Endurance/Adventure Sports",
  "Marathon/\nEndurance Training": "Endurance/Adventure Sports",
  "Competitive Leagues & Tournaments": "Endurance/Adventure Sports",
  // Learning & Discussion
  "Book Clubs & Reading Circles": "Learning & Discussion",
  "Exam & Certification Study Groups": "Learning & Discussion",
  "Language Exchange & Practice Groups": "Learning & Discussion",
  "Humanities/Society & Current Affairs Dialogue": "Learning & Discussion",
  // Arts & Cultural Discovery
  "Movie & Performance Watching": "Arts & Cultural Discovery",
  "Exhibition & Museum Visits": "Arts & Cultural Discovery",
  "Concerts & Music Appreciation Sessions": "Arts & Cultural Discovery",
  "Architecture & Historical Exploration": "Arts & Cultural Discovery",
  // Technology & Development
  "Coding & Development Projects": "Technology & Development",
  "Data Analysis & AI Study Groups": "Technology & Development",
  "Website / App Building Meetups": "Technology & Development",
  "Tech Collaboration & Hack Sessions": "Technology & Development",
  // Creative Arts & DIY
  "Drawing & Photography": "Creative Arts & DIY",
  "Cooking & Baking": "Creative Arts & DIY",
  "Craft & DIY\n(Pottery, Woodwork etc)": "Creative Arts & DIY",
  "Musical Instrument Practices & Composition": "Creative Arts & DIY",
  // Social Networking
  "Café & Casual Hangouts": "Social Networking",
  "Board Games & Card Games": "Social Networking",
  "Dining & Drinks Gatherings": "Social Networking",
  "City Walks & Local Exploration": "Social Networking",
  // Volunteering & Social Contribution
  "Environmental Clean-up & Plogging": "Volunteering & Social Contribution",
  "Community Service & Elderly Support": "Volunteering & Social Contribution",
  "Mentorship & Talent-sharing Volunteering": "Volunteering & Social Contribution",
  "Social Impact Projects & Campaigns": "Volunteering & Social Contribution",
  // e-Sports & Gaming
  "Online Multiplayer Games": "e-Sports & Gaming",
  "Offline PC Café / Arcade Meetups": "e-Sports & Gaming",
  "Casual Team-based Gaming Sessions": "e-Sports & Gaming",
  "Competitive Gaming & Tournaments": "e-Sports & Gaming",
};

const SECTION_IMAGES: Record<string, string> = {
  "Light/Recovery Activities": "/images/home-card-yoga.jpg",
  "Team Sports": "/images/home-card-teamsports.jpg",
  "Racket-based & Individual Sports": "/images/home-card-racket.jpg",
  "Endurance/Adventure Sports": "/images/home-card-hiking.jpg",
  "Learning & Discussion": "/images/home-card-bookclub.jpg",
  "Arts & Cultural Discovery": "/images/home-card-jazz.jpg",
  "Technology & Development": "/images/home-card-hackathon.jpg",
  "Creative Arts & DIY": "/images/home-card-pottery.jpg",
  "Social Networking": "/images/home-card-language.jpg",
  "Volunteering & Social Contribution": "/images/home-card-cleanup.jpg",
  "e-Sports & Gaming": "/images/home-card-esports.jpg",
};

export function getPointsForSubcategory(subcategory: string): number {
  const section = SUBCATEGORY_TO_SECTION[subcategory];
  return section ? (SECTION_POINTS[section] ?? 300) : 300;
}

export function getImageForSubcategory(subcategory: string): string {
  const section = SUBCATEGORY_TO_SECTION[subcategory];
  return section ? (SECTION_IMAGES[section] ?? "/images/home-card-others.svg") : "/images/home-card-others.svg";
}

export interface EventDetail {
  id: string;
  title: string;
  image: string;
  eventDate: string;
  uploadDate: string;
  district: string;
  people: number;
  views: number;
  rewards: number | null;
  featured: boolean;
  category: string | null;
  subcategory: string | null;
  gender: string | null;
  ageFrom: number | null;
  ageTo: number | null;
  timeFrom: string | null;
  timeTo: string | null;
  location: string | null;
  maxPeople: number | null;
  description: string | null;
}

export async function fetchEventById(id: string): Promise<EventDetail> {
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, title, image, event_date, upload_date, district, people, views, rewards, featured, category, subcategory, gender, age_from, age_to, time_from, time_to, location, max_people, description",
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    image: data.image,
    eventDate: data.event_date,
    uploadDate: data.upload_date,
    district: data.district,
    people: data.people,
    views: data.views,
    rewards: data.rewards,
    featured: data.featured,
    category: data.category,
    subcategory: data.subcategory,
    gender: data.gender,
    ageFrom: data.age_from,
    ageTo: data.age_to,
    timeFrom: data.time_from,
    timeTo: data.time_to,
    location: data.location,
    maxPeople: data.max_people,
    description: data.description,
  };
}

export async function fetchActivities(
  options: { includePast?: boolean } = {},
): Promise<Activity[]> {
  let query = supabase
    .from("events")
    .select(
      "id, image, title, event_date, upload_date, district, people, views, rewards, featured",
    );

  if (!options.includePast) {
    query = query.gte("event_date", new Date().toISOString());
  }

  const { data, error } = await query.order("event_date", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    image: row.image,
    title: row.title,
    eventDate: row.event_date,
    uploadDate: row.upload_date,
    district: row.district,
    people: row.people,
    views: row.views,
    rewards: row.rewards ?? undefined,
    featured: row.featured,
  }));
}

export async function createEvent(input: {
  title: string;
  category: string;
  subcategory: string;
  gender: string;
  ageFrom: number | null;
  ageTo: number | null;
  eventDate: string;
  timeFrom: string;
  timeTo: string;
  location: string;
  maxPeople: number;
  description: string;
}) {
  const { error } = await supabase.from("events").insert({
    title: input.title,
    image: getImageForSubcategory(input.subcategory),
    event_date: input.eventDate,
    district: input.location || "TBD",
    people: 1,
    views: 0,
    rewards: getPointsForSubcategory(input.subcategory),
    featured: false,
    category: input.category,
    subcategory: input.subcategory,
    gender: input.gender,
    age_from: input.ageFrom,
    age_to: input.ageTo,
    time_from: input.timeFrom,
    time_to: input.timeTo,
    location: input.location,
    max_people: input.maxPeople,
    description: input.description,
  });

  if (error) throw error;
}
