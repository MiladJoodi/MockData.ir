import { childPath } from "./path";
import { jsonValueType, type JsonValueType } from "./parse";

export type StructureDiffKind = "missing" | "extra" | "type-mismatch" | "same";

export type StructureChange = {
  kind: "missing" | "extra" | "type-mismatch";
  path: string;
  typeA?: JsonValueType;
  typeB?: JsonValueType;
};

export type StructureRow = {
  path: string;
  status: StructureDiffKind;
  typeA?: JsonValueType;
  typeB?: JsonValueType;
};

export type LineHighlight = "missing" | "extra" | "type-mismatch";

export type HighlightedSide = {
  text: string;
  marks: (LineHighlight | null)[];
};

export type StructureCompareResult = {
  identical: boolean;
  changes: StructureChange[];
  rows: StructureRow[];
  sideA: HighlightedSide;
  sideB: HighlightedSide;
};

/** Compare JSON shapes while ignoring values. */
export function compareStructure(
  a: unknown,
  b: unknown,
): StructureCompareResult {
  const changes: StructureChange[] = [];
  const rows: StructureRow[] = [];
  walk(a, b, "$", changes, rows);

  const markByPath = new Map<string, LineHighlight>();
  for (const change of changes) {
    markByPath.set(change.path, change.kind);
  }

  return {
    identical: changes.length === 0,
    changes,
    rows,
    sideA: buildHighlightedSide(a, markByPath, "a"),
    sideB: buildHighlightedSide(b, markByPath, "b"),
  };
}

function walk(
  a: unknown,
  b: unknown,
  path: string,
  changes: StructureChange[],
  rows: StructureRow[],
): void {
  const typeA = a === undefined ? undefined : jsonValueType(a);
  const typeB = b === undefined ? undefined : jsonValueType(b);

  if (a === undefined && b !== undefined) {
    changes.push({ kind: "extra", path, typeB });
    rows.push({ path, status: "extra", typeB });
    return;
  }
  if (b === undefined && a !== undefined) {
    changes.push({ kind: "missing", path, typeA });
    rows.push({ path, status: "missing", typeA });
    return;
  }

  if (typeA !== typeB) {
    changes.push({ kind: "type-mismatch", path, typeA, typeB });
    rows.push({ path, status: "type-mismatch", typeA, typeB });
    return;
  }

  rows.push({ path, status: "same", typeA, typeB });

  if (typeA === "array") {
    const arrA = a as unknown[];
    const arrB = b as unknown[];
    const max = Math.max(arrA.length, arrB.length);
    for (let i = 0; i < max; i++) {
      walk(
        i < arrA.length ? arrA[i] : undefined,
        i < arrB.length ? arrB[i] : undefined,
        childPath(path, String(i), true),
        changes,
        rows,
      );
    }
    return;
  }

  if (typeA === "object") {
    const objA = a as Record<string, unknown>;
    const objB = b as Record<string, unknown>;
    const keys = new Set([...Object.keys(objA), ...Object.keys(objB)]);
    for (const key of keys) {
      const hasA = Object.prototype.hasOwnProperty.call(objA, key);
      const hasB = Object.prototype.hasOwnProperty.call(objB, key);
      walk(
        hasA ? objA[key] : undefined,
        hasB ? objB[key] : undefined,
        childPath(path, key, false),
        changes,
        rows,
      );
    }
  }
}

function buildHighlightedSide(
  value: unknown,
  markByPath: Map<string, LineHighlight>,
  side: "a" | "b",
): HighlightedSide {
  const { lines, paths } = prettyPrintWithPaths(value);
  const marks = paths.map((path) => {
    const hit = findMark(path, markByPath);
    if (!hit) return null;
    if (side === "a" && hit === "extra") return null;
    if (side === "b" && hit === "missing") return null;
    return hit;
  });
  return { text: lines.join("\n"), marks };
}

function findMark(
  path: string,
  markByPath: Map<string, LineHighlight>,
): LineHighlight | null {
  const direct = markByPath.get(path);
  if (direct) return direct;

  let best: { path: string; mark: LineHighlight } | null = null;
  for (const [changePath, mark] of markByPath) {
    if (path === changePath || isDescendantPath(path, changePath)) {
      if (!best || changePath.length > best.path.length) {
        best = { path: changePath, mark };
      }
    }
  }
  return best?.mark ?? null;
}

function isDescendantPath(path: string, parent: string): boolean {
  if (parent === "$") return path !== "$";
  return path.startsWith(`${parent}.`) || path.startsWith(`${parent}[`);
}

/** Pretty-print JSON and tag each line with its structure path. */
export function prettyPrintWithPaths(value: unknown): {
  lines: string[];
  paths: string[];
} {
  const lines: string[] = [];
  const paths: string[] = [];

  function push(line: string, path: string) {
    lines.push(line);
    paths.push(path);
  }

  function emitValue(
    node: unknown,
    path: string,
    indent: number,
    suffix: string,
  ) {
    const pad = "  ".repeat(indent);
    const type = jsonValueType(node);

    if (type === "array") {
      const arr = node as unknown[];
      if (arr.length === 0) {
        push(`${pad}[]${suffix}`, path);
        return;
      }
      push(`${pad}[`, path);
      for (let i = 0; i < arr.length; i++) {
        emitValue(
          arr[i],
          childPath(path, String(i), true),
          indent + 1,
          i < arr.length - 1 ? "," : "",
        );
      }
      push(`${pad}]${suffix}`, path);
      return;
    }

    if (type === "object") {
      const obj = node as Record<string, unknown>;
      const keys = Object.keys(obj);
      if (keys.length === 0) {
        push(`${pad}{}${suffix}`, path);
        return;
      }
      push(`${pad}{`, path);
      for (let i = 0; i < keys.length; i++) {
        emitProperty(
          keys[i]!,
          obj[keys[i]!],
          path,
          indent + 1,
          i < keys.length - 1 ? "," : "",
        );
      }
      push(`${pad}}${suffix}`, path);
      return;
    }

    push(`${pad}${JSON.stringify(node)}${suffix}`, path);
  }

  function emitProperty(
    key: string,
    node: unknown,
    parentPath: string,
    indent: number,
    suffix: string,
  ) {
    const path = childPath(parentPath, key, false);
    const pad = "  ".repeat(indent);
    const type = jsonValueType(node);
    const keyText = JSON.stringify(key);

    if (type === "array") {
      const arr = node as unknown[];
      if (arr.length === 0) {
        push(`${pad}${keyText}: []${suffix}`, path);
        return;
      }
      push(`${pad}${keyText}: [`, path);
      for (let i = 0; i < arr.length; i++) {
        emitValue(
          arr[i],
          childPath(path, String(i), true),
          indent + 1,
          i < arr.length - 1 ? "," : "",
        );
      }
      push(`${pad}]${suffix}`, path);
      return;
    }

    if (type === "object") {
      const obj = node as Record<string, unknown>;
      const keys = Object.keys(obj);
      if (keys.length === 0) {
        push(`${pad}${keyText}: {}${suffix}`, path);
        return;
      }
      push(`${pad}${keyText}: {`, path);
      for (let i = 0; i < keys.length; i++) {
        emitProperty(
          keys[i]!,
          obj[keys[i]!],
          path,
          indent + 1,
          i < keys.length - 1 ? "," : "",
        );
      }
      push(`${pad}}${suffix}`, path);
      return;
    }

    push(`${pad}${keyText}: ${JSON.stringify(node)}${suffix}`, path);
  }

  emitValue(value, "$", 0, "");
  return { lines, paths };
}

export function describeStructureChange(change: StructureChange): string {
  if (change.kind === "type-mismatch") {
    return `${change.typeA} → ${change.typeB}`;
  }
  if (change.kind === "missing") {
    return change.typeA ? `only in A (${change.typeA})` : "only in A";
  }
  return change.typeB ? `only in B (${change.typeB})` : "only in B";
}
