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
  contacts: {
    line1: "Nora Blake",
    line2: "nora@acme.test · Acme",
  },
  "team-members": {
    line1: "Sam Ortiz",
    line2: "lead · Engineering",
  },
  doctors: {
    line1: "Dr. Lena Park",
    line2: "Cardiology · City General",
  },
  patients: {
    line1: "Omar Hassan",
    line2: "A+ · Hypertension",
  },
  drivers: {
    line1: "Chris Adams",
    line2: "sedan · ★ 4.8",
  },
  guests: {
    line1: "Elena Rossi",
    line2: "Room 412 · checked_in",
  },
  profiles: {
    line1: "Ava Chen",
    line2: "@avachen · 12.4k followers",
  },
  "girl-students": {
    line1: "Mia Johnson",
    line2: "Grade 11 · Lincoln High",
  },
  "boy-students": {
    line1: "Noah Smith",
    line2: "Grade 10 · Jefferson High",
  },
  teachers: {
    line1: "Emma Wilson",
    line2: "Mathematics · Oakwood School",
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
  invoices: {
    line1: "INV-10482",
    line2: "$420 · paid",
  },
  brands: {
    line1: "Acme",
    line2: "acme · 128 products",
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
  tags: {
    line1: "typescript",
    line2: "142 posts",
  },
  "content-categories": {
    line1: "Tutorials",
    line2: "tutorials · 86 posts",
  },
  likes: {
    line1: "Ava liked a post",
    line2: "post · love",
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
  videos: {
    line1: "Build a dashboard in 10 minutes",
    line2: "12:40 · 84k views",
  },
  images: {
    line1: "Morning light",
    line2: "1280×720",
  },
  podcasts: {
    line1: "Code & Coffee",
    line2: "48 episodes · Tech",
  },
  playlists: {
    line1: "Deep Focus",
    line2: "32 tracks · Electronic",
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
  projects: {
    line1: "Dashboard redesign",
    line2: "in_progress · 72%",
  },
  teams: {
    line1: "Product squad",
    line2: "8 members · Engineering",
  },
  continents: {
    line1: "Europe",
    line2: "EU · 44 countries",
  },
  countries: {
    line1: "England",
    line2: "GB · London",
  },
  cities: {
    line1: "Munich",
    line2: "Germany · Bavaria",
  },
  addresses: {
    line1: "12 Hauptstraße",
    line2: "Munich, Bavaria, Germany",
  },
  regions: {
    line1: "Bavaria",
    line2: "Germany · Munich",
  },
  neighborhoods: {
    line1: "Riverside",
    line2: "Munich · Bavaria",
  },
  airports: {
    line1: "Frankfurt",
    line2: "FRA · Germany",
  },
  coordinates: {
    line1: "48.137154, 11.576124",
    line2: "Munich · Germany",
  },
};
