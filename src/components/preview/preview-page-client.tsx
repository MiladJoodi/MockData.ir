"use client";

import { AuthPreviewDemo } from "@/components/preview/auth-preview-demo";
import { PreviewShell } from "@/components/preview/preview-shell";
import { ResourcePreviewDemo } from "@/components/preview/resource-preview-demo";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import type { PreviewResourceId } from "@/lib/preview/resources";

export function PreviewPageClient({
  kind,
  resourceId,
  basePath,
}: {
  kind: "auth" | "resource";
  resourceId: string;
  basePath: string;
  docsHref?: string;
  playgroundHref?: string;
}) {
  const { dict } = useUiLocale();

  if (kind === "auth") {
    const title = `${dict.catalog.auth?.title ?? "Auth"} · ${dict.common.preview}`;
    return (
      <PreviewShell
        title={title}
        basePath={basePath}
        crumbs={[
          { name: dict.common.home, href: "/", path: "/" },
          {
            name: dict.catalog.auth?.title ?? "Auth",
            href: "/auth",
            path: "/auth",
          },
          { name: dict.common.preview, path: "/preview/auth" },
        ]}
      >
        <AuthPreviewDemo />
      </PreviewShell>
    );
  }

  const cat = dict.catalog[resourceId];
  const name = cat?.title ?? resourceId;
  return (
    <PreviewShell
      title={`${name} · ${dict.common.preview}`}
      basePath={basePath}
      crumbs={[
        { name: dict.common.home, href: "/", path: "/" },
        { name: name, href: `/${resourceId}`, path: `/${resourceId}` },
        { name: dict.common.preview, path: `/preview/${resourceId}` },
      ]}
    >
      <ResourcePreviewDemo resourceId={resourceId as PreviewResourceId} />
    </PreviewShell>
  );
}
