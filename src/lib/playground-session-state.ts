import type { ApiLocale } from "@/lib/api/locale-constants";
import type { PlaygroundResourceId } from "@/lib/playground";

export type PlaygroundHttpMethod = "GET" | "POST" | "PATCH" | "DELETE";
export type PlaygroundActionId =
  | "list"
  | "get"
  | "create"
  | "update"
  | "delete"
  | "login"
  | "me";

export type PlaygroundResponseSnap = {
  text: string;
  status: number | null;
  ms: number | null;
  lastUrl: string | null;
  isFa: boolean;
};

/** Per-resource request UI — restored when switching back to a resource. */
export type PlaygroundResourceUiSnap = {
  action: PlaygroundActionId;
  method: PlaygroundHttpMethod;
  path: string;
  body: string;
  manual: boolean;
  forceStatus: number | "";
  forceDelay: number | "";
  page: number;
  limit: number;
  search: string;
  role: string;
  countryFilter: string;
  sort: string;
  order: "asc" | "desc" | "";
};

export type PlaygroundSessionState = {
  resource: PlaygroundResourceId;
  action: PlaygroundActionId;
  loginOk: boolean;
  userId: string;
  postId: string;
  commentId: string;
  albumId: string;
  photoId: string;
  todoId: string;
  productId: string;
  notificationId: string;
  countryId: string;
  method: PlaygroundHttpMethod;
  path: string;
  body: string;
  manual: boolean;
  forceStatus: number | "";
  forceDelay: number | "";
  page: number;
  limit: number;
  search: string;
  role: string;
  countryFilter: string;
  sort: string;
  order: "asc" | "desc" | "";
  queryLang: "en" | "fa";
  responseView: "json" | "types";
  token: string;
  tokenEditable: boolean;
  responsesByResource: Partial<
    Record<PlaygroundResourceId, PlaygroundResponseSnap>
  >;
  uiByResource: Partial<
    Record<PlaygroundResourceId, PlaygroundResourceUiSnap>
  >;
  error: string | null;
  apiLocale: ApiLocale;
};

const EMPTY_RESPONSE: PlaygroundResponseSnap = {
  text: "// Pick a resource + action, then Send",
  status: null,
  ms: null,
  lastUrl: null,
  isFa: false,
};

function defaultPath(resource: PlaygroundResourceId): string {
  if (resource === "auth") return "/api/auth/login";
  return `/api/${resource}?limit=12`;
}

function defaultAction(resource: PlaygroundResourceId): PlaygroundActionId {
  return resource === "auth" ? "login" : "list";
}

export function defaultResourceUi(
  resource: PlaygroundResourceId,
): PlaygroundResourceUiSnap {
  return {
    action: defaultAction(resource),
    method: resource === "auth" ? "POST" : "GET",
    path: defaultPath(resource),
    body: "",
    manual: false,
    forceStatus: "",
    forceDelay: "",
    page: 1,
    limit: 12,
    search: "",
    role: "",
    countryFilter: "",
    sort: "",
    order: "",
  };
}

const DEFAULT_STATE: PlaygroundSessionState = {
  resource: "users",
  action: "list",
  loginOk: true,
  userId: "",
  postId: "",
  commentId: "",
  albumId: "",
  photoId: "",
  todoId: "",
  productId: "",
  notificationId: "",
  countryId: "",
  method: "GET",
  path: "/api/users?limit=12",
  body: "",
  manual: false,
  forceStatus: "",
  forceDelay: "",
  page: 1,
  limit: 12,
  search: "",
  role: "",
  countryFilter: "",
  sort: "",
  order: "",
  queryLang: "en",
  responseView: "json",
  token: "",
  tokenEditable: false,
  responsesByResource: {},
  uiByResource: {},
  error: null,
  apiLocale: "en",
};

/** In-memory session — survives client navigations, clears on full reload. */
let session: PlaygroundSessionState = { ...DEFAULT_STATE };
let seeded = false;

export function loadPlaygroundSession(
  initialResource: PlaygroundResourceId = "users",
): PlaygroundSessionState {
  if (!seeded) {
    seeded = true;
    if (initialResource !== "users") {
      const ui = defaultResourceUi(initialResource);
      session = {
        ...DEFAULT_STATE,
        resource: initialResource,
        ...ui,
        uiByResource: { [initialResource]: ui },
      };
    }
  }
  return session;
}

export function savePlaygroundSession(
  patch: Partial<PlaygroundSessionState>,
): void {
  seeded = true;
  session = { ...session, ...patch };
}

export function clearPlaygroundSession(): void {
  session = { ...DEFAULT_STATE };
  seeded = false;
}

export { EMPTY_RESPONSE };
