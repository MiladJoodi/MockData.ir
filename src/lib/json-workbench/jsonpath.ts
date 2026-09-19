/**
 * Isolated JSONPath runner for Workbench.
 * Supports a practical subset matching the in-UI hint:
 *   $  .prop  ['prop']  [0]  [*]  and chains thereof.
 * Swap this module later for a full library if needed.
 */

export type JsonPathOk = { ok: true; values: unknown[] };
export type JsonPathErr = { ok: false; message: string };
export type JsonPathResult = JsonPathOk | JsonPathErr;

type Token =
  | { type: "root" }
  | { type: "prop"; name: string }
  | { type: "index"; index: number }
  | { type: "wildcard" };

export function queryJsonPath(data: unknown, expression: string): JsonPathResult {
  const expr = expression.trim();
  if (!expr) {
    return { ok: false, message: "Empty JSONPath expression" };
  }

  let tokens: Token[];
  try {
    tokens = tokenize(expr);
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Invalid JSONPath",
    };
  }

  try {
    let nodes: unknown[] = [data];
    for (const token of tokens) {
      if (token.type === "root") continue;
      const next: unknown[] = [];
      for (const node of nodes) {
        next.push(...step(node, token));
      }
      nodes = next;
    }
    return { ok: true, values: nodes };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "JSONPath evaluation failed",
    };
  }
}

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  if (expr[i] !== "$") {
    throw new Error("JSONPath must start with $");
  }
  tokens.push({ type: "root" });
  i += 1;

  while (i < expr.length) {
    const ch = expr[i];

    if (ch === ".") {
      i += 1;
      if (expr[i] === ".") {
        throw new Error("Recursive descent (..) is not supported");
      }
      if (expr[i] === "*") {
        tokens.push({ type: "wildcard" });
        i += 1;
        continue;
      }
      const name = readIdentifier(expr, i);
      if (!name.value) {
        throw new Error(`Expected property name at position ${i}`);
      }
      tokens.push({ type: "prop", name: name.value });
      i = name.next;
      continue;
    }

    if (ch === "[") {
      i += 1;
      while (expr[i] === " " || expr[i] === "\t") i += 1;

      if (expr[i] === "*") {
        i += 1;
        while (expr[i] === " " || expr[i] === "\t") i += 1;
        if (expr[i] !== "]") {
          throw new Error("Expected ] after [*]");
        }
        tokens.push({ type: "wildcard" });
        i += 1;
        continue;
      }

      if (expr[i] === "'" || expr[i] === '"') {
        const quote = expr[i];
        i += 1;
        let name = "";
        while (i < expr.length && expr[i] !== quote) {
          if (expr[i] === "\\") {
            i += 1;
            if (i >= expr.length) throw new Error("Unterminated string in []");
          }
          name += expr[i];
          i += 1;
        }
        if (expr[i] !== quote) throw new Error("Unterminated string in []");
        i += 1;
        while (expr[i] === " " || expr[i] === "\t") i += 1;
        if (expr[i] !== "]") throw new Error("Expected ] after property");
        i += 1;
        tokens.push({ type: "prop", name });
        continue;
      }

      if (expr[i] === "-" || (expr[i] >= "0" && expr[i] <= "9")) {
        const start = i;
        if (expr[i] === "-") i += 1;
        while (expr[i] >= "0" && expr[i] <= "9") i += 1;
        const raw = expr.slice(start, i);
        const index = Number(raw);
        if (!Number.isInteger(index)) {
          throw new Error(`Invalid array index: ${raw}`);
        }
        while (expr[i] === " " || expr[i] === "\t") i += 1;
        if (expr[i] !== "]") throw new Error("Expected ] after index");
        i += 1;
        tokens.push({ type: "index", index });
        continue;
      }

      throw new Error(`Unexpected token in [] at position ${i}`);
    }

    throw new Error(`Unexpected character '${ch}' at position ${i}`);
  }

  return tokens;
}

function readIdentifier(
  expr: string,
  start: number,
): { value: string; next: number } {
  let i = start;
  if (i >= expr.length) return { value: "", next: i };
  const first = expr[i];
  if (
    !(
      (first >= "A" && first <= "Z") ||
      (first >= "a" && first <= "z") ||
      first === "_" ||
      first === "$"
    )
  ) {
    return { value: "", next: i };
  }
  i += 1;
  while (i < expr.length) {
    const c = expr[i];
    if (
      (c >= "A" && c <= "Z") ||
      (c >= "a" && c <= "z") ||
      (c >= "0" && c <= "9") ||
      c === "_" ||
      c === "$"
    ) {
      i += 1;
      continue;
    }
    break;
  }
  return { value: expr.slice(start, i), next: i };
}

function step(node: unknown, token: Token): unknown[] {
  if (token.type === "root") return [node];

  if (token.type === "prop") {
    if (node && typeof node === "object" && !Array.isArray(node)) {
      if (Object.prototype.hasOwnProperty.call(node, token.name)) {
        return [(node as Record<string, unknown>)[token.name]];
      }
    }
    return [];
  }

  if (token.type === "index") {
    if (!Array.isArray(node)) return [];
    const idx = token.index < 0 ? node.length + token.index : token.index;
    if (idx < 0 || idx >= node.length) return [];
    return [node[idx]];
  }

  // wildcard
  if (Array.isArray(node)) return [...node];
  if (node && typeof node === "object") {
    return Object.values(node as Record<string, unknown>);
  }
  return [];
}
