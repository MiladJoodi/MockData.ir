import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthPreviewDemo } from "@/components/preview/auth-preview-demo";
import { ResourcePreviewDemo } from "@/components/preview/resource-preview-demo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
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
      <PreviewShell
        title="Auth preview"
        docsHref="/auth"
        playgroundHref="/playground?resource=auth"
        basePath="/api/auth"
        crumbs={[
          { name: "Home", href: "/", path: "/" },
          { name: "Auth", href: "/auth", path: "/auth" },
          { name: "Preview", path: "/preview/auth" },
        ]}
      >
        <AuthPreviewDemo />
      </PreviewShell>
    );
  }

  if (!isPreviewResourceId(resource)) notFound();
  const config = previewResources[resource as PreviewResourceId];

  return (
    <PreviewShell
      title={`${config.title} preview`}
      docsHref={`/${config.id}`}
      playgroundHref={`/playground?resource=${config.id}`}
      basePath={config.basePath}
      crumbs={[
        { name: "Home", href: "/", path: "/" },
        { name: config.title, href: `/${config.id}`, path: `/${config.id}` },
        { name: "Preview", path: `/preview/${config.id}` },
      ]}
    >
      <ResourcePreviewDemo resourceId={config.id} />
    </PreviewShell>
  );
}

function PreviewShell({
  title,
  docsHref,
  playgroundHref,
  basePath,
  crumbs,
  children,
}: {
  title: string;
  docsHref: string;
  playgroundHref: string;
  basePath: string;
  crumbs: { name: string; href?: string; path: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 space-y-3">
        <Breadcrumbs items={crumbs} />
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-xl text-[14px] leading-6 text-muted-foreground">
              A tiny UI on top of{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]">
                {basePath}
              </code>
              . For Persian data, pick{" "}
              <span className="font-medium text-foreground">FA</span> in the
              header. Shared demo DB — changes reset daily in production.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={docsHref}
              className="rounded-md border border-border bg-muted/40 px-3 py-1.5 text-[12px] hover:border-[var(--request)]/40"
            >
              Docs
            </Link>
            <Link
              href={playgroundHref}
              className="rounded-md border border-border bg-muted/40 px-3 py-1.5 text-[12px] hover:border-[var(--request)]/40"
            >
              Playground
            </Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
