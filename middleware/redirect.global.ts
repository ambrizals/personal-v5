export default defineNuxtRouteMiddleware((to) => {
  if (to.fullPath.includes("/blog/read")) {
    const slug = to.fullPath.replaceAll("/blog/read/", "");
    return navigateTo(`/blog/${slug}`);
  }

  if (to.fullPath === "/sitemap") {
    return navigateTo("/sitemap.xml");
  }
});
