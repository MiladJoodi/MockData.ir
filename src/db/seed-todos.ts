/** Seed todos resolve `authorUsername` → userId after users insert. */
export type SeedTodo = {
  authorUsername: string;
  title: string;
  completed: boolean;
};

export const seedTodos: SeedTodo[] = [
  { authorUsername: "avachen", title: "Ship Posts docs page", completed: true },
  { authorUsername: "avachen", title: "Wire OpenAPI for Comments", completed: false },
  { authorUsername: "mreid", title: "Polish theme toggle contrast", completed: true },
  { authorUsername: "mreid", title: "Shrink home resource cards", completed: true },
  { authorUsername: "sofia.a", title: "Add pagination examples", completed: false },
  { authorUsername: "noahk", title: "Draft workshop notes", completed: false },
  { authorUsername: "epetrova", title: "Index posts.user_id", completed: true },
  { authorUsername: "jwright", title: "Persist playground token", completed: true },
  { authorUsername: "priyan", title: "Tune search ilike patterns", completed: false },
  { authorUsername: "lmoreau", title: "Rewrite sample post copy", completed: true },
  { authorUsername: "hbrooks", title: "Document rate-limit headers", completed: true },
  { authorUsername: "ohassan", title: "Sync OpenAPI on every PR", completed: false },
  { authorUsername: "ytanaka", title: "Publish travel draft", completed: false },
  { authorUsername: "icosta", title: "Profile wall by userId", completed: true },
  { authorUsername: "dokonkwo", title: "Fix seed delete order", completed: true },
  { authorUsername: "mjohansson", title: "Boolean query parse tip", completed: true },
  { authorUsername: "eclarke", title: "Unify error payload shape", completed: false },
  { authorUsername: "asaleh", title: "Cap delay at 5000ms", completed: true },
  { authorUsername: "tsilva", title: "Limit tags to 20", completed: false },
  { authorUsername: "gliu", title: "Add title sort option", completed: true },
  { authorUsername: "bortiz", title: "Verify Resend domain", completed: false },
  { authorUsername: "cmartin", title: "Show curl in docs panel", completed: true },
  { authorUsername: "rpatel", title: "Keep UUID primary keys", completed: true },
  { authorUsername: "fzahra", title: "Welcome new installs", completed: true },
];
