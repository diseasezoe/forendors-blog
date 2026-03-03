export interface CategoryInfo {
  label: string;
  slug: string;
  tagClass: string;
}

export const categories: Record<string, CategoryInfo> = {
  tipy: { label: 'Forendors tipy', slug: 'tipy', tagClass: 'tag-tipy' },
  finance: { label: 'Finance', slug: 'finance', tagClass: 'tag-finance' },
  novinky: { label: 'Novinky', slug: 'novinky', tagClass: 'tag-novinky' },
  propagace: { label: 'Propagace', slug: 'propagace', tagClass: 'tag-propagace' },
  nastaveni: { label: 'Nastavení', slug: 'nastaveni', tagClass: 'tag-nastaveni' },
  rozhovor: { label: 'Rozhovory', slug: 'rozhovor', tagClass: 'tag-rozhovor' },
};

export function getCategoryInfo(slug: string): CategoryInfo {
  return categories[slug] ?? categories.tipy;
}

export const allCategories = Object.values(categories);
