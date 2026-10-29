export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const siteName = "Vantro";

export const siteDescription =
  "Vantro scores every open deal in your CRM and rolls it into a revenue forecast with an honest range around it. A concept product for B2B sales teams.";

export const primaryNav = [
  { href: "/product", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
] as const;
