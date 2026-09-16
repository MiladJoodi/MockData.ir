export type Messages = {
  common: {
    home: string;
    docs: string;
    playground: string;
    contact: string;
    preview: string;
    search: string;
    loading: string;
    save: string;
    saving: string;
    cancel: string;
    create: string;
    edit: string;
    delete: string;
    searchPlaceholder: string;
    noResults: string;
    new: string;
    actions: string;
    copy: string;
    copied: string;
    live: string;
    open: string;
    tryIt: string;
    learnMore: string;
    back: string;
    close: string;
    yes: string;
    no: string;
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    networkError: string;
    temporary: string;
    temporaryBadge: string;
  };
  header: {
    primaryNav: string;
    whatsNew: string;
    whatsNewTitle: string;
    whatsNewSubtitle: string;
    latest: string;
    contact: string;
    menu: string;
    openMenu: string;
    appearance: string;
    lightMode: string;
    darkMode: string;
    light: string;
    dark: string;
    apiLangGroup: string;
    english: string;
    persian: string;
  };
  home: {
    tagline: string;
    taglineNote: string;
    resourcesTitle: string;
    resourcesBlurb: string;
    searchLabel: string;
    searchPlaceholder: string;
    temporaryCtaTitle: string;
    temporaryCtaBody: string;
    temporaryCtaLink: string;
  };
  notFound: {
    title: string;
    body: string;
    home: string;
    docs: string;
  };
  contact: {
    title: string;
    intro: string;
    name: string;
    email: string;
    topic: string;
    message: string;
    send: string;
    sending: string;
    success: string;
    chooseTopic: string;
    pickTopic: string;
    topics: Record<string, string>;
  };
  docs: {
    title: string;
    navLabel: string;
    intro: string;
    toc: {
      intro: string;
      whatsNew: string;
      temporary: string;
      sharedData: string;
      language: string;
      resources: string;
      openapi: string;
      requests: string;
      errors: string;
      rateLimit: string;
      reset: string;
    };
    whatsNewTitle: string;
    whatsNewBlurb: string;
    temporaryTitle: string;
    temporaryBody: string;
    temporaryBullets: string[];
    temporaryLimitsTitle: string;
    temporaryLimitsBullets: string[];
    sharedDataTitle: string;
    sharedDataBody: string;
    languageTitle: string;
    languageBody: string;
    languageBullets: string[];
    resourcesTitle: string;
    resourcesBlurb: string;
    colResource: string;
    colBasePath: string;
    colStatus: string;
    colDocs: string;
    statusLive: string;
    statusDev: string;
    statusSoon: string;
    openapiTitle: string;
    openapiBody: string;
    download: string;
    requestsTitle: string;
    requestsBody: string;
    requestsFaNote: string;
    errorsTitle: string;
    errorsBody: string;
    rateLimitTitle: string;
    rateLimitBody: string;
    resetTitle: string;
    resetBody: string;
    resetPanel: {
      intro: string;
      placeholder: string;
      button: string;
      resetting: string;
      needSecret: string;
      confirm: string;
      networkError: string;
      donePrefix: string;
    };
    colIndex: string;
  };
  resourceDocs: {
    endpoints: string;
    queryParams: string;
    examples: string;
    response: string;
    tryExample: string;
    preview: string;
    playground: string;
  };
  playground: {
    title: string;
    blurb: string;
    resource: string;
    action: string;
    send: string;
    sending: string;
    response: string;
    request: string;
    body: string;
    query: string;
    headers: string;
    correct: string;
    wrong: string;
    password: string;
    user: string;
    pickUser: string;
    loadError: string;
    emptyResponse: string;
    startHint: string;
    types: string;
    json: string;
  };
  temporary: {
    title: string;
    blurb: string;
    privacyNote: string;
    jsonLabel: string;
    durationLabel: string;
    duration1h: string;
    duration6h: string;
    duration12h: string;
    duration24h: string;
    checkJson: string;
    jsonValid: string;
    jsonHint: string;
    create: string;
    creating: string;
    acceptFix: string;
    rejectFix: string;
    fixedPreview: string;
    myApis: string;
    emptyList: string;
    copyUrl: string;
    delete: string;
    deleting: string;
    confirmDelete: string;
    confirmDeleteBody: string;
    cancel: string;
    limitReached: string;
    limitReachedBody: string;
    createdTitle: string;
    openApi: string;
    slotsLabel: string;
    maxActive: string;
    sampleJson: string;
    issues: {
      EMPTY: string;
      INVALID_JSON: string;
      TOO_LARGE: string;
      NOT_OBJECT_OR_ARRAY: string;
      TOO_DEEP: string;
      ARRAY_TOO_LONG: string;
      TOO_MANY_KEYS: string;
      UNSAFE_KEY: string;
      AUTO_FIXED: string;
    };
  };
  preview: {
    docs: string;
    playground: string;
    blurb: string;
    blurbFaHint: string;
    search: string;
    create: string;
    edit: string;
    delete: string;
    save: string;
    saving: string;
    deleting: string;
    cancel: string;
    fillSample: string;
    noRecords: string;
    loading: string;
    confirmDelete: string;
    confirmDeleteBody: string;
    networkError: string;
    authDemoPassword: string;
    username: string;
    password: string;
    login: string;
    getMe: string;
    token: string;
    user: string;
    loginFirst: string;
    createdAt: string;
    fieldLabels: Record<string, string>;
    roleLabels: Record<string, string>;
  };
  changelog: Record<
    string,
    {
      title: string;
      summary: string;
      details: string[];
      /** Short line for the header bell menu */
      teaser?: string;
      /** Optional URL / hint under the teaser */
      hint?: string;
    }
  >;
  catalog: Record<string, { title: string; summary: string }>;
};

export const en: Messages = {
  common: {
    home: "Home",
    docs: "Docs",
    playground: "Playground",
    contact: "Contact",
    preview: "Preview",
    search: "Search",
    loading: "Loading…",
    save: "Save",
    saving: "Saving…",
    cancel: "Cancel",
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    searchPlaceholder: "Search APIs…",
    noResults: "No results",
    new: "New",
    actions: "Actions",
    copy: "Copy",
    copied: "Copied",
    live: "Live",
    open: "Open",
    tryIt: "Try it",
    learnMore: "Learn more",
    back: "Back",
    close: "Close",
    yes: "Yes",
    no: "No",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send",
    sending: "Sending…",
    networkError: "Network error",
    temporary: "Temporary API",
    temporaryBadge: "Instant",
  },
  header: {
    primaryNav: "Primary",
    whatsNew: "What's new",
    whatsNewTitle: "What's new",
    whatsNewSubtitle: "Latest updates and features",
    latest: "Latest",
    contact: "Contact",
    menu: "Menu",
    openMenu: "Open menu",
    appearance: "Appearance",
    lightMode: "Switch to light mode",
    darkMode: "Switch to dark mode",
    light: "Light",
    dark: "Dark",
    apiLangGroup: "Language",
    english: "English",
    persian: "فارسی",
  },
  home: {
    tagline:
      "Free fake REST APIs with live JSON. Prototype UIs, test auth, and call real endpoints — no backend setup.",
    taglineNote: "You can also paste your own data and get an API URL back.",
    resourcesTitle: "Resources",
    resourcesBlurb:
      "Ten live REST APIs with docs and examples. Shared demo data on production.",
    searchLabel: "Search APIs and endpoints",
    searchPlaceholder: "Search users, posts, auth…",
    temporaryCtaTitle: "Temporary API",
    temporaryCtaBody:
      "Paste your JSON and build a short-lived API. Treat the link like a password — up to 5 live at a time per browser.",
    temporaryCtaLink: "Create a temporary API",
  },
  notFound: {
    title: "Page not found",
    body: "That URL is not part of MockData. Head home or browse the docs.",
    home: "Home",
    docs: "Docs",
  },
  contact: {
    title: "Contact",
    intro:
      "Questions, feedback, or ideas — send a short message and it goes straight to inbox. You can also email",
    name: "Name",
    email: "Email",
    topic: "Topic",
    message: "Message",
    send: "Send message",
    sending: "Sending…",
    success: "Message sent. Thanks — we’ll get back to you.",
    chooseTopic: "Please choose what you need.",
    pickTopic: "What do you need?",
    topics: {
      question: "I have a question",
      bug: "Bug report",
      feature: "Feature idea",
      other: "Something else",
    },
  },
  docs: {
    title: "Documentation",
    navLabel: "Docs",
    intro:
      "MockData serves fake REST resources as JSON. Use public resources freely, hit Auth to practice login, try live calls in the Playground, or publish your own short-lived Temporary API. Production uses one shared database for catalog resources — see Shared data.",
    toc: {
      intro: "Introduction",
      whatsNew: "What's new",
      temporary: "Temporary API",
      sharedData: "Shared data",
      language: "Language",
      resources: "Resources",
      openapi: "OpenAPI",
      requests: "Requests",
      errors: "Errors",
      rateLimit: "Request limits",
      reset: "Reset demo data",
    },
    whatsNewTitle: "What's new",
    whatsNewBlurb:
      "Features shipped for builders, newest first. Click a card to expand details. The same list is under the bell icon in the header.",
    temporaryTitle: "Temporary API",
    temporaryBody:
      "Need a disposable REST endpoint with your own JSON? Temporary APIs are separate from the shared catalog. Paste JSON, pick how long it should live, and get a public URL under /api/t/…",
    temporaryBullets: [
      "No account — create from /temporary in the browser.",
      "Lifetime options: 1, 6, 12, or 24 hours (default 12h).",
      "Call the public /api/t/… URL with GET, POST, PATCH, and DELETE like a normal collection or document.",
      "Treat the link like a password: anyone who has it can read and change the data until it expires.",
      "When an API expires, requests return HTTP 410.",
    ],
    temporaryLimitsTitle: "Temporary API limits",
    temporaryLimitsBullets: [
      "Up to 5 active temporary APIs per browser at once.",
      "Up to 20 creates per IP per rolling hour (HTTP 429 if you go over).",
      "JSON payload max 64 KB.",
      "Max nesting depth 8; arrays up to 500 items; objects up to 200 keys.",
      "Same global /api rate limit still applies (about 60 requests per IP per minute).",
    ],
    sharedDataTitle: "Shared data",
    sharedDataBody:
      "All visitors share the same live database. Creates, updates, and deletes are real and visible to everyone. On production, seed data resets automatically once per day via GET /api/cron/reset. Use this for prototyping and demos — not for storing anything you need to keep.",
    languageTitle: "Language",
    languageBody:
      "All resource text is English by default. Pass lang=fa for Persian responses with Iranian names, usernames, emails, phones, and copy. No cookie or Accept-Language header is used — only the query param. The site language switcher (English | فارسی) also sets this preference for Playground and Preview.",
    languageBullets: [
      "Example: GET /api/users?lang=fa",
      "FA responses include Content-Language: fa and a font object (Vazirmatn) for rendering.",
      "Choosing فارسی in the header switches the UI to RTL and appends lang=fa in the Playground.",
    ],
    resourcesTitle: "Resources",
    resourcesBlurb:
      "Live endpoints you can call today, plus a short roadmap of what is next.",
    colResource: "Resource",
    colBasePath: "Base path",
    colStatus: "Status",
    colDocs: "Docs",
    statusLive: "Live",
    statusDev: "In development",
    statusSoon: "Coming soon",
    openapiTitle: "OpenAPI",
    openapiBody:
      "Machine-readable catalog of every live endpoint (Auth, Users, Posts, Comments, Albums, Photos, Todos, Products, Notifications, Countries, and Admin reset). Import into Postman, Swagger UI, or AI tools.",
    download: "Download",
    requestsTitle: "Requests",
    requestsBody:
      "Lists return data + pagination. Single items return { data }.",
    requestsFaNote: "Persian: append lang=fa. See Language.",
    errorsTitle: "Errors",
    errorsBody:
      "Failures use an error object. Statuses: 400 validation, 401 unauthorized, 404 missing, 429 rate limited, 500 server. Pass ?status=500 (400–599) to force an error for UI demos.",
    rateLimitTitle: "Request limits",
    rateLimitBody:
      "To keep the demo fair for everyone, each IP can call /api/* about {limit} times per minute. Go over that and you get HTTP 429 (too many requests). The response also includes X-RateLimit headers so you can see how many calls you have left.",
    resetTitle: "Reset demo data",
    resetBody:
      "Everyone shares the same demo database. On the live site, data returns to the default seed automatically every 24 hours. If you have the admin secret, you can wipe and reload that seed right away with the form below.",
    resetPanel: {
      intro:
        "Enter the admin secret to wipe the demo tables and reload the default seed.",
      placeholder: "Admin secret",
      button: "Reset now",
      resetting: "Resetting…",
      needSecret: "Enter the admin secret first.",
      confirm:
        "This wipes seed tables and reloads default data. Continue?",
      networkError: "Network error. Is the server running?",
      donePrefix: "Reset complete",
    },
    colIndex: "#",
  },
  resourceDocs: {
    endpoints: "Endpoints",
    queryParams: "Query params",
    examples: "Examples",
    response: "Response",
    tryExample: "Try",
    preview: "Preview",
    playground: "Playground",
  },
  playground: {
    title: "Playground",
    blurb:
      "Send live requests against MockData APIs. Inspect JSON responses in the browser.",
    resource: "Resource",
    action: "Action",
    send: "Send",
    sending: "Sending…",
    response: "Response",
    request: "Request",
    body: "Body",
    query: "Query",
    headers: "Headers",
    correct: "Correct",
    wrong: "Wrong",
    password: "Password",
    user: "User",
    pickUser: "Pick a user",
    loadError: "Could not load picker options",
    emptyResponse: "No response yet",
    startHint: "Pick a resource and send a request to get started.",
    types: "TS",
    json: "JSON",
  },
  temporary: {
    title: "Temporary API",
    blurb: "Paste your JSON and build a short-lived API.",
    privacyNote:
      "Treat the link like a password. Until it expires, anyone who has it can read and change the data. Up to 5 at a time per browser.",
    jsonLabel: "JSON",
    durationLabel: "Lifetime",
    duration1h: "1 hour",
    duration6h: "6 hours",
    duration12h: "12 hours",
    duration24h: "24 hours",
    checkJson: "Check",
    jsonValid: "Nice — ready to create.",
    jsonHint: "Check when ready, or create directly.",
    create: "Create API",
    creating: "Creating…",
    acceptFix: "Apply fix & create",
    rejectFix: "Edit again",
    fixedPreview: "We fixed a few issues. Review, then create.",
    myApis: "My APIs",
    emptyList: "No active APIs yet.",
    copyUrl: "Copy",
    delete: "Delete",
    deleting: "…",
    confirmDelete: "Delete this API?",
    confirmDeleteBody: "The URL will stop working right away.",
    cancel: "Cancel",
    limitReached: "You've hit the 5-API limit.",
    limitReachedBody: "Delete one from the list below, or wait until one expires.",
    createdTitle: "Created",
    openApi: "Open",
    slotsLabel: "{n} / 5",
    maxActive: "",
    sampleJson: `[
  { "id": "1", "firstName": "Ada", "lastName": "Lovelace", "role": "admin" },
  { "id": "2", "firstName": "Lin", "lastName": "Chen", "role": "member" },
  { "id": "3", "firstName": "Maya", "lastName": "Patel", "role": "member" }
]`,
    issues: {
      EMPTY: "Paste a JSON object or array.",
      INVALID_JSON: "Invalid JSON — check commas, quotes, and brackets.",
      TOO_LARGE: "JSON is too large (max {max} KB).",
      NOT_OBJECT_OR_ARRAY: "Root must be an object { } or array [ ].",
      TOO_DEEP: "Nested too deep (max depth {max}).",
      ARRAY_TOO_LONG: "Array is too long (max {max} items).",
      TOO_MANY_KEYS: "Too many keys in one object (max {max}).",
      UNSAFE_KEY: "Unsafe key “{key}” is not allowed.",
      AUTO_FIXED: "Trailing commas or unsafe keys were removed.",
    },
  },
  preview: {
    docs: "Docs",
    playground: "Playground",
    blurb: "A simple UI to try this API.",
    blurbFaHint: "",
    search: "Search",
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    saving: "Saving…",
    deleting: "Deleting…",
    cancel: "Cancel",
    fillSample: "Fill sample data",
    noRecords: "No records",
    loading: "Loading…",
    confirmDelete: "Delete?",
    confirmDeleteBody: "This item will be permanently removed.",
    networkError: "Network error",
    authDemoPassword: "Demo password for every seeded user is",
    username: "Username",
    password: "Password",
    login: "Login",
    getMe: "GET /me",
    token: "Token",
    user: "User",
    loginFirst: "Login first to get a token",
    createdAt: "Added",
    fieldLabels: {
      name: "Name",
      username: "Username",
      email: "Email",
      avatarUrl: "Avatar URL",
      role: "Role",
      city: "City",
      country: "Country",
      company: "Company",
      title: "Title",
      body: "Body",
      published: "Published",
      userId: "User ID",
      postId: "Post ID",
      albumId: "Album ID",
      url: "URL",
      thumbnailUrl: "Thumbnail URL",
      completed: "Completed",
      description: "Description",
      price: "Price",
      stock: "Stock",
      category: "Category",
      imageUrl: "Image URL",
      message: "Message",
      type: "Type",
      read: "Read",
      code: "Code",
      capital: "Capital",
      region: "Region",
      population: "Population",
      currency: "Currency",
      flagUrl: "Flag URL",
    },
    roleLabels: {
      admin: "admin",
      member: "member",
      guest: "guest",
    },
  },
  changelog: {
    "2026-09-16-temporary": {
      title: "Temporary API",
      teaser: "Your JSON, short-lived URL",
      hint: "/temporary — paste JSON and get a public REST link",
      summary:
        "Paste your own JSON and get a short-lived public REST URL — no account, up to 5 live APIs per browser.",
      details: [
        "Create from /temporary: pick a lifetime (1h, 6h, 12h, or 24h) and publish.",
        "Call the public /api/t/… URL with normal GET, POST, PATCH, and DELETE.",
        "Up to 5 live APIs per browser; up to 20 creates per IP per hour.",
        "Treat the link like a password — anyone who has it can read and change the data until it expires.",
      ],
    },
    "2026-09-15-preview": {
      title: "Preview",
      teaser: "Sample UIs for every resource",
      hint: "/preview/users — try create, edit, delete in the browser",
      summary:
        "Live sample UIs for Users, Posts, Auth, and every resource — create, edit, and delete against the real API.",
      details: [
        "Each resource docs page has a Preview button that opens a tiny app on top of the real endpoints.",
        "List, search, paginate, create, edit, and delete rows — same shared demo database as everyone else.",
        "Auth preview includes a working login form (password is always password) and GET /me with the token.",
        "Use the header language switcher so preview lists load Persian sample data when you want it.",
      ],
    },
    "2026-09-14-lang-fa": {
      title: "Persian data (?lang=fa)",
      teaser: "Persian sample data",
      hint: "/api/users?lang=fa — add lang=fa to any query for Persian text",
      summary:
        "Get Iranian names, usernames, phones, and sample content by adding ?lang=fa to any endpoint.",
      details: [
        "English remains the default. Only the lang=fa query param switches text — no cookie or Accept-Language.",
        "FA responses include Content-Language: fa and a font object pointing at Vazirmatn for rendering.",
        "Works on list and detail routes, plus auth login with Persian overlay usernames.",
        "Choosing فارسی in the header appends lang=fa in the Playground.",
      ],
    },
    "2026-09-12-playground": {
      title: "Playground",
      teaser: "Call APIs in the browser",
      hint: "/playground — send requests and inspect JSON",
      summary:
        "Call live endpoints in the browser, try login success/fail, and inspect JSON responses.",
      details: [
        "Pick a resource and action, edit query params or JSON body, then send the request.",
        "Auth login has Correct / Wrong password presets so you can demo 200 vs 401 quickly.",
        "Responses show status, headers-friendly JSON, and pagination when the route returns it.",
        "Handy for teaching, screenshots, and checking filters without opening Postman.",
      ],
    },
    "2026-09-10-auth": {
      title: "Mock Auth",
      teaser: "Login and Bearer tokens",
      hint: "/api/auth/login — password is always password",
      summary:
        "POST /api/auth/login with any seeded username and password → get a Bearer token for /me.",
      details: [
        "Every seeded user shares the mock password: password.",
        "Successful login returns a mock Bearer token and a user object (id, name, username, email, role).",
        "Wrong password or unknown username returns 401 with a clear error payload.",
        "Send Authorization: Bearer <token> to GET /api/auth/me to read the current user.",
      ],
    },
    "2026-09-08-resources": {
      title: "Live REST resources",
      teaser: "Users, posts, and more — full CRUD",
      hint: "/docs#resources — list of live APIs",
      summary:
        "Users, Posts, Comments, Albums, Photos, Todos, Products, Notifications, and Countries — full CRUD with pagination.",
      details: [
        "Standard list shape: { data, pagination } with page, limit, total, and totalPages.",
        "Support for search, sort, filters, artificial delay, and forced error status query params.",
        "Shared production database resets daily — great for demos, not for permanent storage.",
        "Machine-readable catalog at /openapi.json for Postman, Swagger, and AI tools.",
      ],
    },
  },
  catalog: {
    auth: {
      title: "Auth",
      summary:
        "Mock login with username/password. Correct credentials return a Bearer token; wrong ones return 401.",
    },
    users: {
      title: "Users",
      summary: "CRUD mock users with search, role filters, and pagination.",
    },
    posts: {
      title: "Posts",
      summary: "Blog-style posts linked to users, with tags and publish flags.",
    },
    comments: {
      title: "Comments",
      summary: "Comments on posts — name, email, and body.",
    },
    albums: {
      title: "Albums",
      summary: "Photo albums linked to users. Photos reference albumId.",
    },
    photos: {
      title: "Photos",
      summary: "Album photos with url and thumbnailUrl.",
    },
    todos: {
      title: "Todos",
      summary: "Simple tasks with completed flags, linked to users.",
    },
    products: {
      title: "Products",
      summary: "Catalog items with price, stock, category, and imageUrl.",
    },
    notifications: {
      title: "Notifications",
      summary: "User notifications with type and read flags.",
    },
    countries: {
      title: "Countries",
      summary: "Country records with ISO code, region, population, and flag.",
    },
  },
};
