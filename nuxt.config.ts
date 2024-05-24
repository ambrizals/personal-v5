import "./env/server";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  modules: ["@nuxt/content", "@nuxt/ui", "@nuxt/image", "nuxt-disqus"],

  devServer: {
    port: 3000,
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

  runtimeConfig: {
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL,
      assetUrl: process.env.NUXT_PUBLIC_ASSET_URL,
    },
    port: Number(process.env.PORT ?? "3000"), // default: 3000
    rootDirectory: process.cwd(),
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
