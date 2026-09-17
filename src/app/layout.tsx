import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono, Vazirmatn } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/layout/site-header";
import { NavigationProgress } from "@/components/layout/navigation-progress";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { UiLocaleProvider } from "@/components/providers/ui-locale-provider";
import { getServerUiLocale } from "@/lib/i18n/server";
import {
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const themeInitScript = `(() => {
  try {
    const key = 'mockdata-theme';
    const stored = localStorage.getItem(key);
    const theme = stored === 'light' || stored === 'dark' ? stored : 'light';
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  } catch (_) {}
})();`;

const localeInitScript = `(() => {
  try {
    const key = 'mockdata-ui-locale';
    const stored = localStorage.getItem(key);
    const locale = stored === 'en' ? 'en' : 'fa';
    const root = document.documentElement;
    root.lang = locale === 'fa' ? 'fa' : 'en';
    root.dir = locale === 'fa' ? 'rtl' : 'ltr';
    root.classList.toggle('font-fa', locale === 'fa');
  } catch (_) {}
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialLocale = await getServerUiLocale();

  return (
    <html
      lang={initialLocale === "fa" ? "fa" : "en"}
      dir={initialLocale === "fa" ? "rtl" : "ltr"}
      className={`${plexSans.variable} ${jetbrains.variable} ${vazirmatn.variable} h-full${initialLocale === "fa" ? " font-fa" : ""}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: localeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <UiLocaleProvider initialLocale={initialLocale}>
          <ThemeProvider>
            <NavigationProgress />
            <SiteHeader />
            <main className="flex-1">{children}</main>
          </ThemeProvider>
        </UiLocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
