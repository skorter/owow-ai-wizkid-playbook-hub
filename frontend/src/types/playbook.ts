export type Subpage = {
  label: string;
  slug: string;
};

export type Page = {
  label: string;
  slug: string;
  description: string;
  subpages: Subpage[];
};

export type Category = {
  label: string;
  slug: string;
  description: string;
  icon: string;
  pages: Page[];
};
