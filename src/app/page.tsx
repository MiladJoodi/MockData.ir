import type { Metadata } from "next";
import { HomePageContent } from "@/components/home/home-page-content";
import {
  createPageMetadata,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description:
    "Free fake REST APIs with live JSON for frontend development. Browse Users, Posts, Products, and more — with docs, mock auth, and an in-browser playground.",
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return <HomePageContent />;
}
