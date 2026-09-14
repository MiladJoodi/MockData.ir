import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact the MockData team — questions, feedback, or ideas. Email info@mockdata.ir.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 space-y-3">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/", path: "/" },
            { name: "Contact", path: "/contact" },
          ]}
        />
        <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          Contact
        </h1>
        <p className="text-[14px] leading-6 text-muted-foreground">
          Questions, feedback, or ideas — send a short message and it goes
          straight to inbox. You can also email{" "}
          <a
            href="mailto:info@mockdata.ir"
            className="text-[var(--request)] underline-offset-2 hover:underline"
          >
            info@mockdata.ir
          </a>
          .
        </p>
      </header>

      <ContactForm />
    </div>
  );
}
