"use client";

import {
  FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from "react";
import { ChevronDown } from "lucide-react";
import {
  contactTopicLabels,
  contactTopics,
  type ContactInput,
} from "@/lib/validations/contact";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const topicListId = useId();
  const topicRootRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<ContactInput["topic"]>("other");
  const [topicOpen, setTopicOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!topicRootRef.current?.contains(event.target as Node)) {
        setTopicOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setTopicOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setDone(false);

    if (!topic) {
      setError("Please choose what you need.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, topic, message }),
        });
        const payload = await res.json().catch(() => null);

        if (!res.ok) {
          setError(
            payload?.error?.message ?? "Could not send message. Try again.",
          );
          return;
        }

        setDone(true);
        setName("");
        setEmail("");
        setTopic("other");
        setMessage("");
      } catch {
        setError("Network error. Try again.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="contact-name"
            className="block text-[13px] font-medium text-foreground"
          >
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={120}
            autoComplete="name"
            className="h-10 w-full rounded-md border border-border bg-card px-3 text-[14px] outline-none focus-visible:border-[var(--request)]/50"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="contact-email"
            className="block text-[13px] font-medium text-foreground"
          >
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={255}
            autoComplete="email"
            className="h-10 w-full rounded-md border border-border bg-card px-3 text-[14px] outline-none focus-visible:border-[var(--request)]/50"
          />
        </div>
      </div>

      <div className="space-y-1.5" ref={topicRootRef}>
        <span
          id={`${topicListId}-label`}
          className="block text-[13px] font-medium text-foreground"
        >
          What do you need?
        </span>
        <div className="relative">
          <button
            type="button"
            id="contact-topic"
            aria-haspopup="listbox"
            aria-expanded={topicOpen}
            aria-labelledby={`${topicListId}-label`}
            onClick={() => setTopicOpen((open) => !open)}
            className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-border bg-card px-3 text-left text-[14px] outline-none focus-visible:border-[var(--request)]/50"
          >
            <span>
              {contactTopicLabels[topic]}
            </span>
            <ChevronDown
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform",
                topicOpen && "rotate-180",
              )}
              aria-hidden
            />
          </button>

          {topicOpen ? (
            <ul
              role="listbox"
              aria-labelledby={`${topicListId}-label`}
              className="absolute top-[calc(100%+4px)] right-0 left-0 z-20 overflow-hidden rounded-md border border-border bg-card py-1 shadow-lg"
            >
              {contactTopics.map((value) => (
                <li key={value} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={topic === value}
                    onClick={() => {
                      setTopic(value);
                      setTopicOpen(false);
                    }}
                    className={cn(
                      "flex w-full cursor-pointer px-3 py-2 text-left text-[14px] transition-colors hover:bg-[var(--surface-hover)]",
                      topic === value && "bg-[var(--request)]/10 text-[var(--request)]",
                    )}
                  >
                    {contactTopicLabels[value]}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <input type="hidden" name="topic" value={topic} required={false} />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="contact-message"
          className="block text-[13px] font-medium text-foreground"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={10}
          maxLength={5000}
          rows={7}
          className="w-full resize-y rounded-md border border-border bg-card px-3 py-2.5 text-[14px] leading-6 outline-none focus-visible:border-[var(--request)]/50"
        />
      </div>

      {error ? (
        <p className="text-[13px] text-[var(--delete)]">{error}</p>
      ) : null}
      {done ? (
        <p className="text-[13px] text-[var(--get)]">
          Message sent. We’ll get back to you soon.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "h-10 min-w-[8.5rem] rounded-md bg-[var(--request)] px-5 text-[13px] font-semibold text-black transition-opacity",
          pending && "opacity-50",
        )}
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
