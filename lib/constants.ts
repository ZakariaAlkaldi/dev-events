export type EventItem = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: EventItem[] = [
  {
    title: "Google I/O 2027",
    image: "/images/event1.png",
    slug: "google-io-2027",
    location: "Mountain View, California",
    date: "May 18-20, 2027",
    time: "9:00 AM - 6:00 PM",
  },
  {
    title: "AWS Summit New York",
    image: "/images/event2.png",
    slug: "aws-summit-new-york-2026",
    location: "New York City, New York",
    date: "July 16, 2026",
    time: "8:30 AM - 5:30 PM",
  },
  {
    title: "GitHub Universe",
    image: "/images/event3.png",
    slug: "github-universe-2026",
    location: "San Francisco, California",
    date: "October 29-30, 2026",
    time: "9:00 AM - 5:00 PM",
  },
  {
    title: "Hack the North",
    image: "/images/event4.png",
    slug: "hack-the-north-2026",
    location: "Waterloo, Ontario",
    date: "September 25-27, 2026",
    time: "All day",
  },
  {
    title: "React Advanced London",
    image: "/images/event5.png",
    slug: "react-advanced-london-2026",
    location: "London, United Kingdom",
    date: "October 9-10, 2026",
    time: "9:30 AM - 6:00 PM",
  },
  {
    title: "TechCrunch Disrupt",
    image: "/images/event6.png",
    slug: "techcrunch-disrupt-2026",
    location: "San Francisco, California",
    date: "October 27-29, 2026",
    time: "9:00 AM - 6:00 PM",
  },
];
