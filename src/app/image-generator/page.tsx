import type { Metadata } from "next";
import { ImageGeneratorPageContent } from "@/components/image-generator/image-generator-page";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Image Generator",
  description:
    "Placeholder images via URL — SVG from MockData or real Picsum photos. Use directly in img, CSS, and projects.",
  path: "/image-generator",
});

export default function ImageGeneratorPage() {
  return <ImageGeneratorPageContent />;
}
