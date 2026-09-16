"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ChevronDown, Lock, Pencil } from "lucide-react";
import { CopyButton } from "@/components/docs/copy-button";
import { HighlightedJsonEditor } from "@/components/playground/highlighted-json-editor";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { MOCK_PASSWORD } from "@/lib/auth/constants";
import {
  API_LOCALE_EVENT,
  API_LOCALE_STORAGE_KEY,
  type ApiLocale,
} from "@/lib/api/locale-constants";
import { actionLabels } from "@/lib/docs/action-labels";
import {
  type PlaygroundResourceId,
} from "@/lib/playground";
import { highlightCode } from "@/lib/syntax";
import { cn } from "@/lib/utils";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";
type ResourceId = PlaygroundResourceId;
type CrudAction = "list" | "get" | "create" | "update" | "delete";
type AuthAction = "login" | "me";
type ActionId = CrudAction | AuthAction;

type UserOption = {
  id: string;
  name: string;
  username: string;
  role: string;
};

type PostOption = {
  id: string;
  title: string;
  userId: string;
  published: boolean;
};

type SimpleOption = {
  id: string;
  label: string;
};

const resources: { id: ResourceId; label: string }[] = [
  { id: "auth", label: "Auth" },
  { id: "users", label: "Users" },
  { id: "posts", label: "Posts" },
  { id: "comments", label: "Comments" },
  { id: "albums", label: "Albums" },
  { id: "photos", label: "Photos" },
  { id: "todos", label: "Todos" },
  { id: "products", label: "Products" },
  { id: "notifications", label: "Notifications" },
  { id: "countries", label: "Countries" },
];

const authActions: { id: AuthAction; label: string; method: HttpMethod }[] = [
  { id: "login", label: actionLabels.login, method: "POST" },
  { id: "me", label: actionLabels.me, method: "GET" },
];

const crudActions: { id: CrudAction; label: string; method: HttpMethod }[] = [
  { id: "list", label: actionLabels.list, method: "GET" },
  { id: "get", label: actionLabels.get, method: "GET" },
  { id: "create", label: actionLabels.create, method: "POST" },
  { id: "update", label: actionLabels.update, method: "PATCH" },
  { id: "delete", label: actionLabels.delete, method: "DELETE" },
];

const methods: HttpMethod[] = ["GET", "POST", "PATCH", "DELETE"];

const methodColor: Record<HttpMethod, string> = {
  GET: "text-[var(--get)]",
  POST: "text-[var(--post)]",
  PATCH: "text-[var(--patch)]",
  DELETE: "text-[var(--delete)]",
};

function userCreateBody() {
  return JSON.stringify(
    {
      name: "Playground User",
      username: `pg_${Date.now().toString(36).slice(-6)}`,
      email: `pg_${Date.now().toString(36).slice(-6)}@example.com`,
      avatarUrl: "https://i.pravatar.cc/150?u=playground",
      role: "member",
      city: "Tehran",
      country: "Iran",
    },
    null,
    2,
  );
}

function userUpdateBody(user?: UserOption | null) {
  return JSON.stringify(
    {
      city: user?.name ? `${user.name.split(" ")[0]} City` : "Berlin",
      role: user?.role === "admin" ? "member" : "admin",
    },
    null,
    2,
  );
}

function postCreateBody(user?: UserOption | null) {
  return JSON.stringify(
    {
      userId: user?.id ?? "<user-id>",
      title: "Playground post",
      body: "Created from the MockData playground.",
      tags: ["playground"],
      published: true,
    },
    null,
    2,
  );
}

function postUpdateBody(post?: PostOption | null) {
  return JSON.stringify(
    {
      published: !(post?.published ?? true),
      tags: ["updated"],
    },
    null,
    2,
  );
}

function commentCreateBody(post?: PostOption | null) {
  return JSON.stringify(
    {
      postId: post?.id ?? "<post-id>",
      name: "Playground Commenter",
      email: "playground@example.com",
      body: "Nice post from the playground.",
    },
    null,
    2,
  );
}

function photoCreateBody() {
  return JSON.stringify(
    {
      albumId: 1,
      title: "Playground photo",
      url: "https://picsum.photos/600/400",
      thumbnailUrl: "https://picsum.photos/150/150",
    },
    null,
    2,
  );
}

function todoCreateBody(user?: UserOption | null) {
  return JSON.stringify(
    {
      userId: user?.id ?? "<user-id>",
      title: "Playground todo",
      completed: false,
    },
    null,
    2,
  );
}

function productCreateBody() {
  return JSON.stringify(
    {
      name: "Playground Mug",
      description: "Created from the MockData playground.",
      price: 18.5,
      stock: 25,
      category: "kitchen",
      imageUrl: "https://picsum.photos/seed/playground-mug/600/400",
    },
    null,
    2,
  );
}

function notificationCreateBody(user?: UserOption | null) {
  return JSON.stringify(
    {
      userId: user?.id ?? "<user-id>",
      title: "Playground ping",
      message: "Created from the MockData playground.",
      type: "info",
      read: false,
    },
    null,
    2,
  );
}

function countryCreateBody() {
  return JSON.stringify(
    {
      name: "Portugal",
      code: "PT",
      capital: "Lisbon",
      region: "Europe",
      population: 10196709,
      currency: "EUR",
      flagUrl: "https://flagcdn.com/w320/pt.png",
    },
    null,
    2,
  );
}

function albumCreateBody(user?: UserOption | null) {
  return JSON.stringify(
    {
      userId: user?.id ?? "<user-id>",
      title: "Playground album",
    },
    null,
    2,
  );
}

function withQuery(
  path: string,
  params: Record<string, string | number | undefined | "">,
): string {
  const [base, existing = ""] = path.split("?");
  const search = new URLSearchParams(existing);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") {
      search.delete(key);
      continue;
    }
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `${base}?${query}` : base!;
}

function buildRequest(input: {
  resource: ResourceId;
  action: ActionId;
  user: UserOption | null;
  post: PostOption | null;
  comment: SimpleOption | null;
  album: SimpleOption | null;
  photo: SimpleOption | null;
  todo: SimpleOption | null;
  product: SimpleOption | null;
  notification: SimpleOption | null;
  country: SimpleOption | null;
  loginOk: boolean;
}): { method: HttpMethod; path: string; body: string } {
  const {
    resource,
    action,
    user,
    post,
    comment,
    album,
    photo,
    todo,
    product,
    notification,
    country,
    loginOk,
  } = input;

  if (resource === "auth") {
    if (action === "me") {
      return { method: "GET", path: "/api/auth/me", body: "" };
    }
    return {
      method: "POST",
      path: "/api/auth/login",
      body: JSON.stringify(
        {
          username: user?.username ?? "avachen",
          password: loginOk ? MOCK_PASSWORD : "wrong",
        },
        null,
        2,
      ),
    };
  }

  if (resource === "users") {
    const id = user?.id ?? "<user-id>";
    switch (action) {
      case "list":
        return { method: "GET", path: "/api/users", body: "" };
      case "get":
        return { method: "GET", path: `/api/users/${id}`, body: "" };
      case "create":
        return { method: "POST", path: "/api/users", body: userCreateBody() };
      case "update":
        return {
          method: "PATCH",
          path: `/api/users/${id}`,
          body: userUpdateBody(user),
        };
      case "delete":
        return { method: "DELETE", path: `/api/users/${id}`, body: "" };
      default:
        return { method: "GET", path: "/api/users", body: "" };
    }
  }

  if (resource === "posts") {
    const id = post?.id ?? "<post-id>";
    switch (action) {
      case "list":
        return { method: "GET", path: "/api/posts", body: "" };
      case "get":
        return { method: "GET", path: `/api/posts/${id}`, body: "" };
      case "create":
        return {
          method: "POST",
          path: "/api/posts",
          body: postCreateBody(user),
        };
      case "update":
        return {
          method: "PATCH",
          path: `/api/posts/${id}`,
          body: postUpdateBody(post),
        };
      case "delete":
        return { method: "DELETE", path: `/api/posts/${id}`, body: "" };
      default:
        return { method: "GET", path: "/api/posts", body: "" };
    }
  }

  if (resource === "comments") {
    const id = comment?.id ?? "<comment-id>";
    switch (action) {
      case "list":
        return { method: "GET", path: "/api/comments", body: "" };
      case "get":
        return { method: "GET", path: `/api/comments/${id}`, body: "" };
      case "create":
        return {
          method: "POST",
          path: "/api/comments",
          body: commentCreateBody(post),
        };
      case "update":
        return {
          method: "PATCH",
          path: `/api/comments/${id}`,
          body: JSON.stringify({ body: "Updated from playground." }, null, 2),
        };
      case "delete":
        return { method: "DELETE", path: `/api/comments/${id}`, body: "" };
      default:
        return { method: "GET", path: "/api/comments", body: "" };
    }
  }

  if (resource === "albums") {
    const id = album?.id ?? "<album-id>";
    switch (action) {
      case "list":
        return { method: "GET", path: "/api/albums", body: "" };
      case "get":
        return { method: "GET", path: `/api/albums/${id}`, body: "" };
      case "create":
        return {
          method: "POST",
          path: "/api/albums",
          body: albumCreateBody(user),
        };
      case "update":
        return {
          method: "PATCH",
          path: `/api/albums/${id}`,
          body: JSON.stringify({ title: "Updated album" }, null, 2),
        };
      case "delete":
        return { method: "DELETE", path: `/api/albums/${id}`, body: "" };
      default:
        return { method: "GET", path: "/api/albums", body: "" };
    }
  }

  if (resource === "photos") {
    const id = photo?.id ?? "<photo-id>";
    switch (action) {
      case "list":
        return { method: "GET", path: "/api/photos", body: "" };
      case "get":
        return { method: "GET", path: `/api/photos/${id}`, body: "" };
      case "create":
        return {
          method: "POST",
          path: "/api/photos",
          body: photoCreateBody(),
        };
      case "update":
        return {
          method: "PATCH",
          path: `/api/photos/${id}`,
          body: JSON.stringify({ title: "Updated photo title" }, null, 2),
        };
      case "delete":
        return { method: "DELETE", path: `/api/photos/${id}`, body: "" };
      default:
        return { method: "GET", path: "/api/photos", body: "" };
    }
  }

  if (resource === "todos") {
    const id = todo?.id ?? "<todo-id>";
    switch (action) {
      case "list":
        return { method: "GET", path: "/api/todos", body: "" };
      case "get":
        return { method: "GET", path: `/api/todos/${id}`, body: "" };
      case "create":
        return {
          method: "POST",
          path: "/api/todos",
          body: todoCreateBody(user),
        };
      case "update":
        return {
          method: "PATCH",
          path: `/api/todos/${id}`,
          body: JSON.stringify({ completed: true }, null, 2),
        };
      case "delete":
        return { method: "DELETE", path: `/api/todos/${id}`, body: "" };
      default:
        return { method: "GET", path: "/api/todos", body: "" };
    }
  }

  if (resource === "products") {
    const id = product?.id ?? "<product-id>";
    switch (action) {
      case "list":
        return { method: "GET", path: "/api/products", body: "" };
      case "get":
        return { method: "GET", path: `/api/products/${id}`, body: "" };
      case "create":
        return {
          method: "POST",
          path: "/api/products",
          body: productCreateBody(),
        };
      case "update":
        return {
          method: "PATCH",
          path: `/api/products/${id}`,
          body: JSON.stringify({ stock: 10 }, null, 2),
        };
      case "delete":
        return { method: "DELETE", path: `/api/products/${id}`, body: "" };
      default:
        return { method: "GET", path: "/api/products", body: "" };
    }
  }

  if (resource === "notifications") {
    const id = notification?.id ?? "<notification-id>";
    switch (action) {
      case "list":
        return { method: "GET", path: "/api/notifications", body: "" };
      case "get":
        return { method: "GET", path: `/api/notifications/${id}`, body: "" };
      case "create":
        return {
          method: "POST",
          path: "/api/notifications",
          body: notificationCreateBody(user),
        };
      case "update":
        return {
          method: "PATCH",
          path: `/api/notifications/${id}`,
          body: JSON.stringify({ read: true }, null, 2),
        };
      case "delete":
        return {
          method: "DELETE",
          path: `/api/notifications/${id}`,
          body: "",
        };
      default:
        return { method: "GET", path: "/api/notifications", body: "" };
    }
  }

  if (resource === "countries") {
    const id = country?.id ?? "<country-id>";
    switch (action) {
      case "list":
        return { method: "GET", path: "/api/countries", body: "" };
      case "get":
        return { method: "GET", path: `/api/countries/${id}`, body: "" };
      case "create":
        return {
          method: "POST",
          path: "/api/countries",
          body: countryCreateBody(),
        };
      case "update":
        return {
          method: "PATCH",
          path: `/api/countries/${id}`,
          body: JSON.stringify({ population: 11000000 }, null, 2),
        };
      case "delete":
        return { method: "DELETE", path: `/api/countries/${id}`, body: "" };
      default:
        return { method: "GET", path: "/api/countries", body: "" };
    }
  }

  return { method: "GET", path: "/api/users", body: "" };
}

type ResponseSnap = {
  text: string;
  status: number | null;
  ms: number | null;
  lastUrl: string | null;
  isFa: boolean;
};

const EMPTY_RESPONSE: ResponseSnap = {
  text: "// Pick a resource + action, then Send",
  status: null,
  ms: null,
  lastUrl: null,
  isFa: false,
};

type PlaygroundProps = {
  initialResource?: ResourceId;
};

export function ApiPlayground({ initialResource = "users" }: PlaygroundProps) {
  const { dict, locale: uiLocale } = useUiLocale();
  const [resource, setResource] = useState<ResourceId>(initialResource);
  const [action, setAction] = useState<ActionId>(
    initialResource === "auth" ? "login" : "list",
  );
  const [loginOk, setLoginOk] = useState(true);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [posts, setPosts] = useState<PostOption[]>([]);
  const [comments, setComments] = useState<SimpleOption[]>([]);
  const [albumsList, setAlbumsList] = useState<SimpleOption[]>([]);
  const [photosList, setPhotosList] = useState<SimpleOption[]>([]);
  const [todosList, setTodosList] = useState<SimpleOption[]>([]);
  const [productsList, setProductsList] = useState<SimpleOption[]>([]);
  const [notificationsList, setNotificationsList] = useState<SimpleOption[]>(
    [],
  );
  const [countriesList, setCountriesList] = useState<SimpleOption[]>([]);
  const [userId, setUserId] = useState("");
  const [postId, setPostId] = useState("");
  const [commentId, setCommentId] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [photoId, setPhotoId] = useState("");
  const [todoId, setTodoId] = useState("");
  const [productId, setProductId] = useState("");
  const [notificationId, setNotificationId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [method, setMethod] = useState<HttpMethod>("GET");
  const [path, setPath] = useState("/api/users?limit=12");
  const [body, setBody] = useState("");
  const [manual, setManual] = useState(false);
  const [forceStatus, setForceStatus] = useState<number | "">("");
  const [forceDelay, setForceDelay] = useState<number | "">("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [sort, setSort] = useState("");
  const [order, setOrder] = useState<"asc" | "desc" | "">("");
  const [queryLang, setQueryLang] = useState<"en" | "fa">("en");
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const methodMenuRef = useRef<HTMLDivElement>(null);

  const [token, setToken] = useState("");
  const [tokenEditable, setTokenEditable] = useState(false);
  const [responsesByResource, setResponsesByResource] = useState<
    Partial<Record<ResourceId, ResponseSnap>>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [apiLocale, setApiLocale] = useState<ApiLocale>("en");

  const responseSnap = responsesByResource[resource] ?? EMPTY_RESPONSE;
  const responseText = responseSnap.text;
  const status = responseSnap.status;
  const ms = responseSnap.ms;
  const lastUrl = responseSnap.lastUrl;
  const responseIsFa = responseSnap.isFa;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(API_LOCALE_STORAGE_KEY);
      const next = stored === "fa" ? "fa" : "en";
      setApiLocale(next);
      setQueryLang(next);
    } catch {
      setApiLocale("en");
      setQueryLang("en");
    }
    // Drop legacy cookie so direct /api/* navigation stays English.
    document.cookie =
      "mockdata-api-locale=; path=/; max-age=0; SameSite=Lax";
    function onLocale(e: Event) {
      const detail = (e as CustomEvent<ApiLocale>).detail;
      if (detail === "fa" || detail === "en") {
        setApiLocale(detail);
        setQueryLang(detail);
      }
    }
    window.addEventListener(API_LOCALE_EVENT, onLocale);
    return () => window.removeEventListener(API_LOCALE_EVENT, onLocale);
  }, []);

  useEffect(() => {
    if (!methodOpen) return;
    function onPointerDown(e: MouseEvent) {
      if (!methodMenuRef.current?.contains(e.target as Node)) {
        setMethodOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMethodOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [methodOpen]);

  const selectedUser = useMemo(
    () => users.find((u) => u.id === userId) ?? users[0] ?? null,
    [users, userId],
  );
  const selectedPost = useMemo(
    () => posts.find((p) => p.id === postId) ?? posts[0] ?? null,
    [posts, postId],
  );
  const selectedComment = useMemo(
    () => comments.find((c) => c.id === commentId) ?? comments[0] ?? null,
    [comments, commentId],
  );
  const selectedAlbum = useMemo(
    () => albumsList.find((a) => a.id === albumId) ?? albumsList[0] ?? null,
    [albumsList, albumId],
  );
  const selectedPhoto = useMemo(
    () => photosList.find((p) => p.id === photoId) ?? photosList[0] ?? null,
    [photosList, photoId],
  );
  const selectedTodo = useMemo(
    () => todosList.find((t) => t.id === todoId) ?? todosList[0] ?? null,
    [todosList, todoId],
  );
  const selectedProduct = useMemo(
    () =>
      productsList.find((p) => p.id === productId) ?? productsList[0] ?? null,
    [productsList, productId],
  );
  const selectedNotification = useMemo(
    () =>
      notificationsList.find((n) => n.id === notificationId) ??
      notificationsList[0] ??
      null,
    [notificationsList, notificationId],
  );
  const selectedCountry = useMemo(
    () =>
      countriesList.find((c) => c.id === countryId) ?? countriesList[0] ?? null,
    [countriesList, countryId],
  );

  const actions =
    resource === "auth" ? authActions : crudActions;

  const needsBody = method === "POST" || method === "PATCH";
  const isList =
    action === "list" &&
    (resource === "users" ||
      resource === "posts" ||
      resource === "comments" ||
      resource === "albums" ||
      resource === "photos" ||
      resource === "todos" ||
      resource === "products" ||
      resource === "notifications" ||
      resource === "countries");
  const needsRecord =
    resource === "auth"
      ? action === "login"
      : (resource === "posts" ||
            resource === "comments" ||
            resource === "albums" ||
            resource === "todos" ||
            resource === "notifications") &&
          action === "create"
        ? true
        : action === "get" || action === "update" || action === "delete";

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("mockdata-playground-token");
      if (saved) setToken(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      if (token) sessionStorage.setItem("mockdata-playground-token", token);
      else sessionStorage.removeItem("mockdata-playground-token");
    } catch {
      /* ignore */
    }
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    setLoadingOptions(true);

    const needUsers =
      resource === "auth" ||
      resource === "users" ||
      resource === "posts" ||
      resource === "albums" ||
      resource === "todos" ||
      resource === "notifications";
    const needPosts = resource === "posts" || resource === "comments";
    const needComments = resource === "comments";
    const needAlbums = resource === "albums" || resource === "photos";
    const needPhotos = resource === "photos";
    const needTodos = resource === "todos";
    const needProducts = resource === "products";
    const needNotifications = resource === "notifications";
    const needCountries = resource === "countries";

    async function loadJson(url: string) {
      const withLang =
        apiLocale === "fa" ? withQuery(url, { lang: "fa" }) : url;
      const res = await fetch(withLang);
      if (!res.ok) throw new Error(`Failed ${withLang}`);
      return res.json();
    }

    (async () => {
      try {
        // Load only what this resource needs, one request at a time —
        // avoids Neon connection timeouts from 9 parallel API hits.
        if (needUsers) {
          const payload = await loadJson(
            "/api/users?limit=30&sort=name&order=asc",
          );
          if (cancelled) return;
          const nextUsers = (payload.data ?? []) as UserOption[];
          setUsers(nextUsers);
          if (nextUsers[0]) setUserId((id) => id || nextUsers[0]!.id);
        }
        if (needPosts) {
          const payload = await loadJson(
            "/api/posts?limit=30&sort=title&order=asc",
          );
          if (cancelled) return;
          const nextPosts = (payload.data ?? []) as PostOption[];
          setPosts(nextPosts);
          if (nextPosts[0]) setPostId((id) => id || nextPosts[0]!.id);
        }
        if (needComments) {
          const payload = await loadJson(
            "/api/comments?limit=30&sort=name&order=asc",
          );
          if (cancelled) return;
          const nextComments = (
            (payload.data ?? []) as { id: string; name: string }[]
          ).map((c) => ({ id: c.id, label: c.name }));
          setComments(nextComments);
          if (nextComments[0]) setCommentId((id) => id || nextComments[0]!.id);
        }
        if (needAlbums) {
          const payload = await loadJson(
            "/api/albums?limit=30&sort=id&order=asc",
          );
          if (cancelled) return;
          const nextAlbums = (
            (payload.data ?? []) as { id: number; title: string }[]
          ).map((a) => ({ id: String(a.id), label: a.title }));
          setAlbumsList(nextAlbums);
          if (nextAlbums[0]) setAlbumId((id) => id || nextAlbums[0]!.id);
        }
        if (needPhotos) {
          const payload = await loadJson(
            "/api/photos?limit=30&sort=title&order=asc",
          );
          if (cancelled) return;
          const nextPhotos = (
            (payload.data ?? []) as { id: string; title: string }[]
          ).map((p) => ({ id: p.id, label: p.title }));
          setPhotosList(nextPhotos);
          if (nextPhotos[0]) setPhotoId((id) => id || nextPhotos[0]!.id);
        }
        if (needTodos) {
          const payload = await loadJson(
            "/api/todos?limit=30&sort=title&order=asc",
          );
          if (cancelled) return;
          const nextTodos = (
            (payload.data ?? []) as { id: string; title: string }[]
          ).map((t) => ({ id: t.id, label: t.title }));
          setTodosList(nextTodos);
          if (nextTodos[0]) setTodoId((id) => id || nextTodos[0]!.id);
        }
        if (needProducts) {
          const payload = await loadJson(
            "/api/products?limit=30&sort=name&order=asc",
          );
          if (cancelled) return;
          const nextProducts = (
            (payload.data ?? []) as { id: string; name: string }[]
          ).map((p) => ({ id: p.id, label: p.name }));
          setProductsList(nextProducts);
          if (nextProducts[0]) setProductId((id) => id || nextProducts[0]!.id);
        }
        if (needNotifications) {
          const payload = await loadJson(
            "/api/notifications?limit=30&sort=title&order=asc",
          );
          if (cancelled) return;
          const nextNotifications = (
            (payload.data ?? []) as { id: string; title: string }[]
          ).map((n) => ({ id: n.id, label: n.title }));
          setNotificationsList(nextNotifications);
          if (nextNotifications[0]) {
            setNotificationId((id) => id || nextNotifications[0]!.id);
          }
        }
        if (needCountries) {
          const payload = await loadJson(
            "/api/countries?limit=30&sort=name&order=asc",
          );
          if (cancelled) return;
          const nextCountries = (
            (payload.data ?? []) as {
              id: string;
              name: string;
              code: string;
            }[]
          ).map((c) => ({ id: c.id, label: `${c.name} (${c.code})` }));
          setCountriesList(nextCountries);
          if (nextCountries[0]) {
            setCountryId((id) => id || nextCountries[0]!.id);
          }
        }
      } catch {
        if (!cancelled) setError(dict.playground.loadError);
      } finally {
        if (!cancelled) setLoadingOptions(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [resource, apiLocale]);

  useEffect(() => {
    if (manual) return;
    const built = buildRequest({
      resource,
      action,
      user: selectedUser,
      post: selectedPost,
      comment: selectedComment,
      album: selectedAlbum,
      photo: selectedPhoto,
      todo: selectedTodo,
      product: selectedProduct,
      notification: selectedNotification,
      country: selectedCountry,
      loginOk,
    });
    setMethod(built.method);
    const resolvedLang = queryLang === "fa" ? "fa" : undefined;
    setPath(
      withQuery(built.path, {
        ...(isList
          ? {
              page: page > 1 ? page : undefined,
              limit,
              search: search.trim() || undefined,
              role: role || undefined,
              country: countryFilter.trim() || undefined,
              sort: sort || undefined,
              order: order || undefined,
            }
          : {}),
        delay: forceDelay,
        status: forceStatus,
        lang: resolvedLang,
      }),
    );
    setBody(built.body);
  }, [
    resource,
    action,
    selectedUser,
    selectedPost,
    selectedComment,
    selectedAlbum,
    selectedPhoto,
    selectedTodo,
    selectedProduct,
    selectedNotification,
    selectedCountry,
    loginOk,
    isList,
    page,
    limit,
    search,
    role,
    countryFilter,
    sort,
    order,
    queryLang,
    forceDelay,
    forceStatus,
    apiLocale,
    manual,
  ]);

  const statusTone = useMemo(() => {
    if (status == null) return "text-muted-foreground";
    if (status >= 200 && status < 300) return "text-[var(--get)]";
    if (status >= 400) return "text-[var(--delete)]";
    return "text-[var(--patch)]";
  }, [status]);

  const absoluteLastUrl = useMemo(() => {
    if (!lastUrl) return null;
    const path = lastUrl.startsWith("http")
      ? lastUrl
      : `${typeof window !== "undefined" ? window.location.origin : ""}${lastUrl.startsWith("/") ? lastUrl : `/${lastUrl}`}`;
    return path;
  }, [lastUrl]);

  function switchResource(next: ResourceId) {
    setResource(next);
    setAction(next === "auth" ? "login" : "list");
    setManual(false);
    setError(null);
    setOptionsOpen(false);
    setMethodOpen(false);
  }

  function switchAction(next: ActionId) {
    setAction(next);
    setManual(false);
    setError(null);
  }

  function send() {
    setError(null);
    const requestUrl = path.trim();
    const resourceKey = resource;
    startTransition(async () => {
      const started = performance.now();
      try {
        const headers: Record<string, string> = {
          Accept: "application/json",
        };
        if (needsBody) headers["Content-Type"] = "application/json";
        if (token.trim()) {
          headers.Authorization = `Bearer ${token.trim()}`;
        }

        const res = await fetch(requestUrl, {
          method,
          headers,
          body: needsBody && body.trim() ? body : undefined,
        });

        const elapsed = Math.round(performance.now() - started);
        const text = await res.text();
        let pretty = text;
        try {
          pretty = JSON.stringify(JSON.parse(text), null, 2);
        } catch {
          /* keep raw */
        }

        const isFa =
          res.headers.get("content-language") === "fa" ||
          /"font"\s*:/.test(pretty);

        setResponsesByResource((prev) => ({
          ...prev,
          [resourceKey]: {
            text: pretty || "(empty body)",
            status: res.status,
            ms: elapsed,
            lastUrl: requestUrl,
            isFa,
          },
        }));

        if (requestUrl.includes("/api/auth/login") && res.ok) {
          try {
            const parsed = JSON.parse(text) as { data?: { token?: string } };
            if (parsed.data?.token) setToken(parsed.data.token);
          } catch {
            /* ignore */
          }
        }

        // Refresh pickers after mutating records
        if (
          res.ok &&
          (action === "create" || action === "update" || action === "delete") &&
          resourceKey !== "auth"
        ) {
          const listUrls: Partial<Record<ResourceId, string>> = {
            users: "/api/users?limit=50&sort=name&order=asc",
            posts: "/api/posts?limit=50&sort=title&order=asc",
            comments: "/api/comments?limit=50&sort=name&order=asc",
            albums: "/api/albums?limit=50&sort=id&order=asc",
            photos: "/api/photos?limit=50&sort=title&order=asc",
            todos: "/api/todos?limit=50&sort=title&order=asc",
            products: "/api/products?limit=50&sort=name&order=asc",
            notifications: "/api/notifications?limit=50&sort=title&order=asc",
            countries: "/api/countries?limit=50&sort=name&order=asc",
          };
          const listUrl = listUrls[resourceKey];
          if (listUrl) {
            const listRes = await fetch(listUrl);
            const payload = await listRes.json();
            const rows = (payload.data ?? []) as Record<string, unknown>[];
            if (resourceKey === "users") {
              const next = rows as unknown as UserOption[];
              setUsers(next);
              if (!next.some((u) => u.id === userId) && next[0]) setUserId(next[0].id);
            } else if (resourceKey === "posts") {
              const next = rows as unknown as PostOption[];
              setPosts(next);
              if (!next.some((p) => p.id === postId) && next[0]) setPostId(next[0].id);
            } else if (resourceKey === "comments") {
              const next = rows.map((c) => ({
                id: String(c.id),
                label: String(c.name ?? c.id),
              }));
              setComments(next);
              if (!next.some((c) => c.id === commentId) && next[0]) {
                setCommentId(next[0].id);
              }
            } else if (resourceKey === "albums") {
              const next = rows.map((a) => ({
                id: String(a.id),
                label: String(a.title ?? a.id),
              }));
              setAlbumsList(next);
              if (!next.some((a) => a.id === albumId) && next[0]) {
                setAlbumId(next[0].id);
              }
            } else if (resourceKey === "photos") {
              const next = rows.map((p) => ({
                id: String(p.id),
                label: String(p.title ?? p.id),
              }));
              setPhotosList(next);
              if (!next.some((p) => p.id === photoId) && next[0]) {
                setPhotoId(next[0].id);
              }
            } else if (resourceKey === "todos") {
              const next = rows.map((t) => ({
                id: String(t.id),
                label: String(t.title ?? t.id),
              }));
              setTodosList(next);
              if (!next.some((t) => t.id === todoId) && next[0]) {
                setTodoId(next[0].id);
              }
            } else if (resourceKey === "products") {
              const next = rows.map((p) => ({
                id: String(p.id),
                label: String(p.name ?? p.id),
              }));
              setProductsList(next);
              if (!next.some((p) => p.id === productId) && next[0]) {
                setProductId(next[0].id);
              }
            } else if (resourceKey === "notifications") {
              const next = rows.map((n) => ({
                id: String(n.id),
                label: String(n.title ?? n.id),
              }));
              setNotificationsList(next);
              if (!next.some((n) => n.id === notificationId) && next[0]) {
                setNotificationId(next[0].id);
              }
            } else if (resourceKey === "countries") {
              const next = rows.map((c) => ({
                id: String(c.id),
                label: `${String(c.name ?? c.id)}${c.code ? ` (${String(c.code)})` : ""}`,
              }));
              setCountriesList(next);
              if (!next.some((c) => c.id === countryId) && next[0]) {
                setCountryId(next[0].id);
              }
            }
          }
        }
      } catch (err) {
        setResponsesByResource((prev) => ({
          ...prev,
          [resourceKey]: {
            text: "// Request failed",
            status: null,
            ms: null,
            lastUrl: requestUrl,
            isFa: false,
          },
        }));
        setError(err instanceof Error ? err.message : "Request failed");
      }
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2.5 sm:px-4">
        <span
          className={cn(
            "text-[11px] tracking-wide text-muted-foreground",
            uiLocale === "fa"
              ? "font-fa-label font-medium"
              : "font-mono tracking-[0.14em] uppercase",
          )}
        >
          {dict.playground.resource}
        </span>
        <div
          className="flex flex-wrap gap-1.5"
          role="tablist"
          aria-label={dict.playground.resource}
        >
          {resources.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={resource === item.id}
              onClick={() => switchResource(item.id)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors",
                uiLocale === "fa" && "font-fa-label",
                resource === item.id
                  ? "border-[var(--request)]/45 bg-[var(--request)]/15 text-foreground"
                  : "border-border text-muted-foreground hover:border-[var(--request)]/35 hover:text-foreground",
              )}
            >
              {dict.catalog[item.id]?.title ?? item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-b border-border p-3 sm:p-4" dir="ltr">
        <div className="space-y-1.5">
          <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            Action
          </p>
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Action">
            {actions.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={action === item.id}
                onClick={() => switchAction(item.id)}
                className={cn(
                  "rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors",
                  methodColor[item.method],
                  action === item.id
                    ? "border-[var(--request)]/45 bg-[var(--request)]/15"
                    : "border-border hover:border-[var(--request)]/35",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {needsRecord ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {resource === "posts" && action === "create" ? (
              <div className="space-y-1.5">
                <label
                  htmlFor="playground-post-author"
                  className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                >
                  Author
                </label>
                <select
                  id="playground-post-author"
                  value={selectedUser?.id ?? ""}
                  disabled={loadingOptions || users.length === 0}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setManual(false);
                  }}
                  className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 text-[13px] outline-none focus-visible:border-[var(--request)]/50"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} · @{user.username}
                    </option>
                  ))}
                </select>
              </div>
            ) : resource === "comments" && action === "create" ? (
              <div className="space-y-1.5">
                <label
                  htmlFor="playground-comment-post"
                  className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                >
                  Post
                </label>
                <select
                  id="playground-comment-post"
                  value={selectedPost?.id ?? ""}
                  disabled={loadingOptions || posts.length === 0}
                  onChange={(e) => {
                    setPostId(e.target.value);
                    setManual(false);
                  }}
                  className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 text-[13px] outline-none focus-visible:border-[var(--request)]/50"
                >
                  {posts.map((post) => (
                    <option key={post.id} value={post.id}>
                      {post.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : resource === "albums" && action === "create" ? (
              <div className="space-y-1.5">
                <label
                  htmlFor="playground-album-user"
                  className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                >
                  User
                </label>
                <select
                  id="playground-album-user"
                  value={selectedUser?.id ?? ""}
                  disabled={loadingOptions || users.length === 0}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setManual(false);
                  }}
                  className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 text-[13px] outline-none focus-visible:border-[var(--request)]/50"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} · @{user.username}
                    </option>
                  ))}
                </select>
              </div>
            ) : resource === "todos" && action === "create" ? (
              <div className="space-y-1.5">
                <label
                  htmlFor="playground-todo-user"
                  className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                >
                  User
                </label>
                <select
                  id="playground-todo-user"
                  value={selectedUser?.id ?? ""}
                  disabled={loadingOptions || users.length === 0}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setManual(false);
                  }}
                  className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 text-[13px] outline-none focus-visible:border-[var(--request)]/50"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} · @{user.username}
                    </option>
                  ))}
                </select>
              </div>
            ) : resource === "notifications" && action === "create" ? (
              <div className="space-y-1.5">
                <label
                  htmlFor="playground-notification-user"
                  className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                >
                  User
                </label>
                <select
                  id="playground-notification-user"
                  value={selectedUser?.id ?? ""}
                  disabled={loadingOptions || users.length === 0}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setManual(false);
                  }}
                  className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 text-[13px] outline-none focus-visible:border-[var(--request)]/50"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} · @{user.username}
                    </option>
                  ))}
                </select>
              </div>
            ) : resource === "posts" ? (
              <div className="space-y-1.5">
                <label
                  htmlFor="playground-post"
                  className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                >
                  Post
                </label>
                <select
                  id="playground-post"
                  value={selectedPost?.id ?? ""}
                  disabled={loadingOptions || posts.length === 0}
                  onChange={(e) => {
                    setPostId(e.target.value);
                    setManual(false);
                  }}
                  className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 text-[13px] outline-none focus-visible:border-[var(--request)]/50"
                >
                  {posts.map((post) => (
                    <option key={post.id} value={post.id}>
                      {post.title}
                      {post.published ? "" : " · draft"}
                    </option>
                  ))}
                </select>
              </div>
            ) : resource === "comments" ? (
              <div className="space-y-1.5">
                <label
                  htmlFor="playground-comment"
                  className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                >
                  Comment
                </label>
                <select
                  id="playground-comment"
                  value={selectedComment?.id ?? ""}
                  disabled={loadingOptions || comments.length === 0}
                  onChange={(e) => {
                    setCommentId(e.target.value);
                    setManual(false);
                  }}
                  className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 text-[13px] outline-none focus-visible:border-[var(--request)]/50"
                >
                  {comments.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : resource === "albums" ? (
              <div className="space-y-1.5">
                <label
                  htmlFor="playground-album"
                  className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                >
                  Album
                </label>
                <select
                  id="playground-album"
                  value={selectedAlbum?.id ?? ""}
                  disabled={loadingOptions || albumsList.length === 0}
                  onChange={(e) => {
                    setAlbumId(e.target.value);
                    setManual(false);
                  }}
                  className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 text-[13px] outline-none focus-visible:border-[var(--request)]/50"
                >
                  {albumsList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : resource === "photos" ? (
              <div className="space-y-1.5">
                <label
                  htmlFor="playground-photo"
                  className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                >
                  Photo
                </label>
                <select
                  id="playground-photo"
                  value={selectedPhoto?.id ?? ""}
                  disabled={loadingOptions || photosList.length === 0}
                  onChange={(e) => {
                    setPhotoId(e.target.value);
                    setManual(false);
                  }}
                  className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 text-[13px] outline-none focus-visible:border-[var(--request)]/50"
                >
                  {photosList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : resource === "todos" ? (
              <div className="space-y-1.5">
                <label
                  htmlFor="playground-todo"
                  className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                >
                  Todo
                </label>
                <select
                  id="playground-todo"
                  value={selectedTodo?.id ?? ""}
                  disabled={loadingOptions || todosList.length === 0}
                  onChange={(e) => {
                    setTodoId(e.target.value);
                    setManual(false);
                  }}
                  className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 text-[13px] outline-none focus-visible:border-[var(--request)]/50"
                >
                  {todosList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : resource === "products" ? (
              <div className="space-y-1.5">
                <label
                  htmlFor="playground-product"
                  className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                >
                  Product
                </label>
                <select
                  id="playground-product"
                  value={selectedProduct?.id ?? ""}
                  disabled={loadingOptions || productsList.length === 0}
                  onChange={(e) => {
                    setProductId(e.target.value);
                    setManual(false);
                  }}
                  className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 text-[13px] outline-none focus-visible:border-[var(--request)]/50"
                >
                  {productsList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : resource === "notifications" ? (
              <div className="space-y-1.5">
                <label
                  htmlFor="playground-notification"
                  className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                >
                  Notification
                </label>
                <select
                  id="playground-notification"
                  value={selectedNotification?.id ?? ""}
                  disabled={loadingOptions || notificationsList.length === 0}
                  onChange={(e) => {
                    setNotificationId(e.target.value);
                    setManual(false);
                  }}
                  className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 text-[13px] outline-none focus-visible:border-[var(--request)]/50"
                >
                  {notificationsList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : resource === "countries" ? (
              <div className="space-y-1.5">
                <label
                  htmlFor="playground-country"
                  className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                >
                  Country
                </label>
                <select
                  id="playground-country"
                  value={selectedCountry?.id ?? ""}
                  disabled={loadingOptions || countriesList.length === 0}
                  onChange={(e) => {
                    setCountryId(e.target.value);
                    setManual(false);
                  }}
                  className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 text-[13px] outline-none focus-visible:border-[var(--request)]/50"
                >
                  {countriesList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label
                  htmlFor="playground-user"
                  className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                >
                  User
                </label>
                <select
                  id="playground-user"
                  value={selectedUser?.id ?? ""}
                  disabled={loadingOptions || users.length === 0}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setManual(false);
                  }}
                  className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 text-[13px] outline-none focus-visible:border-[var(--request)]/50"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} · @{user.username}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {resource === "auth" && action === "login" ? (
              <div className="space-y-1.5">
                <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                  Password
                </p>
                <div className="flex h-9 overflow-hidden rounded-md border border-border bg-muted p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginOk(true);
                      setManual(false);
                    }}
                    className={cn(
                      "flex-1 rounded px-2 font-mono text-[12px] transition-colors",
                      loginOk
                        ? "bg-[var(--get)]/20 font-semibold text-[var(--get)]"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginOk(false);
                      setManual(false);
                    }}
                    className={cn(
                      "flex-1 rounded px-2 font-mono text-[12px] transition-colors",
                      !loginOk
                        ? "bg-[var(--delete)]/20 font-semibold text-[var(--delete)]"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    wrong
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-end">
                <p className="pb-1.5 font-mono text-[11px] text-muted-foreground">
                  {loadingOptions ? "Loading…" : "Ready"}
                </p>
              </div>
            )}
          </div>
        ) : null}

        <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
          <div className="flex min-w-0 flex-1 items-stretch gap-2">
            <div ref={methodMenuRef} className="relative shrink-0">
              <label className="sr-only" htmlFor="playground-method">
                Method
              </label>
              <button
                id="playground-method"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={methodOpen}
                onClick={() => setMethodOpen((open) => !open)}
                className={cn(
                  "inline-flex h-11 min-h-11 w-[5.75rem] items-center justify-between gap-1 rounded-md border border-border bg-muted px-2.5 font-mono text-[13px] font-semibold outline-none focus-visible:border-[var(--request)]/50",
                  methodColor[method],
                )}
              >
                {method}
                <ChevronDown
                  className={cn(
                    "size-3.5 shrink-0 text-muted-foreground transition-transform",
                    methodOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
              {methodOpen ? (
                <ul
                  role="listbox"
                  aria-label="HTTP method"
                  className="absolute top-[calc(100%+4px)] start-0 z-30 min-w-full overflow-hidden rounded-md border border-border bg-card py-1 shadow-lg"
                >
                  {methods.map((m) => (
                    <li key={m} role="option" aria-selected={method === m}>
                      <button
                        type="button"
                        onClick={() => {
                          setMethod(m);
                          setManual(true);
                          setMethodOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center px-3 py-2 font-mono text-[13px] font-semibold transition-colors hover:bg-[var(--surface-hover)]",
                          methodColor[m],
                          method === m && "bg-[var(--surface-hover)]",
                        )}
                      >
                        {m}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <label className="sr-only" htmlFor="playground-path">
              Path
            </label>
            <input
              id="playground-path"
              value={path}
              onChange={(e) => {
                setPath(e.target.value);
                setManual(true);
              }}
              spellCheck={false}
              className="box-border h-11 min-h-11 min-w-0 flex-1 rounded-md border border-border bg-muted px-3 font-mono text-[13px] leading-none text-foreground outline-none focus-visible:border-[var(--request)]/50 ltr-tech"
              placeholder="/api/users"
              dir="ltr"
            />
          </div>

          <div className="flex shrink-0 items-stretch gap-2">
            <button
              type="button"
              onClick={() => setOptionsOpen((open) => !open)}
              aria-expanded={optionsOpen}
              aria-label={optionsOpen ? "Hide options" : "Show options"}
              title="Options"
              className="inline-flex h-11 min-h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground"
            >
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform",
                  optionsOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>

            <button
              type="button"
              onClick={send}
              disabled={pending || !path.trim()}
              className="h-11 min-h-11 flex-1 rounded-md bg-[var(--request)] px-4 text-[13px] font-semibold text-white transition-opacity disabled:opacity-50 md:w-[6.5rem] md:flex-none"
            >
              {pending ? "Sending…" : "Send"}
            </button>
          </div>
        </div>

        {optionsOpen ? (
          <div className="space-y-3 rounded-md border border-border p-3" dir="ltr">
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              Query params
            </p>

            {isList ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="playground-page"
                    className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                  >
                    page
                  </label>
                  <div className="flex h-9 overflow-hidden rounded-md border border-border bg-muted">
                    <button
                      type="button"
                      aria-label="Previous page"
                      disabled={page <= 1}
                      onClick={() => {
                        setPage((p) => Math.max(1, p - 1));
                        setManual(false);
                      }}
                      className="grid w-9 shrink-0 place-items-center text-muted-foreground transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground disabled:opacity-40"
                    >
                      −
                    </button>
                    <select
                      id="playground-page"
                      value={String(page)}
                      onChange={(e) => {
                        setPage(Number(e.target.value));
                        setManual(false);
                      }}
                      className="h-full min-w-0 flex-1 cursor-pointer border-x border-border bg-transparent px-2 text-center font-mono text-[12px] outline-none"
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      aria-label="Next page"
                      disabled={page >= 20}
                      onClick={() => {
                        setPage((p) => Math.min(20, p + 1));
                        setManual(false);
                      }}
                      className="grid w-9 shrink-0 place-items-center text-muted-foreground transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="playground-limit"
                    className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                  >
                    limit
                  </label>
                  <select
                    id="playground-limit"
                    value={String(limit)}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setManual(false);
                    }}
                    className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 font-mono text-[12px] outline-none focus-visible:border-[var(--request)]/50"
                  >
                    {[3, 6, 12, 24, 50].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="playground-search"
                    className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                  >
                    search
                  </label>
                  <input
                    id="playground-search"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setManual(false);
                    }}
                    spellCheck={false}
                    className="h-9 w-full rounded-md border border-border bg-muted px-2.5 font-mono text-[12px] outline-none focus-visible:border-[var(--request)]/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="playground-role"
                    className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                  >
                    role
                  </label>
                  <select
                    id="playground-role"
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setManual(false);
                    }}
                    className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 font-mono text-[12px] outline-none focus-visible:border-[var(--request)]/50"
                  >
                    <option value="">Off</option>
                    <option value="admin">admin</option>
                    <option value="member">member</option>
                    <option value="guest">guest</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="playground-country-filter"
                    className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                  >
                    country
                  </label>
                  <input
                    id="playground-country-filter"
                    value={countryFilter}
                    onChange={(e) => {
                      setCountryFilter(e.target.value);
                      setManual(false);
                    }}
                    spellCheck={false}
                    className="h-9 w-full rounded-md border border-border bg-muted px-2.5 font-mono text-[12px] outline-none focus-visible:border-[var(--request)]/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="playground-sort"
                    className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                  >
                    sort
                  </label>
                  <select
                    id="playground-sort"
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setManual(false);
                    }}
                    className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 font-mono text-[12px] outline-none focus-visible:border-[var(--request)]/50"
                  >
                    <option value="">Off</option>
                    <option value="createdAt">createdAt</option>
                    <option value="name">name</option>
                    <option value="username">username</option>
                    <option value="title">title</option>
                    <option value="id">id</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="playground-order"
                    className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                  >
                    order
                  </label>
                  <select
                    id="playground-order"
                    value={order}
                    onChange={(e) => {
                      setOrder(e.target.value as "asc" | "desc" | "");
                      setManual(false);
                    }}
                    className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 font-mono text-[12px] outline-none focus-visible:border-[var(--request)]/50"
                  >
                    <option value="">Off</option>
                    <option value="asc">asc</option>
                    <option value="desc">desc</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="playground-lang"
                    className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                  >
                    lang
                  </label>
                  <select
                    id="playground-lang"
                    value={queryLang}
                    onChange={(e) => {
                      setQueryLang(e.target.value as "en" | "fa");
                      setManual(false);
                    }}
                    className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 font-mono text-[12px] outline-none focus-visible:border-[var(--request)]/50"
                  >
                    {queryLang === "fa" ? (
                      <>
                        <option value="fa">fa</option>
                        <option value="en">en</option>
                      </>
                    ) : (
                      <>
                        <option value="en">en</option>
                        <option value="fa">fa</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="playground-force-delay"
                    className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                  >
                    delay
                  </label>
                  <select
                    id="playground-force-delay"
                    value={forceDelay === "" ? "" : String(forceDelay)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForceDelay(value ? Number(value) : "");
                      setManual(false);
                    }}
                    className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 font-mono text-[12px] outline-none focus-visible:border-[var(--request)]/50"
                  >
                    <option value="">Off</option>
                    <option value="300">300</option>
                    <option value="800">800</option>
                    <option value="1500">1500</option>
                    <option value="3000">3000</option>
                    <option value="5000">5000</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="playground-force-status"
                    className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                  >
                    status
                  </label>
                  <select
                    id="playground-force-status"
                    value={forceStatus === "" ? "" : String(forceStatus)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForceStatus(value ? Number(value) : "");
                      setManual(false);
                    }}
                    className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 font-mono text-[12px] outline-none focus-visible:border-[var(--request)]/50"
                  >
                    <option value="">Off</option>
                    <option value="400">400</option>
                    <option value="401">401</option>
                    <option value="403">403</option>
                    <option value="404">404</option>
                    <option value="429">429</option>
                    <option value="500">500</option>
                    <option value="503">503</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
                  <label
                    htmlFor="playground-token"
                    className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                  >
                    token
                  </label>
                  <div
                    className={cn(
                      "flex h-9 overflow-hidden rounded-md border",
                      tokenEditable
                        ? "border-[var(--request)]/50 bg-background"
                        : "border-border bg-muted/70",
                    )}
                  >
                    <input
                      id="playground-token"
                      value={token}
                      readOnly={!tokenEditable}
                      onChange={(e) => setToken(e.target.value)}
                      spellCheck={false}
                      className={cn(
                        "min-w-0 flex-1 truncate bg-transparent px-2.5 font-mono text-[12px] outline-none",
                        tokenEditable
                          ? "text-foreground"
                          : "cursor-default text-muted-foreground/70",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setTokenEditable((v) => !v)}
                      aria-pressed={tokenEditable}
                      aria-label={tokenEditable ? "Lock token" : "Edit token"}
                      className={cn(
                        "inline-flex size-9 shrink-0 items-center justify-center border-s transition-colors",
                        tokenEditable
                          ? "border-[var(--request)]/40 bg-[var(--request)]/15 text-[var(--request)]"
                          : "border-border text-muted-foreground hover:bg-[var(--surface-hover)] hover:text-foreground",
                      )}
                    >
                      {tokenEditable ? (
                        <Lock className="size-3.5" aria-hidden />
                      ) : (
                        <Pencil className="size-3.5" aria-hidden />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="playground-lang"
                    className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                  >
                    lang
                  </label>
                  <select
                    id="playground-lang"
                    value={queryLang}
                    onChange={(e) => {
                      setQueryLang(e.target.value as "en" | "fa");
                      setManual(false);
                    }}
                    className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 font-mono text-[12px] outline-none focus-visible:border-[var(--request)]/50"
                  >
                    {queryLang === "fa" ? (
                      <>
                        <option value="fa">fa</option>
                        <option value="en">en</option>
                      </>
                    ) : (
                      <>
                        <option value="en">en</option>
                        <option value="fa">fa</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="playground-force-delay"
                    className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                  >
                    delay
                  </label>
                  <select
                    id="playground-force-delay"
                    value={forceDelay === "" ? "" : String(forceDelay)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForceDelay(value ? Number(value) : "");
                      setManual(false);
                    }}
                    className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 font-mono text-[12px] outline-none focus-visible:border-[var(--request)]/50"
                  >
                    <option value="">Off</option>
                    <option value="300">300</option>
                    <option value="800">800</option>
                    <option value="1500">1500</option>
                    <option value="3000">3000</option>
                    <option value="5000">5000</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="playground-force-status"
                    className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                  >
                    status
                  </label>
                  <select
                    id="playground-force-status"
                    value={forceStatus === "" ? "" : String(forceStatus)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForceStatus(value ? Number(value) : "");
                      setManual(false);
                    }}
                    className="h-9 w-full cursor-pointer rounded-md border border-border bg-muted px-2.5 font-mono text-[12px] outline-none focus-visible:border-[var(--request)]/50"
                  >
                    <option value="">Off</option>
                    <option value="400">400</option>
                    <option value="401">401</option>
                    <option value="403">403</option>
                    <option value="404">404</option>
                    <option value="429">429</option>
                    <option value="500">500</option>
                    <option value="503">503</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="playground-token"
                    className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                  >
                    token
                  </label>
                  <div
                    className={cn(
                      "flex h-9 overflow-hidden rounded-md border",
                      tokenEditable
                        ? "border-[var(--request)]/50 bg-background"
                        : "border-border bg-muted/70",
                    )}
                  >
                    <input
                      id="playground-token"
                      value={token}
                      readOnly={!tokenEditable}
                      onChange={(e) => setToken(e.target.value)}
                      spellCheck={false}
                      className={cn(
                        "min-w-0 flex-1 truncate bg-transparent px-2.5 font-mono text-[12px] outline-none",
                        tokenEditable
                          ? "text-foreground"
                          : "cursor-default text-muted-foreground/70",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setTokenEditable((v) => !v)}
                      aria-pressed={tokenEditable}
                      aria-label={tokenEditable ? "Lock token" : "Edit token"}
                      className={cn(
                        "inline-flex size-9 shrink-0 items-center justify-center border-s transition-colors",
                        tokenEditable
                          ? "border-[var(--request)]/40 bg-[var(--request)]/15 text-[var(--request)]"
                          : "border-border text-muted-foreground hover:bg-[var(--surface-hover)] hover:text-foreground",
                      )}
                    >
                      {tokenEditable ? (
                        <Lock className="size-3.5" aria-hidden />
                      ) : (
                        <Pencil className="size-3.5" aria-hidden />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {needsBody ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="playground-body"
                className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
              >
                Body JSON
              </label>
              {manual ? (
                <button
                  type="button"
                  onClick={() => setManual(false)}
                  className="font-mono text-[10px] text-[var(--request)] hover:underline"
                >
                  Reset auto
                </button>
              ) : null}
            </div>
            <HighlightedJsonEditor
              id="playground-body"
              value={body}
              onChange={(next) => {
                setBody(next);
                setManual(true);
              }}
              rows={8}
            />
          </div>
        ) : null}

        {error ? (
          <p className="text-[13px] text-[var(--delete)]">{error}</p>
        ) : null}
      </div>

      <div className="bg-[var(--response-bg)] p-1" dir="ltr">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2 px-2 pt-1.5">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] font-semibold tracking-wide text-[var(--response)] uppercase">
              Response
            </span>
            <span
              className={cn("font-mono text-[12px] font-semibold", statusTone)}
            >
              {status == null ? "—" : status}
            </span>
            {ms != null ? (
              <span className="font-mono text-[11px] text-muted-foreground">
                {ms}ms
              </span>
            ) : null}
          </div>
          <CopyButton value={responseText} label="Copy response" />
        </div>
        {absoluteLastUrl ? (
          <div className="mb-1 flex min-w-0 items-center gap-2 px-2">
            <span className="shrink-0 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              Requested
            </span>
            <code
              className="min-w-0 truncate font-mono text-[11px] text-[var(--request)]"
              title={`${method} ${absoluteLastUrl}`}
            >
              <span className="font-semibold">{method}</span> {absoluteLastUrl}
            </code>
            <CopyButton value={absoluteLastUrl} label="Copy request URL" />
          </div>
        ) : null}
        <div className="code-pane overflow-hidden rounded-lg border border-[var(--vscode-border)] bg-[var(--vscode-bg)]">
          <pre
            className="code-scroll max-h-[420px] overflow-auto p-0 font-mono text-[12.5px] leading-6"
            dir="ltr"
          >
            <code className="grid min-w-0">
              {responseText.split("\n").map((line, index) => (
                <span key={index} className="flex min-w-0">
                  <span className="sticky left-0 w-10 shrink-0 select-none bg-[var(--vscode-bg)] pr-3 text-right text-[var(--vscode-line)]">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 break-all pr-4 whitespace-pre-wrap">
                    {highlightCode(line.length ? line : " ", "json", {
                      persianStrings: responseIsFa || apiLocale === "fa",
                    })}
                  </span>
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
