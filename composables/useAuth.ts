export const useAuth = () => {
  const cookie = useCookie("auth");

  function setAuth(key: string) {
    cookie.value = key;
  }

  function clearAuth() {
    cookie.value = null;
  }

  return {
    cookie,
    setAuth,
    clearAuth,
  };
};
