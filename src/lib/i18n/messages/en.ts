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
    inDevelopment: string;
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
    generator: string;
    imageGenerator: string;
    jsonWorkbench: string;
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
  blog: {
    title: string;
    description: string;
    all: string;
    emptyTitle: string;
    emptyBody: string;
    emptyCategoryTitle: string;
    emptyCategoryBody: string;
    readingTime: string;
    previousPage: string;
    nextPage: string;
    pageStatus: string;
    paginationNav: string;
    categoriesNav: string;
    backToBlog: string;
    previousArticle: string;
    nextArticle: string;
    relatedArticles: string;
    categories: {
      news: string;
      "mock-data": string;
      json: string;
      api: string;
      frontend: string;
    };
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
      generator: string;
      imageGenerator: string;
      jsonWorkbench: string;
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
    generatorTitle: string;
    generatorBody: string;
    generatorBullets: string[];
    imageGeneratorTitle: string;
    imageGeneratorBody: string;
    imageGeneratorBullets: string[];
    jsonWorkbenchTitle: string;
    jsonWorkbenchBody: string;
    jsonWorkbenchBullets: string[];
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
    backToResources: string;
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
    deleteAll: string;
    deleting: string;
    confirmDelete: string;
    confirmDeleteBody: string;
    confirmDeleteAll: string;
    confirmDeleteAllBody: string;
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
  imageGenerator: {
    title: string;
    blurb: string;
    modeSvg: string;
    modeReal: string;
    width: string;
    height: string;
    generate: string;
    generating: string;
    yourUrl: string;
    preview: string;
    useInProject: string;
    tabUrl: string;
    tabHtml: string;
    tabCss: string;
    tabJs: string;
    tabCurl: string;
    readySizes: string;
    sizes: {
      avatar: string;
      thumbnail: string;
      profile: string;
      square: string;
      post: string;
      cover: string;
      banner: string;
      story: string;
    };
  };
  jsonWorkbench: {
    title: string;
    blurb: string;
    toolNavLabel: string;
    source: {
      title: string;
      hint: string;
      sample: string;
      valid: string;
      needJson: string;
      fixFirst: string;
      pickAction: string;
      useResult: string;
      diffHint: string;
      escapedInput: string;
      schemaInput: string;
      fromSchemaNote: string;
    };
    categories: {
      core: string;
      transform: string;
      utility: string;
    };
    labels: {
      input: string;
      output: string;
      tree: string;
      matches: string;
      jsonA: string;
      jsonB: string;
      diffResult: string;
      jsonpath: string;
      result: string;
    };
    actions: {
      format: string;
      minify: string;
      showTree: string;
      search: string;
      clearSearch: string;
      replace: string;
      replaceAll: string;
      prevMatch: string;
      nextMatch: string;
      compare: string;
      run: string;
      runPath: string;
      toTypescript: string;
      toZod: string;
      toSchema: string;
      swapDirection: string;
      sortKeys: string;
      removeEmpty: string;
      flatten: string;
      unflatten: string;
      escape: string;
      unescape: string;
      repair: string;
      fromSchema: string;
      extractKeys: string;
      extractValues: string;
      pick: string;
      omit: string;
      compareStructure: string;
      clear: string;
      expandAll: string;
      collapseAll: string;
      copyPath: string;
      copyValue: string;
    };
    errors: {
      empty: string;
      invalid: string;
      unexpectedEnd: string;
      unexpectedToken: string;
      expectedPropertyName: string;
      expectedCommaOrBrace: string;
      expectedCommaOrBracket: string;
      expectedColon: string;
      unterminatedString: string;
      badControlChar: string;
      badEscape: string;
      trailingChar: string;
      objectKeyExpected: string;
      unexpectedCharacter: string;
      invalidCharacter: string;
      invalidUnicode: string;
      couldNotRepair: string;
      atLineColumn: string;
      atLine: string;
      atPosition: string;
    };
    types: {
      object: string;
      array: string;
      string: string;
      number: string;
      boolean: string;
      null: string;
    };
    validate: {
      idleHint: string;
      validTitle: string;
      validBody: string;
      invalidTitle: string;
    };
    tree: {
      idleTitle: string;
      idleBody: string;
      errorTitle: string;
      errorBody: string;
    };
    search: {
      query: string;
      replaceWith: string;
      matchCount: string;
      noMatches: string;
      noMatchesBody: string;
      idleTitle: string;
      idleBody: string;
      errorTitle: string;
      errorBody: string;
      kindKey: string;
      kindValue: string;
      activeHint: string;
      replacedCount: string;
    };
    diff: {
      idleTitle: string;
      idleBody: string;
      identical: string;
      added: string;
      removed: string;
      changed: string;
      sideEmpty: string;
      emptyA: string;
      emptyB: string;
      bothInvalid: string;
    };
    jsonpath: {
      whatIs: string;
      hintTitle: string;
      hintBody: string;
      idleTitle: string;
      idleBody: string;
      errorTitle: string;
      errorBody: string;
      noResults: string;
      emptyPath: string;
    };
    transform: {
      tsIdleTitle: string;
      tsIdleBody: string;
      zodIdleTitle: string;
      zodIdleBody: string;
      schemaExplain: string;
      schemaUse: string;
      schemaIdleTitle: string;
      schemaIdleBody: string;
      yamlIdleTitle: string;
      yamlIdleBody: string;
      yamlToJsonIdle: string;
      yamlApplied: string;
      csvIdleTitle: string;
      csvIdleBodyJson: string;
      csvIdleBodyCsv: string;
      csvToJsonIdle: string;
      csvApplied: string;
      csvUnsupported: string;
    };
    utilities: {
      sortAsc: string;
      sortDesc: string;
      sortIdleTitle: string;
      sortIdleBody: string;
      sortApplied: string;
      removeOptions: string;
      removeNull: string;
      removeEmptyString: string;
      removeEmptyArray: string;
      removeEmptyObject: string;
      removeNullLabel: string;
      removeEmptyStringLabel: string;
      removeEmptyArrayLabel: string;
      removeEmptyObjectLabel: string;
      removePreserveHint: string;
      removeIdleTitle: string;
      removeIdleBody: string;
      nestedLabel: string;
      flatLabel: string;
      flattenHint: string;
      flattenUse: string;
      flattenIdleTitle: string;
      flattenIdleBody: string;
      flattenApplied: string;
      unflattenHint: string;
      unflattenUse: string;
      unflattenIdleTitle: string;
      unflattenIdleBody: string;
      escapeIdleTitle: string;
      escapeIdleBody: string;
      escapeHint: string;
      escapeUse: string;
      unescapeIdleTitle: string;
      unescapeIdleBody: string;
      repairHint: string;
      repairUse: string;
      repairAlreadyValid: string;
      repairFormatted: string;
      repairReady: string;
      repairApplied: string;
      repairAppliedToSource: string;
      repairFailedTitle: string;
      repairFailedAt: string;
      repairPreview: string;
      repairFixes: {
        "trailing-commas": string;
        "single-quotes": string;
        "smart-quotes": string;
        "unquoted-keys": string;
        "missing-commas": string;
        "missing-brackets": string;
        comments: string;
        "code-fence": string;
        "python-literals": string;
        "js-undefined": string;
        jsonp: string;
        "escaped-string": string;
        mongodb: string;
        ndjson: string;
        ellipsis: string;
        "string-concat": string;
        whitespace: string;
        truncated: string;
        "mid-edit-junk": string;
      };
      repairIdleTitle: string;
      repairIdleBody: string;
      fromSchemaHint: string;
      fromSchemaIdleTitle: string;
      fromSchemaIdleBody: string;
      extractHint: string;
      extractIdleTitle: string;
      extractIdleBody: string;
      extractKeysHint: string;
      extractKeysIdleTitle: string;
      extractKeysIdleBody: string;
      extractValuesHint: string;
      extractValuesIdleTitle: string;
      extractValuesIdleBody: string;
      fieldsLabel: string;
      fieldsClickHint: string;
      fieldsSelectAll: string;
      fieldsClear: string;
      fieldsEmpty: string;
      pickHint: string;
      pickIdleTitle: string;
      pickIdleBody: string;
      omitHint: string;
      omitIdleTitle: string;
      omitIdleBody: string;
      compareHint: string;
      compareUse: string;
      compareBack: string;
      compareIdleTitle: string;
      compareIdleBody: string;
      compareIdentical: string;
      compareMissing: string;
      compareExtra: string;
      compareType: string;
    };
    empty: {
      formatTitle: string;
      formatBody: string;
    };
    soon: {
      badge: string;
      title: string;
      body: string;
    };
    tools: {
      format: string;
      minify: string;
      validate: string;
      tree: string;
      search: string;
      diff: string;
      jsonpath: string;
      convert: string;
      toTypescript: string;
      toZod: string;
      toSchema: string;
      yaml: string;
      csv: string;
      sortKeys: string;
      removeEmpty: string;
      flatten: string;
      unflatten: string;
      escape: string;
      unescape: string;
      repair: string;
      extract: string;
      extractKeys: string;
      extractValues: string;
      pick: string;
      omit: string;
      compareStructure: string;
    };
  };
  generator: {
    title: string;
    subtitle: string;
    chooseType: string;
    searchPlaceholder: string;
    noTopics: string;
    fieldsLegend: string;
    moreFields: string;
    lessFields: string;
    optionalFields: string;
    records: string;
    customQty: string;
    country: string;
    countrySearch: string;
    selectPlaceholder: string;
    outputMode: string;
    modePayload: string;
    modeApi: string;
    modePayloadHint: string;
    modeApiHint: string;
    jsonType: string;
    viewJson: string;
    viewType: string;
    generate: string;
    generating: string;
    generateAgain: string;
    refresh: string;
    generated: string;
    download: string;
    createApi: string;
    createSuccess: string;
    createBlockedArray: string;
    createBlockedSize: string;
    openTemporary: string;
    emptyTitle: string;
    emptyBody: string;
    duration1h: string;
    duration6h: string;
    duration12h: string;
    duration24h: string;
    countries: Record<string, string>;
    categories: Record<string, string>;
    fields: Record<string, string>;
    topics: Record<
      string,
      {
        name: string;
        description: string;
        preview?: { line1: string; line2: string; line3?: string };
      }
    >;
    errors: {
      pickTopic: string;
      INVALID_TOPIC: string;
      INVALID_FIELDS: string;
      INVALID_QUANTITY: string;
      INVALID_COUNTRY: string;
      GENERATE_FAILED: string;
      DOWNLOAD_FAILED: string;
      CREATE_FAILED: string;
      LIMIT_REACHED: string;
      RATE_LIMITED: string;
    };
  };
  preview: {
    docs: string;
    playground: string;
    blurb: string;
    blurbFaHint: string;
    backToResource: string;
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
    loginSuccess: string;
    logout: string;
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
      /** Optional status chip in What's new (e.g. In development) */
      badge?: string;
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
    inDevelopment: "In development",
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
    generator: "Generator",
    imageGenerator: "Images",
    jsonWorkbench: "JSON Workbench",
  },
  header: {
    primaryNav: "Primary",
    whatsNew: "What's new",
    whatsNewTitle: "What's new",
    whatsNewSubtitle: "Latest updates and features",
    latest: "Latest",
    contact: "About",
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
    taglineNote: "",
    resourcesTitle: "Resources",
    resourcesBlurb:
      "Ten live REST APIs with docs and examples. Shared demo data on production.",
    searchLabel: "Search APIs and endpoints",
    searchPlaceholder: "Search users, posts, auth…",
    temporaryCtaTitle: "Temporary API",
    temporaryCtaBody:
      "Paste your JSON and build a short-lived API — or publish from the Fake Data Generator. Treat the link like a password — up to 5 live at a time per browser.",
    temporaryCtaLink: "Create a temporary API",
  },
  notFound: {
    title: "Page not found",
    body: "That URL is not part of MockData. Head home or browse the docs.",
    home: "Home",
    docs: "Docs",
  },
  blog: {
    title: "Blog",
    description:
      "Guides and notes on mock data, JSON, APIs, and frontend workflows—written for builders using MockData.",
    all: "All",
    emptyTitle: "No posts",
    emptyBody: "Published articles will show up here. Check back soon.",
    emptyCategoryTitle: "No posts",
    emptyCategoryBody: "Try another category or browse all posts.",
    readingTime: "{n} min read",
    previousPage: "Previous",
    nextPage: "Next",
    pageStatus: "Page {page} of {total}",
    paginationNav: "Pagination",
    categoriesNav: "Categories",
    backToBlog: "Blog",
    previousArticle: "Previous",
    nextArticle: "Next",
    relatedArticles: "Related articles",
    categories: {
      news: "News",
      "mock-data": "Mock data",
      json: "JSON",
      api: "API",
      frontend: "Frontend",
    },
  },
  contact: {
    title: "Get in touch",
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
      "MockData serves fake REST resources as JSON. Use public resources freely, hit Auth to practice login, try live calls in the Playground, generate fixtures at /generator, grab placeholder images at /image-generator, open JSON Workbench at /json, or publish your own short-lived Temporary API. Production uses one shared database for catalog resources — see Shared data.",
    toc: {
      intro: "Introduction",
      whatsNew: "What's new",
      temporary: "Temporary API",
      generator: "Fake Data Generator",
      imageGenerator: "Image Generator",
      jsonWorkbench: "JSON Workbench",
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
      "Need a disposable REST endpoint with your own JSON? Temporary APIs are separate from the shared catalog. Paste JSON, pick how long it should live, and get a public URL under /api/t/… You can also publish from the Fake Data Generator via Create API.",
    temporaryBullets: [
      "No account — create from /temporary in the browser (or Create API on /generator).",
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
    generatorTitle: "Fake Data Generator",
    generatorBody:
      "Generate realistic JSON for UI work without writing fixtures by hand. Runs entirely in the browser. Pick a data type, fields, and quantity, then copy, download, or publish via Temporary API.",
    generatorBullets: [
      "Open /generator — people, ecommerce, content, media, business, and location types.",
      "Choose POST body (no id/timestamps) or API record shape (id + createdAt + updatedAt).",
      "Site language FA uses Persian locale packs; EN uses multi-country English packs.",
      "Generate up to 1,000 records; Create API is capped by Temporary limits (500 items / 64 KB).",
      "Selections and results survive client-side navigation (cleared on full page reload).",
    ],
    imageGeneratorTitle: "Image Generator",
    imageGeneratorBody:
      "Need a placeholder image URL for UI work? Use MockData SVG placeholders or random real photos (via Picsum redirect). Set width and height, copy the link, and drop it into img, CSS, or any image field.",
    imageGeneratorBullets: [
      "Open /image-generator — SVG placeholders or real photos.",
      "Public URL shape: /image/{width}/{height} for SVG; add ?type=real for photos.",
      "Random by default. Optional ?seed= keeps the same SVG colors or the same real photo.",
      "Ready sizes for avatar, thumbnail, profile, post, cover, banner, and story.",
    ],
    jsonWorkbenchTitle: "JSON Workbench",
    jsonWorkbenchBody:
      "JSON Workbench (in development): one in-browser space for everyday JSON work while you build UIs — format, compare, search, and convert without leaving MockData.",
    jsonWorkbenchBullets: [
      "Open JSON Workbench at /json and select a tool — the workspace updates in place (share with ?tool=).",
      "Core: Format, Tree View, Search, JSONPath, and Compare Structure.",
      "Transform: TypeScript, Zod, JSON Schema, YAML, and CSV.",
      "Utilities: sort keys, remove empty values, flatten, escape/repair, pick/omit, and more.",
      "Runs in your browser — JSON is not sent to a server.",
      "Still evolving — more tools and polish over time.",
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
    backToResources: "Back to resources",
  },
  playground: {
    title: "Playground",
    blurb:
      "Send live requests against MockData APIs. Inspect JSON in the browser — your last request per resource stays while you navigate the site.",
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
    deleteAll: "Delete all",
    deleting: "…",
    confirmDelete: "Delete this API?",
    confirmDeleteBody: "The URL will stop working right away.",
    confirmDeleteAll: "Delete all APIs?",
    confirmDeleteAllBody: "Every URL in this list will stop working right away.",
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
  imageGenerator: {
    title: "Image Generator",
    blurb:
      "For project images you can use MockData SVGs or random real photos with custom dimensions. Put the image link directly in an img, CSS, or any field meant for an image.",
    modeSvg: "SVG",
    modeReal: "Real Image",
    width: "Width",
    height: "Height",
    generate: "Generate",
    generating: "Generating…",
    yourUrl: "Your API URL",
    preview: "Preview",
    useInProject: "Use it in your project",
    tabUrl: "URL",
    tabHtml: "HTML",
    tabCss: "CSS",
    tabJs: "JavaScript",
    tabCurl: "cURL",
    readySizes: "Ready sizes",
    sizes: {
      avatar: "Avatar",
      thumbnail: "Thumbnail",
      profile: "Profile",
      square: "Square",
      post: "Post",
      cover: "Cover",
      banner: "Banner",
      story: "Story",
    },
  },
  jsonWorkbench: {
    title: "JSON Workbench",
    blurb:
      "Paste your JSON once. Then pick what you want to do — format, search, convert, and more without pasting again.",
    toolNavLabel: "Workbench tools",
    source: {
      title: "Your JSON",
      hint: "Paste here once. Every action below uses this document.",
      sample: "Load sample",
      valid: "JSON is valid.",
      needJson: "Paste your JSON on the left first.",
      fixFirst: "Fix the JSON error in Your JSON, then try again.",
      pickAction: "What do you want to do?",
      useResult: "Use as JSON",
      diffHint: "Your JSON is side A. Paste the other document below as B.",
      escapedInput: "Escaped string",
      schemaInput: "JSON Schema",
      fromSchemaNote:
        "Paste a JSON Schema below — generates a sample document you can push into Your JSON.",
    },
    categories: {
      core: "Core",
      transform: "Transform",
      utility: "Utilities",
    },
    labels: {
      input: "Input",
      output: "Output",
      tree: "Tree",
      matches: "Matches",
      jsonA: "JSON A",
      jsonB: "JSON B",
      diffResult: "Differences",
      jsonpath: "JSONPath",
      result: "Result ({count})",
    },
    actions: {
      format: "Format",
      minify: "Minify",
      showTree: "Show tree",
      search: "Search",
      clearSearch: "Clear search",
      replace: "Replace",
      replaceAll: "Replace all",
      prevMatch: "Previous match",
      nextMatch: "Next match",
      compare: "Compare",
      run: "Run",
      runPath: "Run",
      toTypescript: "Generate types",
      toZod: "Generate Zod",
      toSchema: "Generate schema",
      swapDirection: "Swap",
      sortKeys: "Sort keys",
      removeEmpty: "Remove empty",
      flatten: "Flatten",
      unflatten: "Unflatten",
      escape: "Escape",
      unescape: "Unescape",
      repair: "Repair",
      fromSchema: "Generate example",
      extractKeys: "Extract keys",
      extractValues: "Extract values",
      pick: "Pick fields",
      omit: "Omit fields",
      compareStructure: "Compare structure",
      clear: "Clear",
      expandAll: "Expand all",
      collapseAll: "Collapse all",
      copyPath: "Copy path",
      copyValue: "Copy value",
    },
    errors: {
      empty: "Paste some JSON first.",
      invalid: "Invalid JSON.",
      unexpectedEnd: "Unexpected end of JSON.",
      unexpectedToken: "Unexpected token: {token}",
      expectedPropertyName: "Expected a double-quoted property name.",
      expectedCommaOrBrace: "Expected ',' or '}' after a property value.",
      expectedCommaOrBracket: "Expected ',' or ']' after an array item.",
      expectedColon: "Expected ':' after a property name.",
      unterminatedString: "Unterminated string.",
      badControlChar: "Bad control character in a string.",
      badEscape: "Bad escape sequence in a string.",
      trailingChar: "Unexpected characters after the JSON value.",
      objectKeyExpected: "Expected an object key.",
      unexpectedCharacter: "Unexpected character: {char}",
      invalidCharacter: "Invalid character: {char}",
      invalidUnicode: "Invalid unicode escape: {chars}",
      couldNotRepair: "Could not repair this JSON.",
      atLineColumn: "line {line}, column {column}",
      atLine: "line {line}",
      atPosition: "position {position}",
    },
    types: {
      object: "object",
      array: "array",
      string: "string",
      number: "number",
      boolean: "boolean",
      null: "null",
    },
    validate: {
      idleHint: "Paste JSON, then validate. Only standard JSON syntax is checked.",
      validTitle: "Valid JSON",
      validBody: "Root type: {type}",
      invalidTitle: "Invalid JSON",
    },
    tree: {
      idleTitle: "Tree appears here",
      idleBody: "Paste JSON on the left, then show the tree.",
      errorTitle: "Cannot build tree",
      errorBody: "Fix the JSON error first, then try again.",
    },
    search: {
      query: "Find",
      replaceWith: "Replace with",
      matchCount: "{current} of {total}",
      noMatches: "No matches",
      noMatchesBody: "Nothing matched that query in keys or values.",
      idleTitle: "Matches appear here",
      idleBody: "Enter a query and press Search. Searches keys and values.",
      errorTitle: "Cannot search",
      errorBody: "Fix the JSON error first, then search again.",
      kindKey: "Key",
      kindValue: "Value",
      activeHint: "{kind} · {path}",
      replacedCount: "Replaced {count} occurrence(s).",
    },
    diff: {
      idleTitle: "Diff appears here",
      idleBody: "Paste JSON A and JSON B, then compare.",
      identical: "No differences — the documents are structurally identical.",
      added: "Added / in B",
      removed: "Removed / in A",
      changed: "Changed",
      sideEmpty: "Nothing on this side.",
      emptyA: "JSON A is empty.",
      emptyB: "JSON B is empty.",
      bothInvalid: "Both JSON A and JSON B are invalid.",
    },
    jsonpath: {
      whatIs:
        "JSONPath picks values out of nested JSON — like a CSS selector for data. Click an example below.",
      hintTitle: "Syntax",
      hintBody: `$              Root
.users         Property
[*]            All array items
[0]            First item`,
      idleTitle: "Result appears here",
      idleBody: "Enter a path and run the query.",
      errorTitle: "Cannot run query",
      errorBody: "Fix the JSON or path error, then try again.",
      noResults: "No results for this path.",
      emptyPath: "Enter a JSONPath expression.",
    },
    transform: {
      tsIdleTitle: "TypeScript appears here",
      tsIdleBody: "Paste JSON, then generate types.",
      zodIdleTitle: "Zod schema appears here",
      zodIdleBody: "Paste JSON, then generate a Zod schema.",
      schemaExplain: "JSON ↔ Schema",
      schemaUse:
        "Infer a JSON Schema from Your JSON, or swap direction to build a sample document from a schema.",
      schemaIdleTitle: "JSON Schema appears here",
      schemaIdleBody: "Paste JSON, then generate a schema.",
      yamlIdleTitle: "YAML appears here",
      yamlIdleBody: "Your JSON converts to YAML live.",
      yamlToJsonIdle: "Paste YAML above — it becomes Your JSON.",
      yamlApplied: "Converted — Your JSON was updated.",
      csvIdleTitle: "CSV appears here",
      csvIdleBodyJson:
        "Converts Your JSON — a single object, an array of objects, or an object wrapping one table.",
      csvIdleBodyCsv: "Paste CSV with a header row, then convert to JSON.",
      csvToJsonIdle: "Paste CSV above — it becomes Your JSON.",
      csvApplied: "Converted — Your JSON was updated.",
      csvUnsupported: "Could not convert this JSON to CSV.",
    },
    utilities: {
      sortAsc: "A → Z",
      sortDesc: "Z → A",
      sortIdleTitle: "Ready to sort",
      sortIdleBody: "Choose A→Z or Z→A — sorted keys appear in the output.",
      sortApplied: "Keys sorted — see output below.",
      removeOptions: "Remove these",
      removeNull: "null",
      removeEmptyString: '""',
      removeEmptyArray: "[]",
      removeEmptyObject: "{}",
      removeNullLabel: "null values",
      removeEmptyStringLabel: "empty strings",
      removeEmptyArrayLabel: "empty arrays",
      removeEmptyObjectLabel: "empty objects",
      removePreserveHint: "false and 0 are always kept.",
      removeIdleTitle: "Cleaned JSON appears here",
      removeIdleBody: "Choose what to remove, then run.",
      nestedLabel: "Nested",
      flatLabel: "Flat",
      flattenHint: "Turns nested objects into dotted keys — e.g. address.city and skills.0.",
      flattenUse:
        "Handy for spreadsheets, env files, search indexes, or APIs that only accept flat key/value maps.",
      flattenIdleTitle: "Ready to flatten",
      flattenIdleBody: "Nested keys become dotted paths in the output.",
      flattenApplied: "Flattened — see output below.",
      unflattenHint: "Dot paths rebuild objects; numeric segments rebuild arrays.",
      unflattenUse:
        "Use when you have flat keys (user.name, skills.0) and need nested JSON back.",
      unflattenIdleTitle: "Nested JSON appears here",
      unflattenIdleBody: "Paste a flat path object, then unflatten.",
      escapeIdleTitle: "Escaped string appears here",
      escapeIdleBody: "Your JSON will be escaped for use inside a string.",
      escapeHint:
        "Turns your JSON into a single escaped string — quotes and newlines become \\u0022 / \\n so it can sit inside another string or config.",
      escapeUse:
        "Handy for embedding JSON in code, env vars, or logs without breaking the surrounding quotes.",
      unescapeIdleTitle: "JSON appears here",
      unescapeIdleBody: "Paste an escaped JSON string, then unescape.",
      repairHint:
        "Multi-pass repair for broken, truncated, commented, or mid-edit JSON.",
      repairUse:
        "Fixes quotes, commas, and brackets; strips comments and code fences; handles Python/JS literals, JSONP, MongoDB types, NDJSON, truncated documents, and junk typed in the middle.",
      repairAlreadyValid: "Already fine. Just formatted.",
      repairFormatted: "Formatted.",
      repairReady: "Fixed what we could.",
      repairApplied: "Fixed.",
      repairAppliedToSource: "Applied to Your JSON.",
      repairFailedTitle: "Couldn’t fully repair",
      repairFailedAt: "{message} (line {line}, column {column})",
      repairPreview: "Repaired",
      repairFixes: {
        "trailing-commas": "Trailing commas",
        "single-quotes": "Single quotes",
        "smart-quotes": "Smart quotes",
        "unquoted-keys": "Unquoted keys",
        "missing-commas": "Missing commas",
        "missing-brackets": "Missing brackets",
        comments: "Comments",
        "code-fence": "Code fence",
        "python-literals": "Python literals",
        "js-undefined": "undefined → null",
        jsonp: "JSONP wrapper",
        "escaped-string": "Escaped JSON string",
        mongodb: "MongoDB types",
        ndjson: "NDJSON → array",
        ellipsis: "Ellipsis",
        "string-concat": "String concatenation",
        whitespace: "Whitespace / formatting",
        truncated: "Truncated / incomplete",
        "mid-edit-junk": "Mid-edit junk",
      },
      repairIdleTitle: "Repaired JSON appears here",
      repairIdleBody:
        "Paste broken or almost-JSON text in Your JSON — repair runs live into the output.",
      fromSchemaHint:
        "Schema → sample JSON from type, properties, required, items, enum, and default.",
      fromSchemaIdleTitle: "Example JSON appears here",
      fromSchemaIdleBody: "Paste a JSON Schema below, then generate an example.",
      extractHint:
        "Returns leaf path + value pairs together — e.g. { path: \"address.city\", value: \"Tehran\" }.",
      extractIdleTitle: "Keys & values appear here",
      extractIdleBody: "Select fields above to extract their paths and values.",
      extractKeysHint: "Returns nested key paths with dot notation (arrays as .0).",
      extractKeysIdleTitle: "Keys appear here",
      extractKeysIdleBody: "Paste JSON, then extract keys.",
      extractValuesHint: "Collects leaf values (primitives and null) depth-first.",
      extractValuesIdleTitle: "Values appear here",
      extractValuesIdleBody: "Paste JSON, then extract values.",
      fieldsLabel: "Fields from Your JSON",
      fieldsClickHint:
        "Click paths to select — no typing needed. Nested paths use dot notation.",
      fieldsSelectAll: "Select all",
      fieldsClear: "Clear",
      fieldsEmpty: "This JSON has no selectable fields.",
      pickHint: "Keep only the fields you select — click fields below.",
      pickIdleTitle: "Result appears here",
      pickIdleBody: "",
      omitHint: "Remove the fields you select — click fields below.",
      omitIdleTitle: "Result appears here",
      omitIdleBody: "",
      compareHint: "Paste two JSON documents side by side. Structure only — values are ignored.",
      compareUse:
        "Missing keys light up red on A, added keys green on B, type mismatches amber on both.",
      compareBack: "Back to workbench",
      compareIdleTitle: "Paste both JSON documents",
      compareIdleBody: "Add JSON on the left and right to compare structure.",
      compareIdentical: "Same structure — types and keys match.",
      compareMissing: "Missing (only in A)",
      compareExtra: "Added (only in B)",
      compareType: "Type mismatch",
    },
    empty: {
      formatTitle: "Formatted JSON appears here",
      formatBody: "Paste JSON on the left, then press Format.",
    },
    soon: {
      badge: "Soon",
      title: "{tool} is coming next",
      body: "This tool is listed so you can see the full workbench. It will unlock in a later phase.",
    },
    tools: {
      format: "Format",
      minify: "Minify",
      validate: "Validate",
      tree: "Tree View",
      search: "Search",
      diff: "Diff",
      jsonpath: "JSONPath",
      convert: "Convert",
      toTypescript: "TypeScript",
      toZod: "Zod",
      toSchema: "JSON Schema",
      yaml: "YAML",
      csv: "CSV",
      sortKeys: "Sort keys",
      removeEmpty: "Remove empty",
      flatten: "Flatten",
      unflatten: "Unflatten",
      escape: "Escape",
      unescape: "Unescape",
      repair: "Repair",
      extract: "Extract keys & values",
      extractKeys: "Extract keys",
      extractValues: "Extract values",
      pick: "Pick",
      omit: "Omit",
      compareStructure: "Compare structure",
    },
  },
  generator: {
    title: "Fake Data Generator",
    subtitle: "Generate realistic data for your frontend projects.",
    chooseType: "Data types",
    searchPlaceholder: "Search data…",
    noTopics: "No matching data types.",
    fieldsLegend: "Fields",
    moreFields: "More fields",
    lessFields: "Hide optional",
    optionalFields: "Optional fields",
    records: "Records",
    customQty: "Custom",
    country: "Country",
    countrySearch: "Search countries…",
    selectPlaceholder: "Choose a data type…",
    outputMode: "Output shape",
    modePayload: "POST body",
    modeApi: "API record",
    modePayloadHint: "No id or timestamps — ready to POST as a create body.",
    modeApiHint: "Includes id, createdAt, and updatedAt like a stored API row.",
    jsonType: "JSON",
    viewJson: "JSON",
    viewType: "TS",
    generate: "Generate {n} records",
    generating: "Generating {n} records…",
    generateAgain: "Generate again",
    refresh: "Regenerate",
    generated: "Generated {n} records",
    download: "Download",
    createApi: "Create API",
    createSuccess: "Temporary API created.",
    createBlockedArray:
      "Temporary API allows up to 500 records. Lower the quantity to publish.",
    createBlockedSize:
      "This JSON is too large for Temporary API (64 KB). Lower the quantity or remove fields.",
    openTemporary: "Manage on Temporary",
    emptyTitle: "Choose a data type",
    emptyBody: "Pick something above to start generating realistic data.",
    duration1h: "1h",
    duration6h: "6h",
    duration12h: "12h",
    duration24h: "24h",
    countries: {
      all: "All countries",
      IR: "Iran",
      DE: "Germany",
      US: "United States",
      GB: "England",
      FR: "France",
      NL: "Netherlands",
      JP: "Japan",
      CA: "Canada",
    },
    categories: {
      people: "People",
      ecommerce: "E-commerce",
      content: "Content",
      media: "Media",
      business: "Business",
      location: "Location",
    },
    fields: {
      id: "id",
      name: "Name",
      username: "Username",
      email: "Email",
      avatar: "Avatar",
      phone: "Phone",
      company: "Company",
      location: "Location",
      age: "Age",
      role: "Role",
      jobTitle: "Job title",
      department: "Department",
      bio: "Bio",
      website: "Website",
      createdAt: "Created at",
      updatedAt: "Updated at",
      hiredAt: "Hired at",
      ordersCount: "Orders count",
      totalSpent: "Total spent",
      postsCount: "Posts count",
      price: "Price",
      image: "Image",
      category: "Category",
      description: "Description",
      brand: "Brand",
      stock: "Stock",
      rating: "Rating",
      sku: "SKU",
      colors: "Colors",
      orderId: "Order ID",
      customer: "Customer",
      items: "Items",
      total: "Total",
      status: "Status",
      orderDate: "Order date",
      paymentStatus: "Payment status",
      shippingAddress: "Shipping address",
      user: "User",
      comment: "Comment",
      post: "Post",
      date: "Date",
      product: "Product",
      title: "Title",
      verified: "Verified",
      helpful: "Helpful votes",
      slug: "Slug",
      parentCategory: "Parent category",
      productCount: "Product count",
      quantity: "Quantity",
      discount: "Discount",
      code: "Code",
      type: "Type",
      expiresAt: "Expires at",
      minimumOrder: "Minimum order",
      usageLimit: "Usage limit",
      active: "Active",
      amount: "Amount",
      currency: "Currency",
      paymentMethod: "Payment method",
      transactionId: "Transaction ID",
      order: "Order",
      carrier: "Carrier",
      trackingNumber: "Tracking number",
      estimatedDelivery: "Estimated delivery",
      body: "Body",
      author: "Author",
      tags: "Tags",
      publishedAt: "Published at",
      likes: "Likes",
      views: "Views",
      replies: "Replies",
      attachments: "Attachments",
      actionUrl: "Action URL",
      sender: "Sender",
      receiver: "Receiver",
      message: "Message",
      read: "Read",
      artist: "Artist",
      cover: "Cover",
      year: "Year",
      genre: "Genre",
      tracks: "Tracks",
      album: "Album",
      duration: "Duration",
      poster: "Poster",
      director: "Director",
      language: "Language",
      plays: "Plays",
      label: "Label",
      pages: "Pages",
      isbn: "ISBN",
      instructor: "Instructor",
      level: "Level",
      lessons: "Lessons",
      students: "Students",
      employees: "Employees",
      logo: "Logo",
      industry: "Industry",
      salary: "Salary",
      experience: "Experience",
      remote: "Remote",
      founded: "Founded",
      postedAt: "Posted at",
      capacity: "Capacity",
      capital: "Capital",
      flag: "Flag",
      region: "State / Province / Region",
      population: "Population",
      street: "Street",
      postalCode: "Postal code",
      latitude: "Latitude",
      longitude: "Longitude",
      country: "Country",
      city: "City",
      notes: "Notes",
      team: "Team",
      joinedAt: "Joined at",
      skills: "Skills",
      specialty: "Specialty",
      hospital: "Hospital",
      licenseNumber: "License number",
      yearsExperience: "Years of experience",
      bloodType: "Blood type",
      diagnosis: "Diagnosis",
      doctor: "Doctor",
      admittedAt: "Admitted at",
      vehicleType: "Vehicle type",
      plateNumber: "Plate number",
      tripsCount: "Trips count",
      roomNumber: "Room number",
      checkIn: "Check-in",
      checkOut: "Check-out",
      nights: "Nights",
      followers: "Followers",
      following: "Following",
      grade: "Grade",
      school: "School",
      gpa: "GPA",
      major: "Major",
      enrollmentYear: "Enrollment year",
      subject: "Subject",
      classesCount: "Classes count",
      invoiceNumber: "Invoice number",
      issueDate: "Issue date",
      dueDate: "Due date",
      tax: "Tax",
      itemsCount: "Items count",
      target: "Target",
      targetType: "Target type",
      reaction: "Reaction",
      color: "Color",
      thumbnail: "Thumbnail",
      channel: "Channel",
      url: "URL",
      width: "Width",
      height: "Height",
      alt: "Alt text",
      photographer: "Photographer",
      host: "Host",
      episodes: "Episodes",
      subscribers: "Subscribers",
      owner: "Owner",
      public: "Public",
      progress: "Progress",
      teamSize: "Team size",
      budget: "Budget",
      startDate: "Start date",
      membersCount: "Members count",
      focus: "Focus",
      countriesCount: "Countries count",
      areaKm2: "Area (km²)",
      timezone: "Timezone",
      terminals: "Terminals",
      altitude: "Altitude",
      accuracy: "Accuracy",
    },
    topics: {
      users: {
        name: "Users",
        description: "People profiles for apps and dashboards",
        preview: {
          line1: "Sarah Johnson",
          line2: "@sarahj · sarah@mail.test",
          line3: "Berlin",
        },
      },
      customers: {
        name: "Customers",
        description: "Shoppers and account contacts",
        preview: {
          line1: "Alex Rivera",
          line2: "alex@demo.dev",
          line3: "+1 415 555 0199",
        },
      },
      employees: {
        name: "Employees",
        description: "Team members with roles and departments",
        preview: {
          line1: "Maya Chen",
          line2: "Frontend Developer",
          line3: "Engineering · Acme",
        },
      },
      authors: {
        name: "Authors",
        description: "Writers and content creators",
        preview: {
          line1: "Jordan Lee",
          line2: "Writes about product craft.",
        },
      },
      contacts: {
        name: "Contacts",
        description: "CRM-style people and company links",
        preview: {
          line1: "Nora Blake",
          line2: "nora@acme.test · Acme",
        },
      },
      "team-members": {
        name: "Team members",
        description: "People on product and engineering teams",
        preview: {
          line1: "Sam Ortiz",
          line2: "lead · Engineering",
        },
      },
      doctors: {
        name: "Doctors",
        description: "Clinicians with specialty and hospital",
        preview: {
          line1: "Dr. Lena Park",
          line2: "Cardiology · City General",
        },
      },
      patients: {
        name: "Patients",
        description: "Medical records with diagnosis and blood type",
        preview: {
          line1: "Omar Hassan",
          line2: "A+ · Hypertension",
        },
      },
      drivers: {
        name: "Drivers",
        description: "Fleet drivers with vehicle and rating",
        preview: {
          line1: "Chris Adams",
          line2: "sedan · ★ 4.8",
        },
      },
      guests: {
        name: "Guests",
        description: "Hotel guests with room and stay status",
        preview: {
          line1: "Elena Rossi",
          line2: "Room 412 · checked_in",
        },
      },
      profiles: {
        name: "Profiles",
        description: "Social profiles with followers and bio",
        preview: {
          line1: "Ava Chen",
          line2: "@avachen · 12.4k followers",
        },
      },
      "girl-students": {
        name: "Girl students",
        description: "Female students with grade and school",
        preview: {
          line1: "Mia Johnson",
          line2: "Grade 11 · Lincoln High",
        },
      },
      "boy-students": {
        name: "Boy students",
        description: "Male students with grade and school",
        preview: {
          line1: "Noah Smith",
          line2: "Grade 10 · Jefferson High",
        },
      },
      teachers: {
        name: "Teachers",
        description: "Educators with subject and school",
        preview: {
          line1: "Emma Wilson",
          line2: "Mathematics · Oakwood School",
        },
      },
      products: {
        name: "Products",
        description: "Store products and pricing",
        preview: {
          line1: "Wireless Headphones",
          line2: "€89.99 · Electronics",
          line3: "★★★★☆",
        },
      },
      orders: {
        name: "Orders",
        description: "Checkout orders with items and status",
        preview: {
          line1: "Order #10482",
          line2: "3 items · €129.90",
          line3: "Delivered",
        },
      },
      reviews: {
        name: "Reviews",
        description: "Ratings and customer feedback",
        preview: {
          line1: "★★★★★ Great product",
          line2: "Really useful and easy to use.",
        },
      },
      categories: {
        name: "Categories",
        description: "Product catalog groups",
        preview: { line1: "Electronics", line2: "electronics" },
      },
      "cart-items": {
        name: "Cart items",
        description: "Line items in a shopping cart",
        preview: { line1: "Smart Watch", line2: "2 × $129 · $258" },
      },
      coupons: {
        name: "Coupons",
        description: "Discount codes and rules",
        preview: { line1: "WELCOME10", line2: "10% · expires 2026-12-01" },
      },
      payments: {
        name: "Payments",
        description: "Payment attempts and methods",
        preview: { line1: "$84.50 USD", line2: "card · paid" },
      },
      shipments: {
        name: "Shipments",
        description: "Carriers and tracking status",
        preview: { line1: "ORD-10482 · DHL", line2: "In transit" },
      },
      invoices: {
        name: "Invoices",
        description: "Billing documents with amounts and due dates",
        preview: { line1: "INV-10482", line2: "$420 · paid" },
      },
      brands: {
        name: "Brands",
        description: "Store brands with logos and catalogs",
        preview: { line1: "Acme", line2: "acme · 128 products" },
      },
      posts: {
        name: "Posts",
        description: "Blog and feed posts",
        preview: { line1: "Designing for speed", line2: "By Ava Chen" },
      },
      comments: {
        name: "Comments",
        description: "Replies on posts and products",
        preview: {
          line1: "This helped a lot — thanks!",
          line2: "Liam · 12 likes",
        },
      },
      messages: {
        name: "Messages",
        description: "Inbox-style conversations",
        preview: {
          line1: "Can you review the latest draft?",
          line2: "Sara → Amir",
        },
      },
      notifications: {
        name: "Notifications",
        description: "In-app alerts and digests",
        preview: { line1: "New comment", line2: "info · 2h ago" },
      },
      tags: {
        name: "Tags",
        description: "Content tags with slugs and counts",
        preview: { line1: "typescript", line2: "142 posts" },
      },
      "content-categories": {
        name: "Content categories",
        description: "Editorial categories for posts",
        preview: { line1: "Tutorials", line2: "tutorials · 86 posts" },
      },
      likes: {
        name: "Likes",
        description: "Reactions on posts and comments",
        preview: { line1: "Ava liked a post", line2: "post · love" },
      },
      albums: {
        name: "Albums",
        description: "Music albums with cover art",
        preview: {
          line1: "Random Access Memories",
          line2: "Daft Punk",
          line3: "2013 · 13 tracks",
        },
      },
      songs: {
        name: "Songs",
        description: "Tracks with duration and artist",
        preview: { line1: "Midnight Drive", line2: "3:42 · Electronic" },
      },
      movies: {
        name: "Movies",
        description: "Films with posters and ratings",
        preview: { line1: "Night Circuit", line2: "2021 · ★ 8.2" },
      },
      books: {
        name: "Books",
        description: "Titles with authors and covers",
        preview: { line1: "Designing Interfaces", line2: "Jordan Lee · 2019" },
      },
      videos: {
        name: "Videos",
        description: "Video clips with duration and views",
        preview: {
          line1: "Build a dashboard in 10 minutes",
          line2: "12:40 · 84k views",
        },
      },
      images: {
        name: "Images",
        description: "Photos with dimensions and tags",
        preview: { line1: "Morning light", line2: "1280×720" },
      },
      podcasts: {
        name: "Podcasts",
        description: "Shows with hosts and episode counts",
        preview: { line1: "Code & Coffee", line2: "48 episodes · Tech" },
      },
      playlists: {
        name: "Playlists",
        description: "Track lists with owners and genres",
        preview: { line1: "Deep Focus", line2: "32 tracks · Electronic" },
      },
      companies: {
        name: "Companies",
        description: "Organizations and industries",
        preview: { line1: "Acme Corp", line2: "Technology · New York" },
      },
      jobs: {
        name: "Jobs",
        description: "Job listings with location and type",
        preview: {
          line1: "Frontend Developer",
          line2: "Google · Berlin · Full-time",
        },
      },
      courses: {
        name: "Courses",
        description: "Learning content and instructors",
        preview: { line1: "React Fundamentals", line2: "Intermediate · 12h" },
      },
      events: {
        name: "Events",
        description: "Meetups and conferences",
        preview: { line1: "Frontend Meetup", line2: "Berlin · Workshop" },
      },
      projects: {
        name: "Projects",
        description: "Workstreams with progress and budget",
        preview: { line1: "Dashboard redesign", line2: "in_progress · 72%" },
      },
      teams: {
        name: "Teams",
        description: "Company teams with leads and size",
        preview: { line1: "Product squad", line2: "8 members · Engineering" },
      },
      continents: {
        name: "Continents",
        description: "World continents with codes and stats",
        preview: { line1: "Europe", line2: "EU · 44 countries" },
      },
      countries: {
        name: "Countries",
        description: "Country names, codes, and flags",
        preview: { line1: "England", line2: "GB · London" },
      },
      cities: {
        name: "Cities",
        description: "Cities with region and country",
        preview: { line1: "Munich", line2: "Germany · Bavaria" },
      },
      addresses: {
        name: "Addresses",
        description: "Consistent street-level addresses",
        preview: {
          line1: "12 Hauptstraße",
          line2: "Munich, Bavaria, Germany",
        },
      },
      regions: {
        name: "Regions",
        description: "States, provinces, and regions",
        preview: { line1: "Bavaria", line2: "Germany · Munich" },
      },
      neighborhoods: {
        name: "Neighborhoods",
        description: "City districts and local areas",
        preview: { line1: "Riverside", line2: "Munich · Bavaria" },
      },
      airports: {
        name: "Airports",
        description: "Airports with IATA codes and cities",
        preview: { line1: "Frankfurt", line2: "FRA · Germany" },
      },
      coordinates: {
        name: "Geo coordinates",
        description: "Latitude, longitude, and place labels",
        preview: {
          line1: "48.137154, 11.576124",
          line2: "Munich · Germany",
        },
      },
    },
    errors: {
      pickTopic: "Choose a data type first.",
      INVALID_TOPIC: "Unknown data type.",
      INVALID_FIELDS: "Select at least one field.",
      INVALID_QUANTITY: "Quantity must be between 1 and 1000.",
      INVALID_COUNTRY: "Invalid country.",
      GENERATE_FAILED: "Could not generate data. Try again.",
      DOWNLOAD_FAILED: "Download failed. Try again.",
      CREATE_FAILED: "Could not create Temporary API.",
      LIMIT_REACHED: "Temporary API limit reached (5 active). Delete one first.",
      RATE_LIMITED: "Too many creates. Try again later.",
    },
  },
  preview: {
    docs: "Docs",
    playground: "Playground",
    blurb: "A simple UI to try this API.",
    blurbFaHint: "",
    backToResource: "Back to {name}",
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
    loginSuccess: "You’re logged in successfully.",
    logout: "Log out",
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
    "2026-09-19-json-workbench": {
      title: "JSON Workbench",
      teaser: "In development — format, compare, and transform JSON",
      hint: "/json — pick a tool, workspace updates in place",
      badge: "In development",
      summary:
        "JSON Workbench is in development: one in-browser workspace to format, compare structure, search, and transform JSON — plus TypeScript, Zod, YAML, CSV, and utilities.",
      details: [
        "Open JSON Workbench at /json and pick a tool — the workspace updates in place (deep-link with ?tool=).",
        "Core: Format, Tree, Search, JSONPath, and Compare Structure.",
        "Transform: TypeScript, Zod, JSON Schema, YAML, and CSV conversions.",
        "Utilities: sort keys, clean empty values, flatten, escape, repair, pick/omit, and more.",
        "Still evolving — expect more tools and polish over time.",
      ],
    },
    "2026-09-19-image-generator": {
      title: "Image Generator",
      teaser: "Placeholder images by URL",
      hint: "/image-generator — SVG or real photo, copy the link",
      summary:
        "Placeholder images by URL — MockData SVG or real photos via Picsum, with ready sizes for avatars, posts, and banners.",
      details: [
        "Open /image-generator to pick SVG or real image, set width/height, and copy a ready URL.",
        "Public URLs are random by default: /image/{w}/{h} for SVG, add ?type=real for photos.",
        "Optional ?seed= pins the same SVG colors or the same real photo every time.",
        "Drop the link into img, CSS, or any image field — no upload step.",
      ],
    },
    "2026-09-17-generator": {
      title: "Fake Data Generator",
      teaser: "Realistic JSON in seconds",
      hint: "/generator — pick a type, generate, copy or Create API",
      summary:
        "Generate realistic JSON for UI work — pick a type, fields, and quantity, then copy, download, or publish via Temporary API.",
      details: [
        "Open /generator for people, ecommerce, content, media, business, and location types.",
        "POST body vs API record shapes; FA UI uses Persian locale packs.",
        "Generate up to 1,000 records in the browser; Create API uses Temporary limits (500 / 64 KB).",
        "Selections and results survive client-side navigation (cleared on full reload).",
      ],
    },
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
        "Request UI and last responses are kept per resource across SPA navigation (full reload clears).",
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
