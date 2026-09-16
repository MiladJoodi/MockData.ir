import { NextRequest } from "next/server";
import {
  deleteTemporaryApiByPublicId,
  getTemporaryApiByPublicId,
} from "@/db/queries/temporary-apis";
import {
  internalError,
  jsonError,
  jsonSuccess,
  notFoundError,
} from "@/lib/api/response";
import { readTmpClientKey } from "@/lib/temporary/client";
import { hashManageToken } from "@/lib/temporary/ids";

type RouteContext = {
  params: Promise<{ publicId: string }>;
};

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { publicId } = await context.params;
    if (!publicId || publicId.length < 6) {
      return notFoundError("Temporary API not found");
    }

    const row = await getTemporaryApiByPublicId(publicId);
    if (!row) {
      return notFoundError("Temporary API not found");
    }

    if (row.expiresAt.getTime() <= Date.now()) {
      await deleteTemporaryApiByPublicId(publicId);
      return notFoundError("Temporary API not found");
    }

    const clientKey = readTmpClientKey(request);
    let manageToken: string | null =
      request.headers.get("x-manage-token")?.trim() || null;

    if (!manageToken) {
      try {
        const body = await request.json();
        if (body && typeof body === "object" && "manageToken" in body) {
          const value = (body as { manageToken?: unknown }).manageToken;
          if (typeof value === "string") manageToken = value.trim();
        }
      } catch {
        /* no body */
      }
    }

    const ownsByCookie = Boolean(clientKey && clientKey === row.clientKey);
    const ownsByToken = Boolean(
      manageToken && hashManageToken(manageToken) === row.manageTokenHash,
    );

    if (!ownsByCookie && !ownsByToken) {
      return jsonError(
        "FORBIDDEN",
        "You cannot delete this temporary API.",
        403,
      );
    }

    await deleteTemporaryApiByPublicId(publicId);
    return jsonSuccess({ id: publicId, deleted: true });
  } catch (error) {
    console.error("DELETE /api/temporary/[publicId] failed:", error);
    return internalError();
  }
}
