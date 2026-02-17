/** Strip file extension from content collection IDs to get a clean slug */
export function slugFromId(id: string): string {
  return id.replace(/\.mdx?$/, "");
}
