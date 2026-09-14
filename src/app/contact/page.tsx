import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send a message to the MockData team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 space-y-3">
        <p className="text-[13px] text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2 text-border">/</span>
          <span className="text-foreground">Contact</span>
        </p>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          Contact
        </h1>
        <p className="text-[14px] leading-6 text-muted-foreground">
          Questions, feedback, or ideas — send a short message and it goes
          straight to inbox.
        </p>
      </header>

      <ContactForm />
    </div>
  );
}
