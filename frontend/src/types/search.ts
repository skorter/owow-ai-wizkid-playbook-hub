export type RecentActivityItem = {
  label: string;
  meta: string;
};

export type SourceDocument = {
  badge: string;
  title: string;
  section: string;
  slug: string;
};

export type DetailedAnswer = {
  title: string;
  description: string;
  steps: string[];
  note: string;
};

export type QuickAnswer = {
  answer: string;
};
