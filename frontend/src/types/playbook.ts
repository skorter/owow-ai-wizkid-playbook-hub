export type Subpage = {
  label: string;
  slug: string;
};

export type Page = {
  label: string;
  slug: string;
  subpages: Subpage[];
};

export type Category = {
  label: string;
  slug: string;
  pages: Page[];
};
