export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')       // spaces and underscores → hyphens
    .replace(/[^\w\-]+/g, '')      // remove non-word chars
    .replace(/\-\-+/g, '-')        // collapse multiple hyphens
    .replace(/^-+|-+$/g, '');      // trim leading/trailing hyphens
};
