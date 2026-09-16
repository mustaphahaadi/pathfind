export interface NavLink {
  label: string;
  to: string;
}

/** Primary navigation links displayed across floating navbar on all pages. */
export const marketingNavLinks: NavLink[] = [
  { label: "Browse Mentors", to: "/mentors" },
  { label: "About Us", to: "/about" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Stories", to: "/stories" },
  { label: "Volunteer", to: "/volunteer" },
];

export const appNavLinks: NavLink[] = marketingNavLinks;

export const footerNavLinks: NavLink[] = [
  { label: "Community Guidelines", to: "/community-guidelines" },
  { label: "Honor Code", to: "/honor-code" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Become a Mentor", to: "/join/mentor" },
  { label: "Open Source", to: "/open-source" },
];
