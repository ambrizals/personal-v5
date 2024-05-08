export default defineTask({
  meta: {
    name: "user:new",
    description: "Create a new user",
  },
  async run({ payload, context }) {
    let _payload: { username: string; password: string } | undefined;
    if (payload) {
      _payload = payload as { username: string; password: string };
    }

    if (_payload === undefined) {
      return {
        result: "Failed",
      };
    }

    const password = await makeHash(_payload.password);

    await db.insert(Users).values({ username: _payload.username, password });

    return { result: "Success" };
  },
});
