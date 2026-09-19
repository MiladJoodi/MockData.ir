export type ToolCategory = "core" | "transform" | "utility";

export type ConvertMode =
  | "to-typescript"
  | "to-zod"
  | "to-schema"
  | "yaml"
  | "csv";

export const CONVERT_MODES: ConvertMode[] = [
  "to-typescript",
  "to-zod",
  "to-schema",
  "yaml",
  "csv",
];

export const DEFAULT_CONVERT_MODE: ConvertMode = "to-typescript";

export const CONVERT_MODE_LABEL_KEY: Record<ConvertMode, string> = {
  "to-typescript": "toTypescript",
  "to-zod": "toZod",
  "to-schema": "toSchema",
  yaml: "yaml",
  csv: "csv",
};

export type ToolId =
  | "format"
  | "tree"
  | "search"
  | "jsonpath"
  | "convert"
  | "sort-keys"
  | "remove-empty"
  | "flatten"
  | "escape"
  | "repair"
  | "extract"
  | "pick"
  | "omit"
  | "compare-structure";

/** Old ids still accepted in ?tool= and mapped to a current tool. */
export const TOOL_ID_ALIASES: Record<string, ToolId> = {
  minify: "format",
  validate: "format",
  unescape: "escape",
  unflatten: "flatten",
  "extract-keys": "extract",
  "extract-values": "extract",
  "from-schema": "convert",
  diff: "compare-structure",
  "to-typescript": "convert",
  "to-zod": "convert",
  "to-schema": "convert",
  yaml: "convert",
  csv: "convert",
};

export type ToolAvailability = "ready" | "soon";

export type ToolMeta = {
  id: ToolId;
  category: ToolCategory;
  /** i18n key under dict.jsonWorkbench.tools.* */
  labelKey: string;
  availability: ToolAvailability;
};

export const DEFAULT_TOOL_ID: ToolId = "format";

export const WORKBENCH_TOOLS: ToolMeta[] = [
  // Core
  {
    id: "format",
    category: "core",
    labelKey: "format",
    availability: "ready",
  },
  { id: "tree", category: "core", labelKey: "tree", availability: "ready" },
  { id: "search", category: "core", labelKey: "search", availability: "ready" },
  {
    id: "jsonpath",
    category: "core",
    labelKey: "jsonpath",
    availability: "ready",
  },
  {
    id: "convert",
    category: "core",
    labelKey: "convert",
    availability: "ready",
  },
  // Utilities
  {
    id: "sort-keys",
    category: "utility",
    labelKey: "sortKeys",
    availability: "ready",
  },
  {
    id: "remove-empty",
    category: "utility",
    labelKey: "removeEmpty",
    availability: "ready",
  },
  {
    id: "flatten",
    category: "utility",
    labelKey: "flatten",
    availability: "ready",
  },
  {
    id: "escape",
    category: "utility",
    labelKey: "escape",
    availability: "ready",
  },
  {
    id: "repair",
    category: "utility",
    labelKey: "repair",
    availability: "ready",
  },
  {
    id: "extract",
    category: "utility",
    labelKey: "extract",
    availability: "ready",
  },
  { id: "pick", category: "utility", labelKey: "pick", availability: "ready" },
  { id: "omit", category: "utility", labelKey: "omit", availability: "ready" },
  {
    id: "compare-structure",
    category: "utility",
    labelKey: "compareStructure",
    availability: "ready",
  },
];

export function getToolMeta(id: string): ToolMeta | undefined {
  return WORKBENCH_TOOLS.find((t) => t.id === id);
}

export function resolveToolId(value: string): ToolId | undefined {
  if (WORKBENCH_TOOLS.some((t) => t.id === value)) return value as ToolId;
  return TOOL_ID_ALIASES[value];
}

export function resolveConvertMode(value: string): ConvertMode | undefined {
  return CONVERT_MODES.includes(value as ConvertMode)
    ? (value as ConvertMode)
    : undefined;
}

export function isToolId(value: string): value is ToolId {
  return resolveToolId(value) !== undefined;
}

export function toolsByCategory(category: ToolCategory): ToolMeta[] {
  return WORKBENCH_TOOLS.filter((t) => t.category === category);
}
