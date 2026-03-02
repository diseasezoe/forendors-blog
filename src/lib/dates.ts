const months = [
  'ledna', 'února', 'března', 'dubna', 'května', 'června',
  'července', 'srpna', 'září', 'října', 'listopadu', 'prosince',
];

/** Formats a Date as "10. 8. 2025" */
export function formatDate(date: Date): string {
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
}

/** Formats a Date as "10. srpna 2025" */
export function formatDateLong(date: Date): string {
  return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}
