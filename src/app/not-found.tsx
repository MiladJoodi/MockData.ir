import type { Metadata } from "next";
import { NotFoundContent } from "@/components/layout/not-found-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Page not found",
    description: "This page does not exist on MockData.",
    path: "/404",
    noIndex: true,
  }),
};

export default function NotFound() {
  return <NotFoundContent />;
}
