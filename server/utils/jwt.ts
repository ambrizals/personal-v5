import jwt from "jsonwebtoken";
import { env } from "~/env";

export function generateJwtToken(payload: any) {
  const token = jwt.sign(payload, env.APP_KEY, {
    expiresIn: "7d",
  });
  return token;
}

export function verifyJwtToken<T>(key: string) {
  const payload = jwt.verify(key, env.APP_KEY) as T;
  return payload;
}
