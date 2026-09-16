import type { TemporaryApi } from "@/db/schema/temporary-apis";
import {
  deleteTemporaryApiByPublicId,
  getTemporaryApiByPublicId,
} from "@/db/queries/temporary-apis";

export class TemporaryExpiredError extends Error {
  constructor() {
    super("Temporary API expired");
    this.name = "TemporaryExpiredError";
  }
}

export class TemporaryNotFoundError extends Error {
  constructor() {
    super("Temporary API not found");
    this.name = "TemporaryNotFoundError";
  }
}

/** Load active API or throw; lazily deletes expired rows. */
export async function loadActiveTemporaryApi(
  publicId: string,
): Promise<TemporaryApi> {
  const row = await getTemporaryApiByPublicId(publicId);
  if (!row) throw new TemporaryNotFoundError();
  if (row.expiresAt.getTime() <= Date.now()) {
    await deleteTemporaryApiByPublicId(publicId);
    throw new TemporaryExpiredError();
  }
  return row;
}
