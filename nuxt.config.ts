import "./env/server";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  modules: [
    "@nuxt/content",
    "@nuxt/ui",
    "@nuxt/image",
    "nuxt-disqus",
    "nuxt-schema-org",
    "@nuxtjs/google-adsense",
    "@nuxtjs/sitemap",
    "nuxt-og-image"
  ],

  devServer: {
    port: 3000,
  },

  googleAdsense: {
    id: "ca-pub-6932222478244321",
    onPageLoad: false,
    pageLevelAds: false,
  },

  components: {
    dirs: [{ path: "./components", extensions: ["vue"], pathPrefix: false }],
  },

  build: {
    transpile: ["trpc-nuxt"],
  },

  nitro: {
    experimental: {
      tasks: true,
    },
  },

  devtools: {
    timeline: {
      enabled: true,
    },
  },

  disqus: {
    shortname: "ambrizalofficialsblog",
  },

  sitemap: {
    excludeAppSources: true,
    sitemaps: {
      pages: {
        urls: () => {
          return [
            {
              loc: "/",
              changefreq: "monthly",
              priority: 1,
            },
            {
              loc: "/blog",
              changefreq: "weekly",
              priority: 0.7,
            },
            {
              loc: "/project",
              changefreq: "monthly",
              priority: 1,
            },
            {
              loc: "/about",
              changefreq: "monthly",
              priority: 0.7,
            },
          ];
        },
      },
      blog: {
        sources: ["/api/__sitemap__/blog"],
      },
    },
    cacheMaxAgeSeconds: 3600,
  },

  runtimeConfig: {
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL,
      assetUrl: process.env.NUXT_PUBLIC_ASSET_URL,
    },
    port: Number(process.env.PORT ?? "3000"), // default: 3000
    rootDirectory: process.cwd(),
  },

  schemaOrg: {
    identity: "Person",
  },

  image: {
    provider: "localEnhance",
    providers: {
      localEnhance: {
        name: "localEnhance",
        provider: "~/providers/image.ts",
      },
    },
  },
});