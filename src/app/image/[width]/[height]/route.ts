import { NextResponse } from "next/server";
import { jsonError, validationError } from "@/lib/api/response";
import { parseImageDims, parseImageQuery } from "@/lib/image/params";
import { getImageProvider } from "@/lib/image/picsum";
import {
  SVG_GENERATE_DELAY_MS,
  buildPlaceholderSvg,
  resolveSvgColors,
} from "@/lib/image/svg";

type RouteContext = {
  params: Promise<{ width: string; height: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { width: widthRaw, height: heightRaw } = await context.params;
  const dims = parseImageDims(widthRaw, heightRaw);
  if (!dims.ok) {
    return validationError(dims.error);
  }

  const query = parseImageQuery(new URL(request.url).searchParams);
  if (!query.success) {
    return validationError(query.error);
  }

  const { type, seed, bg, fg } = query.data;

  if (type === "real") {
    const { redirectUrl } = getImageProvider().resolve({
      width: dims.width,
      height: dims.height,
      seed,
    });
    return NextResponse.redirect(redirectUrl, {
      status: 302,
      headers: {
        "Cache-Control": seed ? "public, max-age=86400" : "no-store",
      },
    });
  }

  if (bg === undefined && fg !== undefined) {
    return jsonError(
      "VALIDATION_ERROR",
      "fg requires bg when using custom SVG colors",
      400,
    );
  }

  // Intentional pause so SVG generation feels deliberate in the UI.
  await new Promise((r) => setTimeout(r, SVG_GENERATE_DELAY_MS));

  const colors = resolveSvgColors({ seed, bg, fg });
  const svg = buildPlaceholderSvg({
    width: dims.width,
    height: dims.height,
    bg: colors.bg,
    fg: colors.fg,
    muted: colors.muted,
  });

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": seed || bg ? "public, max-age=86400" : "no-store",
    },
  });
}
