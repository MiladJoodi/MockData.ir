import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact/contact-page-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact the MockData team — questions, feedback, or ideas. Email info@mockdata.ir.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageContent />;
}
