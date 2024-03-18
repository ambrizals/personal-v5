// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  modules: ["@nuxt/content", "@nuxt/ui"],
  devServer: {
    port: 3201,
  },
  components: {
    dirs: [{ path: "./components", extensions: ["vue"], pathPrefix: false }],
  },
});
