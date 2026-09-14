export type ApiResource = {
  id: string;
  category: string;
  title: string;
  href: string;
  basePath: string;
  summary: string;
  endpoints: {
    methods: string;
    path: string;
    note?: string;
  }[];
};

function crudEndpoints(base: string, extras: ApiResource["endpoints"] = []) {
  return [
    {
      methods: "GET / POST",
      path: base,
      note: "List or create",
    },
    {
      methods: "GET / PATCH / DELETE",
      path: `${base}/:id`,
      note: "Read, update, or delete one",
    },
    ...extras,
  ];
}

export const apiResources: ApiResource[] = [
  {
    id: "auth",
    category: "Auth",
    title: "Auth",
    href: "/auth",
    basePath: "/api/auth",
    summary:
      "Mock login with username/password. Correct credentials return a Bearer token; wrong ones return 401.",
    endpoints: [
      {
        methods: "POST",
        path: "/api/auth/login",
        note: "Login — password is always password",
      },
      {
        methods: "GET",
        path: "/api/auth/me",
        note: "Current user via Bearer token",
      },
    ],
  },
  {
    id: "users",
    category: "Users",
    title: "Users",
    href: "/users",
    basePath: "/api/users",
    summary: "CRUD mock users with search, role filters, and pagination.",
    endpoints: crudEndpoints("/api/users", [
      {
        methods: "GET",
        path: "/api/users?search=ava",
        note: "Search",
      },
      {
        methods: "GET",
        path: "/api/users?role=admin",
        note: "Filter by role",
      },
    ]),
  },
  {
    id: "posts",
    category: "Content",
    title: "Posts",
    href: "/posts",
    basePath: "/api/posts",
    summary: "Blog-style posts linked to users, with tags and publish flags.",
    endpoints: crudEndpoints("/api/posts", [
      {
        methods: "GET",
        path: "/api/posts?published=true",
        note: "Published only",
      },
      {
        methods: "GET",
        path: "/api/posts?search=api",
        note: "Search title and body",
      },
    ]),
  },
  {
    id: "comments",
    category: "Content",
    title: "Comments",
    href: "/comments",
    basePath: "/api/comments",
    summary: "Comments on posts — name, email, and body.",
    endpoints: crudEndpoints("/api/comments", [
      {
        methods: "GET",
        path: "/api/comments?postId=",
        note: "Filter by post",
      },
      {
        methods: "GET",
        path: "/api/comments?search=thanks",
        note: "Search",
      },
    ]),
  },
  {
    id: "albums",
    category: "Media",
    title: "Albums",
    href: "/albums",
    basePath: "/api/albums",
    summary: "Photo albums linked to users. Photos reference albumId.",
    endpoints: crudEndpoints("/api/albums", [
      {
        methods: "GET",
        path: "/api/albums?userId=",
        note: "Filter by owner",
      },
      {
        methods: "GET",
        path: "/api/albums?search=city",
        note: "Search title",
      },
    ]),
  },
  {
    id: "photos",
    category: "Media",
    title: "Photos",
    href: "/photos",
    basePath: "/api/photos",
    summary: "Album photos with url and thumbnailUrl.",
    endpoints: crudEndpoints("/api/photos", [
      {
        methods: "GET",
        path: "/api/photos?albumId=1",
        note: "Filter by album",
      },
      {
        methods: "GET",
        path: "/api/photos?search=city",
        note: "Search title",
      },
    ]),
  },
  {
    id: "todos",
    category: "Productivity",
    title: "Todos",
    href: "/todos",
    basePath: "/api/todos",
    summary: "Simple tasks with completed flags, linked to users.",
    endpoints: crudEndpoints("/api/todos", [
      {
        methods: "GET",
        path: "/api/todos?completed=false",
        note: "Open tasks",
      },
      {
        methods: "GET",
        path: "/api/todos?userId=",
        note: "Filter by user",
      },
    ]),
  },
  {
    id: "products",
    category: "Commerce",
    title: "Products",
    href: "/products",
    basePath: "/api/products",
    summary: "Catalog items with price, stock, category, and imageUrl.",
    endpoints: crudEndpoints("/api/products", [
      {
        methods: "GET",
        path: "/api/products?category=electronics",
        note: "Filter by category",
      },
      {
        methods: "GET",
        path: "/api/products?search=lamp",
        note: "Search name and description",
      },
    ]),
  },
  {
    id: "notifications",
    category: "Engagement",
    title: "Notifications",
    href: "/notifications",
    basePath: "/api/notifications",
    summary: "User notifications with type and read flags.",
    endpoints: crudEndpoints("/api/notifications", [
      {
        methods: "GET",
        path: "/api/notifications?read=false",
        note: "Unread only",
      },
      {
        methods: "GET",
        path: "/api/notifications?userId=",
        note: "Filter by user",
      },
    ]),
  },
  {
    id: "countries",
    category: "Geo",
    title: "Countries",
    href: "/countries",
    basePath: "/api/countries",
    summary: "Country records with ISO code, region, population, and flag.",
    endpoints: crudEndpoints("/api/countries", [
      {
        methods: "GET",
        path: "/api/countries?region=Europe",
        note: "Filter by region",
      },
      {
        methods: "GET",
        path: "/api/countries?code=IR",
        note: "Lookup by ISO code",
      },
    ]),
  },
];

/** Roadmap resources — not featured on the home catalog yet. */
export const plannedResources: {
  id: string;
  category: string;
  title: string;
  basePath: string;
  status: "coming-soon" | "in-development";
  summary: string;
}[] = [
  {
    id: "orders",
    category: "Commerce",
    title: "Orders",
    basePath: "/api/orders",
    status: "coming-soon",
    summary: "Order records related to users and products.",
  },
];

export function searchResources(query: string): {
  resource: ApiResource;
  matches: ApiResource["endpoints"];
}[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return apiResources
    .map((resource) => {
      const resourceHit =
        resource.title.toLowerCase().includes(q) ||
        resource.category.toLowerCase().includes(q) ||
        resource.basePath.toLowerCase().includes(q) ||
        resource.summary.toLowerCase().includes(q);

      const matches = resource.endpoints.filter(
        (endpoint) =>
          endpoint.path.toLowerCase().includes(q) ||
          endpoint.methods.toLowerCase().includes(q) ||
          (endpoint.note?.toLowerCase().includes(q) ?? false),
      );

      if (resourceHit || matches.length > 0) {
        return {
          resource,
          matches: matches.length > 0 ? matches : resource.endpoints.slice(0, 3),
        };
      }
      return null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}
