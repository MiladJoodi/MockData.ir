/** Localized sample content for generators (EN / FA). */

export const CONTENT = {
  productNames: {
    en: [
      "Wireless Headphones",
      "Smart Watch",
      "Ceramic Mug",
      "Desk Lamp",
      "Running Shoes",
      "Laptop Stand",
      "Water Bottle",
      "Bluetooth Speaker",
      "Backpack",
      "Mechanical Keyboard",
      "USB-C Hub",
      "Yoga Mat",
    ],
    fa: [
      "هدفون بی‌سیم",
      "ساعت هوشمند",
      "ماگ سرامیکی",
      "چراغ مطالعه",
      "کفش دویدن",
      "پایه لپ‌تاپ",
      "قمقمه آب",
      "اسپیکر بلوتوث",
      "کوله‌پشتی",
      "کیبورد مکانیکی",
      "هاب USB-C",
      "مت یوگا",
    ],
  },
  productCategories: {
    en: ["Electronics", "Home", "Fashion", "Sports", "Office", "Beauty"],
    fa: ["الکترونیک", "خانه", "مد", "ورزش", "اداری", "زیبایی"],
  },
  jobTitles: {
    en: [
      "Frontend Developer",
      "Product Designer",
      "Data Analyst",
      "Marketing Manager",
      "DevOps Engineer",
      "Customer Success",
      "Backend Developer",
      "HR Specialist",
    ],
    fa: [
      "توسعه‌دهنده فرانت‌اند",
      "طراح محصول",
      "تحلیل‌گر داده",
      "مدیر بازاریابی",
      "مهندس DevOps",
      "موفقیت مشتری",
      "توسعه‌دهنده بک‌اند",
      "کارشناس منابع انسانی",
    ],
  },
  departments: {
    en: [
      "Engineering",
      "Design",
      "Marketing",
      "Sales",
      "Operations",
      "People",
    ],
    fa: ["مهندسی", "طراحی", "بازاریابی", "فروش", "عملیات", "منابع انسانی"],
  },
  postTitles: {
    en: [
      "Designing for speed",
      "Shipping smaller diffs",
      "A practical guide to forms",
      "Why RTL still matters",
      "Mocking APIs without pain",
    ],
    fa: [
      "طراحی برای سرعت",
      "ارسال تغییرات کوچک‌تر",
      "راهنمای کاربردی فرم‌ها",
      "چرا راست‌چین هنوز مهم است",
      "ساخت API فیک بدون دردسر",
    ],
  },
  reviewComments: {
    en: [
      "Really useful and easy to use.",
      "Great quality for the price.",
      "Arrived quickly, would buy again.",
      "Solid build, minor quirks.",
      "Exactly what I needed.",
    ],
    fa: [
      "خیلی کاربردی و استفاده ازش راحت بود.",
      "کیفیت عالی نسبت به قیمت.",
      "سریع رسید، دوباره می‌خرم.",
      "ساخت محکم، ایرادهای جزئی.",
      "دقیقاً همون چیزی که لازم داشتم.",
    ],
  },
  bios: {
    en: [
      "Writes about design systems and product craft.",
      "Journalist covering technology and culture.",
      "Independent essayist and newsletter author.",
      "Technical writer focused on developer tools.",
    ],
    fa: [
      "درباره سیستم طراحی و ساخت محصول می‌نویسد.",
      "روزنامه‌نگار حوزه فناوری و فرهنگ.",
      "نویسنده مستقل و خبرنامه.",
      "نویسنده فنی با تمرکز روی ابزارهای توسعه‌دهندگان.",
    ],
  },
} as const;

export function contentList<K extends keyof typeof CONTENT>(
  key: K,
  locale: "en" | "fa",
): readonly string[] {
  return CONTENT[key][locale];
}
