export type EventCategory =
  | "Donation"
  | "Plantation"
  | "Cleanup"
  | "Education"
  | "Community"
  | "Other";

export type SocialEvent = {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  thumbnail: string;
  location: string;
  date: string;
  createdBy: string;
  createdAt: string;
  isSample?: boolean;
};

export type DemoUser = {
  name: string;
  email: string;
  photo: string;
};

export type JoinRecord = {
  eventId: string;
  userEmail: string;
  userName: string;
  joinedAt: string;
};

const dateAfter = (days: number) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

export function makeSampleEvents(): SocialEvent[] {
  const createdAt = new Date().toISOString();
  return [
    {
      id: "sample-winter-clothes",
      title: "Winter Clothes Sorting Day",
      description:
        "Help neighbours sort warm clothes by size, pack family bundles, and prepare them for a local winter distribution.",
      category: "Donation",
      thumbnail: "/images/winter-clothes-sorting-reference.png",
      location: "Mirpur 10, Dhaka",
      date: dateAfter(6),
      createdBy: "organizer@socialspark.demo",
      createdAt,
      isSample: true,
    },
    {
      id: "sample-tree-plantation",
      title: "A Sapling for Our Street",
      description:
        "Plant shade trees together and learn how to care for them through their first growing season.",
      category: "Plantation",
      thumbnail: "/images/community-planting.png",
      location: "Dhanmondi Lake, Dhaka",
      date: dateAfter(10),
      createdBy: "organizer@socialspark.demo",
      createdAt,
      isSample: true,
    },
    {
      id: "sample-cleanup-mirpur",
      title: "Clean Green Mirpur",
      description:
        "Bring a pair of gloves and join a friendly morning clearing litter from shared paths and planting beds.",
      category: "Cleanup",
      thumbnail: "/images/sure-we-can-earthday-clean-2021.jpg",
      location: "Mirpur 11, Dhaka",
      date: dateAfter(14),
      createdBy: "organizer@socialspark.demo",
      createdAt,
      isSample: true,
    },
    {
      id: "sample-book-exchange",
      title: "Little Neighbourhood Book Exchange",
      description:
        "Share a book you have loved, discover a new one, and help set up a small community reading corner.",
      category: "Education",
      thumbnail: "/images/hero-community-island.png",
      location: "Mohammadpur, Dhaka",
      date: dateAfter(19),
      createdBy: "organizer@socialspark.demo",
      createdAt,
      isSample: true,
    },
    {
      id: "sample-blanket-drive",
      title: "Blankets for the Cold Nights",
      description:
        "Sort donated blankets, prepare care bundles, and help a neighbourhood team coordinate deliveries.",
      category: "Donation",
      thumbnail: "/images/winter-clothes-sorting-reference.png",
      location: "Adabor, Dhaka",
      date: dateAfter(24),
      createdBy: "organizer@socialspark.demo",
      createdAt,
      isSample: true,
    },
    {
      id: "sample-garden-care",
      title: "A Morning in the Community Garden",
      description:
        "Water young plants, refresh the compost beds, and make a little more room for pollinators.",
      category: "Community",
      thumbnail: "/images/u-s-volunteers-join-okinawans-in-city.jpg",
      location: "Uttara Sector 7, Dhaka",
      date: dateAfter(29),
      createdBy: "organizer@socialspark.demo",
      createdAt,
      isSample: true,
    },
  ];
}

export const eventCategories: EventCategory[] = [
  "Donation",
  "Plantation",
  "Cleanup",
  "Education",
  "Community",
  "Other",
];
