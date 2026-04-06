/**
 * Converts a string to a URL-friendly slug.
 * e.g. "Hello World! This is Rentlee" → "hello-world-this-is-rentlee"
 */
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
