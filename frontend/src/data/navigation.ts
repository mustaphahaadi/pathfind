export interface NavLink {
  label: string;
  to: string;
}

/** Used on the transparent header over the marketing landing page hero. */
export const marketingNavLinks: NavLink[] = [
  { label: "Browse Mentors", to: "/mentors" },
  { label: "About Us", to: "/about" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Stories", to: "/stories" },
  { label: "Sign In", to: "/auth" },
];

/** Used on the solid white header across in-product pages (sign up/in, browse mentors, etc). */
export const appNavLinks: NavLink[] = [
  { label: "Browse Mentors", to: "/mentors" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Volunteer", to: "/volunteer" },
  { label: "About", to: "/about" },
];

export const footerNavLinks: NavLink[] = [
  { label: "Community Guidelines", to: "/community-guidelines" },
  { label: "Honor Code", to: "/honor-code" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Become a Mentor", to: "/join/mentor" },
  { label: "Open Source", to: "/open-source" },
];
