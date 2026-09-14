export type PlaygroundResourceId =
  | "auth"
  | "users"
  | "posts"
  | "comments"
  | "albums"
  | "photos"
  | "todos"
  | "products"
  | "notifications"
  | "countries";

const RESOURCE_IDS: PlaygroundResourceId[] = [
  "auth",
  "users",
  "posts",
  "comments",
  "albums",
  "photos",
  "todos",
  "products",
  "notifications",
  "countries",
];

export function parsePlaygroundResource(
  value: string | string[] | undefined,
): PlaygroundResourceId {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw && RESOURCE_IDS.includes(raw as PlaygroundResourceId)) {
    return raw as PlaygroundResourceId;
  }
  return "users";
}
