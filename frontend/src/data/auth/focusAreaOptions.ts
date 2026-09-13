import type { SelectOption } from "./menteeStageOptions";

/** Shared between the mentee sign-up (interest) and mentor sign-up (expertise) forms. */
export const focusAreaOptions: SelectOption[] = [
  { id: "software-engineering", label: "Software Engineering" },
  { id: "product-management", label: "Product Management" },
  { id: "product-design-ux", label: "Product Design / UX" },
  { id: "data-ai", label: "Data & AI" },
];
