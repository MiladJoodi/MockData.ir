export const TEMPORARY_LIMITS = {
  maxBytes: 64 * 1024,
  maxDepth: 8,
  maxArrayLength: 500,
  maxObjectKeys: 200,
  maxActivePerClient: 5,
  /** Creates allowed per IP per rolling hour */
  maxCreatesPerIpPerHour: 20,
  publicIdLength: 10,
  manageTokenBytes: 24,
} as const;

export const TEMPORARY_DURATIONS = ["1h", "6h", "12h", "24h"] as const;

export type TemporaryDuration = (typeof TEMPORARY_DURATIONS)[number];

export const TEMPORARY_DURATION_MS: Record<TemporaryDuration, number> = {
  "1h": 60 * 60 * 1000,
  "6h": 6 * 60 * 60 * 1000,
  "12h": 12 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
};

export const TMP_CLIENT_COOKIE = "tmp_client";
export const TMP_CLIENT_MAX_AGE_SEC = 60 * 60 * 24 * 400; // ~400 days
