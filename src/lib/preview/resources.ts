export type PreviewFieldType = "text" | "textarea" | "number" | "boolean" | "select";

export type PreviewField = {
  key: string;
  label: string;
  type?: PreviewFieldType;
  required?: boolean;
  /** Show on create form */
  create?: boolean;
  /** Show on edit form */
  edit?: boolean;
  /** Show as table column */
  column?: boolean;
  options?: { value: string; label: string }[];
  /** Prefill from related list endpoint, e.g. users → id */
  relation?: { path: string; valueKey?: string };
};

export const previewResourceIds = [
  "users",
  "posts",
  "comments",
  "albums",
  "photos",
  "todos",
  "products",
  "notifications",
  "countries",
] as const;

export type PreviewResourceId = (typeof previewResourceIds)[number];

export type PreviewResourceConfig = {
  id: PreviewResourceId;
  title: string;
  basePath: string;
  /** Primary label field in the row */
  titleKey: string;
  /** Optional secondary line */
  subtitleKey?: string;
  /** Optional image URL field */
  imageKey?: string;
  sort?: string;
  order?: "asc" | "desc";
  fields: PreviewField[];
  sample: () => Record<string, unknown>;
};

function stamp() {
  return Date.now().toString(36).slice(-5);
}

export const previewResources: Record<PreviewResourceId, PreviewResourceConfig> =
  {
    users: {
      id: "users",
      title: "Users",
      basePath: "/api/users",
      titleKey: "name",
      subtitleKey: "email",
      imageKey: "avatarUrl",
      sort: "createdAt",
      order: "desc",
      fields: [
        { key: "name", label: "Name", required: true, create: true, edit: true, column: true },
        { key: "username", label: "Username", required: true, create: true, column: true },
        { key: "email", label: "Email", required: true, create: true },
        { key: "avatarUrl", label: "Avatar URL", required: true, create: true },
        {
          key: "role",
          label: "Role",
          type: "select",
          create: true,
          edit: true,
          column: true,
          options: [
            { value: "admin", label: "admin" },
            { value: "member", label: "member" },
            { value: "guest", label: "guest" },
          ],
        },
        { key: "city", label: "City", required: true, create: true, edit: true, column: true },
        { key: "country", label: "Country", required: true, create: true, edit: true },
        { key: "company", label: "Company", create: true, edit: true },
      ],
      sample: () => {
        const s = stamp();
        return {
          name: `User ${s}`,
          username: `user_${s}`,
          email: `user_${s}@example.com`,
          avatarUrl: `https://i.pravatar.cc/150?u=${s}`,
          role: "member",
          city: "Tehran",
          country: "Iran",
          company: "MockData Labs",
        };
      },
    },
    posts: {
      id: "posts",
      title: "Posts",
      basePath: "/api/posts",
      titleKey: "title",
      subtitleKey: "body",
      sort: "createdAt",
      order: "desc",
      fields: [
        {
          key: "userId",
          label: "User ID",
          required: true,
          create: true,
          edit: true,
          relation: { path: "/api/users?limit=1&order=asc" },
        },
        { key: "title", label: "Title", required: true, create: true, edit: true, column: true },
        {
          key: "body",
          label: "Body",
          type: "textarea",
          required: true,
          create: true,
          edit: true,
          column: true,
        },
        {
          key: "published",
          label: "Published",
          type: "boolean",
          create: true,
          edit: true,
          column: true,
        },
      ],
      sample: () => ({
        title: `Draft post ${stamp()}`,
        body: "Sample body for the MockData posts preview.",
        published: true,
        tags: ["preview", "demo"],
      }),
    },
    comments: {
      id: "comments",
      title: "Comments",
      basePath: "/api/comments",
      titleKey: "name",
      subtitleKey: "body",
      sort: "createdAt",
      order: "desc",
      fields: [
        {
          key: "postId",
          label: "Post ID",
          required: true,
          create: true,
          edit: true,
          relation: { path: "/api/posts?limit=1" },
        },
        { key: "name", label: "Name", required: true, create: true, edit: true, column: true },
        { key: "email", label: "Email", required: true, create: true, edit: true, column: true },
        {
          key: "body",
          label: "Body",
          type: "textarea",
          required: true,
          create: true,
          edit: true,
          column: true,
        },
      ],
      sample: () => {
        const s = stamp();
        return {
          name: `Commenter ${s}`,
          email: `c_${s}@example.com`,
          body: "Nice preview — thanks for the sample API.",
        };
      },
    },
    albums: {
      id: "albums",
      title: "Albums",
      basePath: "/api/albums",
      titleKey: "title",
      sort: "createdAt",
      order: "desc",
      fields: [
        {
          key: "userId",
          label: "User ID",
          required: true,
          create: true,
          edit: true,
          relation: { path: "/api/users?limit=1&order=asc" },
        },
        { key: "title", label: "Title", required: true, create: true, edit: true, column: true },
      ],
      sample: () => ({
        title: `Album ${stamp()}`,
      }),
    },
    photos: {
      id: "photos",
      title: "Photos",
      basePath: "/api/photos",
      titleKey: "title",
      imageKey: "thumbnailUrl",
      sort: "createdAt",
      order: "desc",
      fields: [
        {
          key: "albumId",
          label: "Album ID",
          type: "number",
          required: true,
          create: true,
          edit: true,
          relation: { path: "/api/albums?limit=1" },
        },
        { key: "title", label: "Title", required: true, create: true, edit: true, column: true },
        { key: "url", label: "URL", required: true, create: true, edit: true },
        {
          key: "thumbnailUrl",
          label: "Thumbnail URL",
          required: true,
          create: true,
          edit: true,
          column: true,
        },
      ],
      sample: () => {
        const s = stamp();
        const url = `https://picsum.photos/seed/${s}/600/400`;
        return {
          title: `Photo ${s}`,
          url,
          thumbnailUrl: `https://picsum.photos/seed/${s}/150/150`,
        };
      },
    },
    todos: {
      id: "todos",
      title: "Todos",
      basePath: "/api/todos",
      titleKey: "title",
      sort: "createdAt",
      order: "desc",
      fields: [
        {
          key: "userId",
          label: "User ID",
          required: true,
          create: true,
          edit: true,
          relation: { path: "/api/users?limit=1&order=asc" },
        },
        { key: "title", label: "Title", required: true, create: true, edit: true, column: true },
        {
          key: "completed",
          label: "Completed",
          type: "boolean",
          create: true,
          edit: true,
          column: true,
        },
      ],
      sample: () => ({
        title: `Todo ${stamp()}`,
        completed: false,
      }),
    },
    products: {
      id: "products",
      title: "Products",
      basePath: "/api/products",
      titleKey: "name",
      subtitleKey: "category",
      imageKey: "imageUrl",
      sort: "createdAt",
      order: "desc",
      fields: [
        { key: "name", label: "Name", required: true, create: true, edit: true, column: true },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          required: true,
          create: true,
          edit: true,
        },
        {
          key: "price",
          label: "Price",
          type: "number",
          required: true,
          create: true,
          edit: true,
          column: true,
        },
        {
          key: "stock",
          label: "Stock",
          type: "number",
          create: true,
          edit: true,
          column: true,
        },
        {
          key: "category",
          label: "Category",
          required: true,
          create: true,
          edit: true,
          column: true,
        },
        {
          key: "imageUrl",
          label: "Image URL",
          required: true,
          create: true,
          edit: true,
        },
      ],
      sample: () => {
        const s = stamp();
        return {
          name: `Product ${s}`,
          description: "Sample catalog item for the preview UI.",
          price: 199000,
          stock: 12,
          category: "electronics",
          imageUrl: `https://picsum.photos/seed/p${s}/400/400`,
        };
      },
    },
    notifications: {
      id: "notifications",
      title: "Notifications",
      basePath: "/api/notifications",
      titleKey: "title",
      subtitleKey: "message",
      sort: "createdAt",
      order: "desc",
      fields: [
        {
          key: "userId",
          label: "User ID",
          required: true,
          create: true,
          edit: true,
          relation: { path: "/api/users?limit=1&order=asc" },
        },
        { key: "title", label: "Title", required: true, create: true, edit: true, column: true },
        {
          key: "message",
          label: "Message",
          type: "textarea",
          required: true,
          create: true,
          edit: true,
          column: true,
        },
        {
          key: "type",
          label: "Type",
          type: "select",
          create: true,
          edit: true,
          column: true,
          options: [
            { value: "info", label: "info" },
            { value: "success", label: "success" },
            { value: "warning", label: "warning" },
            { value: "error", label: "error" },
          ],
        },
        {
          key: "read",
          label: "Read",
          type: "boolean",
          create: true,
          edit: true,
          column: true,
        },
      ],
      sample: () => ({
        title: `Ping ${stamp()}`,
        message: "Preview notification from MockData.",
        type: "info",
        read: false,
      }),
    },
    countries: {
      id: "countries",
      title: "Countries",
      basePath: "/api/countries",
      titleKey: "name",
      subtitleKey: "capital",
      imageKey: "flagUrl",
      sort: "createdAt",
      order: "desc",
      fields: [
        { key: "name", label: "Name", required: true, create: true, edit: true, column: true },
        { key: "code", label: "Code", required: true, create: true, edit: true, column: true },
        { key: "capital", label: "Capital", required: true, create: true, edit: true, column: true },
        { key: "region", label: "Region", required: true, create: true, edit: true, column: true },
        {
          key: "population",
          label: "Population",
          type: "number",
          required: true,
          create: true,
          edit: true,
        },
        { key: "currency", label: "Currency", required: true, create: true, edit: true },
        { key: "flagUrl", label: "Flag URL", required: true, create: true, edit: true },
      ],
      sample: () => {
        const s = stamp().toUpperCase().slice(0, 2);
        return {
          name: `Demo Land ${s}`,
          code: `X${s[0] ?? "Z"}`,
          capital: "Demo City",
          region: "Asia",
          population: 1000000,
          currency: "IRR",
          flagUrl: "https://flagcdn.com/w320/ir.png",
        };
      },
    },
  };

export function isPreviewResourceId(value: string): value is PreviewResourceId {
  return (previewResourceIds as readonly string[]).includes(value);
}
