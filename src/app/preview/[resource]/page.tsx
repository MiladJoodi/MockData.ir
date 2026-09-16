import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PreviewPageClient } from "@/components/preview/preview-page-client";
import {
  isPreviewResourceId,
  previewResources,
  type PreviewResourceId,
} from "@/lib/preview/resources";
import { createPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ resource: string }>;
};

const ALL = ["auth", ...Object.keys(previewResources)] as const;

export function generateStaticParams() {
  return ALL.map((resource) => ({ resource }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { resource } = await params;
  if (resource === "auth") {
    return createPageMetadata({
      title: "Auth preview",
      description: "Sample login UI on the MockData Auth API.",
      path: "/preview/auth",
    });
  }
  if (!isPreviewResourceId(resource)) {
    return createPageMetadata({
      title: "Preview",
      description: "MockData resource preview",
      path: `/preview/${resource}`,
    });
  }
  const config = previewResources[resource];
  return createPageMetadata({
    title: `${config.title} preview`,
    description: `Sample UI built on the MockData ${config.title} API.`,
    path: `/preview/${resource}`,
  });
}

export default async function PreviewResourcePage({ params }: PageProps) {
  const { resource } = await params;

  if (resource === "auth") {
    return (
      <PreviewPageClient
        kind="auth"
        resourceId="auth"
        basePath="/api/auth"
        docsHref="/auth"
        playgroundHref="/playground?resource=auth"
      />
    );
  }

  if (!isPreviewResourceId(resource)) notFound();
  const config = previewResources[resource as PreviewResourceId];

  return (
    <PreviewPageClient
      kind="resource"
      resourceId={config.id}
      basePath={config.basePath}
      docsHref={`/${config.id}`}
      playgroundHref={`/playground?resource=${config.id}`}
    />
  );
}
