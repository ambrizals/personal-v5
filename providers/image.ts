import { joinURL } from "ufo";
import type { ProviderGetImage } from "@nuxt/image";
import { createOperationsGenerator } from "#image";

const operationsGenerator = createOperationsGenerator();

export const getImage: ProviderGetImage = (
  src,
  { modifiers = {}, baseURL } = {}
) => {
  const { public: config } = useRuntimeConfig();
  if (!baseURL) {
    // also support runtime config
    baseURL = config.assetUrl;
  }

  const operations = operationsGenerator(modifiers);

  return {
    url: joinURL(baseURL, src + (operations ? "?" + operations : "")),
  };
};
