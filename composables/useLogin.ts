import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { TRPCError } from "@trpc/server";
import { useAuth } from "./useAuth";

export const useLogin = () => {
  const { $client } = useNuxtApp();
  const router = useRouter();
  const toast = useToast();
  const { setAuth } = useAuth();

  const schema = z.object({
    identity: z.string().min(4),
    password: z.string().min(4),
  });

  type Schema = z.output<typeof schema>;

  const formState = reactive<{
    identity?: string;
    password?: string;
  }>({});

  async function doLogin(event: FormSubmitEvent<Schema>) {
    try {
      const response = await $client.auth.login.mutate({
        identity: event.data.identity,
        password: event.data.password,
      });
      setAuth(response.token);
      router.replace("/dap");
    } catch (e) {
      const _err = e as TRPCError;
      toast.add({
        title: "Failed",
        description: _err.message,
      });
    }
  }

  return {
    schema,
    formState,
    doLogin,
  };
};
