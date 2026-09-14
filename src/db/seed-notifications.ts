/** Seed notifications resolve `authorUsername` → userId after users insert. */
export type SeedNotification = {
  authorUsername: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
};

export const seedNotifications: SeedNotification[] = [
  {
    authorUsername: "avachen",
    title: "Welcome to MockData",
    message: "Your workspace seed data is ready to explore.",
    type: "success",
    read: true,
  },
  {
    authorUsername: "avachen",
    title: "API rate limit tip",
    message: "Free tier allows 60 requests per minute per IP.",
    type: "info",
    read: false,
  },
  {
    authorUsername: "mreid",
    title: "Theme updated",
    message: "Dark mode preference was saved on this device.",
    type: "info",
    read: true,
  },
  {
    authorUsername: "sofia.a",
    title: "Comment reply",
    message: "Someone replied to your post about pagination.",
    type: "info",
    read: false,
  },
  {
    authorUsername: "noahk",
    title: "Draft reminder",
    message: "You have an unpublished post waiting for review.",
    type: "warning",
    read: false,
  },
  {
    authorUsername: "epetrova",
    title: "Index applied",
    message: "Database indexes for posts.user_id are live.",
    type: "success",
    read: true,
  },
  {
    authorUsername: "jwright",
    title: "Token stored",
    message: "Playground login token was saved to local storage.",
    type: "success",
    read: true,
  },
  {
    authorUsername: "priyan",
    title: "Search tweak",
    message: "ILIKE patterns were tuned for title search.",
    type: "info",
    read: false,
  },
  {
    authorUsername: "lmoreau",
    title: "Copy refresh",
    message: "Sample post bodies were rewritten for clarity.",
    type: "info",
    read: true,
  },
  {
    authorUsername: "hbrooks",
    title: "Rate limit headers",
    message: "Docs now include Retry-After and X-RateLimit-* examples.",
    type: "success",
    read: false,
  },
  {
    authorUsername: "ohassan",
    title: "OpenAPI drift",
    message: "A PR changed routes without updating OpenAPI.",
    type: "warning",
    read: false,
  },
  {
    authorUsername: "ytanaka",
    title: "Travel draft",
    message: "Your travel album draft is ready to publish.",
    type: "info",
    read: false,
  },
  {
    authorUsername: "icosta",
    title: "Profile wall",
    message: "Filter posts by userId to build a profile feed.",
    type: "info",
    read: true,
  },
  {
    authorUsername: "dokonkwo",
    title: "Seed order fixed",
    message: "Child tables now delete before parents on reset.",
    type: "success",
    read: true,
  },
  {
    authorUsername: "mjohansson",
    title: "Boolean query tip",
    message: "Use completed=true|false as query strings.",
    type: "info",
    read: true,
  },
  {
    authorUsername: "eclarke",
    title: "Error shape",
    message: "All errors now share code + message fields.",
    type: "success",
    read: false,
  },
  {
    authorUsername: "asaleh",
    title: "Delay capped",
    message: "Mock delay query params max out at 5000ms.",
    type: "info",
    read: true,
  },
  {
    authorUsername: "tsilva",
    title: "Tag limit",
    message: "Posts accept at most 20 tags per record.",
    type: "warning",
    read: false,
  },
  {
    authorUsername: "gliu",
    title: "Sort option",
    message: "List endpoints support sort=title and sort=createdAt.",
    type: "info",
    read: true,
  },
  {
    authorUsername: "bortiz",
    title: "Resend domain",
    message: "Verify your sending domain before production mail.",
    type: "warning",
    read: false,
  },
  {
    authorUsername: "cmartin",
    title: "Curl examples",
    message: "Docs panels now show curl alongside fetch and axios.",
    type: "success",
    read: true,
  },
  {
    authorUsername: "rpatel",
    title: "UUID keys",
    message: "Most resources use UUID primary keys by default.",
    type: "info",
    read: true,
  },
  {
    authorUsername: "fzahra",
    title: "Welcome",
    message: "Thanks for trying MockData — start in the playground.",
    type: "success",
    read: false,
  },
  {
    authorUsername: "avachen",
    title: "Inventory low",
    message: "Noise-Cancel Headphones stock dropped below 50.",
    type: "error",
    read: false,
  },
];
