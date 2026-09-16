import type { GeneratorOutputMode } from "@/lib/generator/modes";
import type { TemporaryDuration } from "@/lib/temporary/limits";

export type GeneratorSessionState = {
  topicId: string | null;
  mode: GeneratorOutputMode;
  fields: string[];
  quantity: number;
  records: Record<string, unknown>[] | null;
  duration: TemporaryDuration;
  createdUrl: string | null;
  status: string | null;
  error: string | null;
};

const DEFAULT_STATE: GeneratorSessionState = {
  topicId: null,
  mode: "payload",
  fields: [],
  quantity: 10,
  records: null,
  duration: "12h",
  createdUrl: null,
  status: null,
  error: null,
};

/** In-memory session — survives client navigations, clears on full reload. */
let session: GeneratorSessionState = { ...DEFAULT_STATE };

export function loadGeneratorSession(): GeneratorSessionState {
  return session;
}

export function saveGeneratorSession(
  patch: Partial<GeneratorSessionState>,
): void {
  session = { ...session, ...patch };
}

export function clearGeneratorSession(): void {
  session = { ...DEFAULT_STATE };
}
