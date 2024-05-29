export function formatToSlug(input: string): string {
  return input
    .toLowerCase() // Convert the string to lowercase
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^a-z0-9\-]/g, "") // Remove all characters that are not a-z, 0-9, or -
    .replace(/\-{2,}/g, "-") // Replace multiple - with single -
    .replace(/^-+|-+$/g, ""); // Trim - from start and end of string
}

export function parseStringToObject(input: string): { [key: string]: string } {
  const result: { [key: string]: string } = {};

  // Remove any trailing semicolon and trim the string
  input = input.trim().replace(/;$/, "");

  // Split the input string by semicolon to get key-value pairs
  const pairs = input.split(";");

  // Iterate over each pair
  pairs.forEach((pair) => {
    // Trim the pair to remove any surrounding white spaces
    pair = pair.trim();

    // Split each pair by the equal sign
    const [key, value] = pair.split("=");

    // Add the key-value pair to the result object, after trimming
    if (key && value) {
      result[key.trim()] = value.trim();
    }
  });

  return result;
}