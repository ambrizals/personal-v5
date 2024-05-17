export function formatToSlug(input: string): string {
  return input
    .toLowerCase() // Convert the string to lowercase
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^a-z0-9\-]/g, "") // Remove all characters that are not a-z, 0-9, or -
    .replace(/\-{2,}/g, "-") // Replace multiple - with single -
    .replace(/^-+|-+$/g, ""); // Trim - from start and end of string
}
