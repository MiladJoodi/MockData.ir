import type {
  GeneratorTopicId,
  TopicPreviewSample,
} from "@/lib/generator/types";

/** Static card previews (EN). FA overrides live in i18n when present. */
export const TOPIC_PREVIEW_SAMPLES: Record<
  GeneratorTopicId,
  TopicPreviewSample
> = {
  users: {
    line1: "Sarah Johnson",
    line2: "@sarahj · sarah@mail.test",
    line3: "Berlin",
  },
  customers: {
    line1: "Alex Rivera",
    line2: "alex@demo.dev",
    line3: "+1 415 555 0199",
  },
  employees: {
    line1: "Maya Chen",
    line2: "Frontend Developer",
    line3: "Engineering · Acme",
  },
  authors: {
    line1: "Jordan Lee",
    line2: "Writes about product craft.",
  },
  products: {
    line1: "Wireless Headphones",
    line2: "€89.99 · Electronics",
    line3: "★★★★☆",
  },
  orders: {
    line1: "Order #10482",
    line2: "3 items · €129.90",
    line3: "Delivered",
  },
  reviews: {
    line1: "★★★★★ Great product",
    line2: "Really useful and easy to use.",
  },
  categories: {
    line1: "Electronics",
    line2: "electronics",
  },
  "cart-items": {
    line1: "Smart Watch",
    line2: "2 × $129 · $258",
  },
  coupons: {
    line1: "WELCOME10",
    line2: "10% · expires 2026-12-01",
  },
  payments: {
    line1: "$84.50 USD",
    line2: "card · paid",
  },
  shipments: {
    line1: "ORD-10482 · DHL",
    line2: "In transit · 1Z999…",
  },
  posts: {
    line1: "Designing for speed",
    line2: "By Ava Chen",
  },
  comments: {
    line1: "This helped a lot — thanks!",
    line2: "Liam · 12 likes",
  },
  messages: {
    line1: "Can you review the latest draft?",
    line2: "Sara → Amir",
  },
  notifications: {
    line1: "New comment",
    line2: "info · 2h ago",
  },
  albums: {
    line1: "Random Access Memories",
    line2: "Daft Punk",
    line3: "2013 · 13 tracks",
  },
  songs: {
    line1: "Midnight Drive",
    line2: "3:42 · Electronic",
  },
  movies: {
    line1: "Night Circuit",
    line2: "2021 · ★ 8.2",
  },
  books: {
    line1: "Designing Interfaces",
    line2: "Jordan Lee · 2019",
  },
  companies: {
    line1: "Acme Corp",
    line2: "Technology · New York",
  },
  jobs: {
    line1: "Frontend Developer",
    line2: "Google · Berlin · Full-time",
  },
  courses: {
    line1: "React Fundamentals",
    line2: "Intermediate · 12h",
  },
  events: {
    line1: "Frontend Meetup",
    line2: "Berlin · Workshop",
  },
  countries: {
    line1: "Germany",
    line2: "DE · Berlin",
  },
  cities: {
    line1: "Munich",
    line2: "Germany · Bavaria",
  },
  addresses: {
    line1: "12 Hauptstraße",
    line2: "Munich, Bavaria, Germany",
  },
};
