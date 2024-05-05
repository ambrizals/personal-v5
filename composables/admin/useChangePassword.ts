import type { FormSubmitEvent } from "#ui/types";
import type { TRPCError } from "@trpc/server";
import { z } from "zod";

export const useChangePassword = () => {
  const { $client } = useNuxtApp();
  const toast = useToast();

  const schema = z
    .object({
      password: z.string().min(4),
      confirmPassword: z.string().min(4),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: `Password don't matched`,
    });

  type Schema = z.output<typeof schema>;

  const formState = reactive<{
    password?: string;
    confirmPassword?: string;
  }>({});

  async function doChange(event: FormSubmitEvent<Schema>) {
    try {
      const response = await $client.account.changePassword.mutate({
        password: event.data.password,
        confirmPassword: event.data.confirmPassword,
      });
      toast.add({
        title: "Success",
        description: response.message,
      });
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
    doChange,
  };
};
