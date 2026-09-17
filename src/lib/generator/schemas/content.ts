import { contentList } from "@/lib/generator/content";
import {
  createRng,
  fullName,
  id,
  imageUrl,
  int,
  isoDate,
  pick,
  pickN,
  slugify,
  takeFields,
} from "@/lib/generator/helpers";
import type { GeneratorTopic } from "@/lib/generator/types";
import {
  FileText,
  MessageSquare,
  MessagesSquare,
  Bell,
  Hash,
  FolderTree,
  Heart,
} from "lucide-react";

const TAGS = {
  en: ["design", "frontend", "api", "productivity", "ux", "typescript"],
  fa: ["طراحی", "فرانت‌اند", "api", "بهره‌وری", "ux", "typescript"],
};

const NOTIF_TYPES = {
  en: ["info", "success", "warning", "message", "system"] as const,
  fa: ["اطلاع", "موفق", "هشدار", "پیام", "سیستم"] as const,
};

export const contentTopics: GeneratorTopic[] = [
  {
    id: "posts",
    category: "content",
    icon: FileText,
    fields: [
      { id: "title", default: true },
      { id: "body", default: true },
      { id: "author", default: true },
      { id: "image", default: true },
      { id: "id", default: false },
      { id: "tags", default: false },
      { id: "publishedAt", default: false },
      { id: "likes", default: false },
      { id: "views", default: false },
      { id: "slug", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const title = pick(rng, contentList("postTitles", ctx.uiLocale));
      const record: Record<string, unknown> = {
        id: id("pst", ctx.index, rng),
        title,
        body:
          ctx.uiLocale === "fa"
            ? `${title}. نکاتی کاربردی برای ساخت رابط‌های بهتر با دردسر کمتر.`
            : `${title}. Practical notes for building better interfaces with less friction.`,
        author: fullName(ctx.pack, rng),
        image: imageUrl(`post-${ctx.seed}-${ctx.index}`),
        tags: pickN(rng, TAGS[ctx.uiLocale], int(rng, 1, 3)),
        publishedAt: isoDate(rng, 200),
        likes: int(rng, 0, 900),
        views: int(rng, 40, 20000),
        slug: `post-${ctx.index + 1}`,
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "comments",
    category: "content",
    icon: MessageSquare,
    fields: [
      { id: "user", default: true },
      { id: "comment", default: true },
      { id: "date", default: true },
      { id: "id", default: false },
      { id: "post", default: false },
      { id: "likes", default: false },
      { id: "replies", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const comments =
        ctx.uiLocale === "fa"
          ? [
              "خیلی کمک کرد — ممنون!",
              "کنجکاوم روی لیست‌های بزرگ چطور مقیاس می‌گیره.",
              "توضیح واضح بود، ذخیره کردم.",
              "خوشحال می‌شم ادامهٔ موارد خاص رو ببینی.",
            ]
          : [
              "This helped a lot — thanks!",
              "Curious how this scales with large lists.",
              "Clear explanation, bookmarking this.",
              "Would love a follow-up on edge cases.",
            ];
      const record: Record<string, unknown> = {
        id: id("cmt", ctx.index, rng),
        user: fullName(ctx.pack, rng),
        comment: pick(rng, comments),
        date: isoDate(rng, 90),
        post: pick(rng, contentList("postTitles", ctx.uiLocale)),
        likes: int(rng, 0, 240),
        replies: int(rng, 0, 18),
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "messages",
    category: "content",
    icon: MessagesSquare,
    fields: [
      { id: "sender", default: true },
      { id: "receiver", default: true },
      { id: "message", default: true },
      { id: "date", default: true },
      { id: "id", default: false },
      { id: "read", default: false },
      { id: "attachments", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const messages =
        ctx.uiLocale === "fa"
          ? [
              "پیش‌نویس آخر را می‌بینی؟",
              "جلسه رفت ساعت ۳.",
              "از سمت من اوکیه.",
              "فایل‌ها را کمی دیگر می‌فرستم.",
            ]
          : [
              "Can you review the latest draft?",
              "Meeting moved to 3pm.",
              "Looks good on my end.",
              "Sending the files shortly.",
            ];
      const record: Record<string, unknown> = {
        id: id("msg", ctx.index, rng),
        sender: fullName(ctx.pack, rng),
        receiver: fullName(ctx.pack, rng),
        message: pick(rng, messages),
        date: isoDate(rng, 30),
        read: rng() > 0.4,
        attachments: int(rng, 0, 3),
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "notifications",
    category: "content",
    icon: Bell,
    fields: [
      { id: "title", default: true },
      { id: "message", default: true },
      { id: "type", default: true },
      { id: "date", default: true },
      { id: "id", default: false },
      { id: "read", default: false },
      { id: "actionUrl", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const titles =
        ctx.uiLocale === "fa"
          ? [
              "کامنت جدید",
              "پرداخت دریافت شد",
              "خلاصه هفتگی",
              "هشدار امنیتی",
              "دعوت پذیرفته شد",
            ]
          : [
              "New comment",
              "Payment received",
              "Weekly digest",
              "Security alert",
              "Invite accepted",
            ];
      const title = pick(rng, titles);
      const record: Record<string, unknown> = {
        id: id("ntf", ctx.index, rng),
        title,
        message:
          ctx.uiLocale === "fa"
            ? `${title}: برای جزئیات اپ را باز کنید.`
            : `${title}: open the app to see details.`,
        type: pick(rng, NOTIF_TYPES[ctx.uiLocale]),
        date: isoDate(rng, 14),
        read: rng() > 0.5,
        actionUrl: `/notifications/${ctx.index + 1}`,
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "tags",
    category: "content",
    icon: Hash,
    fields: [
      { id: "name", default: true },
      { id: "slug", default: true },
      { id: "postsCount", default: true },
      { id: "id", default: false },
      { id: "description", default: false },
      { id: "color", default: false },
      { id: "followers", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const name = pick(rng, TAGS[ctx.uiLocale]);
      const colors = ["#2563eb", "#16a34a", "#ca8a04", "#dc2626", "#7c3aed", "#0891b2"];
      const record: Record<string, unknown> = {
        id: id("tag", ctx.index, rng),
        name,
        slug: slugify(name) || `tag-${ctx.index + 1}`,
        postsCount: int(rng, 2, 900),
        description:
          ctx.uiLocale === "fa"
            ? `محتواهای مرتبط با ${name}.`
            : `Posts tagged with ${name}.`,
        color: pick(rng, colors),
        followers: int(rng, 10, 50_000),
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "content-categories",
    category: "content",
    icon: FolderTree,
    fields: [
      { id: "name", default: true },
      { id: "slug", default: true },
      { id: "postsCount", default: true },
      { id: "id", default: false },
      { id: "description", default: false },
      { id: "parentCategory", default: false },
      { id: "image", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const names =
        ctx.uiLocale === "fa"
          ? ["آموزش", "خبر", "نقد", "راهنما", "داستان", "فناوری"]
          : ["Tutorials", "News", "Reviews", "Guides", "Stories", "Tech"];
      const name = pick(rng, names);
      const parents =
        ctx.uiLocale === "fa"
          ? ["محتوا", "وبلاگ", "مجله", null]
          : ["Content", "Blog", "Magazine", null];
      const record: Record<string, unknown> = {
        id: id("ccat", ctx.index, rng),
        name,
        slug: slugify(name) || `content-cat-${ctx.index + 1}`,
        postsCount: int(rng, 5, 400),
        description:
          ctx.uiLocale === "fa"
            ? `دسته‌بندی ${name} برای مقالات و پست‌ها.`
            : `${name} category for articles and posts.`,
        parentCategory: pick(rng, parents),
        image: imageUrl(`ccat-${ctx.index}`, 400, 240),
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "likes",
    category: "content",
    icon: Heart,
    fields: [
      { id: "user", default: true },
      { id: "target", default: true },
      { id: "targetType", default: true },
      { id: "date", default: true },
      { id: "id", default: false },
      { id: "reaction", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const targetTypes =
        ctx.uiLocale === "fa"
          ? ["پست", "کامنت", "تصویر", "ویدیو"]
          : ["post", "comment", "image", "video"];
      const reactions =
        ctx.uiLocale === "fa"
          ? ["پسند", "عاشق", "خنده", "آفرین"]
          : ["like", "love", "laugh", "clap"];
      const record: Record<string, unknown> = {
        id: id("lik", ctx.index, rng),
        user: fullName(ctx.pack, rng),
        target: pick(rng, contentList("postTitles", ctx.uiLocale)),
        targetType: pick(rng, targetTypes),
        date: isoDate(rng, 60),
        reaction: pick(rng, reactions),
      };
      return takeFields(record, fields);
    },
  },
];
