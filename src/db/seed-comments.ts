/** Seed comments resolve `postIndex` against inserted posts (0-based). */
export type SeedComment = {
  postIndex: number;
  name: string;
  email: string;
  body: string;
};

export const seedComments: SeedComment[] = [
  {
    postIndex: 0,
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    body: "This matches what we needed for the prototype. Thanks!",
  },
  {
    postIndex: 0,
    name: "Sam Okonkwo",
    email: "sam.o@example.com",
    body: "Can you add an example with delay=500 next?",
  },
  {
    postIndex: 1,
    name: "Jules Nguyen",
    email: "jules.n@example.com",
    body: "Semantic tokens saved us a whole theme rewrite.",
  },
  {
    postIndex: 2,
    name: "Riley Chen",
    email: "riley.c@example.com",
    body: "Pagination meta is exactly what our table expects.",
  },
  {
    postIndex: 4,
    name: "Morgan Lee",
    email: "morgan.lee@example.com",
    body: "jsonb arrays are perfect until we need joins.",
  },
  {
    postIndex: 5,
    name: "Casey Brooks",
    email: "casey.b@example.com",
    body: "Playground token sticky state is a nice touch.",
  },
  {
    postIndex: 6,
    name: "Taylor Kim",
    email: "taylor.k@example.com",
    body: "Search across title and body covers our feed filter.",
  },
  {
    postIndex: 8,
    name: "Jordan Diaz",
    email: "jordan.d@example.com",
    body: "In-memory rate limits are fine for a mock API.",
  },
  {
    postIndex: 9,
    name: "Avery Park",
    email: "avery.p@example.com",
    body: "OpenAPI updates should ship with every resource PR.",
  },
  {
    postIndex: 11,
    name: "Quinn Torres",
    email: "quinn.t@example.com",
    body: "Filtering by userId makes profile walls trivial.",
  },
  {
    postIndex: 12,
    name: "Reese Patel",
    email: "reese.p@example.com",
    body: "Seed reset by username mapping is clever.",
  },
  {
    postIndex: 14,
    name: "Harper Singh",
    email: "harper.s@example.com",
    body: "One error shape keeps client code boring — in a good way.",
  },
  {
    postIndex: 15,
    name: "Drew Ali",
    email: "drew.ali@example.com",
    body: "Delay param helped us finish skeleton states.",
  },
  {
    postIndex: 17,
    name: "Cameron Wu",
    email: "cameron.w@example.com",
    body: "Title sort is useful for admin tables.",
  },
  {
    postIndex: 19,
    name: "Jamie Costa",
    email: "jamie.c@example.com",
    body: "Showing fetch + axios + curl in docs is perfect.",
  },
  {
    postIndex: 21,
    name: "Blake Novak",
    email: "blake.n@example.com",
    body: "Comments next was the right call after Posts.",
  },
  {
    postIndex: 22,
    name: "Skyler Hahn",
    email: "skyler.h@example.com",
    body: "Focus styles on docs pages matter more than people think.",
  },
  {
    postIndex: 23,
    name: "Nina Volkov",
    email: "nina.v@example.com",
    body: "Welcome post — first GET always works. Love it.",
  },
  {
    postIndex: 3,
    name: "Draft Reader",
    email: "draft.reader@example.com",
    body: "Even unpublished posts need comment fixtures for UI tests.",
  },
  {
    postIndex: 7,
    name: "Content Fan",
    email: "content.fan@example.com",
    body: "Sample copy that feels human > lorem forever.",
  },
  {
    postIndex: 10,
    name: "Travel Bug",
    email: "travel.bug@example.com",
    body: "Save me a cafe with good Wi-Fi when you publish.",
  },
  {
    postIndex: 13,
    name: "Zod Fan",
    email: "zod.fan@example.com",
    body: "published=false parsing tip was gold.",
  },
  {
    postIndex: 18,
    name: "Launch Buddy",
    email: "launch.buddy@example.com",
    body: "Checklist comment — domain still pending on our side.",
  },
  {
    postIndex: 20,
    name: "UUID Enjoyer",
    email: "uuid@example.com",
    body: "Stable UUIDs make playground copy-paste painless.",
  },
];
