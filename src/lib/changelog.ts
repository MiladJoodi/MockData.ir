export type SiteUpdate = {
  id: string;
  date: string;
  title: string;
  /** Short line shown in the header menu and collapsed docs cards. */
  summary: string;
  /** Extra lines shown when a docs card is expanded. */
  details: string[];
  /** Optional “try it” link inside the expanded panel. */
  href?: string;
  hrefLabel?: string;
};

/** Newest first. User-facing features only. Prepend to resurface the badge. */
export const siteUpdates: SiteUpdate[] = [
  {
    id: "2026-09-17-generator",
    date: "2026-09-17",
    title: "Fake Data Generator",
    summary:
      "Generate realistic JSON for UI work — pick a type, fields, and quantity, then copy, download, or publish via Temporary API.",
    details: [
      "Open /generator for people, ecommerce, content, media, business, and location types.",
      "POST body vs API record shapes; FA UI uses Persian locale packs.",
      "Generate up to 1,000 records in the browser; Create API uses Temporary limits (500 / 64 KB).",
      "Selections and results survive client-side navigation (cleared on full reload).",
    ],
    href: "/generator",
    hrefLabel: "Open generator",
  },
  {
    id: "2026-09-16-temporary",
    date: "2026-09-16",
    title: "Temporary API",
    summary:
      "Paste your own JSON and get a short-lived public REST URL — no account, up to 5 live APIs per browser.",
    details: [
      "Create from /temporary: pick a lifetime (1h, 6h, 12h, or 24h) and publish.",
      "Call the public /api/t/… URL with normal GET, POST, PATCH, and DELETE.",
      "Up to 5 live APIs per browser; up to 20 creates per IP per hour.",
      "Treat the link like a password — anyone who has it can read and change the data until it expires.",
    ],
    href: "/temporary",
    hrefLabel: "Create a temporary API",
  },
  {
    id: "2026-09-15-preview",
    date: "2026-09-15",
    title: "Preview",
    summary:
      "Live sample UIs for Users, Posts, Auth, and every resource — create, edit, and delete against the real API.",
    details: [
      "Each resource docs page has a Preview button that opens a tiny app on top of the real endpoints.",
      "List, search, paginate, create, edit, and delete rows — same shared demo database as everyone else.",
      "Auth preview includes a working login form (password is always password) and GET /me with the token.",
      "Use the header EN | FA toggle so preview lists load Persian sample data when you want it.",
    ],
    href: "/preview/users",
    hrefLabel: "Open Users preview",
  },
  {
    id: "2026-09-14-lang-fa",
    date: "2026-09-14",
    title: "Persian data (?lang=fa)",
    summary:
      "Get Iranian names, usernames, phones, and sample content by adding ?lang=fa to any endpoint.",
    details: [
      "English remains the default. Only the lang=fa query param switches text — no cookie or Accept-Language.",
      "FA responses include Content-Language: fa and a font object pointing at Vazirmatn for rendering.",
      "Works on list and detail routes, plus auth login with Persian overlay usernames.",
      "In the Playground, picking FA in the header appends lang=fa for you.",
    ],
    href: "/docs#language",
    hrefLabel: "Language section",
  },
  {
    id: "2026-09-12-playground",
    date: "2026-09-12",
    title: "Playground",
    summary:
      "Call live endpoints in the browser, try login success/fail, and inspect JSON responses.",
    details: [
      "Pick a resource and action, edit query params or JSON body, then send the request.",
      "Auth login has Correct / Wrong password presets so you can demo 200 vs 401 quickly.",
      "Responses show status, headers-friendly JSON, and pagination when the route returns it.",
      "Request UI and last responses are kept per resource across SPA navigation (full reload clears).",
    ],
    href: "/playground",
    hrefLabel: "Open Playground",
  },
  {
    id: "2026-09-10-auth",
    date: "2026-09-10",
    title: "Mock Auth",
    summary:
      "POST /api/auth/login with any seeded username and password → get a Bearer token for /me.",
    details: [
      "Every seeded user shares the mock password: password.",
      "Successful login returns a mock Bearer token and a user object (id, name, username, email, role).",
      "Wrong password or unknown username returns 401 with a clear error payload.",
      "Send Authorization: Bearer <token> to GET /api/auth/me to read the current user.",
    ],
    href: "/auth",
    hrefLabel: "Auth docs",
  },
  {
    id: "2026-09-08-resources",
    date: "2026-09-08",
    title: "Live REST resources",
    summary:
      "Users, Posts, Comments, Albums, Photos, Todos, Products, Notifications, and Countries — full CRUD with pagination.",
    details: [
      "Standard list shape: { data, pagination } with page, limit, total, and totalPages.",
      "Support for search, sort, filters, artificial delay, and forced error status query params.",
      "Shared production database resets daily — great for demos, not for permanent storage.",
      "Machine-readable catalog at /openapi.json for Postman, Swagger, and AI tools.",
    ],
    href: "/docs#resources",
    hrefLabel: "Resources table",
  },
];

export const latestUpdateId = siteUpdates[0]?.id ?? "";

export function formatUpdateDate(iso: string, locale: "en" | "fa" = "en") {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
