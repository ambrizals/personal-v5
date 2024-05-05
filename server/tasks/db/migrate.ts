import { migrate } from "drizzle-orm/mysql2/migrator";

export default defineTask({
  meta: {
    name: "db:migrate",
    description: "Run database migrations",
  },
  async run({ payload, context }) {
    await migrate(db, {
      migrationsFolder: "./migrations",
    });
    return { result: "Success" };
  },
});
