export default defineNuxtRouteMiddleware((to) => {
  const auth = useCookie("auth");

  if (auth.value) {
    return navigateTo("/dap");
  }
});
