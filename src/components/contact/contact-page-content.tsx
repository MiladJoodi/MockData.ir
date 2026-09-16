"use client";

import { ContactForm } from "@/components/contact/contact-form";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { useUiLocale } from "@/components/providers/ui-locale-provider";

export function ContactPageContent() {
  const { dict } = useUiLocale();

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 space-y-3">
        <Breadcrumbs
          items={[
            { name: dict.common.home, href: "/", path: "/" },
            { name: dict.contact.title, path: "/contact" },
          ]}
        />
        <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          {dict.contact.title}
        </h1>
        <p className="text-[14px] leading-6 text-muted-foreground">
          {dict.contact.intro}{" "}
          <a
            href="mailto:info@mockdata.ir"
            className="text-[var(--request)] underline-offset-2 hover:underline ltr-tech"
            dir="ltr"
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
