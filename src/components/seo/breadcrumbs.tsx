import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  name: string;
  /** Path for link + JSON-LD. Omit on the current page crumb to avoid linking to self. */
  href?: string;
  /** Absolute path used in BreadcrumbList when `href` is omitted (current page). */
  path: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          items.map((item) => ({ name: item.name, path: item.path })),
        )}
      />
      <nav
        aria-label="Breadcrumb"
        className={cn("text-[13px] text-muted-foreground", className)}
      >
        <ol className="flex flex-wrap items-center">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.path}-${item.name}`} className="flex items-center">
                {index > 0 ? (
                  <span className="mx-2 text-muted-foreground/55" aria-hidden>
                    /
                  </span>
                ) : null}
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-foreground">
                    {item.name}
                  </Link>
                ) : (
                  <span
                    className={isLast ? "text-foreground" : undefined}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.name}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
