import type { BlogCategory } from "@/lib/blog/categories";
import type { UiLocale } from "@/lib/i18n/constants";

const CATEGORY_DESCRIPTIONS: Record<
  BlogCategory,
  Record<UiLocale, string>
> = {
  news: {
    en: "Product news and announcements from MockData.",
    fa: "اخبار محصول و اطلاعیه‌های MockData.",
  },
  "mock-data": {
    en: "Articles about mock data practices and MockData workflows.",
    fa: "مقاله‌هایی درباره دادهٔ ساختگی و جریان کار با MockData.",
  },
  json: {
    en: "JSON tips, tools, and workbench guides.",
    fa: "نکات، ابزارها و راهنماهای JSON.",
  },
  api: {
    en: "Working with mock REST APIs and MockData endpoints.",
    fa: "کار با APIهای REST ساختگی و endpointهای MockData.",
  },
  frontend: {
    en: "Frontend development notes tied to mock APIs and fixtures.",
    fa: "یادداشت‌های فرانت‌اند مرتبط با API و fixtureهای ساختگی.",
  },
};

export function blogCategoryDescription(
  category: BlogCategory,
  locale: UiLocale,
): string {
  return CATEGORY_DESCRIPTIONS[category][locale];
}
